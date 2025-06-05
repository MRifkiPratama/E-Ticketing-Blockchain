
# 🎟️ TicketGo - Decentralized Movie E-Ticketing DApp

TicketGo is a decentralized movie ticketing platform built with Ethereum smart contracts. It allows users to select movies, choose showtimes and seats, and securely purchase and verify tickets using MetaMask.

## 🚀 Features

- 🎬 **Movie Selection** – Browse and choose from available movies.
- 🕒 **Showtime Selection** – Pick your preferred showtime.
- 💺 **Seat Booking** – View seat layout and reserve seats.
- 💳 **Decentralized Payment** – Buy tickets using your Ethereum wallet (MetaMask).
- ✅ **On-chain Verification** – Validate ticket ownership and booking details.
- 🔒 **Secure & Transparent** – Powered by smart contracts and blockchain.

## 🛠️ Tech Stack

- **Smart Contract:** Solidity
- **Development Environment:** Hardhat
- **Frontend:** React.js
- **Wallet Integration:** MetaMask
- **Blockchain:** Ethereum (local network / testnet)

## 🧱 Smart Contract Overview

```solidity
function buyTicket(uint _movieId, uint _showtimeId, uint _seatId) public payable;
function verifyTicket(address _user, uint _movieId, uint _showtimeId, uint _seatId) public view returns (bool);
function getAvailableSeats(uint _movieId, uint _showtimeId) public view returns (bool[] memory);
```

## 📦 Installation

1. **Clone the Repository**

```bash
git https://github.com/MRifkiPratama/E-Ticketing-Blockchain
cd backend
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start Hardhat Node**

```bash
npx hardhat node
```

4. **Deploy Contracts**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. **Run Frontend**

```bash
cd frontend
npm start
```

6. **Connect MetaMask**

- Use `http://localhost:8545` as the custom RPC.
- Import an account using a private key from Hardhat (with test ETH).



## 🧪 Testing

```bash
npx hardhat test
```

## 📜 License

MIT License

---

Muhammad Rifki Pratama (2206828903)
