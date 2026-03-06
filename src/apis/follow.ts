// lib/api.ts
import { $post } from "@/lib/http";

export const apiFollow = {
    getList: async (params: any) => {
        return await $post("/follower/selectFollowerAdvPage", params);

    },
    getDetail: async (params: any) => {
        return await $post("/follower/selectFollowerAdvDetail", params);

    },
    add: async (params: any) => {
        return await $post("/follower/addOrderFollower", params);

    },
    getHistoryList: async (params: any) => {
        return await $post("/follower/selectOrderFollowerPage", params);

    },
    listVipConfig: async (params: any) => {
        return await $post("/follower/listVipConfig.do", params);

    },
    getUserLevelInfo: async (params: any) => {
        return await $post("/user/getUserLevelInfo.do", params);

    },




};
