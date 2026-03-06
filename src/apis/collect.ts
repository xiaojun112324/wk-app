

import { $post } from "@/lib/http";

export const apiCollect = {
    getCollectList: async (params: any) => {
        return await $post("/api/customer/goods/getCollectList", params);

    },



};
