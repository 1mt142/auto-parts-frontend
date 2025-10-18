export const formatPrice = (price: string | number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};
