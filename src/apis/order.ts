
// lib/api.ts
import { $post } from "@/lib/http";

export const apiOrder = {
    selectOrderList: async (params: any) => {
        return await $post("/api/customer/order/selectOrderList", params);

    },
    confirmReceiving: async (params: any) => {
        return await $post("/api/customer/order/confirmReceiving", params);

    },
    selectOrderExpress: async (params: any) => {
        return await $post("/api/customer/order/selectOrderExpress", params);

    },
    refundOrder: async (params: any) => {
        return await $post("/api/customer/order/refundOrder", params);

    },
    selectOrderDetail: async (params: any) => {
        return await $post("/api/customer/order/selectOrderDetail", params);

    },
    addGoodsEvaluation: async (params: any) => {
        return await $post("/api/customer/order/addGoodsEvaluation", params);

    },
    createOrder: async (params: any) => {
        return await $post("/api/customer/order/createOrder", params);

    },
    applyRecharge: async (params: any) => {
        return await $post("/api/customer/order/applyRecharge", params);

    },
    applyWithdraw: async (params: any) => {
        return await $post("/api/customer/order/applyWithdraw", params);

    },
    selectRechargeAddress: async (params: any) => {
        return await $post("/api/customer/order/selectRechargeAddress", params);

    },
    selectWithdrawOrder: async (params: any) => {
        return await $post("/api/customer/order/selectWithdrawOrder", params);

    },
    selectRechargeOrder: async (params: any) => {
        return await $post("/api/customer/order/selectRechargeOrder", params);

    },
    

};
