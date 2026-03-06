import { Form, Input, Radio, Select, Space, Spin } from "antd"
import { Button } from '@/components/Button'
import UploadImg from '@/components/UploadImg'
import { useMutation } from "@/hooks/useMutation"
import { useQuery } from "@/hooks/useQuery"
import { apiCommon } from "@/apis/common"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import AppNav from "@/components/AppNav"
import { useUserContext } from "@/contexts/user/userContext"
import { apiUser } from "@/apis/user"
import { getKYCStatusText } from "@/maps/kyc"

export default function Kyc() {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const context = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = context.store;


    const inviteCode = searchParams.get("inviteCode");
    useEffect(() => {
        form.setFieldsValue({ realName: userInfo?.realName || '', idCard: userInfo?.idCard || '', img1Key: userInfo?.img1Key || '', img2Key: userInfo?.img2Key || '' });
    }, [userInfo, form]);

    const { mutate: muAuth, loading } = useMutation({
        fetcher: userInfo?.isActive == 0 ? apiUser.auth : apiUser.upAuth,
        onSuccess: () => {
            toast.success("提交成功");
            form.resetFields();
            context.refresh()
        },
    });

    const handleFinish = (values: any) => {
        const payload = {
            ...values
        };
        console.log("提交数据:", payload);
        muAuth(payload);
    };
    const isDisabled = useMemo(() => {
        //1 待审核 2 认证成功
        return userInfo?.isActive == 2 || userInfo?.isActive == 1
    }, [userInfo])

    return (
        <main className="mx-auto max-w-7xl px-4  pb-24 sm:px-6 lg:px-8">

            <Spin spinning={userLoading}>

                <AppNav title="实名认证" />
                {userInfo?.isActive == 1 ?
                    <div className="text-sm pb-5 text-center">审核中，请耐心等待</div>

                    : null}
                {userInfo?.isActive == 3 ?
                    <div className="text-sm pb-5 ">驳回原因：<span className=" text-red-500 font-semibold">{userInfo.authMsg}</span></div>

                    : null}
                {userInfo?.isActive == 2 ? <div className="flex justify-center items-center py-5">

                    <span className="size-7 -mt-1 mr-1 block bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-auth-success.png')]"></span>

                    {getKYCStatusText(userInfo?.isActive)}

                </div> : ''}



                < div >
                    <Form form={form} layout="vertical" onFinish={handleFinish} disabled={isDisabled}>
                        <Form.Item
                            label="真实姓名"
                            name="realName"
                            rules={[{ required: true, message: "请输入真实姓名" }]}
                        >
                            <Input placeholder="请输入真实姓名" />
                        </Form.Item>
                        <Form.Item
                            label="身份证号"
                            name="idCard"
                            rules={[{ required: true, message: "请输入身份证号" }]}
                        >
                            <Input placeholder="请输入身份证号" />
                        </Form.Item>

                        <Form.Item
                            label="身份证正面"
                            name="img1Key"
                            rules={[{ required: true, message: "请上传身份证正面" }]}
                        >
                            <UploadImg disabled={isDisabled} />
                        </Form.Item>

                        <Form.Item
                            label="身份证反面"
                            name="img2Key"
                            rules={[{ required: true, message: "请上传身份证反面" }]}
                        >
                            <UploadImg disabled={isDisabled} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="submit" className="w-full mt-10" loading={loading} disabled={isDisabled} >
                                {t("merchantRegister.submit")}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </Spin>

        </main >
    );
}
