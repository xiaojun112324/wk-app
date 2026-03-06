// lib/api.ts
import { $post } from "@/lib/http";

export const apiCommon = {
    selectDictList: async (params: any) => {
        return await $post("/api/admin/common/selectDictList", params);

    },


};
