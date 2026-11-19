'use client';

import { useEffect, useState } from 'react';
import { ModulePlaceholder, type HealthState } from '@/shared/ui/ModulePlaceholder';
import { getHealth } from '../api';

export function AssistantHome() {
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
      title="Assistant"
      module="M3 · MCP AI & Scam Detection"
      owner="Imesha"
      health={health}
    />
  );
}
