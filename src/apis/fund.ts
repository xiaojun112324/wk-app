// lib/api.ts
import { $post } from "@/lib/http";

export const ApiFund = {
    getList: async (params: any) => {
        return await $post("/api/financeProduct/listAll", params);
    },
    getUserAmount: async (params: any) => {
        return await $post("/api/orderFinance/listTotal", params);
    },

    getOrderFinance: async (params: any) => {
        return await $post("/api/orderFinance/listByUserId", params);
    },
    buy: async (params: any) => {
        return await $post("/api/orderFinance/buy", params);
    },

};
