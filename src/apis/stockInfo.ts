import { $post, $get } from "@/lib/http";

export const ApiStock = {
    selectLongHuList: async (params: any) => {
        return await $get("/api/stockInfo/selectLongHuList.do", params);

    },

    selectStopList: async (params: any) => {
        return await $get("/api/stockInfo/selectStopList.do", params);

    },
    selectUpPoolList: async (params: any) => {
        return await $get("/api/stockInfo/selectUpPoolList.do", params);

    },
    selectUp10List: async (params: any) => {
        return await $get("/api/stockInfo/selectUp10List.do", params);
    },
    getOptionStock: async (params: any) => {
        return await $get("/api/stock/getOptionStock.do", params);
    },

    getStock: async (params: any) => {
        return await $get("/api/stock/getStock.do", params);
    },


    getSingleStock: async (params: any) => {
        return await $post("/api/stock/getSingleStock.do", params);
    },
    getKData: async (params: any) => {
        return await $get("/api/stock/getKData.do", params);
    },
    delOptional: async (params: any) => {
        return await $post("/api/stock/delOptional.do", params);
    },
    addOptional: async (params: any) => {
        return await $post("/api/stock/addOptional.do", params);
    },
    buy: async (params: any) => {
        return await $post("/user/buy.do", params);
    },
    sell: async (params: any) => {
        return await $post("/user/sell.do", params);
    },


    selectMarketInfo: async (params: any) => {
        return await $get("/api/stockInfo/selectMarketInfo.do", params);
    },
    selectHotStockList: async (params: any) => {
        return await $get("/api/stockInfo/selectHotStockList.do", params);
    },
    selectHotPlate: async (params: any) => {
        return await $get("/api/stockInfo/selectHotPlate.do", params);
    },

};
