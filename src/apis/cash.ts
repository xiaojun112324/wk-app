// lib/api.ts
import { $get } from "@/lib/http";

export const apiCash = {
    fundOrderList: async (params: any = {}) => {
        return await $get("/api/finance/bill/list", params, { toast: false });
    },
    withdrawList: async (params: any = {}) => {
        return await $get("/api/wallet/withdraw/list", params, { toast: false });
    },
    rechargeList: async (params: any = {}) => {
        return await $get("/api/wallet/recharge/list", params, { toast: false });
    },
    inviteRebateList: async (params: any = {}) => {
        return await $get("/api/wallet/invite/rebate/list", params, { toast: false });
    },

};
