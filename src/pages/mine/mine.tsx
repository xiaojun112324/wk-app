import { Pagination } from "@/components/Pagination/Pagination";
import { Children, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUserContext } from "@/contexts/user/userContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { SegmentSwitch } from "@/components/SegmentSwitch";
import { Modal, Spin } from "antd";
import YtoZ from "./components/YToZ";
import ZtoY from "./components/ZtoY";
import { usePolling } from "@/hooks/usePolling";
import { useActivate, useUnactivate } from 'react-activation';
import { formatMoney } from "@/lib/formatMoney";
import clsx from "clsx";
import ProgressBar from "@/components/ProgressBar";
import { maskString } from "@/lib/maskString";
import { apiFollow } from "@/apis/follow";
import { useQuery } from "@/hooks/useQuery";
import BigNumber from "bignumber.js";
import { Skeleton } from "@/components/ui/skeleton";
import { bank } from "@/apis/bank";



type MarketType = 'A' | 'HK'
const NavList = [
    {
        name: '付款设置',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-1.png',
        link: '#',
        type: 'deposit'
    },
    {
        name: '只读账户设置',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-2.png',
        link: '/withdraw'
    },
    {
        name: 'App警报设置',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-3.png',
        link: '/center'
    },
    {
        name: '邮件警报设置',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-7.png',
        link: '/position'
    },
    {
        name: '算力分配',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-4.png',
        link: '/kyc'
    }, {
        name: '收益分配',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-5.png',
        link: '/setting/login-password'
    }
    , {
        name: '只读/免登录',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/min-nav-6.png',
        link: '/setting/pay-password'
    }
   
]
const MenuList = [
    {
        name: 'title',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/mine-menu-4.png',
        link: '/follow/earnings',
    },
    {
        name: 'title',
        icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/mine-nav/mine-menu-1.png',
        link: '/banks',
    },
 
]

export default function Mine() {
    const { t } = useTranslation();
    const [isOpenYtoZ, setIsOpenYtoZ] = useState(false)
    const [isZtoY, setIsZtoY] = useState(false)

    const [showBalance, setShowBalance] = useState(false);
    const [market, setMarket] = useState<MarketType>('A')
    const nav = useNavigate();
    const userContext = useUserContext();
    const { loading: userLoading, userInfo, amountInfo } = userContext.store;
  


    const isLogin = useMemo(() => {
        if (userInfo?.userId) {
            return true
        }
        return false;
    }, [userInfo])

    const onSetting = (link: string) => { if (link) nav(link); }
    const onAuth = () => {

    }
    usePolling(userContext.refresh, { delay: 2000 });

    const onLogOut = () => {
        Modal.confirm({
            title: '确定退出登录？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => { userContext.logout() },
        });
    }

  /*   const onNav = (item: any) => {
        if (item.type == 'logout') {
            onLogOut()
        } else {
            nav(item.link)
        }
    } */
    const onNavLink = (item: any) => {
   //nav(item.link)
    }



    return (
        <>
            <div className="">
                <div className="flex items-center py-4 px-4">
                    <Link to="/setting" className=" w-11 h-11 bg-no-repeat bg-center bg-cover rounded-full inline-block" style={{ backgroundImage: `url(${userInfo?.avatar})` }}></Link>
                    <div className=" pl-2 flex-1">
                        {isLogin ? <><div className=" text-sm ">欢迎使用：{(`${userInfo?.username}`)}</div>
                            </> :

                            <><Link to="/login" className=" !text-white">{t('merchantRegister.login')}</Link></>}

                    </div>
                    <div className=" text-sm flex items-center gap-4">
                        <Link to="/msg/list" className="size-6 bg-no-repeat bg-contain bg-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/mail.png')]"></Link>
                        <Link to="/setting" className="size-6 bg-no-repeat bg-contain bg-center bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-setting.png')]"></Link>

                        {/*      {isLogin && userInfo?.isActive === 0 && (
                            <Link to="/kyc" className="!text-white">
                                去认证
                            </Link>
                        )}

                        {isLogin && userInfo?.isActive === 1 && (
                            <Link to="/kyc" className="!text-white">
                                审核中
                            </Link>
                        )}

                        {isLogin && userInfo?.isActive === 2 && (
                            <div className="flex flex-col items-center justify-center">
                                <span className="size-7 block bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-auth-success.png')]"></span>
                                <span className="!text-white">
                                    已认证
                                </span>
                            </div>
                        )}

                        {isLogin && userInfo?.isActive === 3 && (
                            <Link to="/kyc" className="!text-white">
                                认证被驳回，重新提交
                            </Link>
                        )} */}


                    </div>
                </div>

                {/*          <section className=" px-4 py-4 my-3">

                    <div className="grid grid-cols-4 gap-4 text-center ">
                        <div className="flex flex-col gap-2 items-center justify-center" onClick={() => setIsOpenYtoZ(true)}>
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-password.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">银证转入</div>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center" onClick={() => setIsZtoY(true)}>
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-suo.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">证银转出</div>
                        </div>
                        <Link to="/follow/history" className="flex flex-col gap-2 items-center justify-center">
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-money.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">托管记录</div>
                        </Link>
                        <Link to="/fund/history" className="flex flex-col gap-2 items-center justify-center">
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-bank.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">基金记录</div>
                        </Link>

                    </div>

                </section> */}


                {/*       <section className=" px-4 py-4 my-3">

                    <div className="gap-4 flex justify-between">
                        <Link to="/transactions" className=" py-1 flex gap-1 items-center justify-center border rounded-full flex-1">
                            <div className=" size-4 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-yuan.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">资金记录</div>
                        </Link>
                        <Link to="/follow/earnings" className="flex py-1 gap-1 items-center justify-center border rounded-full flex-1">
                            <div className=" size-4 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-stock.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">量化托管收益</div>
                        </Link>
                        <Link to="/position" className="flex gap-1 py-1 items-center justify-center border rounded-full flex-1">
                            <div className=" size-4 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-date.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">持仓记录</div>
                        </Link>

                    </div>

                </section> */}


                {/*          <section className=" px-4 py-4 my-3">
                    <div className="flex items-center justify-between">
                        <div className=" text-xs font-semibold text-gray-400">我的福利</div>
                        <Link to="/center" className="flex items-center text-xs gap-1">
                            <div>
                                <img className="w-4" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-123.png" /></div>
                            量化托管团队人数：0/0
                            <div><img className="w-2" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-r-2.svg" /></div>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-1  pt-5">
                        <Link to="/task" className="flex justify-between border rounded-lg px-2 py-2">
                            <div className=" text-sm">
                                <div className=" font-semibold text-blue-900">任务中心<span className=" ml-0.5 inline-block bg-center size-3 bg-no-repeat bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-r.svg')]" /></div>
                                <div className=" text-foreground text-xs ">福利天天领</div>
                            </div>
                            <div className=" size-13 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-renwu.png')]"></div>

                        </Link>
                        <Link to="/center" className="flex justify-between border rounded-lg px-2 py-2">
                            <div className=" text-sm">
                                <div className=" font-semibold text-blue-900">团队中心<span className=" ml-0.5 inline-block bg-center size-3 bg-no-repeat bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-r.svg')]" /></div>
                                <div className=" text-foreground text-xs ">邀请好友收益丰富</div>
                            </div>
                            <div className=" size-13 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-term.png')]"></div>

                        </Link>
                        <Link to="/sign" className="flex justify-between border rounded-lg px-2 py-2">
                            <div className=" text-sm">
                                <div className=" font-semibold text-blue-900">签到有礼<span className=" ml-0.5 inline-block bg-center size-3 bg-no-repeat bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-r.svg')]" /></div>
                                <div className=" text-foreground text-xs ">全民好礼赚不停</div>
                            </div>
                            <div className=" size-13 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-qiandao.png')]"></div>

                        </Link>    <Link to="/red" className="flex justify-between border rounded-lg px-2 py-2">
                            <div className=" text-sm">
                                <div className=" font-semibold text-blue-900">我的红包<span className=" ml-0.5 inline-block bg-center size-3 bg-no-repeat bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-r.svg')]" /></div>
                                <div className=" text-foreground text-xs ">红包天天领</div>
                            </div>
                            <div className=" size-13 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-red.png')]"></div>

                        </Link>

                    </div>

                </section> */}

                {/*              <section className=" px-4 py-4 my-3">
                    <div className=" text-xs font-semibold text-gray-400">账户服务</div>
                    <div className="grid grid-cols-4 gap-4 text-center pt-5">
                        <Link to="/setting/login-password" className="flex flex-col gap-2 items-center justify-center">
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-password.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">登录密码</div>
                        </Link>
                        <Link to="/setting/pay-password" className="flex flex-col gap-2 items-center justify-center">
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-suo.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">资金密码</div>
                        </Link>

                        <Link to="/banks" className="flex flex-col gap-2 items-center justify-center">
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-bank.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">绑定银行卡</div>
                        </Link>
                        <Link to="/kyc" className="flex flex-col gap-2 items-center justify-center " >
                            <div className=" size-6 bg-no-repeat bg-center bg-contain bg-[url('https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/A/icons/icon-user.png')]"></div>
                            <div className=" text-sm font-semibold text-gray-900">实名认证

                            </div>

                        </Link>
                    </div>

                </section> */}
                <div>
                    <div></div>

                </div>
  <div className="block-line"/>
                <section className=" px-4 py-4 ">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {NavList.map((item) => <div key={item.name} onClick={() => onNavLink(item)} className="flex flex-col gap-2 items-center justify-center !text-gray-900">
                            <div className={clsx(" size-9 bg-no-repeat bg-center bg-contain")} style={{ backgroundImage: `url(${item.icon})` }}></div>
                            <div className=" text-xs  text-foreground">{item.name}</div>
                        </div>)}


                    </div>

                </section>
                <div className="block-line"/>
                <section className="px-4 py-2">
                    {
                        MenuList.map((item: any) => <div onClick={() => onNavLink(item)} className="flex items-center gap-2 py-2 ">
                            <div className=" size-7 bg-no-repeat bg-center bg-contain" style={{ backgroundImage: `url(${item.icon})` }}></div>
                            <div className="flex-1">{item.name}</div>
                            <div className=" size-5 bg-no-repeat bg-center bg-contain bg-[url(https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/icons/icon-right.png)]"></div>
                        </div>)
                    }
                </section>


            </div >
           


        </ >

    )
}
