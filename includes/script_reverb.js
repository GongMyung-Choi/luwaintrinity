// ==============================
//  Supabase Global Init
// ==============================

// 여기에 네 프로젝트 URL/KEY 그대로 붙이면 됨
const SUPABASE_URL = "https://omchtafaqgkdwcrwscrp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabase;

// 현재 로그인한 유저 정보
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("유저 조회 실패:", error);
    return null;
  }
  return data.user;
}

window.getCurrentUser = getCurrentUser;
