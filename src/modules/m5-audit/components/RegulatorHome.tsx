'use client';

import { useEffect, useState } from 'react';
import { ModulePlaceholder, type HealthState } from '@/shared/ui/ModulePlaceholder';
import { getHealth } from '../api';

export function RegulatorHome() {
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
      title="Trust & audit overview"
      module="M5 · Blockchain Audit & Trust Index"
      owner="Mirath"
      health={health}
    />
  );
}
