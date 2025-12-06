// 감응언어학 EPUB Reader
// 기존 EPUB 구조를 그대로 로딩하여 표시한다.
// epub/ 아래의 OEBPS 구조를 그대로 사용.

(function() {

  // EPUB 위치
  const epubPath = "../epub/";

  // 반응형 reader 생성
  const book = ePub(epubPath);

  const viewer = document.getElementById("viewer");
  const tocBox = document.getElementById("toc");

  let rendition;

  book.ready.then(() => book.loaded.navigation).then(toc => {
    toc.forEach(item => {
      const div = document.createElement("div");
      div.className = "chapter-link";
      div.textContent = item.label;
      div.addEventListener("click", () => {
        rendition.display(item.href);
      });
      tocBox.appendChild(div);
    });
  });

  // 렌더링 대상
  rendition = book.renderTo("viewer", {
    width: "100%",
    height: "100%"
  });

  rendition.display();

})();
