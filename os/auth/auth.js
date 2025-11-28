import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
export const supabase = createClient(
  'https://omchtafaqgkdwcrwscrp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
'
);

export async function signUp(email, password, nickname) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } }
  });
  if (error) alert(error.message);
  else {
    alert('회원가입 성공! 로그인하세요.');
    location.href = 'login.html';
  }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    localStorage.setItem('luwein_user', JSON.stringify(data));
    location.href = '../breathing_room/new_0.html';
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('luwein_user');
  location.href = 'login.html';
}
