// language_of_love/shall_we_try_love/practice.js

const PRACTICE_TABLE = "love_dialog_practice";

const scenarioInput = document.getElementById("scenario");
const myLineInput = document.getElementById("my-line");
const practiceForm = document.getElementById("practice-form");
const practiceList = document.getElementById("practice-list");

async function loadPracticeHistory() {
  const supabase = window.supabaseClient;
  if (!supabase || !practiceList) return;

  const user = await window.getCurrentUser?.();
  if (!user) {
    practiceList.innerHTML = "<li>로그인 후 연습 기록을 볼 수 있습니다.</li>";
    return;
  }

  const { data, error } = await supabase
    .from(PRACTICE_TABLE)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("사랑의 연습 기록 조회 실패:", error);
    practiceList.innerHTML = "<li>연습 기록을 불러오지 못했습니다.</li>";
    return;
  }

  practiceList.innerHTML = "";

  if (!data || data.length === 0) {
    practiceList.innerHTML = "<li>아직 저장된 연습이 없습니다.</li>";
    return;
  }

  data.forEach((item) => {
    const li = document.createElement("li");
    const d = new Date(item.created_at);
    const ds = d.toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    li.innerHTML = `
      <strong>상황:</strong> ${item.scenario || "(설명 없음)"}<br>
      <strong>내 말:</strong> ${item.line}<br>
      <span style="color:#999;">${ds}</span>
    `;

    practiceList.appendChild(li);
  });
}

async function savePractice(e) {
  e.preventDefault();

  const supabase = window.supabaseClient;
  if (!supabase) {
    alert("시스템 오류: Supabase 클라이언트 없음");
    return;
  }

  const user = await window.getCurrentUser?.();
  if (!user) {
    alert("로그인 후 저장할 수 있습니다.");
    return;
  }

  const scenario = scenarioInput?.value.trim() || "";
  const line = myLineInput?.value.trim() || "";

  if (!line) {
    alert("내 말을 적어주세요.");
    return;
  }

  const { error } = await supabase
    .from(PRACTICE_TABLE)
    .insert({
      user_id: user.id,
      scenario,
      line,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error("사랑의 연습 저장 실패:", error);
    alert("저장에 실패했습니다.");
    return;
  }

  myLineInput.value = "";
  // scenario는 계속 유지해도 되고, 비워도 된다. 여기선 그냥 그대로 둔다.

  await loadPracticeHistory();
}

if (practiceForm) {
  practiceForm.addEventListener("submit", savePractice);
}

document.addEventListener("DOMContentLoaded", loadPracticeHistory);
