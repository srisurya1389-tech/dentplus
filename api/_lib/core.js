'use strict';
/* Shared server code for Dent Plus API (Vercel Node functions, no dependencies).
   Database: Upstash Redis (REST). On Vercel, add it from Storage → Marketplace → Upstash Redis;
   it sets KV_REST_API_URL and KV_REST_API_TOKEN automatically. */
const crypto = require('crypto');

/* ---------- clinic rules (keep in sync with assets/js/main.js) ---------- */
const SERVICES = {
  implants:'dental', rct:'dental', dentures:'dental', extraction:'dental', gum:'dental', ortho:'dental', kids:'dental',
  eye:'family', vaccines:'family', general:'family', women:'family', child:'family', cancer:'family'
};
const DOCTORS = {
  pk:{cat:'dental', svc:['implants','dentures','rct','extraction','gum','ortho','kids'], name:'Dr. G. Phani Krishna'},
  bd:{cat:'dental', svc:['implants','dentures','rct','extraction','gum','ortho','kids'], name:'Dr. B. Deepthi'},
  vg:{cat:'family', svc:['general','child','vaccines'], name:'Dr. G. Venu Gopal Rao'},
  pr:{cat:'family', svc:['eye','women','cancer','vaccines'], name:'Dr. T. Padmaja Rani'}
};
/* Starter packages (same ids as assets/js/packages-default.js), used until the clinic saves its own */
const STARTER_PACKAGES = [
  { id:'dental-checkup', cat:'dental', active:true, name:{ en:'Complete Dental Check-up' } },
  { id:'kids-smile', cat:'dental', active:true, name:{ en:'Kids’ Smile Protection' } },
  { id:'diabetic-care', cat:'family', active:true, name:{ en:'Diabetic Care Check' } },
  { id:'womens-wellness', cat:'family', active:true, name:{ en:'Women’s Wellness' } }
];
const LOCS = { ashok:'Ashok Nagar Clinic', thota:'Gunturvari Thota Clinic' };
const SESSIONS = [[9*60, 14*60], [16*60, 21*60]];
const SLOT_MIN = 30;
const BOOK_AHEAD_DAYS = 30;
const STATUSES = ['pending','confirmed','done','cancelled','no_show'];
const EVENTS = ['view','call','whatsapp','directions','book_start','book_done','review_scan','package_click'];

const DEFAULT_SETTINGS = {
  announcement: { on:false, style:'info', text:{en:'', te:'', hi:''}, link:'' },
  reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Dent+Plus+Multi+Speciality+Dental+%26+Family+Clinic+Ashok+Nagar+Guntur',
  whatsapp: { dental:'919440919770', family:'919492080487' }
};

/* ---------- database (Upstash Redis REST) ---------- */
const dbUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const dbToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const dbEnabled = () => !!(dbUrl() && dbToken());

async function redis(body, path = '') {
  const r = await fetch(dbUrl() + path, {
    method:'POST',
    headers:{ Authorization:`Bearer ${dbToken()}`, 'Content-Type':'application/json' },
    body:JSON.stringify(body)
  });
  const j = await r.json().catch(() => ({ error:'Bad database response' }));
  if (!r.ok && !Array.isArray(j)) throw new Error(j.error || `Database error ${r.status}`);
  return j;
}
async function cmd(...args) { const j = await redis(args); if (j.error) throw new Error(j.error); return j.result; }
async function pipe(cmds) {
  if (!cmds.length) return [];
  const j = await redis(cmds, '/pipeline');
  return j.map(x => { if (x.error) throw new Error(x.error); return x.result; });
}
async function getJSON(key, def) {
  const v = await cmd('GET', key);
  if (v == null) return def;
  try { return JSON.parse(v); } catch { return def; }
}
const setJSON = (key, val) => cmd('SET', key, JSON.stringify(val));

/* ---------- http helpers ---------- */
function send(res, status, obj, extra = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', extra.cache || 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (extra.cdn) res.setHeader('Vercel-CDN-Cache-Control', extra.cdn);
  if (extra.cookie) res.setHeader('Set-Cookie', extra.cookie);
  res.end(JSON.stringify(obj));
}
async function readBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
    if (Buffer.isBuffer(req.body)) { try { return JSON.parse(req.body.toString('utf8')); } catch { return {}; } }
    return req.body;
  }
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}
const query = req => new URL(req.url, 'http://localhost').searchParams;
const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim();
/* Reject cross-site POSTs (CSRF defence in addition to SameSite cookies) */
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
}
async function rateLimit(key, max, windowSec) {
  const [n] = await pipe([['INCR', key], ['EXPIRE', key, windowSec, 'NX']]);
  return n <= max;
}

/* ---------- validation ---------- */
const str = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const multi = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max);
const isDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d + 'T00:00:00Z'));
const okLink = u => !u || /^(https:\/\/|\/|#)[^\s<>"']*$/.test(u);
const okHttps = u => /^https:\/\/[^\s<>"']+$/.test(u);

function istNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Kolkata', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).formatToParts(new Date());
  const g = k => parts.find(x => x.type === k).value;
  return { date:`${g('year')}-${g('month')}-${g('day')}`, min:(+g('hour') % 24) * 60 + +g('minute') };
}
const addDays = (date, n) => { const d = new Date(date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const allSlots = () => { const out = []; for (const [a, b] of SESSIONS) for (let m = a; m < b; m += SLOT_MIN) out.push(m); return out; };
const fmtTime = m => { const h = Math.floor(m / 60); return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };

/* ---------- settings / packages / blocks ---------- */
async function loadSettings() {
  const s = await getJSON('dp:settings', null);
  return Object.assign({}, DEFAULT_SETTINGS, s || {}, {
    announcement: Object.assign({}, DEFAULT_SETTINGS.announcement, (s && s.announcement) || {}),
    whatsapp: Object.assign({}, DEFAULT_SETTINGS.whatsapp, (s && s.whatsapp) || {})
  });
}
const loadPackages = () => getJSON('dp:packages', null);
const loadBlocks = async () => (await getJSON('dp:blocks', [])) || [];

function cleanSettings(b) {
  const a = b.announcement || {};
  const out = {
    announcement: {
      on: !!a.on,
      style: ['info','offer','alert'].includes(a.style) ? a.style : 'info',
      text: { en:str(a.text?.en, 160), te:str(a.text?.te, 160), hi:str(a.text?.hi, 160) },
      link: str(a.link, 200)
    },
    reviewUrl: str(b.reviewUrl, 400),
    whatsapp: { dental:str(b.whatsapp?.dental, 15).replace(/\D/g, ''), family:str(b.whatsapp?.family, 15).replace(/\D/g, '') }
  };
  if (!okLink(out.announcement.link)) throw new Error('Announcement link must start with https://, / or #');
  if (!okHttps(out.reviewUrl)) throw new Error('Google review link must start with https://');
  for (const k of ['dental','family']) if (!/^91[6-9]\d{9}$/.test(out.whatsapp[k])) throw new Error('WhatsApp numbers must be 91 followed by a 10-digit mobile number');
  return out;
}
function cleanPackages(list) {
  if (!Array.isArray(list)) throw new Error('Invalid packages');
  if (list.length > 12) throw new Error('Maximum 12 packages');
  const seen = new Set();
  return list.map((p, i) => {
    let id = str(p.id, 30).toLowerCase().replace(/[^a-z0-9-]/g, '') || 'pkg-' + (i + 1);
    while (seen.has(id)) id += '-' + i; seen.add(id);
    const num = v => (v === '' || v == null || isNaN(+v)) ? null : Math.max(0, Math.min(1000000, Math.round(+v)));
    const items = v => (Array.isArray(v) ? v : String(v || '').split('\n')).map(x => str(x, 80)).filter(Boolean).slice(0, 8);
    const pk = {
      id, cat: p.cat === 'family' ? 'family' : 'dental', active: p.active !== false,
      price: num(p.price), mrp: num(p.mrp),
      name: { en:str(p.name?.en, 60), te:str(p.name?.te, 60), hi:str(p.name?.hi, 60) },
      items: { en:items(p.items?.en), te:items(p.items?.te), hi:items(p.items?.hi) }
    };
    if (!pk.name.en) throw new Error(`Package ${i + 1}: English name is required`);
    return pk;
  });
}
function cleanBlocks(list) {
  if (!Array.isArray(list)) throw new Error('Invalid leave list');
  const scopes = ['all','dental','family', ...Object.keys(DOCTORS)];
  return list.slice(0, 300).map(b => ({ date:str(b.date, 10), scope:scopes.includes(b.scope) ? b.scope : 'all', note:str(b.note, 80) }))
    .filter(b => isDate(b.date)).sort((a, b) => a.date.localeCompare(b.date));
}
const blockedDoctors = (blocks, date) => {
  const set = new Set();
  for (const b of blocks) if (b.date === date) {
    for (const [id, d] of Object.entries(DOCTORS)) if (b.scope === 'all' || b.scope === d.cat || b.scope === id) set.add(id);
  }
  return set;
};

/* ---------- booking core ---------- */
function serviceInfo(svc, packages) {
  if (svc === 'checkup') return { name:'General check-up', cat:null, docs:Object.keys(DOCTORS) };
  if (SERVICES[svc]) return { name:svc, cat:SERVICES[svc], docs:Object.keys(DOCTORS).filter(d => DOCTORS[d].svc.includes(svc)) };
  if (svc && svc.startsWith('pkg:')) {
    const p = (packages || STARTER_PACKAGES).find(x => x.id === svc.slice(4) && x.active);
    if (p) return { name:'Package: ' + p.name.en, cat:p.cat, docs:Object.keys(DOCTORS).filter(d => DOCTORS[d].cat === p.cat), pkg:p };
  }
  return null;
}
const slotKey = (date, doc, time) => `dp:slot:${date}:${doc}:${time}`;

async function takenTimes({ date, svc, doc }, packages, blocks) {
  const info = serviceInfo(svc, packages);
  if (!info || !isDate(date)) return { taken:[], closed:false };
  let cands = doc && doc !== 'any' ? [doc].filter(d => info.docs.includes(d)) : info.docs;
  const off = blockedDoctors(blocks, date);
  cands = cands.filter(d => !off.has(d));
  if (!cands.length) return { taken:allSlots(), closed:true };
  const slots = allSlots();
  const keys = []; for (const t of slots) for (const d of cands) keys.push(slotKey(date, d, t));
  const vals = await cmd('MGET', ...keys);
  const taken = slots.filter((t, i) => cands.every((_, j) => vals[i * cands.length + j] != null));
  return { taken, closed:false };
}

function newId() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; const b = crypto.randomBytes(6);
  for (const x of b) s += abc[x % abc.length];
  return 'DP-' + s;
}

/* Validates and stores a booking. opts.admin skips the "past time" rule for staff entries. */
async function createBooking(input, opts = {}) {
  const [packages, blocks] = await Promise.all([loadPackages(), loadBlocks()]);
  const svc = str(input.svc, 40), doc = str(input.doc, 10) || 'any', date = str(input.date, 10);
  const time = parseInt(input.time, 10), loc = str(input.loc, 10);
  const name = str(input.name, 60), phone = str(input.phone, 14).replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const age = str(input.age, 3).replace(/\D/g, ''), note = multi(input.note, 300);
  const lang = ['en','te','hi'].includes(input.lang) ? input.lang : 'en';

  const info = serviceInfo(svc, packages);
  if (!info) return { status:400, error:'Please choose a valid service.' };
  if (doc !== 'any' && !info.docs.includes(doc)) return { status:400, error:'This doctor does not offer that service.' };
  if (!isDate(date)) return { status:400, error:'Please choose a valid date.' };
  const now = istNow();
  if (date < now.date || date > addDays(now.date, BOOK_AHEAD_DAYS)) return { status:400, error:'That date is not available for booking.' };
  if (!allSlots().includes(time)) return { status:400, error:'Please choose a valid time.' };
  if (!opts.admin && date === now.date && time <= now.min + 30) return { status:400, error:'That time has passed. Please choose a later slot.' };
  if (!LOCS[loc]) return { status:400, error:'Please choose a clinic.' };
  if (!name) return { status:400, error:'Please enter the patient name.' };
  if (!/^[6-9]\d{9}$/.test(phone)) return { status:400, error:'Please enter a valid 10-digit mobile number.' };
  if (age && (+age < 0 || +age > 120)) return { status:400, error:'Please enter a valid age.' };

  const off = blockedDoctors(blocks, date);
  const cands = (doc === 'any' ? info.docs : [doc]).filter(d => !off.has(d));
  if (!cands.length) return { status:409, error:'The clinic is closed or the doctor is on leave that day. Please choose another date.' };

  const id = newId();
  const ttl = 60 * 60 * 24 * (BOOK_AHEAD_DAYS + 5);
  let assigned = null;
  for (const d of cands) {
    const ok = await cmd('SET', slotKey(date, d, time), id, 'NX', 'EX', ttl);
    if (ok === 'OK') { assigned = d; break; }
  }
  if (!assigned) return { status:409, error:'Sorry, that time was just booked. Please choose another time.' };

  const appt = {
    id, svc, svcName:info.name, cat:info.cat || DOCTORS[assigned].cat, doc:assigned, docName:DOCTORS[assigned].name,
    docChosen:doc !== 'any', date, time, timeText:fmtTime(time), loc, locName:LOCS[loc],
    name, phone, age, note, lang, status:opts.admin ? 'confirmed' : 'pending', source:opts.admin ? 'staff' : 'website',
    createdAt:new Date().toISOString()
  };
  const score = Date.parse(date + 'T00:00:00Z') / 1000 + time * 60;
  await pipe([['HSET', 'dp:appts', id, JSON.stringify(appt)], ['ZADD', 'dp:appt_idx', score, id]]);
  return { status:200, appt };
}

/* ---------- admin auth (signed, HttpOnly cookie) ---------- */
const SESSION_SEC = 60 * 60 * 12;
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
function secret() {
  return process.env.ADMIN_SECRET || crypto.createHash('sha256').update('dp|' + (process.env.ADMIN_PASSWORD || '') + '|' + dbToken()).digest('hex');
}
const adminConfigured = () => (process.env.ADMIN_PASSWORD || '').length >= 10;
function checkPassword(pw) {
  if (!adminConfigured()) return false;
  return crypto.timingSafeEqual(sha(pw || ''), sha(process.env.ADMIN_PASSWORD));
}
const b64u = b => Buffer.from(b).toString('base64url');
function makeToken() {
  const payload = b64u(JSON.stringify({ exp:Math.floor(Date.now() / 1000) + SESSION_SEC }));
  const sig = b64u(crypto.createHmac('sha256', secret()).update(payload).digest());
  return payload + '.' + sig;
}
function verifyToken(tok) {
  if (!tok || !tok.includes('.')) return false;
  const [payload, sig] = tok.split('.');
  const good = b64u(crypto.createHmac('sha256', secret()).update(payload).digest());
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now() / 1000; } catch { return false; }
}
function cookieVal(req, name) {
  const m = String(req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : '';
}
const isAdmin = req => adminConfigured() && verifyToken(cookieVal(req, 'dp_admin'));
const sessionCookie = tok => `dp_admin=${tok}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${tok ? SESSION_SEC : 0}`;

module.exports = {
  SERVICES, DOCTORS, LOCS, STATUSES, EVENTS, DEFAULT_SETTINGS, BOOK_AHEAD_DAYS,
  dbEnabled, cmd, pipe, getJSON, setJSON,
  send, readBody, query, clientIp, sameOrigin, rateLimit,
  str, isDate, istNow, addDays,
  loadSettings, loadPackages, loadBlocks, cleanSettings, cleanPackages, cleanBlocks,
  takenTimes, createBooking, slotKey,
  adminConfigured, checkPassword, makeToken, isAdmin, sessionCookie
};
