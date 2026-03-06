import { Form, Input } from "antd";
import { Button } from "@/components/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { bank } from "@/apis/bank";
import { useQuery } from "@/hooks/useQuery";
import { useEffect } from "react";

export default function BindBank() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const location = useLocation();


    // 获取查询参数
    const searchParams = new URLSearchParams(location.search);
    const bankId = searchParams.get('id');
    const { data: bankList, run: $getBankList, loading: bankListLoading } = useQuery({
        fetcher: bank.getBankInfo,
        immediate: false,

    });
    useEffect(() => {
        if (bankId) {
            $getBankList();
        }
    }, [
        bankId
    ])

    useEffect(() => {
        if (bankList?.length > 0) {

            const bankInfo = bankList.find((item: any) => item.bankId == bankId)
            if (bankInfo) {
                form.setFieldsValue({
                    bankName: bankInfo.bankName,
                    bankAddress: bankInfo.bankAddress,
                    bankNo: bankInfo.bankNo,
                    cardOwnerName: bankInfo.cardOwnerName,
                });
            }
        }
    }, [bankList, bankId])

    const { mutate: upBank, loading: upLoading } = useMutation({
        fetcher: bank.up,
        onSuccess: () => {
            toast.success('修改成功');
            form.resetFields(); // 成功后清空表单
            setTimeout(() => {
                navigate('/banks', { replace: true })
            }, 400)
        },
    });

    const { mutate: addBank, loading } = useMutation({
        fetcher: bank.add,
        onSuccess: () => {
            toast.success('添加成功');
            form.resetFields(); // 成功后清空表单
            setTimeout(() => {
                navigate('/banks', { replace: true })

            }, 400)
        },
    });

    const handleSubmit = (values: any) => {
        console.log("表单提交:", values);
        if (bankId) {
            upBank({
                ...values,
                id: bankId
            })
        } else {
            addBank({
                ...values
            });

        }

    };

    return (
        <main className="">
            <AppNav title={bankId ? '修改银行卡' : '添加银行卡'} />


            <div className="mt-6 lg:mt-0 w-full max-w-md px-5">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="银行名称"
                        name="bankName"
                        rules={[{ required: true, message: '请输入银行名称' }]}
                    >
                        <Input placeholder="请输入银行名称" />
                    </Form.Item>

                    <Form.Item
                        label="支行"
                        name="bankAddress"
                        rules={[
                            { required: true, message: '请输入支行' },
                        ]}
                    >
                        <Input placeholder="请输入支行" />
                    </Form.Item>


                    <Form.Item
                        label="卡号"
                        name="bankNo"
                        rules={[
                            { required: true, message: "请输入卡号" },
                            {
                                pattern: /^\d{16,19}$/,
                                message: "卡号必须为 16–19 位数字",
                            },
                        ]}
                    >
                        <Input placeholder="请输入卡号" />
                    </Form.Item>

                    <Form.Item
                        label="姓名"
                        name="cardOwnerName"
                        rules={[
                            { required: true, message: '请输入姓名' },
                        ]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>



                    <Form.Item>
                        <Button type="submit" className="w-full" loading={loading || upLoading}>
                            {t("LoginPassword.submit")}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </main>
    );
}
