// Simple map: fetch CSV, parse with PapaParse, and show circle markers for Sweden floods

// Initialize map centered on Sweden
const map = L.map('map').setView([61.5, 15], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('sweden_floods.csv')
  .then(r => r.text())
  .then(txt => Papa.parse(txt, { header: true, dynamicTyping: true }).data)
  .then(rows => {
    rows.filter(r => r && (r.Country === 'Sweden' || r.Country === 'SWEDEN' || r.Country === 'sweden')).forEach(r => {
      const lat = parseFloat(r.lat || r.lat);
      const lon = parseFloat(r.long || r.long);
      if (!isFinite(lat) || !isFinite(lon)) return;

      // Visual choices: color shows severity, size shows affected area
      const severity = Number(r.Severity) || 1;
      const area = Number(r.Area) || 1;

      const color = severity >= 2 ? (severity >= 3 ? '#d73027' : '#fdae61') : '#1a9850';
      const radius = Math.max(4, Math.log(area + 1) * 2);

      const marker = L.circleMarker([lat, lon], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 1
      }).addTo(map);

      const popup = `<b>${r.Country}</b><br>${r.Began} → ${r.Ended}<br>Cause: ${r.MainCause || 'n/a'}<br>Dead: ${r.Dead || 0}<br>Displaced: ${r.Displaced || 0}`;
      marker.bindPopup(popup);
    });
  })
  .catch(err => console.error('Failed to load CSV', err));
