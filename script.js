// Tally logic
document.querySelectorAll('[data-tally]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const pad = document.getElementById('tallypad');
    if(!pad) return;
    const lim = parseInt(pad.dataset.limit || '6',10);
    let text = (pad.textContent || '').trim();
    if(btn.dataset.tally === '+'){
      text += ' |';
    }else{
      text = text.replace(/\s?\|$/, '');
    }
    pad.textContent = text || '|';
    const count = (text.match(/\|/g)||[]).length;
    const warn = document.getElementById('tooMany');
    if(warn){
      if(count>lim){ warn.classList.add('show'); pad.classList.add('glitch'); }
      else { warn.classList.remove('show'); pad.classList.remove('glitch'); }
    }
  });
});

// “Whisper” dots sequence
(function(){
  const wrap = document.getElementById('dots');
  if(!wrap) return;
  const seq = (wrap.dataset.seq||'').split(',').map(n=>parseInt(n,10));
  let i=0;
  wrap.querySelectorAll('.dot').forEach((d,idx)=>{
    d.addEventListener('click', ()=>{
      if(idx+1===seq[i]){ d.classList.add('active'); i++; }
      else { i=0; wrap.querySelectorAll('.dot').forEach(x=>x.classList.remove('active')); }
      if(i===seq.length){
        const msg = document.getElementById('whisperMsg');
        if(msg){ msg.classList.add('show'); }
      }
    });
  });
})();
