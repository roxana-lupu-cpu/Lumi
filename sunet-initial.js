/* Joc: Cu ce sunet începe? (Universul 1) */
LUMI.registerGame({
  id:'sunet-initial', universe:1, title:'Cu ce sunet începe?',
  goal:'Identificăm sunetul inițial al cuvântului.',
  instruction:'Privește imaginea și alege litera cu care începe cuvântul.',
  nextItem(c){
    const W=LUMI.words, w=LUMI.rand(W), L=x=>x[0][0].toUpperCase();
    const letters=[...new Set(W.map(L))];
    const opts=LUMI.pickOptions(letters,L(w),c.n,(a,b)=>a===b)
      .map(l=>({html:l, label:'Litera '+l, correct:l===L(w)}));
    return {say:'Cu ce sunet începe cuvântul '+w[0]+'?', visual:'<span style="font-size:4.5rem" aria-hidden="true">'+w[1]+'</span>'+(c.level<3?'<p class="word">'+w[0]+'</p>':''),
            opts, ok:'Bravo! Ai identificat sunetul!'};
  }
});
