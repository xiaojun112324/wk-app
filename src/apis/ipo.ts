// lib/api.ts
import { $post } from "@/lib/http";

export const ApiIpo = {
    getList: async (params: any) => {
        return await $post("/user/list.do", params);

    },

    add: async (params: any) => {
        return await $post("/user/add.do", params);

    },

};
