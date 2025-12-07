import { supabase } from "../supabase_client.js";

export async function showList() {
    const list = document.getElementById("notice-list");
    const view = document.getElementById("notice-view");

    list.style.display = "block";
    view.style.display = "none";

    const { data } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

    list.innerHTML = data.map(n => `
        <div class="list-item" onclick="viewNotice('${n.id}')">
            <div class="title">${n.title}</div>
            <div class="date">${new Date(n.created_at).toLocaleString()}</div>
        </div>
    `).join("");
}

window.viewNotice = async function(id) {
    const list = document.getElementById("notice-list");
    const view = document.getElementById("notice-view");

    list.style.display = "none";
    view.style.display = "block";

    const { data } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .single();

    document.getElementById("v-title").textContent = data.title;
    document.getElementById("v-date").textContent = new Date(data.created_at).toLocaleString();
    document.getElementById("v-content").innerHTML = data.content.replace(/\n/g, "<br>");
}

window.showList = showList;
