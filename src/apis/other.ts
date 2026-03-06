// lib/api.ts
import { $get } from "@/lib/http";

export const apiOther = {
    getBannerList: async () => {
        return await $get("/api/public/banner/list", {}, { isCheckToken: false, toast: false });
    },
};
