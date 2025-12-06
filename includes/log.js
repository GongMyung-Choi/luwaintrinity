// ==============================
//  울림 일지 (reverb_log)
//  - 기록 저장
//  - 목록 조회
// ==============================

const logText = document.getElementById("logText");
const writeBtn = document.getElementById("writeBtn");
const logList = document.getElementById("logList");

// 렌더링
function makeItem(entry) {
  const li = document.createElement("li");

  const d = new Date(entry.created_at);
  const t = d.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  li.textContent = `[${t}] ${entry.content}`;
  return li;
}

// 목록 조회
async function loadLog() {
  const user = await getCurrentUser();
  if (!user) {
    if (logList) logList.innerHTML = "<li>로그인 필요.</li>";
    return;
  }

  const { data, error } = await supabase
    .from("reverb_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("일지 조회 실패:", error);
    logList.innerHTML = "<li>조회 오류.</li>";
    return;
  }

  logList.innerHTML = "";
  if (!data || data.length === 0) {
    logList.innerHTML = "<li>아직 작성한 일지가 없습니다.</li>";
    return;
  }

  data.forEach((item) => {
    logList.appendChild(makeItem(item));
  });
}

// 저장
async function writeLog() {
  const user = await getCurrentUser();
  if (!user) {
    alert("로그인 필요.");
    return;
  }

  const text = (logText?.value || "").trim();
  if (!text) return;

  const { error } = await supabase
    .from("reverb_log")
    .insert({
      user_id: user.id,
      content: text,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error(error);
    alert("저장 실패.");
    return;
  }

  logText.value = "";
  await loadLog();
}

if (writeBtn) writeBtn.addEventListener("click", writeLog);
document.addEventListener("DOMContentLoaded", loadLog);
