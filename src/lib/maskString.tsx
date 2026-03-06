/**
 * 隐藏字符串中间部分
 * @param str 要隐藏的原始字符串
 * @param front 保留前面字符数
 * @param back 保留后面字符数
 * @param mask 替换用的符号，默认是 '*'
 * @returns 处理后的字符串
 */
export function maskString(
    str: string,
    front: number = 2,
    back: number = 2,
    mask: string = '*'
): string {
    if (!str) return '';

    const len = str.length;

    // 如果长度小于4，中间只隐藏1个字符
    if (len <=4) {
        if (len <= 1) return mask; // 长度1直接返回*
        const mid = Math.floor(len / 2);
        return str.slice(0, mid) + mask + str.slice(mid + 1);
    }

    // 如果前后保留位数超出长度，不做处理
    if (front + back >= len) return str;

    const masked = mask.repeat(len - front - back);
    return str.slice(0, front) + masked + str.slice(len - back);
}
