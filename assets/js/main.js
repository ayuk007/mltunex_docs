/* ── Shared JS ── */

/* Mark active nav link */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page) a.classList.add('active');
  });
})();

/* Mobile hamburger */
const ham = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
if (ham && sidebar) {
  ham.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !ham.contains(e.target))
      sidebar.classList.remove('open');
  });
}

/* Minimal syntax highlight */
document.querySelectorAll('pre code').forEach(el => {
  let h = el.innerHTML;
  h = h.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  // strings
  h = h.replace(/(&#34;|&quot;|")(.*?)\1/g, (m, q, s) => `<span class="st">${q}${s}${q}</span>`);
  h = h.replace(/'([^']*)'/g, `<span class="st">'$1'</span>`);
  // keywords
  ['from','import','class','def','return','True','False','None','if','else','for','in','and','or','not','with','as','pass','self','async','await'].forEach(k => {
    h = h.replace(new RegExp(`\\b(${k})\\b`, 'g'), `<span class="kw">$1</span>`);
  });
  // comments
  h = h.replace(/(#[^\n]*)/g, `<span class="cm">$1</span>`);
  // bash $ lines
  h = h.replace(/^(\$\s.*)/gm, `<span class="cm">$1</span>`);
  el.innerHTML = h;
});
