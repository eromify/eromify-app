const { createClient } = require('@supabase/supabase-js');

let cachedClient = null;

const decodeJwtPayload = (token) => {
  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) return null;
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (error) {
    console.warn('Unable to decode Supabase service key payload:', error.message);
    return null;
  }
};

const buildClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://eyteuevblxvhjhyeivqh.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL env variable is not defined. Please configure your Supabase project URL.');
  }

  // In development, allow fallback to anon key if service role key is not set
  if (!serviceRoleKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY env variable is not defined. This backend requires the service role key to bypass RLS for server-side operations.'
      );
    } else {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not set, using ANON_KEY for development. Some operations may fail due to RLS policies.');
      return createClient(supabaseUrl, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    }
  }

  // Just use the provided key without validation
  // Some projects may have custom key configurations
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

const getSupabaseAdmin = () => {
  if (!cachedClient) {
    cachedClient = buildClient();
  }
  return cachedClient;
};

module.exports = {
  getSupabaseAdmin
};

