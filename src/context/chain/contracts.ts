import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";

import { CONTRACT_ADDRESSES } from "./address";
import MulticallABI from "../../abis/Multicall.json";

export const getMulticallContract = (
  library: JsonRpcProvider,
  chainId: number | string
) => new Contract(CONTRACT_ADDRESSES.multicall[chainId], MulticallABI, library);
