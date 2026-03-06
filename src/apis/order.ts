
// lib/api.ts
import { $get, $post } from "@/lib/http";

export const apiOrder = {
    createMachineOrder: async (params: { machineId: number; quantity: number }) => {
        return await $post("/api/order/machine", params);
    },
    buyByP: async (params: { coinSymbol: string; pCount: number | string }) => {
        return await $post("/api/order/machine/buy-by-p", params);
    },
    listMachineOrders: async () => {
        return await $get("/api/order/machine/list", {}, { toast: false });
    },
    machineOrderDetail: async (id: number | string) => {
        return await $get(`/api/order/machine/${id}`, {}, { toast: false });
    },
    sellMachineOrder: async (id: number | string, params: any = {}) => {
        return await $post(`/api/order/machine/${id}/sell`, params);
    },
    cancelMachineOrder: async (id: number | string, params: any = {}) => {
        return await $post(`/api/order/machine/${id}/cancel`, params);
    },

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
