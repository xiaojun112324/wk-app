// lib/api.ts
import { $post, $get } from "@/lib/http";

export const ApiPub = {
    poolStats: async (params: any) => {
        return await $get("/api/public/pool/stats", params,{toast:false});
    },
    powRank: async (params?: any) => {
        return await $get("/api/public/rank/pow", params, { toast: false });
    },
    poolRankings: async (params?: any) => {
        return await $get("/api/public/pool/rankings", params, { toast: false });
    },
    calculator: async (params: { symbol: string; hashrate: number | string; unitFactor?: number | string }) => {
        return await $get("/api/public/tool/calculator", params, { toast: false });
    },

};
