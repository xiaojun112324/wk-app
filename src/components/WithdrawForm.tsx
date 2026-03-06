import React, { useState } from "react";
import { Form, Input, Select } from "antd";
import { Button } from '@/components/Button'
import { useMutation } from "@/hooks/useMutation";
import { apiOrder } from "@/apis/order";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function WithdrawForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [withdrawType, setWithdrawType] = useState<"0" | "1">("0"); // 0 加密货币 1 银行卡
    const [network, setNetwork] = useState<"TRC20" | "ERC20">("TRC20");
    const balance = 0;
    const feeRate = 0.0;
    const { mutate: applyWithdraw, loading } = useMutation({
        fetcher: apiOrder.applyWithdraw,
        onSuccess: () => {
            toast.success(t("WithdrawForm.operationSuccess"))
            navigate('/mine/wallet')
        },
    });

    const handleTypeChange = (value: "0" | "1") => {
        setWithdrawType(value);
        form.resetFields();
        if (value === "0") {
            setNetwork("TRC20");
            form.setFieldsValue({
                withdrawType: "0",
                withdrawCoinType: "USDT",
                withdrawAmount: 0,
            });
        } else {
            form.setFieldsValue({
                withdrawType: "1",
                withdrawCoinType: "",
                withdrawNetwork: "",
                withdrawAmount: 0,
            });
        }
    };

    const handleFinish = (values: any) => {
        const submitData = {
            ...values,
            withdrawNetwork: withdrawType === "0" ? network : values.withdrawNetwork,
        };
        applyWithdraw(submitData)
    };

    const amount = Form.useWatch("withdrawAmount", form) || 0;
    const actualReceived = (amount * (1 - feeRate)).toFixed(2);

    const handleCopy = () => {
        const address = form.getFieldValue("withdrawAddress");
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success(t("WithdrawForm.copied"));
        } else {
            toast.warning(t("WithdrawForm.inputAddressFirst"));
        }
    };

    return (
        <div className="max-w-5xl w-full  rounded-lg p-6">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    withdrawType: "0",
                    withdrawCoinType: "USDT",
                    withdrawAmount: 0,
                }}
                className="space-y-4"
            >
                {/* 提现方式 */}
                <Form.Item
                    name="withdrawType"
                    label={t("WithdrawForm.withdrawMethod")}
                    rules={[{ required: true, message: t("WithdrawForm.selectWithdrawMethod") }]}
                >
                    <Select value={withdrawType} onChange={handleTypeChange}>
                        <Select.Option value="0">{t("WithdrawForm.crypto")}</Select.Option>
                        <Select.Option value="1">{t("WithdrawForm.bankCard")}</Select.Option>
                    </Select>
                </Form.Item>

                {withdrawType === "0" && (
                    <>
                        <Form.Item
                            name="withdrawCoinType"
                            label={t("WithdrawForm.coinType")}
                            rules={[{ required: true, message: t("WithdrawForm.selectCoin") }]}
                        >
                            <Input placeholder={t("WithdrawForm.enterUSDT")} />
                        </Form.Item>

                        <Form.Item label={t("WithdrawForm.blockchainNetwork")}>
                            <div className="flex gap-2">
                                {["TRC20", "ERC20"].map((item) => (
                                    <Button
                                        key={item}
                                        onClick={() => setNetwork(item as "TRC20" | "ERC20")}
                                        className={
                                            network === item
                                                ? "bg-orange-500 border-orange-500 hover:bg-orange-600"
                                                : ""
                                        }
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="withdrawAddress"
                            label={t("WithdrawForm.withdrawAddress")}
                            rules={[{ required: true, message: t("WithdrawForm.enterWithdrawAddress") }]}
                        >
                            <Input
                                placeholder={t("WithdrawForm.enterWithdrawAddress")}
                                suffix={
                                    <span
                                        onClick={handleCopy}
                                        className="text-blue-500 cursor-pointer hover:underline"
                                    >
                                        {t("WithdrawForm.copy")}
                                    </span>
                                }
                            />
                        </Form.Item>
                    </>
                )}

                {withdrawType === "1" && (
                    <>
                        <Form.Item
                            name="withdrawCoinType"
                            label={t("WithdrawForm.bankName")}
                            rules={[{ required: true, message: t("WithdrawForm.enterBankName") }]}
                        >
                            <Input placeholder={t("WithdrawForm.enterBankName")} />
                        </Form.Item>

                        <Form.Item
                            name="withdrawNetwork"
                            label={t("WithdrawForm.bankBranch")}
                            rules={[{ required: true, message: t("WithdrawForm.enterBankBranch") }]}
                        >
                            <Input placeholder={t("WithdrawForm.enterBankBranch")} />
                        </Form.Item>

                        <Form.Item
                            name="withdrawAddress"
                            label={t("WithdrawForm.bankCardNumber")}
                            rules={[{ required: true, message: t("WithdrawForm.enterBankCardNumber") }]}
                        >
                            <Input
                                placeholder={t("WithdrawForm.enterBankCardNumber")}
                                suffix={
                                    <span
                                        onClick={handleCopy}
                                        className="text-blue-500 cursor-pointer hover:underline"
                                    >
                                        {t("WithdrawForm.copy")}
                                    </span>
                                }
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="withdrawAmount"
                    label={t("WithdrawForm.withdrawAmount")}
                    rules={[
                        { required: true, message: t("WithdrawForm.enterWithdrawAmount") },
                        {
                            validator: (_, value) =>
                                value > 0 ? Promise.resolve() : Promise.reject(t("WithdrawForm.amountMustBeGreaterZero")),
                        },
                    ]}
                >
                    <Input type="number" placeholder={t("WithdrawForm.enterWithdrawAmount")} />
                </Form.Item>

                <div className="text-green-600 text-sm mb-2">
                    {t("WithdrawForm.currentBalance")}: {balance.toFixed(2)} USDT ≈ {balance.toFixed(2)} USDT
                </div>

                <div className="flex justify-between text-sm text-gray-700 border-t border-gray-100 pt-2">
                    <span>{t("WithdrawForm.actualReceived")}: {actualReceived} USDT</span>
                    <span>{t("WithdrawForm.fee")}: {(feeRate * 100).toFixed(2)}%</span>
                </div>

                <Form.Item className="pt-4">
                    <Button
                        loading={loading}
                        type="submit"
                        className="w-full"
                    >
                        {t("WithdrawForm.confirmSubmit")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
