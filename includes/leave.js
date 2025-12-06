// /includes/leave.js

const leaveInput = document.getElementById("leaveText");
const leaveBtn = document.getElementById("leaveBtn");
const leaveStatus = document.getElementById("leaveStatus");

async function saveLeave() {
  const text = (leaveInput?.value || "").trim();
  if (!text) {
    leaveStatus.textContent = "남길 말을 적어주세요.";
    return;
  }

  const user = await getCurrentUser();
  const payload = {
    content: text,
    created_at: new Date().toISOString(),
  };
  if (user) payload.user_id = user.id;

  const { error } = await supabase
    .from("reverberation_leave")
    .insert(payload);

  leaveStatus.textContent = error ? "저장 실패" : "저장 완료!";
  if (!error) leaveInput.value = "";
}

if (leaveBtn) leaveBtn.addEventListener("click", saveLeave);
