// store/user.ts
import { connectFactory, useAppContext } from '@/contexts/contextFactory'
import { apiUser } from '@/apis/user'
import { useQuery } from '@/hooks/useQuery'
import BigNumber from 'bignumber.js'
import { clearToken, getToken } from '@/lib/token'

// User asset item
export interface UserAssetItem {
    tokenName: string
    tokenLogoUrl: string
    userAmount: number
}

// User basic info
export interface UserInfo {
    userId: number
    agentId: number
    agentName: string
    phone: string
    nickName?: string
    realName?: string
    isActive: number // 0 pending, 1 reviewing, 2 passed, 3 rejected
    isLock: number
    regTime: number
    idCard: string
    img1Key: string
    img2Key: string
    authMsg: string
    avatar: string
    username: string
}

// User amount info
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

export interface UserContextValue {
    userInfo?: UserInfo
    amountInfo?: UserAmountInfo
    assets: UserAssetItem[]
    unreadMessageCount: number
    loading: boolean
    refetchHandler?: () => void
}

const KEY = 'user'

const defaultStore: UserContextValue = {
    userInfo: undefined,
    amountInfo: undefined,
    assets: [],
    unreadMessageCount: 0,
    loading: true,
    refetchHandler: undefined,
}

export const connectUser = connectFactory(KEY, defaultStore)

const mapUserResponseToStore = (res: any): Partial<UserContextValue> => {
    return {
        userInfo: {
            username: res.username,
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
                .decimalPlaces(2, BigNumber.ROUND_DOWN)
                .toFixed(2)
        },

        assets: Array.isArray(res.userAsset) ? res.userAsset : [],
        unreadMessageCount: res.unreadMessageCount ?? 0,
    }
}

export const useUserContext = () => {
    const { store, setStore } = useAppContext<UserContextValue>(KEY)

    const { run, loading: queryLoading } = useQuery({
        fetcher: apiUser.selectUserBase,
        immediate: false,
    })

    const fetchUser = async () => {
        const token = getToken()
        if (!token) {
            setStore({
                ...defaultStore,
                loading: false,
                refetchHandler: fetchUser,
            })
            return
        }
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

    const logout = () => {
        clearToken()
        localStorage.removeItem('refreshToken')
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
        logout,
    }
}