# FundChain — Smart Contract Crowdfunding Platform

A decentralized crowdfunding platform built on Ethereum blockchain.

## Tech Stack
- Solidity (Smart Contract)
- Hardhat (Local Blockchain)
- React.js + Vite (Frontend)
- Ethers.js (Blockchain Connection)
- MetaMask (Wallet)

## How to Run

### 1. Start Blockchain
cd blockchain
npm install
npx hardhat node

### 2. Deploy Contract
npx hardhat run scripts/deploy.js --network localhost

### 3. Start Frontend
cd frontend
npm install
npm run dev

### 4. Open Browser
Open Brave → http://127.0.0.1:5173
Connect MetaMask to Hardhat Local (Chain ID: 31337)