import { cn } from '@/lib/utils';

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function OptionChip({ label, selected, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-3 py-1.5 text-sm transition-colors text-left',
        selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent',
        className
      )}
    >
      {label}
    </button>
  );
}
