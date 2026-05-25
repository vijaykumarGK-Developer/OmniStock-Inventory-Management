import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ className, width, height = 16, rounded = true }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer bg-surface-container-lowest', rounded && 'rounded-lg', className)}
      style={{ width, height }}
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${100 - i * 10}%`} height={14} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-surface-container border border-surface-variant rounded-2xl p-6 space-y-4', className)}>
      <Skeleton width="40%" height={20} />
      <SkeletonText lines={2} />
      <Skeleton width="60%" height={36} />
    </div>
  )
}
