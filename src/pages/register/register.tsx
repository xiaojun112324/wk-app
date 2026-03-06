import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox, Form, Input, Select, Space, message } from "antd";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { useQuery } from "@/hooks/useQuery";
import { apiCommon } from "@/apis/common";
import { useTranslation } from "react-i18next";

export default function Register() {
    const [searchParams] = useSearchParams();
    const inviteCode = searchParams.get("inviteCode");
    const { t } = useTranslation();
    const nav = useNavigate();
    const [form] = Form.useForm();
    const [currentCode, setCurrentCode] = useState<any>(null)
    const codes = [{
        label: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code1.png',
        value: '3n3d'
    }, {
        label: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code2.png',
        value: 'vrvt'
    }, {
        label: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code3.png',
        value: 'm8k2'
    }, {
        label: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code4.png',
        value: '7wob'
    }, {
        label: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/code5.png',
        value: 'xzih'
    }]
    const getRandomCode = () => {
        const index = Math.floor(Math.random() * codes.length);
        setCurrentCode(codes[index]);
    }
    useEffect(() => {
        getRandomCode()
    }, [])

    useEffect(() => {
        if (inviteCode) {
            form.setFieldsValue({
                inviteCode: inviteCode,
            });
        }
    }, [inviteCode])

    const { mutate: doRegister, loading } = useMutation({
        fetcher: apiUser.doRegister,
        onSuccess: () => {
            toast.success(t('register.successMessage'));
            form.resetFields()
            setTimeout(() => nav("/login"), 1000);
        },
    });

    const handleSubmit = (values: any) => {
        if (values.password !== values.confirmPassword) {
            toast.warning(t('register.passwordMismatch'));
            return;
        }
        if (values.VerificationCode.toLowerCase() !== currentCode.value.toLowerCase()) {
            toast.warning(t('register.codeError'))
            return
        } 

        let params =
        {
            "username": values.username,
            "email": values.email,
            "password": values.password,
            "inviteCode": values.inviteCode
        };

        doRegister(params);
    };

    return (
        <div className=" min-h-full max-w-6xl mx-auto mt-10 px-5">
            <div className="mt-10">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    key="phoneForm"
                >
                      <Form.Item label={t('register.username')} name="username" rules={[
                        { required: true, message: t('register.usernamePlaceholder') },
                    ]}>
                        <Input
                            placeholder={t('register.usernamePlaceholder')}

                        />
                    </Form.Item>

                    <Form.Item label={t('register.emailLabel')} name="email" rules={[
                        { required: true, message: t('register.emailRequired') },
                    ]}>
                        <Input
                            placeholder={t('register.emailPlaceholder')}

                        />
                    </Form.Item>

                    <Form.Item
                        label={t('register.passwordLabel')}
                        name="password"
                        rules={[
                            { required: true, message: t('register.passwordRequired') },
                            { pattern: /^[\S]{6,12}$/, message: t('register.passwordPattern') }
                        ]}
                    >
                        <Input.Password placeholder={t('register.passwordPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        label={t('register.confirmPasswordLabel')}
                        name="confirmPassword"
                        rules={[{ required: true, message: t('register.confirmPasswordRequired') }]}
                    >
                        <Input.Password placeholder={t('register.confirmPasswordPlaceholder')} />
                    </Form.Item>
                 
                    <Form.Item
                        label={t('register.a1')}
                        name="inviteCode"
                        rules={[{ required: false, message: t('register.a2') }]}
                    >
                        <Input placeholder={t('register.a2')} />
                    </Form.Item>
                    <Form.Item
                        label={t('register.a3')}
                        name="VerificationCode"
                        rules={[{ required: true, message: t('register.a4') }]}
                    >
                        <div className="flex items-center -mt-1">
                            <Input placeholder={t('register.a4')} /><img className="h-12 ml-1 rounded relative !pointer-events-auto object-cover bg-center " onClick={getRandomCode} src={currentCode?.label} />
                        </div>
                    </Form.Item> 


                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(new Error(t('register.agreementRequired'))),
                            },
                        ]}
                    >
                        <Checkbox>
                            {t('register.agreementText')}
                            <a href="/agreement/privacy" target="_blank" className="ml-1 text-blue-500">
                                《隐私政策》
                            </a>
                        </Checkbox>
                    </Form.Item>


                    <Form.Item>
                        <Button type="submit" className="w-full" loading={loading}>
                            {t('register.registerButton')}
                        </Button>
                    </Form.Item>

                    <div className="flex items-center mb-5 mt-3 justify-center">
                        <div className="text-sm text-gray-500">
                            {t('register.hasAccount')}&nbsp;
                            <Link to="/login" className="text-gray-900">
                                {t('register.login')}
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
