import { $post } from "@/lib/http";

export const apiChat = {
    sendChat: async (params?: any) => {
        return await $post("/chat/sendChat", params);
    },
/*     selectChatDetail: async (params?: any) => {
        return await $post("/api/store/chat/selectChatDetail", params);
    }, */
    selectChatMessage: async (params?: any) => {
        return await $post("/api/store/chat/selectChatMessage", params, { toast: false, isCheckToken: false });
    },


    selectChatList: async (params?: any) => {
        return await $post("/api/admin/chat/selectChatList", params);
    },

    updateChatRemark: async (params?: any) => {
        return await $post("/api/admin/chat/updateChatRemark", params);
    },

    createCustomerImRoom: async (params?: any) => {
        return await $post("/chat/createCustomerImRoom", params);
    },
    selectChatDetail: async (params?: any) => {
        return await $post("/chat/selectChatDetail", params);
    },



};