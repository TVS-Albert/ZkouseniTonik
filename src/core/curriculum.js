// Course definitions contain data and factories; no DOM or English-specific logic.
export function validateQuestions(questions) {
  if (!Array.isArray(questions) || !questions.length) throw new Error('Empty question bank');
  for (const q of questions) {
    if(q.type==='order'){
      if(!q.id||!q.category||!q.prompt||!Array.isArray(q.tokens)||q.tokens.length<2||typeof q.answer!=='string'||
        [...q.tokens].sort().join(' ')!==q.answer.split(' ').sort().join(' '))throw new Error(`Invalid ordering question: ${q.id}`);
      continue;
    }
    if (!q.id || !q.category || !q.prompt || !Array.isArray(q.options) || q.options.length < 2 ||
        new Set(q.options).size !== q.options.length || !q.options.includes(q.answer)) {
      throw new Error(`Invalid question: ${q.id || 'missing id'}`);
    }
  }
  return questions;
}
export function defineCourse({id,title,topics,exam}) {
  if (!id || !title || !Array.isArray(topics) || !topics.length || typeof exam !== 'function') throw new Error('Invalid course');
  const byId = new Map();
  for (const topic of topics) {
    if (!topic.id || byId.has(topic.id) || !Array.isArray(topic.deck) || !topic.deck.length || typeof topic.practice !== 'function') throw new Error('Invalid or duplicate topic');
    const ids = topic.deck.map(c => c.id);
    if (new Set(ids).size !== ids.length || topic.deck.some(c => !c.id || typeof c.en !== 'string' || typeof c.cs !== 'string')) throw new Error('Invalid learning cards');
    byId.set(topic.id,Object.freeze({...topic}));
  }
  function topic(id) { if (!byId.has(id)) throw new Error(`Unknown topic: ${id}`); return byId.get(id); }
  return Object.freeze({id,title,topics:Object.freeze([...byId.values()]),topic,
    practice(id,direction='both') { return validateQuestions(topic(id).practice(direction)); },
    exam() { return validateQuestions(exam()); },
  });
}
export function createCourseRegistry(courses=[]) {
  const map=new Map();
  const registry={
    register(course) { if (map.has(course.id)) throw new Error(`Duplicate course: ${course.id}`);map.set(course.id,course);return registry; },
    get(id) { if (!map.has(id)) throw new Error(`Unknown course: ${id}`);return map.get(id); },
    list() { return [...map.values()]; },
  };
  courses.forEach(c=>registry.register(c));
  return registry;
}
