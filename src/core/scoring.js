export function scoreAnswers(questions,answers){
  const categories={}; let correct=0;
  questions.forEach((q,i)=>{const ok=q.answer===answers[i];correct+=Number(ok); categories[q.category]??={correct:0,total:0};categories[q.category].total++;categories[q.category].correct+=Number(ok);});
  return {correct,total:questions.length,percent:questions.length?Math.round(100*correct/questions.length):0,categories};
}
