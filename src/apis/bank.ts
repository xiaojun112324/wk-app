
// lib/api.ts
import { $post } from "@/lib/http";

export const bank = {
    getBankInfo: async (params: any) => {
        return await $post("/user/bank/getBankInfo.do", params);

    },
    add: async (params: any) => {
        return await $post("/user/bank/add.do", params);
    },
    up: async (params: any) => {
        return await $post("/user/bank/update.do", params);
    },
    checkBankCard: async (params: any) => {
        return await $post("/user/bank/checkBankCard.do", params);
    },


};
