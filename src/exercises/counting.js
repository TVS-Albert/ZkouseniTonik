import {options} from '../core/random.js';
export function createCountingExercise({textbookCounts,numbers,school}){
function countQuestion(index){
  const [word,plural,count]=textbookCounts[index%10]; const singular=school.find(s=>s.plural===plural)?.en;
  return {id:`count-${count}`,category:'numbers',type:'choice',task:'Spočítej předměty. Kolik jich je?',prompt:`How many ${plural} are there?`,scene:{type:'count',count,item:singular},answer:word,options:options(word,numbers.map(n=>n.en)),explanation:`There are ${word} ${plural}. Počet: ${count}.`};
}

return countQuestion;
}
