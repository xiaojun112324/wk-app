import { Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import { Button } from "@/components/Button";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { apiUser } from "@/apis/user";
import { formatDate } from "@/lib/format-time";

const NETWORK_OPTIONS = [
  { label: "TRC20", value: "TRC20" },
  { label: "ERC20", value: "ERC20" },
  { label: "BTC", value: "BTC" },
];

export default function ReceiveAddressPage() {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const { data: pwdStatus } = useQuery({ fetcher: apiUser.getWithdrawPasswordStatus });
  const {
    data: rows,
    res: addressRes,
    refresh,
    initLoading: addressInitLoading,
    loading: addressLoading,
  } = useQuery({ fetcher: apiUser.getReceiveAddressList });
  const addressLoadedOk = !addressInitLoading && !addressLoading && Number((addressRes as any)?.code) === 200;

  const { mutate: addAddress, loading: addLoading } = useMutation({
    fetcher: apiUser.addReceiveAddress,
    onSuccess: async () => {
      toast.success("收款地址添加成功");
      addForm.resetFields();
      await refresh();
    },
  });

  const { mutate: updateAddress, loading: updateLoading } = useMutation({
    fetcher: apiUser.updateReceiveAddress,
    onSuccess: async () => {
      toast.success("收款地址修改成功");
      setEditOpen(false);
      setCurrentItem(null);
      editForm.resetFields();
      await refresh();
    },
  });

  const { mutate: deleteAddress, loading: deleteLoading } = useMutation({
    fetcher: apiUser.deleteReceiveAddress,
    onSuccess: async () => {
      toast.success("收款地址删除成功");
      setDeleteOpen(false);
      setCurrentItem(null);
      deleteForm.resetFields();
      await refresh();
    },
  });

  return (
    <main className="px-3 pb-8 fade-stagger">
      <AppNav title="收款地址绑定" />

      <section className="glass-card px-4 py-4 mt-3">
        {!pwdStatus?.hasWithdrawPassword ? (
          <div className="mb-3 rounded-lg border border-[#ffd6db] bg-[#fff2f4] px-3 py-2 text-xs text-[#c0354f]">
            未设置资金密码，暂时不能添加收款地址。请先
            <Link className="ml-1 text-[#1a57aa] font-semibold" to="/setting/pay-password">
              去设置资金密码
            </Link>
          </div>
        ) : null}

        <Form
          form={addForm}
          layout="vertical"
          initialValues={{ network: "BTC" }}
          onFinish={(values) => {
            if (!pwdStatus?.hasWithdrawPassword) {
              toast.warning("请先设置资金密码");
              return;
            }
            addAddress(values);
          }}
        >
          <Form.Item label="网络" name="network" rules={[{ required: true, message: "请选择网络" }]}>
            <Select options={NETWORK_OPTIONS} placeholder="请选择网络" />
          </Form.Item>

          <Form.Item label="收款地址" name="receiveAddress" rules={[{ required: true, message: "请输入收款地址" }]}>
            <Input placeholder="请输入收款地址" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input placeholder="例如：币安主账户" />
          </Form.Item>

          <Form.Item label="资金密码" name="fundPassword" rules={[{ required: true, message: "请输入资金密码" }]}>
            <Input.Password placeholder="请输入资金密码" />
          </Form.Item>

          <Button type="submit" className="w-full !text-white" loading={addLoading}>
            添加地址
          </Button>
        </Form>
      </section>

      <section className="glass-card px-4 py-4 mt-3">
        <div className="font-bold finance-title mb-2">已绑定地址</div>
        {!addressLoadedOk ? (
          <div className="text-xs text-[#6a7f9f]">加载中...</div>
        ) : (rows || []).length === 0 ? (
          <div className="text-xs text-[#6a7f9f]">暂无地址</div>
        ) : (
          <div className="space-y-2">
            {(rows || []).map((item: any) => (
              <div key={item.id} className="rounded-lg border border-[#d8e5fb] bg-[#f8fbff] px-3 py-2 text-xs">
                <div className="text-[#133a73] break-all">{item.receiveAddress}</div>
                <div className="mt-1 text-[#456896]">网络：{item.network || "-"}</div>
                <div className="mt-1 text-[#6a7f9f]">备注：{item.remark || "-"}</div>
                <div className="mt-1 text-[#6a7f9f]">最后修改时间：{formatDate(item.updateTime || item.createTime)}</div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="finance-btn-ghost px-3 py-1 rounded-lg"
                    onClick={() => {
                      setCurrentItem(item);
                      editForm.setFieldsValue({
                        id: item.id,
                        network: item.network || "BTC",
                        receiveAddress: item.receiveAddress,
                        remark: item.remark,
                        fundPassword: undefined,
                      });
                      setEditOpen(true);
                    }}
                  >
                    修改
                  </button>
                  <button
                    className="px-3 py-1 rounded-lg border border-[#f3c7ce] text-[#cf3f56] bg-[#fff5f7]"
                    onClick={() => {
                      setCurrentItem(item);
                      deleteForm.setFieldsValue({ id: item.id, fundPassword: undefined });
                      setDeleteOpen(true);
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal
        title="修改收款地址"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setCurrentItem(null);
        }}
        onOk={() => editForm.submit()}
        okText="确认修改"
        cancelText="取消"
        confirmLoading={updateLoading}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={(values) => updateAddress(values)}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="网络" name="network" rules={[{ required: true, message: "请选择网络" }]}>
            <Select options={NETWORK_OPTIONS} placeholder="请选择网络" />
          </Form.Item>
          <Form.Item label="收款地址" name="receiveAddress" rules={[{ required: true, message: "请输入收款地址" }]}>
            <Input placeholder="请输入收款地址" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item label="资金密码" name="fundPassword" rules={[{ required: true, message: "请输入资金密码" }]}>
            <Input.Password placeholder="请输入资金密码" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="删除收款地址"
        open={deleteOpen}
        onCancel={() => {
          setDeleteOpen(false);
          setCurrentItem(null);
        }}
        onOk={() => deleteForm.submit()}
        okText="确认删除"
        cancelText="取消"
        confirmLoading={deleteLoading}
      >
        <div className="text-sm text-[#2d4d78] mb-3">
          确认删除地址：<span className="break-all text-[#133a73]">{currentItem?.receiveAddress || "-"}</span>
        </div>
        <Form form={deleteForm} layout="vertical" onFinish={(values) => deleteAddress(values)}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="资金密码" name="fundPassword" rules={[{ required: true, message: "请输入资金密码" }]}>
            <Input.Password placeholder="请输入资金密码" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
