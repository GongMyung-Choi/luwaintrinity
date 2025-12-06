import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { loadFoldersIntoSelect } from "./writing_folders.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let folderMap = {}; // folder_id -> name

async function loadFoldersMap() {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase
    .from("writing_folders")
    .select("*")
    .eq("user_id", user.id);

  if (error) return;

  folderMap = {};
  data.forEach(f => { folderMap[f.id] = f.name; });
}

async function moveWriting(id, newFolderId) {
  const { error } = await supabase
    .from("writings")
    .update({ folder_id: newFolderId, updated_at: new Date() })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("이동 실패");
  } else {
    alert("이동 완료");
    loadWritings();
  }
}

async function loadWritings() {
  const user = (await supabase.auth.getUser()).data.user;

  await loadFoldersMap();

  const { data, error } = await supabase
    .from("writings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return;

  const box = document.getElementById("writing_list");

  box.innerHTML = data
    .map(w => {
      const folderName = w.folder_id ? (folderMap[w.folder_id] ?? "(폴더 없음)") : "(폴더 없음)";
      return `
      <div class="writing_item">
        <h3>
          <a href="view.html?id=${w.id}">${w.title ?? "(제목 없음)"}</a>
        </h3>
        <small>${w.type ?? "free"} · ${folderName}</small>
        <p>${(w.content ?? "").substring(0, 120)}...</p>

        <label>폴더 이동:
          <select onchange="moveWriting('${w.id}', this.value)">
            ${Object.entries(folderMap).map(([id, name]) =>
              `<option value="${id}" ${w.folder_id === id ? "selected" : ""}>${name}</option>`
            ).join("")}
          </select>
        </label>
        <hr>
      </div>
      `;
    })
    .join("");

  // moveWriting을 글로벌에 붙여줘야 select onchange가 먹힘
  window.moveWriting = moveWriting;
}

loadWritings();
