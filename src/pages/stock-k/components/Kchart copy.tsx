import { useEffect, useMemo, useState } from "react";
import IntervalTab from "./IntervalTab";
import { useQuery } from "@/hooks/useQuery";
import { ApiStock } from "@/apis/stockInfo";
import {
  Chart,
  Pane,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  TimeScale,
  TimeScaleFitContentTrigger,
  WatermarkText,
} from "lightweight-charts-react-components";
import { usePolling } from "@/hooks/usePolling";
import { Spin } from "antd";

// K线涨跌颜色
const colors = {
  red: "#f5222d",
  green: "#52c41a",
  blue: "#1890ff",
  gray: "#999999",
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
  vo?: number;
}

// ---------- 工具函数 ----------

// 统一 time 为秒级 UTCTimestamp（防止白屏）
const normalizeTime = (t: number) => {
  return t > 1e12 ? Math.floor(t / 1000) : t;
};

// ATR 计算（返回值保证 value 为 number）
const calculateATR = (data: IKlineItem[], period: number = 14) => {
  if (!data || data.length <= period) return [];

  const atr: { time: number; value: number }[] = [];

  let prevAtr = 0;

  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].h - data[i].l,
      Math.abs(data[i].h - data[i - 1].c),
      Math.abs(data[i].l - data[i - 1].c)
    );

    if (i === period) {
      // 计算第一个 ATR
      let sumTr = 0;
      for (let j = 1; j <= period; j++) {
        const trj = Math.max(
          data[j].h - data[j].l,
          Math.abs(data[j].h - data[j - 1].c),
          Math.abs(data[j].l - data[j - 1].c)
        );
        sumTr += trj;
      }
      prevAtr = sumTr / period;
      atr.push({ time: data[i].t, value: prevAtr });
    } else if (i > period) {
      prevAtr = (prevAtr * (period - 1) + tr) / period;
      atr.push({ time: data[i].t, value: prevAtr });
    }
    // 前期不足 period 的数据不 push，可以选择不显示
  }

  return atr;
};


// ---------- 组件 ----------

const Kchart = ({ stockCode }: IProps) => {
  const [interval, setInterval] = useState<IntervalKey>('D');
  const [intervalLoading, setIntervalLoading] = useState(false);


  const { data: KlineData, run, refresh, initLoading, loading: chartLoading } = useQuery({
    fetcher: ApiStock.getKData,
    params: { pid: stockCode, interval, stockType },
    immediate: false,
  });
  const loading = useMemo(() => {
    //只有在主动切换时loading，解决试图不更新的问题
    if (intervalLoading) {
      return chartLoading
    }
    return false

  }, [chartLoading, intervalLoading])

  useEffect(() => {
    if (!chartLoading) {
      setIntervalLoading(false)
    }


  }, [chartLoading])




  // 拉取数据
  useEffect(() => {
    if (stockCode && interval) {
      run({ pid: stockCode, interval, stockType });
    }
  }, [stockCode, interval, run]);

  // polling（跟随 interval / stockCode 生命周期）

  usePolling(refresh, { delay: 2000 });
  const intervals = [
    { key: "D", label: "日" },
    { key: "W", label: "周" },
    { key: "M", label: "月" },
    { key: "1", label: "1分" },
    { key: "5", label: "5分" },
    { key: "30", label: "30分" },
  ];

  const onIntervalChange = (key: any) => {
    setIntervalLoading(true)
    setInterval(String(key) as IntervalKey);
  };

  // ---------- 数据适配 ----------

  const candleData = useMemo(() => {
    if (!KlineData?.length) return [];

    return KlineData
      .slice()
      .sort((a: IKlineItem, b: IKlineItem) => a.t - b.t)
      .map((item: IKlineItem) => ({
        time: (item.t),
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
      }));
  }, [KlineData]);



  const volumeData = useMemo(() => {
    if (!KlineData || KlineData.length === 0) return [];
    return KlineData.map((item: IKlineItem) => ({
      time: item.t as number,
      value: item.v,
      color: item.c > item.o ? colors.red : colors.green,
    }));
  }, [KlineData]);



  const atrData: any = useMemo(() => {
    if (!KlineData || KlineData.length === 0) return [];
    return calculateATR(KlineData);
  }, [KlineData]);

  // ---------- 渲染 ----------

  return (
    <div className="py-2">
      <IntervalTab
        tabs={intervals}
        value={interval}
        onChange={onIntervalChange}
      />

      <Spin spinning={loading || initLoading} >
        <div className="h-[70vh]">
          {!initLoading && !loading && KlineData?.length > 0 && (

            <Chart
              key={interval}
              options={{
                layout: {
                  background: { color: "#fff" },
                  textColor: "#000",
                },
                crosshair: { mode: 0 },

              }}
              containerProps={{ style: { height: "100%" } }}
            >
              <TimeScale>
                <TimeScaleFitContentTrigger deps={[interval]} />
              </TimeScale>

              <Pane stretchFactor={3}>
                <CandlestickSeries
                  data={candleData}
                  reactive={false}
                  options={{
                    upColor: colors.red,
                    downColor: colors.green,
                    borderUpColor: colors.red,
                    borderDownColor: colors.green,
                    wickUpColor: colors.red,
                    wickDownColor: colors.green,
                    priceLineVisible: false,
                  }}
                />
              </Pane>

              <Pane stretchFactor={1}>
                <LineSeries
                  data={atrData}
                  reactive={false}
                  options={{
                    color: colors.blue,
                    lineWidth: 2,
                    priceLineVisible: false,
                  }}
                />
                <WatermarkText
                  lines={[{ text: "ATR-14", color: colors.gray, fontSize: 12 }]}
                  horzAlign="left"
                  vertAlign="center"
                />
              </Pane>

              <Pane stretchFactor={1}>
                <HistogramSeries
                  data={volumeData}
                  reactive={false}
                  options={{ priceLineVisible: false }}
                />
                <WatermarkText
                  lines={[{ text: "VOLUME", color: colors.gray, fontSize: 12 }]}
                  horzAlign="left"
                  vertAlign="center"
                />
              </Pane>
            </Chart>

          )}
        </div>
      </Spin>
    </div>
  );
};

export default Kchart;
