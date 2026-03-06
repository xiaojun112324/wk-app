import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const Tool = () => {
    return <>
        <h1 className="mt-5">我的工具</h1>
        <section className="flex gap-4 flex-col">
            <Link to="/follow/help/1" className=" flex gap-3 items-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-3.png')] bg-no-repeat bg-cover bg-center rounded-lg px-4 py-4">
                <div className="bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/icon-ai-3.png')] bg-no-repeat bg-cover bg-center size-8"></div>
                <div className="flex-1 text-sm">
                    <div className="">量化托管规则</div>
                    <div className=" text-muted-foreground mt-2">遵循既定标准与执行规范</div>
                </div>
                <div className="border rounded-full text-muted-foreground text-sm border-muted-foreground px-3 py-1">查看详情</div>
            </Link>
            <Link to="/follow/help/2" className=" flex gap-3 items-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-3.png')] bg-no-repeat bg-cover bg-center rounded-lg px-4 py-4">
                <div className="bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/icon-ai-3.png')] bg-no-repeat bg-cover bg-center size-8"></div>
                <div className="flex-1 text-sm">
                    <div className="">量化升级规则</div>
                    <div className=" text-muted-foreground mt-2">聚焦量化人才培育与机制建设</div>
                </div>
                <div className="border rounded-full text-muted-foreground text-sm border-muted-foreground px-3 py-1">查看详情</div>
            </Link>
            <Link to="/follow/earnings" className=" flex gap-3 items-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-3.png')] bg-no-repeat bg-cover bg-center rounded-lg px-4 py-4">
                <div className="bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/icon-ai-3.png')] bg-no-repeat bg-cover bg-center size-8"></div>
                <div className="flex-1 text-sm">
                    <div className="">量化专享工资</div>
                    <div className=" text-muted-foreground mt-2">聚焦量化专享的薪酬体系设计</div>
                </div>
                <div className="border rounded-full text-muted-foreground text-sm border-muted-foreground px-3 py-1">查看详情</div>
            </Link>

        </section>
    </>
}

export default Tool;
