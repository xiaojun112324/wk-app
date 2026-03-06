import { useEffect, useMemo, useRef, useState } from "react";
import IntervalTab from "./IntervalTab";
import { useQuery } from "@/hooks/useQuery";
import { ApiStock } from "@/apis/stockInfo";
import {
  createChart,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  UTCTimestamp,
  createTextWatermark,
  BarData,
} from "lightweight-charts";
import { usePolling } from "@/hooks/usePolling";

const colors = {
  red: "#f5222d",
  green: "#52c41a",
  blue: "#1890ff",
  gray: "#888888",
};

const stockType = "in";
type IntervalKey = "D" | "W" | "M" | "1" | "5" | "30";

interface IProps {
  stockCode: string | number;
}

interface IKlineItem {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

const calculateATR = (
  data: IKlineItem[],
  period = 14
): { time: UTCTimestamp; value: number }[] => {
  if (!data || data.length <= period) return [];

  const atr: { time: UTCTimestamp; value: number }[] = [];
  let prevAtr = 0;

  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].h - data[i].l,
      Math.abs(data[i].h - data[i - 1].c),
      Math.abs(data[i].l - data[i - 1].c)
    );

    if (i === period) {
      let sumTr = 0;
      for (let j = 1; j <= period; j++) {
        sumTr += Math.max(
          data[j].h - data[j].l,
          Math.abs(data[j].h - data[j - 1].c),
          Math.abs(data[j].l - data[j - 1].c)
        );
      }
      prevAtr = sumTr / period;
    } else if (i > period) {
      prevAtr = (prevAtr * (period - 1) + tr) / period;
    }

    if (i >= period) {
      atr.push({ time: data[i].t as UTCTimestamp, value: prevAtr });
    }
  }

  return atr;
};

const Kchart = ({ stockCode }: IProps) => {
  const [interval, setInterval] = useState<IntervalKey>("D");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const kSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeries = useRef<ISeriesApi<"Histogram"> | null>(null);
  const atrSeries = useRef<ISeriesApi<"Line"> | null>(null);

  const [height, setHeight] = useState(window.innerHeight - 280);

  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight - 280);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { data: KlineData, run, refresh } = useQuery({
    fetcher: ApiStock.getKData,
    params: { pid: stockCode, interval, stockType },
    immediate: false,
  });

  useEffect(() => {
    if (stockCode && interval) {
      run({ pid: stockCode, interval, stockType });
    }
  }, [stockCode, interval, run]);

  usePolling(refresh, { delay: 2000 });

  const intervals = [
    { key: "D", label: "日" },
    { key: "W", label: "周" },
    { key: "M", label: "月" },
    { key: "1", label: "1分" },
    { key: "5", label: "5分" },
    { key: "30", label: "30分" },
  ];

  const onIntervalChange = (key: any) => setInterval(String(key) as IntervalKey);

  const candleData = useMemo(() => {
    if (!KlineData?.length) return [];
    return KlineData
      .slice()
      .sort((a:any, b:any) => a.t - b.t)
      .map((item:any) => ({
        time: item.t,
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.v, // 保存 volume 方便 tooltip 使用
      }));
  }, [KlineData]);

  const volumeData = useMemo(() => {
    if (!KlineData?.length) return [];
    return KlineData.map((item:any) => ({
      time: item.t,
      value: item.v,
      color: item.c > item.o ? colors.red : colors.green,
    }));
  }, [KlineData]);

  const atrData = useMemo(() => {
    if (!KlineData?.length) return [];
    return calculateATR(KlineData);
  }, [KlineData]);

  // ---------- 初始化图表 ----------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: "#ffffff",
        background: { type: ColorType.Solid, color: "#0d1117" },
        panes: { separatorColor: "#222222", separatorHoverColor: "#333333", enableResize: false },
      },
      grid: { vertLines: { color: "#222222" }, horzLines: { color: "#222222" } },
      rightPriceScale: { borderColor: "#555555" },
      timeScale: { borderColor: "#555555" },
    });

    chartRef.current = chart;

    kSeries.current = chart.addSeries(CandlestickSeries, {
      upColor: colors.red,
      borderUpColor: colors.red,
      downColor: colors.green,
      borderDownColor: colors.green,
      wickUpColor: colors.red,
      wickDownColor: colors.green,
    }, 0);

    volumeSeries.current = chart.addSeries(HistogramSeries, { priceFormat: { type: "volume" }, base: 0 }, 1);
    atrSeries.current = chart.addSeries(LineSeries, { color: colors.blue, lineWidth: 1 }, 2);

    chart.timeScale().applyOptions({ barSpacing: 10 });

    const panes = chart.panes();
    createTextWatermark(panes[1], { horzAlign: "left", vertAlign: "top", lines: [{ text: "VOLUME", color: "rgba(255,255,255,0.6)", fontSize: 12 }] });
    createTextWatermark(panes[2], { horzAlign: "left", vertAlign: "top", lines: [{ text: "ATR (14)", color: "rgba(255,255,255,0.6)", fontSize: 12 }] });

    // ---------- Tooltip ----------
    const container = chartContainerRef.current;
    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
      position:absolute; display:none; padding:8px; font-size:12px; text-align:left; z-index:1000;
      background:#0d1117; color:white; border:1px solid ${colors.blue}; border-radius:2px;
      font-family:-apple-system,BlinkMacSystemFont,'Trebuchet MS',Roboto,Ubuntu,sans-serif;
      pointer-events:none;
    `;
    container.appendChild(tooltip);

    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0 ||
          param.point.x > container.clientWidth || param.point.y > container.clientHeight) {
        tooltip.style.display = "none";
        return;
      }

      const rawData = param.seriesData.get(kSeries.current!);
      if (!rawData || !("close" in rawData)) {
        tooltip.style.display = "none";
        return;
      }

      const data = rawData as BarData & { volume?: number };
      tooltip.style.display = "block";
      tooltip.innerHTML = `
        <div style="font-weight:bold; color:${colors.blue}">K线</div>
        <div>O: ${data.open}</div>
        <div>H: ${data.high}</div>
        <div>L: ${data.low}</div>
        <div>C: ${data.close}</div>
        <div>V: ${data.volume ?? "-"}</div>
        <div>${param.time}</div>
      `;

      // tooltip 位置
      const y = kSeries.current!.priceToCoordinate(data.close);
      if (y === null) return;

      let left = param.point.x - 50;
      left = Math.max(0, Math.min(container.clientWidth - 120, left));

      let top = y - 80 - 10;
      if (top < 0) top = y + 10;
      top = Math.max(0, Math.min(container.clientHeight - 80, top));

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });

    return () => chart.remove();
  }, []);

  // ---------- 数据更新 ----------
  useEffect(() => {
    if (candleData.length && kSeries.current) kSeries.current.setData(candleData);
    if (volumeData.length && volumeSeries.current) volumeSeries.current.setData(volumeData);
    if (atrData.length && atrSeries.current) atrSeries.current.setData(atrData);
  }, [candleData, volumeData, atrData]);

  return (
    <div className="py-2">
      <IntervalTab tabs={intervals} value={interval} onChange={onIntervalChange} />
      <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
};

export default Kchart;
