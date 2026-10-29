(() => {
  const root=document.querySelector('.ta-demo'); if(!root) return;

  const nav=[...root.querySelectorAll('.ta-nav')];
  const screens=[...root.querySelectorAll('.ta-screen')];
  function showScreen(key){
    nav.forEach(b=>b.classList.toggle('active',b.dataset.module===key));
    screens.forEach(s=>s.classList.toggle('active',s.dataset.screen===key));
  }
  nav.forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.module)));

  const commentData={
    positive:[
      {s:'positive',t:'“The advisor explained everything clearly and made the visit easy.”'},
      {s:'positive',t:'“Helpful staff and clear communication made a big difference.”'},
      {s:'neutral',t:'“The visit was straightforward and the explanation was useful.”'}
    ],
    neutral:[
      {s:'neutral',t:'“I booked online but still called to confirm the appointment.”'},
      {s:'positive',t:'“The booking flow was easy once I found the right option.”'},
      {s:'negative',t:'“I was not sure whether the online booking had gone through.”'}
    ],
    negative:[
      {s:'negative',t:'“The wait was much longer than I expected.”'},
      {s:'negative',t:'“Everything was fine except the time it took before service started.”'},
      {s:'neutral',t:'“The team was helpful, but the location seemed busy.”'}
    ]
  };

  const insightMap={
    positive:{title:'Service clarity is improving',body:'Helpful staff and clearer explanations are appearing more often in service feedback.',focus:'Service communication',owner:'CX operations',impact:'Higher confidence',action:'Reinforce clear explanation practices',comments:commentData.positive},
    neutral:{title:'Digital booking is becoming more important',body:'Customers increasingly mention online booking while assisted channels remain part of the journey.',focus:'Booking journey',owner:'Digital experience',impact:'Lower friction',action:'Improve confirmation and channel handoff',comments:commentData.neutral},
    negative:{title:'Wait time remains a concentrated pain point',body:'Negative wait time mentions are concentrated in a smaller set of locations and peak periods.',focus:'Wait experience',owner:'Operations',impact:'Reduced detractor risk',action:'Investigate peak period capacity',comments:commentData.negative}
  };

  function renderComments(container,items,filter='all'){
    if(!container) return;
    const visible=filter==='all'?items:items.filter(x=>x.s===filter);
    container.innerHTML=visible.map((x,i)=>'<div class="ta-comment"><div class="ta-comment-top"><small>Feedback '+String(i+1).padStart(2,'0')+'</small><span class="sentiment '+x.s+'">'+x.s+'</span></div><p>'+x.t+'</p></div>').join('');
  }

  let insight='negative';
  const insightComments=document.getElementById('ta-insight-comments');
  function selectInsight(key){
    insight=key;
    root.querySelectorAll('.ta-insight').forEach(el=>el.classList.toggle('selected',el.dataset.insight===key));
    const d=insightMap[key];
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
    set('ta-detail-title',d.title);set('ta-detail-body',d.body);set('ta-detail-focus',d.focus);set('ta-detail-owner',d.owner);set('ta-detail-impact',d.impact);set('ta-detail-action',d.action);
    set('ta-insight-evidence-title','Customer Comments · '+d.title);
    root.querySelectorAll('.ta-comment-filter[data-scope="insight"]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
    renderComments(insightComments,d.comments);
  }
  root.querySelectorAll('.ta-insight').forEach(el=>el.addEventListener('click',()=>selectInsight(el.dataset.insight)));
  selectInsight('negative');

  const topicMap={
    'topic-service':{title:'Service Experience > Staff & Communication',comments:commentData.positive},
    'topic-appointment':{title:'Appointment Experience > Wait Time',comments:commentData.negative},
    'topic-quality':{title:'Product & Service Quality',comments:[{s:'positive',t:'“The work was completed properly and everything was explained.”'},{s:'neutral',t:'“The result was fine, but I would have liked more updates.”'},{s:'negative',t:'“I had to return because the original issue was not fully resolved.”'}]}
  };
  let topic='topic-service';
  const topicComments=document.getElementById('ta-topic-comments');
  function selectTopic(key){
    topic=key;
    root.querySelectorAll('.ta-topic-row').forEach(el=>el.classList.toggle('selected',el.dataset.key===key));
    const d=topicMap[key]||topicMap['topic-service'];
    const title=document.getElementById('ta-topic-evidence-title');if(title)title.textContent=d.title;
    root.querySelectorAll('.ta-comment-filter[data-scope="topic"]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
    renderComments(topicComments,d.comments);
  }
  root.querySelectorAll('.ta-topic-row').forEach(el=>el.addEventListener('click',()=>selectTopic(el.dataset.key)));
  selectTopic('topic-service');

  const topicSearch=document.getElementById('ta-topic-search');
  if(topicSearch) topicSearch.addEventListener('input',()=>{
    const q=topicSearch.value.toLowerCase();
    root.querySelectorAll('.ta-topic-row').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'grid':'none');
  });

  const keywordMap={
    'keyword-wait':{title:'Keyword: wait',sentiment:'negative',comments:commentData.negative},
    'keyword-helpful':{title:'Keyword: helpful',sentiment:'positive',comments:commentData.positive},
    'keyword-booking':{title:'Keyword: booking',sentiment:'neutral',comments:commentData.neutral},
    'keyword-staff':{title:'Keyword: staff',sentiment:'positive',comments:commentData.positive},
    'keyword-communication':{title:'Keyword: communication',sentiment:'neutral',comments:commentData.neutral},
    'keyword-price':{title:'Keyword: price',sentiment:'negative',comments:[{s:'negative',t:'“The price was higher than I expected.”'},{s:'neutral',t:'“The cost was explained, but I still wanted more options.”'}]},
    'keyword-easy':{title:'Keyword: easy',sentiment:'positive',comments:[{s:'positive',t:'“The process was easy from start to finish.”'},{s:'positive',t:'“Booking was simple and the instructions were clear.”'}]},
    'keyword-confirmation':{title:'Keyword: confirmation',sentiment:'neutral',comments:commentData.neutral}
  };
  let keyword='keyword-wait';
  const keywordComments=document.getElementById('ta-keyword-comments');
  function selectKeyword(key){
    keyword=key;
    root.querySelectorAll('.ta-keyword-row,.ta-theme-tag').forEach(el=>el.classList.toggle('selected',el.dataset.key===key));
    const d=keywordMap[key]||keywordMap['keyword-wait'];
    const title=document.getElementById('ta-keyword-evidence-title');if(title)title.textContent=d.title+' · Customer Comments';
    root.querySelectorAll('.ta-comment-filter[data-scope="keyword"]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
    renderComments(keywordComments,d.comments);
  }
  root.querySelectorAll('.ta-keyword-row,.ta-theme-tag').forEach(el=>el.addEventListener('click',()=>selectKeyword(el.dataset.key)));
  selectKeyword('keyword-wait');

  root.querySelectorAll('.ta-keyword-filter').forEach(btn=>btn.addEventListener('click',()=>{
    root.querySelectorAll('.ta-keyword-filter').forEach(b=>b.classList.toggle('active',b===btn));
    const f=btn.dataset.filter;
    root.querySelectorAll('.ta-keyword-row').forEach(r=>r.style.display=f==='all'||r.dataset.dominant===f?'grid':'none');
    root.querySelectorAll('.ta-theme-tag').forEach(t=>t.style.display=f==='all'||t.dataset.dominant===f?'inline-block':'none');
  }));

  root.querySelectorAll('.ta-comment-filter').forEach(btn=>btn.addEventListener('click',()=>{
    const scope=btn.dataset.scope,filter=btn.dataset.filter;
    root.querySelectorAll('.ta-comment-filter[data-scope="'+scope+'"]').forEach(b=>b.classList.toggle('active',b===btn));
    if(scope==='insight') renderComments(insightComments,insightMap[insight].comments,filter);
    if(scope==='topic') renderComments(topicComments,(topicMap[topic]||topicMap['topic-service']).comments,filter);
    if(scope==='keyword') renderComments(keywordComments,(keywordMap[keyword]||keywordMap['keyword-wait']).comments,filter);
  }));

  const candidates={
    'candidate-advisor':{type:'Suggested subtopic',title:'Advisor explanation quality',desc:'Customers increasingly discuss whether staff can explain products and service options clearly.',volume:'486',change:'▲ 31%',parent:'Service Experience',closest:'Staff Helpfulness',share:'8.4%',reason:'A repeated cluster of comments about clarity and confidence reached the review threshold and increased versus the previous period.',comments:commentData.positive},
    'candidate-confirmation':{type:'Suggested subtopic',title:'Booking confirmation',desc:'Customers mention uncertainty around whether digital bookings have been confirmed.',volume:'288',change:'▲ 18%',parent:'Appointment Experience',closest:'Online Booking',share:'5.1%',reason:'Mentions increased and form a stable cluster distinct from general booking comments.',comments:commentData.neutral},
    'candidate-price':{type:'Suggested topic',title:'Price transparency',desc:'Customers discuss unexpected cost and the clarity of pricing explanations.',volume:'394',change:'▲ 12%',parent:'Propose as new topic',closest:'Value for Money',share:'6.2%',reason:'The language cluster is growing and overlaps partially with value, but includes a distinct transparency pattern.',comments:keywordMap['keyword-price'].comments}
  };
  let candidate='candidate-advisor';
  const themeComments=document.getElementById('ta-theme-comments');
  function selectCandidate(key){
    candidate=key; const d=candidates[key]||candidates['candidate-advisor'];
    root.querySelectorAll('.ta-candidate-item').forEach(el=>el.classList.toggle('selected',el.dataset.key===key));
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
    set('ta-candidate-type',d.type);set('ta-candidate-title',d.title);set('ta-candidate-desc',d.desc);set('ta-candidate-volume',d.volume);set('ta-candidate-change',d.change);set('ta-candidate-parent',d.parent);set('ta-candidate-closest',d.closest);set('ta-candidate-share',d.share);set('ta-candidate-reason',d.reason);set('ta-theme-evidence-title','Supporting comments · '+d.title);
    renderComments(themeComments,d.comments);
  }
  root.querySelectorAll('.ta-candidate-item').forEach(el=>el.addEventListener('click',()=>selectCandidate(el.dataset.key)));
  selectCandidate('candidate-advisor');

  const toast=document.getElementById('ta-toast');
  function notify(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1700)}
  root.querySelectorAll('.ta-actions [data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    notify(action.charAt(0).toUpperCase()+action.slice(1)+' action recorded for demo');
  }));
  const exportBtn=document.getElementById('ta-export');if(exportBtn)exportBtn.addEventListener('click',()=>notify('Sample export prepared'));

  const tour=document.getElementById('ta-tour'),start=document.getElementById('ta-tour-start'),prev=document.getElementById('ta-tour-prev'),next=document.getElementById('ta-tour-next'),close=document.getElementById('ta-tour-close');
  const steps=[
    {screen:'insights',title:'Start with synthesis',body:'Review three prioritized AI insights, then inspect the evidence behind each conclusion.'},
    {screen:'topics',title:'Analyze approved taxonomy',body:'Compare known topics and subtopics using sentiment, NPS, movement and customer comments.'},
    {screen:'keywords',title:'Explore customer language',body:'Use Theme Tags for discovery and the Keyword Table for structured comparison.'},
    {screen:'themes',title:'Govern what AI discovers',body:'Review emerging candidates, why they surfaced, where they may belong and the evidence behind them.'}
  ];
  let step=0;
  function paintTour(){
    const d=steps[step];showScreen(d.screen);
    const a=document.getElementById('ta-tour-step');if(a)a.textContent='Walkthrough '+(step+1)+' of '+steps.length;
    const title=document.getElementById('ta-tour-title');if(title)title.textContent=d.title;
    const body=document.getElementById('ta-tour-body');if(body)body.textContent=d.body;
    const dots=document.getElementById('ta-tour-dots');if(dots)dots.innerHTML=steps.map((_,i)=>'<i class="'+(i===step?'active':'')+'"></i>').join('');
    if(prev)prev.style.visibility=step===0?'hidden':'visible';
    if(next)next.textContent=step===steps.length-1?'Finish':'Next';
  }
  if(start)start.addEventListener('click',()=>{step=0;tour&&tour.classList.add('show');paintTour()});
  if(close)close.addEventListener('click',()=>tour&&tour.classList.remove('show'));
  if(prev)prev.addEventListener('click',()=>{if(step>0){step--;paintTour()}});
  if(next)next.addEventListener('click',()=>{if(step<steps.length-1){step++;paintTour()}else tour&&tour.classList.remove('show')});
})();