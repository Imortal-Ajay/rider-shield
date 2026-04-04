import { ethers, Contract, Signer } from 'ethers';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export const CONTRACT_ABI = [
  { "inputs": [{ "internalType": "address", "name": "_oracle", "type": "address" }], "name": "addOracle", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "claimPayout", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_zone", "type": "string" }], "name": "enrollRider", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "rider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "payout", "type": "uint256" }], "name": "ClaimProcessed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bytes32", "name": "zone", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "payoutHours", "type": "uint256" }], "name": "EventFinalized", "type": "event" },
  { "inputs": [], "name": "executeWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "fund", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "riderAddr", "type": "address" }, { "internalType": "uint256", "name": "penalty", "type": "uint256" }, { "internalType": "string", "name": "reason", "type": "string" }], "name": "penalize", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_oracle", "type": "address" }], "name": "removeOracle", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "requestWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "riderAddr", "type": "address" }], "name": "resetWeekly", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "rider", "type": "address" }, { "indexed": false, "internalType": "bytes32", "name": "zone", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "premium", "type": "uint256" }], "name": "RiderEnrolled", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "rider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "penalty", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }], "name": "TrustPenalized", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "rider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "trust", "type": "uint256" }], "name": "TrustUpdated", "type": "event" },
  { "inputs": [{ "internalType": "string", "name": "eventType", "type": "string" }, { "internalType": "string", "name": "zone", "type": "string" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "voteEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawExecuted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawRequested", "type": "event" },
  { "stateMutability": "payable", "type": "receive" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "activeEvents", "outputs": [{ "internalType": "bool", "name": "isActive", "type": "bool" }, { "internalType": "uint256", "name": "payoutPerEvent", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "CLAIM_COOLDOWN", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "EVENT_EXPIRY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "eventVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "zone", "type": "bytes32" }], "name": "getEvent", "outputs": [{ "components": [{ "internalType": "bool", "name": "isActive", "type": "bool" }, { "internalType": "uint256", "name": "payoutPerEvent", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct InsureDrive.EventData", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "getRider", "outputs": [{ "components": [{ "internalType": "bool", "name": "isEnrolled", "type": "bool" }, { "internalType": "uint256", "name": "weeklyPremium", "type": "uint256" }, { "internalType": "uint256", "name": "coverageHours", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimed", "type": "uint256" }, { "internalType": "uint256", "name": "lastClaimTime", "type": "uint256" }, { "internalType": "uint256", "name": "trustScore", "type": "uint256" }, { "internalType": "bytes32", "name": "zone", "type": "bytes32" }], "internalType": "struct InsureDrive.Rider", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "hasVoted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastEventClaimed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastReset", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MAX_TRUST", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MAX_WEEKLY_HOURS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MIN_ORACLE_VOTES", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MIN_PREMIUM", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MIN_TRUST", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "oracles", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "PAY_PER_HOUR", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "riders", "outputs": [{ "internalType": "bool", "name": "isEnrolled", "type": "bool" }, { "internalType": "uint256", "name": "weeklyPremium", "type": "uint256" }, { "internalType": "uint256", "name": "coverageHours", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimed", "type": "uint256" }, { "internalType": "uint256", "name": "lastClaimTime", "type": "uint256" }, { "internalType": "uint256", "name": "trustScore", "type": "uint256" }, { "internalType": "bytes32", "name": "zone", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalPayouts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalPremiums", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "withdrawAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "withdrawRequestTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

export function getContract(signer: Signer): Contract {
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Converts a zone name string to bytes32 matching Solidity's
 * keccak256(abi.encodePacked(_zone))
 */
export function encodeZone(zone: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(zone));
}

export const ZONES = ['Anna Nagar', 'T Nagar', 'Velachery', 'Marina Beach', 'Tambaram'] as const;
export type Zone = typeof ZONES[number];

export const ZONE_RISK: Record<Zone, { modifier: number; level: 'Low' | 'Medium' | 'High' | 'Severe' }> = {
  'Anna Nagar':   { modifier: -10, level: 'Low' },
  'T Nagar':      { modifier: 0,   level: 'Medium' },
  'Velachery':    { modifier: 15,  level: 'High' },
  'Marina Beach': { modifier: 25,  level: 'Severe' },
  'Tambaram':     { modifier: -5,  level: 'Low' },
};

export const ENROLL_PREMIUM_ETH = '0.01';
