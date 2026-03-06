import React, { ReactNode, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { useUserContext } from "@/contexts/user/userContext";
import { toast } from "sonner";
import BigNumber from "bignumber.js";
import { ApiDzong } from "@/apis/dzong";

//充值
interface GenericDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: any;
    children?: ReactNode;
    trigger?: ReactNode;
}





export default function Buy({
    open,
    onOpenChange,
    item,
    children,
    trigger,
}: GenericDrawerProps) {
    const [form] = Form.useForm();
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $addDzong, loading } = useMutation({
        fetcher: ApiDzong.addDzOrder,
        onSuccess: (res: any) => {
            toast.success('成功')
            form.resetFields();
            context.refresh();
            onOpenChange(false)

        },
    });
    useEffect(() => {
        if (open && item) {
            form.setFieldsValue({ num: item?.stockNum || 1 })

        } else {
            form.resetFields();
        }

    }, [open, item])




    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        $addDzong({
            ...values,
            dzId: item?.id,
            stockCode: item?.stockCode

        })
    };

    const inputNum = Form.useWatch('num', form);


    const price = useMemo(() => {
        return item?.absolutePrice != null && item?.absolutePrice !== ''
            ? new BigNumber(item?.absolutePrice ?? 0)
            : new BigNumber(item?.currentprice ?? 0).multipliedBy(item?.discount ?? 0);

    }, [item])

    const amount = useMemo(() => {
        return new BigNumber(inputNum || 0)
            .multipliedBy(price || 0)
            .toFixed(2);
    }, [inputNum, price])
    console.log(inputNum)
    const amountIncome = useMemo(() => {
        return new BigNumber(inputNum)
            .multipliedBy(
                new BigNumber(item?.currentprice ?? 0).minus(price ?? 0)
            ).toFixed(2);
    }, [inputNum, item])
    const profitRateFormatted = useMemo(() => {
        const currentPrice = new BigNumber(item?.currentprice ?? 0);        // 卖出价格
        const buyPrice = new BigNumber(item?.absolutePrice ?? 0);    // 成交价格

        // 计算收益率
        const profitRate = currentPrice.minus(buyPrice)       // 卖出价 - 成交价
            .dividedBy(buyPrice) // 除以当前价
            .multipliedBy(100);      // 转换成百分比

        return profitRate.decimalPlaces(2, BigNumber.ROUND_FLOOR).toFixed(2);

    }, [])





    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader >
                    <DrawerTitle>{item?.stockName}</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>

                <div className=" px-5 overflow-y-auto">


                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div>总价</div>
                            <div>{amount}</div>
                        </div>
                        <div className="flex items-center">
                            <div>收益率</div>
                            <div>{profitRateFormatted}%</div>
                        </div>
                    </div>

                    <Form form={form} labelCol={{ flex: '70px' }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{ flex: 1 }} onFinish={handleFinish}>

                        <Form.Item
                            label="数量"
                            name="num"

                            rules={[{ required: true, message: "请输入数量" }]}
                        >
                            <Input type="number" placeholder="请输入数量" />
                        </Form.Item>
                        <section className="-mt-1 mb-5">
                            <div>预计收益金额<span>{amountIncome}</span></div>
                            <div>最低购买数量<span>{item?.stockNum}</span></div>
                        </section>

                        <Form.Item
                            label="密钥"
                            name="password"
                            rules={[{ required: true, message: "请输入密钥" }]}
                        >
                            <Input.Password placeholder="请输入密钥" />

                        </Form.Item>






                        <Form.Item>
                            <Button type="submit" className="w-full mt-0" loading={loading}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>


                </div>
            </DrawerContent>
        </Drawer>
    );
}
