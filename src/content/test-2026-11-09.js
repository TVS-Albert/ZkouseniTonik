import {numbers,school,extras,positions,grammar} from './english-school.js';
import {shuffle} from '../core/random.js';
import {wordQuestion} from '../exercises/vocabulary.js';
import {makePairs} from '../exercises/matching.js';
import {orderingQuestion} from '../exercises/ordering.js';
import {positionQuestion,grammarQuestion,countQuestion,questionQuestion} from './english-course.js';

export const testModule=Object.freeze({id:'english-2026-11-09',subject:'Angličtina',date:'2026-11-09',dateLabel:'9. 11. 2026',title:'Angličtina – příprava na test 9. 11. 2026'});
export const categoryNames={numbers:'Čísla 11–20',school:'Ve škole',positions:'Předložky',sentences:'Věty a otázky',extras:'Barvy a další slovíčka'};
export const vocabulary=[...numbers,...school,...extras];
const banks=[numbers,school,extras,positions,grammar];
export const learningCards=Array.from({length:Math.max(...banks.map(b=>b.length))},(_,i)=>banks.flatMap((b,j)=>b[i]?[{...b[i],category:['numbers','school','extras','positions','sentences'][j]}]:[])).flat();
export function sentenceOrder(index=0){
  const g=grammar[index%4];
  return orderingQuestion({id:`order-${g.id}`,category:'sentences',prompt:g.translation,answer:g.sentence,explanation:`${g.sentence} ${g.translation} ${g.note}`});
}
export function numberOrder(index=0){
  const items=numbers.slice(index%7,index%7+4);
  return orderingQuestion({id:`number-order-${index%7}`,category:'numbers',prompt:'Seřaď čísla od nejmenšího.',answer:items.map(n=>n.en).join(' '),explanation:items.map(n=>`${n.number} = ${n.en}`).join(', ')});
}
export function trueFalse(){
  const [item,other]=shuffle(school);const truth=Math.random()<.5;
  return {id:`truth-${item.id}`,category:'school',type:'choice',task:'Souhlasí tento překlad?',prompt:`${item.en} = ${truth?item.cs:other.cs}`,answer:truth?'Ano, souhlasí.':'Ne, nesouhlasí.',options:['Ano, souhlasí.','Ne, nesouhlasí.'],explanation:`${item.en} znamená ${item.cs}. ${truth?'Překlad je správně.':`${other.en} znamená ${other.cs}.`}`};
}
export function makeTest(){
  const n=shuffle(numbers),s=shuffle(school),e=shuffle(extras);
  const questions=[wordQuestion(n[0],numbers,'cs-en','numbers'),wordQuestion(n[1],numbers,'en-cs','numbers'),countQuestion(Math.floor(Math.random()*10)),
    wordQuestion(s[0],school,'cs-en','school'),wordQuestion(s[1],school,'en-cs','school'),trueFalse(),
    ...positions.map((p,i)=>positionQuestion(p,i%2===1)),...Array.from({length:4},(_,i)=>grammarQuestion(i)),questionQuestion(Math.random()<.5?'ruler':'books'),
    ...e.slice(0,3).map((x,i)=>wordQuestion(x,extras,i%2?'cs-en':'en-cs','extras')),sentenceOrder(Math.floor(Math.random()*4)),numberOrder(Math.floor(Math.random()*7))];
  return shuffle(questions).map((q,i)=>({...q,id:`${testModule.id}-${i}-${q.id}`}));
}
export function makeLearningRound(cursor=0){
  const round=Math.floor(cursor/4);
  const flips=Array.from({length:4},(_,i)=>({type:'flip',card:learningCards[(cursor+i)%learningCards.length]}));
  const pairs=()=>({type:'match',pairs:makePairs(vocabulary)});
  return [flips[0],pairs(),countQuestion(round%10),sentenceOrder(round%4),flips[1],positionQuestion(positions[round%4]),
    flips[2],pairs(),grammarQuestion(round%4),numberOrder(round%7),flips[3],wordQuestion(extras[cursor%extras.length],extras,round%2?'en-cs':'cs-en','extras')];
}
