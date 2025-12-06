// /includes/playground.js

document.getElementById("analyzeBtn").onclick = async () => {
  const text = document.getElementById("inputText").value.trim();
  const result = document.getElementById("resultBox");

  if (!text) {
    result.innerHTML = "문장을 입력하세요.";
    return;
  }

  // 분석
  let length = text.length;
  let tones = (text.match(/[!?.]/g) || []).length;
  let rhythm = (text.match(/[,]/g) || []).length;
  let type =
    length < 20 ? "짧고 강한 파동" :
    length < 80 ? "중간 리듬형"   :
                   "장파동 흐름형";

  const html =
    `<p><b>문장 길이:</b> ${length}</p>
     <p><b>감정 기점:</b> ${tones}</p>
     <p><b>리듬 쉼표:</b> ${rhythm}</p>
     <p><b>울림 유형:</b> ${type}</p>`;

  result.innerHTML = html;

  // DB 저장
  const user = await getCurrentUser();
  const payload = {
    input_text: text,
    length,
    tones,
    rhythm,
    type,
    created_at: new Date().toISOString(),
  };
  if (user) payload.user_id = user.id;

  await supabase.from("reverberation_playground").insert(payload);
};
