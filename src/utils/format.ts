export const formatWan = (value: number) =>
  `${value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} 万元`;

export const formatPercent = (value: number) => `${value.toFixed(2)}%`;
