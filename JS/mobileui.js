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
});
