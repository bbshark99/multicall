import { BigNumber } from "bignumber.js";

export const toShort = (
  value: BigNumber | string | number,
  decimal: BigNumber | string | number
) => {
  return new BigNumber(value)
    .dividedBy(new BigNumber(10).pow(new BigNumber(decimal)))
    .toFixed();
};
