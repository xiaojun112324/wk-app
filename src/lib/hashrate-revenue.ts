export const UNIT_STEP: Record<string, string> = {
  EH: "PH",
  PH: "TH",
  TH: "GH",
  GH: "MH",
  MH: "KH",
  KH: "H",
  H: "H",
};

export const P_FACTOR: Record<string, number> = {
  EH: 1000,
  PH: 1,
  TH: 0.001,
  GH: 0.000001,
  MH: 0.000000001,
  KH: 0.000000000001,
  H: 0.000000000000001,
};

export const parseHashrateUnit = (val: any) => {
  const raw = String(val || "").toUpperCase();
  const m = raw.match(/([KMGTPE]?H)\/S/);
  return m?.[1] || "PH";
};

export const getDisplayHashrateUnit = (networkHashrate: any) => {
  const netUnit = parseHashrateUnit(networkHashrate);
  return UNIT_STEP[netUnit] || "PH";
};

export const calcDailyCoinPerDisplayUnit = (dailyRevenuePerP: any, networkHashrate: any) => {
  const unit = getDisplayHashrateUnit(networkHashrate);
  const factor = P_FACTOR[unit] || 1;
  const dailyCoinPerP = Number(dailyRevenuePerP || 0);
  if (!Number.isFinite(dailyCoinPerP) || dailyCoinPerP <= 0) {
    return { unit, dailyCoin: 0 };
  }
  return {
    unit,
    dailyCoin: Number((dailyCoinPerP * factor).toFixed(12)),
  };
};

export const calcDailyRevenueCnyPerDisplayUnit = (dailyRevenuePerP: any, networkHashrate: any, priceCny: any) => {
  const { unit, dailyCoin } = calcDailyCoinPerDisplayUnit(dailyRevenuePerP, networkHashrate);
  const p = Number(priceCny || 0);
  const revenueCny = Number.isFinite(p) && p > 0 ? Number((p * dailyCoin).toFixed(8)) : 0;
  return { unit, revenueCny, dailyCoin };
};

