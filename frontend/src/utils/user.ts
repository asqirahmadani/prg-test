export type TravelStatus = "pending" | "approved" | "declined";

export const getVisiblePages = (current: number, total: number) => {
  const size = 5;

  if (total <= size) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }

  return [current - 2, current - 1, current, current + 1, current + 2];
};

export const formatRpLong = (v: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(v);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export const formatDate = (
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(
    "id-ID",
    options ?? {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
};
