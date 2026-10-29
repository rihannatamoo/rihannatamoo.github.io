(() => {
  const root=document.querySelector('.fastdoc-demo'); if(!root) return;
  const docs={
    release:{title:'Create release notes',subtitle:'Turn completed work and release context into a structured first draft.',time:'Minutes',sourceOne:'8 release items',sourceTwo:'3 product notes',sourceThree:'Customer facing',sourceFour:'Highlights + fixes',output:'Release Notes · Draft',draftTitle:'Release highlights',intro:'This release improves document generation quality, onboarding and workflow reliability.',one:['Improved context handling for generated documents','Simplified setup for recurring documentation workflows'],twoLabel:'FIXES',two:['Resolved issues affecting longer document generation','Improved consistency in generated section structure']},
    sprint:{title:'Create a sprint summary',subtitle:'Turn completed work, carryover and product decisions into a concise team summary.',time:'Minutes',sourceOne:'12 completed items',sourceTwo:'4 product decisions',sourceThree:'Product + delivery',sourceFour:'Progress + risks',output:'Sprint Summary · Draft',draftTitle:'Sprint progress',intro:'The sprint advanced core product work while resolving priority delivery risks.',one:['Completed planned product improvements','Clarified requirements for upcoming work'],twoLabel:'WATCH NEXT',two:['Carryover requiring follow through','Dependencies to resolve before release']},
    knowledge:{title:'Create a knowledge article',subtitle:'Turn product knowledge and source material into a structured article users can review and reuse.',time:'Minutes',sourceOne:'5 source documents',sourceTwo:'2 subject notes',sourceThree:'Internal users',sourceFour:'Overview + steps',output:'Knowledge Article · Draft',draftTitle:'How the workflow works',intro:'This article explains the product flow, expected inputs and the steps required to complete the task.',one:['What the feature is designed to do','What information the user needs before starting'],twoLabel:'STEPS',two:['Complete the required setup','Review the generated result before publishing']}
  };
  function apply(key){
    const d=docs[key];
    const map={ 'fd-title':d.title,'fd-subtitle':d.subtitle,'fd-time':d.time,'fd-source-one':d.sourceOne,'fd-source-two':d.sourceTwo,'fd-source-three':d.sourceThree,'fd-source-four':d.sourceFour,'fd-output-name':d.output,'fd-draft-title':d.draftTitle,'fd-draft-intro':d.intro,'fd-section-two-label':d.twoLabel};
    Object.entries(map).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.textContent=val});
    document.getElementById('fd-list-one').innerHTML=d.one.map(x=>'<li>'+x+'</li>').join('');
    document.getElementById('fd-list-two').innerHTML=d.two.map(x=>'<li>'+x+'</li>').join('');
    document.getElementById('fd-empty').style.display='grid';
    document.getElementById('fd-draft').classList.remove('show');
    document.getElementById('fd-output-state').textContent='Ready to generate';
    [...root.querySelectorAll('.fd-step')].forEach((s,i)=>s.classList.toggle('active',i===0));
  }
  root.querySelectorAll('.fd-type').forEach(btn=>btn.addEventListener('click',()=>{
    root.querySelectorAll('.fd-type').forEach(b=>b.classList.toggle('active',b===btn)); apply(btn.dataset.doc);
  }));
  document.getElementById('fd-generate').addEventListener('click',()=>{
    document.getElementById('fd-empty').style.display='none';
    document.getElementById('fd-draft').classList.add('show');
    document.getElementById('fd-output-state').textContent='Draft generated';
    const steps=[...root.querySelectorAll('.fd-step')];
    steps.forEach((s,i)=>s.classList.toggle('active',i===1));
    setTimeout(()=>steps.forEach((s,i)=>s.classList.toggle('active',i===2)),650);
  });
})();