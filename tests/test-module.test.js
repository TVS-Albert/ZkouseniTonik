import test from 'node:test';
import assert from 'node:assert/strict';
import {testModule,makeTest,makeLearningRound,learningCards} from '../src/content/test-2026-11-09.js';
import {validateQuestions} from '../src/core/curriculum.js';
import {createSession,submitResponse,advanceSession} from '../src/core/session.js';
import {scoreAnswers} from '../engine.js';

test('one dated module contains all 52 existing cards, including extras',()=>{
 assert.equal(testModule.date,'2026-11-09');assert.match(testModule.title,/9\. 11\. 2026/);
 assert.equal(learningCards.length,52);assert.equal(new Set(learningCards.map(c=>c.id)).size,52);
 assert.deepEqual(new Set(learningCards.map(c=>c.category)),new Set(['numbers','school','extras','positions','sentences']));
});
test('mixed tests cover all content areas and multiple interactions with valid answers',()=>{
 for(let i=0;i<100;i++){
  const qs=makeTest();assert.equal(qs.length,20);validateQuestions(qs);
  assert.equal(qs.filter(q=>q.type==='order').length,2);
  assert.equal(new Set(qs.map(q=>q.id)).size,20);
  for(const category of ['numbers','school','positions','sentences','extras'])assert(qs.some(q=>q.category===category));
  for(const form of ['is',"isn't",'are',"aren't"])assert(qs.some(q=>q.answer===form));
  for(const position of ['in','on','under','next-to'])assert(qs.some(q=>q.scene?.position===position));
  assert(qs.some(q=>q.scene?.type==='count'));assert(qs.some(q=>q.options?.length===2));
  for(const category of ['numbers','school','extras'])for(const dir of ['cs-en','en-cs'])assert(qs.some(q=>q.category===category&&q.id.endsWith(dir)));
 }
});
test('learning rounds vary, introduce the complete deck and all grammar and prepositions',()=>{
 const cards=[],forms=new Set(),positions=new Set(),counts=new Set();
 for(let round=0;round<13;round++){
  const items=makeLearningRound(round*4);assert.equal(items.length,12);
  for(const type of ['flip','match','choice','order'])assert(items.some(q=>q.type===type));
  cards.push(...items.filter(q=>q.type==='flip').map(q=>q.card.id));
  items.forEach(q=>{if(q.id?.startsWith('grammar-'))forms.add(q.answer);if(q.scene?.position)positions.add(q.scene.position);if(q.scene?.type==='count')counts.add(q.scene.count);});
 }
 assert.equal(new Set(cards).size,52);assert.equal(forms.size,4);assert.equal(positions.size,4);assert.equal(counts.size,10);
});
test('answers are evaluated immediately, locked, and advance only when requested',()=>{
 const qs=makeTest(),s=createSession('test',qs);
 assert.equal(advanceSession(s),false);
 assert.equal(submitResponse(s,'wrong'),true);assert.equal(s.feedback.correct,false);assert.equal(s.feedback.answer,qs[0].answer);assert.equal(s.index,0);
 assert.equal(submitResponse(s,qs[0].answer),false);assert.equal(s.answers[0],'wrong');
 assert.equal(advanceSession(s),true);assert.equal(s.index,1);assert.equal(s.feedback,null);
 assert.equal(submitResponse(s,qs[1].answer),true);assert.equal(s.feedback.correct,true);
 assert.equal(scoreAnswers(qs,s.answers).correct,1);
});
test('invalid ordering questions are rejected instead of silently producing false grades',()=>{
 const q=makeTest().find(q=>q.type==='order');
 assert.throws(()=>validateQuestions([{...q,tokens:['wrong','words']}]),/Invalid ordering/);
 assert.throws(()=>validateQuestions([{...q,tokens:[]}]),/Invalid ordering/);
});

test('learning arrows restore partial and completed work without unlocking answers',async()=>{
 const {previousActivity}=await import('../src/core/session.js');
 const items=makeLearningRound(0),s=createSession('learn',items);
 assert.equal(previousActivity(s),false);s.revealed=true;assert.equal(advanceSession(s),true);
 s.matched.push(items[1].pairs[0].id);s.left=items[1].pairs[1].id;
 assert.equal(previousActivity(s),true);assert.equal(s.index,0);assert.equal(s.revealed,true);
 assert.equal(advanceSession(s),true);assert.equal(s.matched.length,1);assert.equal(s.left,items[1].pairs[1].id);
 s.feedback={correct:true,answer:'pairs',explanation:'done'};advanceSession(s);
 submitResponse(s,items[2].answer);advanceSession(s);previousActivity(s);
 assert.equal(s.feedback.correct,true);assert.equal(submitResponse(s,'wrong'),false);
 assert.equal(s.answers[2],items[2].answer);
 const exam=createSession('test',makeTest());submitResponse(exam,'wrong');advanceSession(exam);assert.equal(previousActivity(exam),false);
});
