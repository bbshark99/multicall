import React, { createContext, useContext, useState, useEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import {
  RPC_URLS,
  DECIMALS_ABI,
  BALANCE_OF_ABI,
  SUPPORTED_TOKENS,
  DEFAULT_CHAIN_ID,
} from "../../config/constants";
import { CONTRACT_ADDRESSES } from "./address";
import { getMulticallContract } from "./contracts";
import { toShort } from "../../utils/math";
import { ICall, multicall } from "../../utils/muticall";

export type TBalances = {
  [key: string]: string;
};

export type IChainState = {
  balances: TBalances;
  chainId: number;
  error: string;
  loadingBalances: boolean;
  fetchBalances: Function;
};

const initialState: IChainState = {
  balances: {},
  chainId: DEFAULT_CHAIN_ID,
  error: "",
  loadingBalances: false,
  fetchBalances: () => {},
};

export const ChainContext = createContext<IChainState>(initialState);

export const useChain = () => useContext<IChainState>(ChainContext);

export interface IChain {
  children?: React.ReactElement;
}

export const ChainProvider: React.FC<IChain> = ({ children }: IChain) => {
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false);
  const [balances, setBalances] = useState<TBalances>({});
  const [chainId] = useState<number>(DEFAULT_CHAIN_ID);
  const [contract, setContract] = useState<Contract>();
  const [error, setError] = useState<string>("");

  const fetchBalances = async (address: string) => {
    if (!contract) return;

    setBalances({});
    setLoadingBalances(true);

    try {
      const calls: ICall[] = [];
      const abis = [];
      for (const token of SUPPORTED_TOKENS) {
        calls.push({
          contractAddress: CONTRACT_ADDRESSES[token][chainId],
          functionName: "balanceOf",
          params: [address],
        });
        calls.push({
          contractAddress: CONTRACT_ADDRESSES[token][chainId],
          functionName: "decimals",
          params: [],
        });
        abis.push(BALANCE_OF_ABI);
        abis.push(DECIMALS_ABI);
      }

      const result = await multicall(contract, abis, calls);
      const data: TBalances = {};
      for (let i = 0; i < result.length / 2; i++) {
        data[SUPPORTED_TOKENS[i]] = toShort(
          result[i * 2].toString(),
          result[i * 2 + 1].toString()
        );
      }

      setError("");
      setBalances(data);
    } catch (error: any) {
      setError(error.message);
    }

    setLoadingBalances(false);
  };

  useEffect(() => {
    const provider = new JsonRpcProvider(RPC_URLS[chainId]);
    setContract(getMulticallContract(provider, chainId));
  }, [chainId]);

  return (
    <ChainContext.Provider
      value={{
        chainId,
        balances,
        error,
        loadingBalances,
        fetchBalances,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
