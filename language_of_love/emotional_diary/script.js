// script.js
const supabase = supabase.createClient(
  "https://omchtafaqgkdwcrwscrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
"
);

// 로그인 상태 체크 (index.html 전용)
async function checkAuth() {
  const { data: { session }} = await supabase.auth.getSession();

  if (session) {
    document.getElementById("login-warning").style.display = "none";
    document.getElementById("write-buttons").style.display = "block";
  } else {
    document.getElementById("login-warning").style.display = "block";
    document.getElementById("write-buttons").style.display = "none";
  }
}

// 새 글 저장
async function saveNewEntry() {
  const mood = document.getElementById("mood").value;
  const text = document.getElementById("text").value;

  const { data: { session }} = await supabase.auth.getSession();
  if (!session) return alert("로그인 필요함.");

  const { error } = await supabase
    .from("emotional_diary")
    .insert({
      user_id: session.user.id,
      mood,
      text
    });

  if (error) alert(error.message);
  else window.location.href = "returning_user.html";
}

// 기존 글 불러오기
async function loadEntry() {
  const { data: { session }} = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase
    .from("emotional_diary")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (data) {
    document.getElementById("mood").value = data.mood;
    document.getElementById("text").value = data.text;
  }
}

// 기존 글 업데이트
async function updateEntry() {
  const mood = document.getElementById("mood").value;
  const text = document.getElementById("text").value;

  const { data: { session }} = await supabase.auth.getSession();
  if (!session) return;

  await supabase
    .from("emotional_diary")
    .update({
      mood,
      text
    })
    .eq("user_id", session.user.id);

  alert("저장됨.");
}
