export function shuffle(items, rng=Math.random) {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function options(answer,pool){return shuffle([answer,...shuffle([...new Set(pool)].filter(x=>x!==answer)).slice(0,3)]);}
