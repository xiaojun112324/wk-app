import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const NewsDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data, loading } = useQuery({
        fetcher: News.getDetail,
        params: { id },
    });
    return <main className=" min-h-screen px-5">
        <AppNav title="消息" />

        <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" />
        <>     <h2 className="py-4 text-xl font-semibold ">{data?.title}</h2>
            <div className=" text-right text-sm text-gray-500">{formatDate(data?.showTime)}</div>
            <div className=" text-sm  leading-6 pb-10 mt-2" dangerouslySetInnerHTML={{ __html: data?.content }}></div></>



    </main>
}

export default NewsDetail;
