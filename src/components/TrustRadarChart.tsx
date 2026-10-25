'use client';

/* ─── TrustRadarChart Component (Recharts) ───────────────────────────────
 * Visual radar chart breakdown of the 4-factor Digital Trust Index (0-100)
 * Evaluates: KYC Registry, Escrow Backing, Scam Absence, and Milestone Reality
 * ──────────────────────────────────────────────────────────────────────── */

import { useSyncExternalStore } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TrustIndexComponents } from '@/types';

interface TrustRadarChartProps {
  components?: TrustIndexComponents;
  height?: number;
}

const emptySubscribe = () => () => {};

export default function TrustRadarChart({
  components,
  height = 280,
}: TrustRadarChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        Loading Trust Chart...
      </div>
    );
  }

  const kyc = typeof components?.kycVerification === 'number' ? components.kycVerification : 0;
  const escrow = typeof components?.escrowDiscipline === 'number' ? components.escrowDiscipline : 0;
  const milestones = typeof components?.milestoneReality === 'number' ? components.milestoneReality : 0;
  const compliance = typeof components?.complianceScore === 'number' ? components.complianceScore : 0;

  const chartData = [
    {
      subject: 'M1: KYC Registry',
      score: (kyc / 25) * 100,
      fullMark: 100,
      rawScore: typeof components?.kycVerification === 'number' ? `${kyc}/25` : 'N/A',
    },
    {
      subject: 'M2: Escrow Lock',
      score: (escrow / 30) * 100,
      fullMark: 100,
      rawScore: typeof components?.escrowDiscipline === 'number' ? `${escrow}/30` : 'N/A',
    },
    {
      subject: 'M3: Scam Absence',
      score: (compliance / 20) * 100,
      fullMark: 100,
      rawScore: typeof components?.complianceScore === 'number' ? `${compliance}/20` : 'N/A',
    },
    {
      subject: 'M4: Proof-of-Reality',
      score: (milestones / 40) * 100,
      fullMark: 100,
      rawScore: typeof components?.milestoneReality === 'number' ? `${milestones}/40` : 'N/A',
    },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Trust Compliance %"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0b1320',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value: any, name: any, item: any) => [
              `${Math.round(Number(value))}% (Raw: ${item.payload.rawScore})`,
              name,
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
