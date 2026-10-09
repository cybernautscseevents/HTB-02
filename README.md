# MedTrace

### Blockchain-Based Anti-Counterfeit Medicine Supply Chain Tracker

MedTrace is a blockchain-backed medicine supply-chain tracking and verification platform designed to help prevent counterfeit, expired, and recalled medicines from reaching patients.

The system tracks medicine batches from the manufacturer through distributors and pharmacies, while allowing users to verify a medicine's authenticity and status using a QR code.

---

## 🚨 Problem

Counterfeit and compromised medicines can enter legitimate supply chains, putting patients at risk.

Traditional supply-chain systems can make it difficult to provide a transparent and tamper-resistant history of a medicine batch across multiple parties.

Patients also have limited ways to independently verify whether a medicine is:

- Registered
- Authentic
- Expired
- Recalled
- Unregistered

---

## 💡 Solution

MedTrace creates a blockchain-backed digital record for each medicine batch.

Authorized participants can register and transfer batches through the supply chain, while users can scan a QR code to verify the batch.

### Supply Chain Flow

```text
Manufacturer
     │
     │ Register Batch
     ▼
 Blockchain
     │
     │ Transfer
     ▼
 Distributor
     │
     │ Transfer
     ▼
 Pharmacy
     │
     │ QR Code
     ▼
 Patient / User
     │
     │ Scan & Verify
     ▼
 Verification System
     │
     ▼
 Blockchain
     │
     ├── ✅ Authentic
     ├── ⚠️ Expired
     ├── 🚨 Recalled
     └── ❌ Unregistered
## 🚀 Getting Started

### Prerequisites

Install the following tools before running MedTrace:

- Node.js and npm
- pnpm
- Git

### Repository Structure

```text
med-trace/
├── backend/       # REST API and blockchain integration
├── blockchain/    # Solidity smart contract and Hardhat tests
├── frontend/      # Web interface and QR verification
├── .gitignore
└── README.md      # Main project guide
```

### 1. Clone the Repository

```bash
git clone https://github.com/nandan56425/med-trace.git
cd med-trace
```

### 2. Install Dependencies

Install each component separately:

**Blockchain**
```bash
cd blockchain
pnpm install
```

**Backend** — open another terminal at the repository root:
```bash
cd backend
npm install
```

**Frontend** — open another terminal at the repository root:
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create local environment files according to the variables required by each component. Never commit `.env` files, private keys, or RPC provider secrets.

Use the blockchain deployment guide and backend configuration as references for the required settings.

### 4. Run the Application

Start each component in a separate terminal.

**Blockchain tests**
```bash
cd blockchain
pnpm test
```

**Backend**
```bash
cd backend
npm start
```

**Frontend development server**
```bash
cd frontend
npm run dev
```

Follow the frontend terminal output to open the local development URL.

### 5. Blockchain Deployment

MedTrace's smart contract is deployed to Ethereum Sepolia.

See [Blockchain Deployment Guide](./blockchain/DEPLOYMENT.md) for deployment and configuration details.

### 6. Project Documentation

- [Blockchain source and tests](./blockchain)
- [Backend API and integration](./backend)
- [Frontend application](./frontend)
- [Deployment guide](./blockchain/DEPLOYMENT.md)

### Security Notice

Never commit private keys, seed phrases, API secrets, or production credentials. Use local environment variables and keep them out of version control.
