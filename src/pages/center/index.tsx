import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import Tool from "./components/Tool";
import { apiFollow } from "@/apis/follow";
import { formatMoney } from "@/lib/formatMoney";


const NewsDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    /*    const { data, loading } = useQuery({
           fetcher: News.getDetail,
           params: { id },
       }); */
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });
    const onCopy = () => {
        copyToClipboard(levelData?.inviteCode).then(() => {
            toast.success('邀请码已复制到剪贴板')
        })
    }
    const onLink = () => {
        nav('/follow/search')
    }
    return <main className=" min-h-screen px-5">
        <AppNav title="量化中心" />
        <section className=" text-white p-4 mb-5 text-sm bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-2.png')] bg-cover bg-no-repeat rounded-xl">
            <div className=" flex mb-5">
                <div>
                    <div >累计收益</div>
                    <div className="font-semibold text-2xl mt-2">{formatMoney(levelData?.inviteTotalProfit || 0)}</div>
                </div>
                <div className="flex-1 text-right">当前等级：{levelData?.vipLevel}级策略师</div>
            </div>

            <div className="flex  justify-between text-center">
                <div>
                    <div className="text-xs mb-3">量化托管团队人数</div>
                    <div>{levelData?.allInviteCount || 0}(有效：{levelData?.inviteCount || 0})</div>
                </div>
                <div>
                    <div className="text-xs mb-3">直属人数</div>
                    <div>{levelData?.directlyCount || 0}</div>
                </div>
                <div>
                    <div className="text-xs mb-3">三日未跟单</div>
                    <div>{levelData?.inactiveCount || 0}</div>
                </div>
                <div>
                    <div className="text-xs mb-3">今日首冲</div>
                    <div>{levelData?.todayRechargeCount || 0}</div>
                </div>
            </div>
            <div className="flex items-center mt-5">
                <div className="flex-1 flex items-center gap-2">量化托管交易邀请码：{levelData?.inviteCode}{levelData?.inviteCode ? <DocumentDuplicateIcon className="size-5" onClick={onCopy} /> : ''}</div>
                {levelData?.inviteCode ? <Link to="/invite" className="border border-white rounded-full px-3 py-1 text-xs">去邀请</Link> : ''}
            </div>

        </section>
        <Tool />


        <div className="my-5">
            <Button full size="lg" onClick={onLink}>申请量化托管</Button>
        </div>
        <h1>量化用户须知</h1>
        <div className=" text-muted-foreground text-sm mt-2">1.个人量化小组所有用户必须完成有效托管以后，系统才会计算有效人数，没有进行量化托管算无效用户。</div>
        <div className=" text-muted-foreground text-sm mt-2">2.为量化模型邀请超过3个有效用户 ，每周都会获得相应比例的量化分红，详细信息请查看量化升级规则和量化专享工资。</div>





    </main>
}

export default NewsDetail;
