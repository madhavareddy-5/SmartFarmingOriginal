/*
  # Complete schema setup for AI Smart Farming Platform

  1. Tables
    - `users` (existing)
    - `disease_detections`
    - `chat_sessions`
    - `chat_messages`
    - `water_predictions`
    - `fertilizer_recommendations`

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Disease Detections Table
CREATE TABLE IF NOT EXISTS disease_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  detected_disease text NOT NULL,
  confidence float NOT NULL,
  recommendations text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own disease detections"
  ON disease_detections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease detections"
  ON disease_detections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages from their sessions"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their sessions"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Water Predictions Table
CREATE TABLE IF NOT EXISTS water_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  soil_type text NOT NULL,
  area float NOT NULL,
  temperature float NOT NULL,
  humidity float NOT NULL,
  water_requirement float NOT NULL,
  frequency text NOT NULL,
  recommendations text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own water predictions"
  ON water_predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water predictions"
  ON water_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fertilizer Recommendations Table
CREATE TABLE IF NOT EXISTS fertilizer_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  soil_type text NOT NULL,
  nitrogen float NOT NULL,
  phosphorus float NOT NULL,
  potassium float NOT NULL,
  recommendations jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fertilizer_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own fertilizer recommendations"
  ON fertilizer_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer recommendations"
  ON fertilizer_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Optional: Enable RLS on the users table

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (id = auth.uid());
