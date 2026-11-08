/* MOTORUL LUMI: meniu, setări, voce, feedback, indicii, adaptare */
(function(){
const $=s=>document.querySelector(s), main=$('#main');
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let S=Object.assign({font:'1',level:'1',opts:'auto',range:'10',anim:!reduce,sound:true,rewards:true,adapt:true}, load());
function load(){try{return JSON.parse(localStorage.getItem('lumi'))||{}}catch(e){return {}}}
function save(){try{localStorage.setItem('lumi',JSON.stringify(S))}catch(e){}}
function speak(t){
  if(!S.sound||!('speechSynthesis' in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ro-RO';u.rate=.85;speechSynthesis.speak(u)}catch(e){}
}
/* ---- setări ---- */
function applySettings(){document.documentElement.style.fontSize=(18*S.font)+'px';document.body.classList.toggle('noanim',!S.anim)}
['font','level','opts','range'].forEach(k=>{const el=$('#'+k);el.value=S[k];el.onchange=()=>{S[k]=el.value;save();applySettings()}});
['anim','sound','rewards','adapt'].forEach(k=>{const el=$('#'+k);el.checked=!!S[k];el.onchange=()=>{S[k]=el.checked;save();applySettings();if(!S.sound&&'speechSynthesis' in window)speechSynthesis.cancel()}});
$('#bSet').onclick=()=>{const h=$('#settings').hidden;$('#settings').hidden=!h;$('#bSet').setAttribute('aria-expanded',String(h))};
$('#bHome').onclick=showMenu;
/* ---- ecrane ---- */
function focusTitle(){const h=main.querySelector('h2');if(h){h.tabIndex=-1;h.focus()}}
function showMenu(){
  if('speechSynthesis' in window)speechSynthesis.cancel();
  main.innerHTML='<div class="lumi"><span class="e" aria-hidden="true">🦉</span><div><h2>Bună! Eu sunt Lumi.</h2><p>Alege un univers și învățăm împreună prin joc.</p></div></div><ul class="grid">'+
   LUMI.universes.map(u=>'<li><button class="uni" style="--c:'+u.color+'" data-u="'+u.id+'"><span class="e" aria-hidden="true">'+u.emoji+'</span><span>'+u.title+'</span></button></li>').join('')+'</ul>';
  main.querySelectorAll('.uni').forEach(b=>b.onclick=()=>showUniverse(+b.dataset.u));
  focusTitle();
}
function showUniverse(id){
  const u=LUMI.universes.find(x=>x.id===id), gs=LUMI.games.filter(g=>g.universe===id);
  main.innerHTML='<div class="bar"><button id="bBack">🏠 Meniu</button></div><h2>'+u.emoji+' '+u.title+'</h2>'+
   (gs.length?'<ul class="grid">'+gs.map(g=>'<li><button class="uni" style="--c:'+u.color+'" data-g="'+g.id+'"><span class="e" aria-hidden="true">▶️</span><span>'+g.title+'<br><small>'+g.goal+'</small></span></button></li>').join('')+'</ul>'
   :'<p class="lumi">Jocurile din acest univers sunt în pregătire. Revino curând!</p>');
  $('#bBack').onclick=showMenu;
  main.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>startGame(LUMI.games.find(g=>g.id===b.dataset.g)));
  focusTitle();
}
/* ---- sesiune de joc ---- */
function startGame(g){
  let item,tries,hint,done,msg='',stars=0,streak=0,fails=0,demo=true;
  const level=()=>+S.level, n=()=>S.opts==='auto'?(level()===1?2:level()===2?3:4):+S.opts;
  function next(first){
    item=g.nextItem({level:level(),n:n(),range:+S.range});
    tries=0;hint=0;done=false;msg=demo?'Model: Lumi îți arată răspunsul corect.':'';
    draw(first);
    say(true);
  }
  function say(withInstr){speak((withInstr?g.instruction+' ':'')+item.say)}
  function draw(first){
    const o=item.opts.map((x,i)=>'<button class="opt'+((demo||x.hl)&&x.correct?' hl':'')+(done&&x.correct?' ok':'')+(x.off?' off':'')+'" data-i="'+i+'" aria-label="'+x.label+'"'+((demo||x.off||done)?' disabled':'')+'>'+x.html+'</button>').join('');
    let ctl=demo?'<button class="primary" id="bGo">▶️ Începem</button>':done?'<button class="primary" id="bNext">➡️ Următorul</button>':
      (level()<3||tries>0)?'<button id="bHint">💡 Indiciu</button>':'';
    main.innerHTML='<div class="bar"><button id="bMenu">🏠 Meniu</button><button id="bRep">🔊 Ascultă din nou</button>'+(S.rewards?'<span class="stars" role="img" aria-label="Stele: '+stars+'">⭐ '+stars+'</span>':'')+'</div>'+
     '<h2>'+g.title+'</h2><p class="goal">'+g.goal+'</p><p class="instr">'+g.instruction+'</p><div class="visual">'+item.visual+'</div>'+
     '<div class="opts" role="group" aria-label="Variante de răspuns">'+o+'</div><p class="msg" role="status" aria-live="polite">'+msg+'</p><div class="bar2">'+ctl+'</div>';
    $('#bMenu').onclick=()=>showUniverse(g.universe);
    $('#bRep').onclick=()=>say(true);
    main.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(+b.dataset.i));
    const go=$('#bGo');if(go)go.onclick=()=>{demo=false;next()};
    const nx=$('#bNext');if(nx)nx.onclick=()=>next();
    const hb=$('#bHint');if(hb)hb.onclick=giveHint;
    if(first)focusTitle();
  }
  function giveHint(){
    hint++;
    if(hint===1){msg='Ascultă din nou.';draw();say(true);return}
    if(hint===2&&item.opts.length>2){let k=0;item.opts.forEach(x=>{if(!x.correct&&k<item.opts.length-2){x.off=true;k++}});msg='Am ascuns unele variante.'}
    else{hint=3;msg='Privește indiciul.';item.opts.forEach(x=>{x.hl=x.correct})}
    draw();
  }
  function pick(i){
    const x=item.opts[i];
    if(x.correct){
      done=true;
      if(tries===0){stars++;streak++;fails=0}else{streak=0;fails++}
      if(S.adapt){if(streak>=3&&level()<3){S.level=String(level()+1);streak=0}else if(fails>=2&&level()>1){S.level=String(level()-1);fails=0}save();$('#level').value=S.level}
      msg=item.ok||'Bravo!';draw();speak(msg);
    }else{
      tries++;x.off=true;msg='Mai încercăm o dată.';
      if(tries>=2&&hint<3){hint=2;giveHint();speak(msg);return}
      draw();speak(msg);
    }
  }
  next(true);
}
applySettings();
showMenu();
})();
