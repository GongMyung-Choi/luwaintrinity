// /includes/br_clips.js
// 숨틔움 단편 로더: 영상(mp4 등), 음성(mp3 등) 자동 재생

(function () {
  const clipStatus = document.getElementById("clipStatus");
  const clipList = document.getElementById("clipList");

  const playerBox = document.getElementById("playerBox");
  const playerTitle = document.getElementById("playerTitle");

  const videoPlayer = document.getElementById("videoPlayer");
  const audioPlayer = document.getElementById("audioPlayer");

  if (!clipStatus || !clipList) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    clipStatus.textContent = "시스템 오류 (supabase 없음)";
    return;
  }

  // 🔥 실제 버킷 이름으로 교체
  const BUCKET = "luwain-storage";

  // 네가 실제로 쓸 폴더 구조 기반
  const PREFIX = "clips";   
  // Storage 경로 = os/clips/* (mp4, mp3, etc.)

  async function loadClips() {
    clipStatus.textContent = "클립 목록 불러오는 중…";

    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .list(PREFIX, {
        limit: 200,
        sortBy: { column: "name", order: "asc" }
      });

    if (error) {
      console.error("클립 목록 오류:", error);
      clipStatus.textContent = "클립을 불러올 수 없습니다.";
      return;
    }

    const files = (data || []).filter(f => !f.name.startsWith("."));
    if (files.length === 0) {
      clipStatus.textContent = "등록된 클립이 없습니다.";
      return;
    }

    clipStatus.textContent = "";
    clipList.innerHTML = "";

    files.forEach(file => {
      const li = document.createElement("div");
      li.className = "clip-item";
      li.textContent = file.name;

      li.addEventListener("click", () => playClip(file.name));
      clipList.appendChild(li);
    });
  }

  function playClip(name) {
    const publicUrl = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(`${PREFIX}/${name}`).data.publicUrl;

    // 확장자 판별
    const ext = name.toLowerCase().split(".").pop();

    playerTitle.textContent = name;
    playerBox.style.display = "block";

    videoPlayer.style.display = "none";
    audioPlayer.style.display = "none";

    if (["mp4", "webm", "mov"].includes(ext)) {
      videoPlayer.src = publicUrl;
      videoPlayer.style.display = "block";
      videoPlayer.play();
    } else if (["mp3", "wav", "ogg"].includes(ext)) {
      audioPlayer.src = publicUrl;
      audioPlayer.style.display = "block";
      audioPlayer.play();
    } else {
      alert("지원하지 않는 파일 형식입니다.");
    }
  }

  document.addEventListener("DOMContentLoaded", loadClips);
})();
