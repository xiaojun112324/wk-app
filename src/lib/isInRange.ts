import BigNumber from "bignumber.js";

export function isInRange(
  value: string | number,
  min: string | number,
  max: string | number
) {
  const V = new BigNumber(value);
  const Min = new BigNumber(min);
  const Max = new BigNumber(max);

  return (
    V.isGreaterThanOrEqualTo(Min) &&
    V.isLessThanOrEqualTo(Max)
  );
}
