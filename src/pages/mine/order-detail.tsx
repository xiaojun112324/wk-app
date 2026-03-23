import { Link, useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/useQuery'
import { apiOrder } from '@/apis/order'
import LoadingOrEmpty from '@/components/LoadingOrEmpty'
import { ORDER_STATE_MAP, REFUND_STATE_MAP } from '@/maps'
import { useTranslation } from 'react-i18next'
import BigNumber from "bignumber.js";
import { formatDate } from '@/lib/format-time'
import { useRefreshOnLanguageChange } from '@/hooks/useRefreshOnLanguageChange'
import { FinanceCardSkeleton, FinanceListSkeleton } from "@/components/finance-skeleton"

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation();
    const [payment, setPayment] = useState('visa')

    const { data: orderData, loading, refresh } = useQuery({
        fetcher: (params) => apiOrder.selectOrderDetail(params),
        immediate: true,
        params: { orderId: id },
    })
    useRefreshOnLanguageChange(() => {
        refresh();
    });

    const totalAmount = useMemo(() => {
        if (!orderData?.orderDetailList) return new BigNumber(0)

        return orderData.orderDetailList.reduce((sum: BigNumber, item: any) => {
            const price = new BigNumber(item.totalPrice || 0)
            return sum.plus(price)
        }, new BigNumber(0))
    }, [orderData])

    return (
        <div className="">
            <div className="px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-5">
                    <h2 className="text-xl font-semibold">
                        <Link to="/mine/orders" className="hover:underline">
                            {t('OrderDetail.myOrders')}
                        </Link>
                        /{t('OrderDetail.orderInfo')}
                    </h2>
                </div>

                {loading ? (
                    <>
                        <FinanceCardSkeleton lines={5} />
                        <FinanceListSkeleton rows={2} />
                    </>
                ) : null}

                <LoadingOrEmpty loading={false} data={orderData?.orderDetailList} />

                {!loading && orderData ? (
                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        {/* 左侧信息区 */}
                        <div>
                            <div className="max-w-2xl mx-auto  rounded-2xl">
                                {/* 订单信息 */}
                                <section className="mb-8">
                                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-5">
                                        <h2 className="text-xl font-semibold">{t('OrderDetail.orderInfo')}</h2>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li>{t('OrderDetail.orderNo')}: {orderData.orderNo}</li>
                                        <li>
                                            {t('OrderDetail.time')}：
                                            {orderData.createTime
                                                ? formatDate(orderData.createTime)
                                                : '--'}
                                        </li>
                                        <li>{t('OrderDetail.orderPrice')}: {orderData.orderPrice}</li>
                                        <li>
                                            {t('OrderDetail.orderState')}:
                                            {t(ORDER_STATE_MAP[orderData.orderState]) || t('OrderDetail.unknown')}
                                        </li>
                                        {orderData.orderState == '5' && (
                                            <li className='text-red-500'>
                                                {t('OrderDetail.refundState')}:
                                                {t(REFUND_STATE_MAP[orderData.refundState]) || t('OrderDetail.unknown')}
                                            </li>
                                        )}
                                    </ul>
                                </section>

                                {/* 收货人信息 */}
                                <section>
                                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-5">
                                        <h2 className="text-xl font-semibold">{t('OrderDetail.recipientInfo')}</h2>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li>{t('OrderDetail.name')}: {orderData.recipientName}</li>
                                        <li>{t('OrderDetail.phone')}: {orderData.phone}</li>
                                        <li>{t('OrderDetail.country')}: {orderData.nation}</li>
                                        <li>{t('OrderDetail.addressDetail')}: {orderData.addressDetail}</li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        {/* 右侧商品信息 */}
                        <div className="mt-10 lg:mt-0">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-5">
                                <h2 className="text-xl font-semibold">{t('OrderDetail.productInfo')}</h2>
                            </div>

                            <div className="mt-4 rounded-lg  py-4">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {orderData.orderDetailList?.map(
                                        (product: any, index: number) => (
                                            <li key={index} className="flex gap-4 py-4 sm:px-2">
                                                <div className="shrink-0">
                                                    <img
                                                        src={product.imgUrl}
                                                        alt={product.goodsName}
                                                        className="w-20 h-20 rounded-md object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium">
                                                        {product.goodsName}
                                                    </h4>

                                                    {product.skuAttributeList?.length ? (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {product.skuAttributeList
                                                                .map(
                                                                    (attr: any) =>
                                                                        `${attr.attrName}: ${attr.attrValue}`
                                                                )
                                                                .join(' / ')}
                                                        </div>
                                                    ) : null}

                                                    <div className="flex justify-between items-end mt-2">
                                                        <p className="text-sm text-gray-700">
                                                            {t('OrderDetail.unitPrice')}: {product.skuPrice}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            {t('OrderDetail.quantity')}: {product.skuCount}
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {t('OrderDetail.subtotal')}: ${product.totalPrice}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    )}
                                </ul>

                                {/* 总价 */}
                                <dl className="space-y-4 border-t border-gray-200 pt-6 mt-4 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">{t('OrderDetail.total')}</dt>
                                        <dd className="font-medium text-gray-900">
                                            ${totalAmount.toString()}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    )
}
