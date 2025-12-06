// /includes/br_writings.js
// 숨틔움 글쓰기: 텍스트 작성/저장/조회

(function () {
  const contentEl = document.getElementById("writingContent");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");

  const listEl = document.getElementById("writingList");
  const detailBox = document.getElementById("detailBox");
  const detailDate = document.getElementById("detailDate");
  const detailContent = document.getElementById("detailContent");

  if (!contentEl || !saveBtn) return;

  const supabase = window.supabaseClient;
  if (!supabase) {
    alert("시스템 오류: Supabase 없음");
    return;
  }

  const TABLE = "br_writings";

  saveBtn.addEventListener("click", async () => {
    const text = contentEl.value.trim();
    if (!text) {
      alert("내용을 입력해주세요.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("저장은 회원만 가능합니다.");
      return;
    }

    const { error } = await supabase.from(TABLE).insert({
      user_id: user.id,
      content: text
    });

    if (error) {
      console.error(error);
      alert("저장 중 오류 발생");
      return;
    }

    alert("저장되었습니다.");
    contentEl.value = "";
  });


  loadBtn.addEventListener("click", async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("불러오기 오류");
      return;
    }

    listEl.innerHTML = "";
    detailBox.style.display = "none";

    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "writing-item";

      const preview = item.content.length > 20
        ? item.content.slice(0, 20) + "…"
        : item.content;

      div.textContent = preview;
      div.addEventListener("click", () => showDetail(item));

      listEl.appendChild(div);
    });
  });

  function showDetail(item) {
    detailBox.style.display = "block";
    detailDate.textContent = new Date(item.created_at).toLocaleString();
    detailContent.textContent = item.content;
  }
})();
