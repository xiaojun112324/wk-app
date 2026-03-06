// utils/http.ts
import { DEFAULTLANG } from '@/config/languages'
import axios, {
    AxiosHeaders,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'
import { toast } from 'sonner'
import qs from 'qs'
import { getToken } from '@/lib/token'

let timer: any = null
let toastId: any = null

// =======================
// 类型定义
// =======================
export interface RequestOptions extends AxiosRequestConfig {
    onSuccess?: (res: any) => void
    onError?: (err: any) => void
    toast?: boolean            // 是否使用 toast，默认 true
    isCheckToken?: boolean     // 是否检查 token，默认 true
    isForm?: boolean           // 是否使用 x-www-form-urlencoded，默认 false
}

// =======================
// Axios 实例
// =======================
const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',
    timeout: 10000,
})

// =======================
// Toast 统一处理（覆盖式）
// =======================
const showToast = (message: string) => {
    toastId = toast.warning(message, {
        id: toastId ?? undefined,
        duration: 3000,
    })
}

// =======================
// 请求拦截器
// =======================
http.interceptors.request.use(
    (config) => {
        if (!config.headers) {
            config.headers = new AxiosHeaders()
        }

        const token = getToken();
        const KEY = localStorage.getItem('key');
        const lng = localStorage.getItem('lng') || DEFAULTLANG;

        if (token) {
            (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
        } else {
            (config.headers as AxiosHeaders).delete('Authorization');
        }
        (config.headers as AxiosHeaders).set('Accept-Language', lng);

        // 只有 KEY 和 token 都存在时才设置
        if (KEY && token) {
            (config.headers as AxiosHeaders).set(KEY, token);
        }

        return config
    },
    (error) => Promise.reject(error)
)

// =======================
// 响应拦截器
// =======================
http.interceptors.response.use(
    (res) => res,
    (error) => {
        return Promise.reject(error)
    }
)

// =======================
// 通用 request 方法
// =======================
export const request = async <T = any>(
    config: RequestOptions
): Promise<T> => {
    const useToast = config.toast ?? true
    const isCheckToken = config.isCheckToken ?? true
    const isForm = config.isForm ?? false

    // 仅非 GET 请求才处理 form
    if (
        isForm &&
        config.data &&
        config.method &&
        config.method.toUpperCase() !== 'GET'
    ) {
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        config.data = qs.stringify(config.data)
    }

    try {
        const res: AxiosResponse<any> = await http.request(config)
        const data = res.data;

        if (data?.code === 200) {
            config.onSuccess?.(data?.data)
        } else {
            const msg = data?.msg || data?.message || '请求失败'
            if (useToast) toast.error(msg)
            config.onError?.(msg)
        }
        return data

    } catch (err: any) {
        const msg =
            err.response?.data?.msg ||
            err.message ||
            '网络异常'
        if (useToast) toast.error(msg)
        config.onError?.(err)
        const response = err.response;
        console.log(response?.status)
        if (response?.status == 401) {
            const ignorePaths = ['/login', '/register']
            if (
                !ignorePaths.includes(window.location.pathname) &&
                isCheckToken
            ) {
                const currentPath = encodeURIComponent(
                    window.location.pathname
                )

                window.location.href = `/login?orgUrl=${currentPath}`
            }

        }
        throw err
    }
}

// =======================
// 便捷方法封装
// =======================

// GET：使用 params
export const $get = <T = any>(
    url: string,
    params?: Record<string, any>,
    options?: RequestOptions
) =>
    request<T>({
        ...options,
        url,
        method: 'GET',
        params,
    })

export const $post = <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
) =>
    request<T>({
        ...options,
        url,
        method: 'POST',
        data,
    })

export const $put = <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
) =>
    request<T>({
        ...options,
        url,
        method: 'PUT',
        data,
    })

export const $del = <T = any>(
    url: string,
    options?: RequestOptions
) =>
    request<T>({
        ...options,
        url,
        method: 'DELETE',
    })

export default http
