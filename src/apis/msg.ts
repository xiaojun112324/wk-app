import { $post, $get } from "@/lib/http";

export const ApiMsg = {
    getList: async (params: any) => {
        return await $get("/user/checkAllMessage.do", params);

    },

    getTopArt: async (params: any) => {
        return await $get("/api/art/getTopArt.do", params);//获取公告列表

    },



};
