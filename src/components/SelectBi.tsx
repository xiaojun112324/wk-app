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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

//充值
interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    trigger?: ReactNode;
}

export default function SelectBi({
    open,
    onOpenChange,
    title,
    description,
    children,
    trigger,
}: IProps) {
    const [form] = Form.useForm();
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;
    const { mutate: $recharge, loading } = useMutation({
        fetcher: apiUser.recharge,
        onSuccess: (res: any) => {
            toast.success('成功')
            form.resetFields();
            context.refresh();

            onOpenChange(false)

        },
    });
    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open])

    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        $recharge({
            ...values,
            type: 1,
        })
    };

    // 快捷金额选项
    const quickAmounts = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000];

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

                <div className="mt-4 px-5 overflow-y-auto h-[80vh]">
                    <Tabs defaultValue="overview" className="">
                        <TabsList className="w-full">
                            <TabsTrigger value="overview">账户名挖矿</TabsTrigger>
                            <TabsTrigger value="analytics">免登录挖矿</TabsTrigger>
                          
                        </TabsList>
                        <TabsContent value="overview">
                      
                        </TabsContent>
                        <TabsContent value="analytics">
                        
                        </TabsContent>
                
                     
                    </Tabs>





                </div>
            </DrawerContent>
        </Drawer>
    );
}
