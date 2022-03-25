export type IAddress = {
  [key: string]: string;
};

export type IContract = {
  [key: string]: IAddress;
};

export const CONTRACT_ADDRESSES: IContract = {
  link: {
    1: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  usdt: {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  dai: {
    1: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  multicall: {
    1: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  },
};
