import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ORDER_STATE_MAP } from "@/maps";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface OrderCardProps {
  shopName: string;
  status: number;
  productImage: string;
  productTitle: string;
  productDesc: string;
  refundState: number;
  price: number;
  quantity: number;
  onAddToCart?: () => void;
  onSeeOrder?: () => void;
  onChangeAddress?: () => void;
  onContinuePay?: () => void;
  onAddComment?: () => void;
  onSeeAddress?: () => void;
  onCancel?: () => void;
  onRefunds?: () => void;
  confirmReceiving?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  shopName,
  status,
  refundState,
  productImage,
  productTitle,
  productDesc,
  price,
  quantity,
  onAddToCart,
  onChangeAddress,
  onContinuePay,
  onAddComment,
  onSeeOrder,
  onSeeAddress,
  onCancel,
  onRefunds,
  confirmReceiving
}) => {
  const { t } = useTranslation();

  return (
    <div className=" border border-gray-100 p-4 space-y-4">
      {/* 商品信息 */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <div className="overflow-hidden flex items-center">
            <span className="text-sm text-gray-800 font-medium line-clamp-2 flex-1">
              {productTitle}
            </span>
            <span className="text-sm text-[#FE640D]">
              {refundState === 1 ? t("OrderCard.refunded") : (t(ORDER_STATE_MAP[status]) || "-")}
            </span>
          </div>
          <p className="text-xs text-gray-500">{productDesc}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">{price}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onSeeOrder}
          className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
        >
          {t("OrderCard.viewOrder")}
        </button>

        {status === 2 && <>
          <button
            onClick={() => toast.success(t("OrderCard.remindShipping"))}
            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
          >
            {t("OrderCard.remindShipping")}
          </button>
          <button
            onClick={onRefunds}
            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
          >
            {t("OrderCard.requestRefund")}
          </button>
        </>}

        {status === 3 && <>
          <button
            onClick={confirmReceiving}
            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
          >
            {t("OrderCard.confirmReceiving")}
          </button>
        </>}

        {status === 0 && <>
          <button
            onClick={onContinuePay}
            className="px-3 py-1 rounded-md text-sm text-white bg-orange-500 hover:bg-orange-600"
          >
            {t("OrderCard.payNow")}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
          >
            {t("OrderCard.cancelOrder")}
          </button>
        </>}

        {status === 4 && <>
          <button
            onClick={onAddComment}
            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:"
          >
            {t("OrderCard.addComment")}
          </button>
        </>}
      </div>
    </div>
  );
};

export default OrderCard;
