import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRarityTextColor(rarity?: string): string {
  switch (rarity) {
    case 'rare':
      return 'text-accent';
    case 'common':
      return 'text-gray-400';
    case 'uncommon':
      return 'text-secondary';
    default:
      return '';
  }
}

export function getRarityOutline(rarity?: string): string {
  switch (rarity) {
    case 'rare':
      return 'ring ring-4 ring-accent';
    case 'common':
      return 'outline outline-2 outline-gray-600';
    case 'uncommon':
      return 'outline outline-2 outline-secondary';
    default:
      return '';
  }
}
