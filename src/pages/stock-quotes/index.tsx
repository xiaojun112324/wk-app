
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { Chart } from "./components/Chart";
import { useUserContext } from "@/contexts/user/userContext";
import SelectBi from "@/components/SelectBi";
import UserAccount from "@/components/UserAccount";
import { MChart } from "./components/MChart";



const StockQuotes = () => {
    const [isOpenBi, setIsOpenBi] = useState(false);
    const [isOpenUsers, setIsOpenUsers] = useState(false);
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page");

    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    console.log(userInfo)


    return <main className="pb-10 text-sm">
        <section className="flex justify-between">
            <div onClick={() => setIsOpenUsers(true)}>{userInfo?.username}</div>
            <div className=" border-1 rounded-full text-xs px-2 py-1" onClick={() => setIsOpenBi(true)}>币</div>
        </section>
        <Chart />
        <div className="px-4">
            <section className="flex text-xs text-gray-400 px-4 py-5 rounded shadow">
                <div className="flex-1 text-center">
                    <div>24小时平均算力</div>
                    <div className=" text-blue-700 mb-5"><span className=" text-lg">0.00</span> H/s</div>
                    <div>昨日收益</div>
                    <div className=" text-blue-700"><span className=" text-lg">0.00</span> KDA</div>
                </div>
                <div className="flex-1 text-center">
                    <div>矿机</div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">在线<span className=" text-blue-700 text-lg ">0</span></div>
                        <div className="flex items-center gap-1">离线<span className=" text-gray-700 text-lg">0</span></div>
                    </div>
                    <div className="mt-5">今日已挖（预估）</div>
                    <div className=" text-blue-700"><span className=" text-lg">0.00</span> KDA</div>
                </div>
            </section>
        </div>

        <section className="mt-4">
            <h1 className="!px-4 !py-2 bg-gray-100">矿机算力分布</h1>
            <MChart />
        </section>
        <section className="mt-4">
            <h1 className="!px-4 !py-2 bg-gray-100">全网信息</h1>
            <div className="flex flex-col gap-3 px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">全网算力</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">每T日收益</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">当前难度</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">币价</div>
                    <div>12</div>
                </div>
            </div>
            <div className="line my-2" />
            <h1 className="!px-4 !py-2 ">矿池信息</h1>
            <div className="flex flex-col gap-3 px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">矿池算力</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">起付额</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">支付时间</div>
                    <div>12</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" text-xs text-gray-400">大算力用户VIP申请</div>
                    <div>12</div>
                </div>
            </div>
            <div className="line my-2" />
            <h1 className="!px-4 !py-2 ">挖矿地址</h1>
        </section>



        <SelectBi open={isOpenBi} onOpenChange={setIsOpenBi} />
        <UserAccount open={isOpenUsers} onOpenChange={setIsOpenUsers} />





    </main>
}

export default StockQuotes;
