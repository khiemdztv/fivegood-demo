import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Upload file lên Supabase Storage
 * Bucket: "evidences"
 */
export async function uploadEvidence(file, studentCode) {
  if (!supabase) {
    console.warn('Supabase chưa cấu hình – sử dụng mock');
    return { path: `mock/${file.name}`, error: null };
  }

  const ext = file.name.split('.').pop();
  const path = `${studentCode}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('evidences')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) return { path: null, error: error.message };

  const { data: urlData } = supabase.storage
    .from('evidences')
    .getPublicUrl(path);

  return { path: data.path, url: urlData.publicUrl, error: null };
}

/**
 * Lấy public URL của file đã upload
 */
export function getFileUrl(path) {
  if (!supabase) return null;
  const { data } = supabase.storage.from('evidences').getPublicUrl(path);
  return data.publicUrl;
}
