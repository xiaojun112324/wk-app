export const getPriceColor = (value: number | string) =>
    Number(value) > 0 ? "text-red-600" : Number(value) < 0 ? "text-green-600" : "text-gray-600";
