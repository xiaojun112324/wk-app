import { $get } from "@/lib/http";

export const apiDashboard = {
    workerStats: async () => {
        return await $get("/api/dashboard/worker/stats", {}, { toast: false });
    },
    hashrateChart: async (timeRange: string = "24h") => {
        return await $get("/api/dashboard/hashrate/chart", { timeRange }, { toast: false });
    },
    revenueOverview: async () => {
        return await $get("/api/dashboard/revenue/overview", {}, { toast: false });
    },
};

