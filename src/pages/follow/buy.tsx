import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";
import { apiFollow } from "@/apis/follow";
import { Checkbox, Form, Input, InputNumber, Radio } from "antd";
import { Button } from "@/components/Button";
import clsx from "clsx";
import FollowItems from "./components/FollowItems";
import { useEffect, useMemo, useState } from "react";
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
import CapsuleTabs from "./components/CapsuleTabs";
import { apiUser } from "@/apis/user";
import BigNumber from "bignumber.js";
import { isInRange } from "@/lib/isInRange";
import { formatToWan } from "@/lib/formatToWan";




const FollowBuy = () => {
    const nav = useNavigate();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [currentId, setCurrentId] = useState('');
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const [tab, setTab] = useState('1')
    const [tabs, setTabs] = useState([
        { key: "1", label: "每日托管", des: "申请“每日托管”交易成功后，次日统一由量化策略库严格按照交易策略指令进行卖出。卖出之后，需要再次进行“每日托管”申请，未进行申请，次日没有收益。超短线“托管”收益稳定。" },
        { key: "2", label: "波段托管", des: "“波段托管”资金受量化等级限制，量化等级越高，个人收益越高，且分红更低，统一性强，便于操盘，选择“托管”周期内无需任何操作，且本金与盈利系统自动跟随量化模型指令进行交易，直至所选周期终止之日结束。超强策略布局，实现高额收益。" },
        { key: "3", label: "长线托管", des: '“长线托管”与机构独立操盘，托管权限受量化等级和量化基金账户的活跃度约束，量化等级较高或每日托管连续半年以上将自动解锁，个人收益更高，分红更低，统一性强，便于操盘，选择“托管”周期内无需任何操作，且本金与盈利系统自动复利跟随量化模型指令进行交易，直至所选周期终止之日结束。超强策略布局，实现高额收益。' },
    ])
    const [isOpenBuy, setIsOpenBuy] = useState(false);
    const { data, loading } = useQuery({
        fetcher: apiFollow.getDetail,
        params: { followerId: id },
    });
    const { data: vipData, loading: vipLoading } = useQuery({
        fetcher: apiFollow.listVipConfig,

    });

    const { data: levelData, loading: levelLoading } = useQuery({
        fetcher: apiFollow.getUserLevelInfo,

    });

    const tabObj = useMemo(() => {
        return tabs.find((item: any) => item.key == tab)
    }, [tab, tabs])
    const { mutate: $add, loading: addLoading } = useMutation({
        fetcher: apiFollow.add,
        onSuccess: () => {
            toast.success("成功");
            form.resetFields(); // 成功后清空表单
            nav('/follow/history')

        },
    });

    const options = useMemo(() => {
        if (data?.followerAdvInfoList) {
            return data?.followerAdvInfoList.filter((item: any) => item.type == tab).map((item: any) => ({
                ...item,
                label: item.followTradeDay,
                des: `${formatToWan(item.minFollowAmount)}-${formatToWan(item.maxFollowAmount)}`,
                yieldRate: item.yieldRate,
                value: item.id,
            }))
        }
        return []
    }, [data, tab])

    useEffect(() => {
        if (options?.length > 0 && tab == '1') {
            setCurrentId(options[0]?.id)
        }

    }, [options, tab])
    const currentOption = useMemo(() => {
        return options?.find((item: any) => item.id == currentId)
    }, [options, currentId])


    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        if (!new BigNumber(values.amount).mod(100).isZero()) {
            toast.warning('托管金额必须是100的倍数')
            return
        }
        if (!(options?.length > 0)) {
            toast.warning('未配置周期')
            return

        }
        if (!currentId) {
            toast.warning('请先选择周期')
            return
        }
        if (currentOption?.level) {
            const userLevel = levelData?.vipLevel || 0
            if (currentOption?.level > userLevel) {

                toast.warning('等级不足')
                return
            }
        }
        if (!isInRange(values.amount, currentOption.minFollowAmount, currentOption.maxFollowAmount)) {
            toast.warning(`金额需要在${currentOption.minFollowAmount}-${currentOption.maxFollowAmount}之间`)
            return

        }



        //判断用户余额
     /*    if (new BigNumber(amountInfo?.userCNY || 0).isLessThan(values.amount)) {
            toast.warning('超出余额')
            return
        } */


        $add({
            jsonParamString: JSON.stringify({
                ...values,
                followerId: id,
                followerInfoId: currentId,
                siteLever: 1,//杠杆倍数
            })

        })

    };






    const onFollowChange = (id: string) => {
        setCurrentId(id)
    }
    const onTabChange = (key: any) => {
        setTab(key)
        setCurrentId('')
        form.resetFields();

    }


    return <main className="  px-5  pb-10">
        <AppNav title={tabObj?.label || ''} />
        <CapsuleTabs
            tabs={tabs}
            value={tab}
            onChange={onTabChange}
        />



        <DataState loading={loading} data={data}>
            <section className="mt-5">
                <div className=" text-center flex items-center justify-between mb-5">
                    <div>
                        <div className="text-muted-foreground text-sm mb-1">操盘手</div>
                        <div className=" text-red-600">量化模型</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-sm mb-1">余额</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-sm mb-1">等级</div>
                        <div className=" text-red-600">{levelData?.vipLevel || 0}级策略师</div>
                    </div>
                </div>


                <Form form={form} onFinish={handleFinish} layout="vertical" size="large">

                    <Form.Item
                        label="托管金额（必须是100的整数倍）"
                        name="amount"
                        rules={[{ required: true, message: "请输入托管金额" }]}
                    >
                        <InputNumber className="!w-full" type="number" placeholder={`请输入托管金额`} />

                    </Form.Item>
                    {options?.length > 0 && tab != '1' ? <>
                        <h5>申请周期</h5>
                        <FollowItems options={options} value={currentId} onChange={onFollowChange} className="mb-5" />
                    </> : ''}

                    <Form.Item>
                        <Button
                            full
                            type='submit'
                        >
                            一键托管
                        </Button>
                    </Form.Item>
                    {tab == '3' ? <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('请勾选协议')),
                            },
                        ]}
                    >
                        <Checkbox>
                            我已阅读并同意
                            <a href="/agreement/lang" target="_blank" className="ml-1 text-blue-500">
                                《长线托管内部保密协议》
                            </a>

                        </Checkbox>
                    </Form.Item> : ''}

                </Form>
                <section className="mb-5">
                    <h1 className=" text-green-700">{tabObj?.label || ''}描述</h1>
                    <div className="shadow-sm border border-gray-150 rounded-xl text-sm p-4">
                        {tabObj?.des}

                    </div>
                </section>


            </section>

        </DataState>
        <h1 className=" text-green-700">{tabObj?.label || ''}说明</h1>
        {
            tab == '1' ? <table className="w-full border border-green-800 text-center text-xs text-white">
                <thead className="bg-green-900">
                    <tr>
                        <th className="border border-green-900 px-1 py-2">量化等级</th>
                        <th className="border border-green-900 px-1 py-2">量化有效组</th>
                        <th className="border border-green-900 px-1 py-2">最低资金</th>
                        <th className="border border-green-900 px-1 py-2">最高资金</th>
                        <th className="border border-green-900 px-1 py-2">托管仓位</th>
                    </tr>
                </thead>

                <tbody className="bg-black">
                    {vipData?.records?.map((item: any) => <tr key={item.id}>
                        <td className="border border-green-900 py-2">{item.vipCode}</td>
                        <td className="border border-green-900 py-2">{item.inviteCount}</td>
                        <td className="border border-green-900 py-2">{item.investMin}</td>
                        <td className="border border-green-900 py-2">{item.investMax}</td>
                        <td className="border border-green-900 py-2">{item.positionRatio}%</td>
                    </tr>)}
                </tbody>
            </table> : <table className="w-full border border-green-800 text-center text-xs text-white">
                <thead className="bg-green-900">
                    <tr>
                        <th className="border border-green-900 px-1 py-2">持股周期</th>
                        <th className="border border-green-900 px-1 py-2">最低资金</th>
                        <th className="border border-green-900 px-1 py-2">最高资金</th>
                        <th className="border border-green-900 px-1 py-2">托管仓位</th>
                        <th className="border border-green-900 px-1 py-2">量化分红</th>
                    </tr>
                </thead>

                <tbody className="bg-black">
                    {options?.map((item: any) => <tr key={item.id}>
                        <td className="border border-green-900 py-2">{item.followTradeDay}个交易日</td>
                        <td className="border border-green-900 py-2">{item.minFollowAmount}</td>
                        <td className="border border-green-900 py-2">{item.maxFollowAmount}</td>
                        <td className="border border-green-900 py-2">{item.position}</td>
                        <td className="border border-green-900 py-2">{item.mentorCommissionPercentage}%</td>
                    </tr>)}
                </tbody>
            </table>
        }






    </main>
}

export default FollowBuy;
