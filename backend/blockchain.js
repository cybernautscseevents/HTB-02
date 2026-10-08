
require("dotenv").config();

const { ethers } = require("ethers");
const contractABI = require("./DrugSupplyChain.json").abi;

const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL || !RPC_URL.startsWith("https://")) {
  throw new Error("Please configure a valid HTTPS RPC_URL in backend/.env.");
}

if (!CONTRACT_ADDRESS || !ethers.isAddress(CONTRACT_ADDRESS)) {
  throw new Error(
    "Please configure a valid CONTRACT_ADDRESS in backend/.env."
  );
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Read-only contract: does not require a wallet or private key.
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  provider
);

// Optional signer for transaction-writing features.
const isPlaceholder =
  !PRIVATE_KEY ||
  PRIVATE_KEY.includes("REPLACE_WITH") ||
  PRIVATE_KEY.includes("YOUR_TEST_WALLET_PRIVATE_KEY");

let wallet = null;
let contractWithSigner = null;

if (!isPlaceholder) {
  if (!ethers.isHexString(PRIVATE_KEY, 32)) {
    throw new Error("PRIVATE_KEY must be a valid 32-byte hexadecimal key.");
  }

  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  contractWithSigner = contract.connect(wallet);

  console.log("Backend signer configured:", wallet.address);
} else {
  console.log("Read-only mode: no wallet private key configured.");
}

console.log("Blockchain provider initialized");
console.log("Network: Ethereum Sepolia");
console.log("Contract:", CONTRACT_ADDRESS);

module.exports = {
  provider,
  contract,
  contractWithSigner,
  wallet,
};