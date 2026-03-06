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
import { ApiIpo } from "@/apis/ipo";

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
    const { mutate: $add, loading } = useMutation({
        fetcher: ApiIpo.add,
        onSuccess: (res: any) => {
            toast.success('成功')
            form.resetFields();
            context.refresh();
            onOpenChange(false)

        },
    });

    useEffect(() => {
        if (open && item) {
            form.setFieldsValue({ applyNums: item?.orderNumber || 1 })

        } else {
            form.resetFields();
        }

    }, [open, item])




    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        $add({
            ...values,
            newlistid: item?.newlistId,


        })
    };








    const increaseInPrice = useMemo(() => {
        const price = new BigNumber(item?.price || 0); // 确保 ipoData.price 存在
        const marketPrice = new BigNumber(item?.marketPrice || 1); // 确保 marketPrice 不为 0，避免除零

        const result = marketPrice
            .minus(price) // (marketPrice-price )
            .dividedBy(price) //
            .multipliedBy(100) // * 100
            .toFixed(2); // 保留两位小数
        return `${result}%`;

    }, [item])




    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader >
                    <DrawerTitle>认购详情</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>

                <section className=" px-5 overflow-y-auto">
                    <div className="">
                        <div>{item?.name}</div>
                        <div>截止日期：{item?.subscribeTime}</div>
                    </div>
                    <div className="flex flex-col gap-2 py-5">
                        <div className="flex items-center justify-between">
                            <div className=" text-gray-500 text-sm">价格</div>
                            <div>{item?.price}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className=" text-gray-500 text-sm">市场</div>
                            <div>{item?.marketPrice}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className=" text-gray-500 text-sm">交易平台</div>
                            <div>{item?.exchange}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className=" text-gray-500 text-sm">涨幅</div>
                            <div>{increaseInPrice}</div>
                        </div>

                    </div>

                    <Form form={form} onFinish={handleFinish}>

                        <Form.Item
                            label="申购数量"
                            name="applyNums"
                            rules={[{ required: true, message: "请输入数量" }, {
                                validator: (_: any, value: any) => {
                                    if (value === undefined || value === null || value === '') {
                                        return Promise.resolve();
                                    }
                                    if (Number(value) < item?.orderNumber) {
                                        return Promise.reject(
                                            new Error(`申购数量不能小于 ${item?.orderNumber}`)
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }]}
                        >
                            <Input type="number" placeholder="请输入数量" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="submit" className="w-full mt-0" loading={loading}>
                                立即认购
                            </Button>
                        </Form.Item>
                    </Form>


                </section>
            </DrawerContent>
        </Drawer>
    );
}
