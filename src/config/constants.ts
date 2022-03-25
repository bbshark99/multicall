export const DEFAULT_CHAIN_ID = 1;

export const SUPPORTED_TOKENS: string[] = ["link", "usdt", "dai"];

export type IRPC = {
  [key: number]: string;
};

export const RPC_URLS: IRPC = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
};

export const DECIMALS_ABI = {
  constant: true,
  inputs: [],
  name: "decimals",
  outputs: [
    {
      internalType: "uint8",
      name: "",
      type: "uint8",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};

export const BALANCE_OF_ABI = {
  constant: true,
  inputs: [
    {
      internalType: "address",
      name: "account",
      type: "address",
    },
  ],
  name: "balanceOf",
  outputs: [
    {
      internalType: "uint256",
      name: "",
      type: "uint256",
    },
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
};
