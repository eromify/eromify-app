const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eyteuevblxvhjhyeivqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection error:', error);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }

  try {
    console.log('\n2. Testing auth signIn...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    if (error) {
      console.log('✅ Auth error (expected):', error.message);
    } else {
      console.log('❌ Unexpected success:', data);
    }
  } catch (err) {
    console.error('❌ Auth test failed:', err.message);
  }
}

testConnection();
