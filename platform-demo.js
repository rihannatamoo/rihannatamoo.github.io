(() => {
  const root=document.querySelector('.platform-demo'); if(!root) return;
  const navs=[...root.querySelectorAll('.pd-nav')];
  const screens=[...root.querySelectorAll('.pd-screen')];
  navs.forEach(btn=>btn.addEventListener('click',()=>{
    navs.forEach(n=>n.classList.toggle('active',n===btn));
    screens.forEach(s=>s.classList.toggle('active',s.dataset.platformPanel===btn.dataset.platformScreen));
  }));
  const reports={
    trend:['Summary Trend','Trend reporting uses shared metric definitions, reporting context and reusable filters.'],
    ranking:['Ranking','Ranking compares hierarchy entities using the same metric catalogue and reporting context.'],
    detail:['Detail','Detail reporting exposes the records behind an aggregate result without creating a separate product path.'],
    task:['Task Analysis','Task analysis connects reporting to operational follow through while preserving the shared report model.']
  };
  root.querySelectorAll('.pd-report').forEach(btn=>btn.addEventListener('click',()=>{
    root.querySelectorAll('.pd-report').forEach(b=>b.classList.toggle('active',b===btn));
    const d=reports[btn.dataset.report]; if(!d)return;
    document.getElementById('pd-report-title').textContent=d[0];
    document.getElementById('pd-report-copy').textContent=d[1];
  }));
  const requests={
    filter:['SHARED CONFIGURATION','Extend the reusable filter framework','Use the existing filter model and configuration pattern instead of creating a client specific filter path.'],
    messages:['PLATFORM STANDARD','Centralize product message localization','Treat error, empty and no data messaging as reusable product behavior so every module does not solve translation separately.'],
    drill:['REUSE EXISTING CAPABILITY','Use shared click through behavior','Configure the report definition to reuse the existing drill through pattern rather than creating duplicate administration.']
  };
  root.querySelectorAll('[data-request]').forEach(btn=>btn.addEventListener('click',()=>{
    root.querySelectorAll('[data-request]').forEach(b=>b.classList.toggle('active',b===btn));
    const d=requests[btn.dataset.request]; if(!d)return;
    document.getElementById('pd-answer-type').textContent=d[0];
    document.getElementById('pd-answer-title').textContent=d[1];
    document.getElementById('pd-answer-copy').textContent=d[2];
  }));
})();