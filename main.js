window.addEventListener('DOMContentLoaded', function() {
  const controls = document.getElementById('tetris-onscreen-controls');
  const enableBtn = document.getElementById('enable-onscreen-btn');
  const disableBtn = document.getElementById('disable-onscreen-btn');
  controls.classList.remove('show');
  disableBtn.style.display = 'none';
  enableBtn.style.display = 'inline-block';
  enableBtn.onclick = function() {
    controls.classList.add('show');
    enableBtn.style.display = 'none';
    disableBtn.style.display = 'inline-block';
  };
  disableBtn.onclick = function() {
    controls.classList.remove('show');
    disableBtn.style.display = 'none';
    enableBtn.style.display = 'inline-block';
  };
  resizeMusicSelect();
  document.getElementById("music-select").addEventListener("change", function() {
    resizeMusicSelect();
    var music = document.getElementById("bg-music");
    if (!music.paused) {
      music.src = this.value;
      music.play();
    }
  });
});

function resizeMusicSelect() {
  var select = document.getElementById("music-select");
  var mirror = document.getElementById("music-width-mirror");
  var selectedText = select.options[select.selectedIndex].text;
  mirror.textContent = selectedText;
  select.style.width = "auto";
  select.style.width = (mirror.offsetWidth + 72) + "px";
}

let currentTrack = null;

function playMusic() {
  var music = document.getElementById("bg-music");
  var select = document.getElementById("music-select");
  if (currentTrack !== select.value) {
    music.src = select.value;
    music.currentTime = 0;
    currentTrack = select.value;
  }
  music.play();
  document.getElementById("play-music-btn").style.display = "none";
  document.getElementById("pause-music-btn").style.display = "block";
}

function pauseMusic() {
  var music = document.getElementById("bg-music");
  music.pause();
  document.getElementById("pause-music-btn").style.display = "none";
  document.getElementById("play-music-btn").style.display = "block";
}

const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
ctx.scale(20, 20);

function createBlockTexture(baseColor, lineColor) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 20;
  textureCanvas.height = 20;
  const txCtx = textureCanvas.getContext('2d');
  txCtx.fillStyle = baseColor;
  txCtx.fillRect(0, 0, 20, 20);
  txCtx.strokeStyle = lineColor;
  txCtx.lineWidth = 2;
  txCtx.beginPath();
  txCtx.moveTo(10, 0);
  txCtx.lineTo(10, 20);
  txCtx.moveTo(0, 10);
  txCtx.lineTo(20, 10);
  txCtx.stroke();
  return ctx.createPattern(textureCanvas, 'repeat');
}

const patterns = [
  null,
  createBlockTexture('#1aff00', '#0d650d'),
  createBlockTexture('#ff0000', '#840000'),
  createBlockTexture('#00ffff', '#006666'),
  createBlockTexture('#ffff00', '#999900'),
  createBlockTexture('#ff00ff', '#660066'),
  createBlockTexture('#0000ff', '#000066'),
  createBlockTexture('#ffa500', '#663d00')
];

let score = 0;
let dropInterval = 600;
let arena = createMatrix(12, 20);
let player = { pos: {x: 0, y: 0}, matrix: null, score: 0 };
let dropCounter = 0;
let lastTime = 0;
let tetrisStarted = false;
let tetrisActive = false;

function updateSpeedDisplay() {
  document.getElementById('tetris-speed').innerText = dropInterval;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

function createPiece(type){
  if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
  if (type === 'O') return [[2,2],[2,2]];
  if (type === 'L') return [[0,3,0],[0,3,0],[0,3,3]];
  if (type === 'J') return [[0,4,0],[0,4,0],[4,4,0]];
  if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
  if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
  if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

function collide(arena, player){
  const m = player.matrix;
  const o = player.pos;
  for (let y=0; y < m.length; ++y){
    for (let x=0; x < m[y].length; ++x){
      if (m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0)
        return true;
    }
  }
  return false;
}

function merge(arena, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) arena[y+player.pos.y][x+player.pos.x] = value;
    });
  });
}

function drawMatrix(matrix, offset){
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0){
        ctx.fillStyle = patterns[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.05;
        ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw(){
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawMatrix(arena, {x:0, y:0});
  drawMatrix(player.matrix, player.pos);
}

function playerDrop(){
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerReset(){
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random()*pieces.length)]);
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)){
    arena = createMatrix(12, 20);
    score = 0;
    dropInterval = 600;
    updateScore();
    updateSpeedDisplay();
  }
}

function arenaSweep(){
  let rowCount = 1;
  let anyRowCleared = false;
  outer: for (let y = arena.length - 1; y >= 0; --y){
    for (let x = 0; x < arena[y].length; ++x){
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    score += rowCount * 10;
    rowCount *= 2;
    anyRowCleared = true;
  }
  if (anyRowCleared) {
    dropInterval = Math.max(50, dropInterval - 0.01 * dropInterval);
    updateSpeedDisplay();
  }
}

function playerMove(dir){
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
}

function playerRotate(){
  const m = player.matrix;
  for (let y = 0; y < m.length; ++y)
    for (let x = 0; x < y; ++x)
      [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
  m.forEach(row => row.reverse());
  if (collide(arena, player)){
    m.forEach(row => row.reverse());
    for (let y = 0; y < m.length; ++y)
      for (let x = 0; x < y; ++x)
        [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
  }
}

function update(time = 0){
  if (!tetrisActive) return;
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
  if (!tetrisActive) return;
  if (e.key === 'ArrowLeft') playerMove(-1);
  else if (e.key === 'ArrowRight') playerMove(1);
  else if (e.key === 'ArrowDown') playerDrop();
  else if (e.code === 'Space') playerRotate();
});

function updateScore(){
  document.getElementById('score').innerText = score;
  updateSpeedDisplay();
}

function tetrisControl(action) {
  if (!tetrisActive) return;
  if (action === 'left') playerMove(-1);
  else if (action === 'right') playerMove(1);
  else if (action === 'down') playerDrop();
  else if (action === 'rotate') playerRotate();
  draw();
}

function stopTetris() {
  tetrisStarted = false;
  tetrisActive = false;
  score = 0;
  dropInterval = 600;
  arena = createMatrix(12, 20);
  player = { pos: {x: 0, y: 0}, matrix: null, score: 0 };
  updateScore();
  updateSpeedDisplay();
  draw();
}

function startTetris() {
  if (!tetrisStarted) {
    tetrisStarted = true;
    tetrisActive = true;
    playerReset();
    updateScore();
    update();
  }
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === "#Tetris") {
    startTetris();
  } else {
    stopTetris();
  }
});

draw();
