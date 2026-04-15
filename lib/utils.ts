import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CASES } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function getCaseBySlug(slug: string) {
  return CASES.find((c) => c.slug === slug) ?? null
}

export function formatKory(n: number): string {
  return `${n} Kory${n > 1 ? 's' : ''}`
}
