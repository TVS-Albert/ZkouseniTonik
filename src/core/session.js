// A response is final until the child explicitly moves to the next activity.
export function createSession(kind,items){
 if(!items.length)throw Error('Empty session');
 return {kind,items,index:0,answers:[],feedback:null,revealed:false,selectedTokens:[],matched:[],left:null,right:null,pairError:false};
}
export function submitResponse(session,answer){
 if(session.feedback)return false;
 const item=session.items[session.index];
 session.answers[session.index]=answer;
 session.feedback={correct:answer===item.answer,answer:item.answer,explanation:item.explanation};
 return true;
}
export function advanceSession(session){
 const item=session.items[session.index];
 if(!session.feedback&&!(item.type==='flip'&&session.revealed))return false;
 session.index++;session.feedback=null;session.revealed=false;session.selectedTokens=[];session.matched=[];session.left=null;session.right=null;session.pairError=false;
 return true;
}
