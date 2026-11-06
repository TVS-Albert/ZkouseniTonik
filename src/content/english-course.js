import {numbers,school,positions,grammar,extras,modules,decks,textbookCounts} from './english-school.js';
import {shuffle} from '../core/random.js';
import {wordQuestion,vocabularyPractice} from '../exercises/vocabulary.js';
import {createPositionExercise} from '../exercises/positions.js';
import {createGrammarExercise} from '../exercises/grammar.js';
import {createCountingExercise} from '../exercises/counting.js';
import {defineCourse,createCourseRegistry} from '../core/curriculum.js';
export const positionQuestion=createPositionExercise(positions);
export const {grammarQuestion,sentenceTranslationQuestion,questionQuestion}=createGrammarExercise(grammar);
export const countQuestion=createCountingExercise({textbookCounts,numbers,school});
function englishExam(){
  const chosenN=shuffle(numbers).slice(0,4), chosenS=shuffle(school).slice(0,5);
  const qs=[...chosenN.map((n,i)=>wordQuestion(n,numbers,i%2?'en-cs':'cs-en','numbers')),countQuestion(Math.floor(Math.random()*10)),...chosenS.map((s,i)=>wordQuestion(s,school,i%2?'cs-en':'en-cs','school')),
    ...shuffle(positions).map((p,i)=>positionQuestion(p,i%2===1)),positionQuestion(positions[Math.floor(Math.random()*4)]),
    ...shuffle([0,1,2,3]).map(i=>grammarQuestion(i)),questionQuestion(Math.random()<.5?'books':'ruler')];
  return shuffle(qs).map((q,i)=>({...q,id:`exam-${i}-${q.id}`}));
}

export const englishCourse=defineCourse({id:'english-school',title:'Anglická liga',
 topics:[...modules,{id:'extras',name:'Bonusová slovíčka'}].map(m=>({...m,deck:decks[m.id],
  kind:['numbers','school','extras'].includes(m.id)?'vocabulary':m.id,
  practice(direction){
   if(m.id==='numbers')return shuffle([...vocabularyPractice(numbers,'numbers',direction),...textbookCounts.map((_,i)=>countQuestion(i))]);
   if(m.id==='school'||m.id==='extras')return vocabularyPractice(decks[m.id],m.id,direction);
   if(m.id==='positions')return shuffle(positions.flatMap(p=>[positionQuestion(p),positionQuestion(p,true)]));
   return shuffle([...Array.from({length:4},(_,i)=>grammarQuestion(i)),...Array.from({length:4},(_,i)=>[sentenceTranslationQuestion(i),sentenceTranslationQuestion(i,false)]).flat(),questionQuestion('ruler'),questionQuestion('books')]);
  }})),exam:englishExam});

export const courses=createCourseRegistry([englishCourse]);
