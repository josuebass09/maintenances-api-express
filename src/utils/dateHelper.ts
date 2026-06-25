export const getDateInMonths = (fromDate: Date = new Date(), months: number = 6): Date => {
  const result = new Date(fromDate);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getDaysUntil = (targetDate: Date): number => {
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetMidnight = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const diffMs = targetMidnight.getTime() - nowMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};
