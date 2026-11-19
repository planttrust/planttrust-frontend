'use client';

import { useEffect, useState } from 'react';
import { ModulePlaceholder, type HealthState } from '@/shared/ui/ModulePlaceholder';
import { getHealth } from '../api';

export function UsersHome() {
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
      title="Log in"
      module="M1 · User Management & Corporate Registry"
      owner="Nimsara"
      health={health}
    />
  );
}
