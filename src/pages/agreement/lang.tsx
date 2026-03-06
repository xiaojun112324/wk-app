import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const Lang = () => {
    const { t } = useTranslation();
    return <main className=" min-h-screen px-5 pb-10 leading-6">
        <AppNav title="长线托管内部保密协议" />
        <p className="font-semibold">
            本协议由您与我司在证券业务领域开展包括但不限于长线托管业务操作，且涉及特定的交易日周期等相关规定，
            为保护双方的合法权益，维护证券业务的正常秩序与国家相关法律法规。
            本协议采用甲乙双方称谓：甲方代表我司，乙方代表您/用户。线上签订协议如下：
        </p>

        <section title="一、协议目的">
            本协议旨在确保双方在证券业务合作过程中，对于涉及长线托管业务相关信息的保密，
            同时明确在交易日周期内的操作规范及相关法律责任。
        </section>

        <section title="二、保密信息范围">
            <ul className="list-decimal pl-5 space-y-2">
                <li>
                    关于长线托管的所有信息，包括但不限于投资策略、投资金额、预期收益、风险评估等，
                    特别是涉及长线托管180个交易日和250个交易日周期内的相关操作安排。
                </li>
                <li>
                    在整个交易日周期内，涉及交易的具体日期、交易频率、交易品种等相关交易信息。
                </li>
            </ul>
        </section>

        <section title="三、双方的保密义务">
            <p className="font-medium">1. 甲方义务</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>采取合理的保密措施，确保乙方获取信息的安全性。</li>
                <li>除履行协议或法律要求外，不向第三方披露乙方相关信息。</li>
            </ul>

            <p className="font-medium mt-3">2. 乙方义务</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>不得向任何第三方透露从甲方获取的保密信息。</li>
                <li>不得利用保密信息谋取私利或损害甲方利益。</li>
            </ul>
        </section>

        <section title="四、交易日周期内的操作规范及法律责任">
            <p className="font-medium">1. 长线托管</p>
            <p>
                对于180或250个交易日周期，乙方不得提前终止。
                若违反规定，需自行承担相应法律责任及经济损失。
            </p>

            <p className="font-medium mt-3">2. 一般规定</p>
            <p>
                在交易日周期未结束前，不得终止或提现。
                任何违规行为均视为违约，并需承担全部法律责任。
            </p>
        </section>

        <section title="五、协议的期限">
            本协议通过线上方式签署，托管即生效，
            有效期至所有交易日周期结束并完成结算后终止。
        </section>

        <section title="六、违约责任">
            <ul className="list-decimal pl-5 space-y-2">
                <li>违约方需支付违约金，金额依据损失程度确定。</li>
                <li>若损失超过违约金，仍需承担全部赔偿责任。</li>
            </ul>
        </section>

        <section title="七、争议解决">
            争议应优先协商解决，协商不成可向有管辖权的人民法院提起诉讼。
        </section>

        <section title="八、电子签署与效力">
            本协议可通过电子签名或线上确认方式签署，
            与书面签名具有同等法律效力。
        </section>

    </main>
}

export default Lang;
