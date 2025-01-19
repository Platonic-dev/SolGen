
# 🌟 SolGen Wallet Generator 🌟

SolGen is a powerful and user-friendly tool for generating Solana wallets, checking balances, and interacting with the CoinStats API to handle blockchain-related information. SolGen is inspired by the outstanding work of dante4rt's SPL-wallet-generator and builds upon it with additional features and enhancements.


# 🤓 Context

The Improbability of Generating an Active Cryptocurrency Wallet

Cryptocurrency wallets rely on private keys, which are generated using extremely large numbers to ensure security. The private key space is based on a 256-bit number, offering 2²⁵⁶ possible combinations—approximately 1.16 x 10⁷⁷. To put this into perspective, this is vastly larger than the number of atoms in the observable universe.

To “guess” or generate an active wallet with a balance, one would not only need to randomly select a valid private key but also stumble upon a wallet that has received funds. Given the massive keyspace and the relatively small number of wallets in use, the chances are astronomically low. Even with the fastest computers, it would take longer than the age of the universe to have a realistic chance of success. This immense improbability is what makes cryptocurrencies secure by design.

But if you in some way manage to break these astronomically small odds a tip would be greatly appriciated:

Sol: GYMQAxafvpBX7msKFjwVUBGphYbo7KZyJjaRxvEdxDrL

# 🔥 Features

Generate Wallets and Check Balances

Generate multiple Solana wallets and check the balance for each.
Save wallets with a balance greater than 0 into results.txt, including Mnemonic Phrase and Private Key.
List All Wallets (Blockchains)

Fetch and display all blockchains supported by the CoinStats API, including names, chain IDs, and associated icons.
Get Full Wallet Information

Input a public wallet address and retrieve detailed balance information for every blockchain and coin via the CoinStats API.

## 🛠️ Installation

Clone the repository:

git clone https://github.com/Platonic-dev/SolGen.git


cd SolGen

Install dependencies: 
cd SolGen

npm install
## 🚀 Usage
Start the program:

node index.js

Follow the interactive menu:

1: Generate wallets and check balances.

2: List all blockchains supported by the CoinStats API.

3: Get full balance information for a specific wallet address.

4: Exit the program.
## 📂 Output Files

results.txt
All generated wallets with a balance greater than 0 are saved in this file. Includes Mnemonic Phrase, Private Key, and balance information.
## ⚡ Example Output

🤑 Wallet with Balance

Wallet 1:

Mnemonic: seed phrase here

Public Address: A1b2C3d4E5f6G7H8I9J0K

Private Key: L1m2N3o4P5q6R7s8T9U0V

Balances:

Blockchain: Solana, Coin ID: solana, Amount: 1.23

🌍  List of Blockchains

 BNB Smart Chain (binance_smart)
   Connection ID: binancesmartchain
   Icon: https://static.coinstats.app/portfolio_images/binacesmartchain.png

 Doge (dogecoin)
   Connection ID: doge-wallet
   Icon: https://static.coinstats.app/portfolio_images/doge-wallet.png
## 📋 Important Notes

API Key: You must register at https://openapi.coinstats.app/ to obtain an API key. Replace <Your API Key> in the code with your personal API key.

Rate Limits: The CoinStats API may impose rate limits, so avoid generating too many wallets at once.
## ✨ Based On

This project is based on the amazing work of https://github.com/dante4rt/SPL-wallet-generator Huge thanks to the original creator for the inspiration!


## 🖼️ Enhancements and Features

Multi-wallet generator: Generate multiple wallets and save them with Mnemonic, Private Key, and balance.

Integration with CoinStats API: Fetch and display blockchain balances and metadata.

Menu-driven interface: User-friendly menu for navigating between features.

Test address validation: Check a predefined test address before generating wallets to ensure the API key is functioning correctly.
