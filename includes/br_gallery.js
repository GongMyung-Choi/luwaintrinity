// /includes/br_gallery.js
// 숨틔움 갤러리: Supabase Storage 에서 os/images/gallery/* 리스트를 불러와서 보여준다.

(function () {
  const statusEl = document.getElementById("galleryStatus");
  const gridEl = document.getElementById("galleryGrid");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");

  if (!statusEl || !gridEl) return; // 다른 페이지에서 로드되어도 무시

  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다. script_reverb.js 확인 필요.");
    statusEl.textContent = "시스템 오류 (supabase 없음)";
    return;
  }

  // ✅ 여기에 실제 사용 중인 버킷 이름 넣기
  const BUCKET_NAME = "luwain-storage"; // 예: "os" 나 "public" 등. 네가 쓰는 이름으로 교체.

  // Storage 상의 폴더 경로
  const GALLERY_PREFIX = "images/gallery";

  async function loadGallery() {
    statusEl.textContent = "이미지를 불러오는 중…";

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list(GALLERY_PREFIX, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("갤러리 이미지 목록 불러오기 실패:", error);
      statusEl.textContent = "이미지를 불러오지 못했습니다.";
      return;
    }

    if (!data || data.length === 0) {
      statusEl.textContent = "등록된 이미지가 없습니다.";
      return;
    }

    statusEl.textContent = "";
    gridEl.innerHTML = "";

    data.forEach((file) => {
      if (file.name.startsWith(".")) return; // .keep 등 무시
      const publicUrl = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${GALLERY_PREFIX}/${file.name}`).data.publicUrl;

      const item = document.createElement("div");
      item.className = "gallery-item";

      const img = document.createElement("img");
      img.src = publicUrl;
      img.alt = file.name;

      const title = document.createElement("div");
      title.className = "gallery-item-title";
      title.textContent = file.name;

      item.appendChild(img);
      item.appendChild(title);
      gridEl.appendChild(item);

      item.addEventListener("click", () => {
        viewerImg.src = publicUrl;
        viewer.style.display = "flex";
      });
    });
  }

  if (viewer) {
    viewer.addEventListener("click", () => {
      viewer.style.display = "none";
      viewerImg.src = "";
    });
  }

  document.addEventListener("DOMContentLoaded", loadGallery);
})();
