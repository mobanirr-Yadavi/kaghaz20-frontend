import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  House,
  LayoutGrid,
  Pencil,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

// Site-wide icons: thin wrappers over lucide so every icon shares one stroke style.
type IconProps = {
  className?: string;
};

function icon(Glyph: LucideIcon) {
  return function Icon({ className = "" }: IconProps) {
    return <Glyph aria-hidden className={className} strokeWidth={1.9} />;
  };
}

export const SearchIcon = icon(Search);
export const UserIcon = icon(UserRound);
export const HeartIcon = icon(Heart);
export const HomeIcon = icon(House);
export const CartIcon = icon(ShoppingCart);
export const GridIcon = icon(LayoutGrid);
export const BuildingIcon = icon(Building2);
export const ChevronLeftIcon = icon(ChevronLeft);
export const ChevronRightIcon = icon(ChevronRight);
export const PencilIcon = icon(Pencil);
export const TrashIcon = icon(Trash2);
