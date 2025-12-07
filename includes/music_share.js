import { supabase } from "/path/to/supabase_client.js";

document.getElementById("shareMusicBtn")?.addEventListener("click", async () => {
  // 현재 음악 정보 가져오기
  const musicId = window.currentMusicId;
  if (!musicId) {
    alert("음악 정보를 찾을 수 없습니다.");
    return;
  }

  // 음악 DB에서 데이터 불러오기
  const { data: music, error } = await supabase
    .from("music_records")
    .select("*")
    .eq("id", musicId)
    .single();

  if (error || !music) {
    alert("음악 데이터를 불러오지 못했습니다.");
    return;
  }

  // 사용자 정보
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  // shared_items 에 등록
  const payload = {
    owner_id: user.id,
    type: "music",
    title: music.title || "제목 없는 음악",
    content_base64: null, // 음악은 URL 기반이므로 NULL
    extra: {
      audio_url: music.audio_url,      // 음악 파일 URL
      description: music.description,  // 곡 설명
      cover_url: music.cover_url || null
    }
  };

  const { error: shareError } = await supabase
    .from("shared_items")
    .insert([payload]);

  if (shareError) {
    console.error(shareError);
    alert("공유 실패");
  } else {
    alert("음악이 공유되었습니다!");
    window.location.href = "/shared/shared_music.html"; 
  }
});
