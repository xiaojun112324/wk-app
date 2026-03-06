import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const Trading = () => {
    const { t } = useTranslation();
    return <main className=" min-h-screen px-5">
        <AppNav title="交易规则" />
        <h2 className="py-4 text-xl font-semibold text-black"></h2>
        <div className=" text-sm text-gray-900 leading-6" >需要提供文案</div>

    </main>
}

export default Trading;
