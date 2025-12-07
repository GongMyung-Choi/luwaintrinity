const listBox = document.getElementById("list");

async function loadList() {
    const { data, error } = await supabase
        .from("ai_library")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        listBox.innerHTML = "<p>불러오기 오류</p>";
        return;
    }

    listBox.innerHTML = data.map(doc => `
        <div>
            <h3>${doc.title}</h3>
            <button onclick="openDoc('${doc.filename}')">열기</button>
        </div>
    `).join("");
}

function openDoc(filename) {
    location.href = `library_view.html?file=${encodeURIComponent(filename)}`;
}

loadList();
