// 울림의 언어 공통 셸 스크립트
// 1) 글로벌 헤더/푸터 불러오기
// 2) 울림 섹션 내부 메뉴(active) 처리

(async () => {
  // 1. 글로벌 헤더/푸터 로드
  const headerHost = document.getElementById("luwein-header");
  const footerHost = document.getElementById("luwein-footer");

  if (headerHost) {
    const headerPaths = [
      "./includes/header.html",
      "../includes/header.html",
      "../../includes/header.html",
      "/includes/header.html"
    ];
    for (const p of headerPaths) {
      try {
        const r = await fetch(p, { cache: "no-cache" });
        if (r.ok) {
          headerHost.innerHTML = await r.text();
          break;
        }
      } catch (e) {}
    }
  }

  if (footerHost) {
    const footerPaths = [
      "./includes/footer.html",
      "../includes/footer.html",
      "../../includes/footer.html",
      "/includes/footer.html"
    ];
    for (const p of footerPaths) {
      try {
        const r = await fetch(p, { cache: "no-cache" });
        if (r.ok) {
          footerHost.innerHTML = await r.text();
          break;
        }
      } catch (e) {}
    }
  }

  // 2. 울림 섹션 서브 메뉴 활성화
  //   - body data-reverb-page 속성에 페이지 키를 넣어 두면
  //   - .reverb-nav a[data-page="키"] 에 active 클래스 추가
  const pageKey = document.body.dataset.reverbPage;
  if (!pageKey) return;

  const nav = document.querySelector(".reverb-nav");
  if (!nav) return;

  const links = nav.querySelectorAll("a[data-page]");
  links.forEach((a) => {
    if (a.dataset.page === pageKey) {
      a.classList.add("active");
    }
  });
})();
