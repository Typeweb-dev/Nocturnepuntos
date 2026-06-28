'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ChartPoint = {
  date: string
  points: number
}

export function DashboardChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Puntos entregados (ultimos 20 dias)</h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" stroke="#999999" style={{ fontSize: '12px' }} />
            <YAxis stroke="#999999" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f0f0f0' }}
              formatter={(value) => [`${value} pts`, 'Puntos']}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#ff1f7e"
              strokeWidth={2}
              dot={{ fill: '#ff1f7e', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
