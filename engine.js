// Public API retained for the UI and integrations.
import {englishCourse} from './src/content/english-course.js';
export {shuffle} from './src/core/random.js';
export {scoreAnswers} from './src/core/scoring.js';
export {wordQuestion} from './src/exercises/vocabulary.js';
export {makePairs} from './src/exercises/matching.js';
export {positionQuestion,grammarQuestion,sentenceTranslationQuestion,countQuestion,questionQuestion} from './src/content/english-course.js';
export function makePractice(category,direction='both',course=englishCourse){return course.practice(category,direction);}
export function makeExam(course=englishCourse){return course.exam();}
