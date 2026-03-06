/**
 * 数字转中文单位（万）
 * @param value 数值
 * @param decimal 保留小数位（默认 1 位）
 */
export function formatToWan(
  value: number | string,
  decimal = 1
): string {
  const num = Number(value);
  if (isNaN(num)) return '';

  if (num < 10000) {
    return String(num);
  }

  const result = num / 10000;

  const fixed = result.toFixed(decimal);

  // 去掉无意义的 .0
  const clean = fixed.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

  return `${clean}万`;
}
