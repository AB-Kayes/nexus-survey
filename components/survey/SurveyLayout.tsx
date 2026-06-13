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
  showNav?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
  children: React.ReactNode;
}

export default function SurveyLayout({ pageIndex, totalPages, progress, onBack, onNext, showBack = true, showNav = true, nextLabel = 'Next', nextLoading, children }: Props) {
  return (
    <div className={`min-h-screen bg-background${showNav ? ' pb-20' : ''}`}>
      {/* Scrollable content area */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8">{children}</div>
      </div>

      {/* Sticky bottom navigation bar */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-3">
            {/* Progress info */}
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Page {pageIndex + 1} of {totalPages}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            {/* Progress bar */}
            <Progress value={progress} className="mb-3 h-1.5" />
            {/* Navigation buttons */}
            <div className="flex justify-between gap-3">
              {showBack ? (
                <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
                  <ChevronLeft className="mr-1 h-4 w-4" />Back
                </Button>
              ) : <div className="flex-1" />}
              <Button onClick={onNext} disabled={nextLoading} className="flex-1 sm:flex-none">
                {nextLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {nextLabel}{!nextLoading && nextLabel === 'Next' && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
