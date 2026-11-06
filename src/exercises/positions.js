import {shuffle} from '../core/random.js';
export function createPositionExercise(positions){
function positionQuestion(pos,reverse=false){
  const answer=reverse?pos.cs:pos.en;
  return {id:`position-${pos.id}-${reverse}`,category:'positions',type:'choice',task:reverse?'Co znamená předložka v této větě?':'Kde je tužka? Vyber anglicky.',prompt:reverse?pos.sentence:'Where’s the pencil?',scene:{type:'position',position:pos.id},answer,options:shuffle(positions.map(p=>reverse?p.cs:p.en)),explanation:`${pos.en} = ${pos.cs}. ${pos.translation}`,speak:reverse?pos.sentence:null};
}

return positionQuestion;
}
