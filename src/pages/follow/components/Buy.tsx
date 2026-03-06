import React, { ReactNode, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, InputNumber, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { useUserContext } from "@/contexts/user/userContext";
import { toast } from "sonner";
import BigNumber from "bignumber.js";
import { ApiDzong } from "@/apis/dzong";
import { ApiIpo } from "@/apis/ipo";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/formatMoney";
import { apiFollow } from "@/apis/follow";
import { useNavigate } from "react-router-dom";


interface GenericDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: ReactNode;
    trigger?: ReactNode;
    item: any;
}


function isMultipleOf100(value: number): boolean {
    return value % 100 === 0;
}


export default function Buy({
    open,
    onOpenChange,
    children,
    trigger,
    item
}: GenericDrawerProps) {
    const nav = useNavigate();
    const [form] = Form.useForm();
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $add, loading: addLoading } = useMutation({
        fetcher: apiFollow.add,
        onSuccess: () => {
            toast.success("购买成功");
            form.resetFields(); // 成功后清空表单

            nav('/follow/history')
        },
    });

    useEffect(() => {
        if (open) {
            // form.setFieldsValue({ })
            console.log(item)

        } else {
            form.resetFields();
        }

    }, [open])


    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        if (values.amount && !isMultipleOf100(values.amount)) {
            toast.warning('购买金额必须是100的整数倍')
            return
        }
        /*    toast.info('功能正在开发中，敬请期待') */
  

        $add({
            jsonParamString: JSON.stringify({
                ...values,
                followerId: item?.followerId,
                followerInfoId: item?.id,
                siteLever: 1,//杠杆倍数
            })

        })

    };




    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader >
                    <DrawerTitle>申请量化托管</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>

                <section className=" px-5 overflow-y-auto pb-10">
                    <div className=" text-center flex items-center justify-between mb-5">
                        <div>
                            <div className="text-muted-foreground text-sm">余额</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-sm">等级</div>
                            <div className=" text-red-600">1级策略师</div>
                        </div>
                    </div>


                    <Form form={form} onFinish={handleFinish} layout="vertical">

                        <Form.Item
                            label="购买金额（必须是100的整数倍）"
                            name="amount"
                            rules={[{ required: true, message: "请输入购买金额" }]}
                        >
                            <InputNumber className="!w-full" type="number" placeholder={`购买金额${item?.minFollowAmount}-${item?.maxFollowAmount}`} min={item?.minFollowAmount} max={item?.maxFollowAmount} />

                        </Form.Item>


                        {/*       <FollowItems options={options} value={currentId} onChange={onFollowChange} className="mb-5" /> */}




                        <Form.Item>
                            <Button
                                full
                                type='submit'
                            >
                                一键量化托管
                            </Button>
                        </Form.Item>
                    </Form>


                </section>
            </DrawerContent>
        </Drawer>
    );
}
