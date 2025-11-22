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
  outer: for (let y = arena.length - 1; y >= 0; --y){
    for (let x = 0; x < arena[y].length; ++x){
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    score += rowCount * 10;
    rowCount *= 2;
    dropInterval = Math.max(50, dropInterval - 0.5 * dropInterval);
    updateSpeedDisplay();
  }
}

function updateScore(){
  document.getElementById('score').innerText = score;
  updateSpeedDisplay();
}

function tetrisControl(action) {
  if (action === 'left') playerMove(-1);
  else if (action === 'right') playerMove(1);
  else if (action === 'down') playerDrop();
  else if (action === 'rotate') playerRotate();
  draw();
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

document.addEventListener('keydown', e => {
  if (!tetrisActive) return;
  if (e.key === 'ArrowLeft') playerMove(-1);
  else if (e.key === 'ArrowRight') playerMove(1);
  else if (e.key === 'ArrowDown') playerDrop();
  else if (e.code === 'Space') playerRotate();
});

draw();
