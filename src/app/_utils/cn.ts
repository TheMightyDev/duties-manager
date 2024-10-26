import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** A combination of `twMerge` and `clsx` to minimize repetitions */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
