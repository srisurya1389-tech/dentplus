'use strict';
/* POST /api/book → validates the request, reserves the slot atomically, stores the appointment. */
const C = require('./_lib/core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return C.send(res, 405, { error:'Method not allowed' });
  if (!C.sameOrigin(req)) return C.send(res, 403, { error:'Forbidden' });
  if (!C.dbEnabled()) return C.send(res, 503, { error:'Database not configured' });
  try {
    const ip = C.clientIp(req);
    if (!(await C.rateLimit('dp:rl:book:' + ip, 20, 3600))) return C.send(res, 429, { error:'Too many booking attempts. Please call the clinic.' });
    const body = await C.readBody(req);
    if (body.website) return C.send(res, 200, { ok:true, id:'DP-OK' }); // honeypot field filled by bots
    const r = await C.createBooking(body);
    if (r.status !== 200) return C.send(res, r.status, { error:r.error });
    C.send(res, 200, { ok:true, id:r.appt.id, doc:r.appt.doc });
  } catch (e) {
    C.send(res, 500, { error:'Server error' });
  }
};
