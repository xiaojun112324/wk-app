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
import { formatMoney } from "@/lib/formatMoney";

interface IProps {
    open: boolean;
    item: any;
    onClose: (open: boolean) => void;

}

export default function HistoryDetail({
    open,
    onClose,
    item

}: IProps) {



    return (
        <Drawer open={open} onOpenChange={onClose}>


            <DrawerContent>
                <DrawerHeader className="hidden">
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <section className="flex  gap-1 mt-4 pt-5 pb-15">
                    <div className=" flex items-center flex-col flex-1 gap-2">
                        <div className=" text-muted-foreground text-sm">初始资金</div>
                        <div>{formatMoney(item?.startAmount)}</div>
                    </div>

                    <div className=" flex items-center flex-col flex-1 gap-2">
                        <div className=" text-muted-foreground text-sm">盈亏比例</div>
                        <div>{item?.profitLossPercentage}%</div>
                    </div>
                    <div className=" flex items-center flex-col flex-1 gap-2">
                        <div className=" text-muted-foreground text-sm">总盈亏</div>
                        <div>{formatMoney(item?.profitLossAmount || 0)}</div>
                    </div>
                </section>


            </DrawerContent>
        </Drawer>
    );
}
