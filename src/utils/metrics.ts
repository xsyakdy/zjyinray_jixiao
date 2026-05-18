export const calculateCompletionRate = (actual: number, target: number) => {
  if (target <= 0) {
    return 0;
  }

  return Number(((actual / target) * 100).toFixed(2));
};
