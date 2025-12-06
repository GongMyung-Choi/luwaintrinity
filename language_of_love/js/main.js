// 공통 헤더 로딩
const headerContainer = document.getElementById("lov-header");
if (headerContainer) {
  fetch("/language_of_love/includes/header.html")
    .then(r => r.text())
    .then(html => headerContainer.innerHTML = html);
}

// 공통 푸터 로딩
const footerContainer = document.getElementById("lov-footer");
if (footerContainer) {
  fetch("/language_of_love/includes/footer.html")
    .then(r => r.text())
    .then(html => footerContainer.innerHTML = html);
}
