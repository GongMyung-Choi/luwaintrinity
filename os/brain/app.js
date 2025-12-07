// ---------- Supabase 연결 ----------
const supabaseUrl = "https://omchtafaqgkdwcrwscrp.supabase.co";     // 공명이 넣을 부분
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
";              // 공명이 넣을 부분
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ---------- 사용자 고유키 생성 ----------
function getUserKey() {
    let key = localStorage.getItem("brain_user_key");
    if (!key) {
        key = "user-" + crypto.randomUUID();
        localStorage.setItem("brain_user_key", key);
    }
    return key;
}

// ---------- 대화 저장 ----------
async function saveLog(role, text) {
    const userKey = getUserKey();
    const { error } = await supabase
        .from("brain_logs")
        .insert([{ user_key: userKey, role, message: text }]);

    if (error) console.error("DB 저장 실패:", error);
}

// ---------- UI 요소 ----------
const input = document.getElementById("input");
const output = document.getElementById("output");
const sendBtn = document.getElementById("send");

// ---------- 대화 처리 ----------
async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    saveLog("user", text);

    // AI 응답 (레카)
    const reply = await aiReply(text);

    addMessage("assistant", reply);
    saveLog("assistant", reply);

    input.value = "";
}

// ---------- AI 응답 (지금은 데모용) ----------
async function aiReply(text) {
    return "레카 응답: " + text + " (테스트)";
}

// ---------- 메시지 UI 추가 ----------
function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    output.appendChild(div);

    output.scrollTop = output.scrollHeight;
}

sendBtn.onclick = sendMessage;
input.onkeydown = (e) => e.key === "Enter" && sendMessage();
