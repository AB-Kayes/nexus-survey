import { useState, useMemo, useCallback, useEffect } from "react";
import { PLATFORMS } from "@/app/data/surveyConfig";

export interface PlatformAnswers {
  usage: string[];
  ucVolumes: string[];
  ucChallenges: string[][];
  otherTexts: string[];
  automationNeeds: string[][];
  timeSpent: string;
  platformSpend: string;
}

export interface ConsolidatedAnswers {
  aiReadiness: string;
  aiNeeds: string[];
  aiConcerns: string[];
  integrationNeeds: string[];
  features: string[];
  switchAnswers: string[];
  switchIntent: string;
  switchTrigger: string;
  securityNeeds: string[];
  onboardingNeeds: string[];
  teamWorkflow: string;
  currentlyPays: string;
  paidToolTypes: string[];
  willingnessToPay: string;
  pricingModel: string;
}

export interface SurveyState {
  name: string;
  country: string;
  ageGroup: string;
  occupation: string;
  teamSize: string;
  platformCount: string;
  difficultyRating: number | null;
  crossPostFrequency: string;
  platformsUsed: string[];
  platformAnswers: Record<string, PlatformAnswers>;
  consolidatedAnswers: ConsolidatedAnswers;
  frustrationOneWord: string;
  biggestChallenge: string;
  whatWouldConvince: string;
  concerns: string;
  wantsNotification: string;
  notificationEmail: string;
}

const emptyPA: PlatformAnswers = {
  usage: [],
  ucVolumes: [],
  ucChallenges: [],
  otherTexts: [],
  automationNeeds: [],
  timeSpent: "",
  platformSpend: "",
};

const emptyCA: ConsolidatedAnswers = {
  aiReadiness: "",
  aiNeeds: [],
  aiConcerns: [],
  integrationNeeds: [],
  features: [],
  switchAnswers: [],
  switchIntent: "",
  switchTrigger: "",
  securityNeeds: [],
  onboardingNeeds: [],
  teamWorkflow: "",
  currentlyPays: "",
  paidToolTypes: [],
  willingnessToPay: "",
  pricingModel: "",
};

const initial: SurveyState = {
  name: "",
  country: "",
  ageGroup: "",
  occupation: "",
  teamSize: "",
  platformCount: "",
  difficultyRating: null,
  crossPostFrequency: "",
  platformsUsed: [],
  platformAnswers: {},
  consolidatedAnswers: emptyCA,
  frustrationOneWord: "",
  biggestChallenge: "",
  whatWouldConvince: "",
  concerns: "",
  wantsNotification: "",
  notificationEmail: "",
};

export function useSurvey() {
  const [state, setState] = useState<SurveyState>(initial);
  const [pageIndex, setPageIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get selected platforms in order
  const selectedPlatforms = useMemo(() => {
    return PLATFORMS.filter(p => state.platformsUsed.includes(p.label));
  }, [state.platformsUsed]);

  const selectedPlatformCount = selectedPlatforms.length;

  // Dynamic page generation
  const pages = useMemo(() => {
    const p: string[] = ["welcome", "about", "habits", "platforms"];
    // Add per-platform deep dive pages
    for (const pl of selectedPlatforms) {
      p.push(`platform_${pl.key}`);
    }
    // Add consolidated cross-platform section (only if at least 1 platform selected)
    if (selectedPlatformCount > 0) {
      p.push("consolidated");
    }
    p.push("openended", "thankyou");
    return p;
  }, [selectedPlatformCount, selectedPlatforms.map(p => p.key).join(',')]);

  const currentPage = pages[pageIndex] || "welcome";
  const totalPages = pages.length;

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  // Calculate progress percentage
  const progress = totalPages > 1 ? Math.round((pageIndex / (totalPages - 1)) * 100) : 0;

  // Calculate estimated time based on platforms selected
  const estimatedMinutes = useMemo(() => {
    if (selectedPlatformCount === 0) return "8-10";
    const baseMinutes = 5; // welcome + about + habits + platforms
    const perPlatformMinutes = 4; // simplified deep dive
    const consolidatedMinutes = 6; // cross-platform questions
    const closingMinutes = 4; // open-ended + pricing + thank you
    const total = baseMinutes + (selectedPlatformCount * perPlatformMinutes) + consolidatedMinutes + closingMinutes;
    return `${total - 2}-${total + 3}`;
  }, [selectedPlatformCount]);

  const update = useCallback((partial: Partial<SurveyState>) => {
    setState((s) => {
      const next = { ...s, ...partial };
      // Reset all answers when occupation changes
      if (partial.occupation !== undefined && partial.occupation !== s.occupation) {
        next.platformAnswers = {};
        next.consolidatedAnswers = emptyCA;
      }
      return next;
    });
  }, []);

  const updatePlatform = useCallback((key: string, partial: Partial<PlatformAnswers>) => {
    setState((s) => ({
      ...s,
      platformAnswers: {
        ...s.platformAnswers,
        [key]: { ...(s.platformAnswers[key] || emptyPA), ...partial },
      },
    }));
  }, []);

  const updateConsolidated = useCallback((partial: Partial<ConsolidatedAnswers>) => {
    setState((s) => ({
      ...s,
      consolidatedAnswers: { ...s.consolidatedAnswers, ...partial },
    }));
  }, []);

  const next = useCallback(
    () => setPageIndex((i) => Math.min(i + 1, pages.length - 1)),
    [pages.length]
  );
  const back = useCallback(() => {
    setErrors({});
    setPageIndex((i) => Math.max(i - 1, 0));
  }, []);

  return {
    state,
    update,
    updatePlatform,
    updateConsolidated,
    currentPage,
    pageIndex,
    totalPages,
    progress,
    next,
    back,
    errors,
    setErrors,
    submitted,
    setSubmitted,
    submitting,
    setSubmitting,
    selectedPlatforms,
    selectedPlatformCount,
    estimatedMinutes,
  };
}
