import {shuffle} from '../core/random.js';
export function createGrammarExercise(grammar){
function grammarQuestion(index){
  const g=grammar[index%4]; const forms=['is',"isn't",'are',"aren't"];
  const prompts=['There ___ a book on the desk.','There ___ a pencil in the bag.','There ___ three books on the desk.','There ___ any pencils in the bag.'];
  return {id:`grammar-${g.id}`,category:'sentences',type:'choice',task:'Prohlédni si obrázek a doplň větu.',prompt:prompts[index%4],scene:{type:'grammar',kind:g.kind},answer:g.form,options:shuffle(forms),explanation:`${g.sentence} ${g.translation} ${g.note}`};
}
function sentenceTranslationQuestion(index,toEnglish=true){
  const g=grammar[index%4];const field=toEnglish?'sentence':'translation';
  return {id:`sentence-${g.id}-${toEnglish?'cs-en':'en-cs'}`,category:'sentences',type:'choice',task:toEnglish?'Která anglická věta odpovídá?':'Co znamená tato věta česky?',prompt:g[toEnglish?'translation':'sentence'],answer:g[field],options:shuffle(grammar.slice(0,4).map(x=>x[field])),explanation:`${g.sentence} ${g.translation}`,speak:toEnglish?null:g.sentence};
}
function questionQuestion(kind){
  if(kind==='ruler') return {id:'question-ruler',category:'sentences',type:'choice',task:'Podívej se do tašky a odpověz.',prompt:'Is there a ruler in the bag?',scene:{type:'ruler'},answer:'Yes, there is.',options:['Yes, there is.','No, there isn’t.'],explanation:'Yes, there is. V tašce je pravítko. Na Is there…? odpovídáme there is / there isn’t.'};
  return {id:'question-books',category:'sentences',type:'choice',task:'Souhlasí počet na obrázku?',prompt:'There are three books on the desk.',scene:{type:'two-books'},answer:'No, there aren’t. There are two books.',options:['Yes, there are.','No, there aren’t. There are two books.'],explanation:'Na obrázku jsou dvě knihy, ne tři. No, there aren’t. There are two books.'};
}

return {grammarQuestion,sentenceTranslationQuestion,questionQuestion};
}
