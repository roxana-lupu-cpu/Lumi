/* CATALOGUL CENTRAL LUMI: universurile și utilitare comune.
   Jocurile se adaugă prin LUMI.registerGame(...) în fișiere din js/games/ */
window.LUMI = {
  universes: [
    {id:1, emoji:'🔊', title:'Descoperim sunetele și cuvintele', color:'#ffd9e0'},
    {id:2, emoji:'🔤', title:'Învățăm literele', color:'#d9ecff'},
    {id:3, emoji:'🔢', title:'Matematica prin joc', color:'#fff1c2'},
    {id:4, emoji:'🧩', title:'Atenție, memorie și gândire', color:'#e2d9ff'},
    {id:5, emoji:'😊', title:'Comunicăm și descoperim emoțiile', color:'#ffe0cc'},
    {id:6, emoji:'🌍', title:'Descoperim lumea', color:'#d6f5dc'}
  ],
  games: [],
  registerGame(g){ this.games.push(g); },
  shuffle(a){ const r=a.slice(); for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]];} return r; },
  rand(a){ return a[Math.floor(Math.random()*a.length)]; },
  /* alege varianta corectă + (n-1) variante diferite, amestecate */
  pickOptions(pool, correct, n, same){
    const wrong = this.shuffle(pool.filter(x=>!same(x,correct))).slice(0,n-1);
    return this.shuffle([correct, ...wrong]);
  },
  /* Lista cuvintelor (emoji = imagine fără drepturi de autor; înlocuibile cu imagini proprii) */
  words: [['pisică','🐱'],['câine','🐶'],['casă','🏠'],['măr','🍎'],['minge','⚽'],['soare','☀️'],['floare','🌸'],
          ['carte','📖'],['pește','🐟'],['mașină','🚗'],['copac','🌳'],['lună','🌙'],['ou','🥚'],['urs','🐻'],['albină','🐝'],['banană','🍌']]
};
