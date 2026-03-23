import { Form, Input } from "antd";
import AppNav from "@/components/AppNav";
import { Button } from "@/components/Button";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { FinanceFormSkeleton } from "@/components/finance-skeleton";
import { toast } from "sonner";

export default function PayPassword() {
  const [form] = Form.useForm();
  const { data: pwdStatus, res: statusRes, initLoading, loading: statusLoading } = useQuery({
    fetcher: apiUser.getWithdrawPasswordStatus,
  });
  const statusLoaded = !initLoading && !statusLoading && Number((statusRes as any)?.code) === 200;
  const hasOldPassword = !!pwdStatus?.hasWithdrawPassword;

  const { mutate, loading } = useMutation({
    fetcher: apiUser.updatewithdrawalpwd,
    onSuccess: () => {
      toast.success("资金密码设置成功");
      form.resetFields();
    },
  });

  return (
    <main>
      <AppNav title="设置/修改资金密码" />
      <div className="px-5 mt-6">
        {initLoading ? (
          <FinanceFormSkeleton rows={3} />
        ) : (
        <>
        <div className="text-xs text-[#5d7ca8] mb-3">
          {!statusLoaded ? "正在加载密码状态..." : hasOldPassword ? "修改资金密码需填写旧资金密码" : "首次设置无需旧资金密码"}
        </div>
        <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
          {statusLoaded && hasOldPassword ? (
            <Form.Item
              label="旧资金密码"
              name="oldPassword"
              rules={[{ required: true, message: "请输入旧资金密码" }]}
            >
              <Input.Password placeholder="请输入旧资金密码" />
            </Form.Item>
          ) : null}

          <Form.Item
            label="新资金密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新资金密码" },
              { min: 6, message: "新资金密码至少 6 位" },
            ]}
          >
            <Input.Password placeholder="请输入新资金密码" />
          </Form.Item>

          <Form.Item
            label="确认新资金密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请再次输入新资金密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的新资金密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新资金密码" />
          </Form.Item>

          <Button type="submit" className="w-full !text-white" loading={loading}>
            提交
          </Button>
        </Form>
        </>
        )}
      </div>
    </main>
  );
}
