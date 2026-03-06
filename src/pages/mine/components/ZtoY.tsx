import React, { ReactNode, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import { useUserContext } from "@/contexts/user/userContext";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { bank } from "@/apis/bank";
import { useQuery } from "@/hooks/useQuery";
import { Link } from "react-router-dom";
import { toast } from "sonner";
//提取
interface GenericDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    trigger?: ReactNode;
}

export default function ZtoY({
    open,
    onOpenChange,
    title,
    description,
    children,
    trigger,
}: GenericDrawerProps) {
    const [form] = Form.useForm();
    const { data: bankList, loading: bankLoading, run: $getBank } = useQuery({
        fetcher: bank.getBankInfo,
        immediate: false

    });

    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $withdraw, loading } = useMutation({
        fetcher: apiUser.withdraw,
        onSuccess: (res: any) => {
            toast.success('成功')
            context.refresh();
            form.resetFields();
            onOpenChange(false)
        },
    });
    useEffect(() => {
        if (open) {
            form.resetFields();
            $getBank()
        }
    }, [open])

    const currentBank = useMemo(() => {
        if (bankList?.length > 0) {
            return bankList[0]
        }
        return null
    }, [bankList])

    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        if (!currentBank?.bankId) {
            toast.warning('请先绑定银行卡')
            return

        }
        $withdraw({
            ...values,
            bankId: currentBank.bankId,
            type: 1,
        });
    };



    const handleQuickAmount = (amt: number) => {
        form.setFieldsValue({ amt });
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader className="hidden">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>

                <div className="px-5 overflow-y-auto mt-4">
                    <div className=" bg-no-repeat bg-center bg-cover rounded-2xl p-4 mb-4 bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/mine/account-bg.png')]">
                        <div className=" text-sm text-red-400">证转银</div>
                        <div className=" text-xs text-gray-500">当前可用余额</div>
                    </div>

                    <Form form={form} layout="vertical" onFinish={handleFinish}>


                        <Form.Item
                            label="提现金额"
                            name="amt"
                            rules={[{ required: true, message: "请输入提现金额" }, {
                                validator: (_, value) => {
                                    if (Number(value) >= 100) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('提现金额不能小于 100'));
                                },
                            }]}
                        >
                            <Input type="number" placeholder="请输入提现金额" />

                        </Form.Item>

                        <Form.Item
                            label="提现方式"
                        >
                            <div>
                                <div className=" inline-block rounded bg-primary text-white text-sm px-4 py-1">银行卡</div>
                                {/*                                 <div>{currentBank ? <div>银行名称：{currentBank.bankName}<div>银行卡号：{currentBank.bankNo}</div></div> : <Link to="/banks">尚未绑定银行卡，点击绑定</Link>}</div>
 */}                            </div>
                        </Form.Item>


                        <Form.Item
                            label="资金密码"
                            name="withdrawalpwd"
                            rules={[{ required: true, message: "请输入资金密码" }]}
                        >
                            <Input.Password placeholder="请输入资金密码" />

                        </Form.Item>




                        <Form.Item>
                            <Button type="submit" className="w-full " loading={loading} >
                                立即提现
                            </Button>
                        </Form.Item>
                    </Form>

                    <h3 className=" text-sm mb-2">温馨提示</h3>
                    <div className="pb-5 text-sm text-gray-600 flex flex-col gap-2">
                        <p>1、提款请先通过实名认证和绑定银行卡。</p>
                        <p>2、提款时间交易日09:00-17:00。</p>
                        <p>3、每笔提现金额最小100元。</p>
                   {/*      <p>4、A股提款T+1到账，提款时间受银行清算时间影响，各家银行到账时间不同，最迟T+1-次目24点前到账。节假日延递。</p>
                        <p>5、港股，港币提现 T+2到账，提款时间受银行清算时间影响，各家银行到账时间不同，最迟T+2次日24点前到账，节假日延递。</p> */}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
