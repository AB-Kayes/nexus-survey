import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  pageIndex: number;
  totalPages: number;
  progress: number;
  onBack: () => void;
  onNext: () => void;
  showBack?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
  children: React.ReactNode;
}

export default function SurveyLayout({ pageIndex, totalPages, progress, onBack, onNext, showBack = true, nextLabel = 'Next', nextLoading, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Page {pageIndex + 1} of {totalPages}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="mb-8 h-2" />
        <div className="space-y-8">{children}</div>
        <div className="mt-10 flex justify-between">
          {showBack ? (
            <Button variant="outline" onClick={onBack}><ChevronLeft className="mr-1 h-4 w-4" />Back</Button>
          ) : <div />}
          <Button onClick={onNext} disabled={nextLoading}>
            {nextLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {nextLabel}{!nextLoading && nextLabel === 'Next' && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
