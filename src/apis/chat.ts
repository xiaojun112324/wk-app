import { $get, $post } from "@/lib/http";

export const apiChat = {
    initRoom: async () => {
        return await $post("/api/chat/room/init", {}, { toast: false });
    },

    listMessages: async (params?: { roomId: number; afterId?: number; limit?: number }) => {
        return await $get("/api/chat/messages", params, { toast: false });
    },

    sendMessage: async (params?: { roomId: number; messageType?: number; messageContent: string }) => {
        return await $post("/api/chat/send", params, { toast: false });
    },

    markRead: async (roomId: number) => {
        return await $post(`/api/chat/read?roomId=${roomId}`, {}, { toast: false });
    },

    adminRoomList: async (params?: { keyword?: string }) => {
        return await $get("/api/admin/chat/rooms", params, { toast: false });
    },

    adminListMessages: async (params?: { roomId: number; afterId?: number; limit?: number }) => {
        return await $get("/api/admin/chat/messages", params, { toast: false });
    },

    adminSendMessage: async (params?: { roomId: number; messageType?: number; messageContent: string }) => {
        return await $post("/api/admin/chat/send", params, { toast: false });
    },

    adminMarkRead: async (roomId: number) => {
        return await $post(`/api/admin/chat/read?roomId=${roomId}`, {}, { toast: false });
    },

    // compatibility methods for legacy pages/components
    createCustomerImRoom: async () => {
        return await $post("/api/chat/room/init", {}, { toast: false });
    },

    selectChatDetail: async (params?: any) => {
        const roomId = Number(params?.chatRoomId || params?.roomId || 0);
        if (!roomId) {
            return { code: 200, msg: "success", data: { chatMessage: [] } };
        }
        const res: any = await $get("/api/chat/messages", {
            roomId,
            afterId: params?.afterId,
            limit: params?.limit
        }, { toast: false });
        return { ...res, data: { chatMessage: res?.data || [] } };
    },

    sendChat: async (params?: any) => {
        return await $post("/api/chat/send", {
            roomId: params?.chatRoomId || params?.roomId,
            messageType: params?.messageType,
            messageContent: params?.messageContent
        }, { toast: false });
    },

    selectChatMessage: async () => {
        const roomRes: any = await $post("/api/chat/room/init", {}, { toast: false });
        return { code: 200, msg: "success", data: Number(roomRes?.data?.unreadUser || 0) };
    }
};
