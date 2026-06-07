import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ═══ User CRUD ═══

export async function createUser({ name, mssv, school, faculty, role }) {
  if (!supabase) return { data: null, error: 'Supabase chưa cấu hình' };
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, mssv, school, faculty, role }])
    .select()
    .single();
  return { data, error: error?.message };
}

export async function getUser(id) {
  if (!supabase) return null;
  const { data } = await supabase.from('users').select('*').eq('id', id).single();
  return data;
}

export async function findUserByMssv(mssv) {
  if (!supabase) return null;
  const { data } = await supabase.from('users').select('*').eq('mssv', mssv).maybeSingle();
  return data;
}

// ═══ Criteria Progress ═══

const DEFAULT_CRITERIA = [
  { criteria_id: 'c1', progress: 0, status: 'missing' },
  { criteria_id: 'c2', progress: 0, status: 'missing' },
  { criteria_id: 'c3', progress: 0, status: 'missing' },
  { criteria_id: 'c4', progress: 0, status: 'missing' },
  { criteria_id: 'c5', progress: 0, status: 'missing' },
];

export async function getUserProgress(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('criteria_progress')
    .select('*')
    .eq('user_id', userId)
    .order('criteria_id');

  // Nếu chưa có → tạo mới
  if (!data || data.length === 0) {
    const rows = DEFAULT_CRITERIA.map(c => ({ user_id: userId, ...c }));
    const { data: created } = await supabase.from('criteria_progress').insert(rows).select();
    return created || [];
  }
  return data;
}

export async function updateCriteriaProgress(userId, criteriaId, progress) {
  if (!supabase) return null;
  const status = progress >= 100 ? 'complete' : progress > 0 ? 'in_progress' : 'missing';
  const { data } = await supabase
    .from('criteria_progress')
    .upsert({ user_id: userId, criteria_id: criteriaId, progress, status, updated_at: new Date().toISOString() }, { onConflict: 'user_id,criteria_id' })
    .select()
    .single();
  return data;
}

// ═══ Evidences ═══

export async function saveEvidence({ userId, criteriaId, fileName, fileType, fileUrl, aiValidity, aiScore, extractedText, extractedFields, criteriaMatch, aiNote }) {
  if (!supabase) return { data: null, error: 'Supabase chưa cấu hình' };
  const { data, error } = await supabase
    .from('evidences')
    .insert([{
      user_id: userId,
      criteria_id: criteriaId,
      file_name: fileName,
      file_type: fileType,
      file_url: fileUrl,
      ai_validity: aiValidity,
      ai_score: aiScore,
      extracted_text: extractedText,
      extracted_fields: extractedFields,
      criteria_match: criteriaMatch,
      ai_note: aiNote,
    }])
    .select()
    .single();
  return { data, error: error?.message };
}

export async function getUserEvidences(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('evidences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ═══ Storage ═══

export async function uploadEvidence(file, studentCode) {
  if (!supabase) {
    console.warn('Supabase chưa cấu hình – sử dụng mock');
    return { path: `mock/${file.name}`, error: null };
  }

  const ext = file.name.split('.').pop();
  const path = `${studentCode}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('evidences')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) return { path: null, error: error.message };

  const { data: urlData } = supabase.storage.from('evidences').getPublicUrl(path);
  return { path: data.path, url: urlData.publicUrl, error: null };
}

export function getFileUrl(path) {
  if (!supabase) return null;
  const { data } = supabase.storage.from('evidences').getPublicUrl(path);
  return data.publicUrl;
}
