// /includes/br_todays_breathing.js
// 오늘의 숨: os/images/todays_breathing/ 에서 랜덤으로 한 장 골라 보여준다.

(function () {
  const statusEl = document.getElementById("todayStatus");
  const boxEl = document.getElementById("todayBox");
  const imgEl = document.getElementById("todayImg");
  const captionEl = document.getElementById("todayCaption");
  const refreshBtn = document.getElementById("refreshBtn");

  if (!statusEl || !imgEl) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase 클라이언트 없음");
    statusEl.textContent = "시스템 오류 (supabase 없음)";
    return;
  }

  const BUCKET_NAME = "luwain-storage"; // 실제 버킷 이름으로 교체
  const PREFIX = "images/todays_breathing";

  async function pickRandomImage() {
    statusEl.textContent = "이미지를 불러오는 중…";
    boxEl.style.display = "none";
    captionEl.textContent = "";

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list(PREFIX, {
        limit: 200,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("오늘의 숨 목록 실패:", error);
      statusEl.textContent = "이미지를 불러오지 못했습니다.";
      return;
    }

    const files = (data || []).filter(f => !f.name.startsWith("."));
    if (files.length === 0) {
      statusEl.textContent = "등록된 이미지가 없습니다.";
      return;
    }

    const picked = files[Math.floor(Math.random() * files.length)];
    const publicUrl = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(`${PREFIX}/${picked.name}`).data.publicUrl;

    imgEl.src = publicUrl;
    boxEl.style.display = "block";
    statusEl.textContent = "";
    captionEl.textContent = picked.name;
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", pickRandomImage);
  }

  document.addEventListener("DOMContentLoaded", pickRandomImage);
})();
