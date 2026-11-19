import Image from 'next/image';
import Link from 'next/link';
import { buttonClasses } from '@/shared/ui/Button';

// Temporary developer home page: links to each module's first screen.
// The real public home page from Figma (01 Desktop flows) replaces it later.
const modulePages = [
  { href: '/login', label: 'Log in', module: 'M1 · Nimsara' },
  { href: '/projects', label: 'Explore projects', module: 'M2 · Thilina' },
  { href: '/assistant', label: 'Assistant', module: 'M3 · Imesha' },
  { href: '/company/projects', label: 'My projects', module: 'M4 · Yasuri' },
  { href: '/regulator', label: 'Trust & audit overview', module: 'M5 · Mirath' },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <Image
        src="/brand/plantrust-wordmark-ink.svg"
        alt="Plantrust"
        width={198}
        height={48}
        priority
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-title">Verified land investment</h1>
        <p className="text-muted">
          GPS-checked land projects, escrow-protected funding and on-chain proof for every step.
        </p>
      </div>
      <nav aria-label="Module screens" className="grid gap-3 sm:grid-cols-2">
        {modulePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className={`${buttonClasses('secondary')} flex-col items-start`}
          >
            <span>{page.label}</span>
            <span className="text-caption font-normal text-muted">{page.module}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
