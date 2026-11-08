export const freshProgress=()=>({completed:[],goals:0,attempts:[],sound:true,learnCursor:0,rounds:0});
export function loadProgress(storage,key) {
  let value;
  try {value=JSON.parse(storage.getItem(key));} catch(error) {
    if (error instanceof SyntaxError) return freshProgress();
    throw error;
  }
  if (!value || typeof value!=='object') return freshProgress();
  return {
    completed:Array.isArray(value.completed)?[...new Set(value.completed.filter(x=>typeof x==='string'))]:[],
    goals:Number.isSafeInteger(value.goals)&&value.goals>=0?value.goals:0,
    sound:typeof value.sound==='boolean'?value.sound:true,
    learnCursor:Number.isSafeInteger(value.learnCursor)&&value.learnCursor>=0?value.learnCursor:0,
    rounds:Number.isSafeInteger(value.rounds)&&value.rounds>=0?value.rounds:0,
    attempts:Array.isArray(value.attempts)?value.attempts.filter(a=>a&&Number.isFinite(Date.parse(a.date))&&
      Number.isInteger(a.total)&&a.total>0&&Number.isInteger(a.correct)&&a.correct>=0&&a.correct<=a.total&&
      a.percent===Math.round(100*a.correct/a.total)).slice(-10):[],
  };
}
export function persistProgress(storage,key,value){storage.setItem(key,JSON.stringify(value));}
