import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: { month: string; revenue: number }[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container border border-surface-variant rounded-xl px-4 py-3 shadow-lg">
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{label}</p>
      <p className="font-title-md text-title-md text-on-surface">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm">
      <h3 className="font-title-md text-title-md text-on-surface mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2d3449" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 12 }} />
          <YAxis stroke="#c7c4d8" tick={{ fill: '#c7c4d8', fontSize: 12 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
