import {shuffle,options} from '../core/random.js';
export function wordQuestion(item,deck,direction,category){
  const toEnglish=direction==='cs-en'; const field=toEnglish?'en':'cs';
  const choices=options(item[field],deck.map(x=>x[field]));
  const optionTranslations=Object.fromEntries(deck.filter(x=>choices.includes(x[field])).map(x=>[x[field],`${x.en} = ${x.cs}`]));
  return {id:`${item.id}-${direction}`,category,type:'choice',task:toEnglish?'Jak se řekne anglicky?':'Co to znamená česky?',prompt:item[toEnglish?'cs':'en'],answer:item[field],options:choices,optionTranslations,speak:toEnglish?null:item.en,explanation:`${item.en} = ${item.cs}`,item};
}

export function vocabularyPractice(deck,category,direction='both'){
 const dirs=direction==='both'?['cs-en','en-cs']:[direction];
 if(!dirs.every(d=>['cs-en','en-cs'].includes(d)))throw new Error('Unknown translation direction');
 return shuffle(deck.flatMap(item=>dirs.map(d=>wordQuestion(item,deck,d,category))));
}
