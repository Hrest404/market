import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceUzs: number): string {
  return new Intl.NumberFormat("ru-RU").format(priceUzs) + " сум";
}
