import React, { useEffect } from 'react';
import { Form, Select, Input, Spin } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@/hooks/useQuery';
import { apiOrder } from '@/apis/order';
import UploadImg from '@/components/UploadImg';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { useMutation } from '@/hooks/useMutation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DepositForm() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { data: rechargeAddress, loading: addressLoading, run } = useQuery({
        fetcher: apiOrder.selectRechargeAddress,
        immediate: false,
    });

    const { mutate: applyRecharge, loading } = useMutation({
        fetcher: apiOrder.applyRecharge,
        onSuccess: () => {
            toast.success(t('DepositForm.success'));
            navigate('/mine/wallet');
        },
    });

    const currency = Form.useWatch('currency', form);
    const network = Form.useWatch('network', form);
    const amount = Form.useWatch('amount', form);
    const address = rechargeAddress?.rechargeAddress;

    const rate = 1; // 这里可替换成实际汇率，比如从后端接口获取

    useEffect(() => {
        if (currency && network) {
            run({
                rechargeType: currency,
                rechargeNetwork: network,
            });
        }
    }, [currency, network]);

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        toast.success(t('DepositForm.addressCopied'));
    };

    const handleSubmit = (values: any) => {
        if (!values.amount) return toast.warning(t('DepositForm.enterAmount'));
        if (!values.proof || values.proof.length === 0)
            return toast.warning(t('DepositForm.uploadProof'));

        applyRecharge({
            rechargeType: values.currency,
            rechargeNetwork: values.network,
            rechargeAddress: address,
            rechargeAmount: values.amount,
            rechargeImg: values.proof,
        });
    };

    return (
        <div className=" max-w-3xl rounded-2xl p-6">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    currency: '0',
                    network: 'TRC20',
                    amount: '',
                }}
                onFinish={handleSubmit}
            >
                {/* 币种 */}
                <Form.Item
                    name="currency"
                    label={t('DepositForm.currency')}
                    rules={[{ required: true, message: t('DepositForm.selectCurrency') }]}
                >
                    <Select options={[{ value: '0', label: 'USDT' }]} loading={addressLoading} />
                </Form.Item>

                {/* 网络 */}
                <Form.Item
                    name="network"
                    label={t('DepositForm.network')}
                    rules={[{ required: true, message: t('DepositForm.selectNetwork') }]}
                >
                    <Select
                        options={[
                            { value: 'TRC20', label: 'TRC20' },
                            { value: 'ERC20', label: 'ERC20' },
                        ]}
                    />
                </Form.Item>

                {/* 二维码 + 地址 */}
                <Spin spinning={addressLoading}>
                    {address && (
                        <div className="my-4">
                            <QRCodeSVG id="deposit-qr" value={address} size={100} />
                            <div className="mt-4">
                                <div className="text-gray-500 text-sm mb-1">{t('DepositForm.addressLabel')}</div>
                                <div className="flex items-center gap-2  rounded px-3 py-2">
                                    <span className="truncate flex-1">{address}</span>
                                    <CopyOutlined
                                        onClick={handleCopy}
                                        className="cursor-pointer text-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Spin>

                {/* 数量 */}
                <Form.Item
                    name="amount"
                    label={t('DepositForm.amount')}
                    rules={[{ required: true, message: t('DepositForm.enterAmount') }]}
                >
                    <Input placeholder={t('DepositForm.enterAmount')} type='number' />
                </Form.Item>

                {/* 预估到账 */}
                <Form.Item label={t('DepositForm.estimatedArrival', { rate: `1:${rate.toFixed(2)}` })}>
                    <Input disabled value={amount ? amount : '0.00'} />
                </Form.Item>

                {/* 上传支付凭证 */}
                <Form.Item
                    name="proof"
                    label={t('DepositForm.proof')}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e}
                    rules={[{ required: true, message: t('DepositForm.uploadProof') }]}
                >
                    <UploadImg />
                </Form.Item>

                {/* 提交按钮 */}
                <Form.Item>
                    <Button type="submit" className="w-full" loading={loading}>
                        {t('DepositForm.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
