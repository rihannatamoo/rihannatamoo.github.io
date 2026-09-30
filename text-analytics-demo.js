(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const demo = $('.ta-demo');
  if (!demo) return;

  const toast = $('#ta-toast', demo);
  let toastTimer;
  const state = {
    module: 'insights',
    insight: 'negative',
    topic: 'topic-service',
    keyword: 'keyword-wait',
    candidate: 'candidate-advisor',
    filters: { insight: 'all', topic: 'all', keyword: 'all' }
  };

  const comments = {
    'insight-positive': [
      {source:'Survey · Service', sentiment:'positive', text:'The advisor was patient, helpful and explained the options clearly.', tags:['helpful','advisor']},
      {source:'Review · Service', sentiment:'positive', text:'Friendly staff and a very smooth experience overall.', tags:['friendly','staff']},
      {source:'Survey · Follow up', sentiment:'neutral', text:'The visit was good. Clear next steps were the best part.', tags:['clarity','service']}
    ],
    'insight-neutral': [
      {source:'Survey · Appointment', sentiment:'neutral', text:'Booking online was easy, but I still called to confirm the time.', tags:['booking','confirmation']},
      {source:'Review · Appointment', sentiment:'positive', text:'The online booking flow was quick and simple.', tags:['booking','easy']},
      {source:'Survey · Appointment', sentiment:'negative', text:'I booked online but the confirmation was not clear.', tags:['booking','confirmation']}
    ],
    'insight-negative': [
      {source:'Survey · Service visit', sentiment:'negative', text:'The staff were helpful, but the wait was much longer than expected.', tags:['wait','staff']},
      {source:'Review · Location 208', sentiment:'negative', text:'I had an appointment and still waited almost an hour.', tags:['wait','appointment']},
      {source:'Contact centre', sentiment:'neutral', text:'The main issue was not knowing how long the delay would be.', tags:['wait','communication']}
    ],
    'topic-service': [
      {source:'Survey · Service', sentiment:'positive', text:'The team was friendly and took time to explain the options.', tags:['service experience','staff friendliness']},
      {source:'Review · Service', sentiment:'positive', text:'Helpful staff and a smooth experience overall.', tags:['service experience','helpful']},
      {source:'Survey · Service', sentiment:'neutral', text:'Everything was handled correctly, though the process felt rushed.', tags:['service experience']}
    ],
    'topic-appointment': [
      {source:'Survey · Appointment', sentiment:'negative', text:'I arrived on time but waited far longer than the appointment window.', tags:['appointment','wait time']},
      {source:'Review · Appointment', sentiment:'negative', text:'The booking was easy. The wait once I arrived was not.', tags:['appointment','wait']},
      {source:'Survey · Appointment', sentiment:'neutral', text:'The timing was acceptable but communication could have been better.', tags:['appointment','communication']}
    ],
    'topic-quality': [
      {source:'Survey · Product', sentiment:'positive', text:'The product has been reliable and I have not had any issues.', tags:['product quality','reliability']},
      {source:'Review · Product', sentiment:'positive', text:'Reliable so far and performs as expected.', tags:['reliability']},
      {source:'Support ticket', sentiment:'negative', text:'I expected better reliability given the price point.', tags:['reliability','quality']}
    ],
    'keyword-wait': [
      {source:'Survey · Service', sentiment:'negative', text:'The wait was the only disappointing part of the visit.', tags:['wait']},
      {source:'Review · Location 208', sentiment:'negative', text:'Long wait even with an appointment.', tags:['wait','appointment']},
      {source:'Contact centre', sentiment:'neutral', text:'Please provide more accurate wait estimates.', tags:['wait','communication']}
    ],
    'keyword-helpful': [
      {source:'Survey · Service', sentiment:'positive', text:'Very helpful and knowledgeable staff.', tags:['helpful','staff']},
      {source:'Review · Service', sentiment:'positive', text:'The advisor was helpful without being pushy.', tags:['helpful','advisor']},
      {source:'Survey · Service', sentiment:'positive', text:'Helpful explanation and clear next steps.', tags:['helpful','explanation']}
    ],
    'keyword-booking': [
      {source:'Survey · Appointment', sentiment:'positive', text:'Booking online took less than a minute.', tags:['booking','digital']},
      {source:'Review · Appointment', sentiment:'neutral', text:'Booking was fine, but the confirmation could be clearer.', tags:['booking','confirmation']},
      {source:'Survey · Appointment', sentiment:'negative', text:'The booking page timed out twice before it worked.', tags:['booking','digital']}
    ],
    'keyword-staff': [
      {source:'Survey · Service', sentiment:'positive', text:'The staff were professional and welcoming.', tags:['staff','service']},
      {source:'Review · Service', sentiment:'positive', text:'Staff explained everything clearly.', tags:['staff','explanation']},
      {source:'Survey · Service', sentiment:'neutral', text:'Staff were fine, but the process took too long.', tags:['staff','wait']}
    ],
    'keyword-communication': [
      {source:'Survey · Service', sentiment:'neutral', text:'Communication was clear once someone was available.', tags:['communication']},
      {source:'Contact centre', sentiment:'negative', text:'I wanted more proactive communication about the delay.', tags:['communication','wait']},
      {source:'Review', sentiment:'positive', text:'Good communication throughout the process.', tags:['communication']}
    ],
    'keyword-price': [
      {source:'Survey', sentiment:'negative', text:'The price was higher than I expected.', tags:['price','value']},
      {source:'Review', sentiment:'neutral', text:'The price was acceptable once the options were explained.', tags:['price','explanation']},
      {source:'Survey', sentiment:'negative', text:'I wanted clearer pricing before committing.', tags:['price','clarity']}
    ],
    'keyword-easy': [
      {source:'Survey · Digital', sentiment:'positive', text:'The process was easy from start to finish.', tags:['easy','digital']},
      {source:'Review', sentiment:'positive', text:'Easy to book and easy to understand.', tags:['easy','booking']},
      {source:'Survey', sentiment:'positive', text:'Everything was straightforward.', tags:['easy']}
    ],
    'keyword-confirmation': [
      {source:'Survey · Appointment', sentiment:'neutral', text:'The confirmation arrived, but I was not sure what to expect next.', tags:['confirmation']},
      {source:'Review', sentiment:'negative', text:'I did not receive a clear confirmation after booking.', tags:['confirmation','booking']},
      {source:'Survey', sentiment:'positive', text:'The confirmation message was clear and helpful.', tags:['confirmation']}
    ],
    'candidate-advisor': [
      {source:'Survey · Service', sentiment:'positive', text:'The advisor knew the options and explained the differences clearly.', tags:['advisor knowledge','explanation']},
      {source:'Review · Service', sentiment:'negative', text:'I expected the advisor to know more about the available service plans.', tags:['advisor knowledge']},
      {source:'Survey · Service', sentiment:'neutral', text:'The explanation was useful, but I had to ask several follow up questions.', tags:['advisor knowledge','clarity']}
    ],
    'candidate-confirmation': [
      {source:'Survey · Appointment', sentiment:'negative', text:'I booked online and was unsure whether the appointment was confirmed.', tags:['digital confirmation','booking']},
      {source:'Review · Appointment', sentiment:'neutral', text:'The booking worked but the confirmation details were easy to miss.', tags:['digital confirmation']},
      {source:'Survey · Appointment', sentiment:'positive', text:'The confirmation text made the next steps very clear.', tags:['digital confirmation']}
    ],
    'candidate-price': [
      {source:'Survey · Service', sentiment:'negative', text:'I wanted to understand the final price before agreeing to the work.', tags:['price transparency']},
      {source:'Review · Service', sentiment:'neutral', text:'The price made sense once someone broke it down.', tags:['price transparency','explanation']},
      {source:'Survey · Service', sentiment:'negative', text:'The estimate should have been clearer upfront.', tags:['price transparency']}
    ]
  };

  const insightDetails = {
    positive:{title:'Service friendliness improved',body:'Positive language around helpful staff and clear explanations increased across service feedback.',focus:'Frontline service',owner:'CX Operations',impact:'Retention',action:'Reinforce the behaviours showing the strongest positive customer response.'},
    neutral:{title:'Appointment scheduling is shifting',body:'Digital booking mentions are rising, while customers still use assisted channels when confirmation is unclear.',focus:'Booking journey',owner:'Digital Experience',impact:'Convenience',action:'Improve confirmation clarity and track channel switching after booking.'},
    negative:{title:'Wait time complaints increased',body:'Negative wait time mentions are concentrated in a smaller set of locations and peak periods.',focus:'Capacity and communication',owner:'Operations',impact:'Satisfaction',action:'Investigate peak period staffing and provide clearer delay expectations.'}
  };

  const topicLabels = {
    'topic-service':'Service Experience › Staff friendliness',
    'topic-appointment':'Appointment › Wait time',
    'topic-quality':'Product Quality › Reliability'
  };

  const keywordLabels = {
    'keyword-wait':'wait','keyword-helpful':'helpful','keyword-booking':'booking','keyword-staff':'staff','keyword-communication':'communication','keyword-price':'price','keyword-easy':'easy','keyword-confirmation':'confirmation'
  };

  const candidateDetails = {
    'candidate-advisor':{type:'SUGGESTED SUBTOPIC',title:'Advisor Knowledge',desc:'Customers increasingly discuss whether staff can explain products and service options clearly.',volume:'486',change:'▲ 28%',parent:'Service Experience',closest:'Staff Helpfulness',share:'6.4%',reason:'A repeated cluster of comments about the clarity and confidence of staff explanations reached the review threshold and increased versus the previous period.'},
    'candidate-confirmation':{type:'SUGGESTED SUBTOPIC',title:'Digital Confirmation',desc:'Customers repeatedly mention uncertainty after completing online appointment booking.',volume:'311',change:'▲ 17%',parent:'Appointment',closest:'Booking Experience',share:'4.1%',reason:'A cluster around confirmation clarity continued across multiple feedback sources and increased versus the previous equivalent period.'},
    'candidate-price':{type:'SUGGESTED TOPIC',title:'Price Transparency',desc:'Customers discuss wanting clearer explanations of pricing before committing to service.',volume:'254',change:'▲ 12%',parent:'Value and Pricing',closest:'Price Fairness',share:'3.3%',reason:'Comments about understanding price before commitment reached the review threshold and appear distinct from the existing Price Fairness topic.'}
  };

  function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}

  function setModule(name){state.module=name;$$('.ta-nav',demo).forEach(n=>n.classList.toggle('active',n.dataset.module===name));$$('.ta-screen',demo).forEach(s=>s.classList.toggle('active',s.dataset.screen===name))}
  $$('.ta-nav',demo).forEach(n=>n.addEventListener('click',()=>setModule(n.dataset.module)));

  $$('.ta-context select',demo).forEach(sel=>sel.addEventListener('change',()=>{const note=$('.ta-context-note',demo);note.textContent=`${$('#ta-period',demo).value} · ${$('#ta-hierarchy',demo).value} · ${$('#ta-source',demo).value}`;showToast('Reporting context updated')}));

  function commentCard(c){return `<article class="ta-comment-card" data-sentiment="${c.sentiment}"><div class="ta-comment-meta"><span>${c.source}</span><span class="ta-comment-sentiment ${c.sentiment}">${c.sentiment}</span></div><p>“${c.text}”</p><div class="ta-comment-tags">${c.tags.map(t=>`<span>${t}</span>`).join('')}</div></article>`}
  function renderComments(containerId,key,filter='all'){const el=$(containerId,demo);if(!el)return;const rows=comments[key]||[];const visible=filter==='all'?rows:rows.filter(c=>c.sentiment===filter);el.innerHTML=visible.length?visible.map(commentCard).join(''):'<article class="ta-comment-card"><p>No comments match this sentiment filter in the demo data.</p></article>'}

  function selectInsight(type){state.insight=type;$$('.ta-insight',demo).forEach(c=>c.classList.toggle('selected',c.dataset.insight===type));const d=insightDetails[type];$('#ta-detail-title',demo).textContent=d.title;$('#ta-detail-body',demo).textContent=d.body;$('#ta-detail-focus',demo).textContent=d.focus;$('#ta-detail-owner',demo).textContent=d.owner;$('#ta-detail-impact',demo).textContent=d.impact;$('#ta-detail-action',demo).textContent=d.action;$('#ta-insight-evidence-title',demo).textContent=`Evidence for ${d.title}`;state.filters.insight='all';resetCommentFilter('insight');renderComments('#ta-insight-comments',`insight-${type}`,'all')}
  $$('.ta-insight',demo).forEach(card=>card.addEventListener('click',()=>selectInsight(card.dataset.insight)));

  function selectTopic(key){state.topic=key;$$('.ta-topic-row',demo).forEach(r=>r.classList.toggle('selected',r.dataset.key===key));$('#ta-topic-evidence-title',demo).textContent=topicLabels[key]||'Selected topic';state.filters.topic='all';resetCommentFilter('topic');renderComments('#ta-topic-comments',key,'all')}
  $$('.ta-topic-row',demo).forEach(row=>row.addEventListener('click',()=>selectTopic(row.dataset.key)));
  $('#ta-topic-search',demo)?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();$$('.ta-topic-row',demo).forEach(r=>r.classList.toggle('ta-row-hidden',q&&!r.textContent.toLowerCase().includes(q)))});
  $('#ta-topic-sort',demo)?.addEventListener('change',()=>showToast(`Sorted by ${$('#ta-topic-sort',demo).value}`));
  $('#ta-export',demo)?.addEventListener('click',()=>showToast('Excel export prepared in product flow'));

  function selectKeyword(key){state.keyword=key;$$('.ta-keyword-row',demo).forEach(r=>r.classList.toggle('selected',r.dataset.key===key));$$('.ta-theme-tag',demo).forEach(t=>t.classList.toggle('selected',t.dataset.key===key));$('#ta-keyword-evidence-title',demo).textContent=keywordLabels[key]||'Selected keyword';state.filters.keyword='all';resetCommentFilter('keyword');renderComments('#ta-keyword-comments',key,'all')}
  $$('.ta-keyword-row',demo).forEach(row=>row.addEventListener('click',()=>selectKeyword(row.dataset.key)));
  $$('.ta-theme-tag',demo).forEach(tag=>tag.addEventListener('click',()=>selectKeyword(tag.dataset.key)));
  $$('.ta-keyword-filter',demo).forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.filter;$$('.ta-keyword-filter',demo).forEach(b=>b.classList.toggle('active',b===btn));$$('.ta-keyword-row',demo).forEach(r=>r.classList.toggle('ta-row-hidden',filter!=='all'&&r.dataset.dominant!==filter));$$('.ta-theme-tag',demo).forEach(t=>t.classList.toggle('filtered',filter!=='all'&&t.dataset.dominant!==filter));showToast(filter==='all'?'Showing all sentiments':`Showing ${filter} language`)}));
  $('#ta-keyword-sort',demo)?.addEventListener('change',()=>showToast(`Keyword view sorted by ${$('#ta-keyword-sort',demo).value}`));

  function selectCandidate(key){state.candidate=key;$$('.ta-candidate-item',demo).forEach(c=>c.classList.toggle('selected',c.dataset.key===key));const d=candidateDetails[key];$('#ta-candidate-type',demo).textContent=d.type;$('#ta-candidate-title',demo).textContent=d.title;$('#ta-candidate-desc',demo).textContent=d.desc;$('#ta-candidate-volume',demo).textContent=d.volume;$('#ta-candidate-change',demo).textContent=d.change;$('#ta-candidate-parent',demo).textContent=d.parent;$('#ta-candidate-closest',demo).textContent=d.closest;$('#ta-candidate-share',demo).textContent=d.share;$('#ta-candidate-reason',demo).textContent=d.reason;$('#ta-theme-evidence-title',demo).textContent=`Evidence for ${d.title}`;$$('.ta-actions button',demo).forEach(b=>{b.disabled=false;b.textContent=b.dataset.action.charAt(0).toUpperCase()+b.dataset.action.slice(1)});renderComments('#ta-theme-comments',key,'all')}
  $$('.ta-candidate-item',demo).forEach(c=>c.addEventListener('click',()=>selectCandidate(c.dataset.key)));
  $$('.ta-actions button',demo).forEach(btn=>btn.addEventListener('click',()=>{const action=btn.dataset.action;const labels={approve:'Approved',merge:'Merged',reject:'Rejected',suppress:'Suppressed'};$$('.ta-actions button',demo).forEach(b=>b.disabled=true);btn.textContent=labels[action];showToast(`${candidateDetails[state.candidate].title}: ${labels[action]}`)}));

  function resetCommentFilter(scope){$$(`.ta-comment-filter[data-scope="${scope}"]`,demo).forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'))}
  $$('.ta-comment-filter',demo).forEach(btn=>btn.addEventListener('click',()=>{const scope=btn.dataset.scope,filter=btn.dataset.filter;state.filters[scope]=filter;$$(`.ta-comment-filter[data-scope="${scope}"]`,demo).forEach(b=>b.classList.toggle('active',b===btn));if(scope==='insight')renderComments('#ta-insight-comments',`insight-${state.insight}`,filter);if(scope==='topic')renderComments('#ta-topic-comments',state.topic,filter);if(scope==='keyword')renderComments('#ta-keyword-comments',state.keyword,filter)}));

  const tour=$('#ta-tour',demo),tourStep=$('#ta-tour-step',demo),tourTitle=$('#ta-tour-title',demo),tourBody=$('#ta-tour-body',demo),tourDots=$('#ta-tour-dots',demo),tourPrev=$('#ta-tour-prev',demo),tourNext=$('#ta-tour-next',demo);let tourIndex=0;
  const tourSteps=[
    {module:'insights',title:'Start with AI synthesis',body:'Select any positive, neutral or negative insight. The action context and customer evidence update with the selected insight.'},
    {module:'topics',title:'Move into approved topics',body:'Search or select a Topic and Subtopic. The evidence section below shows the exact customer comments for the selected path.'},
    {module:'keywords',title:'Explore customer language two ways',body:'Use Theme Tags for visual exploration and the Keyword Table for structured comparison. Both update the same supporting comments.'},
    {module:'themes',title:'Review what AI discovers',body:'Select a candidate to inspect why it surfaced, where it may belong, the closest existing topic and the comments supporting the recommendation.'}
  ];
  function renderTour(){const s=tourSteps[tourIndex];setModule(s.module);tourStep.textContent=`Walkthrough ${tourIndex+1} of ${tourSteps.length}`;tourTitle.textContent=s.title;tourBody.textContent=s.body;tourPrev.style.visibility=tourIndex===0?'hidden':'visible';tourNext.textContent=tourIndex===tourSteps.length-1?'Finish':'Next';tourDots.innerHTML=tourSteps.map((_,i)=>`<i class="${i===tourIndex?'active':''}"></i>`).join('')}
  $('#ta-tour-start',demo)?.addEventListener('click',()=>{tourIndex=0;tour.classList.add('open');renderTour()});
  $('#ta-tour-close',demo)?.addEventListener('click',()=>tour.classList.remove('open'));
  tourPrev?.addEventListener('click',()=>{if(tourIndex>0){tourIndex--;renderTour()}});
  tourNext?.addEventListener('click',()=>{if(tourIndex<tourSteps.length-1){tourIndex++;renderTour()}else{tour.classList.remove('open');showToast('Walkthrough complete')}});

  selectInsight('negative');
  selectTopic('topic-service');
  selectKeyword('keyword-wait');
  selectCandidate('candidate-advisor');
  setModule('insights');
})();
