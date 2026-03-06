import { Form, Input, Select } from "antd";
import { Button } from "@/components/Button";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";

export default function Withdraw() {
    const [form] = Form.useForm();

    const { mutate: submitWithdraw, loading } = useMutation({
        fetcher: apiUser.withdraw,
        onSuccess: () => {
            toast.success("提交成功");
            form.resetFields();
        },
    });

    return (
        <section>
            <AppNav title="提交提现" />
            <div className="px-5 mt-4">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => submitWithdraw(values)}
                >
                    <Form.Item label="资产" name="asset" initialValue="USDT" rules={[{ required: true }]}>
                        <Select options={[{ label: "USDT", value: "USDT" }, { label: "USDC", value: "USDC" }]} />
                    </Form.Item>

                    <Form.Item label="网络" name="network" initialValue="TRC20" rules={[{ required: true }]}>
                        <Select options={[{ label: "TRC20", value: "TRC20" }, { label: "ERC20", value: "ERC20" }]} />
                    </Form.Item>

                    <Form.Item label="提现金额(CNY)" name="amountCny" rules={[{ required: true, message: "请输入金额" }]}>
                        <Input type="number" placeholder="请输入提现金额" />
                    </Form.Item>

                    <Form.Item label="收款地址" name="receiveAddress" rules={[{ required: true, message: "请输入收款地址" }]}>
                        <Input placeholder="请输入收款地址" />
                    </Form.Item>

                    <Button type="submit" className="w-full" loading={loading}>提交提现</Button>
                </Form>
            </div>
        </section>
    );
}
