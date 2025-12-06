// /includes/br_chat.js

const supabase = window.supabaseClient; // script_reverb.js에서 생성됨

// 요소
const messagesBox = document.getElementById("messages");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// 메시지 출력
function appendMessage(msg, mine = false) {
  const div = document.createElement("div");
  div.classList.add("msg");
  if (mine) div.classList.add("mine");
  div.textContent = msg;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// 기존 메시지 불러오기
async function loadMessages() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("br_chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(m => appendMessage(m.message, true));
}

// 메시지 저장
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  const user = (await supabase.auth.getUser()).data.user;

  // DB 저장
  const { error } = await supabase
    .from("br_chat_messages")
    .insert({
      user_id: user.id,
      message: text
    });

  if (error) {
    console.error(error);
    alert("전송 실패");
    return;
  }

  appendMessage(text, true);
  input.value = "";
}

// 버튼/엔터키 이벤트
sendBtn.onclick = sendMessage;
input.onkeypress = e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
};

// 실행
loadMessages();
