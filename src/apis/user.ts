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
        return await $get("/user/updatePwd.do", params);

    },

    auth: async (params: any) => {
        return await $post("/user/auth.do", params);

    },
    upAuth: async (params: any) => {
        return await $post("/user/updateuserrealname.do", params);

    },

    updatewithdrawalpwd: async (params: any) => {
        return await $post("/user/updatewithdrawalpwd.do", params);

    },
    logoutUser: async (params: any) => {
        return await $post("/api/customer/user/logoutUser", params);

    },
    withdraw: async (params: any) => {
        return await $post("/user/withdraw/outMoney.do", params);

    },
    recharge: async (params: any) => {
        return await $post("/api/recharge/add.do", params);

    },
    updateUserPhoto: async (params: any) => {
        return await $post("/user/updateUserPhoto.do", params);

    },

    getSetting: async (params: any) => {
        return await $post("/api/admin/getSetting.do", params);

    },

};
