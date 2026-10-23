'use strict';
/* /api/admin?a=<action> — everything the admin panel needs.
   Auth: ADMIN_PASSWORD env var → signed HttpOnly SameSite=Strict cookie (12 h). Login is rate-limited. */
const C = require('./_lib/core');

module.exports = async (req, res) => {
  const a = C.query(req).get('a') || '';
  if (!C.dbEnabled()) return C.send(res, 503, { error:'Database not connected. Add Upstash Redis in Vercel → Storage, then redeploy.' });
  if (!C.adminConfigured()) return C.send(res, 503, { error:'Set an ADMIN_PASSWORD (10+ characters) in Vercel → Settings → Environment Variables, then redeploy.' });
  if (req.method === 'POST' && !C.sameOrigin(req)) return C.send(res, 403, { error:'Forbidden' });

  try {
    /* ----- login / logout ----- */
    if (a === 'login' && req.method === 'POST') {
      const ip = C.clientIp(req);
      if (!(await C.rateLimit('dp:rl:login:' + ip, 8, 900))) return C.send(res, 429, { error:'Too many attempts. Try again in 15 minutes.' });
      const body = await C.readBody(req);
      if (!C.checkPassword(body.password)) return C.send(res, 401, { error:'Incorrect password' });
      return C.send(res, 200, { ok:true }, { cookie:C.sessionCookie(C.makeToken()) });
    }
    if (a === 'logout'){ res.setHeader('Clear-Site-Data', '"cookies"'); return C.send(res, 200, { ok:true }, { cookie:C.sessionCookie('') }); }

    if (!C.isAdmin(req)) return C.send(res, 401, { error:'Please log in' });

    /* ----- read everything for the panel ----- */
    if (a === 'data' && req.method === 'GET') {
      const q = C.query(req);
      const today = C.istNow().date;
      const from = C.isDate(q.get('from')) ? q.get('from') : C.addDays(today, -7);
      const to = C.isDate(q.get('to')) ? q.get('to') : C.addDays(today, 30);
      const lo = Date.parse(from + 'T00:00:00Z') / 1000, hi = Date.parse(to + 'T00:00:00Z') / 1000 + 86399;
      const days = []; for (let i = 29; i >= 0; i--) days.push(C.addDays(today, -i));
      const [settings, packages, blocks, ids, ...stats] = await Promise.all([
        C.loadSettings(), C.loadPackages(), C.loadBlocks(),
        C.cmd('ZRANGEBYSCORE', 'dp:appt_idx', lo, hi),
        ...days.map(d => C.cmd('HGETALL', 'dp:stats:' + d))
      ]);
      const raw = ids.length ? await C.cmd('HMGET', 'dp:appts', ...ids) : [];
      const appts = raw.filter(Boolean).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
      const toObj = arr => { const o = {}; if (Array.isArray(arr)) for (let i = 0; i < arr.length; i += 2) o[arr[i]] = +arr[i + 1]; else Object.assign(o, arr || {}); return o; };
      return C.send(res, 200, {
        today, settings, packages, blocks, appts,
        stats: days.map((d, i) => ({ date:d, ...toObj(stats[i]) }))
      });
    }

    if (req.method !== 'POST') return C.send(res, 405, { error:'Method not allowed' });
    const body = await C.readBody(req);

    if (a === 'settings') { const s = C.cleanSettings(body); await C.setJSON('dp:settings', s); return C.send(res, 200, { ok:true, settings:s }); }
    if (a === 'packages') { const p = C.cleanPackages(body.packages); await C.setJSON('dp:packages', p); return C.send(res, 200, { ok:true, packages:p }); }
    if (a === 'blocks') { const b = C.cleanBlocks(body.blocks); await C.setJSON('dp:blocks', b); return C.send(res, 200, { ok:true, blocks:b }); }

    if (a === 'appt') {
      const id = C.str(body.id, 12), status = C.str(body.status, 12);
      if (!C.STATUSES.includes(status)) return C.send(res, 400, { error:'Invalid status' });
      const raw = await C.cmd('HGET', 'dp:appts', id);
      if (!raw) return C.send(res, 404, { error:'Appointment not found' });
      const ap = JSON.parse(raw);
      const wasActive = !['cancelled','no_show'].includes(ap.status);
      ap.status = status; ap.updatedAt = new Date().toISOString();
      const cmds = [['HSET', 'dp:appts', id, JSON.stringify(ap)]];
      const key = C.slotKey(ap.date, ap.doc, ap.time);
      if (status === 'cancelled' && wasActive) cmds.push(['DEL', key]);       // free the slot
      await C.pipe(cmds);
      return C.send(res, 200, { ok:true, appt:ap });
    }

    if (a === 'create') {   // phone / walk-in booking entered by staff
      const r = await C.createBooking(body, { admin:true });
      if (r.status !== 200) return C.send(res, r.status, { error:r.error });
      return C.send(res, 200, { ok:true, appt:r.appt });
    }

    C.send(res, 404, { error:'Unknown action' });
  } catch (e) {
    C.send(res, e.message && e.message.length < 140 && !/database|fetch/i.test(e.message) ? 400 : 500, { error:e.message && e.message.length < 140 ? e.message : 'Server error' });
  }
};
