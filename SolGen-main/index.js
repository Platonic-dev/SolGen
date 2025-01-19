const bip39 = require('bip39'); // Library for generating and handling mnemonic phrases
const bs58 = require('bs58'); // Library for Base58 encoding (used for keys)
const { Keypair } = require("@solana/web3.js"); // Solana library for creating keypairs
const crypto = require('crypto'); // Built-in Node.js library for cryptographic functions
const fs = require('fs'); // File system module to write/read files
const readlineSync = require('readline-sync'); // Library for handling user input
const colors = require('colors'); // Library to add colors to console output
const fetch = require('node-fetch'); // Library for making HTTP requests

// API Key for CoinStats API
const API_KEY = '<Your API Key>';
// A predefined test address for checking balances
const TEST_ADDRESS = '59L2oxymiQQ9Hvhh92nt8Y7nDYjsauFkdb3SybdnsG6h'; // Updated test address

// Helper function: Introduces a delay (in milliseconds) between operations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function: Makes an API call and returns the response as JSON
const fetchApi = async (url, options) => {
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(`API Error: ${error.message}`.red);
        return null;
    }
};

// Function: Checks the balance of a given public address
const checkBalance = async (publicAddress) => {
    const url = `https://openapiv1.coinstats.app/wallet/balances?address=${publicAddress}&networks=all`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-KEY': API_KEY,
        },
    };

    const data = await fetchApi(url, options);

    if (data && Array.isArray(data)) {
        return data
            .map(({ blockchain, balances }) =>
                balances.map(({ coinId, amount }) => ({ blockchain, coinId, amount }))
            )
            .flat()
            .filter(({ amount }) => amount > 0); // Return only balances > 0
    }

    return [];
};

// Function: Checks the predefined test address balance
const checkTestAddressBalance = async () => {
    console.log(`Checking balance for test address: ${TEST_ADDRESS}`.cyan);

    const balances = await checkBalance(TEST_ADDRESS);

    if (balances.length > 0) {
        console.log(`Test address has balances:`.green);
        balances.forEach(({ blockchain, coinId, amount }) => {
            console.log(`- Blockchain: ${blockchain}, Coin ID: ${coinId}, Amount: ${amount}`.yellow);
        });

        fs.appendFileSync(
            'results.txt',
            `Test Address:\nPublic Address: ${TEST_ADDRESS}\nBalances:\n` +
            balances
                .map(({ blockchain, coinId, amount }) => `- Blockchain: ${blockchain}, Coin ID: ${coinId}, Amount: ${amount}`)
                .join('\n') +
            '\n\n'
        );

        return true; // Balance exists
    } else {
        console.log(`Test address has no balance?? Check if API Key is correct`.red.bold);
        return false;
    }
};

// Function: Generate wallets, check balances, and log results
const generateAndCheckWallets = async () => {
    const isTestAddressValid = await checkTestAddressBalance();
    if (!isTestAddressValid) return; // Stop if test address check fails

    const numWallets = readlineSync.questionInt('Enter the number of wallets to generate and check (0 to go back): '.cyan);
    if (numWallets === 0) return; // Exit if user chooses 0

    console.log(`Generating and checking ${numWallets} wallets...\n`.cyan);

    let totalAddressesChecked = 0;
    let totalAddressesWithBalance = 0;

    for (let i = 1; i <= numWallets; i++) {
        console.log(`Processing wallet ${i} of ${numWallets}...`.cyan);

        // Generate wallet
        const mnemonic = bip39.generateMnemonic();
        const entropy = bip39.mnemonicToEntropy(mnemonic);
        const seed = crypto.createHash('sha256').update(entropy).digest();
        const derivedKeyPair = Keypair.fromSeed(seed);
        const publicKey = derivedKeyPair.publicKey.toBase58();
        const privateKey = bs58.encode(derivedKeyPair.secretKey);

        console.log(`Generated Wallet:`.bold.green);
        console.log(`- Mnemonic Phrase: ${mnemonic}`.blue);
        console.log(`- Public Address: ${publicKey}`.blue);
        console.log(`- Private Key: ${privateKey}`.blue);

        // Check balance
        console.log(`Checking balance for wallet ${i}...`.cyan);
        const balances = await checkBalance(publicKey);

        if (balances.length > 0) {
            console.log(`Wallet ${i} has balances:`.green);
            balances.forEach(({ blockchain, coinId, amount }) => {
                console.log(`- Blockchain: ${blockchain}, Coin ID: ${coinId}, Amount: ${amount}`.yellow);
            });

            fs.appendFileSync(
                'results.txt',
                `Wallet ${i}:\nMnemonic: ${mnemonic}\nPublic Address: ${publicKey}\nPrivate Key: ${privateKey}\nBalances:\n` +
                balances
                    .map(({ blockchain, coinId, amount }) => `- Blockchain: ${blockchain}, Coin ID: ${coinId}, Amount: ${amount}`)
                    .join('\n') +
                '\n\n'
            );
            totalAddressesWithBalance++;
        } else {
            console.log(`Wallet ${i} has no balance.`.yellow);
        }

        totalAddressesChecked++;
        await delay(500); // Avoid hitting API rate limits
    }

    // Summary
    console.log(`\nSummary:`.bold);
    console.log(`Total wallets checked: ${totalAddressesChecked}`.cyan);
    console.log(`Wallets with balance: ${totalAddressesWithBalance}`.green);

    readlineSync.question('\nPress Enter to return to the main menu...'.cyan);
};

// Function: List all wallets (blockchains)
const listAllWallets = async () => {
    console.log(`Fetching available wallets...\n`.cyan);

    const url = 'https://openapiv1.coinstats.app/wallet/blockchains';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-KEY': API_KEY,
        },
    };

    const wallets = await fetchApi(url, options);

    if (Array.isArray(wallets) && wallets.length > 0) {
        console.log(`Available Blockchains:`.bold.underline.green);
        wallets.forEach(({ name, chain, connectionId, icon }, index) => {
            console.log(
                `${index + 1}. ${name} (${chain})`.bold +
                `\n   Connection ID: ${connectionId}` +
                `\n   Icon: ${icon}\n`
            );
        });
    } else {
        console.log(`No blockchains found.`.red);
    }

    readlineSync.question('\nPress Enter to return to the main menu...'.cyan);
};

// Function: Get full wallet information
const getFullWalletInformation = async () => {
    const address = readlineSync.question('Enter the wallet address to fetch information for: '.cyan);

    const url = `https://openapiv1.coinstats.app/wallet/balances?address=${address}&networks=all`;
    const data = await fetchApi(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-KEY': API_KEY,
        },
    });

    if (Array.isArray(data) && data.length > 0) {
        console.log(`\nFull Wallet Information:`.bold.underline.green);
        data.forEach(({ blockchain, balances }) => {
            console.log(`Blockchain: ${blockchain}`.bold);
            balances.forEach(({ coinId, amount }) => {
                console.log(`  Coin ID: ${coinId}`.yellow);
                console.log(`  Amount: ${amount}`.yellow);
            });
            console.log(); // Empty line for better readability
        });
    } else {
        console.log(`No balances found for the provided wallet address.`.red);
    }

    readlineSync.question('\nPress Enter to return to the main menu...'.cyan);
};

// Main menu
const mainMenu = async () => {
    console.clear();
    console.log(`Welcome to SolGen!`.bold.blue);

    let exitProgram = false;

    while (!exitProgram) {
        console.log(`Select an option:`.bold);
        console.log(`1. Generate wallets and check balances`.cyan);
        console.log(`2. List all wallets (blockchains)`.cyan);
        console.log(`3. Get full wallet information`.cyan);
        console.log(`4. Exit`.cyan);

        const choice = readlineSync.questionInt('Enter your choice (1-4): '.cyan);

        switch (choice) {
            case 1:
                await generateAndCheckWallets();
                break;
            case 2:
                await listAllWallets();
                break;
            case 3:
                await getFullWalletInformation();
                break;
            case 4:
                console.log(`Thank you for using SolGen!`.bold.green);
                console.log(`Have a great day! 😊`.cyan);
                exitProgram = true;
                break;
            default:
                console.log(`Invalid choice. Please try again.`.red);
                break;
        }
    }
};

// Run the program
mainMenu().catch((error) => {
    console.error(`An unexpected error occurred: ${error.message}`.red);
});
