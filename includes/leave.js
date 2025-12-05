const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

document.getElementById("leaveBtn").onclick = async () => {
  const text = document.getElementById("leaveText").value.trim();
  if (!text) {
    document.getElementById("msg").innerText = "내용이 없습니다.";
    return;
  }

  const visibility = document.querySelector("input[name='visibility']:checked").value;

  const { error } = await supabase
    .from("leave_resonance")
    .insert([{ content: text, visibility: visibility }]);

  if (error) {
    document.getElementById("msg").innerText = "저장 실패";
  } else {
    document.getElementById("msg").innerText = "업로드 완료";
    document.getElementById("leaveText").value = "";
  }
};
