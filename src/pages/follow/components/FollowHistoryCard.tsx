import { formatDate } from "@/lib/format-time";
import { formatMoney } from "@/lib/formatMoney";

interface OrderCardProps {
    item: any
    onDetail: (item: any) => void
}

export default function FollowHistoryCard({
    item,
    onDetail
}: OrderCardProps) {
    return (
        <div className="w-full max-w-md rounded-xl bg-[#2b2b2b] p-4 text-white shadow-lg">
            {/* 顶部单号 */}
            <div className="mb-3 text-sm text-gray-300">
                单号：<span className="text-white">{item?.id}</span>
            </div>

            {/* 核心卡片 */}
            <div className="rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <div className="text-sm text-gray-400">量化托管周期</div>
                        <div className="text-blue-400 font-semibold text-center">{item?.runTime || '-'}</div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-400">托管资金</div>
                        <div className="text-lg font-bold text-white">{formatMoney(item?.startAmount)}</div>
                    </div>
                </div>

                {/* 白色信息区 */}
                <div className="rounded-lg bg-white p-3 text-gray-800 grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                        <div className="text-gray-400">策略师</div>
                        <div className="font-medium">{item?.mentorName}</div>
                    </div>

                    <div>
                        <div className="text-gray-400">到期时间</div>
                        <div className="font-medium">{formatDate(item?.endTime)}</div>
                    </div>

                    <div>
                        <div className="text-gray-400">量化分红比例</div>
                        <div className="font-medium">{item?.yieldRate}%</div>
                    </div>
                </div>

                {/* 申请时间 */}
                <div className="mt-3 text-xs text-gray-400">
                    申请时间：{formatDate(item?.startTime)}
                </div>
            </div>

            {/* 按钮 */}
            <div className="mt-4 flex justify-end">
                <button onClick={() => onDetail(item)} className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-5 py-2 text-sm font-medium text-white shadow hover:opacity-90">
                    查看详情
                </button>
            </div>
        </div>
    );
}
