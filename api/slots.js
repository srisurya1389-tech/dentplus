'use strict';
/* GET /api/slots?date=YYYY-MM-DD&svc=<service>&doc=<doctor|any> → times (minutes) that are fully booked. */
const C = require('./_lib/core');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return C.send(res, 405, { error:'Method not allowed' });
  if (!C.dbEnabled()) return C.send(res, 503, { error:'Database not configured' });
  const q = C.query(req);
  const date = C.str(q.get('date'), 10), svc = C.str(q.get('svc'), 40), doc = C.str(q.get('doc'), 10) || 'any';
  if (!C.isDate(date)) return C.send(res, 400, { error:'Invalid date' });
  try {
    if (!(await C.rateLimit('dp:rl:slots:' + C.clientIp(req), 300, 3600))) return C.send(res, 429, { error:'Too many requests' });
    const [packages, blocks] = await Promise.all([C.loadPackages(), C.loadBlocks()]);
    const out = await C.takenTimes({ date, svc, doc }, packages, blocks);
    C.send(res, 200, out);
  } catch (e) {
    C.send(res, 500, { error:'Server error' });
  }
};
