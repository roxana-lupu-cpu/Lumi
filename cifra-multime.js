/* Joc: Câte sunt? Asociem cifra cu mulțimea (Universul 3) */
LUMI.registerGame({
  id:'cifra-multime', universe:3, title:'Câte sunt?',
  goal:'Asociem cifra cu cantitatea.',
  instruction:'Numără obiectele și alege cifra potrivită.',
  nextItem(c){
    const max=c.level===1?Math.min(c.range,5):c.level===2?Math.min(c.range,10):c.range;
    const n=Math.floor(Math.random()*(max+1));
    const pool=[]; for(let i=0;i<=max;i++) pool.push(i);
    const e=LUMI.rand(['🍎','⭐','🐟','🌸','🎈','🐞']);
    const opts=LUMI.pickOptions(pool,n,Math.min(c.n,pool.length),(a,b)=>a===b)
      .map(x=>({html:String(x), label:'Cifra '+x, correct:x===n}));
    return {say:'Numără obiectele. Câte sunt?',
      visual:n===0?'<p class="word">Niciun obiect</p>':'<span role="img" aria-label="'+n+' obiecte">'+(e+' ').repeat(n).trim().split(' ').map(s=>'<span aria-hidden="true">'+s+'</span>').join('')+'</span>',
      opts, ok:'Ai ales cifra potrivită!'};
  }
});
