  const _fav = document.getElementById("favicon");
  const _frames = ["../favicons/favicon-on.png", "../favicons/favicon-off.png"];
  let _fi = 0;
  setInterval(() => { _fi = (_fi + 1) % 2; _fav.href = _frames[_fi]; }, 530);