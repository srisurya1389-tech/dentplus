'use strict';
/* GET /api/public → announcement, review link, WhatsApp numbers, packages, upcoming leave days.
   Read by every visitor, so it is cached at the edge for 20 seconds. */
const C = require('./_lib/core');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return C.send(res, 405, { error:'Method not allowed' });
  if (!C.dbEnabled()) return C.send(res, 503, { error:'Database not configured' });
  try {
    const [s, packages, blocks] = await Promise.all([C.loadSettings(), C.loadPackages(), C.loadBlocks()]);
    const today = C.istNow().date;
    C.send(res, 200, {
      announcement: s.announcement.on ? s.announcement : null,
      reviewUrl: s.reviewUrl,
      whatsapp: s.whatsapp,
      packages: packages ? packages.filter(p => p.active) : null,
      blocks: blocks.filter(b => b.date >= today).map(b => ({ date:b.date, scope:b.scope })),
      bookingOnline: true
    }, { cache:'no-cache', cdn:'max-age=15, stale-while-revalidate=30' });
  } catch (e) {
    C.send(res, 500, { error:'Server error' });
  }
};
