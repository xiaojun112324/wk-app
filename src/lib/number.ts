

export const formatWithThousandSeparator = (amount:any) => {
    // 确保输入的是数字
    if (isNaN(amount)) {
        return '';
    }

    // 将金额转换为字符串并使用正则表达式添加千位分隔符
    const parts = amount.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 添加千位分隔符

    // 返回格式化后的金额字符串
    return parts.join('.');
}