import { $post } from "@/lib/http";

export const ApiDzong = {
    getList: async (params?: any) => {
        return await $post("/api/webservice/getliststockdzbypage.do", params);
    },
    addDzOrder: async (params?: any) => {
        return await $post("/api/addDzOrder", params);
    },




};