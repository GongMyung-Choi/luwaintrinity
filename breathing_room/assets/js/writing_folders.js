import { createClient } from "https://esm.sh/@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadFoldersIntoSelect() {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase
    .from("writing_folders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const sel = document.getElementById("folder_select");
  if (!sel) return;

  sel.innerHTML = data
    .map(f => `<option value="${f.id}">${f.name}</option>`)
    .join("");
}

// 폴더 생성
async function createFolder() {
  const name = document.getElementById("folder_name").value;
  const user = (await supabase.auth.getUser()).data.user;

  if (!name.trim()) return alert("폴더 이름을 입력하세요.");

  const { error } = await supabase
    .from("writing_folders")
    .insert({ user_id: user.id, name });

  if (error) alert("폴더 생성 실패");
  else {
    alert("폴더 생성됨");
    location.reload();
  }
}

document.getElementById("folder_create_btn").onclick = createFolder;
loadFoldersIntoSelect();

export { loadFoldersIntoSelect };
