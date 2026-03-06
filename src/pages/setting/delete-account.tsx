import {
    Form,
    Input,
} from "antd";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function DeleteAccount() {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const { mutate: logoutUser, loading } = useMutation({
        fetcher: apiUser.logoutUser,
        onSuccess: () => {
            toast.success(t("DeleteAccount.submitSuccess"));
        },
    });

    const handleSubmit = (values: any) => {
        console.log("表单提交:", values);
        logoutUser({
            logoutRemark: values.remark || ""
        });
    };

    return (
        <main className="">
            <section className="">
                <div className="flex items-center justify-between">
                    <div className=" text-lg font-semibold mb-5">
                        <Link to="/setting">{t("DeleteAccount.setting")}</Link>/{t("DeleteAccount.title")}
                    </div>
                    <div className=" text-sm text-gray-800  flex gap-3 "></div>
                </div>
                <div className="border-b border-gray-700 mb-6" />
            </section>
            <div>
                <section className="flex flex-col  lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    <div className="text-sm text-gray-500 leading-6 max-w-md text-center lg:text-left">
                        {t("DeleteAccount.description")}
                    </div>
                    <div className="mt-6 lg:mt-0 w-full max-w-md">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label={t("DeleteAccount.account")}
                                name="account"
                                rules={[{ required: true, message: t("DeleteAccount.enterAccount") }]}
                            >
                                <Input placeholder={t("DeleteAccount.account")} />
                            </Form.Item>

                            <Form.Item
                                label={t("DeleteAccount.reason")}
                                name="remark"
                                rules={[{ required: false }]}
                            >
                                <Input.TextArea
                                    placeholder={t("DeleteAccount.reason")}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="submit" className="w-full" loading={loading}>
                                    {t("DeleteAccount.submit")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        </main>
    );
}
