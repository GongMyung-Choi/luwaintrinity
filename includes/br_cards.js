// /includes/br_cards.js
// 숨틔움 카드: Storage의 os/images/cards 에서 무작위로 한 장 뽑아 보여준다.

(function () {
  const cardStatus = document.getElementById("cardStatus");
  const cardBox = document.getElementById("cardBox");
  const cardImg = document.getElementById("cardImg");

  if (!cardStatus || !cardImg) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    cardStatus.textContent = "시스템 오류 (supabase 없음)";
    return;
  }

  // 🔥 버킷 이름: 공명이 실제로 쓰는 이름으로 교체
  const BUCKET = "luwain-storage";
  const PREFIX = "images/cards";

  async function drawRandomCard() {
    cardStatus.textContent = "불러오는 중…";
    cardBox.style.display = "none";

    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .list(PREFIX, {
        limit: 200,
        sortBy: { column: "name", order: "asc" }
      });

    if (error) {
      console.error("카드 목록 실패:", error);
      cardStatus.textContent = "카드를 불러오지 못했습니다.";
      return;
    }

    const files = (data || []).filter(f => !f.name.startsWith("."));
    if (files.length === 0) {
      cardStatus.textContent = "등록된 카드가 없습니다.";
      return;
    }

    const picked = files[Math.floor(Math.random() * files.length)];

    const publicUrl = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(`${PREFIX}/${picked.name}`).data.publicUrl;

    cardImg.src = publicUrl;
    cardBox.style.display = "block";
    cardStatus.textContent = "";
  }

  // 클릭하면 새 카드
  cardBox.addEventListener("click", drawRandomCard);

  document.addEventListener("DOMContentLoaded", drawRandomCard);
})();
