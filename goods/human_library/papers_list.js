async function loadFiles() {
    const list = document.getElementById("file-list");

    try {
        // GitHub Pages / Vercel에서도 작동하는 방식
        const res = await fetch("./papers/");
        const html = await res.text();

        // 폴더 내 파일명 추출
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const links = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(h => h && !h.startsWith("?") && !h.startsWith("/"))
            .filter(h => h.match(/\.(pdf|txt|md)$/i));

        if (links.length === 0) {
            list.innerHTML = "파일이 없습니다.";
            return;
        }

        list.innerHTML = links.map(f => `
            <div class="list-item" onclick="openFile('${f}')">
                <div class="title">${f}</div>
            </div>
        `).join("");

    } catch (e) {
        list.innerHTML = "Error: 폴더를 읽을 수 없습니다.";
    }
}

window.openFile = function(file) {
    location.href = `./viewer.html?file=${encodeURIComponent(file)}`;
}

loadFiles();
