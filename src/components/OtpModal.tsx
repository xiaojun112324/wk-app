import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Typography } from "antd";
import { Button } from "@/components/Button"; // ✅ 你自己的按钮组件
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface OtpModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (otp: string) => void;
  serverError?: string | null;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  open,
  onCancel,
  onSuccess,
  serverError = null,
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<any>(null); // ref 用于获取焦点

  // ✅ 打开时自动聚焦第一个输入框
  useEffect(() => {
    if (open) {
      setOtp('');
      setTimeout(() => {
        inputRef.current?.focus(); // 弹窗打开后获取焦点
      }, 0);
    }
  }, [open]);

  const handleChange = (val: string) => {
    setOtp(val);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError(t("OtpModal.enter6Digits"));
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      onSuccess(otp);
    } catch {
      setError(t("OtpModal.verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp("");
    setError(null);
    setLoading(false);
    onCancel();
  };

  return (
    <Modal
      title={t("OtpModal.enterTransactionPassword")}
      open={open}
      onCancel={handleClose}
      footer={null} // ✅ 关闭默认按钮
      centered
      styles={{
        content: { width: 360 },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
          gap: 12,
        }}
      >
        <Input.OTP
          mask="🔒"
          length={6}
          size="large"
          value={otp}
          onChange={handleChange}
        
          status={error || serverError ? "error" : undefined}
          style={{ justifyContent: "center", gap: 8, letterSpacing: 6 }}
        />

        {(error || serverError) && (
          <Text type="danger" style={{ fontSize: 12 }}>
            {error ?? serverError}
          </Text>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            style={{ width: 120 }}
          >
            {t("OtpModal.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            style={{ width: 120 }}
          >
            {t("OtpModal.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;
