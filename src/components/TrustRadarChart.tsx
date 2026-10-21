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

  const kyc = components?.kycVerification ?? 25;
  const escrow = components?.escrowDiscipline ?? 30;
  const milestones = components?.milestoneReality ?? 38;
  const compliance = components?.complianceScore ?? 20;

  const chartData = [
    { subject: 'M1: KYC Registry', score: (kyc / 25) * 100, fullMark: 100, rawScore: `${kyc}/25` },
    { subject: 'M2: Escrow Lock', score: (escrow / 30) * 100, fullMark: 100, rawScore: `${escrow}/30` },
    { subject: 'M3: Scam Absence', score: (compliance / 20) * 100, fullMark: 100, rawScore: `${compliance}/20` },
    { subject: 'M4: Proof-of-Reality', score: (milestones / 40) * 100, fullMark: 100, rawScore: `${milestones}/40` },
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
