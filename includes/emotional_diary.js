// 감성일기 전용 스크립트

// Supabase 클라이언트는 supabase_client.js에서 생성되어 있음
// 여기서는 supabase 변수 바로 사용 가능

document.getElementById("saveBtn").addEventListener("click", async () => {
  const mood = document.getElementById("mood").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!content || !mood) {
    alert("기분과 내용을 입력해주세요.");
    return;
  }

  // 로그인 체크
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    alert("저장은 회원만 가능합니다.");
    return;
  }

  const { error } = await supabase.from("emotional_diary").insert({
    user_id: user.id,
    mood,
    content
  });

  if (error) {
    console.error(error);
    alert("저장 중 오류 발생");
    return;
  }

  alert("저장되었습니다.");
  document.getElementById("content").value = "";
  document.getElementById("mood").value = "";
});


// 기록 불러오기
document.getElementById("loadBtn").addEventListener("click", async () => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  const { data, error } = await supabase
    .from("emotional_diary")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("불러오기 오류");
    return;
  }

  const area = document.getElementById("listArea");
  area.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.mood}</strong><br>
      ${item.content}<br>
      <small>${item.created_at}</small>
    `;
    area.appendChild(li);
  });
});
