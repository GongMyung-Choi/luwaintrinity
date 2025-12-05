const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 저장
document.getElementById("writeBtn").onclick = async () => {
  const text = document.getElementById("logText").value.trim();
  if (!text) return;

  const { error } = await supabase
    .from("resonance_log")
    .insert([{ content: text }]);

  if (!error) {
    document.getElementById("logText").value = "";
    loadLogs();
  }
};

// 목록 불러오기
async function loadLogs() {
  const { data, error } = await supabase
    .from("resonance_log")
    .select("*")
    .order("id", { ascending: false });

  const list = document.getElementById("logList");
  list.innerHTML = "";

  if (data) {
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item.content;
      list.appendChild(li);
    });
  }
}

loadLogs();
