'use strict';
/* POST /api/track {e:'call'} → anonymous daily counters for the owner dashboard.
   No cookies, no IP stored, no personal data. */
const C = require('./_lib/core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return C.send(res, 405, { error:'Method not allowed' });
  if (!C.dbEnabled()) return C.send(res, 204, {});
  try {
    const body = await C.readBody(req);
    const e = C.str(body.e, 20);
    if (!C.EVENTS.includes(e)) return C.send(res, 400, { error:'Unknown event' });
    if (!(await C.rateLimit('dp:rl:trk:' + C.clientIp(req), 200, 3600))) return C.send(res, 204, {});
    const key = 'dp:stats:' + C.istNow().date;
    await C.pipe([['HINCRBY', key, e, 1], ['EXPIRE', key, 60 * 60 * 24 * 400]]);
    C.send(res, 200, { ok:true });
  } catch (e) {
    C.send(res, 204, {});
  }
};
