const params = new URLSearchParams(window.location.search);
const filename = params.get("file");
const viewer = document.getElementById("viewer");

if (!filename) {
    viewer.innerHTML = "<p>파일이 존재하지 않습니다.</p>";
}

const fileUrl = `/luwain-storage/human_library/${filename}`;

function render() {
    const ext = filename.split(".").pop().toLowerCase();

    if (ext === "pdf") {
        viewer.innerHTML = `
            <embed src="${fileUrl}" type="application/pdf" width="100%" height="800px">
        `;
    }
    else if (ext === "txt" || ext === "md") {
        fetch(fileUrl)
            .then(res => res.text())
            .then(text => {
                viewer.innerHTML = `<pre>${text}</pre>`;
            });
    }
    else {
        viewer.innerHTML = `
            <p>미리보기를 지원하지 않는 파일입니다.</p>
            <a href="${fileUrl}" download>파일 다운로드</a>
        `;
    }
}

render();
