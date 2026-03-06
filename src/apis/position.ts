import { $post, $get } from "@/lib/http";

export const ApiPosition = {
    positionList: async (params: any) => {
        return await $get("/user/position/list.do", params);
    },


};
