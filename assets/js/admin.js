'use strict';
/* Dent Plus admin panel. Talks only to /api/admin (same origin, HttpOnly session cookie). */

/* ---------- clinic reference data (English, for staff) ---------- */
const SERVICES = [
  ['implants','Dental Implants','dental'],['rct','Root Canal Treatment','dental'],['dentures','Dentures & Fixed Teeth','dental'],
  ['extraction','Painless Extractions','dental'],['gum','Laser Gum Treatment','dental'],['ortho','Braces & Invisalign','dental'],
  ['kids','Children’s Dentistry','dental'],['eye','Eye Care','family'],['vaccines','Vaccinations','family'],['general','General Medicine','family'],
  ['women','Women’s Health & Pregnancy','family'],['child','Child Health','family'],['cancer','Cancer Screening & HPV Vaccine','family']
];
const DOCTORS = {
  pk:{name:'Dr. G. Phani Krishna', cat:'dental', svc:['implants','dentures','rct','extraction','gum','ortho','kids']},
  bd:{name:'Dr. B. Deepthi', cat:'dental', svc:['implants','dentures','rct','extraction','gum','ortho','kids']},
  vg:{name:'Dr. G. Venu Gopal Rao', cat:'family', svc:['general','child','vaccines']},
  pr:{name:'Dr. T. Padmaja Rani', cat:'family', svc:['eye','women','cancer','vaccines']}
};
const DOC_TE = {pk:'డా. జి. ఫణి కృష్ణ', bd:'డా. బి. దీప్తి', vg:'డా. జి. వేణు గోపాల రావు', pr:'డా. టి. పద్మజ రాణి'};
const DOC_HI = {pk:'डॉ. जी. फणि कृष्णा', bd:'डॉ. बी. दीप्ति', vg:'डॉ. जी. वेणु गोपाल राव', pr:'डॉ. टी. पद्मजा रानी'};
const LOCS = {ashok:'Ashok Nagar Clinic', thota:'Gunturvari Thota Clinic'};
const LOCS_TE = {ashok:'అశోక్ నగర్ క్లినిక్', thota:'గుంటూరువారితోట క్లినిక్'};
const LOCS_HI = {ashok:'अशोक नगर क्लिनिक', thota:'गुंटूरवारी थोटा क्लिनिक'};
const STATUS = {pending:'Pending', confirmed:'Confirmed', done:'Completed', cancelled:'Cancelled', no_show:'No-show'};
const SESSIONS = [[540,840],[960,1260]];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic = id => `<svg class="i"><use href="#${id}"/></svg>`;
const fmtTime = m => { const h = Math.floor(m/60); return `${((h+11)%12)+1}:${String(m%60).padStart(2,'0')} ${h<12?'AM':'PM'}`; };
const allSlots = () => { const o=[]; for (const [a,b] of SESSIONS) for (let m=a;m<b;m+=30) o.push(m); return o; };
const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0,10); };
const dateObj = d => new Date(d + 'T06:00:00Z');
const fmtDate = (d, lang='en', o={weekday:'short', day:'numeric', month:'short'}) => dateObj(d).toLocaleDateString({en:'en-IN',te:'te-IN',hi:'hi-IN'}[lang] || 'en-IN', Object.assign({timeZone:'Asia/Kolkata'}, o));
function toast(msg, bad){ const t = $('#toast'); t.textContent = msg; t.className = 'toast on' + (bad ? ' bad' : ''); clearTimeout(toast.h); toast.h = setTimeout(() => t.className = 'toast', 3200); }
const svcName = id => { if (id === 'checkup') return 'General check-up'; if (id && id.startsWith('pkg:')) { const p = (S.packages||[]).find(x => x.id === id.slice(4)); return 'Package: ' + (p ? p.name.en : id.slice(4)); } const s = SERVICES.find(x => x[0] === id); return s ? s[1] : id; };

let S = {today:'', settings:null, packages:null, blocks:[], appts:[], stats:[]};
let qrKind = 'review';

async function api(a, body){
  const opt = body === undefined ? {credentials:'same-origin'} : {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)};
  let r;
  try { r = await fetch('/api/admin?a=' + a, opt); } catch(_) { throw new Error('Network error, please check your internet connection.'); }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && a !== 'login'){ showLogin(); throw new Error('Session expired. Please sign in again.'); }
  if (!r.ok) throw new Error(j.error || 'Something went wrong (' + r.status + ')');
  return j;
}

/* ---------- auth ---------- */
function showLogin(msg){ $('#app').hidden = true; $('#login').hidden = false; $('#loginErr').textContent = msg || ''; setTimeout(() => $('#pw').focus(), 50); }
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const b = $('#loginBtn'); b.disabled = true; b.textContent = 'Signing in…'; $('#loginErr').textContent = '';
  try { await api('login', {password:$('#pw').value}); $('#pw').value = ''; await load(); }
  catch(err){ $('#loginErr').textContent = err.message; }
  b.disabled = false; b.textContent = 'Sign in';
});
$('#logout').addEventListener('click', async () => { try { await api('logout', {}); } catch(_){} showLogin(); });
$('#reload').addEventListener('click', () => load().then(() => toast('Updated')));

async function load(){
  const today = new Date().toLocaleDateString('en-CA', {timeZone:'Asia/Kolkata'});
  const j = await api(`data&from=${addDays(today,-30)}&to=${addDays(today,31)}`);
  S = j; S.packages = j.packages; S.appts.sort((a,b) => (a.date + String(a.time).padStart(4,'0')).localeCompare(b.date + String(b.time).padStart(4,'0')));
  $('#login').hidden = true; $('#app').hidden = false;
  renderAll();
}
function renderAll(){ renderDash(); renderAppts(); renderPkgs(); renderSettings(); renderLeave(); renderQr();
  const pend = S.appts.filter(a => a.status === 'pending' && a.date >= S.today).length;
  $('#pendBadge').hidden = !pend; $('#pendBadge').textContent = pend; }

/* ---------- tabs ---------- */
function goTab(id){
  $$('.tabs-v [role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
  $$('.pane').forEach(p => p.hidden = p.id !== 'p-' + id);
  $('#main').scrollTop = 0; window.scrollTo(0,0);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-tab]'); if (t && t.closest('.tabs-v')) goTab(t.dataset.tab);
  const g = e.target.closest('[data-goto]'); if (g){ goTab(g.dataset.goto); if ('new' in g.dataset) openApptForm(); }
});

/* ---------- dashboard ---------- */
function renderDash(){
  const h = +new Date().toLocaleString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hour12:false});
  $('#greet').textContent = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  $('#todayLbl').textContent = fmtDate(S.today, 'en', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const active = a => !['cancelled','no_show'].includes(a.status);
  const todays = S.appts.filter(a => a.date === S.today && active(a));
  const pending = S.appts.filter(a => a.status === 'pending' && a.date >= S.today);
  const week = S.appts.filter(a => a.date >= S.today && a.date <= addDays(S.today,6) && active(a));
  const sum = k => S.stats.reduce((n,d) => n + (+d[k] || 0), 0);
  const k = [
    ['Today’s appointments', todays.length, 'i-cal', ''], ['Waiting for confirmation', pending.length, 'i-bell', pending.length ? 'warn' : ''],
    ['Next 7 days', week.length, 'i-clock', ''], ['Website bookings (30 days)', sum('book_done'), 'i-award', 'good']
  ];
  $('#kpis').innerHTML = k.map(([l,v,i,c]) => `<div class="kpi ${c}"><span class="ki">${ic(i)}</span><b>${v}</b><span>${l}</span></div>`).join('');
  $('#todayList').innerHTML = todays.length ? todays.map(a => `<div class="tl"><b>${fmtTime(a.time)}</b><div><strong>${esc(a.name)}</strong><span>${esc(svcName(a.svc))} · ${esc(DOCTORS[a.doc]?.name || '')}</span></div><span class="st st-${a.status}">${STATUS[a.status]}</span></div>`).join('')
    : `<p class="empty-s">No appointments today yet.</p>`;
  const last = S.stats.slice(-14); const max = Math.max(1, ...last.map(d => +d.view || 0));
  $('#chart').innerHTML = last.map(d => { const v = +d.view || 0, b = +d.book_done || 0;
    return `<div class="bar" title="${fmtDate(d.date)}: ${v} visits, ${b} bookings"><div class="bv" style="height:${Math.round(v/max*100)}%"><span class="bb" style="height:${v ? Math.min(100, Math.round(b/Math.max(v,1)*100)) : 0}%"></span></div><small>${dateObj(d.date).getUTCDate()}</small></div>`; }).join('');
  const m = [['Website visits','view'],['Phone calls tapped','call'],['WhatsApp taps','whatsapp'],['Directions opened','directions'],['Bookings started','book_start'],['Bookings completed','book_done'],['Package clicks','package_click'],['Review QR scans','review_scan']];
  $('#mini').innerHTML = m.map(([l,k]) => `<div><b>${sum(k)}</b><span>${l}</span></div>`).join('');
}

/* ---------- appointments ---------- */
function filteredAppts(){
  const r = $('#fRange').value, st = $('#fStatus').value, dp = $('#fDept').value, q = $('#fQ').value.trim().toLowerCase(), T = S.today;
  return S.appts.filter(a => {
    if (r === 'today' && a.date !== T) return false;
    if (r === 'tomorrow' && a.date !== addDays(T,1)) return false;
    if (r === 'week' && (a.date < T || a.date > addDays(T,6))) return false;
    if (r === 'upcoming' && a.date < T) return false;
    if (r === 'past' && a.date >= T) return false;
    if (st && a.status !== st) return false;
    if (dp && a.cat !== dp) return false;
    if (q && ![a.name, a.phone, a.id].join(' ').toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b) => { const k = x => x.date + String(x.time).padStart(4,'0'); return r === 'past' ? k(b).localeCompare(k(a)) : k(a).localeCompare(k(b)); });
}
function renderAppts(){
  const list = filteredAppts();
  if (!list.length){ $('#apptList').innerHTML = `<div class="empty-s card">No appointments match these filters.</div>`; return; }
  let last = '';
  $('#apptList').innerHTML = list.map(a => {
    const head = a.date !== last ? `<h3 class="day-h">${a.date === S.today ? 'Today · ' : a.date === addDays(S.today,1) ? 'Tomorrow · ' : ''}${fmtDate(a.date,'en',{weekday:'long',day:'numeric',month:'long'})}</h3>` : '';
    last = a.date;
    return head + `<article class="ap st-b-${a.status}">
      <div class="ap-t"><b>${fmtTime(a.time)}</b><small>${esc(a.id)}</small></div>
      <div class="ap-p"><strong>${esc(a.name)}${a.age ? `, ${esc(a.age)}` : ''}</strong><a href="tel:+91${esc(a.phone)}">${ic('i-phone')}${esc(a.phone)}</a>${a.note ? `<p class="ap-note">“${esc(a.note)}”</p>` : ''}</div>
      <div class="ap-s"><span>${esc(svcName(a.svc))}</span><small>${esc(DOCTORS[a.doc]?.name || '')}${a.docChosen ? '' : ' (assigned)'} · ${esc(LOCS[a.loc] || '')}</small><small class="muted">${a.source === 'staff' ? 'Added by staff' : 'Website'} · ${{en:'English',te:'Telugu',hi:'Hindi'}[a.lang] || 'English'}</small></div>
      <div class="ap-a">
        <select data-status="${esc(a.id)}" class="st-sel st-${a.status}" aria-label="Status for ${esc(a.name)}">${Object.entries(STATUS).map(([k,v]) => `<option value="${k}" ${a.status===k?'selected':''}>${v}</option>`).join('')}</select>
        <div class="ap-btns">
          <a class="btn btn-sm wa" target="_blank" rel="noopener" data-wa="confirm" data-id="${esc(a.id)}" href="${waPatient(a,'confirm')}">${ic('i-chat')}Confirm</a>
          <a class="btn btn-sm btn-s" target="_blank" rel="noopener" data-wa="remind" data-id="${esc(a.id)}" href="${waPatient(a,'remind')}">${ic('i-bell')}Remind</a>
        </div>
      </div>
    </article>`; }).join('');
}
function waPatient(a, kind){
  const L = ['en','te','hi'].includes(a.lang) ? a.lang : 'en';
  const date = fmtDate(a.date, L, {weekday:'long', day:'numeric', month:'long'});
  const time = L === 'te' ? (a.time < 720 ? 'ఉదయం ' : a.time < 960 ? 'మధ్యాహ్నం ' : a.time < 1140 ? 'సాయంత్రం ' : 'రాత్రి ') + fmtTime(a.time).replace(/ (AM|PM)/,'')
             : L === 'hi' ? (a.time < 720 ? 'सुबह ' : a.time < 960 ? 'दोपहर ' : a.time < 1140 ? 'शाम ' : 'रात ') + fmtTime(a.time).replace(/ (AM|PM)/,'') : fmtTime(a.time);
  const doc = L === 'te' ? DOC_TE[a.doc] : L === 'hi' ? DOC_HI[a.doc] : DOCTORS[a.doc]?.name;
  const loc = L === 'te' ? LOCS_TE[a.loc] : L === 'hi' ? LOCS_HI[a.loc] : LOCS[a.loc];
  const M = {
    confirm:{
      en:`Hello ${a.name}, your appointment at Dent Plus is confirmed for ${date} at ${time} with ${doc} (${loc}). Ref: ${a.id}. Reply here if you need to change it. – Dent Plus, Guntur`,
      te:`నమస్తే ${a.name} గారు, డెంట్ ప్లస్‌లో మీ అపాయింట్‌మెంట్ ${date} ${time}కి ${doc} (${loc}) వద్ద కన్ఫర్మ్ అయింది. రిఫరెన్స్: ${a.id}. మార్పు కావాలంటే ఇక్కడ రిప్లై ఇవ్వండి. – డెంట్ ప్లస్, గుంటూరు`,
      hi:`नमस्ते ${a.name} जी, डेंट प्लस में आपका अपॉइंटमेंट ${date} को ${time} बजे ${doc} (${loc}) के साथ कन्फ़र्म हो गया है। रेफ़रेंस: ${a.id}। बदलाव के लिए यहाँ जवाब दें। – डेंट प्लस, गुंटूर`
    },
    remind:{
      en:`Hello ${a.name}, this is a reminder of your appointment at Dent Plus on ${date} at ${time} (${loc}). Please arrive 10 minutes early. Ref: ${a.id}. – Dent Plus, Guntur`,
      te:`నమస్తే ${a.name} గారు, ${date} ${time}కి డెంట్ ప్లస్ (${loc})లో మీ అపాయింట్‌మెంట్ గుర్తు చేస్తున్నాం. దయచేసి 10 నిమిషాలు ముందుగా రండి. రిఫరెన్స్: ${a.id}. – డెంట్ ప్లస్, గుంటూరు`,
      hi:`नमस्ते ${a.name} जी, याद दिला रहे हैं कि ${date} को ${time} बजे डेंट प्लस (${loc}) में आपका अपॉइंटमेंट है। कृपया 10 मिनट पहले आएँ। रेफ़रेंस: ${a.id}। – डेंट प्लस, गुंटूर`
    }
  };
  return `https://wa.me/91${a.phone}?text=${encodeURIComponent(M[kind][L])}`;
}
['#fRange','#fStatus','#fDept'].forEach(s => $(s).addEventListener('change', renderAppts));
$('#fQ').addEventListener('input', renderAppts);
document.addEventListener('change', async e => {
  const sel = e.target.closest('[data-status]'); if (!sel) return;
  const id = sel.dataset.status, status = sel.value;
  if (status === 'cancelled' && !confirm('Cancel this appointment? The time slot will become free for others to book.')){ renderAppts(); return; }
  try { const j = await api('appt', {id, status}); const i = S.appts.findIndex(a => a.id === id); S.appts[i] = j.appt; renderAll(); toast('Marked as ' + STATUS[status]); }
  catch(err){ toast(err.message, true); renderAppts(); }
});
document.addEventListener('click', async e => {   // tapping "Confirm" on WhatsApp also marks it confirmed
  const w = e.target.closest('[data-wa="confirm"]'); if (!w) return;
  const a = S.appts.find(x => x.id === w.dataset.id);
  if (a && a.status === 'pending'){ try { const j = await api('appt', {id:a.id, status:'confirmed'}); Object.assign(a, j.appt); renderAll(); } catch(_){} }
});
$('#csv').addEventListener('click', () => {
  const rows = [['Ref','Date','Time','Patient','Age','Phone','Service','Doctor','Clinic','Status','Source','Note','Booked at']]
    .concat(filteredAppts().map(a => [a.id, a.date, fmtTime(a.time), a.name, a.age, a.phone, svcName(a.svc), DOCTORS[a.doc]?.name, LOCS[a.loc], STATUS[a.status], a.source, a.note, a.createdAt]));
  const csv = rows.map(r => r.map(v => { let s = String(v == null ? '' : v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g,'""') + '"'; }).join(',')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], {type:'text/csv'})); a.download = `dentplus-appointments-${S.today}.csv`; a.click();
});

/* add appointment (phone / walk-in) */
$('#newAppt').addEventListener('click', openApptForm);
function openApptForm(){
  const pk = (S.packages || []).filter(p => p.active);
  openModal(`<h2 id="mT">Add appointment</h2><p class="muted sm">For phone calls and walk-ins. It is saved as <b>Confirmed</b> and blocks the slot on the website.</p>
  <form id="apF" class="form-g2">
    <div class="fld full"><label for="nSvc">Service</label><select id="nSvc" required><option value="">Choose…</option>
      <optgroup label="Dental">${SERVICES.filter(s=>s[2]==='dental').map(s => `<option value="${s[0]}">${esc(s[1])}</option>`).join('')}</optgroup>
      <optgroup label="Family clinic">${SERVICES.filter(s=>s[2]==='family').map(s => `<option value="${s[0]}">${esc(s[1])}</option>`).join('')}</optgroup>
      ${pk.length ? `<optgroup label="Packages">${pk.map(p => `<option value="pkg:${esc(p.id)}">${esc(p.name.en)}</option>`).join('')}</optgroup>` : ''}
      <option value="checkup">General check-up</option></select></div>
    <div class="fld"><label for="nDoc">Doctor</label><select id="nDoc"><option value="any">Any available</option></select></div>
    <div class="fld"><label for="nLoc">Clinic</label><select id="nLoc">${Object.entries(LOCS).map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
    <div class="fld"><label for="nDate">Date</label><input id="nDate" type="date" required min="${S.today}" max="${addDays(S.today,30)}" value="${S.today}"></div>
    <div class="fld"><label for="nTime">Time</label><select id="nTime" required>${allSlots().map(m => `<option value="${m}">${fmtTime(m)}</option>`).join('')}</select></div>
    <div class="fld"><label for="nName">Patient name</label><input id="nName" required maxlength="60"></div>
    <div class="fld"><label for="nPhone">Mobile</label><input id="nPhone" required inputmode="numeric" maxlength="10" pattern="[6-9][0-9]{9}"></div>
    <div class="fld"><label for="nAge">Age</label><input id="nAge" inputmode="numeric" maxlength="3"></div>
    <div class="fld"><label for="nLang">Patient’s language</label><select id="nLang"><option value="en">English</option><option value="te">Telugu</option><option value="hi">Hindi</option></select></div>
    <div class="fld full"><label for="nNote">Note</label><textarea id="nNote" maxlength="300"></textarea></div>
    <p class="err full" id="nErr" role="alert"></p>
    <div class="mdl-act full"><button type="button" class="btn btn-s btn-sm" data-mclose>Cancel</button><button class="btn btn-p btn-sm" id="nSave">Save appointment</button></div>
  </form>`);
  const sv = $('#nSvc'), dc = $('#nDoc');
  sv.addEventListener('change', () => {
    const v = sv.value; let ids = Object.keys(DOCTORS);
    if (v.startsWith('pkg:')){ const p = S.packages.find(x => x.id === v.slice(4)); ids = ids.filter(d => DOCTORS[d].cat === (p && p.cat)); }
    else if (v && v !== 'checkup') ids = ids.filter(d => DOCTORS[d].svc.includes(v));
    dc.innerHTML = `<option value="any">Any available</option>` + ids.map(d => `<option value="${d}">${DOCTORS[d].name}</option>`).join('');
  });
  $('#apF').addEventListener('submit', async e => {
    e.preventDefault(); const b = $('#nSave'); b.disabled = true; $('#nErr').textContent = '';
    try {
      const j = await api('create', {svc:sv.value, doc:dc.value, loc:$('#nLoc').value, date:$('#nDate').value, time:+$('#nTime').value,
        name:$('#nName').value, phone:$('#nPhone').value, age:$('#nAge').value, lang:$('#nLang').value, note:$('#nNote').value});
      S.appts.push(j.appt); S.appts.sort((a,b) => (a.date + String(a.time).padStart(4,'0')).localeCompare(b.date + String(b.time).padStart(4,'0')));
      closeModal(); renderAll(); toast('Appointment saved · ' + j.appt.id);
    } catch(err){ $('#nErr').textContent = err.message; }
    b.disabled = false;
  });
}

/* ---------- packages ---------- */
let P = [];
function renderPkgs(){
  P = JSON.parse(JSON.stringify(S.packages || []));
  drawPkgs();
}
function drawPkgs(){
  if (!P.length){
    $('#pkgList').innerHTML = `<div class="card empty-s">No packages saved yet. The website is showing the 4 starter packages with “Ask for price”.<br><br>
      <button class="btn btn-p btn-sm" id="loadDef">Load starter packages to edit</button></div>`;
    $('#loadDef').addEventListener('click', () => { P = JSON.parse(JSON.stringify(window.DP_DEFAULT_PACKAGES || [])); drawPkgs(); toast('Starter packages loaded. Add prices, then Save.'); });
    return;
  }
  const join = a => (a || []).join('\n');
  $('#pkgList').innerHTML = P.map((p,i) => `<div class="card pkc" data-i="${i}">
    <div class="card-h"><h2>${esc(p.name.en || 'New package')}</h2>
      <div class="pkc-a"><label class="switch"><input type="checkbox" data-f="active" ${p.active!==false?'checked':''}><span></span><b>${p.active!==false?'Shown':'Hidden'}</b></label>
      <button class="ib" data-mv="-1" aria-label="Move up" ${i?'':'disabled'}>${ic('i-up')}</button><button class="ib" data-mv="1" aria-label="Move down" ${i<P.length-1?'':'disabled'}>${ic('i-down')}</button>
      <button class="ib del" data-del aria-label="Delete package">${ic('i-trash')}</button></div></div>
    <div class="form-g4">
      <div class="fld"><label>Department</label><select data-f="cat"><option value="dental" ${p.cat==='dental'?'selected':''}>Dental</option><option value="family" ${p.cat==='family'?'selected':''}>Family clinic</option></select></div>
      <div class="fld"><label>Price (₹)</label><input data-f="price" inputmode="numeric" value="${p.price ?? ''}" placeholder="Empty = Ask for price"></div>
      <div class="fld"><label>Original price (₹) <span class="muted">optional</span></label><input data-f="mrp" inputmode="numeric" value="${p.mrp ?? ''}" placeholder="Shows a discount"></div>
      <div class="fld"><label>Short ID</label><input data-f="id" value="${esc(p.id)}" maxlength="30"></div>
    </div>
    <div class="form-g3">
      <div class="fld"><label>Name (English)</label><input data-f="name.en" value="${esc(p.name.en)}" maxlength="60"></div>
      <div class="fld"><label>Name (Telugu)</label><input data-f="name.te" value="${esc(p.name.te)}" maxlength="60" lang="te"></div>
      <div class="fld"><label>Name (Hindi)</label><input data-f="name.hi" value="${esc(p.name.hi)}" maxlength="60" lang="hi"></div>
      <div class="fld"><label>What’s included, English <span class="muted">one per line</span></label><textarea data-f="items.en" rows="5">${esc(join(p.items?.en))}</textarea></div>
      <div class="fld"><label>Included (Telugu)</label><textarea data-f="items.te" rows="5" lang="te">${esc(join(p.items?.te))}</textarea></div>
      <div class="fld"><label>Included (Hindi)</label><textarea data-f="items.hi" rows="5" lang="hi">${esc(join(p.items?.hi))}</textarea></div>
    </div></div>`).join('');
}
$('#pkgList').addEventListener('input', e => {
  const f = e.target.dataset.f; if (!f) return; const card = e.target.closest('[data-i]'); const p = P[+card.dataset.i];
  const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  if (f === 'active'){ p.active = v; e.target.parentElement.querySelector('b').textContent = v ? 'Shown' : 'Hidden'; return; }
  if (f.includes('.')){ const [a,b] = f.split('.'); p[a] = p[a] || {}; p[a][b] = a === 'items' ? v.split('\n') : v; if (f === 'name.en') card.querySelector('h2').textContent = v || 'New package'; }
  else p[f] = v;
});
$('#pkgList').addEventListener('change', e => { if (e.target.dataset.f === 'cat') P[+e.target.closest('[data-i]').dataset.i].cat = e.target.value; });
$('#pkgList').addEventListener('click', e => {
  const card = e.target.closest('[data-i]'); if (!card) return; const i = +card.dataset.i;
  if (e.target.closest('[data-del]')){ if (confirm('Delete “' + (P[i].name.en || 'this package') + '”? Click Save packages afterwards.')){ P.splice(i,1); drawPkgs(); } }
  const mv = e.target.closest('[data-mv]'); if (mv){ const j = i + +mv.dataset.mv; [P[i], P[j]] = [P[j], P[i]]; drawPkgs(); }
});
$('#addPkg').addEventListener('click', () => { P.push({id:'package-' + (P.length+1), cat:'dental', active:true, price:null, mrp:null, name:{en:'',te:'',hi:''}, items:{en:[],te:[],hi:[]}}); drawPkgs(); $('#pkgList .pkc:last-child [data-f="name.en"]').focus(); });
$('#savePkgs').addEventListener('click', async () => {
  try { const j = await api('packages', {packages:P}); S.packages = j.packages; renderPkgs(); toast('Packages saved. The website updates in about 30 seconds.'); }
  catch(err){ toast(err.message, true); }
});

/* ---------- announcement & settings ---------- */
function renderSettings(){
  const s = S.settings, a = s.announcement;
  $('#aOn').checked = !!a.on; $('#aOnLbl').textContent = a.on ? 'On' : 'Off';
  $('#aEn').value = a.text.en || ''; $('#aTe').value = a.text.te || ''; $('#aHi').value = a.text.hi || '';
  $('#aStyle').value = a.style || 'info'; $('#aLink').value = a.link || '';
  $('#sReview').value = s.reviewUrl || ''; $('#sWaD').value = s.whatsapp.dental || ''; $('#sWaF').value = s.whatsapp.family || '';
  annPrev();
}
function annPrev(){
  const st = $('#aStyle').value, txt = $('#aEn').value.trim();
  $('#aOnLbl').textContent = $('#aOn').checked ? 'On' : 'Off';
  $('#aPrev').innerHTML = txt ? `<div class="annc annc-${st}" style="border-radius:12px"><div class="wrap" style="padding:10px 16px"><span class="annc-t">${esc(txt)}${$('#aLink').value ? ' <a>Learn more →</a>' : ''}</span></div></div>`
    : `<p class="muted sm">Type a message to see a preview.</p>`;
}
['#aOn','#aEn','#aStyle','#aLink'].forEach(s => $(s).addEventListener('input', annPrev));
$('#saveSet').addEventListener('click', async () => {
  const body = { announcement:{ on:$('#aOn').checked, style:$('#aStyle').value, link:$('#aLink').value.trim(), text:{en:$('#aEn').value, te:$('#aTe').value, hi:$('#aHi').value} },
    reviewUrl:$('#sReview').value.trim(), whatsapp:{dental:$('#sWaD').value.trim(), family:$('#sWaF').value.trim()} };
  if (body.announcement.on && !body.announcement.text.en.trim()) return toast('Add the English announcement text, or switch the bar off.', true);
  try { const j = await api('settings', body); S.settings = j.settings; renderSettings(); renderQr(); toast('Saved. The website updates in about 30 seconds.'); }
  catch(err){ toast(err.message, true); }
});

/* ---------- leave & holidays ---------- */
const scopeName = s => s === 'all' ? 'Whole clinic closed' : s === 'dental' ? 'Dental department' : s === 'family' ? 'Family clinic' : (DOCTORS[s] ? DOCTORS[s].name + ' on leave' : s);
function renderLeave(){
  $('#lScope').innerHTML = [['all','Whole clinic (holiday)'],['dental','Dental department'],['family','Family clinic'], ...Object.entries(DOCTORS).map(([k,d]) => [k, d.name])].map(([k,v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  $('#lFrom').min = S.today; $('#lTo').min = S.today; if (!$('#lFrom').value) $('#lFrom').value = S.today;
  const up = (S.blocks || []).map((b,i) => ({...b, i})).filter(b => b.date >= S.today);
  $('#leaveList').innerHTML = up.length ? up.map(b => {
    const n = S.appts.filter(a => a.date === b.date && !['cancelled','no_show'].includes(a.status) && (b.scope==='all' || b.scope===a.cat || b.scope===a.doc)).length;
    return `<div class="lv"><b>${fmtDate(b.date,'en',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</b><span>${esc(scopeName(b.scope))}${b.note ? ' · ' + esc(b.note) : ''}</span>
      ${n ? `<span class="warn-t">${n} existing appointment${n>1?'s':''}: please inform patients</span>` : '<span></span>'}<button class="ib del" data-unblock="${b.i}" aria-label="Remove">${ic('i-trash')}</button></div>`; }).join('')
    : `<p class="empty-s">No upcoming leave or holidays.</p>`;
}
async function saveBlocks(list, msg){
  try { const j = await api('blocks', {blocks:list}); S.blocks = j.blocks; renderLeave(); toast(msg); } catch(err){ toast(err.message, true); }
}
$('#addLeave').addEventListener('click', () => {
  const f = $('#lFrom').value, t = $('#lTo').value || f, scope = $('#lScope').value, note = $('#lNote').value.trim();
  if (!f) return toast('Choose a date', true);
  if (t < f) return toast('“To” date is before “From” date', true);
  const add = []; for (let d = f; d <= t && add.length < 60; d = addDays(d,1)) add.push({date:d, scope, note});
  const list = (S.blocks || []).filter(b => b.date >= S.today).concat(add);
  saveBlocks(list, `Blocked ${add.length} day${add.length>1?'s':''}`); $('#lNote').value = ''; $('#lTo').value = '';
});
$('#leaveList').addEventListener('click', e => {
  const b = e.target.closest('[data-unblock]'); if (!b) return;
  const list = S.blocks.filter((_,i) => i !== +b.dataset.unblock && S.blocks[i].date >= S.today);
  saveBlocks(list, 'Day unblocked');
});

/* ---------- QR posters ---------- */
function renderQr(){
  if (typeof qrcode !== 'function') return;
  const url = location.origin + (qrKind === 'review' ? '/review' : '/#book');
  const q = qrcode(0, 'M'); q.addData(url); q.make();
  const T = qrKind === 'review'
    ? ['Happy with your visit?', 'Scan to review us on Google', 'మీ అనుభవం నచ్చిందా? గూగుల్‌లో రివ్యూ ఇవ్వడానికి స్కాన్ చేయండి', 'अनुभव अच्छा रहा? गूगल पर रिव्यू देने के लिए स्कैन करें']
    : ['Book your next visit', 'Scan to book an appointment online', 'తదుపరి అపాయింట్‌మెంట్ బుక్ చేయడానికి స్కాన్ చేయండి', 'अगला अपॉइंटमेंट बुक करने के लिए स्कैन करें'];
  $('#poster').innerHTML = `<div class="pst">
    <div class="pst-h"><span class="logo-mark"><svg viewBox="0 0 24 24"><use href="#i-tooth-f"/></svg><b>+</b></span><div><strong>Dent Plus</strong><small>Multispeciality Dental &amp; Family Clinic · Guntur</small></div></div>
    <h2>${T[0]}</h2><p class="pst-s">${T[1]}</p>
    <div class="pst-qr">${q.createSvgTag({cellSize:8, margin:2, scalable:true})}</div>
    ${qrKind === 'review' ? '<div class="pst-stars">★★★★★</div>' : ''}
    <p class="pst-l" lang="te">${T[2]}</p><p class="pst-l" lang="hi">${T[3]}</p>
    <p class="pst-u">${esc(url.replace(/^https?:\/\//,''))}</p></div>`;
  $('#dlQr').href = q.createDataURL(12, 4);
  $('#dlQr').download = `dentplus-${qrKind}-qr.gif`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-qr]'); if (!b) return;
  qrKind = b.dataset.qr; $$('[data-qr]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderQr();
});
$('#printQr').addEventListener('click', () => window.print());

/* ---------- modal ---------- */
function openModal(html){ $('#mdl').innerHTML = `<button class="mdl-x" data-mclose aria-label="Close">${ic('i-x')}</button>` + html; $('#modal').classList.add('on'); setTimeout(() => { const f = $('#mdl select, #mdl input'); if (f) f.focus(); }, 30); }
function closeModal(){ $('#modal').classList.remove('on'); }
document.addEventListener('click', e => { if (e.target.closest('[data-mclose]') || e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- start ---------- */
load().catch(err => showLogin(/sign in|log in/i.test(err.message) ? '' : err.message));
setInterval(() => { if (!$('#app').hidden && !$('#modal').classList.contains('on')) api(`data&from=${addDays(S.today,-30)}&to=${addDays(S.today,31)}`).then(j => {
  const before = S.appts.length; S.appts = j.appts.sort((a,b) => (a.date + String(a.time).padStart(4,'0')).localeCompare(b.date + String(b.time).padStart(4,'0'))); S.stats = j.stats;
  renderDash(); renderAppts(); const pend = S.appts.filter(a => a.status === 'pending' && a.date >= S.today).length; $('#pendBadge').hidden = !pend; $('#pendBadge').textContent = pend;
  if (S.appts.length > before) toast('New booking received');
}).catch(() => {}); }, 60000);
