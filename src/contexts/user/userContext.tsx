// store/user.ts
import { connectFactory, useAppContext } from '@/contexts/contextFactory'
import { apiUser } from '@/apis/user'
import { useQuery } from '@/hooks/useQuery'
import BigNumber from 'bignumber.js'
import { clearToken, getToken } from '@/lib/token'

/* =========================
 * 鏁版嵁缁撴瀯瀹氫箟
 * ========================= */

// 鍗曚釜璧勪骇
export interface UserAssetItem {
    tokenName: string
    tokenLogoUrl: string
    userAmount: number
}

// 鐢ㄦ埛鍩虹淇℃伅
export interface UserInfo {
    userId: number
    agentId: number
    agentName: string
    phone: string
    nickName?: string
    realName?: string
    isActive: number //0 寰呰璇?1 寰呭鏍?2 璁よ瘉鎴愬姛 3 椹冲洖 
    isLock: number
    regTime: number
    idCard: string
    img1Key: string
    img2Key: string
    authMsg: string
    avatar: string
    username:string

}

// 璧勯噾姒傝
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

// Context 鏈€缁堢粨鏋?
export interface UserContextValue {
    userInfo?: UserInfo
    amountInfo?: UserAmountInfo
    assets: UserAssetItem[]
    unreadMessageCount: number
    loading: boolean
    refetchHandler?: () => void
}

/* =========================
 * 榛樿 Store
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
 * 鎺ュ彛鏁版嵁 鈫?Store 鏄犲皠
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
                .decimalPlaces(2, BigNumber.ROUND_DOWN) // 鍏抽敭锛氱洿鎺ヨ垗鍘?
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

    /**
     * 閫€鍑虹櫥褰?
     */
    const logout = () => {
        // 娓呴櫎鏈湴 token / 鐧诲綍鎬?
        clearToken()
        localStorage.removeItem('refreshToken')
        // 濡傛灉浣跨敤 cookie锛屼篃鍙互鍦ㄨ繖閲屾竻鐞?
        // 閲嶇疆 Store
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
        logout, // 鏂板閫€鍑虹櫥褰?
    }
}
