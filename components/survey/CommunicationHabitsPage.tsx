import { Label } from '@/components/ui/label';
import OptionChip from './OptionChip';
import { PLATFORM_COUNTS, CROSS_POST_OPTIONS } from '@/app/data/surveyConfig';
import { cn } from '@/lib/utils';
import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

export default function CommunicationHabitsPage({ state, update, errors }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Communication Habits</h2>
      <div>
        <Label>How many different communication platforms do you actively use for work or business? <span className="text-destructive">*</span></Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {PLATFORM_COUNTS.map(c => <OptionChip key={c} label={c} selected={state.platformCount === c} onClick={() => update({ platformCount: c })} />)}
        </div>
        <FieldError msg={errors.platformCount} />
      </div>
      <div>
        <Label>How would you rate the difficulty of managing communication across multiple platforms? <span className="text-destructive">*</span></Label>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground w-14 shrink-0">Very Easy</span>
          <div className="flex flex-1 justify-between gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button key={n} type="button" onClick={() => update({ difficultyRating: n })}
                className={cn('w-8 h-8 rounded-full text-xs font-medium border transition-colors flex items-center justify-center',
                  state.difficultyRating === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent')}>
                {n}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground w-14 shrink-0 text-right">Very Hard</span>
        </div>
        <FieldError msg={errors.difficultyRating} />
      </div>
      <div>
        <Label>How often do you send the same or similar message to multiple people/platforms? <span className="text-destructive">*</span></Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {CROSS_POST_OPTIONS.map(o => <OptionChip key={o} label={o} selected={state.crossPostFrequency === o} onClick={() => update({ crossPostFrequency: o })} />)}
        </div>
        <FieldError msg={errors.crossPostFrequency} />
      </div>
    </div>
  );
}
