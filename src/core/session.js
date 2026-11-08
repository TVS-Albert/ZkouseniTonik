// First responses stay locked; learning history restores completed and partial work.
const stateKeys=['feedback','revealed','selectedTokens','matched','left','right','pairError'];
function snapshot(session){return Object.fromEntries(stateKeys.map(key=>[key,Array.isArray(session[key])?[...session[key]]:session[key]]));}
function restore(session){Object.assign(session,{feedback:null,revealed:false,selectedTokens:[],matched:[],left:null,right:null,pairError:false},session.history[session.index]||{});session.selectedTokens=[...session.selectedTokens];session.matched=[...session.matched];}
export function createSession(kind,items){
 if(!items.length)throw Error('Empty session');
 return {kind,items,index:0,answers:[],feedback:null,revealed:false,selectedTokens:[],matched:[],left:null,right:null,pairError:false,history:[],seenFlips:[]};
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
 session.history[session.index]=snapshot(session);session.index++;restore(session);
 return true;
}
export function previousActivity(session){
 if(session.kind!=='learn'||session.index===0)return false;
 session.history[session.index]=snapshot(session);session.index--;restore(session);return true;
}
