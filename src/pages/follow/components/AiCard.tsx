
import clsx from "clsx";

import { Link } from "react-router-dom";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { toast } from "sonner";
import { formatMoney } from "@/lib/formatMoney";


interface IProps {
    className?: string;
    data?: any

}


export default function AiCard({ className, data }: IProps) {
    const onCopy = () => {
        copyToClipboard(data?.parentInviteCode).then(() => {
            toast.success('邀请码已复制到剪贴板')
        })
    }


    return (

        <section className={clsx("text-white p-4 text-sm bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-2.png')] bg-cover bg-no-repeat rounded-xl", className)}>
            <div className=" flex mb-5">
                <div>
                    <div >累计收益</div>
                    <div className="font-semibold text-2xl mt-2">{formatMoney(data?.inviteTotalProfit || 0)}</div>
                </div>
                <div className="flex-1 text-right">当前等级：{data?.vipLevel || 0}级策略师</div>
            </div>

            <div className="flex  justify-between text-center">
                <div>
                    <div className="text-xs mb-3">量化托管团队人数</div>
                    <div>{data?.allInviteCount || 0}(有效：{data?.inviteCount || 0})</div>
                </div>
                <div>
                    <div className="text-xs mb-3">直属人数</div>
                    <div>{data?.directlyCount || 0}</div>
                </div>
                <div>
                    <div className="text-xs mb-3">三日未跟单</div>
                    <div>{data?.inactiveCount || 0}</div>
                </div>
                <div>
                    <div className="text-xs mb-3">今日首冲</div>
                    <div>{data?.todayRechargeCount || 0}</div>
                </div>
            </div>
            <div className="flex items-center mt-5">
                <div className="flex-1 flex items-center gap-2">量化托管交易邀请码：{data?.parentInviteCode}{data?.parentInviteCode ? <DocumentDuplicateIcon className="size-5" onClick={onCopy} /> : ''}</div>
                {data?.parentInviteCode ? <Link to="/invite" className="border border-white rounded-full px-3 py-1 text-xs">去邀请</Link> : ''}
            </div>

        </section>




    );
}
