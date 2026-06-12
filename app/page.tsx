"use client";

import { useSurvey } from "@/app/hooks/useSurvey";
import { PLATFORMS } from "@/app/data/surveyConfig";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import WelcomePage from "@/components/survey/WelcomePage";
import AboutYouPage from "@/components/survey/AboutYouPage";
import CommunicationHabitsPage from "@/components/survey/CommunicationHabitsPage";
import PlatformSelectionPage from "@/components/survey/PlatformSelectionPage";
import PlatformDeepDivePage from "@/components/survey/PlatformDeepDivePage";
import ConsolidatedQuestionsPage from "@/components/survey/ConsolidatedQuestionsPage";
import OpenEndedPage from "@/components/survey/OpenEndedPage";
import PricingPage from "@/components/survey/PricingPage";
import ThankYouPage from "@/components/survey/ThankYouPage";
import SurveyLayout from "@/components/survey/SurveyLayout";

function validate(
  page: string,
  state: ReturnType<typeof useSurvey>["state"]
): Record<string, string> {
  const e: Record<string, string> = {};
  if (page === "about") {
    if (!state.country.trim()) e.country = "Required";
    if (!state.ageGroup) e.ageGroup = "Required";
    if (!state.occupation) e.occupation = "Required";
    if (!state.teamSize) e.teamSize = "Required";
  }
  if (page === "habits") {
    if (!state.platformCount) e.platformCount = "Required";
    if (state.difficultyRating === null) e.difficultyRating = "Required";
    if (!state.crossPostFrequency) e.crossPostFrequency = "Required";
  }
  if (page === "platforms") {
    if (state.platformsUsed.length === 0)
      e.platformsUsed = "Please select at least one option";
  }
  if (page.startsWith("platform_")) {
    const key = page.replace("platform_", "");
    const a = state.platformAnswers[key];
    if (!a || a.usage.length === 0) e.usage = "Please select at least one use case";
    if (a) {
      a.usage.forEach((_, i) => {
        if (!a.ucVolumes[i]) e[`volume_${i}`] = "Required";
        if (!a.ucChallenges[i] || a.ucChallenges[i].length === 0)
          e[`challenge_${i}`] = "Select at least one";
        if (!a.automationNeeds[i] || a.automationNeeds[i].length === 0)
          e[`automation_${i}`] = "Select at least one";
      });
      if (!a.timeSpent) e.timeSpent = "Required";
      if (!a.platformSpend) e.platformSpend = "Required";
    }
  }
  if (page === "consolidated") {
    const ca = state.consolidatedAnswers;
    if (!ca.aiReadiness) e.aiReadiness = "Required";
    if (!ca.aiNeeds || ca.aiNeeds.length === 0) e.aiNeeds = "Select at least one";
    if (!ca.aiConcerns || ca.aiConcerns.length === 0) e.aiConcerns = "Select at least one";
    if (!ca.integrationNeeds || ca.integrationNeeds.length === 0) e.integrationNeeds = "Select at least one";
    if (!ca.features || ca.features.length === 0) e.features = "Select at least one feature";
    if (!ca.switchAnswers || ca.switchAnswers.length === 0) e.switchAnswers = "Select at least one";
    if (!ca.switchIntent) e.switchIntent = "Required";
    if ((ca.switchIntent === "Very likely" || ca.switchIntent === "Somewhat likely") && !ca.switchTrigger)
      e.switchTrigger = "Required";
    if (!ca.securityNeeds || ca.securityNeeds.length === 0) e.securityNeeds = "Select at least one";
    if (!ca.onboardingNeeds || ca.onboardingNeeds.length === 0) e.onboardingNeeds = "Select at least one";
    if (!ca.currentlyPays) e.currentlyPays = "Required";
    if (ca.currentlyPays === "Yes" && ca.paidToolTypes.length === 0) e.paidToolTypes = "Select at least one";
    if (!ca.willingnessToPay) e.willingnessToPay = "Required";
    if (!ca.pricingModel) e.pricingModel = "Required";
  }
  if (page === "openended") {
    if (state.biggestChallenge.trim().length < 10)
      e.biggestChallenge = "Please write at least 10 characters";
    if (state.whatWouldConvince.trim().length < 10)
      e.whatWouldConvince = "Please write at least 10 characters";
    if (state.concerns.trim().length < 10)
      e.concerns = "Please write at least 10 characters";
  }
  if (page === "pricing") {
    // Pricing is now inside consolidated page, but keep validation for safety
    const ca = state.consolidatedAnswers;
    if (!ca.currentlyPays) e.currentlyPays = "Required";
    if (ca.currentlyPays === "Yes" && ca.paidToolTypes.length === 0) e.paidToolTypes = "Select at least one";
    if (!ca.willingnessToPay) e.willingnessToPay = "Required";
    if (!ca.pricingModel) e.pricingModel = "Required";
  }
  if (page === "thankyou") {
    if (!state.wantsNotification) e.wantsNotification = "Required";
    if (state.wantsNotification === "Yes, notify me!" && !state.notificationEmail.trim())
      e.notificationEmail = "Required";
    if (state.wantsNotification === "Yes, notify me!" && state.notificationEmail && !state.notificationEmail.includes("@"))
      e.notificationEmail = "Enter a valid email";
  }
  return e;
}

export default function SurveyPage() {
  const survey = useSurvey();
  const {
    state, update, updatePlatform, updateConsolidated,
    currentPage, pageIndex, totalPages, progress,
    next, back, errors, setErrors,
    submitted, setSubmitted, submitting, setSubmitting,
    selectedPlatforms, selectedPlatformCount, estimatedMinutes,
  } = survey;

  const handleNext = () => {
    const errs = validate(currentPage, state);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (currentPage === "thankyou") {
      handleSubmit();
    } else {
      next();
    }
  };

  const handleSubmit = async () => {
    const errs = validate("thankyou", state);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          country: state.country,
          ageGroup: state.ageGroup,
          occupation: state.occupation,
          teamSize: state.teamSize,
          platformCount: state.platformCount,
          difficultyRating: state.difficultyRating,
          crossPostFrequency: state.crossPostFrequency,
          platformsUsed: state.platformsUsed.filter((p) => p !== "None of these"),
          platformAnswers: state.platformAnswers,
          consolidatedAnswers: state.consolidatedAnswers,
          frustrationOneWord: state.frustrationOneWord || undefined,
          biggestChallenge: state.biggestChallenge,
          whatWouldConvince: state.whatWouldConvince,
          concerns: state.concerns,
          wantsNotification: state.wantsNotification,
          notificationEmail: state.notificationEmail || undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit survey");
      setSubmitted(true);
      toast.success("Survey submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submitted state
  if (submitted) {
    return (
      <SurveyLayout progress={100} pageIndex={totalPages - 1} totalPages={totalPages} onBack={() => {}} onNext={() => {}} showBack={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">You're all set! 🎉</h2>
            <p className="text-muted-foreground mb-4">You've secured your early-access seat for Project Nexus.</p>
            {state.wantsNotification === "Yes, notify me!" && (
              <p className="text-sm text-muted-foreground">We'll notify you at <strong>{state.notificationEmail}</strong> when we launch.</p>
            )}
          </div>
        </div>
      </SurveyLayout>
    );
  }

  // Welcome page: no progress bar, no nav buttons
  if (currentPage === "welcome") {
    return <WelcomePage onStart={handleNext} estimatedMinutes={estimatedMinutes} platformCount={selectedPlatformCount} />;
  }

  // All other pages: wrapped in SurveyLayout
  return (
    <SurveyLayout progress={progress} pageIndex={pageIndex} totalPages={totalPages} onBack={back} onNext={handleNext}>
      {currentPage === "about" && <AboutYouPage state={state} update={update} errors={errors} />}
      {currentPage === "habits" && <CommunicationHabitsPage state={state} update={update} errors={errors} />}
      {currentPage === "platforms" && <PlatformSelectionPage state={state} update={update} errors={errors} />}
      {currentPage.startsWith("platform_") && (() => {
        const key = currentPage.replace("platform_", "");
        const idx = selectedPlatforms.findIndex(p => p.key === key);
        return (
          <PlatformDeepDivePage
            platform={selectedPlatforms[idx]}
            state={state}
            updatePlatform={updatePlatform}
            errors={errors}
            platformIndex={idx}
            totalPlatforms={selectedPlatformCount}
          />
        );
      })()}
      {currentPage === "consolidated" && <ConsolidatedQuestionsPage state={state} update={updateConsolidated} errors={errors} />}
      {currentPage === "openended" && <OpenEndedPage state={state} update={update} errors={errors} />}
      {currentPage === "thankyou" && <ThankYouPage state={state} update={update} errors={errors} />}
    </SurveyLayout>
  );
}
