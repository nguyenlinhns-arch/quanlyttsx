(() => {
  const MASTER_ID = '1QPJ0ZUYJZNB1GpUyKa04uOMkRPzUR_vwG-fizIxn7Ac';
  const SHEET = 'WEB_DATA';
  const nf = new Intl.NumberFormat('vi-VN');
  const timeFmt = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const numericKeys = new Set([
    'total_records','inactive_records','active_records','new_since_cutoff',
    'new_active_since_cutoff','today_count','duplicate_new','incomplete_new',
    'source_mismatch_count','PHCP_total','PHCP_active','PHHB_total','PHHB_active',
    'PHHN_total','PHHN_active','PHVB_total','PHVB_active','PHMC_total','PHMC_active',
    'missing_campus_total'
  ]);

  const updatedText = document.getElementById('updatedText');
  const masterStatus = document.getElementById('masterStatus');
  const sourceStatus = document.getElementById('sourceStatus');
  const dataNotice = document.getElementById('dataNotice');

  function setDot(id, state) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `dot ${state}`;
  }

  function render(map, live) {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (!(key in map)) return;
      let value = map[key];
      if (numericKeys.has(key) && value !== '' && !Number.isNaN(Number(value))) {
        value = nf.format(Number(value));
      }
      el.textContent = value;
    });

    const sourceOk = String(map.source_system_status || '').includes('OK') && Number(map.source_mismatch_count || 0) === 0;
    const duplicate = Number(map.duplicate_new || 0);
    const incomplete = Number(map.incomplete_new || 0);
    const missingCampus = Number(map.missing_campus_total || 0);

    if (sourceStatus) {
      sourceStatus.textContent = `● ${map.source_system_status || 'CHƯA XÁC ĐỊNH NGUỒN'}`;
      sourceStatus.className = `status ${sourceOk ? 'ok' : 'warn'}`;
    }
    if (masterStatus) {
      masterStatus.textContent = live ? '● DSHS TỔNG · LIVE' : '● DSHS TỔNG · SNAPSHOT';
      masterStatus.className = `status ${live ? 'ok' : 'warn'}`;
    }

    setDot('sourceDot', sourceOk ? 'green' : 'red');
    setDot('duplicateDot', duplicate === 0 ? 'green' : 'orange');
    setDot('incompleteDot', incomplete === 0 ? 'green' : 'red');
    setDot('campusDot', missingCampus === 0 ? 'green' : 'orange');

    if (updatedText) {
      updatedText.textContent = live
        ? `Đồng bộ trực tiếp DSHS Tổng · ${timeFmt.format(new Date())}`
        : `Ảnh chụp gần nhất từ DSHS Tổng · ${timeFmt.format(new Date())}`;
    }

    if (dataNotice) {
      dataNotice.innerHTML = live
        ? '<strong>Nguồn thống kê duy nhất:</strong> DSHS NHẬP HỌC TỔNG NĂM 2026 · đang đọc trực tiếp sheet WEB_DATA.'
        : '<strong>Nguồn thống kê duy nhất:</strong> DSHS NHẬP HỌC TỔNG NĂM 2026. Trình duyệt chưa đọc được nguồn riêng tư; trang đang giữ ảnh chụp gần nhất từ chính DSHS Tổng, không chuyển sang TH KQ.';
      dataNotice.className = `data-notice ${live ? 'live' : 'warning'}`;
    }
  }

  function parseResponse(response) {
    const map = {};
    const rows = response && response.table && response.table.rows ? response.table.rows : [];
    rows.forEach(row => {
      const cells = row.c || [];
      const key = cells[0] && cells[0].v != null ? String(cells[0].v) : '';
      if (!key) return;
      const cell = cells[1] || {};
      map[key] = cell.f != null ? cell.f : (cell.v != null ? cell.v : '');
    });
    return map;
  }

  let completed = false;
  const timeout = setTimeout(() => {
    if (completed) return;
    completed = true;
    render({}, false);
  }, 8000);

  window.__nhapHocWebData = response => {
    if (completed) return;
    completed = true;
    clearTimeout(timeout);
    const map = parseResponse(response);
    const valid = map.web_source === 'DSHS_TONG_ONLY' && Object.prototype.hasOwnProperty.call(map, 'total_records');
    render(map, valid);
  };

  const script = document.createElement('script');
  const tqx = encodeURIComponent('out:json;responseHandler:__nhapHocWebData');
  script.src = `https://docs.google.com/spreadsheets/d/${MASTER_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET)}&headers=1&tqx=${tqx}`;
  script.async = true;
  script.onerror = () => {
    if (completed) return;
    completed = true;
    clearTimeout(timeout);
    render({}, false);
  };
  document.head.appendChild(script);
})();
