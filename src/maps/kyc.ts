/**
 * KYC 状态常量
 * 0 待认证
 * 1 待审核
 * 2 认证成功
 * 3 驳回
 */
export const KYC_STATUS = {
    PENDING: 0,
    REVIEWING: 1,
    APPROVED: 2,
    REJECTED: 3,
} as const;

/**
 * KYC 状态值类型：0 | 1 | 2 | 3
 */
export type KYCStatus =
    typeof KYC_STATUS[keyof typeof KYC_STATUS];

/**
 * KYC 状态文案映射
 */
const KYC_STATUS_TEXT: Record<KYCStatus, string> = {
    [KYC_STATUS.PENDING]: '待认证',
    [KYC_STATUS.REVIEWING]: '待审核',
    [KYC_STATUS.APPROVED]: '认证成功',
    [KYC_STATUS.REJECTED]: '驳回',
};

/**
 * 根据状态值获取对应文案
 * @param status 后端返回的状态值
 */
export function getKYCStatusText(
    status?: number | null
): string {
    if (status === undefined || status === null) {
        return '';
    }

    return KYC_STATUS_TEXT[status as KYCStatus] ?? '';
}
