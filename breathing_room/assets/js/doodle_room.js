/* doodle_room.js */
/*
  이미지 업로드 + 미리보기 + 나중에 사물함으로 저장할 수 있도록
  Supabase 저장 로직 갈고리까지 완성된 기본 버전
*/

console.log("[doodle_room.js] loaded");

// 로그인/퍼스나 연결 여부 (임시)
let isLoggedIn = false;   // TODO: supabase.auth 사용
let userId = null;        // TODO: actual user ID
let personaId = null;     // TODO: selected persona ID

const fileInput = document.getElementById("fileInput");
const uploaderBox = document.getElementById("uploaderBox");
const previewArea = document.getElementById("previewArea");
const btnSave = document.getElementById("btnSave");
const saveStatus = document.getElementById("saveStatus");
const popupSaved = document.getElementById("popupSaved");

// ---------- 로그인 UI ----------
function updateLoginUI() {
  saveStatus.textContent = isLoggedIn
    ? "사물함 연결됨 — 저장 가능"
    : "체험 모드 — 저장 불가능";
}
updateLoginUI();

// ---------- 파일 선택 ----------
fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

// ---------- Drag & Drop ----------
uploaderBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploaderBox.style.borderColor = "#2f8ee0";
});

uploaderBox.addEventListener("dragleave", () => {
  uploaderBox.style.borderColor = "#ccc";
});

uploaderBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploaderBox.style.borderColor = "#ccc";
  handleFiles(e.dataTransfer.files);
});

// ---------- 이미지 표시 ----------
function handleFiles(files) {
  [...files].forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement("div");
      div.className = "preview-item";

      div.innerHTML = `
        <img src="${e.target.result}" />
        <p style="font-size:0.75rem; color:#666;">${file.name}</p>
      `;

      previewArea.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// ---------- 저장 ----------
btnSave.addEventListener("click", async () => {
  if (!isLoggedIn) {
    alert("체험 모드에서는 저장할 수 없습니다.");
    return;
  }

  const files = fileInput.files;
  if (!files || files.length === 0) {
    alert("저장할 이미지가 없습니다.");
    return;
  }

  /*
  // ---------- 실제 Supabase 저장 로직 (나중에 툭 치면 활성화됨) ----------
  for (let file of files) {
    const fileName = `${userId}/${personaId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("persona_doodles")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      alert("저장 실패: " + error.message);
      return;
    }

    // DB 메타데이터 저장
    await supabase.from("persona_doodle_meta").insert([
      {
        user_id: userId,
        persona_id: personaId,
        file_path: fileName,
        original_name: file.name,
        created_at: new Date().toISOString()
      }
    ]);
  }
  */

  showSavedPopup();
});

// ---------- 저장 팝업 ----------
function showSavedPopup() {
  popupSaved.classList.add("show");
  setTimeout(() => popupSaved.classList.remove("show"), 1500);
}
