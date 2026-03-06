// lib/api.ts
import { $post, $get } from "@/lib/http";

export const ApiPub = {
    poolStats: async (params: any) => {
        return await $get("/api/public/pool/stats", params,{toast:false});

    },
   

};
