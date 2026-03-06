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
    trigger?: ReactNode;
}





export default function Msg({
    open,
    onOpenChange,
    trigger,
}: GenericDrawerProps) {





    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader >
                    <DrawerTitle className=" text-green-600">托管如何运作？</DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>
                <section className=" text-sm text-muted-foreground px-5 pb-10">
                    <p className="mb-4">在搜索框中输入您想托管的量化策略库账户昵称，点击查找就可以看到量化策略库的详情信息，点击“托管”就可以进入申请页面申请。</p>
                    <p>您每天确认进行托管后，量化模型才会操盘您的托管资金，未在实盘时间进行托管，做无效量化托管单处理。</p>

                </section>


            </DrawerContent>
        </Drawer>
    );
}
