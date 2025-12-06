// /includes/exercise.js
// 울림 연습: 오늘의 울림을 한 건씩 저장하는 페이지

// 요소 참조
const saveBtn = document.getElementById("saveBtn");
const textArea = document.getElementById("exerciseText");
const statusBox = document.getElementById("status");

// 저장 처리
async function saveExercise() {
  if (!supabase) {
    console.error("Supabase 초기화 안 됨: script_reverb.js가 먼저 로드되어야 합니다.");
    statusBox.textContent = "시스템 오류: 관리자에게 문의해주세요.";
    return;
  }

  statusBox.textContent = "저장 중…";

  const user = await getCurrentUser();
  const content = textArea.value.trim();

  if (!content) {
    statusBox.textContent = "내용이 비어 있습니다.";
    return;
  }

  if (!user) {
    statusBox.textContent = "로그인 후 이용할 수 있습니다.";
    return;
  }

  const { error } = await supabase
    .from("reverberation_exercise")
    .insert({
      user_id: user.id,
      content: content,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error(error);
    statusBox.textContent = "저장 실패. 다시 시도해주세요.";
  } else {
    statusBox.textContent = "저장 완료!";
    textArea.value = "";
  }
}

if (saveBtn) {
  saveBtn.addEventListener("click", saveExercise);
}
