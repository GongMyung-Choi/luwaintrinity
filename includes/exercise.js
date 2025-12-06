// /includes/exercise.js
// 울림 연습: 오늘의 울림을 한 건씩 저장

const exSaveBtn = document.getElementById("saveBtn");
const exTextArea = document.getElementById("exerciseText");
const exStatusBox = document.getElementById("status");

async function saveExercise() {
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다. script_reverb.js 로드를 확인하세요.");
    if (exStatusBox) exStatusBox.textContent = "시스템 오류: 관리자에게 문의해주세요.";
    return;
  }

  if (!exTextArea) return;

  const content = exTextArea.value.trim();
  if (!content) {
    if (exStatusBox) exStatusBox.textContent = "내용이 비어 있습니다.";
    return;
  }

  if (!window.getCurrentUser) {
    console.error("getCurrentUser 함수가 없습니다.");
    if (exStatusBox) exStatusBox.textContent = "로그인 정보를 확인할 수 없습니다.";
    return;
  }

  const user = await window.getCurrentUser();
  if (!user) {
    if (exStatusBox) exStatusBox.textContent = "로그인 후 이용할 수 있습니다.";
    return;
  }

  if (exStatusBox) exStatusBox.textContent = "저장 중…";

  const { error } = await supabase
    .from("reverb_practice") // ✅ Supabase 실제 테이블명
    .insert({
      user_id: user.id,
      content,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error("울림 연습 저장 실패:", error);
    if (exStatusBox) exStatusBox.textContent = "저장 실패. 다시 시도해주세요.";
  } else {
    if (exStatusBox) exStatusBox.textContent = "저장 완료!";
    exTextArea.value = "";
  }
}

if (exSaveBtn) {
  exSaveBtn.addEventListener("click", saveExercise);
}
