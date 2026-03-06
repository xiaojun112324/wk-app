// 订单状态映射
// i18n key 版本
export const ORDER_STATE_MAP: Record<string, string> = {
    '0': 'order.pendingPayment',
    '2': 'order.pendingShipment',
    '3': 'order.pendingReceive',
    '4': 'order.pendingReview',
    '5': 'order.refund',
}

export const REFUND_STATE_MAP: Record<string, string> = {
    '0': 'refund.pending',
    '1': 'refund.success',
    '2': 'refund.failed',
}
