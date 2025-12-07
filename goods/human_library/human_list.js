const listBox = document.getElementById("library-list");

async function loadLibrary() {
    const { data, error } = await supabase
        .from("human_library")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        listBox.innerHTML = "<p>불러오기 오류</p>";
        return;
    }

    listBox.innerHTML = data
        .map(doc => `
            <div class="item">
                <h3>${doc.title}</h3>
                <p>${doc.description || ""}</p>
                <button onclick="openDoc('${doc.filename}')">열기</button>
            </div>
        `)
        .join("");
}

function openDoc(filename) {
    window.location.href = `view.html?file=${encodeURIComponent(filename)}`;
}

loadLibrary();
