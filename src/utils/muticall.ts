import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";

export interface ICall {
  contractAddress: string;
  functionName: string;
  params?: any[];
}

/**
 * Takes an array of any length and separates the values into separate arrays of the length provided.
 *
 * @param arr Array of values to chunk
 * @param len Max length to max each chunk (the final array will likely be lower than this len)
 * @returns any[][]
 */
function chunkArray<T>(arr: T[], len: number): T[][] {
  const chunks = [];
  const n = arr.length;
  let i = 0;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

/**
 * Batch multiple calls to contracts with the same abi to reduce rpc calls and increase response time.
 *
 * @param multicallContract The Multicall contract
 * @param abi abi generated from the contract code
 * @param calls Array of Call objects to run through multicall
 * @param maxCallsPerTx (default 1000) limit the number of calls per multicall call
 * @returns Array of array of return values from each call. Index 0 is the first return value and so on.
 */
export async function multicall(
  multicallContract: Contract,
  abi: any[],
  calls: ICall[],
  maxCallsPerTx = 1000
) {
  // Setup contracts
  const itf = new Interface(abi);

  // Chunk calls to prevent RPC overflow
  const chunkedCalls = chunkArray(calls, maxCallsPerTx);

  // Process calls
  let finalData: any[] = [];
  for (const currentCalls of chunkedCalls) {
    const calldata = currentCalls.map((call) => [
      call.contractAddress.toLowerCase(),
      itf.encodeFunctionData(call.functionName, call.params),
    ]);

    const { returnData } = await multicallContract.callStatic.aggregate(
      calldata
    );
    const res = returnData.map((data: any, i: number) =>
      itf.decodeFunctionResult(currentCalls[i].functionName, data)
    );

    finalData = [...finalData, ...res];
  }

  return finalData;
}
