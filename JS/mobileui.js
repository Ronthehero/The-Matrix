function toggleNav() {
  document.getElementById('nav-menu').classList.toggle('open');
  document.getElementById('nav-toggle').classList.toggle('open');
}
document.addEventListener('DOMContentLoaded', function() {
  // Close nav on link click
  document.querySelectorAll('#nav-menu a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('nav-menu').classList.remove('open');
      document.getElementById('nav-toggle').classList.remove('open');
    });
  });

  // Custom scrollbar overlay for Chrome Android
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    document.querySelectorAll('section div').forEach(div => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;width:100%;max-height:65vh;';
      div.parentNode.insertBefore(wrap, div);
      wrap.appendChild(div);
      div.style.maxHeight = '65vh';

      const track = document.createElement('div');
      track.style.cssText = `
        position:absolute;right:2px;top:4px;bottom:4px;
        width:5px;background:rgba(10,10,10,0.85);
        border-radius:5px;z-index:99;pointer-events:none;
        opacity:0;transition:opacity 0.3s;
      `;
      const thumb = document.createElement('div');
      thumb.style.cssText = `
        position:absolute;right:0;width:5px;
        background:linear-gradient(135deg,#1aff00,#00ff88);
        border-radius:5px;min-height:30px;
        box-shadow:0 0 6px rgba(26,255,0,0.7);
      `;
      track.appendChild(thumb);
      wrap.appendChild(track);

      let hideTimer;
      function updateThumb() {
        const ratio = div.clientHeight / div.scrollHeight;
        if (ratio >= 1) { track.style.opacity = '0'; return; }
        const thumbH = Math.max(30, ratio * div.clientHeight);
        const thumbTop = (div.scrollTop / (div.scrollHeight - div.clientHeight)) * (div.clientHeight - thumbH);
        thumb.style.height = thumbH + 'px';
        thumb.style.top = thumbTop + 'px';
        track.style.opacity = '1';
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => track.style.opacity = '0', 1200);
      }

      div.addEventListener('scroll', updateThumb);
      div.addEventListener('touchstart', updateThumb);
      updateThumb();
    });
  }
});