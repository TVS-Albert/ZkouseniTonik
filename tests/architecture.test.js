import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCourse,createCourseRegistry,validateQuestions} from '../src/core/curriculum.js';
import {vocabularyPractice} from '../src/exercises/vocabulary.js';
import {makePairs} from '../src/exercises/matching.js';
import {loadProgress,persistProgress} from '../src/core/progress.js';
import {makePractice,makeExam} from '../engine.js';
const deck=[{id:'sum4',cs:'2 + 2',en:'4'},{id:'sum6',cs:'3 + 3',en:'6'},{id:'sum8',cs:'4 + 4',en:'8'},{id:'sum10',cs:'5 + 5',en:'10'}];
const questions=dir=>vocabularyPractice(deck,'addition',dir).map(q=>({...q,task:'Vyber výsledek nebo odpovídající příklad.'}));
const math=()=>defineCourse({id:'math',title:'Matematika',topics:[{id:'addition',deck,practice:questions}],exam:()=>questions('cs-en')});
test('a different subject reuses the exercise and exam engine with new content',()=>{
 const registry=createCourseRegistry([math()]);const course=registry.get('math');
 assert.equal(makePractice('addition','both',course).length,8);
 assert.equal(makeExam(course).length,4);assert.equal(makePairs(course.topic('addition').deck).length,4);
 assert.equal(registry.list().length,1);
 assert.throws(()=>registry.register(math()),/Duplicate/);assert.throws(()=>registry.get('unknown'),/Unknown/);
});
test('bad courses, topics, directions and ambiguous answers are rejected',()=>{
 assert.throws(()=>defineCourse({}),/Invalid/);
 assert.throws(()=>math().practice('missing'),/Unknown/);
 assert.throws(()=>math().practice('addition','invalid'),/Unknown/);
 assert.throws(()=>validateQuestions([]),/Empty/);
 const bad=questions('cs-en')[0];assert.throws(()=>validateQuestions([{...bad,options:[bad.answer,bad.answer]}]),/Invalid/);
 assert.throws(()=>validateQuestions([{...bad,answer:'not a choice'}]),/Invalid/);
});
test('corrupted persisted data cannot crash the results view or create negative goals',()=>{
 const storage={getItem:()=>JSON.stringify({goals:-9,sound:'bad',completed:['numbers','numbers',3],attempts:[{date:'invalid',total:20,correct:20,percent:100}]})};
 assert.deepEqual(loadProgress(storage,'key'),{goals:0,sound:true,completed:['numbers'],attempts:[],learnCursor:0,rounds:0});
 assert.deepEqual(loadProgress({getItem:()=>'{broken'},'key').attempts,[]);
 assert.throws(()=>loadProgress({getItem:()=>{throw Error('blocked');}},'key'),/blocked/);
 assert.throws(()=>persistProgress({setItem:()=>{throw Error('quota');}},'key',{}),/quota/);
});
test('only ten valid results survive and valid old progress is preserved',()=>{
 const result={date:'2026-11-06T12:00:00Z',total:20,correct:18,percent:90};
 const source={completed:['school'],goals:17,sound:false,attempts:Array(12).fill(result)};
 const loaded=loadProgress({getItem:()=>JSON.stringify(source)},'key');
 assert.equal(loaded.attempts.length,10);assert.equal(loaded.goals,17);assert.equal(loaded.sound,false);
});
