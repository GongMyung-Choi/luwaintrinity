// /includes/br_chat.js
// 숨틔움 대화방: 개인 메시지 저장/조회

(function () {
  const msgBox = document.getElementById("messages");
  const inputEl = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!msgBox || !inputEl) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    alert("시스템 오류: Supabase 없음");
    return;
  }

  const TABLE = "br_chat_messages";

  function addMessageBubble(text, mine = true, time = null) {
    const div = document.createElement("div");
    div.className = "msg " + (mine ? "mine" : "system");
    div.innerHTML = text.replace(/\n/g, "<br>");

    if (time) {
      div.innerHTML += `<br><small style="opacity:.6;font-size:0.8rem;">${time}</small>`;
    }

    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  // 초기 로딩
  async function loadMessages() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      // 비회원 시스템 메시지
      addMessageBubble("저장은 회원만 가능합니다.", false);
      addMessageBubble("하지만 체험은 가능합니다!", false);
      return;
    }

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      addMessageBubble("메시지를 불러올 수 없습니다.", false);
      return;
    }

    data.forEach(item => {
      addMessageBubble(
        item.content,
        true,
        new Date(item.created_at).toLocaleString()
      );
    });
  }

  // 메시지 저장
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessageBubble(text, true);
    msgBox.scrollTop = msgBox.scrollHeight;
    inputEl.value = "";

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      addMessageBubble("저장은 불가능합니다 (비회원).", false);
      return;
    }

    const { error } = await supabase.from(TABLE).insert({
      user_id: user.id,
      content: text
    });

    if (error) {
      console.error(error);
      addMessageBubble("메시지 저장 오류!", false);
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  document.addEventListener("DOMContentLoaded", loadMessages);
})();
