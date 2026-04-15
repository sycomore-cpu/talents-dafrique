import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
type AvatarRing = 'none' | 'primary' | 'kory'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  ring?: AvatarRing
  className?: string
  alt?: string
}

const sizeConfig: Record<AvatarSize, { px: number; textClass: string; wh: string }> = {
  sm: { px: 32, textClass: 'text-xs', wh: 'w-8 h-8' },
  md: { px: 48, textClass: 'text-sm', wh: 'w-12 h-12' },
  lg: { px: 64, textClass: 'text-base', wh: 'w-16 h-16' },
  xl: { px: 96, textClass: 'text-xl', wh: 'w-24 h-24' },
}

const ringConfig: Record<AvatarRing, string> = {
  none: '',
  primary: 'ring-2 ring-primary ring-offset-1',
  kory: 'ring-2 ring-kory ring-offset-1',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function stringToColor(str: string): string {
  const colors = [
    'bg-primary/20 text-primary',
    'bg-secondary/20 text-secondary',
    'bg-kory/20 text-kory-700',
    'bg-rose-100 text-rose-700',
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-teal-100 text-teal-700',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({
  src,
  name,
  size = 'md',
  ring = 'none',
  className,
  alt,
}: AvatarProps) {
  const config = sizeConfig[size]
  const initials = name ? getInitials(name) : '?'
  const colorClass = name ? stringToColor(name) : 'bg-gray-100 text-gray-500'

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden shrink-0 select-none',
        config.wh,
        ringConfig[ring],
        className
      )}
      aria-label={alt ?? name ?? 'Avatar'}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          width={config.px}
          height={config.px}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center font-semibold',
            config.textClass,
            colorClass
          )}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
    </div>
  )
}

export default Avatar
