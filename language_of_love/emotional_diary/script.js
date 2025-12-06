// emotional_diary/script.js
// 감정일기를 Supabase emotional_diary 테이블에 저장/조회하는 전용 스크립트

const diaryForm = document.getElementById("diaryForm");
const moodInput = document.getElementById("mood");
const contentInput = document.getElementById("content");
const diariesList = document.getElementById("diariesList");

// 일기 저장
async function saveDiary() {
  const supabase = window.supabaseClient;
  if (!supabase) return alert("시스템 오류");

  const user = await window.getCurrentUser();
  if (!user) return alert("로그인 필요");

  const mood = moodInput?.value.trim() || "";
  const content = contentInput?.value.trim() || "";

  if (!content) return alert("내용이 비어 있습니다.");

  const { error } = await supabase.from("emotional_diary").insert({
    user_id: user.id,
    mood,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error(error);
    alert("저장 실패");
    return;
  }

  alert("저장되었습니다!");
  contentInput.value = "";
  loadDiaries();
}

// 내 일기 목록 불러오기
async function loadDiaries() {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  const user = await window.getCurrentUser();
  if (!user) {
    diariesList.innerHTML = "<li>로그인 후 이용 가능</li>";
    return;
  }

  const { data, error } = await supabase
    .from("emotional_diary")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    diariesList.innerHTML = "<li>일기를 불러오지 못했습니다.</li>";
    return;
  }

  diariesList.innerHTML = "";

  if (!data || data.length === 0) {
    diariesList.innerHTML = "<li>작성된 감정일기가 없습니다.</li>";
    return;
  }

  data.forEach(item => {
    const li = document.createElement("li");
    const date = new Date(item.created_at).toLocaleString("ko-KR");

    li.innerHTML = `
      <strong>[${item.mood || "감정"}]</strong> 
      ${item.content} 
      <span style="color:#999;">${date}</span>
    `;

    diariesList.appendChild(li);
  });
}

if (diaryForm) {
  diaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveDiary();
  });
}

document.addEventListener("DOMContentLoaded", loadDiaries);
