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
