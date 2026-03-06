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
import AppNav from "@/components/AppNav";
import { formatMoney } from "@/lib/formatMoney";
import BigNumber from "bignumber.js";
//提取


export default function Withdraw() {
    const [form] = Form.useForm();


    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { data: bankList, loading: bankLoading, run: $getBank } = useQuery({
        fetcher: bank.getBankInfo,
        immediate: false

    });
    const { data: settingData } = useQuery({
        fetcher: apiUser.getSetting,

    });


    const { mutate: $withdraw, loading } = useMutation({
        fetcher: apiUser.withdraw,
        onSuccess: (res: any) => {
            toast.success('成功')
            context.refresh();
            form.resetFields();
        },
    });
    useEffect(() => {
        form.resetFields();
        $getBank()
    }, [])

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
    const amt = Form.useWatch("amt", form) || 0; // 监听提现金额
    const withdrawalFee = settingData?.withdrawalFee ?? 0;

    // 使用 BigNumber 计算实际到账
    const actualReceived = new BigNumber(amt)
        .multipliedBy(new BigNumber(1).minus(new BigNumber(withdrawalFee).dividedBy(100))).toNumber();


    return (
        <div>

            <AppNav title="转出" />
            <div className="px-5 overflow-y-auto mt-4">
                <div className=" bg-no-repeat bg-center bg-cover rounded-2xl p-4 mb-4 bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/mine/account-bg.png')]">
                    <div className=" text-sm text-red-400">证转银</div>
                    <div className=" text-xs text-gray-500 text-center">当前可用余额</div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleFinish}>


                    <Form.Item
                        label="提现金额"
                        name="amt"
                        rules={[{ required: true, message: "请输入提现金额" }, {
                            validator: (_, value) => {
                                if (Number(value) >= (settingData?.withMinAmt || 0)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(`提现金额不能小于 ${settingData?.withMinAmt}`));
                            },
                        }]}
                    >
                        <Input type="number" placeholder="请输入提现金额" />

                    </Form.Item>
                    {settingData?.withdrawalFee ? <div className="flex justify-between items-center">
                        <div>
                            {actualReceived > 0 ? <div className=" text-xs ">实际到账金额：{formatMoney(actualReceived)}</div> : ''}
                        </div>

                        <div className=" text-xs text-right">提现手续费：{settingData?.withdrawalFee}%</div>
                    </div> : ''}


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
                <div className="pb-5 text-sm text-muted-foreground   flex flex-col gap-2">
                    <p>1、提款请先通过实名认证和绑定银行卡。</p>
                    <p>2、提款时间交易日{settingData?.withdrawTimes}。</p>
                    <p>3、每笔提现金额最小{settingData?.withMinAmt}元。</p>
                    {/*         <p>4、A股提款T+1到账，提款时间受银行清算时间影响，各家银行到账时间不同，最迟T+1-次目24点前到账。节假日延递。</p>
                    <p>5、港股，港币提现 T+2到账，提款时间受银行清算时间影响，各家银行到账时间不同，最迟T+2次日24点前到账，节假日延递。</p> */}
                </div>
            </div>

        </div>
    );
}
