// lib/api.ts
import { $post } from "@/lib/http";

export const apiOther = {
    getBannerList: async (params: any) => {
        return await $post("/api/customer/banner/getBannerList", { params }, { isCheckToken: false, toast: false });

    },


};
