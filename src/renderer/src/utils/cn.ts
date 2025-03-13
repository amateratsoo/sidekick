import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classnames: ClassValue[]): string {
  return twMerge(clsx(classnames))
}
