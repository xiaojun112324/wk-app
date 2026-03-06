import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { usePost } from "@/hooks/useMutationRequest";
import { Button } from "@/components/Button";
import type { FormProps } from "antd";
import { apiOrder } from "@/apis/order";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "react-i18next";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (res: any) => void;
    orderId: number | string;
}

interface RefundFormType {
    refundDesc: string;
    refundRemark: string;
}

function RefundDialog({ isOpen, onClose, onSuccess, orderId }: IProps) {
    const [form] = Form.useForm<RefundFormType>();
    const { t } = useTranslation();

    const { mutate: refundOrder, loading } = useMutation({
        fetcher: apiOrder.refundOrder,
        onSuccess: (res: any) => {
            onSuccess?.(res);
            onClose();
        },
    });

    const onFinish: FormProps<RefundFormType>["onFinish"] = (values) => {
        refundOrder({
            orderId,
            refundDesc: values.refundDesc,
            refundRemark: values.refundRemark,
        });
    };

    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen]);

    return (
        <Modal
            title={t("RefundDialog.title")}
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form<RefundFormType>
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="refundDesc"
                    label={t("RefundDialog.refundReason")}
                    rules={[{ required: true, message: t("RefundDialog.refundReasonPlaceholder") }]}
                >
                    <Input placeholder={t("RefundDialog.refundReasonPlaceholder")} />
                </Form.Item>

                <Form.Item
                    name="refundRemark"
                    label={t("RefundDialog.refundRemark")}
                    rules={[{ required: true, message: t("RefundDialog.refundRemarkPlaceholder") }]}
                >
                    <Input.TextArea placeholder={t("RefundDialog.refundRemarkPlaceholder")} rows={3} />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-2 mt-5">
                        <Button variant="secondary" onClick={onClose}>
                            {t("RefundDialog.cancel")}
                        </Button>
                        <Button type="submit" loading={loading}>
                            {t("RefundDialog.submit")}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RefundDialog;
