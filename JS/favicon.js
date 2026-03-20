(function() {
  const fav = document.getElementById("favicon");
  if (!fav) return;
  const base = fav.href.replace(/favicon-o(n|ff)\.png$/, "");
  const frames = [base + "favicon-on.png", base + "favicon-off.png"];
  let fi = 0;
  setInterval(() => { fi = (fi + 1) % 2; fav.href = frames[fi]; }, 530);
})();