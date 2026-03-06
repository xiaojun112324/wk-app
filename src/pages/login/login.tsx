import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, Input, Select, Space, Checkbox } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/user/userContext";
import { useQuery } from "@/hooks/useQuery";
import { apiCommon } from "@/apis/common";
import { useTranslation } from "react-i18next";
import { useRefreshOnLanguageChange } from "@/hooks/useRefreshOnLanguageChange";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Login() {
    const { t } = useTranslation();

    const [formEmail] = Form.useForm();
    const [formPhone] = Form.useForm();
    const nav = useNavigate();
    const [loginType, setLoginType] = useState<"email" | "phone">("email");
    const userContext = useUserContext();
    const { refresh } = userContext;
    const [istap, setIstap] = useState(false); // 安全验证状态


    const { mutate: doLogin, loading } = useMutation({
        fetcher: apiUser.doLogin,
        onSuccess: (res) => {
            console.log(res)
            toast.success(t('login.successMessage'));
            localStorage.setItem('token', res.token);
            const params = new URLSearchParams(location.search);
            const orgUrl = params.get('orgUrl');
            refresh();
            setTimeout(() => {
                if (orgUrl) {
                    window.location.replace(orgUrl);
                } else {
                    window.location.replace('/');
                }
            }, 1200);
        },
    });

    const handleSubmit = (values: any) => {
        if (!istap) {
            toast.warning(t('login.securityCheckRequired'));
            return;
        }
        let payload: any = {};
        payload = {
            account: values.account,
            password: values.password,
        };

        doLogin(payload);
    };

    return (
        <div className=" min-h-full max-w-6xl mx-auto ">
            <section className=" pb-10 ">
                <div className=" px-5 pt-15  font-semibold text-2xl ">
                    <div>Hi</div>
                    <div>欢迎使用～</div>
                </div>
            </section>
            <div className="-mt-10 px-5  rounded-2xl pt-10">
                <Form
                    form={formEmail}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    {/*   */}
                    <Form.Item
                        label={t('login.emailLabel')}
                        name="account"
                        rules={[
                            { required: true, message: t('login.emailRequired') },
                        ]}
                    >
                        <Input
                            placeholder={t('login.emailPlaceholder')}
                        />
                    </Form.Item>


                    <Form.Item
                        label={t('login.passwordLabel')}
                        name="password"
                        rules={[
                            { required: true, message: t('login.passwordRequired') },
                            { pattern: /^[\S]{6,12}$/, message: t('login.passwordPattern') }
                        ]}
                    >
                        <Input.Password placeholder={t('login.passwordPlaceholder')} />
                    </Form.Item>


              

                    <Form.Item label={t("login.securityLabel")}>
                        <AnimatePresence mode="wait">
                            {!istap ? (
                                <motion.div
                                    key="verify"
                                    onClick={() => setIstap(true)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                                    className="
                    relative cursor-pointer overflow-hidden
                    px-3 py-2.5 rounded-sm text-sm
                    flex items-center justify-center gap-2
                 
                "
                                >
                                    {/* 扫描光效 */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />

                                    <ShieldCheck className="w-4 h-4 text-gray-600 relative z-10" />
                                    <span className="relative z-10">
                                        {t("login.securityButton")}
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="
                    relative overflow-hidden
                    px-3 py-2.5 rounded-sm text-sm
                    flex items-center justify-center gap-2
                    bg-green-50 text-green-600
                "
                                >
                                    {/* 成功扩散光 */}
                                    <motion.div
                                        className="absolute w-full h-32 rounded-full bg-green-400/20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 2 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />

                                    <motion.div
                                        initial={{ rotate: -90, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="relative z-10"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                    </motion.div>

                                    <motion.span
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="relative z-10"
                                    >
                                        {t("login.securitySuccess")}
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('请勾选用户服务协议')),
                            },
                        ]}
                    >
                        <Checkbox>
                            {t('register.agreementText')}
                            <a href="/agreement/user" target="_blank" className="ml-1 text-blue-500">
                                《用户协议》
                            </a>
                            <a href="/agreement/privacy" target="_blank" className="ml-1 text-blue-500">
                                《隐私政策》
                            </a>
                        </Checkbox>
                    </Form.Item>


                    <Button type="submit" className="w-full" loading={loading} size="lg">
                        {t('login.loginButton')}
                    </Button>
                    <div className="flex items-center mb-5 mt-3 justify-center">
                        <div className="text-sm text-gray-500">
                            {t('login.noAccount')}&nbsp;
                            <Link to="/register" className="text-gray-900">
                                {t('login.registerQui')}
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
