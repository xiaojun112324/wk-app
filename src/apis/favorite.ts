import { $del, $get, $post } from "@/lib/http";

export const ApiFavorite = {
  list: async () => {
    return await $get("/api/favorite/list", {}, { toast: false });
  },

  check: async (symbol: string) => {
    return await $get("/api/favorite/check", { symbol }, { toast: false });
  },

  add: async (symbol: string) => {
    return await $post(`/api/favorite/${encodeURIComponent(symbol)}`, {}, { toast: false });
  },

  remove: async (symbol: string) => {
    return await $del(`/api/favorite/${encodeURIComponent(symbol)}`, { toast: false });
  },
};

