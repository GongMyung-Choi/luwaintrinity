document.getElementById("analyzeBtn").onclick = () => {
  const text = document.getElementById("inputText").value.trim();
  const result = document.getElementById("resultBox");

  if (!text) {
    result.innerHTML = "문장을 입력하세요.";
    return;
  }

  // 울림 분석 — 단순 버전 (나중에 네가 원하는 방식으로 확장가능)
  let length = text.length;
  let tones = (text.match(/[!?.]/g) || []).length;
  let rhythm = (text.match(/[,]/g) || []).length;

  result.innerHTML =
    `<p><b>문장 길이:</b> ${length}</p>
     <p><b>감정 기점(tonal markers):</b> ${tones}</p>
     <p><b>리듬 쉼표(rhythm markers):</b> ${rhythm}</p>
     <p><b>울림 유형:</b> ${length < 20 ? "짧고 강한 파동" :
                           length < 80 ? "중간 리듬형" :
                                         "장파동 흐름형"}</p>`;
};
