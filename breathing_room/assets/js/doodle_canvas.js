const canvas = document.getElementById("doodle_canvas");
const ctx = canvas.getContext("2d");

let drawing = false;

canvas.onmousedown = () => (drawing = true);
canvas.onmouseup = () => (drawing = false);
canvas.onmouseleave = () => (drawing = false);
canvas.onmousemove = draw;

function draw(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}
