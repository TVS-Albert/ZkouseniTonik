import test from 'node:test';
import assert from 'node:assert/strict';
import {wordQuestion} from '../src/exercises/vocabulary.js';
import {createSession,submitResponse} from '../src/core/session.js';
import {numbers,school,extras} from '../content.js';

test('wrong television answer explains its meaning as well as the correct computer answer',()=>{
 const deck=extras.filter(x=>['computer','television','purple','blue'].includes(x.en));
 const q=wordQuestion(deck.find(x=>x.en==='computer'),deck,'cs-en','extras');
 assert(q.options.includes('television'));
 const s=createSession('test',[q]);submitResponse(s,'television');
 assert.equal(s.feedback.correct,false);assert.equal(s.feedback.selectedTranslation,'television = televize');
 assert.equal(s.feedback.explanation,'computer = počítač');assert.equal(s.feedback.answer,'computer');
 assert.equal(submitResponse(s,'computer'),false);assert.equal(s.feedback.selectedTranslation,'television = televize');
});
test('every offered vocabulary answer has its actual translation in both directions',()=>{
 for(const deck of [numbers,school,extras])for(const dir of ['cs-en','en-cs'])for(const item of deck){
  const q=wordQuestion(item,deck,dir,'words');
  for(const answer of q.options){
   const entry=deck.find(x=>x[dir==='cs-en'?'en':'cs']===answer);
   assert.equal(q.optionTranslations[answer],`${entry.en} = ${entry.cs}`);
   const s=createSession('learn',[q]);submitResponse(s,answer);
   assert.equal(s.feedback.selectedTranslation,answer===q.answer?null:`${entry.en} = ${entry.cs}`);
  }
 }
});
test('skipped, unknown and non-vocabulary answers do not invent translations',()=>{
 const q=wordQuestion(extras[0],extras,'cs-en','extras');
 for(const answer of ['', 'toString','not an option']){
  const s=createSession('test',[q]);submitResponse(s,answer);assert.equal(s.feedback.selectedTranslation,null);
 }
 const s=createSession('test',[{answer:'is',explanation:'One item',options:['is','are']}]);
 submitResponse(s,'are');assert.equal(s.feedback.selectedTranslation,null);
});
