import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getIdFromQuery() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

async function loadWriting() {
  const id = getIdFromQuery();
  if (!id) return;

  const { data, error } = await supabase
    .from("writings")
    .select("id, title, content, type, created_at")
    .eq("id", id)
    .maybeSingle();import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 글 ID 가져오기
function getIdFromQuery() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

// 글 불러오기
async function loadWriting() {
  const id = getIdFromQuery();
  if (!id) return;

  const { data, error } = await supabase
    .from("writings")
    .select("id, title, content, type, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    document.getElementById("writing_content").textContent =
      "글을 불러올 수 없습니다.";
    return;
  }

  document.getElementById("writing_title").textContent =
    data.title ?? "(제목 없음)";

  document.getElementById("writing_meta").textContent =
    `${data.type ?? "free"} · ${new Date(
      data.created_at
    ).toLocaleString()}`;

  document.getElementById("writing_content").textContent = data.content ?? "";
}

// 퍼스나 도움 요청
async function requestPersonaHelp(personaName, requestType) {
  const user = (await supabase.auth.getUser()).data.user;
  const id = getIdFromQuery();
  if (!id) return;

  const requestText =
    prompt(`${personaName}에게 어떤 도움을 요청할까요? (선택 입력)`) || "";

  const { error } = await supabase.from("writing_assists").insert({
    writing_id: id,
    user_id: user.id,
    persona_name: personaName,
    request_type: requestType,
    request_text: requestText,
  });

  if (error) {
    console.error(error);
    alert("요청 실패");
  } else {
    alert("요청이 접수되었습니다. (루웨인이 처리 후 결과 표시)");
    loadPersonaResult();
  }
}

document.getElementById("persona_help_btn").onclick = () =>
  requestPersonaHelp("레카", "summary");

// 퍼스나 결과 불러오기
async function loadPersonaResult() {
  const id = getIdFromQuery();
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("writing_assists")
    .select("*")
    .eq("writing_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return;

  const box = document.getElementById("persona_result");

  box.innerHTML = data
    .map(
      (r) => `
    <div>
        <strong>${r.persona_name} (${r.request_type})</strong><br>
        <em>요청:</em> ${r.request_text ?? ""}<br>
        <em>응답:</em><br>
        <pre style="white-space:pre-wrap;">${
          r.response_text ?? "(아직 처리 전)"
        }</pre>
        <hr>
    </div>
  `
    )
    .join("");
}

// PDF 저장
document.getElementById("pdf_btn").onclick = async () => {
  const { jsPDF } = window.jspdf;

  const title = document.getElementById("writing_title").textContent;
  const content = document.getElementById("writing_content").textContent;

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const margin = 40;
  let y = margin;

  doc.setFontSize(16);
  doc.text(title || "제목 없음", margin, y);
  y += 30;

  doc.setFontSize(12);
  const lines = doc.splitTextToSize(content, 500);

  lines.forEach((line) => {
    if (y > 800) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 18;
  });

  doc.save((title || "writing") + ".pdf");
};

// 초기 실행
loadWriting().then(loadPersonaResult);


  if (error || !data) {
    console.error(error);
    document.getElementById("writing_content").textContent = "글을 불러올 수 없습니다.";
    return;
  }

  document.getElementById("writing_title").textContent = data.title ?? "(제목 없음)";
  document.getElementById("writing_meta").textContent =
    `${data.type ?? "free"} · ${new Date(data.created_at).toLocaleString()}`;
  document.getElementById("writing_content").textContent = data.content ?? "";
}

loadWriting();

// 퍼스나 도움 버튼은 아래 3번에서 이어서 채운다.
