// Matrix rain
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cols = Math.floor(canvas.width / 16);
const drops = Array(cols).fill(1);
function drawRain() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff41';
  ctx.font = '14px Share Tech Mono';
  for (let i = 0; i < drops.length; i++) {
    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
    ctx.fillText(char, i * 16, drops[i] * 16);
    if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(drawRain, 40);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Tooltip
const tooltip = document.getElementById('tooltip');
document.querySelectorAll('.branch-node').forEach(node => {
  node.addEventListener('mouseenter', e => {
    tooltip.textContent = node.dataset.tip;
    tooltip.style.display = 'block';
  });
  node.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top = (e.clientY - 28) + 'px';
  });
  node.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});