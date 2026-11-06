import test from 'node:test';
import assert from 'node:assert/strict';
import {numbers,school,extras,positions,textbookCounts} from '../content.js';
import {shuffle,makePractice,makeExam,scoreAnswers,makePairs,grammarQuestion,countQuestion} from '../engine.js';

test('numbers 11–20 and textbook number/noun pairs are complete and accurate',()=>{
  assert.deepEqual(numbers.map(n=>n.number),[11,12,13,14,15,16,17,18,19,20]);
  assert.deepEqual(numbers.map(n=>n.en),['eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty']);
  textbookCounts.forEach(([word,plural,n],i)=>{
    assert.equal(word,numbers[i].en); assert.equal(n,i+11);
    const q=countQuestion(i);assert.equal(q.answer,word);assert.equal(q.scene.count,n);
    assert.equal(school.find(s=>s.en===q.scene.item).plural,plural);
  });
});
test('translation practice covers every core word in both directions',()=>{
  for(const [id,deck] of [['numbers',numbers],['school',school]]){
    const qs=makePractice(id);
    for(const item of deck){
      assert(qs.some(q=>q.id===`${item.id}-cs-en`&&q.prompt===item.cs&&q.answer===item.en));
      assert(qs.some(q=>q.id===`${item.id}-en-cs`&&q.prompt===item.en&&q.answer===item.cs));
    }
    assert(makePractice(id,'cs-en').filter(q=>!q.scene).every(q=>q.id.endsWith('cs-en')));
    assert(makePractice(id,'en-cs').filter(q=>!q.scene).every(q=>q.id.endsWith('en-cs')));
  }
});
test('exam has 20 questions, 5 per area, all 4 prepositions and grammar forms',()=>{
  for(let run=0;run<150;run++){
    const qs=makeExam();assert.equal(qs.length,20);assert.equal(new Set(qs.map(q=>q.id)).size,20);
    for(const cat of ['numbers','school','positions','sentences'])assert.equal(qs.filter(q=>q.category===cat).length,5);
    for(const p of positions)assert(qs.some(q=>q.scene?.position===p.id));
    for(const answer of ['is',"isn't",'are',"aren't"])assert(qs.some(q=>q.category==='sentences'&&q.answer===answer));
    for(const cat of ['numbers','school'])for(const d of ['cs-en','en-cs'])assert(qs.some(q=>q.category===cat&&q.id.endsWith(d)));
    for(const q of qs){assert.equal(q.options.filter(o=>o===q.answer).length,1);assert.equal(new Set(q.options).size,q.options.length);assert(!q.item||!extras.includes(q.item));}
  }
});
test('every practice question has an unambiguous answer and explanation',()=>{
  for(const cat of ['numbers','school','positions','sentences'])for(const q of makePractice(cat)){
    assert(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);assert(q.explanation);assert(q.prompt);
  }
});
test('sentence practice translates all four grammar forms in both directions',()=>{
  const questions=makePractice('sentences');
  for(const form of ['is','isnt','are','arent'])for(const dir of ['cs-en','en-cs'])assert(questions.some(q=>q.id===`sentence-${form}-${dir}`));
});
test('negative singular and plural use the right construction for the empty scene',()=>{
  const singular=grammarQuestion(1),plural=grammarQuestion(3);
  assert.equal(singular.answer,"isn't");assert.match(singular.prompt,/a pencil/);
  assert.equal(plural.answer,"aren't");assert.match(plural.prompt,/any pencils/);
  assert.equal(singular.scene.kind,'negative-one');assert.equal(plural.scene.kind,'negative-many');
});
test('score handles wrong, skipped and incomplete answers without rewarding them',()=>{
  const qs=makeExam();
  assert.equal(scoreAnswers(qs,qs.map(q=>q.answer)).percent,100);
  assert.equal(scoreAnswers(qs,[]).correct,0);
  const answers=qs.map((q,i)=>i%2===0?q.answer:'');
  const result=scoreAnswers(qs,answers);assert.equal(result.correct,10);assert.equal(result.percent,50);
  assert.equal(Object.values(result.categories).reduce((sum,c)=>sum+c.correct,0),10);
  assert.equal(scoreAnswers([],[]).percent,0);
});
test('matching cards have one unique partner, shuffle does not mutate the source',()=>{
  for(const deck of [school,numbers,extras]){
    const before=JSON.stringify(deck),pairs=makePairs(deck);
    assert.equal(pairs.length,4);for(const key of ['id','cs','en'])assert.equal(new Set(pairs.map(p=>p[key])).size,4);
    assert.equal(JSON.stringify(deck),before);
  }
  const input=[1,2,3,4];assert.deepEqual(shuffle(input,()=>0),[2,3,4,1]);assert.deepEqual(input,[1,2,3,4]);
});
