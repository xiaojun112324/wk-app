import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
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



const FollowOrder = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [currentId, setCurrentId] = useState('');
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const { data, loading } = useQuery({
        fetcher: apiFollow.getDetail,
        params: { followerId: id },
    });
    const { mutate: $add, loading: addLoading } = useMutation({
        fetcher: apiFollow.add,
        onSuccess: () => {
            toast.success("跟单成功");
            form.resetFields(); // 成功后清空表单
        },
    });


    const handleFinish = (values: any) => {
        console.log("提交数据:", values);
        if (!currentItem) {
            toast.warning('请选择周期')
            return
        }
        //判断用户余额
        // 判断用户购买金额是否在范围内
        $add({
            jsonParamString: JSON.stringify({
                ...values,
                followerId: id,
                followerInfoId: currentId,
                siteLever: 1,//杠杆倍数
            })

        })

    };

    const currentItem = useMemo(() => {
        if (data?.followerAdvInfoList) {
            return data.followerAdvInfoList.find((item: any) => item.id == currentId)
        }
        return null

    }, [data, currentId])

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
    return <main className=" min-h-screen px-5">
        <AppNav title="一键跟单" />

        <LoadingOrEmpty loading={loading} data={data} className="mt-[20vh]" />
        <section>
            <header className="flex items-center">
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
            </section>
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {/* 单选 */}
                {/* 金额 */}
                <Form.Item
                    label="购买金额"
                    name="amount"
                    rules={[{ required: true, message: "请输入购买金额" }]}
                >
                    <Input type="number" placeholder="请输入购买金额" />

                </Form.Item>
                <div className="flex justify-end">余额<span>123</span></div>

                <FollowItems options={options} value={currentId} onChange={onFollowChange} className="mb-5" />




                <Form.Item>
                    <Button
                        full
                        type='submit'
                    >
                        提交
                    </Button>
                </Form.Item>
            </Form>
            <div dangerouslySetInnerHTML={{ __html: data?.followDescription }}>

            </div>

        </section>




    </main>
}

export default FollowOrder;
