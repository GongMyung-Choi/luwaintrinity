import { supabase } from "../supabase_client.js";

export async function showList() {
    const list = document.getElementById("help-list");
    const view = document.getElementById("help-view");
    const write = document.getElementById("help-write");

    list.style.display = "block";
    view.style.display = "none";
    write.style.display = "none";

    const { data } = await supabase
        .from("helps")
        .select("*")
        .order("created_at", { ascending: false });

    list.innerHTML = data.map(h => `
        <div class="list-item" onclick="viewHelp('${h.id}')">
            <div class="title">${h.title}</div>
            <div class="author">${h.author}</div>
            <div class="date">${new Date(h.created_at).toLocaleString()}</div>
            ${h.is_secret ? '<span class="lock">🔒</span>' : ''}
        </div>
    `).join("");
}

window.showWrite = function() {
    document.getElementById("help-list").style.display = "none";
    document.getElementById("help-view").style.display = "none";
    document.getElementById("help-write").style.display = "block";
}

window.saveHelp = async function() {
    const author = document.getElementById("w-author").value || "익명";
    const title = document.getElementById("w-title").value.trim();
    const content = document.getElementById("w-content").value.trim();
    const is_secret = document.getElementById("w-secret").checked;

    if (!title || !content) return alert("입력 부족");

    let key = localStorage.getItem("client_key");
    if (!key) {
        key = crypto.randomUUID();
        localStorage.setItem("client_key", key);
    }

    await supabase.from("helps").insert([
        { author, title, content, is_secret, client_key: key }
    ]);

    alert("등록됨");
    showList();
}

window.viewHelp = async function(id) {
    const list = document.getElementById("help-list");
    const view = document.getElementById("help-view");
    const write = document.getElementById("help-write");

    list.style.display = "none";
    write.style.display = "none";
    view.style.display = "block";

    const { data } = await supabase
        .from("helps")
        .select("*")
        .eq("id", id)
        .single();

    const myKey = localStorage.getItem("client_key");

    if (data.is_secret && data.client_key !== myKey) {
        document.getElementById("v-title").textContent = "비밀글입니다.";
        document.getElementById("v-author").textContent = "";
        document.getElementById("v-date").textContent = "";
        document.getElementById("v-content").textContent =
            "작성자와 운영자만 열람할 수 있습니다.";
        return;
    }

    document.getElementById("v-title").textContent = data.title;
    document.getElementById("v-author").textContent = data.author;
    document.getElementById("v-date").textContent = new Date(data.created_at).toLocaleString();
    document.getElementById("v-content").innerHTML = data.content.replace(/\n/g, "<br>");
}

window.showList = showList;
