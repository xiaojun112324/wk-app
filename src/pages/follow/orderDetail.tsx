import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";

const dataMap: any = {
    "1": {
        name: '托管交易规则',
        img: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/page-1.jpg'
    },
    "2": {
        name: '量化升级规则',
        img: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/page-2.jpg'
    },
    "3": {
        name: '万峰简介',
        img: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/ai-icons/page-3.png'

    }
}
const orderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const data = dataMap[`${id}`]





    return <>
        <AppNav title={data.name} />

        <img src={data.img} className="block w-full max-w-4xl mx-auto" />
    </>
}

export default orderDetail;
