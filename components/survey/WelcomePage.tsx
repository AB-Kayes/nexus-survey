import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Lock, Users, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
  estimatedMinutes: string;
  platformCount: number;
}

export default function WelcomePage({ onStart, estimatedMinutes }: Props) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Messaging Automation & AI Survey
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We're building <strong>Project Nexus</strong> — one API to manage messaging across WhatsApp, Discord, Email, Slack, SMS, and Instagram DMs, with AI-powered auto-replies, cart recovery, and workflow automation.
        </p>

        {/* Value hook */}
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary mb-2">
            <Zap className="h-4 w-4" />
            Limited Early-Access Seats Available
          </div>
          <p className="text-xs text-muted-foreground">
            Complete this survey to secure your early-access seat for the Nexus launch. Once we reach our target number of respondents, this offer expires.
          </p>
        </div>

        {/* Survey info */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> ~{estimatedMinutes} min</span>
          <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> Anonymous</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> 500+ respondents</span>
        </div>

        <Button size="lg" className="mt-8 px-8" onClick={onStart}>
          Start Survey
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Takes about {estimatedMinutes} minutes • Your responses shape the product roadmap
        </p>
      </div>
    </div>
  );
}
