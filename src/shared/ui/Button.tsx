import type { ButtonHTMLAttributes } from 'react';

/** Figma components: Plantrust/Primary, Plantrust/Secondary, Plantrust/Navigation. */
type Variant = 'primary' | 'secondary' | 'navigation';

const baseClasses =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-border px-4 py-3 text-control font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-surface hover:bg-brand/90',
  secondary: 'bg-surface text-ink hover:bg-tint',
  navigation:
    'bg-surface text-ink hover:bg-tint aria-[current=page]:border-brand aria-[current=page]:bg-tint',
};

/** The Figma button look, for elements that aren't buttons, e.g. <Link className={buttonClasses('secondary')}>. */
export function buttonClasses(variant: Variant = 'primary') {
  return `${baseClasses} ${variantClasses[variant]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return <button type={type} className={`${buttonClasses(variant)} ${className}`} {...props} />;
}
