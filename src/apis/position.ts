import { $post, $get } from "@/lib/http";

export const ApiPosition = {
    positionList: async (_params: any) => {
        return await $get("/api/order/machine/list", {}, { toast: false });
    },


};
