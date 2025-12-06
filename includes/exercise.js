// ==============================
//  울림 연습 저장 (reverb_practice)
// ==============================

const exInput = document.getElementById("exerciseText");
const exBtn = document.getElementById("saveBtn");
const exStatus = document.getElementById("status");

async function saveExercise() {
  const user = await getCurrentUser();
  if (!user) {
    exStatus.textContent = "로그인 필요.";
    return;
  }

  const text = (exInput?.value || "").trim();
  if (!text) {
    exStatus.textContent = "내용이 비어 있음.";
    return;
  }

  exStatus.textContent = "저장 중…";

  const { error } = await supabase
    .from("reverb_practice")
    .insert({
      user_id: user.id,
      content: text,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error(error);
    exStatus.textContent = "저장 실패.";
    return;
  }

  exInput.value = "";
  exStatus.textContent = "저장 완료.";
}

if (exBtn) {
  exBtn.addEventListener("click", saveExercise);
}
