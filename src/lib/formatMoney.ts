/**
 * 金钱格式化：整数加逗号，小数支持小数位控制（向下取整）、<small> 标签、前缀和后缀
 *
 * @param input - 金额
 * @param options - 配置项
 * @param options.fixed - 保留的小数位数
 * @param options.useSmallTag - 是否用 <small> 包裹小数部分
 * @param options.prefix - 添加在金额前的符号
 * @param options.suffix - 添加在金额后的单位
 * @returns 格式化后的字符串
 */
export interface FormatMoneyOptions {
  fixed?: number;
  useSmallTag?: boolean;
  prefix?: string;
  suffix?: string;
}

export function formatMoney(
  input: number | string | null | undefined,
  options: FormatMoneyOptions = {}
): string {
  const {
    fixed = 2,
    useSmallTag = false,
    prefix = '¥ ',
    suffix = '',
  } = options;

  if (input === null || input === undefined || input === '') return '';

  const num = Number(input);
  if (Number.isNaN(num)) return '';

  let intPart: string;
  let decimalPart: string | undefined;

  if (typeof fixed === 'number') {
    // 向下取整到指定小数位
    const factor = Math.pow(10, fixed);
    const floored = Math.floor(num * factor) / factor;

    const parts = floored.toString().split('.');
    intPart = parts[0];
    decimalPart = parts[1] ?? '';

    while (decimalPart.length < fixed) {
      decimalPart += '0';
    }
  } else {
    const parts = num.toString().split('.');
    intPart = parts[0];
    decimalPart = parts[1];
  }

  // 千分位
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const result =
    decimalPart && decimalPart.length > 0
      ? useSmallTag
        ? `${intPart}<small>.${decimalPart}</small>`
        : `${intPart}.${decimalPart}`
      : intPart;

  return `${prefix}${result}${suffix}`;
}

// 示例
/*
formatMoney(1234.567); 
// "$ 1,234.56"

formatMoney(1234.5, { useSmallTag: true }); 
// "$ 1,234<small>.50</small>"

formatMoney(1234567.89, { fixed: 0, prefix: '¥' }); 
// "¥1,234,567"
*/
