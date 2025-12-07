/* writing_room.js */
/* 
   이 파일은 실제 DB 저장 로직을 나중에 Supabase로 연결하기 위한 “기본 갈고리”가 완성된 상태.
   지금은 로그인/비로그인 모드만 흉내내고, 저장 버튼 누르면 팝업만 보여줌.
*/

console.log("[writing_room.js] loaded");

// ========== 1) 로그인/퍼스나 여부 (임시) ==========
let isLoggedIn = false;   // TODO: supabase.auth.getUser()로 대체
let userId = null;        // TODO: 여기에 supabase.user.id 들어감
let personaId = null;     // TODO: 선택된 퍼스나 id

const statusText = document.getElementById("statusText");
const popupSaved = document.getElementById("popupSaved");

// 로그인 상태 표시
function updateLoginUI() {
  if (isLoggedIn) {
    statusText.textContent = "사물함 연결됨 — 저장 가능";
  } else {
    statusText.textContent = "체험 모드 — 저장 불가능";
  }
}
updateLoginUI();


// ========== 2) 저장하기 ==========
document.getElementById("btnSave").addEventListener("click", async () => {
  const content = document.getElementById("content").value.trim();

  if (content.length === 0) {
    alert("내용이 없습니다.");
    return;
  }

  if (!isLoggedIn) {
    alert("체험 모드에서는 저장할 수 없습니다.");
    return;
  }

  // -------- 실제 저장 로직 (나중에 Supabase로 연결) --------
  /*
  const { data, error } = await supabase
    .from("persona_text_storage")
    .insert([
      {
        user_id: userId,
        persona_id: personaId,
        title: extractTitle(content),
        content: content,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    alert("저장 실패: " + error.message);
    return;
  }
  */

  showSavedPopup();
});

// 제목 자동 생성 (본문 첫 줄)
function extractTitle(text) {
  const firstLine = text.split("\n")[0];
  return firstLine.length > 30 ? firstLine.slice(0, 30) + "…" : firstLine;
}


// ========== 3) 불러오기 (임시) ==========
document.getElementById("btnLoad").addEventListener("click", () => {
  if (!isLoggedIn) {
    alert("로그인 후 사용 가능합니다.");
    return;
  }
  alert("불러오기 기능은 나중에 연결됩니다.");
});


// ========== 4) 내용 지우기 ==========
document.getElementById("btnClear").addEventListener("click", () => {
  if (confirm("정말 내용을 지울까요?")) {
    document.getElementById("content").value = "";
  }
});


// ========== 5) 저장 팝업 ==========
function showSavedPopup() {
  popupSaved.classList.add("show");
  setTimeout(() => popupSaved.classList.remove("show"), 1500);
}
