/**
 * 获取或生成 chatUserId
 * 如果本地没有，则生成一个新的并保存到 localStorage
 * @returns string chatUserId
 */
export function getChatUserId(): string {
    const key = 'chatUserId';
    let userId = localStorage.getItem(key);

    if (!userId) {
        userId = Date.now().toString();
        localStorage.setItem(key, userId);
    }

    return userId;
}
