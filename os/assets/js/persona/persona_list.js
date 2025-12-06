// /os/assets/js/persona/persona_list.js

import { supabase } from "../core/supabase_client.js";

const tbody = document.getElementById("personaTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const newPersonaBtn = document.getElementById("newPersonaBtn");
const refreshBtn = document.getElementById("refreshBtn");

let allPersonas = [];

// 날짜 포맷
function formatDate(str) {
  if (!str) return "-";
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// 테이블 렌더링
function renderTable(list) {
  tbody.innerHTML = "";

  if (!list.length) {
    emptyMessage.style.display = "block";
    return;
  } else {
    emptyMessage.style.display = "none";
  }

  list.forEach((p) => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";

    tr.innerHTML = `
      <td class="key">${p.persona_key}</td>
      <td>${p.display_name ?? ""}</td>
      <td>
        <span class="tag">${p.base || "base: -"} </span>
        <span class="tag">${p.hair || "hair: -"} </span>
        <span class="tag">${p.outfit || "outfit: -"} </span>
        <span class="tag">${p.accessory || "acc: -"} </span>
      </td>
      <td>
        ${p.color_theme ? `<span class="tag">${p.color_theme}</span>` : "-"}
      </td>
      <td>${formatDate(p.updated_at)}</td>
      <td>
        <button class="small-btn" data-key="${p.persona_key}">편집</button>
      </td>
    `;

    // 행 클릭 → 에디터로
    tr.addEventListener("click", (e) => {
      // 편집 버튼 클릭은 중복 처리 방지
      if (e.target instanceof HTMLElement && e.target.dataset.key) return;
      goEdit(p.persona_key);
    });

    // 편집 버튼
    tr.querySelector(".small-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const key = e.target.dataset.key;
      goEdit(key);
    });

    tbody.appendChild(tr);
  });
}

// 에디터로 이동
function goEdit(key) {
  if (key) {
    window.location.href = `/os/persona_lab/editor.html?persona=${encodeURIComponent(
      key
    )}`;
  } else {
    window.location.href = `/os/persona_lab/editor.html`;
  }
}

// Supabase에서 persona_profiles 불러오기
async function loadPersonas() {
  const { data, error } = await supabase
    .from("persona_profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[persona_list] load error", error);
    tbody.innerHTML =
      '<tr><td colspan="6" style="color:red;">불러오기 실패</td></tr>';
    return;
  }

  allPersonas = data || [];
  applyFilter();
}

// 검색 필터
function applyFilter() {
  const q = (searchInput.value || "").toLowerCase().trim();

  if (!q) {
    renderTable(allPersonas);
    return;
  }

  const filtered = allPersonas.filter((p) => {
    const key = (p.persona_key || "").toLowerCase();
    const name = (p.display_name || "").toLowerCase();
    const base = (p.base || "").toLowerCase();
    const hair = (p.hair || "").toLowerCase();
    const outfit = (p.outfit || "").toLowerCase();
    const acc = (p.accessory || "").toLowerCase();
    const color = (p.color_theme || "").toLowerCase();

    return (
      key.includes(q) ||
      name.includes(q) ||
      base.includes(q) ||
      hair.includes(q) ||
      outfit.includes(q) ||
      acc.includes(q) ||
      color.includes(q)
    );
  });

  renderTable(filtered);
}

// 이벤트 연결
searchInput.addEventListener("input", () => {
  applyFilter();
});

newPersonaBtn.addEventListener("click", () => {
  goEdit(null);
});

refreshBtn.addEventListener("click", () => {
  loadPersonas();
});

// 초기 로드
loadPersonas();
