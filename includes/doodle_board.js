// doodle_board.js
// 비회원용 간단한 낙서 도구 (저장 없이 PNG 다운로드만 제공)

(function () {
  const canvas = document.getElementById("drawCanvas");
  const clearBtn = document.getElementById("clearBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // 캔버스 크기 조정
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#222";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let drawing = false;
  let lastX = 0, lastY = 0;

  function startDraw(x, y) {
    drawing = true;
    lastX = x;
    lastY = y;
  }

  function draw(x, y) {
    if (!drawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function endDraw() {
    drawing = false;
  }

  // 마우스
  canvas.addEventListener("mousedown", (e) => {
    startDraw(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", (e) => {
    draw(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  // 터치
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDraw(t.clientX - rect.left, t.clientY - rect.top);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(t.clientX - rect.left, t.clientY - rect.top);
  });

  canvas.addEventListener("touchend", endDraw);

  // 지우기
  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // 다운로드
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "doodle.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
