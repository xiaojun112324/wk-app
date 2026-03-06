import {
    Form,
    Modal,
} from "antd";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/contexts/user/userContext";
import { getKYCStatusText } from "@/maps/kyc";
import { maskString } from "@/lib/maskString";
import { Button } from "@/components/Button";
import AppNav from "@/components/AppNav";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import UploadImg from "@/components/UploadImg";
import { apiUser } from "@/apis/user";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
export default function Setting() {
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
    const { mutate: $upUSerAvatar, loading } = useMutation({
        fetcher: apiUser.updateUserPhoto,
        onSuccess: () => {
            toast.success('修改成功');
            userContext.refresh()

        },
    });



    const onLogOut = () => {
        Modal.confirm({
            title: '确定退出登录？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => { userContext.logout() },
        });
    }
    const onGetAratar = (imglink: any) => {
        console.log(imglink)
         $upUSerAvatar({avatarUrl:imglink})
    }



    return (
        <main className="  min-h-screen px-5 ">
            <AppNav title="个人信息" />
            <div className=" overflow-hidden relative size-28 bg-no-repeat rounded-full mt-10 bg-center bg-contain  mx-auto  mb-10" style={{backgroundImage:`url(${userInfo?.avatar})`}}>
                <UploadImg onChange={onGetAratar} className="absolute top-0 left-0 w-full h-full bg-red z-10 cursor-pointer up-sigel-mode opacity-0" />
                <div className=" absolute bottom-0 left-0 w-full text-center bg-gray-950/30 text-sm pb-1 pt-1">编辑</div>
            </div>

            <div className="flex justify-center items-center">

                {userInfo?.isActive == 2 ? <span className="size-7 -mt-1 mr-1 block bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-auth-success.png')]"></span> : ''}

                {getKYCStatusText(userInfo?.isActive)}

            </div>

            <section className=" text-sm">
                <div className=" rounded-lg  py-4 flex items-center justify-between mt-7 border-b">

                    <span>手机号</span>
                    <span className=" text-accent-foreground">{maskString(userInfo?.phone || '')}</span>
                </div>

                {/*    <div className=" rounded-lg  py-4  flex items-center justify-between border-b">
                    <span>ID</span>
                    <span className=" text-accent-foreground">{(userInfo?.userId || '-')}</span>
                </div> */}

                <Link to="/setting/login-password" className=" rounded-lg  py-4  flex items-center justify-between border-b">
                    <span>登录密码</span>
                    <span className=" text-accent-foreground flex items-center gap-1">修改<ChevronRightIcon className="size-4" /></span>
                </Link>

                <Link to="/setting/pay-password" className=" rounded-lg  py-4  flex items-center justify-between ">
                    <span>交易密码</span>
                    <span className=" text-accent-foreground flex items-center gap-1">修改 <ChevronRightIcon className="size-4" /></span>
                </Link>
            </section>
            <div className="mt-10">
                <Button full onClick={onLogOut}> 退出登录</Button>
            </div>


        </main>
    );
}
