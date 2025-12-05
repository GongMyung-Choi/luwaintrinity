document.getElementById("askBtn").onclick = () => {
  const text = document.getElementById("aiInput").value.trim();
  const box = document.getElementById("aiResponse");

  if (!text) {
    box.innerHTML = "먼저 너의 상태를 적어줘.";
    return;
  }

  // 울림 패턴 해석 규칙
  let emotional = text.length > 80 ? "깊은 울림" :
                  text.length > 30 ? "중간 감응" : "짧은 파동";

  let guide = "";

  if (emotional === "깊은 울림") guide = "호흡을 복부 아래까지 내리고 천천히 리듬을 정리해봐.";
  if (emotional === "중간 감응") guide = "지금의 흐름 좋다. 한 번 더 글을 이어가며 울림을 확장해봐.";
  if (emotional === "짧은 파동") guide = "가벼운 느낌이네. 짧은 호흡-긴 호흡 패턴 한번 해보자.";

  box.innerHTML = `
    <p><b>울림 감지:</b> ${emotional}</p>
    <p><b>가이드:</b> ${guide}</p>
  `;
};
