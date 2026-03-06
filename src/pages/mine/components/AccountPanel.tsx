import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface StatItem {
    value: number | string;
    label: string;
}

interface AccountPanelProps {
    balance: number;
    onRecharge?: () => void;
    onWithdraw?: () => void;
    stats?: StatItem[];
}

export const AccountPanel: React.FC<AccountPanelProps> = ({
    balance,
    onRecharge,
    onWithdraw,
    stats = [],
}) => {
    const { t } = useTranslation();
    const [showBalance, setShowBalance] = useState(false);

    return (
        <section className=" rounded-md block sm:flex ">
            {/* 顶部余额 */}
            <div className="flex-1 sm:pr-4 flex">
                <div className="flex flex-col  border-gray-200 border flex-1  py-5 px-4">
                    <div className=" text-center">
                        <div className="text-2xl font-bold">
                            {showBalance ? `$${balance.toFixed(2)}` : "****"}
                        </div>
                        <div className=" text-[16px] text-gray-500 flex items-center justify-center">
                            <span>{t("AccountPanel.balance")}</span>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                {showBalance ? (
                                    <EyeIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="border-b border-gray-200 mt-5 mb-5" />
                    <div className="flex gap-2">
                        {onRecharge && (
                            <Button
                                className="flex-1"
                                variant="default"
                                onClick={onRecharge}
                            >
                                {t("AccountPanel.recharge")}
                            </Button>
                        )}
                        {onWithdraw && (
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={onWithdraw}
                            >
                                {t("AccountPanel.withdraw")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex border py-4 items-center justify-center flex-2">
                {/* 统计项 */}
                {stats.length > 0 && (
                    <div className="flex flex-row w-full">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    flex-1 flex flex-col items-center text-center py-2
                                    ${index < stats.length - 1 ? "sm:border-r sm:border-gray-100" : ""}
                                `}
                            >
                                <div className="text-xl font-semibold">{item.value}</div>
                                <div className="text-gray-500 text-sm">{t(item.label)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
