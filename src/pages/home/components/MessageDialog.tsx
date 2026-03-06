import React, { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/Button";
import { Form, Input, Space } from "antd";
import UploadImg from "@/components/UploadImg";
import clsx from "clsx";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { useUserContext } from "@/contexts/user/userContext";
import { toast } from "sonner";

//充值
interface GenericDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    trigger?: ReactNode;
}

export default function MessageDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    trigger,
}: GenericDrawerProps) {
    const [form] = Form.useForm();
    const context = useUserContext();
  

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && <DrawerDescription className="min-h-[160px]">{description}</DrawerDescription>}
                </DrawerHeader>

               
            </DrawerContent>
        </Drawer>
    );
}
