/* Joc: Ascultă și alege imaginea (Universul 1) */
LUMI.registerGame({
  id:'cuvant-imagine', universe:1, title:'Ascultă și alege imaginea',
  goal:'Asociem cuvântul auzit cu imaginea.',
  instruction:'Ascultă cuvântul și alege imaginea potrivită.',
  nextItem(c){
    const W=LUMI.words, w=LUMI.rand(W);
    const opts=LUMI.pickOptions(W,w,c.n,(a,b)=>a[0]===b[0])
      .map((x,i)=>({html:x[1], label:'Imaginea '+(i+1), correct:x===w}));
    return {say:'Ascultă cuvântul: '+w[0]+'.', visual:'<p class="word">'+(c.level<3?w[0]:'🔊')+'</p>',
            opts, ok:'Ai ales imaginea potrivită!'};
  }
});
