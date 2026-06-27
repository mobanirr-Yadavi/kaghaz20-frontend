export type Category = {
  id: string;
  title: string;
  subtitle?: string;
  cta?: string;
  image?: string;
  featured?: boolean;
  dark?: boolean;
};

export type ShopCategory = {
  id: string;
  title: string;
  value: string;
  icon: "grid" | "document" | "folder";
};
