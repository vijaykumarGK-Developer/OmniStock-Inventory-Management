import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  trend?: { value: string; direction: 'up' | 'down'; isPositive?: boolean }
  icon: string
  accentColor: 'primary' | 'secondary' | 'tertiary'
}

export function StatCard({ title, value, trend, icon, accentColor }: StatCardProps) {
  return (
    <Card variant="stat" accentColor={accentColor} icon={icon}>
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{title}</p>
      <p className="font-headline-lg text-headline-lg text-on-surface">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span className={cn('material-symbols-outlined text-lg', trend.isPositive ? 'text-secondary' : 'text-error')}>
            {trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span className={cn('font-body-sm text-body-sm', trend.isPositive ? 'text-secondary' : 'text-error')}>
            {trend.value}
          </span>
        </div>
      )}
    </Card>
  )
}
