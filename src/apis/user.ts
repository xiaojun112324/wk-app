// lib/api.ts
import { $post, $get } from "@/lib/http";

export const apiUser = {
    doRegister: async (params: any) => {
        return await $post("/api/auth/register", params);

    },
    doLogin: async (params: any) => {
        return await $post("/api/auth/login", params);

    },
    selectUserBase: async (params: any) => {
        return await $get("/api/auth/me", params, { toast: false });

    },
    updateUserPassword: async (params: any) => {
        return await $post("/api/auth/password/login/update", params);

    },

    auth: async (params: any) => {
        return await $post("/user/auth.do", params);

    },
    upAuth: async (params: any) => {
        return await $post("/user/updateuserrealname.do", params);

    },

    updatewithdrawalpwd: async (params: any) => {
        return await $post("/api/auth/password/withdraw/update", params);

    },
    logoutUser: async (params?: any) => {
        return await $post("/api/auth/logout", params || {});

    },
    withdraw: async (params: any) => {
        return await $post("/api/wallet/withdraw/submit", params);

    },
    recharge: async (params: any) => {
        return await $post("/api/wallet/recharge/submit", params);

    },
    updateUserPhoto: async (params: any) => {
        return await $post("/user/updateUserPhoto.do", params);

    },

    getWalletAccount: async () => {
        return await $get("/api/wallet/account", {}, { toast: false });
    },
    getWithdrawPasswordStatus: async () => {
        return await $get("/api/auth/password/withdraw/status", {}, { toast: false });
    },
    getRechargeAddress: async () => {
        return await $get("/api/wallet/recharge/address", {}, { toast: false });
    },
    getRechargeList: async (params?: any) => {
        return await $get("/api/wallet/recharge/list", params || {}, { toast: false });
    },
    getWithdrawList: async (params?: any) => {
        return await $get("/api/wallet/withdraw/list", params || {}, { toast: false });
    },
    getInviteSummary: async () => {
        return await $get("/api/wallet/invite/summary", {}, { toast: false });
    },
    getInviteHierarchy: async () => {
        return await $get("/api/wallet/invite/hierarchy", {}, { toast: false });
    },
    getInviteRebateList: async (params?: any) => {
        return await $get("/api/wallet/invite/rebate/list", params || {}, { toast: false });
    },
    getFinanceAccount: async (params?: { coin?: string }) => {
        return await $get("/api/finance/account", params || {}, { toast: false });
    },
    getFinanceBillList: async (params?: { coin?: string; type?: number }) => {
        return await $get("/api/finance/bill/list", params || {}, { toast: false });
    },
    getSetting: async (_params: any) => {
        // 兼容旧页面调用，返回空配置避免报错
        return { code: 200, msg: "success", data: {} } as any;
    },

};
