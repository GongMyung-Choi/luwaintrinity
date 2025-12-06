import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://YOUR-PROJECT.supabase.co",
  "public-anon-key"
);

// 퍼스나 생성
export async function createPersona(name, desc="") {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("로그인이 필요합니다.");

  const { error } = await supabase
    .from("personas")
    .insert({
      user_id: user.id,
      name,
      description: desc
    });

  if (error) {
    console.error(error);
    alert("퍼스나 생성 실패");
  } else {
    alert("퍼스나가 만들어졌습니다.");
    location.reload();
  }
}

// 전체 목록 조회
export async function loadPersonas() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return data || [];
}

// 삭제
export async function deletePersona(id) {
  const { error } = await supabase.from("personas").delete().eq("id", id);
  if (error) alert("삭제 실패");
  else location.reload();
}

// 대표 퍼스나 설정
export async function setActivePersona(id) {
  localStorage.setItem("active_persona", id);
  alert("대표 퍼스나가 설정되었습니다.");
  location.reload();
}

// ▼ 페이지 이벤트 바인딩
window.addEventListener("DOMContentLoaded", async () => {
  const listBox = document.getElementById("personaList");

  // 설정 페이지: 생성 버튼
  const btn = document.getElementById("createPersona");
  if (btn) {
    btn.onclick = () => {
      const name = document.getElementById("p_name").value;
      const desc = document.getElementById("p_desc").value;
      createPersona(name, desc);
    };
  }

  // 리스트 표시
  if (listBox) {
    const personas = await loadPersonas();
    const active = localStorage.getItem("active_persona");

    listBox.innerHTML = personas
      .map(
        (p) => `
      <div class="persona_item ${p.id === active ? "active" : ""}">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>

        <button onclick="setActivePersona('${p.id}')">대표로 설정</button>
        <button onclick="deletePersona('${p.id}')">삭제</button>
      </div>
    `
      )
      .join("");
  }
});
