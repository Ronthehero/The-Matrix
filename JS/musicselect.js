let currentTrack = null;

window.addEventListener('DOMContentLoaded', function() {
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