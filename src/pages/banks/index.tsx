import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { bank } from "@/apis/bank";
import { Button } from "@/components/Button";
import { maskString } from "@/lib/maskString";


const Banks = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data, loading } = useQuery({
        fetcher: bank.getBankInfo,
    });

    return <main className=" min-h-screen px-5">
        <AppNav title="添加银行卡" />

        {loading ? '' :
            <>
                {data?.length > 0 ? <>
                    {data[0]?.status == '0' ? <div className=" text-center text-sm my-4">审核中</div> : ''}
                    {data[0]?.status == '2' ? <div className=" text-center text-sm my-4">审核拒绝：{data[0]?.auditReason}</div> : ''}

                    <div key={data[0].bankId} className=" text-secondary rounded-xl bg-white bg-center bg-cover bg-no-repeat py-7 px-5 bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/bank-card-bg.png')]">
                        <div className="">{data[0].bankName}</div>
                        <div className="my-4 text-xl">{maskString(data[0].bankNo)}</div>
                        <div className="text- text-sm">{data[0].bankAddress}</div>
                        <div className=" text-sm text-gray-500">每人最多绑定一张银行卡,如需更换银行卡请联系客服</div>
                    </div>
                    <Link to={`/banks/bind?id=${data[0].bankId}`} className="mt-10 block">
                        <Button full className="mt-10">修改银行卡</Button></Link>

                </> : <>
                    <img className=" w-40 mx-auto mt-[10vh]" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/bank/icon-bank.png?v=1" />
                    <div className="text-center mt-5">绑定银行卡，开始交易</div>
                    <Link to="/banks/bind" className=" mt-10 block">
                        <Button full className="mt-10">添加</Button></Link>


                </>}
                <section className=" text-sm mt-5 text-muted-foreground">
                    <p>1.新用户注册后必须通过添加银行卡。</p>
                    <p>2.真实姓名必须和绑定银行卡户名一样。</p>
                    <p>3.为了您的跨境结算迅速高效，建议您优先绑定</p>
                    <p>（ 工商银行，建设银行，交通银行，光大银行）</p>
                </section>
            </>
        }







    </main>
}

export default Banks;
