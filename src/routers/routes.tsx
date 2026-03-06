import { lazy } from "react";
import { Navigate } from 'react-router-dom';
import NotFound from '../pages/not-found'
/* const Login = lazy(() => import("@/pages/login/login")) */
const Home = lazy(() => import("@/pages/home/home"))
const Mine = lazy(() => import("@/pages/mine/mine"))
const LoginPassword = lazy(() => import('@/pages/setting/loginPassword'))
const PayPassword = lazy(() => import('@/pages/setting/pay-password'))
const Login = lazy(() => import('@/pages/login/login'))
const Register = lazy(() => import('@/pages/register/register'))
const Test = lazy(() => import('@/pages/test'))

const NewsDetail = lazy(() => import('@/pages/news/detail'))
const StockLong = lazy(() => import('@/pages/stock/long'))
const StockTing = lazy(() => import('@/pages/stock/ting'))
const StockZhang = lazy(() => import('@/pages/stock/zhang'))
const StockShi = lazy(() => import('@/pages/stock/shi'))
const Transactions = lazy(() => import('@/pages/transactions/transactions'))
const Banks = lazy(() => import('@/pages/banks'))
const BindBank = lazy(() => import('@/pages/banks/bind'))
const Setting = lazy(() => import("@/pages/setting/index"))

const About = lazy(() => import("@/pages/agreement/about"))
const Help = lazy(() => import("@/pages/agreement/help"))
const Privacy = lazy(() => import("@/pages/agreement/privacy"))
const Trading = lazy(() => import("@/pages/agreement/trading"))
const User = lazy(() => import("@/pages/agreement/user"))
const Kyc = lazy(() => import("@/pages/kyc"))
const StockQuotes = lazy(() => import("@/pages/stock-quotes"))
const Search = lazy(() => import("@/pages/search/search"))
const Position = lazy(() => import("@/pages/position/index"))
const Support = lazy(() => import("@/pages/support"))
const StockK = lazy(() => import("@/pages/stock-k"))
const Phone = lazy(() => import("@/pages/phone"))
const Dzong = lazy(() => import("@/pages/dzong/index"))
const Follow = lazy(() => import("@/pages/follow/index"))
const FollowOrder = lazy(() => import("@/pages/follow/order"))
const FollowHistory = lazy(() => import("@/pages/follow/historry"))
const Ipo = lazy(() => import("@/pages/ipo/index"))
const Fund = lazy(() => import('@/pages/fund/index'))
const FundBuy = lazy(() => import('@/pages/fund/buy'))
const MsgList = lazy(() => import('@/pages/msg/list'))
const Task = lazy(() => import('@/pages/task/index'))
const Sign = lazy(() => import('@/pages/sign/index'))
const Red = lazy(() => import('@/pages/red/index'))
const FundHistory = lazy(() => import('@/pages/fund/historry'))
const FundOrderDetail = lazy(() => import('@/pages/fund/orderDetail'))
const FollowSearch = lazy(() => import('@/pages/follow/search'))
const Invite = lazy(() => import('@/pages/follow/invite'))
const Center = lazy(() => import('@/pages/center/index'))
const Notice = lazy(() => import('@/pages/msg/notice'))
const Earnings = lazy(() => import('@/pages/follow/earnings'))
const Operator = lazy(() => import('@/pages/follow/operator'))

const Withdraw = lazy(() => import('@/pages/withdraw'))
const Deposit = lazy(() => import('@/pages/deposit'))
const FollowHelp = lazy(() => import('@/pages/follow/help'))
const StockHot = lazy(() => import('@/pages/stock/hot'))
const orderDetail = lazy(() => import('@/pages/follow/orderDetail'))
const FollowBuy = lazy(() => import('@/pages/follow/buy'))
const Lang = lazy(() => import('@/pages/agreement/lang'))

const CoinDetail=lazy(() => import('@/pages/coin-detail'))
const Calculator=lazy(()=>import('@/pages/calculator'))

export const routes = [
  {
    path: '/follow/help/:id',
    element: <FollowHelp />,
    title: "帮助",
    isUserInfo: true,
    permission: 'follow:help',
    meta: {},
  },
    {
    path: '/coin-detail/:id',
    element: <CoinDetail />,
    title: "",
    isUserInfo: true,
    permission: 'CoinDetail',
    meta: {},
  },
      {
    path: '/calculator',
    element: <Calculator />,
    title: "",
    isUserInfo: true,
    permission: 'Calculator',
    meta: {},
  },

  {
    path: '/',
    element: <Home />,
    title: "首页",
    permission: 'home',
    isUserInfo: true,
    layout: 'main',
    meta: {},
  },
  {
    path: '/stock/hot',
    element: <StockHot />,
    title: "热门股票",
    permission: 'stock:hot',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/withdraw',
    element: <Withdraw />,
    title: "提款",
    permission: 'withdraw',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/deposit',
    element: <Deposit />,
    title: "入款",
    permission: 'deposit',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/msg/notice',
    element: <Notice />,
    title: "公告",
    permission: 'msg:notice',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/msg/list',
    element: <MsgList />,
    title: "站内消息",
    permission: 'msg:list',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/invite',
    element: <Invite />,
    title: "邀请好友",
    permission: 'invite',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/center',
    element: <Center />,
    title: "团队中心",
    permission: 'center',
    isUserInfo: true,

    meta: {},
  },

  {
    path: '/task',
    element: <Task />,
    title: "任务",
    permission: 'task',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/red',
    element: <Red />,
    title: "红包",
    permission: 'red',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/sign',
    element: <Sign />,
    title: "签到",
    permission: 'sign',
    isUserInfo: true,

    meta: {},
  },
  {
    path: '/dzong',
    element: <Dzong />,
    title: "大宗交易",
    permission: 'dzong',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/fund/buy',
    element: <FundBuy />,
    title: "基金购买",
    permission: 'fund:buy',

    isUserInfo: true,
    meta: {},
  },
  {
    path: '/fund/order/detail',
    element: <FundOrderDetail />,
    title: "基金订单详情",
    permission: 'fund:order:detail',

    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/earnings',
    element: <Earnings />,
    title: "跟单收益",
    permission: 'follow:earnings',

    isUserInfo: true,
    meta: {},
  },

  {
    path: '/ipo',
    element: <Ipo />,
    title: "大宗交易",
    permission: 'ipo',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/fund',
    element: <Fund />,
    title: "基金",
    permission: 'fund',
    layout: 'main',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/fund/history',
    element: <FundHistory />,
    title: "基金记录",
    permission: 'fund:history',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow',
    element: <Follow />,
    title: "跟单",
    permission: 'follow',
    layout: 'main',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/operator',
    element: <Operator />,
    title: "量化策略库",
    permission: 'follow:operator',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/search',
    element: <FollowSearch />,
    title: "跟单搜索",
    permission: 'follow:search',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/history',
    element: <FollowHistory />,
    title: "托管记录",
    permission: 'follow:history',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/buy/:id',
    element: <FollowBuy />,
    title: "跟单购买",
    permission: 'follow:buy',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/follow/order/:id',
    element: <FollowOrder />,
    title: "一键跟单",
    permission: 'follow:order',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/phone',
    element: <Phone />,
    title: "",
    permission: 'phone',
    meta: {},
  },
  {
    path: '/support',
    element: <Support />,
    title: "客服",
    permission: 'support',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/stockk/:code',
    element: <StockK />,
    title: "股票k线",
    isUserInfo: true,
    permission: 'stockk',
    meta: {},
  },
  {
    path: '/stock-quotes',
    element: <StockQuotes />,
    title: "行情",
    permission: 'StockQuotes',
    isUserInfo: true,
    layout: 'main',
    meta: {},
  },
  {
    path: '/position',
    element: <Position />,
    title: "",
    permission: 'position',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/search',
    element: <Search />,
    title: "",
    permission: 'Search',
    meta: {},
  },
  {
    path: '/banks',
    element: <Banks />,
    title: "",
    permission: 'banks',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/banks/bind',
    element: <BindBank />,
    title: "",
    permission: 'banks/bind',
    isUserInfo: true,
    meta: {},
  },

  {
    path: '/transactions',
    element: <Transactions />,
    title: "资金流水",
    permission: 'transactions',
    isUserInfo: true,
    meta: {},
  },




  {
    path: '/mine',
    element: <Mine />,
    title: "我的",
    permission: 'mine',
    isUserInfo: true,
    layout: 'main',
    meta: {},

  },
  {
    path: '/setting',
    element: <Setting />,
    title: "个人信息",
    permission: 'setting:login-password',
    isUserInfo: true,
    meta: {},
  },


  {
    path: '/setting/login-password',
    element: <LoginPassword />,
    title: "登录密码",
    permission: 'setting:login-password',
    isUserInfo: true,
    meta: {},
  },

  {
    path: '/setting/pay-password',
    element: <PayPassword />,
    title: "交易密码",
    permission: 'setting:pay-password',
    isUserInfo: true,
    meta: {},
  },





  {
    path: '/login',
    element: <Login />,
    title: "登录",
    permission: 'login',
    isUserInfo: false,
    meta: {},
  },
  {
    path: '/register',
    element: <Register />,
    title: "注册",
    permission: 'register',
    isUserInfo: false,
    meta: {},
  },


  {
    path: '/test',
    element: <Test />,
    title: "测试",
    permission: 'test',
    isUserInfo: true,
    layout: '',
    meta: {},
  },


  {
    path: '/news/detail/:id',
    key: 'news-detail',
    element: <NewsDetail />,
    title: "消息",
    permission: '',
    isUserInfo: false,
    meta: { layout: "" },
  },

  {
    path: '/stock-long',
    key: 'stock-long',
    element: <StockLong />,
    title: "龙虎榜",
    permission: '',
    isUserInfo: false,
    meta: { layout: "" },
  },
  {
    path: '/stock-ting',
    key: 'stock-ting',
    element: <StockTing />,
    title: "每日停盘",
    permission: '',
    isUserInfo: false,
    meta: { layout: "" },
  },
  {
    path: '/stock-zhang',
    key: 'stock-zhang',
    element: <StockZhang />,
    title: "每日涨停",
    permission: '',
    isUserInfo: false,
    meta: { layout: "" },
  },
  {
    path: '/stock-shi',
    key: 'stock-shi',
    element: <StockShi />,
    title: "",
    permission: '',
    isUserInfo: false,
    meta: { layout: "" },
  },
  {
    path: '/agreement/about',
    element: <About />,
    permission: 'about',
    meta: {},
  },
  {
    path: '/agreement/help',
    element: <Help />,
    permission: 'help',
    meta: {},
  },
  {
    path: '/agreement/lang',
    element: <Lang />,
    permission: 'lang',
    meta: {},
  },

  {
    path: '/agreement/privacy',
    element: <Privacy />,
    permission: 'privacy',
    meta: {},
  },
  {
    path: '/agreement/trading',
    element: <Trading />,
    permission: 'trading',
    meta: {},
  },
  {
    path: '/agreement/user',
    element: <User />,
    permission: 'user',
    meta: {},
  },

  {
    path: '/kyc',
    element: <Kyc />,
    permission: 'kyc',
    isUserInfo: true,
    meta: {},
  },
  {
    path: '/404',
    key: '404',
    element: <NotFound />,
    title: "404",
    permission: '',
    isUserInfo: true,
    meta: { layout: "EmptyLayout" },
  },
  {
    path: '*',
    element: <NotFound />,
    meta: { layout: "EmptyLayout" },
  }]

