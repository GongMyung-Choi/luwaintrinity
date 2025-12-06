// /includes/log.js
// 울림 일지: 기록 저장 + 사용자별 목록 조회

const logText = document.getElementById("logText");
const logWriteBtn = document.getElementById("writeBtn");
const logList = document.getElementById("logList");

function renderLogItem(item) {
  const li = document.createElement("li");
  const d = new Date(item.created_at);
  const dateStr = d.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  li.textContent = `[${dateStr}] ${item.content}`;
  return li;
}

async function loadLogs() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase 클라이언트 없음");
    return;
  }

  if (!window.getCurrentUser) {
    console.error("getCurrentUser 없음");
    return;
  }

  const user = await window.getCurrentUser();
  if (!logList) return;

  if (!user) {
    logList.innerHTML = "<li>로그인 후 일지를 볼 수 있습니다.</li>";
    return;
  }

  const { data, error } = await supabase
    .from("reverb_log") // ✅ Supabase 실제 테이블명
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("일지 조회 실패:", error);
    logList.innerHTML = "<li>일지를 불러오지 못했습니다.</li>";
    return;
  }

  logList.innerHTML = "";
  if (!data || data.length === 0) {
    logList.innerHTML = "<li>작성한 일지가 아직 없습니다.</li>";
    return;
  }

  data.forEach((item) => {
    logList.appendChild(renderLogItem(item));
  });
}

async function saveLog() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase 클라이언트 없음");
    return;
  }

  if (!logText) return;

  const content = logText.value.trim();
  if (!content) return;

  if (!window.getCurrentUser) {
    alert("로그인 정보를 확인할 수 없습니다.");
    return;
  }

  const user = await window.getCurrentUser();
  if (!user) {
    alert("로그인 후 작성할 수 있습니다.");
    return;
  }

  const { error } = await supabase
    .from("reverb_log") // ✅
    .insert({
      user_id: user.id,
      content,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error("일지 저장 실패:", error);
    alert("저장에 실패했습니다. 다시 시도해주세요.");
    return;
  }

  logText.value = "";
  await loadLogs();
}

if (logWriteBtn) {
  logWriteBtn.addEventListener("click", saveLog);
}

document.addEventListener("DOMContentLoaded", loadLogs);
