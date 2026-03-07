import { Form, Input } from "antd";
import AppNav from "@/components/AppNav";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";

export default function PayPassword() {
  const [form] = Form.useForm();

  const { mutate, loading } = useMutation({
    fetcher: apiUser.updatewithdrawalpwd,
    onSuccess: () => {
      toast.success("提现密码设置成功");
      form.resetFields();
    },
  });

  return (
    <main>
      <AppNav title="设置/修改提现密码" />
      <div className="px-5 mt-6">
        <div className="text-xs text-[#5d7ca8] mb-3">首次设置可不填旧提现密码</div>
        <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
          <Form.Item label="旧提现密码（首次可留空）" name="oldPassword">
            <Input.Password placeholder="请输入旧提现密码（首次可留空）" />
          </Form.Item>

          <Form.Item
            label="新提现密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新提现密码" },
              { min: 6, message: "新提现密码至少 6 位" },
            ]}
          >
            <Input.Password placeholder="请输入新提现密码" />
          </Form.Item>

          <Form.Item
            label="确认新提现密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请再次输入新提现密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的新提现密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新提现密码" />
          </Form.Item>

          <Button type="submit" className="w-full !text-white" loading={loading}>
            提交
          </Button>
        </Form>
      </div>
    </main>
  );
}
