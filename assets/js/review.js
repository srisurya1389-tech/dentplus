'use strict';
/* /review — target of the printed QR code. Counts the scan, then opens the clinic's Google review page
   (link set in Admin → Settings). Falls back to the button's default link. */
(function () {
  const btn = document.getElementById('go');
  try {
    const body = JSON.stringify({ e:'review_scan' });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type:'application/json' }));
  } catch (_) {}
  const go = url => { if (/^https:\/\//.test(url)) { btn.href = url; setTimeout(() => location.replace(url), 900); } };
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 3000);
  fetch('/api/public', { signal:ctl.signal })
    .then(r => r.ok ? r.json() : null)
    .then(j => { clearTimeout(to); go(j && j.reviewUrl ? j.reviewUrl : btn.href); })
    .catch(() => go(btn.href));
})();
