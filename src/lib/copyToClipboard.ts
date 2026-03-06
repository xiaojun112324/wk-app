/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<void>，复制成功或失败
 */
export async function copyToClipboard(text: string): Promise<void> {
    if (!navigator.clipboard) {
        // 兼容性处理：使用老的 execCommand
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // 防止页面滚动
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                return Promise.reject(new Error('复制失败'));
            }
        } catch (err) {
            return Promise.reject(err);
        } finally {
            document.body.removeChild(textarea);
        }
        return Promise.resolve();
    }

    // 使用现代的异步 Clipboard API
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        return Promise.reject(err);
    }
}
