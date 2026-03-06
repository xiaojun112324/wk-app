export const calculateATR = (
  ohlcData: { time: string; high: number; low: number; close: number }[],
  period = 14
) => {
  const atrData: { time: string; value?: number }[] = [];

  let atr: number | null = null;

  for (let i = 0; i < ohlcData.length; i++) {
    if (i === 0) {
      atrData.push({ time: ohlcData[i].time });
      continue;
    }

    const high = ohlcData[i].high;
    const low = ohlcData[i].low;
    const prevClose = ohlcData[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    if (i < period) {
      atrData.push({ time: ohlcData[i].time });
      if (atr === null) atr = 0;
      atr += tr;
      continue;
    }

    if (i === period) {
      atr = atr! / period;
    } else {
      atr = (atr! * (period - 1) + tr) / period;
    }

    atrData.push({ time: ohlcData[i].time, value: atr });
  }

  return atrData;
};