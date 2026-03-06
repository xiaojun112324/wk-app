import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { apiFollow } from "@/apis/follow";
import { Form, Input, Radio } from "antd";
import { Button } from "@/components/Button";
import clsx from "clsx";
import FollowItems from "./components/FollowItems";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/user/userContext";
import { useMutation } from "@/hooks/useMutation";
import DataState from "@/components/DataState";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "@/lib/copyToClipboard";
import AiCard from "./components/AiCard";
import Buy from './components/Buy';
import Tool from "../center/components/Tool";
import { formatMoney } from "@/lib/formatMoney";



const FollowOrder = () => {
    const nav = useNavigate();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [currentId, setCurrentId] = useState('');
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const [isOpenBuy, setIsOpenBuy] = useState(false);
    const { data, loading } = useQuery({
        fetcher: apiFollow.getDetail,
        params: { followerId: id },
    });
    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });





    const currentItem = useMemo(() => {
        if (data?.followerAdvInfoList) {
            return data.followerAdvInfoList[0]
        }
        return null

    }, [data])

    const options = useMemo(() => {
        if (data?.followerAdvInfoList) {
            return data?.followerAdvInfoList.map((item: any) => ({
                label: item.followTradeDay,
                des: `${item.minFollowAmount}-${item.maxFollowAmount}`,
                value: item.id
            }))
        }
        return []
    }, [data])
    const onFollowChange = (id: string) => {
        setCurrentId(id)
    }
    const onApply = () => {
        /*     setIsOpenBuy(true) */
        nav(`/follow/buy/${id}`)
    }


    return <main className="  px-5 pt-5 pb-10">
        <AppNav title="量化托管" right={<Link to="/follow/history" className=" text-xs text-muted-foreground">我的托管</Link>} />

        <DataState loading={loading} data={data}>
            <section>

                <section className={clsx("text-white p-4 text-sm bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/card-bg-2.png')] bg-cover bg-no-repeat rounded-xl")}>
                    <div className=" flex mb-5">
                        <div>
                            <div>总收益</div>
                            <div className="font-semibold text-2xl mt-2">{formatMoney(levelData?.ProfitAmount || 0)}</div>
                        </div>
                        {/*  <div className="flex-1 text-right">当前等级：0级策略师</div> */}
                    </div>

                    <div className="flex  justify-between text-center">
                        <div>
                            <div className="text-xs mb-3">今日收益</div>
                            <div>{formatMoney(levelData?.todayProfitAmount || 0)}</div>
                        </div>
                        <div>
                            <div className="text-xs mb-3">量化托管总额</div>
                            <div>{formatMoney(levelData?.followerTotalAmount || 0)}</div>
                        </div>
                        <div>
                            <div className="text-xs mb-3">量化托管总数</div>
                            <div>{levelData?.followerCount}</div>
                        </div>

                    </div>


                </section>
                {/*    <header className="flex items-center">
                    <div className="bg-no-repeat bg-cover bg-center size-15 rounded-lg mr-2" style={{ backgroundImage: `url(${data?.mentorAvatarUrl})` }}></div>
                    <div className="flex flex-col gap-0.5">
                        <strong className="">{data?.mentorName}</strong>
                        <div className="text-xs text-gray-500">{data?.mentorTitle}</div>
                    </div>
                </header>
                <section className=" flex flex-col gap-2 py-4 ">
                    <div className="flex items-center">
                        <div className=" text-gray-500 text-sm">购买周期</div>
                        <div className="flex-1 text-right">{currentItem?.followTradeDay || '-'}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500 text-sm">最低购买金额</div>
                        <div className="flex-1 text-right text-sm">{currentItem?.minFollowAmount || '-'}</div>
                    </div>
                    <div className="flex items-center">
                        <div className=" text-gray-500 text-sm">最高购买金额</div>
                        <div className="flex-1 text-right">{currentItem?.maxFollowAmount || '-'}</div>
                    </div>
                </section> */}
                {/*    <Form form={form} onFinish={handleFinish} layout="vertical">
          
                    <Form.Item
                        label="购买金额"
                        name="amount"
                        rules={[{ required: true, message: "请输入购买金额" }]}
                    >
                        <Input type="number" placeholder="请输入购买金额" />

                    </Form.Item>
                    <div className="flex justify-end">余额：{userLoading ? <Skeleton className="w-10" /> : <span>{amountInfo?.userCNY || 0}</span>}</div>

                    <FollowItems options={options} value={currentId} onChange={onFollowChange} className="mb-5" />




                    <Form.Item>
                        <Button
                            full
                            type='submit'
                        >
                            申请量化托管
                        </Button>
                    </Form.Item>
                </Form> */}
                {/*    <div dangerouslySetInnerHTML={{ __html: data?.followDescription }}>

                </div> */}


            </section>
            <section className="py-5">
                <Tool />
            </section>
            <Button full className="my-5" onClick={onApply}>申请量化托管</Button>
            <section className="mt-5">
                <h1 className="mb-3">我的量化小组</h1>
                <AiCard data={levelData} />

            </section>
            <section className="mt-5">
                <h1 className="mb-3">量化用户须知</h1>
                <p className=" text-sm text-muted-foreground">1.个人量化小组所有用户必须完成有效托管以后，系统才会计算有效人数，没有进行量化托管算无效用户。</p>
                <p className=" text-sm text-muted-foreground">2.为量化模型邀请超过3个有效用户 ，每周都会获得相应比例的量化分红，详细信息请查看量化升级规则和量化专享工资。</p>
            </section>

        </DataState>





    </main>
}

export default FollowOrder;
