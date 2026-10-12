(() => {
  const root = document.querySelector('.strategy-demo');
  if (!root) return;
  const cases = {
    documents:{
      problem:'Important information is buried inside long, complex documents.',
      problemCopy:'Users spend too much time reading before they can identify the facts, risks and questions that actually matter.',
      input:'Documents and source material',
      inputCopy:'Reports, policies, contracts and business documents',
      ai:'Extract and structure',
      aiCopy:'Identify relevant signals and organize them around the user task',
      output:'What needs attention?',
      outputCopy:'A concise view of relevant facts, risk and next questions',
      value:'Reduce interpretation time',
      valueCopy:'The product creates value when a user can move from source material to a defensible understanding faster.',
      measure:'Time to useful insight'
    },
    financial:{
      problem:'Important movement can disappear inside dense financial and operating data.',
      problemCopy:'Users need to distinguish meaningful change from normal variation before they can prioritize a response.',
      input:'Financial and operating data',
      inputCopy:'Performance data, approvals, transactions and business metrics',
      ai:'Detect and explain',
      aiCopy:'Surface material trends, exceptions and relevant comparisons',
      output:'What changed and why does it matter?',
      outputCopy:'Prioritized signals with enough context to support a review or decision',
      value:'Focus attention on material change',
      valueCopy:'The product should reduce the time spent searching for the signal and increase the time spent deciding what to do about it.',
      measure:'Analysis cycle time'
    },
    business:{
      problem:'Dashboards show activity but often leave the user to interpret the story alone.',
      problemCopy:'Business teams need a clearer explanation of what changed, where it changed and which part deserves attention first.',
      input:'Connected business data',
      inputCopy:'Operational, customer and performance information',
      ai:'Synthesize and prioritize',
      aiCopy:'Connect related signals and organize them around a business question',
      output:'What should I investigate first?',
      outputCopy:'Decision ready context rather than another collection of charts',
      value:'Move from monitoring to understanding',
      valueCopy:'The product becomes more useful when it helps a user identify the next question instead of only presenting the current state.',
      measure:'Decision readiness'
    },
    operations:{
      problem:'Analysis loses value when it is disconnected from the operational workflow that follows.',
      problemCopy:'Teams need to move from an insight to an approval, review or action without rebuilding the context in another system.',
      input:'Analysis + workflow context',
      inputCopy:'Signals, supporting evidence and business rules',
      ai:'Package the context',
      aiCopy:'Present the information needed for a faster and more consistent decision',
      output:'What action should happen next?',
      outputCopy:'A clearer handoff into review, approval or operational follow through',
      value:'Reduce decision friction',
      valueCopy:'The product creates operating value when insight can move into action with less rework and less context loss.',
      measure:'Workflow efficiency'
    }
  };
  const map = {
    problem:'sd-problem',
    problemCopy:'sd-problem-copy',
    input:'sd-input',
    inputCopy:'sd-input-copy',
    ai:'sd-ai',
    aiCopy:'sd-ai-copy',
    output:'sd-output',
    outputCopy:'sd-output-copy',
    value:'sd-value-title',
    valueCopy:'sd-value-copy',
    measure:'sd-measure'
  };
  root.querySelectorAll('[data-usecase]').forEach(btn => btn.addEventListener('click', () => {
    root.querySelectorAll('[data-usecase]').forEach(b => b.classList.toggle('active', b === btn));
    const d = cases[btn.dataset.usecase];
    Object.entries(map).forEach(([key,id]) => document.getElementById(id).textContent = d[key]);
  }));
})();