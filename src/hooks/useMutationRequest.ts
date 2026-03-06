// utils/useMutationRequest.ts
import { useState, useCallback } from 'react'
import { request, RequestOptions } from "@/lib/http"
import { AxiosResponse } from 'axios'
import { toast } from 'sonner'


interface MutationOptions<P = any, R = any> extends Omit<RequestOptions, 'data' | 'method' | 'url'> {
    onSuccess?: (res: any) => void
    onError?: (err: any) => void
    toast?: boolean
}

export const useMutationRequest = <P = any, R = any>() => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)
    const [data, setData] = useState<R | null>(null)

    const mutate = useCallback(
        async (url: string, method: 'POST' | 'PUT' | 'DELETE' | 'GET', params?: P, options?: MutationOptions<P, R>) => {
            setLoading(true)
            setError(null)
            try {
                let res: any
                switch (method) {
                    case 'POST':
                    case 'PUT':
                        res = await request<R>({ ...options, url, method, data: params })
                        break
                    case 'DELETE':
                        res = await request<R>({ ...options, url, method })
                        break
                    case 'GET':
                    default:
                        res = await request<R>({ ...options, url, method, params })
                }
                setData(res)
            

                return res
            } catch (err: any) {
                setError(err)
           
                throw err
            } finally {
                setLoading(false)
            }
        },
        []
    )

    return { mutate, loading, data, error }
}

// 便捷 Hook
export const usePost = <P = any, R = any>() => {
    const { mutate, loading, data, error } = useMutationRequest<P, R>()
    const post = useCallback((url: string, data?: P, options?: MutationOptions<P, R>) => {
        return mutate(url, 'POST', data, options)
    }, [mutate])
    return { post, loading, data, error }
}

export const useGet = <P = any, R = any>() => {
    const { mutate, loading, data, error } = useMutationRequest<P, R>()
    const get = useCallback((url: string, params?: P, options?: MutationOptions<P, R>) => {
        return mutate(url, 'GET', params, options)
    }, [mutate])
    return { get, loading, data, error }
}

export const usePut = <P = any, R = any>() => {
    const { mutate, loading, data, error } = useMutationRequest<P, R>()
    const put = useCallback((url: string, data?: P, options?: MutationOptions<P, R>) => {
        return mutate(url, 'PUT', data, options)
    }, [mutate])
    return { put, loading, data, error }
}

export const useDel = <P = any, R = any>() => {
    const { mutate, loading, data, error } = useMutationRequest<P, R>()
    const del = useCallback((url: string, options?: MutationOptions<P, R>) => {
        return mutate(url, 'DELETE', undefined, options)
    }, [mutate])
    return { del, loading, data, error }
}
