'use client';

import { useEffect, useState } from 'react';
import { ModulePlaceholder, type HealthState } from '@/shared/ui/ModulePlaceholder';
import { getHealth } from '../api';

export function MarketplaceHome() {
  const [health, setHealth] = useState<HealthState>('checking');

  useEffect(() => {
    let active = true;
    getHealth()
      .then(() => active && setHealth('connected'))
      .catch(() => active && setHealth('unreachable'));
    return () => {
      active = false;
    };
  }, []);

  return (
    <ModulePlaceholder
      title="Explore projects"
      module="M2 · Investor Marketplace & Escrow"
      owner="Thilina"
      health={health}
    />
  );
}
