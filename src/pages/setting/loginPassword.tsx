import { Form, Input } from "antd";
import { Button } from "@/components/Button";
import { Link } from "react-router-dom";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";

export default function LoginPassword() {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const { mutate: updateUserPassword, loading } = useMutation({
        fetcher: apiUser.updateUserPassword,
        onSuccess: () => {
            toast.success(t("LoginPassword.success"));
            form.resetFields(); // 成功后清空表单
        },
    });

    const handleSubmit = (values: any) => {
        console.log("表单提交:", values);
        updateUserPassword({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            passwordType: 0,
        });
    };

    return (
        <main className="">
            <AppNav title="修改登录密码" />


            <div className="mt-6 lg:mt-0 w-full  px-5">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label={t("LoginPassword.oldPassword")}
                        name="oldPassword"
                        rules={[{ required: true, message: t("LoginPassword.enterOldPassword") }]}
                    >
                        <Input.Password placeholder={t("LoginPassword.enterOldPassword")} />
                    </Form.Item>

                    <Form.Item
                        label={t("LoginPassword.newPassword")}
                        name="newPassword"
                        rules={[
                            { required: true, message: t("LoginPassword.enterNewPassword") },
                            { min: 6, message: t("LoginPassword.passwordMinLength") },
                        ]}
                    >
                        <Input.Password placeholder={t("LoginPassword.enterNewPassword")} />
                    </Form.Item>

                    <Form.Item
                        label={t("LoginPassword.confirmPassword")}
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: t("LoginPassword.confirmPasswordMsg") },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t("LoginPassword.passwordMismatch")));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={t("LoginPassword.confirmPasswordMsg")} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="submit" className="w-full" loading={loading}>
                            {t("LoginPassword.submit")}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </main>
    );
}
