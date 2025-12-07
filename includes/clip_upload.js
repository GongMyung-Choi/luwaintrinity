const supabase = window.supabaseClient;

document.getElementById("saveClipBtn").addEventListener("click", async () => {
  const title = document.getElementById("clipTitle").value.trim();
  const youtubeUrl = document.getElementById("clipUrl").value.trim();
  const description = document.getElementById("clipDescription").value.trim();

  if (!youtubeUrl) {
    alert("유튜브 URL을 입력하세요.");
    return;
  }

  // Youtube URL 유효성 간단 체크
  const isValid = youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be");
  if (!isValid) {
    alert("유효한 유튜브 주소가 아닙니다.");
    return;
  }

  const { data, error } = await supabase
    .from("clips_records")
    .insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title,
        youtube_url: youtubeUrl,
        description
      }
    ]);

  if (error) {
    console.error(error);
    alert("저장 실패");
  } else {
    alert("클립이 저장되었습니다!");
    window.location.href = "/shared/shared_clips.html";  // 공유 페이지로 이동
  }
});
