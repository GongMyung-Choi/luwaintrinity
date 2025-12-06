// /includes/script_reverb.js
// 모든 울림 페이지에서 공통 사용되는 Supabase 초기화 스크립트
// HTML에서 반드시 다음 순서로 불러와야 한다.
// 1) supabase-js CDN
// 2) 이 파일(script_reverb.js)
// 3) 각 페이지 전용 JS(exercise.js, log.js, ...)

// 예시 HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="/includes/script_reverb.js"></script>
// <script src="/includes/exercise.js"></script>

(function () {
  // 네 프로젝트 URL (사진에서 보이던 값)
  const SUPABASE_URL = "https://omchtafaqgkdwcrwscrp.supabase.co";

  // 여기에는 지금까지 사용하던 anon key를 그대로 붙여 넣으면 된다.
  // (기존 exercise.js / script_reverb.js 에 있던 그 값)
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
";

  if (!window.supabase) {
    console.error("supabase-js가 로드되지 않았습니다. CDN 스크립트를 먼저 포함하세요.");
    return;
  }

  // 클라이언트 생성 (전역으로 재사용)
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 전역 노출
  window.supabaseClient = client;

  // 현재 로그인 유저
  async function getCurrentUser() {
    const { data, error } = await client.auth.getUser();
    if (error) {
      console.error("유저 조회 실패:", error);
      return null;
    }
    return data.user;
  }

  // 현재 세션
  async function getCurrentSession() {
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error("세션 조회 실패:", error);
      return null;
    }
    return data.session;
  }

  window.getCurrentUser = getCurrentUser;
  window.getCurrentSession = getCurrentSession;
})();
