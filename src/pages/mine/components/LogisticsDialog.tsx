import { useEffect } from "react";
import { Modal, List, Spin } from "antd";
import { useQuery } from "@/hooks/useQuery";
import { apiOrder } from "@/apis/order";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-time";
import { useTranslation } from "react-i18next";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | number; // 根据订单ID获取物流
}

interface LogisticsItem {
  expressContent: string;
  createTime: string; // 秒级时间戳
}

function LogisticsDialog({ isOpen, onClose, orderId }: IProps) {
  const { t } = useTranslation();

  const { data, loading, run } = useQuery<{
    orderId: string | number;
  }, any, LogisticsItem[]>({
    fetcher: (params) => apiOrder.selectOrderExpress(params),
    immediate: false, // 打开弹窗再请求
  });

  useEffect(() => {
    if (isOpen && orderId) {
      run({ orderId });
    }
  }, [isOpen, orderId]);

  return (
    <Modal
      title={t("LogisticsDialog.title")}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : !data || !data.length ? (
        <div className="text-center py-10 text-gray-400">{t("LogisticsDialog.empty")}</div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <div className="flex justify-between">
                <span>{item.expressContent}</span>
                <span className="text-gray-400 text-sm">{formatDate(item.createTime)}</span>
              </div>
            </List.Item>
          )}
        />
      )}

      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onClose}>
          {t("LogisticsDialog.close")}
        </Button>
      </div>
    </Modal>
  );
}

export default LogisticsDialog;
