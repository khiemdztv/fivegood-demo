-- ═══════════════════════════════════════════
-- FiveGood Journey – Database Schema
-- Chạy trong Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Bảng users (sinh viên + cán bộ)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  mssv TEXT,
  school TEXT,
  faculty TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'reviewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng evidences (minh chứng upload)
CREATE TABLE IF NOT EXISTS evidences (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  criteria_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT DEFAULT 'IMAGE',
  file_url TEXT,
  ai_validity TEXT DEFAULT 'SUSPECT',
  ai_score REAL DEFAULT 0.5,
  extracted_text TEXT,
  extracted_fields JSONB DEFAULT '{}',
  criteria_match TEXT,
  ai_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng criteria_progress (tiến độ từng tiêu chí)
CREATE TABLE IF NOT EXISTS criteria_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  criteria_id TEXT NOT NULL,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'in_progress', 'complete')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, criteria_id)
);

-- 4. Bảng chat_messages (lịch sử chat AI Mentor)
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ RLS Policies (Row Level Security) ═══
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc/ghi tất cả (demo mode - vòng 2 sẽ dùng auth)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on evidences" ON evidences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on criteria_progress" ON criteria_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on chat_messages" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
