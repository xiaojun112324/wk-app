// lib/api.ts
import { $post } from "@/lib/http";

export const apiCash = {
    fundOrderList: async (params: any) => {
        return await $post("/user/cash/fundOrderList.do", params);

    },
    withdrawList: async (params: any) => {
        return await $post("/user/withdraw/list.do", params);

    },
    rechargeList: async (params: any) => {
        return await $post("/user/recharge/list.do", params);

    },


};
