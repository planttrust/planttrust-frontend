export type HealthState = 'checking' | 'connected' | 'unreachable';

const healthText: Record<HealthState, string> = {
  checking: 'Checking the backend…',
  connected: 'Backend connected',
  unreachable: 'Backend not reachable. Is it running on port 4000?',
};

interface Props {
  title: string;
  module: string;
  owner: string;
  health: HealthState;
}

/** Temporary "this screen is coming" card. Each owner replaces it with the real Figma screen. */
export function ModulePlaceholder({ title, module, owner, health }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16">
      <p className="text-caption text-muted">{module}</p>
      <h1 className="text-title">{title}</h1>
      <p>This screen is built in Sprint 1 by {owner}, following the Figma design.</p>
      <p
        role="status"
        className={`text-label ${health === 'unreachable' ? 'text-red-700' : 'text-brand'}`}
      >
        {healthText[health]}
      </p>
    </main>
  );
}
