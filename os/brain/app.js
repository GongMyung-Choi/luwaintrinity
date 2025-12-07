/* ========== 1) Supabase 연결 ========== */
const SUPABASE_URL = "https://omchtafaqgkdwcrwscrp.supabase.co";     // 공명 넣는 곳
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
";              // 공명 넣는 곳
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* ========== 2) 사용자 고유키 생성 ========== */
function getUserKey() {
    let key = localStorage.getItem("brain_user_key");
    if (!key) {
        key = "user-" + crypto.randomUUID();
        localStorage.setItem("brain_user_key", key);
    }
    return key;
}


/* ========== 3) DB 저장 ========== */
async function saveLog(role, text) {
    const userKey = getUserKey();
    await supabase.from("brain_logs")
        .insert([{ user_key: userKey, role, message: text }]);
}


/* ========== 4) UI 요소 ========== */
const input = document.getElementById("input");
const output = document.getElementById("output");
const send = document.getElementById("send");


/* ========== 5) 메시지 전송 ========== */
async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    saveLog("user", text);
    input.value = "";

    const reply = await aiReply(text);
    addMessage("assistant", reply);
    saveLog("assistant", reply);
}


/* ========== 6) 레카 응답 (실시간 API) ========== */
/* 공명: 여기 주소만 네 서버 주소로 교체해라 */
const BRAIN_API = "https://너도메인.vercel.app/api/brain";

async function aiReply(userText) {
    try {
        const res = await fetch(BRAIN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        const data = await res.json();
        return data.reply || "(응답 없음)";
    } catch (err) {
        console.error(err);
        return "(브레인 서버 연결 오류)";
    }
}


/* ========== 7) 메시지 UI 추가 ========== */
function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    output.appendChild(div);

    output.scrollTop = output.scrollHeight;
}

send.onclick = sendMessage;
input.onkeydown = (e) => e.key === "Enter" && sendMessage();
