/* ===========================
   Shared interactions
   =========================== */

// Helper: safely select
function $(sel, root=document) { return root.querySelector(sel); }
function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

/* ---------- 1) Counting Room (unchanged but a bit sturdier) ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  const pad = $('#tallypad');
  if (!pad) return; // page doesn't have tally; skip

  const lim = parseInt(pad.dataset.limit || '6', 10);
  const warn = $('#tooMany');

  function updateCountText(text) {
    pad.textContent = text || '|';
    const count = (pad.textContent.match(/\|/g) || []).length;

    if (warn) {
      if (count > lim) {
        warn.classList.add('show');
        pad.classList.add('glitch');
      } else {
        warn.classList.remove('show');
        pad.classList.remove('glitch');
      }
    }
  }

  $all('[data-tally]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      let text = (pad.textContent || '').trim();
      if (btn.dataset.tally === '+') {
        text += ' |';
      } else {
        text = text.replace(/\s?\|$/, '');
      }
      updateCountText(text);
    });
  });
});

/* ---------- 2) Whisper (robust, with clear feedback) ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  const wrap = $('#dots');
  if (!wrap) return; // not on whisper page

  // Read sequence: "2,5,1,4,3" -> [2,5,1,4,3]
  const raw = (wrap.getAttribute('data-seq') || '').trim();
  const seq = raw.split(',')
    .map(n => parseInt(n, 10))
    .filter(n => Number.isInteger(n) && n > 0);

  const dots = $all('.dot', wrap);
  const msg = $('#whisperMsg');
  const aria = $('#whisperAria');

  // Defensive checks with graceful no-op if markup is wrong
  if (!seq.length || !dots.length) {
    console.warn('[whisper] Invalid setup: data-seq or .dot buttons missing');
    return;
  }
  if (Math.max(...seq) > dots.length) {
    console.warn('[whisper] data-seq expects more dots than exist on the page');
  }

  let i = 0; // progress index into seq

  function resetFeedback() {
    i = 0;
    dots.forEach(d => d.classList.remove('active'));
  }

  function success() {
    if (msg) msg.classList.add('show');
    if (aria) aria.textContent = 'Sequence accepted.';
    // Subtle glitch effect to match the site vibe
    wrap.classList.add('glitch');
    setTimeout(()=>wrap.classList.remove('glitch'), 700);
  }

  function errorFlash() {
    wrap.classList.add('glitch');
    if (aria) aria.textContent = 'Incorrect sequence. Reset.';
    setTimeout(()=>wrap.classList.remove('glitch'), 250);
  }

  // Click handling
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', ()=>{
      const expected = seq[i];     // expected 1-based index
      const got = idx + 1;         // user clicked 1-based index
      if (got === expected) {
        dot.classList.add('active');
        i++;
        if (i === seq.length) {
          success();
        }
      } else {
        resetFeedback();
        errorFlash();
      }
    });

    // Keyboard accessibility (Enter/Space)
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });
  });
});
