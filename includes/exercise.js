const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

document.getElementById("saveBtn").onclick = async () => {
  const text = document.getElementById("exerciseText").value.trim();
  if (!text) {
    document.getElementById("status").innerText = "내용이 없습니다.";
    return;
  }

  const { data, error } = await supabase
    .from("resonance_exercise")
    .insert([{ content: text }]);

  if (error) {
    document.getElementById("status").innerText = "저장 실패";
  } else {
    document.getElementById("status").innerText = "저장 완료";
    document.getElementById("exerciseText").value = "";
  }
};
