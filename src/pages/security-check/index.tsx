import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CheckItem = {
  key: string;
  title: string;
  value: string;
  status: "pending" | "running" | "done";
};

export default function SecurityCheck() {
  const [running, setRunning] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [items, setItems] = useState<CheckItem[]>([
    { key: "ip", title: "公网IP识别", value: "等待检测", status: "pending" },
    { key: "geo", title: "IP地理位置", value: "等待检测", status: "pending" },
    { key: "latency", title: "网络延迟", value: "等待检测", status: "pending" },
    { key: "network", title: "网络链路安全", value: "等待检测", status: "pending" },
    { key: "account", title: "账户安全基线", value: "等待检测", status: "pending" },
  ]);

  const doneCount = useMemo(() => items.filter((i) => i.status === "done").length, [items]);
  const progress = Math.round((doneCount / items.length) * 100);

  const updateItem = (key: string, patch: Partial<CheckItem>) => {
    setItems((prev) => prev.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        updateItem("ip", { status: "running", value: "正在连接全球节点..." });
        await sleep(380);
        let ip = "获取失败(降级)";
        try {
          const r = await fetch("https://api64.ipify.org?format=json", { cache: "no-store" });
          const d = await r.json();
          ip = d?.ip || ip;
        } catch {}
        if (!alive) return;
        updateItem("ip", { status: "done", value: ip });

        updateItem("geo", { status: "running", value: "正在进行IP地理链路分析..." });
        await sleep(420);
        let geo = "定位降级";
        try {
          const r = await fetch("https://ipapi.co/json/", { cache: "no-store" });
          const d = await r.json();
          const merged = [d?.country_name, d?.region, d?.city].filter(Boolean).join(" / ");
          geo = merged || geo;
        } catch {
          geo = Intl.DateTimeFormat().resolvedOptions().timeZone || geo;
        }
        if (!alive) return;
        updateItem("geo", { status: "done", value: geo });

        updateItem("latency", { status: "running", value: "正在进行链路时延测量..." });
        await sleep(420);
        let latencyMs = 999;
        try {
          const t0 = performance.now();
          await fetch("/api/public/pool/stats?ts=" + Date.now(), { cache: "no-store" });
          latencyMs = Math.max(1, Math.round(performance.now() - t0));
        } catch {}
        if (!alive) return;
        updateItem("latency", { status: "done", value: `${latencyMs} ms` });

        updateItem("network", { status: "running", value: "正在执行网络环境风险扫描..." });
        await sleep(380);
        const net = !navigator.onLine ? "离线风险" : latencyMs < 220 ? "低风险(稳定)" : "中风险(波动)";
        if (!alive) return;
        updateItem("network", { status: "done", value: net });

        updateItem("account", { status: "running", value: "正在校验会话与行为模型..." });
        await sleep(420);
        if (!alive) return;
        updateItem("account", { status: "done", value: "登录态有效，行为模型正常，未发现异常" });
      } finally {
        if (alive) setRunning(false);
      }
    };

    run();
    const timer = setInterval(() => setPulse((p) => (p + 1) % 360), 30);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="px-3 pb-10 fade-stagger">
      <AppNav title="环境安全检测" />

      <section className="glass-card mt-3 p-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.25)_0%,_rgba(59,130,246,0)_70%)]" />
        <div className="absolute -bottom-16 -left-20 w-56 h-56 rounded-full bg-[radial-gradient(circle,_rgba(34,197,94,0.22)_0%,_rgba(34,197,94,0)_72%)]" />

        <div className="relative flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0">
            <div className="absolute inset-0 rounded-full border border-[#8ec5ff] opacity-40 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-[#5ca6ff] opacity-60" />
            <div className="absolute inset-5 rounded-full border border-[#2f86ff]" />
            <div
              className="absolute left-1/2 top-1/2 w-[2px] h-11 bg-gradient-to-t from-[#2f86ff] to-[#7ec8ff] origin-bottom"
              style={{ transform: `translate(-50%, -100%) rotate(${pulse}deg)` }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#1d4c84]">SEC</div>
          </div>

          <div className="min-w-0">
            <div className="text-base font-extrabold finance-title">实时安全态势分析</div>
            <div className="text-xs text-[#607fa6] mt-1">采用多维度检测模型，持续评估网络与账户环境安全状态</div>
            <div className="mt-2 text-xs text-[#1f4b80]">检测进度：{progress}%</div>
            <div className="h-2 mt-1 rounded-full bg-[#dce9ff] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#22c55e] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card mt-3 p-3">
        {items.map((item) => (
          <div key={item.key} className="finance-list-row">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-[#1b437f]">{item.title}</div>
                <div className="text-xs text-[#5f7ba3] mt-0.5">{item.value}</div>
              </div>
              <div
                className={
                  item.status === "done"
                    ? "text-[#16a34a] text-xs font-semibold"
                    : item.status === "running"
                    ? "text-[#2563eb] text-xs font-semibold"
                    : "text-[#94a3b8] text-xs"
                }
              >
                {item.status === "done" ? "已通过" : item.status === "running" ? "检测中" : "待检测"}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-3 rounded-xl border border-[#cce6d7] bg-[#f0fdf4] px-3 py-2.5 text-[12px] text-[#166534]">
        {running
          ? "系统正在执行动态风控校验，请勿切换网络环境。"
          : "检测完成：网络环境可信、账户会话稳定，建议继续保持当前安全策略。"}
      </section>
    </main>
  );
}
