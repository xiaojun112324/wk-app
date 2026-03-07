import { Form, Input } from "antd";
import AppNav from "@/components/AppNav";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";

export default function LoginPassword() {
  const [form] = Form.useForm();

  const { mutate, loading } = useMutation({
    fetcher: apiUser.updateUserPassword,
    onSuccess: () => {
      toast.success("登录密码修改成功");
      form.resetFields();
    },
  });

  return (
    <main>
      <AppNav title="修改登录密码" />
      <div className="px-5 mt-6">
        <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
          <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: "请输入旧密码" }]}>
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "新密码至少 6 位" },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请再次输入新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的新密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Button type="submit" className="w-full !text-white" loading={loading}>
            提交
          </Button>
        </Form>
      </div>
    </main>
  );
}
