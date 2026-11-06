import {shuffle} from '../core/random.js';
export function makePairs(deck){return shuffle(deck).slice(0,4).map(x=>({id:x.id,en:x.en,cs:x.cs}));}
