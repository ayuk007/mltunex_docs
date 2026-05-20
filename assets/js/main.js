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
  ham.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !ham.contains(e.target))
      sidebar.classList.remove('open');
  });
}

/* Syntax highlight — works on plain text, never touches innerHTML directly */
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlight(text) {
  // Split into tokens: strings, comments, words, punctuation
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    // Single-line comment  # ...
    if (text[i] === '#') {
      let j = i;
      while (j < text.length && text[j] !== '\n') j++;
      tokens.push({ type: 'comment', val: text.slice(i, j) });
      i = j;
      continue;
    }
    // Double-quoted string
    if (text[i] === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\') j++;
        j++;
      }
      j++; // closing quote
      tokens.push({ type: 'string', val: text.slice(i, j) });
      i = j;
      continue;
    }
    // Single-quoted string
    if (text[i] === "'") {
      let j = i + 1;
      while (j < text.length && text[j] !== "'") {
        if (text[j] === '\\') j++;
        j++;
      }
      j++;
      tokens.push({ type: 'string', val: text.slice(i, j) });
      i = j;
      continue;
    }
    // Word (identifier / keyword / number)
    if (/[a-zA-Z_0-9]/.test(text[i])) {
      let j = i;
      while (j < text.length && /[a-zA-Z_0-9./\-]/.test(text[j])) j++;
      tokens.push({ type: 'word', val: text.slice(i, j) });
      i = j;
      continue;
    }
    // Everything else — whitespace, operators, punctuation
    tokens.push({ type: 'other', val: text[i] });
    i++;
  }

  const KEYWORDS = new Set([
    'from','import','class','def','return','True','False','None',
    'if','else','elif','for','in','and','or','not','with','as',
    'pass','self','async','await','try','except','raise','lambda',
    'yield','global','nonlocal','del','is','while','break','continue'
  ]);

  return tokens.map(tok => {
    const v = escHtml(tok.val);
    if (tok.type === 'comment') return `<span class="cm">${v}</span>`;
    if (tok.type === 'string')  return `<span class="st">${v}</span>`;
    if (tok.type === 'word' && KEYWORDS.has(tok.val)) return `<span class="kw">${v}</span>`;
    return v;
  }).join('');
}

document.querySelectorAll('pre code').forEach(el => {
  // Get the raw text content (browser already decoded entities)
  const raw = el.textContent;
  el.innerHTML = highlight(raw);
});