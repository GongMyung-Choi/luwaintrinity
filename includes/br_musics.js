// /includes/br_musics.js
// 숨틔움 음악 (Supabase Storage에서 mp3/wav 파일 목록 로딩 후 플레이)

(function () {
  const statusEl = document.getElementById("musicStatus");
  const listEl = document.getElementById("musicList");

  const playerBox = document.getElementById("playerBox");
  const playerTitle = document.getElementById("playerTitle");
  const audioPlayer = document.getElementById("audioPlayer");

  if (!statusEl || !listEl) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    statusEl.textContent = "시스템 오류 (supabase 없음)";
    return;
  }

  // 🔥 실제 버킷명으로 교체 필요
  const BUCKET = "luwain-storage";
  const PREFIX = "musics";  // Storage 구조: os/musics/*

  async function loadMusics() {
    statusEl.textContent = "음악 목록 불러오는 중…";

    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .list(PREFIX, {
        limit: 200,
        sortBy: { column: "name", order: "asc" }
      });

    if (error) {
      console.error("음악 목록 오류:", error);
      statusEl.textContent = "음악을 불러오지 못했습니다.";
      return;
    }

    const files = (data || []).filter(f => /\.(mp3|wav|ogg)$/i.test(f.name));
    if (files.length === 0) {
      statusEl.textContent = "등록된 음악이 없습니다.";
      return;
    }

    statusEl.textContent = "";
    listEl.innerHTML = "";

    files.forEach(file => {
      const li = document.createElement("div");
      li.className = "music-item";
      li.textContent = file.name;

      li.addEventListener("click", () => playMusic(file.name));

      listEl.appendChild(li);
    });
  }

  function playMusic(name) {
    const publicUrl = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(`${PREFIX}/${name}`).data.publicUrl;

    playerBox.style.display = "block";
    playerTitle.textContent = name;
    audioPlayer.src = publicUrl;
    audioPlayer.play();
  }

  document.addEventListener("DOMContentLoaded", loadMusics);
})();
