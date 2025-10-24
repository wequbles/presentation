/* Externalized JS: theme, navigation, tooltip, progress, demo autoplay, accessibility, feedback */
(function(){
  const $ = (q,ctx=document)=>ctx.querySelector(q);
  const $$ = (q,ctx=document)=>Array.from((ctx||document).querySelectorAll(q));

  // Theme init and toggle
  function initTheme(){
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = '';
    if(stored === 'dark' || (!stored && prefersDark)) theme = 'dark';
    if(theme === 'dark'){ root.setAttribute('data-theme','dark'); $('#themeToggle')?.setAttribute('aria-pressed','true'); $('#themeLabel') && ($('#themeLabel').textContent='Тёмная'); }
    else { root.removeAttribute('data-theme'); $('#themeToggle')?.setAttribute('aria-pressed','false'); $('#themeLabel') && ($('#themeLabel').textContent='Светлая'); }
  }
  initTheme();
  $('#themeToggle')?.addEventListener('click', ()=>{
    const root = document.documentElement; const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){ root.removeAttribute('data-theme'); localStorage.setItem('theme','light'); $('#themeToggle').setAttribute('aria-pressed','false'); $('#themeLabel').textContent='Светлая'; }
    else { root.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); $('#themeToggle').setAttribute('aria-pressed','true'); $('#themeLabel').textContent='Тёмная'; }
    const icon = document.getElementById('themeIcon'); if(icon) icon.setAttribute('d', isDark ? "M12 3a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z");
  });

  // Skip link focus helper
  const skip = document.querySelector('.skip-link');
  if(skip){ skip.addEventListener('click', ()=>{ const main = document.getElementById('main'); if(main) main.focus(); }); }

  // Scenes navigation via [data-next]
  document.querySelectorAll('[data-next]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const sel = btn.getAttribute('data-next'); const dest = document.querySelector(sel); if(dest) dest.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

  // Replay top
  $('#replayTop')?.addEventListener('click', ()=>{ const intro=document.getElementById('intro'); if(intro) intro.scrollIntoView({behavior:'smooth'}); });

  // Hint tooltip
  const hint = $('#hint');
  function showHint(text,target){ if(!hint) return; let rect; if(target instanceof Element) rect = target.getBoundingClientRect(); else rect = {left:0,top:0,right:0,bottom:0,width:0,height:0}; hint.textContent = text; hint.style.opacity='1'; hint.setAttribute('aria-hidden','false'); requestAnimationFrame(()=>{ const hRect = hint.getBoundingClientRect(); const vw=window.innerWidth, vh=window.innerHeight; const spaceAbove = rect.top; const spaceBelow = vh-rect.bottom; let placement='top'; if(spaceBelow>hRect.height+16) placement='bottom'; else if(spaceAbove>hRect.height+16) placement='top'; let left=0, top=0; if(placement==='top'){ top = rect.top - hRect.height - 12; left = rect.left + rect.width/2 - hRect.width/2 } else { top = rect.bottom + 12; left = rect.left + rect.width/2 - hRect.width/2 } const margin=8; if(left<margin) left=margin; if(left + hRect.width > vw - margin) left = vw - hRect.width - margin; if(top<margin) top=margin; if(top + hRect.height > vh - margin) top = vh - hRect.height - margin; hint.style.left = Math.round(left)+'px'; hint.style.top = Math.round(top)+'px'; hint.setAttribute('data-placement',placement); hint.style.transform='translateY(0)'; }); }
  function hideHint(){ if(!hint) return; hint.style.opacity='0'; hint.setAttribute('aria-hidden','true'); }

  // Build chat list safely
  const chats = [
    {name:'Алиса',last:'Присылаю фото',id:'c1'},
    {name:'Бизнес',last:'Новое обновление',id:'c2'},
    {name:'Дизайн',last:'Может сделаем так?',id:'c3'},
    {name:'Паблик',last:'Сегодня в 19:00',id:'c4'},
    {name:'Ксюша',last:'😂😂😂',id:'c5'}
  ];
  const chatList = $('#chatList');
  chats.forEach(c=>{
    const el = document.createElement('div'); el.className='chat-item'; el.setAttribute('role','listitem'); el.setAttribute('tabindex','0'); el.dataset.hint='Минимализм без навязчивости — интерфейс исчезает, чтобы не мешать содержанию.';
    const av = document.createElement('div'); av.className='avatar'; av.textContent = c.name.slice(0,2);
    const meta = document.createElement('div'); meta.className='chat-meta'; const title = document.createElement('div'); title.className='chat-name'; title.textContent = c.name; const last = document.createElement('div'); last.className='chat-last'; last.textContent = c.last; meta.appendChild(title); meta.appendChild(last); el.appendChild(av); el.appendChild(meta);
    el.addEventListener('mouseenter', ()=> showHint(el.dataset.hint,el)); el.addEventListener('mouseleave', hideHint);
    el.addEventListener('click', ()=>{ const chatSection=document.getElementById('chat'); if(chatSection) chatSection.scrollIntoView({behavior:'smooth',block:'center'}); populateMessages(c); });
    el.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); el.click(); } });
    chatList.appendChild(el);
  });

  // Messages
  function populateMessages(chat){
    const msgs = [
      {who:'them',text:'Привет! Как дела? 😊',note:'Интерфейс не диктует — он слушает.'},
      {who:'me',text:'Всё отлично, работаю над проектом.',note:'Самоуничтожение — форма эфемерности.'},
      {who:'them',text:'Отправляю стикер',note:'Стикеры — эмоциональный язык.'},
      {who:'me',text:'Фото ниже',note:'Удалить для всех — власть над временем.'}
    ];
    const container = $('#messages'); container.innerHTML='';
    msgs.forEach(m=>{
      const d = document.createElement('div'); d.className='msg '+(m.who==='me'?'me':'them')+' small'; d.textContent = m.text; d.dataset.note = m.note; d.setAttribute('tabindex','0');
      d.addEventListener('mouseenter', ()=> showHint(d.dataset.note, d)); d.addEventListener('mouseleave', hideHint);
      d.addEventListener('click', ()=>{ showHint(d.dataset.note, d); setTimeout(hideHint,3000); });
      d.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); d.click(); } });
      container.appendChild(d);
    });
    setTimeout(()=> container.scrollTop = container.scrollHeight,120);
  }

  // Settings modal
  $('#openSettings')?.addEventListener('click', ()=>{ $('#modalBackdrop').style.display='flex'; $('#modalBackdrop').setAttribute('aria-hidden','false'); $('#modalBackdrop .modal').focus(); });
  $('#closeModal')?.addEventListener('click', closeModal);
  $('#modalBackdrop')?.addEventListener('click', (e)=>{ if(e.target === $('#modalBackdrop')) closeModal(); });
  function closeModal(){ $('#modalBackdrop').style.display='none'; $('#modalBackdrop').setAttribute('aria-hidden','true'); }
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ if($('#modalBackdrop').style.display==='flex') closeModal(); if($('#zenBox')?.classList.contains('visible')) $('#exitZen')?.click(); } });

  // Channels grid with responsive srcset
  const posts = [
    {title:'Утренний дайджест',seed:1},
    {title:'Дизайн-мышление',seed:2},
    {title:'Технологии',seed:3},
    {title:'Философия общения',seed:4}
  ];
  const grid = $('#channelGrid');
  posts.forEach(p=>{
    const c = document.createElement('div'); c.className='post'; c.setAttribute('tabindex','0');
    const t = document.createElement('div'); t.style.fontWeight='700'; t.textContent = p.title;
    const img = document.createElement('img');
    const base = 'https://picsum.photos/seed/'+p.seed+'/';
    img.src = base + '400/300';
    img.srcset = base+'800/600 800w, '+base+'400/300 400w, '+base+'240/180 240w';
    img.sizes = '(max-width:600px) 100vw, 33vw';
    img.alt = p.title; img.loading = 'lazy';
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = 'Контент как посредник общения';
    const btnWrap = document.createElement('div'); btnWrap.style.marginTop = '6px';
    const openBtn = document.createElement('button'); openBtn.className='openPost btn ghost'; openBtn.type='button'; openBtn.textContent='Открыть';
    openBtn.addEventListener('click', ()=> alert(p.title + '\n\n"Здесь нет сцены — только поток."'));
    openBtn.addEventListener('mouseenter', ()=> showHint('Контент не цель — он посредник общения.', c));
    openBtn.addEventListener('mouseleave', hideHint);
    btnWrap.appendChild(openBtn);

    c.appendChild(t); c.appendChild(img); c.appendChild(meta); c.appendChild(btnWrap);
    c.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openBtn.click(); } });
    grid.appendChild(c);
  });

  // Hide hint on outside click
  document.addEventListener('click', (e)=>{ if(!e.target.closest('.chat-item') && !e.target.closest('.msg') && !e.target.closest('.post') && !e.target.closest('.openPost')) hideHint(); });

  // Keyboard focus ring
  document.addEventListener('keydown', e=>{ if(e.key==='Tab') document.body.classList.add('show-focus'); });

  // Progress bar for reading
  const scenes = Array.from(document.querySelectorAll('main .scene'));
  const progressBar = document.getElementById('progressBar');
  function updateProgress(){
    const main = document.getElementById('main');
    const mainTop = main.getBoundingClientRect().top + window.pageYOffset;
    const mainHeight = main.getBoundingClientRect().height;
    const scrolled = Math.min(Math.max((window.pageYOffset - mainTop) / mainHeight, 0), 1);
    if(progressBar) progressBar.style.width = (scrolled*100)+'%';

    scenes.forEach(s=>{
      const btn = document.querySelector('[data-scene="'+s.id+'"]');
      if(!btn) return;
      const rect = s.getBoundingClientRect();
      if(rect.top <= window.innerHeight*0.45 && rect.bottom >= window.innerHeight*0.45) btn.setAttribute('aria-current','true'); else btn.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateProgress, {passive:true}); window.addEventListener('resize', updateProgress);
  setTimeout(updateProgress,200);

  // Table of contents
  const toc = document.getElementById('toc');
  if(toc){ scenes.forEach(s=>{
    const btn = document.createElement('button'); btn.textContent = s.querySelector('h2') ? s.querySelector('h2').textContent : s.id; btn.setAttribute('data-scene', s.id); btn.addEventListener('click', ()=> s.scrollIntoView({behavior:'smooth',block:'center'})); toc.appendChild(btn);
  }); }

  // Demo autoplay (auto-scroll through scenes)
  let autoplay = false; let autoplayTimer = null; const autoplayToggle = document.getElementById('autoplayToggle');
  function startAutoplay(){ autoplay = true; autoplayToggle?.setAttribute('aria-pressed','true'); autoplayToggle.textContent='Демо (вкл)'; let i=0; autoplayTimer = setInterval(()=>{ const s = scenes[i % scenes.length]; s.scrollIntoView({behavior:'smooth',block:'center'}); i++; }, 3000); }
  function stopAutoplay(){ autoplay = false; autoplayToggle?.setAttribute('aria-pressed','false'); autoplayToggle.textContent='Демо'; clearInterval(autoplayTimer); autoplayTimer = null; }
  autoplayToggle?.addEventListener('click', ()=>{ if(autoplay) stopAutoplay(); else startAutoplay(); });

  // Zen mode
  $('#zenBtn')?.addEventListener('click', ()=>{ $('#zenBox')?.classList.add('visible'); $('#zenBox')?.setAttribute('aria-hidden','false'); document.querySelectorAll('main > section:not(#zenMode)').forEach(s=>s.style.opacity='0.08'); const z = document.getElementById('zenMode'); if(z) z.scrollIntoView({behavior:'smooth',block:'center'}); });
  $('#exitZen')?.addEventListener('click', ()=>{ $('#zenBox')?.classList.remove('visible'); $('#zenBox')?.setAttribute('aria-hidden','true'); document.querySelectorAll('main > section').forEach(s=>s.style.opacity='1'); const intro = document.getElementById('intro'); if(intro) intro.scrollIntoView({behavior:'smooth'}); });

  // Feedback form handling (mocked)
  const feedbackForm = document.getElementById('feedbackForm');
  if(feedbackForm){ feedbackForm.addEventListener('submit', (e)=>{ e.preventDefault(); const text = document.getElementById('feedbackText').value.trim(); const notice = document.getElementById('feedbackNotice'); if(!text){ notice.textContent = 'Пожалуйста, напишите отзыв.'; return; } notice.textContent = 'Спасибо! Ваш отзыв принят.'; document.getElementById('feedbackText').value=''; setTimeout(()=> notice.textContent='';,4000); });
    document.getElementById('clearFeedback')?.addEventListener('click', ()=>{ document.getElementById('feedbackText').value=''; document.getElementById('feedbackNotice').textContent=''; }); }

  // Initial scroll to top of intro
  const intro = document.getElementById('intro'); if(intro) intro.scrollIntoView();
})();
