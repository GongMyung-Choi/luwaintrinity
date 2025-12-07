const params = new URLSearchParams(location.search);
const file = params.get("file");

document.getElementById("title").textContent = file;

const viewer = document.getElementById("viewer");

if (file.endsWith(".pdf")) {
    viewer.innerHTML = `
        <embed src="./papers/${file}" width="100%" height="600px" type="application/pdf">
    `;
} else {
    loadText();
}

async function loadText() {
    try {
        const res = await fetch(`./papers/${file}`);
        const text = await res.text();
        viewer.innerHTML = `<pre>${text}</pre>`;
    } catch (e) {
        viewer.innerHTML = "파일 읽기 실패";
    }
}
