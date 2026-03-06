import { $post } from "@/lib/http";

export const News = {
    getNewsList: async (params: any) => {
        return await $post("/api/news/getNewsList.do", params);

    },
    getDetail: async (params: any) => {
        return await $post("/api/news/getDetail.do", params);

    },
    getStock: async (params: any) => {
        return await $post("/api/stock/getStock.do", params);

    },





};
