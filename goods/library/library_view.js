const params = new URLSearchParams(location.search);
const file = params.get("file");
const viewer = document.getElementById("viewer");

const fileUrl = `/luwain-storage/library/${file}`;

const ext = file.split('.').pop().toLowerCase();

// PDF
if (ext === "pdf") {
    viewer.innerHTML = `<embed src="${fileUrl}" width="100%" height="800px">`;
}
// TXT | MD
else if (["txt","md"].includes(ext)) {
    fetch(fileUrl)
        .then(r => r.text())
        .then(t => viewer.innerHTML = `<pre>${t}</pre>`);
}
// DOCX / 기타
else {
    viewer.innerHTML = `
        <p>미리보기 미지원 파일</p>
        <a href="${fileUrl}" download>다운로드</a>
    `;
}
