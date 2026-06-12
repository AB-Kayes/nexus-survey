import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/app/lib/supabase/server";

const platformAnswerSchema = z.object({
  usage: z.array(z.string()),
  ucVolumes: z.array(z.string()),
  ucChallenges: z.array(z.array(z.string())),
  automationNeeds: z.array(z.array(z.string())).optional(),
  timeSpent: z.string().optional(),
  platformSpend: z.string().optional(),
});

const consolidatedAnswerSchema = z.object({
  aiReadiness: z.string().optional(),
  aiNeeds: z.array(z.string()).optional(),
  aiConcerns: z.array(z.string()).optional(),
  integrationNeeds: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  switchAnswers: z.array(z.string()).optional(),
  switchIntent: z.string().optional(),
  switchTrigger: z.string().optional(),
  securityNeeds: z.array(z.string()).optional(),
  onboardingNeeds: z.array(z.string()).optional(),
  currentlyPays: z.string().optional(),
  paidToolTypes: z.array(z.string()).optional(),
  willingnessToPay: z.string().optional(),
  pricingModel: z.string().optional(),
});

const submitSchema = z.object({
  name: z.string().optional(),
  country: z.string(),
  ageGroup: z.string(),
  occupation: z.string(),
  teamSize: z.string(),
  platformCount: z.string(),
  difficultyRating: z.number(),
  crossPostFrequency: z.string(),
  platformsUsed: z.array(z.string()),
  platformAnswers: z.record(z.string(), platformAnswerSchema).optional(),
  consolidatedAnswers: consolidatedAnswerSchema.optional(),
  frustrationOneWord: z.string().optional(),
  biggestChallenge: z.string(),
  whatWouldConvince: z.string(),
  concerns: z.string(),
  wantsNotification: z.string(),
  notificationEmail: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = submitSchema.parse(body);

    const supabase = createServerClient();

    const record: Record<string, unknown> = {
      name: input.name || null,
      country: input.country,
      age_group: input.ageGroup,
      occupation: input.occupation,
      team_size: input.teamSize,
      platform_count: input.platformCount,
      difficulty_rating: input.difficultyRating,
      cross_post_frequency: input.crossPostFrequency,
      platforms_used: input.platformsUsed,
      platform_answers: input.platformAnswers || {},
      consolidated_answers: input.consolidatedAnswers || {},
      biggest_challenge: input.biggestChallenge,
      what_would_convince: input.whatWouldConvince,
      concerns: input.concerns,
      wants_notification: input.wantsNotification,
      notification_email: input.notificationEmail || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("survey_responses")
      .insert([record])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to submit survey" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
