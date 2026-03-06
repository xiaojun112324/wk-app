// store/user.ts
import { connectFactory, useAppContext } from '@/contexts/contextFactory'
import { apiUser } from '@/apis/user'
import { useQuery } from '@/hooks/useQuery'
import BigNumber from 'bignumber.js'

/* =========================
 * 数据结构定义
 * ========================= */

// 单个资产
export interface UserAssetItem {
    tokenName: string
    tokenLogoUrl: string
    userAmount: number
}

// 用户基础信息
export interface UserInfo {
    userId: number
    agentId: number
    agentName: string
    phone: string
    nickName?: string
    realName?: string
    isActive: number //0 待认证 1 待审核 2 认证成功 3 驳回 
    isLock: number
    regTime: number
    idCard: string
    img1Key: string
    img2Key: string
    authMsg: string
    avatar: string
    username:string

}

// 资金概览
export interface UserAmountInfo {
    userAmt: number
    enableAmt: number
    frozenFund: number
    canWithdrawAmt: number
    tradingAmount: number
    totalMarkValue: number

    positionProfitAndLoss: number
    allProfitAndLose: number
    postion_value: number
    userCNYTotal: string
    positionRate: number
}

// Context 最终结构
export interface UserContextValue {
    userInfo?: UserInfo
    amountInfo?: UserAmountInfo
    assets: UserAssetItem[]
    unreadMessageCount: number
    loading: boolean
    refetchHandler?: () => void
}

/* =========================
 * 默认 Store
 * ========================= */

const KEY = 'user'

const defaultStore: UserContextValue = {
    userInfo: undefined,
    amountInfo: undefined,
    assets: [],
    unreadMessageCount: 0,
    loading: true,
    refetchHandler: undefined,
}

/* =========================
 * Provider
 * ========================= */

export const connectUser = connectFactory(KEY, defaultStore)

/* =========================
 * 接口数据 → Store 映射
 * ========================= */

const mapUserResponseToStore = (res: any): Partial<UserContextValue> => {

    return {
        userInfo: {
            username:res.username,
            userId: res.id,
            agentId: res.agentId,
            agentName: res.agentName,
            phone: res.phone,
            nickName: res.nickName ?? undefined,
            realName: res.realName ?? undefined,
            isActive: res.isActive,
            isLock: res.isLock,
            regTime: res.regTime,
            idCard: res.idCard,
            img1Key: res.img1Key,
            img2Key: res.img2Key,
            authMsg: res.authMsg,
            avatar: res.avatarUrl || 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/user-default.jpg',
        },

        amountInfo: {
            userAmt: Number(res.userAmt ?? 0),
            enableAmt: Number(res.enableAmt ?? 0),
            frozenFund: Number(res.frozenFund ?? 0),
            canWithdrawAmt: Number(res.canWithdrawAmt ?? 0),
            tradingAmount: Number(res.tradingAmount ?? 0),
            totalMarkValue: Number(res.totalMarkValue ?? 0),
      
            positionProfitAndLoss: Number(res.positionProfitAndLoss ?? 0),
            allProfitAndLose: Number(res.allProfitAndLose ?? 0),
            postion_value: Number(res.postion_value ?? 0),
            positionRate: Number(res.ositionRate ?? 0),
            userCNYTotal: new BigNumber(res.canWithdrawAmt ?? 0)
                .plus(res.markValue ?? 0)
                .decimalPlaces(2, BigNumber.ROUND_DOWN) // 关键：直接舍去
                .toFixed(2)
        },

        assets: Array.isArray(res.userAsset) ? res.userAsset : [],

        unreadMessageCount: res.unreadMessageCount ?? 0,
    }
}

/* =========================
 * useUserContext
 * ========================= */

export const useUserContext = () => {
    const { store, setStore } = useAppContext<UserContextValue>(KEY)

    const { run, loading: queryLoading } = useQuery({
        fetcher: apiUser.selectUserBase,
        immediate: false,
    })

    const fetchUser = async () => {
        setStore({
            ...store,
            loading: true,
        })

        try {
            const res = await run()
            const mapped = mapUserResponseToStore(res)

            setStore({
                ...store,
                ...mapped,
                loading: false,
                refetchHandler: fetchUser,
            })
        } catch (err) {
            console.error('[fetchUser error]', err)
            setStore({
                ...store,
                loading: false,
                refetchHandler: fetchUser,
            })
        }
    }

    /**
     * 退出登录
     */
    const logout = () => {
        // 清除本地 token / 登录态
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        // 如果使用 cookie，也可以在这里清理
        // 重置 Store
        setStore({
            ...defaultStore,
            loading: false,
        })
        window.location.href = '/login'
    }

    return {
        store,
        loading: store.loading || queryLoading,
        refresh: fetchUser,
        fetchUser,
        logout, // 新增退出登录
    }
}
