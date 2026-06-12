import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PLATFORMS } from '@/app/data/surveyConfig';
import { cn } from '@/lib/utils';
import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

const NONE = 'None of these';

export default function PlatformSelectionPage({ state, update, errors }: Props) {
  const selected = state.platformsUsed;

  const toggle = (label: string) => {
    if (label === NONE) {
      update({ platformsUsed: selected.includes(NONE) ? [] : [NONE] });
    } else {
      const without = selected.filter(s => s !== NONE);
      update({ platformsUsed: without.includes(label) ? without.filter(s => s !== label) : [...without, label] });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Platform Selection</h2>
      <div>
        <Label>Which platforms do you use for work or business communication? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">Select all that apply. You will get detailed questions for each platform you pick.</p>
        <div className="space-y-2">
          {PLATFORMS.map(p => (
            <label key={p.key} className={cn('flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors',
              selected.includes(p.label) ? 'border-primary bg-accent' : 'border-border hover:bg-muted')}>
              <Checkbox checked={selected.includes(p.label)} onCheckedChange={() => toggle(p.label)} />
              <span className="text-sm">{p.label}</span>
            </label>
          ))}
          <label className={cn('flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors',
            selected.includes(NONE) ? 'border-primary bg-accent' : 'border-border hover:bg-muted')}>
            <Checkbox checked={selected.includes(NONE)} onCheckedChange={() => toggle(NONE)} />
            <span className="text-sm text-muted-foreground">{NONE}</span>
          </label>
        </div>
        {errors.platformsUsed && <p className="text-xs text-destructive mt-1">{errors.platformsUsed}</p>}
      </div>
    </div>
  );
}
