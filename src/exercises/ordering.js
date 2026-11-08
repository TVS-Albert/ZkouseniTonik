import {shuffle} from '../core/random.js';

export function orderingQuestion({id,category,prompt,answer,explanation}) {
  return {id,category,type:'order',task:'Klepni na slova ve správném pořadí.',prompt,answer,
    tokens:shuffle(answer.split(' ')),explanation};
}
