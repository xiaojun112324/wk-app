import React, { ReactNode, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { useUserContext } from "@/contexts/user/userContext";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";

//充值


export default function Deposit() {
    const [form] = Form.useForm();
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $recharge, loading } = useMutation({
        fetcher: apiUser.recharge,
        onSuccess: (res: any) => {
            toast.success('成功')
            form.resetFields();
            context.refresh();


        },
    });
    useEffect(() => {
        form.resetFields();
    }, [])

    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        $recharge({
            ...values,
            type: 1,
        })
    };

    // 快捷金额选项
    const quickAmounts = [1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000];

    const handleQuickAmount = (amt: number) => {
        form.setFieldsValue({ amt });
    };

    return (
        <section>

            <AppNav title="银证转入" />


            <div className="mt-4 px-5 overflow-y-auto">
                <div className=" bg-no-repeat bg-center bg-cover rounded-2xl p-4 mb-4 bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/mine/account-bg.png')]">
                    <div className=" text-sm text-red-400">银转证</div>
                    <div className=" text-xs text-gray-500 text-center">当前可用余额</div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        label="用户名"

                    /*    rules={[{ required: true, message: "请输入用户名" }]} */
                    >
                        <div className="ant-input px-3">{userInfo?.realName || userInfo?.phone}</div>
                    </Form.Item>

                    <Form.Item
                        label="金额"
                        name="amt"
                        rules={[{ required: true, message: "请输入金额" }]}
                    >
                        <Input type="number" placeholder="请输入金额" />

                    </Form.Item>
                    <section className="grid grid-cols-4 gap-2 pb-4">
                        {quickAmounts.map((amt) => (
                            <div
                                key={amt}
                                className={clsx(
                                    "px-2 py-1 rounded text-sm text-center cursor-pointer bg-gray-100 text-gray-500",

                                )}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // 防止 Input 失去焦点
                                    handleQuickAmount(amt);
                                }}
                            >
                                ¥{amt}
                            </div>
                        ))}
                    </section>



                    <Form.Item
                        label="上传凭证"
                        name="payImg"
                        rules={[{ required: true, message: "请上传凭证" }]}
                    >
                        <UploadImg />
                    </Form.Item>

                    <Form.Item>
                        <Button type="submit" className="w-full mt-0" loading={loading}>
                            立即充值
                        </Button>
                    </Form.Item>
                </Form>

                <h3 className=" text-sm">温馨提示</h3>
                <div className="pb-5 text-sm text-muted-foreground">
                    感谢您选择我们，为保障您的资金安全，每笔入金之前，请您务必向客服确认入金账户，避免造成不必要的损失
                </div>
            </div>
        </section>
    );
}
