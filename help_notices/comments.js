import { supabase } from "../supabase_client.js";

export async function adminList() {
    const list = document.getElementById("admin-list");
    const view = document.getElementById("admin-view");

    list.style.display = "block";
    view.style.display = "none";

    const { data } = await supabase
        .from("helps")
        .select("*")
        .order("created_at", { ascending: false });

    list.innerHTML = data.map(h => `
        <div class="list-item" onclick="adminView('${h.id}')">
            <div class="title">${h.title}</div>
            <div class="author">${h.author}</div>
            <div class="date">${new Date(h.created_at).toLocaleString()}</div>
            ${h.is_secret ? '<span class="lock">🔒</span>' : ''}
        </div>
    `).join("");
}

window.adminView = async function(id) {
    const list = document.getElementById("admin-list");
    const view = document.getElementById("admin-view");

    list.style.display = "none";
    view.style.display = "block";

    window.currentHelpId = id;

    const { data } = await supabase
        .from("helps")
        .select("*")
        .eq("id", id)
        .single();

    document.getElementById("a-title").textContent = data.title;
    document.getElementById("a-author").textContent = data.author;
    document.getElementById("a-date").textContent = new Date(data.created_at).toLocaleString();
    document.getElementById("a-content").innerHTML = data.content.replace(/\n/g, "<br>");

    loadComments(id);
}

async function loadComments(help_id) {
    const { data } = await supabase
        .from("help_comments")
        .select("*")
        .eq("help_id", help_id)
        .order("created_at", { ascending: true });

    document.getElementById("comment-list").innerHTML = data.map(c => `
        <div class="comment-item">
            <div class="author">${c.author}</div>
            <div class="content">${c.content.replace(/\n/g, "<br>")}</div>
            <div class="date">${new Date(c.created_at).toLocaleString()}</div>
        </div>
    `).join("");
}

window.saveComment = async function() {
    const text = document.getElementById("comment-input").value.trim();
    if (!text) return;

    await supabase.from("help_comments").insert([
        {
            help_id: window.currentHelpId,
            author: "운영자",
            content: text
        }
    ]);

    document.getElementById("comment-input").value = "";
    loadComments(window.currentHelpId);
}

window.adminList = adminList;
