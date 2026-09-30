(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const demo = $('.ta-demo');
  if (!demo) return;

  const navs = $$('.ta-nav', demo);
  const screens = $$('.ta-screen', demo);
  const toast = $('#ta-toast', demo);
  let toastTimer;
  let currentInsight = 'negative';
  let activeDrawerKey = null;

  const comments = {
    'insight-positive': [
      {source:'Survey · Retail location 114', sentiment:'positive', text:'The advisor was patient, explained everything clearly and made the visit easy.', tags:['helpful','staff','explanation']},
      {source:'Google Review · Service', sentiment:'positive', text:'Friendly team and very clear communication from start to finish.', tags:['friendly','service']},
      {source:'Survey · Digital follow up', sentiment:'neutral', text:'The service was good. I mainly appreciated that the next steps were clear.', tags:['clarity','service']}
    ],
    'insight-neutral': [
      {source:'Survey · Appointment', sentiment:'neutral', text:'Booking online was straightforward. I still called to confirm the time.', tags:['booking','digital']},
      {source:'Review · Appointment', sentiment:'positive', text:'The online booking flow was quick and I got the time I wanted.', tags:['booking','easy']},
      {source:'Survey · Appointment', sentiment:'negative', text:'I booked online but the confirmation was not clear, so I called anyway.', tags:['booking','confirmation']}
    ],
    'insight-negative': [
      {source:'Survey · Service visit', sentiment:'negative', text:'The staff were helpful, but the wait was much longer than expected.', tags:['wait','staff']},
      {source:'Review · Location 208', sentiment:'negative', text:'I had an appointment and still waited almost an hour before anyone could help.', tags:['wait','appointment']},
      {source:'Contact centre email', sentiment:'neutral', text:'The visit itself was fine. The main issue was not knowing how long the delay would be.', tags:['wait','communication']}
    ],
    'topic-service': [
      {source:'Survey · Service', sentiment:'positive', text:'The team was friendly and took time to explain the options.', tags:['service experience','staff friendliness']},
      {source:'Review · Service', sentiment:'positive', text:'Helpful staff and a smooth experience overall.', tags:['service experience','helpful']},
      {source:'Survey · Service', sentiment:'neutral', text:'Everything was handled correctly, though the process felt a little rushed.', tags:['service experience']}
    ],
    'topic-appointment': [
      {source:'Survey · Appointment', sentiment:'negative', text:'I arrived on time but waited far longer than the appointment window.', tags:['appointment','wait time']},
      {source:'Review · Appointment', sentiment:'negative', text:'The booking was easy. The wait once I arrived was not.', tags:['appointment','wait']},
      {source:'Survey · Appointment', sentiment:'neutral', text:'The timing was acceptable but communication could have been better.', tags:['appointment','communication']}
    ],
    'topic-quality': [
      {source:'Survey · Product', sentiment:'positive', text:'The product has been reliable and I have not had any issues since purchase.', tags:['product quality','reliability']},
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
    ]
  };

  const insightDetails = {
    positive: {
      title:'Service friendliness improved',
      body:'Positive language around helpful staff and clear explanations increased across service feedback.',
      focus:'Frontline service', owner:'CX Operations', impact:'Retention', action:'Reinforce the behaviours showing the strongest positive customer response.'
    },
    neutral: {
      title:'Appointment scheduling is shifting',
      body:'Digital booking mentions are rising, while customers still use assisted channels when confirmation is unclear.',
      focus:'Booking journey', owner:'Digital Experience', impact:'Convenience', action:'Improve confirmation clarity and track channel switching after booking.'
    },
    negative: {
      title:'Wait time complaints increased',
      body:'Negative wait time mentions are concentrated in a smaller set of locations and peak periods.',
      focus:'Capacity and communication', owner:'Operations', impact:'Satisfaction', action:'Investigate peak period staffing and provide clearer delay expectations.'
    }
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function setModule(name, announce = false) {
    navs.forEach(n => {
      const active = n.dataset.module === name;
      n.classList.toggle('active', active);
      n.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === name));
    if (announce) {
      const label = navs.find(n => n.dataset.module === name)?.dataset.label || name;
      showToast(`${label} opened`);
    }
  }

  navs.forEach(n => n.addEventListener('click', () => setModule(n.dataset.module, true)));

  // Shared reporting context
  $$('.ta-context select', demo).forEach(sel => sel.addEventListener('change', () => {
    const period = $('#ta-period', demo)?.value || 'Last 90 days';
    const hierarchy = $('#ta-hierarchy', demo)?.value || 'All';
    const source = $('#ta-source', demo)?.value || 'All feedback';
    const note = $('.ta-context-note', demo);
    if (note) note.textContent = `${period} · ${hierarchy} · ${source}`;
    showToast('Reporting context updated');
  }));

  // AI Insights
  const detailTitle = $('#ta-detail-title', demo);
  const detailBody = $('#ta-detail-body', demo);
  const detailFocus = $('#ta-detail-focus', demo);
  const detailOwner = $('#ta-detail-owner', demo);
  const detailImpact = $('#ta-detail-impact', demo);
  const detailAction = $('#ta-detail-action', demo);

  function selectInsight(type) {
    currentInsight = type;
    $$('.ta-insight', demo).forEach(c => c.classList.toggle('selected', c.dataset.insight === type));
    const d = insightDetails[type];
    if (!d) return;
    detailTitle.textContent = d.title;
    detailBody.textContent = d.body;
    detailFocus.textContent = d.focus;
    detailOwner.textContent = d.owner;
    detailImpact.textContent = d.impact;
    detailAction.textContent = d.action;
  }
  $$('.ta-insight', demo).forEach(card => card.addEventListener('click', () => selectInsight(card.dataset.insight)));

  // Topic search
  const topicSearch = $('#ta-topic-search', demo);
  topicSearch?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $$('.ta-topic-row', demo).forEach(row => row.classList.toggle('ta-row-hidden', q && !row.textContent.toLowerCase().includes(q)));
  });

  // Keyword sentiment filter
  $$('.ta-keyword-filter', demo).forEach(btn => btn.addEventListener('click', () => {
    $$('.ta-keyword-filter', demo).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.ta-keyword-row', demo).forEach(row => {
      row.classList.toggle('ta-row-hidden', filter !== 'all' && row.dataset.dominant !== filter);
    });
  }));

  // Evidence drawer
  const overlay = $('#ta-drawer-overlay', demo);
  const drawerTitle = $('#ta-drawer-title', demo);
  const drawerMeta = $('#ta-drawer-meta', demo);
  const commentList = $('#ta-comment-list', demo);

  const drawerLabels = {
    'insight-positive':['Service friendliness improved','Comments supporting this AI insight'],
    'insight-neutral':['Appointment scheduling is shifting','Comments supporting this AI insight'],
    'insight-negative':['Wait time complaints increased','Comments supporting this AI insight'],
    'topic-service':['Service Experience › Staff friendliness','Comments matching the selected topic and subtopic'],
    'topic-appointment':['Appointment › Wait time','Comments matching the selected topic and subtopic'],
    'topic-quality':['Product Quality › Reliability','Comments matching the selected topic and subtopic'],
    'keyword-wait':['Keyword: wait','Customer comments containing or associated with this keyword'],
    'keyword-helpful':['Keyword: helpful','Customer comments containing or associated with this keyword'],
    'keyword-booking':['Keyword: booking','Customer comments containing or associated with this keyword']
  };

  function renderComments(filter = 'all') {
    const rows = comments[activeDrawerKey] || [];
    const visible = filter === 'all' ? rows : rows.filter(c => c.sentiment === filter);
    commentList.innerHTML = visible.length ? visible.map(c => `
      <article class="ta-comment">
        <div class="ta-comment-top"><span class="ta-comment-source">${c.source}</span><span class="ta-comment-sentiment ${c.sentiment}">${c.sentiment}</span></div>
        <p>“${c.text}”</p>
        <div class="ta-comment-tags">${c.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </article>`).join('') : '<div class="ta-comment"><p>No comments match this sentiment filter in the demo data.</p></div>';
  }

  function openDrawer(key) {
    activeDrawerKey = key;
    const label = drawerLabels[key] || ['Customer comments','Supporting evidence'];
    drawerTitle.textContent = label[0];
    drawerMeta.textContent = label[1];
    $$('.ta-drawer-filter', demo).forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
    renderComments('all');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  $('#ta-evidence-btn', demo)?.addEventListener('click', () => openDrawer(`insight-${currentInsight}`));
  $$('.ta-row[data-drawer]', demo).forEach(row => row.addEventListener('click', () => openDrawer(row.dataset.drawer)));
  $('#ta-drawer-close', demo)?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeDrawer(); });
  $$('.ta-drawer-filter', demo).forEach(btn => btn.addEventListener('click', () => {
    $$('.ta-drawer-filter', demo).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderComments(btn.dataset.filter);
  }));

  // Theme Discovery actions
  $$('.ta-actions button', demo).forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.ta-candidate');
    const action = btn.dataset.action;
    const title = $('h4', card)?.textContent || 'Candidate';
    const status = $('.ta-status', card);
    const labels = {approve:'Approved', merge:'Merged', reject:'Rejected', suppress:'Suppressed'};
    status.textContent = labels[action] || 'Reviewed';
    card.classList.add('reviewed');
    $$('.ta-actions button', card).forEach(b => b.disabled = true);
    showToast(`${title}: ${labels[action]}`);
  }));

  // Guided walkthrough
  const tour = $('#ta-tour', demo);
  const tourStep = $('#ta-tour-step', demo);
  const tourTitle = $('#ta-tour-title', demo);
  const tourBody = $('#ta-tour-body', demo);
  const tourDots = $('#ta-tour-dots', demo);
  const tourPrev = $('#ta-tour-prev', demo);
  const tourNext = $('#ta-tour-next', demo);
  let tourIndex = 0;
  const tourSteps = [
    {module:'insights', title:'Start with AI synthesis', body:'Leaders see three prioritized insights instead of another dense report. Click an insight, then open the customer evidence behind it.'},
    {module:'topics', title:'Move into known topics', body:'Analysts compare approved topics and subtopics using sentiment, NPS and change over time. Click any row to drill into the supporting comments.'},
    {module:'keywords', title:'Inspect the customer language', body:'Keyword Explorer keeps raw language separate from taxonomy. Try the sentiment filters, then click a keyword to inspect verbatim evidence.'},
    {module:'themes', title:'Govern what AI discovers', body:'AI can surface emerging candidates, but taxonomy changes remain human controlled. Try an Approve, Merge, Reject or Suppress action in this demo.'}
  ];

  function renderTour() {
    const step = tourSteps[tourIndex];
    setModule(step.module);
    tourStep.textContent = `Walkthrough ${tourIndex + 1} of ${tourSteps.length}`;
    tourTitle.textContent = step.title;
    tourBody.textContent = step.body;
    tourPrev.style.visibility = tourIndex === 0 ? 'hidden' : 'visible';
    tourNext.textContent = tourIndex === tourSteps.length - 1 ? 'Finish' : 'Next';
    tourDots.innerHTML = tourSteps.map((_, i) => `<i class="${i === tourIndex ? 'active' : ''}"></i>`).join('');
  }
  function openTour() { tourIndex = 0; tour.classList.add('open'); renderTour(); }
  function closeTour() { tour.classList.remove('open'); }
  $('#ta-tour-start', demo)?.addEventListener('click', openTour);
  $('#ta-tour-close', demo)?.addEventListener('click', closeTour);
  tourPrev?.addEventListener('click', () => { if (tourIndex > 0) { tourIndex--; renderTour(); } });
  tourNext?.addEventListener('click', () => {
    if (tourIndex < tourSteps.length - 1) { tourIndex++; renderTour(); }
    else { closeTour(); showToast('Walkthrough complete'); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closeTour(); }
  });

  selectInsight('negative');
  setModule('insights');
})();
