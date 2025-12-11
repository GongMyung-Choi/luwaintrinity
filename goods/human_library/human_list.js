const listBox = document.getElementById("library-list");

const BUCKET = "luwain-storage";
const ROOT_FOLDER = "human_library";

const params = new URLSearchParams(window.location.search);
let currentPath = params.get("path") || "";

function joinPath(base, name) {
    if (!base) return name;
    return `${base}/${name}`;
}

function getParentPath(path) {
    if (!path) return "";
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    return parts.join("/");
}

function isFile(entry) {
    if (entry.metadata && entry.metadata.mimetype) return true;
    return entry.name.includes(".");
}

function buildBreadcrumb() {
    const base = window.location.pathname.split("?")[0];
    const segments = currentPath ? currentPath.split("/").filter(Boolean) : [];
    let pathAcc = "";
    const links = [
        `<a href="${base}">/human_library</a>`
    ];

    segments.forEach((seg) => {
        pathAcc = joinPath(pathAcc, seg);
        const url = `${base}?path=${encodeURIComponent(pathAcc)}`;
        links.push(`<a href="${url}">${seg}</a>`);
    });

    return links.join(" / ");
}

async function loadList() {
    if (!listBox) return;

    listBox.innerHTML = "<p>불러오는 중...</p>";

    const folderPath = [ROOT_FOLDER, currentPath].filter(Boolean).join("/");

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folderPath, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" }
        });

    if (error) {
        console.error(error);
        listBox.innerHTML = "<p>목록을 불러오는 중 오류가 발생했습니다.</p>";
        return;
    }

    const folders = [];
    const files = [];

    (data || []).forEach((entry) => {
        if (isFile(entry)) files.push(entry);
        else folders.push(entry);
    });

    const parts = [];

    parts.push(`<div class="breadcrumbs">${buildBreadcrumb()}</div>`);

    if (currentPath) {
        const parent = getParentPath(currentPath);
        const base = window.location.pathname.split("?")[0];
        const url = parent
            ? `${base}?path=${encodeURIComponent(parent)}`
            : base;
        parts.push(`<button type="button" onclick="location.href='${url}'">⬆ 상위 폴더</button>`);
    }

    if (folders.length) {
        parts.push(`<h2>폴더</h2>`);
        parts.push(`<ul class="folder-list">`);
        folders.forEach((folder) => {
            const nextPath = joinPath(currentPath, folder.name);
            const base = window.location.pathname.split("?")[0];
            const url = `${base}?path=${encodeURIComponent(nextPath)}`;
            parts.push(`
                <li class="folder-item">
                    📁 <a href="${url}">${folder.name}</a>
                </li>
            `);
        });
        parts.push(`</ul>`);
    }

    if (files.length) {
        parts.push(`<h2>파일</h2>`);
        parts.push(`<ul class="file-list">`);
        files.forEach((file) => {
            const pathInLibrary = joinPath(currentPath, file.name);
            const safePath = pathInLibrary.replace(/'/g, "\\'");
            parts.push(`
                <li class="file-item">
                    📄 <button type="button" onclick="openHumanDoc('${safePath}')">
                        ${file.name}
                    </button>
                </li>
            `);
        });
        parts.push(`</ul>`);
    }

    if (!folders.length && !files.length) {
        parts.push("<p>이 폴더에는 파일이 없습니다.</p>");
    }

    listBox.innerHTML = parts.join("\n");
}

function openHumanDoc(pathInLibrary) {
    const url = "human_view.html?file=" + encodeURIComponent(pathInLibrary);
    window.location.href = url;
}

loadList();
