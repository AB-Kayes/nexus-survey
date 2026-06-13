-- Migration: Create survey_responses table
-- Run with: npx supabase db push

CREATE TABLE IF NOT EXISTS survey_responses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT,
  country TEXT NOT NULL,
  age_group TEXT NOT NULL,
  occupation TEXT NOT NULL,
  team_size TEXT NOT NULL,
  platform_count TEXT NOT NULL,
  difficulty_rating INTEGER NOT NULL,
  cross_post_frequency TEXT NOT NULL,
  platforms_used TEXT[] NOT NULL DEFAULT '{}',
  platform_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  consolidated_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  other_texts JSONB NOT NULL DEFAULT '{}'::jsonb,
  biggest_challenge TEXT NOT NULL,
  what_would_convince TEXT NOT NULL,
  concerns TEXT NOT NULL,
  wants_notification TEXT NOT NULL,
  notification_email TEXT,
  frustration_one_word TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for survey submissions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Allow anonymous inserts'
  ) THEN
    CREATE POLICY "Allow anonymous inserts" ON survey_responses
      FOR INSERT WITH CHECK (true);
  END IF;
END
$$;

-- Allow service role full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Allow service role full access'
  ) THEN
    CREATE POLICY "Allow service role full access" ON survey_responses
      FOR ALL USING (true);
  END IF;
END
$$;
