import { useEffect, useRef } from "react";
import { KLineChartPro, DefaultDatafeed } from "@klinecharts/pro";
import "@klinecharts/pro/dist/klinecharts-pro.css";

const Kchart = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<KLineChartPro | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    chartRef.current = new KLineChartPro({
      container: containerRef.current,

      // 默认交易对信息
      symbol: {
        exchange: "XNYS",
        market: "stocks",
        name: "Alibaba Group Holding Limited American Depositary Shares, each represents eight Ordinary Shares",
        shortName: "BABA",
        ticker: "BABA",
        priceCurrency: "usd",
        type: "ADRC",
      },

      // 默认周期
      period: {
        multiplier: 15,
        timespan: "minute",
        text: "15m",
      },

      // 数据源（Polygon）
      datafeed: new DefaultDatafeed(
        "IR3qS2VjZ7kIDgnlqKxSmCRHqyBaMh9q"
      ),
    });

    return () => {
      /* chartRef.current?.dispose?.(); */
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px" }}
    />
  );
};

export default Kchart;
