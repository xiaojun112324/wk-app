
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useMemo, useState } from "react";
import TabsScroll from "@/components/TabsScroll";
import { useUserContext } from "@/contexts/user/userContext";
import SelectBi from "@/components/SelectBi";
import UserAccount from "@/components/UserAccount";



const Follow = () => {
    const [isOpenBi, setIsOpenBi] = useState(false);
    const [isOpenUsers, setIsOpenUsers] = useState(false);
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page");
       const [tab, setTab] = useState(1);
    const tabs = [
        { key: 1, label: '收益' },
        { key: 2, label: '支付' },
    

    ];
   const onTabChange = (key: any) => {
        setTab(key)
    }
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    console.log(userInfo)


    return <main className="pb-10 text-sm">
        <section className="flex justify-between">
            <div onClick={() => setIsOpenUsers(true)}>{userInfo?.username}</div>
            <div className=" border-1 rounded-full text-xs px-2 py-1" onClick={() => setIsOpenBi(true)}>币</div>
        </section>
        <div className="px-4">
            <section className="flex text-xs text-gray-400 px-4 py-5 rounded ">
                <div className="flex-1 text-center">
                    <div>总收入</div>
                    <div className=" text-blue-700 mb-5"><span className=" text-lg">0.00</span> KDA</div>
                    <div>账户余额</div>
                    <div className=" text-blue-700"><span className=" text-lg">0.00</span> KDA</div>
                </div>
                <div className="flex-1 text-center">
                        <div>总支出</div>
                    <div className=" text-blue-700 mb-5"><span className=" text-lg">0.00</span> KDA</div>
                
                    <div className="mt-5">今日已挖（预估）</div>
                    <div className=" text-blue-700"><span className=" text-lg">0.00</span> KDA</div>
                </div>
            </section>
        </div>


            <section className="flex justify-center">
                <TabsScroll
                   className="w-"
                    tabs={tabs}
                    value={tab}
                    onChange={onTabChange}
                />
            </section>

      



        <SelectBi open={isOpenBi} onOpenChange={setIsOpenBi} />
        <UserAccount open={isOpenUsers} onOpenChange={setIsOpenUsers} />





    </main>
}

export default Follow;
