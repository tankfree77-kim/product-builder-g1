document.addEventListener('DOMContentLoaded', () => {

    /* ── Ranch Name ─────────────────────────── */
    const ranchName = localStorage.getItem('bovicare_ranch_name') || 'HappyCow Ranch';
    document.getElementById('displayRanchName').textContent = ranchName + ' Dashboard';

    /* Live clock */
    function updateTime() {
        const now = new Date();
        const lang = I18N.currentLang;
        const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US';
        document.getElementById('lastUpdate').textContent =
            I18N.get('clock.update') + now.toLocaleTimeString(locale);
    }
    updateTime();
    setInterval(updateTime, 10000);

    /* ── Processed Alert State ──────────────── */
    const processedAlerts = new Set(
        JSON.parse(localStorage.getItem('bovicare_processed') || '[]')
    );

    function isProcessed(cowId) {
        return processedAlerts.has(cowId);
    }

    function markProcessed(cowId) {
        processedAlerts.add(cowId);
        localStorage.setItem('bovicare_processed', JSON.stringify([...processedAlerts]));
        refreshAllAlertViews();
        showToast(I18N.get('alert.process.ok'), 'success');
    }

    /* ── Data Definitions ───────────────────── */
    const breedData = [
        { key: 'hanwoo',    isKorean: true  },
        { key: 'holstein',  isKorean: true  },
        { key: 'jeju',      isKorean: true  },
        { key: 'angus',     isKorean: false },
        { key: 'hereford',  isKorean: false },
        { key: 'simmental', isKorean: false },
    ];

    const typeMap = {
        Bull:  { label: '숫소',  gender: '수컷', icon: '♂', labelEn: 'Bull'  },
        Cow:   { label: '암소',  gender: '암컷', icon: '♀', labelEn: 'Cow'   },
        Calf:  { label: '송아지', gender: null,   icon: '◎', labelEn: 'Calf'  },
        Steer: { label: '거세소', gender: '수컷', icon: '✦', labelEn: 'Steer' },
    };
    const typeKeys = Object.keys(typeMap);

    const cowNames = [
        'Belle', 'Duke', 'Daisy', 'Max', 'Luna', 'Charlie', 'Molly', 'Buster',
        'Rosie', 'Rocky', 'Lily', 'Bruno', 'Coco', 'Titan', 'Nora', 'Hunter',
        'Stella', 'Rex', 'Pearl', 'Ace', '순이', '돌이', '누렁이', '흰둥이',
    ];

    const STATUS_PRIORITY = { Urgent: 1, Heat: 2, Normal: 3 };

    /* ── Generate Mock Data ─────────────────── */
    const TOTAL = 120;
    const centerLat = 35.8514;
    const centerLng = 128.9382;

    let stats = { Bull: 0, Cow: 0, Calf: 0, Steer: 0, urgent: 0 };
    const cowsData = [];

    for (let i = 0; i < TOTAL; i++) {
        const r = Math.random();
        let status = 'Normal';
        if (r > 0.96)      status = 'Urgent';
        else if (r > 0.87) status = 'Heat';

        const typeKey  = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const typeInfo = typeMap[typeKey];
        const breedEntry = breedData[Math.floor(Math.random() * breedData.length)];
        const breedKey   = breedEntry.key;
        const isKorean   = breedEntry.isKorean;

        let gender = typeInfo.gender;
        if (typeKey === 'Calf') gender = Math.random() > 0.5 ? '수컷' : '암컷';

        const lat = centerLat + (Math.random() - 0.5) * 0.006;
        const lng = centerLng + (Math.random() - 0.5) * 0.007;

        const baseTemp = 38.0 + Math.random() * 1.0;
        const temp = status === 'Urgent' ? (39.2 + Math.random() * 0.8).toFixed(1)
                   : status === 'Heat'   ? (38.8 + Math.random() * 0.4).toFixed(1)
                   : baseTemp.toFixed(1);

        const age = typeKey === 'Calf'
            ? Math.floor(Math.random() * 8) + 1
            : Math.floor(Math.random() * 72) + 8;

        stats[typeKey]++;
        if (status === 'Urgent') stats.urgent++;

        const tagNum = String(i + 1).padStart(4, '0');
        const macA   = Math.floor(Math.random() * 90 + 10).toString(16).toUpperCase();
        const macB   = Math.floor(Math.random() * 90 + 10).toString(16).toUpperCase();

        cowsData.push({
            id:      `BVC-${tagNum}`,
            mac:     `00:1A:2B:3C:${macA}:${macB}`,
            name:    cowNames[Math.floor(Math.random() * cowNames.length)] + ` #${i + 1}`,
            breedKey,
            isKorean,
            typeKey,
            gender,
            age,
            temp: parseFloat(temp),
            status,
            lat,
            lng,
        });
    }

    /* Sort: Urgent → Heat → Normal */
    cowsData.sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);

    /* Pre-compute alert timestamps (fixed, won't change on re-render) */
    const alertTimestamps = new Map();
    const now = new Date();
    cowsData.forEach(cow => {
        if (cow.status === 'Urgent' || cow.status === 'Heat') {
            const minsAgo = Math.floor(Math.random() * 1440);
            alertTimestamps.set(cow.id, new Date(now - minsAgo * 60000));
        }
    });

    /* ── Animated Stat Counters ─────────────── */
    function animateCount(el, target) {
        const duration = 1200;
        const steps    = 50;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, duration / steps);
    }

    animateCount(document.getElementById('count-bulls'),  stats.Bull);
    animateCount(document.getElementById('count-cows'),   stats.Cow);
    animateCount(document.getElementById('count-calves'), stats.Calf);
    animateCount(document.getElementById('count-steers'), stats.Steer);
    animateCount(document.getElementById('count-urgent'), stats.urgent);
    document.getElementById('total-cows').textContent = TOTAL;

    /* Alert banner */
    if (stats.urgent > 0) {
        document.getElementById('alertBanner').style.display = '';
        document.getElementById('notifDot').style.display = 'block';
    } else {
        document.getElementById('alertBanner').style.display = 'none';
        document.getElementById('notifDot').style.display = 'none';
    }

    /* ── Leaflet Map ────────────────────────── */
    const map = L.map('map').setView([centerLat, centerLng], 15);

    const tileNormal = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OSM contributors &copy; CARTO', maxZoom: 19 }
    );
    const tileSatellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
    );
    tileNormal.addTo(map);

    setTimeout(() => { map.invalidateSize(); }, 150);
    document.querySelector('.main-content')?.addEventListener('scroll', () => {
        map.invalidateSize();
    });

    document.getElementById('btnNormal').addEventListener('click', function() {
        map.removeLayer(tileSatellite);
        tileNormal.addTo(map);
        this.classList.add('active');
        document.getElementById('btnSatellite').classList.remove('active');
    });
    document.getElementById('btnSatellite').addEventListener('click', function() {
        map.removeLayer(tileNormal);
        tileSatellite.addTo(map);
        this.classList.add('active');
        document.getElementById('btnNormal').classList.remove('active');
    });

    /* ── Geofence Polygon ───────────────────── */
    const geofenceCoords = [
        [centerLat + 0.0035, centerLng - 0.004],
        [centerLat + 0.004,  centerLng + 0.0015],
        [centerLat + 0.002,  centerLng + 0.005],
        [centerLat - 0.002,  centerLng + 0.004],
        [centerLat - 0.004,  centerLng + 0.001],
        [centerLat - 0.003,  centerLng - 0.003],
        [centerLat + 0.001,  centerLng - 0.005],
    ];

    let geofenceLayer = L.polygon(geofenceCoords, {
        color: '#0D8ABC', weight: 2.5,
        fillColor: '#0D8ABC', fillOpacity: 0.08, dashArray: '6, 8',
    }).addTo(map);
    geofenceLayer.bindTooltip('목장 Geofence 경계', { permanent: false, direction: 'top' });

    const drawnItems = new L.FeatureGroup().addTo(map);
    const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems, edit: true, remove: true },
        draw: {
            polygon: {
                allowIntersection: false,
                shapeOptions: { color: '#0D8ABC', fillOpacity: 0.1, dashArray: '6, 8' },
            },
            polyline: false, rectangle: false, circle: false,
            circlemarker: false, marker: false,
        },
    });

    let editMode = false;

    document.getElementById('btnGeofenceEdit').addEventListener('click', () => {
        if (!editMode) {
            editMode = true;
            map.addControl(drawControl);
            drawnItems.clearLayers();
            drawnItems.addLayer(
                L.polygon(geofenceCoords, {
                    color: '#0D8ABC', weight: 2.5,
                    fillColor: '#0D8ABC', fillOpacity: 0.12,
                })
            );
            map.removeLayer(geofenceLayer);
            document.getElementById('geofence-status-bar').style.display = 'flex';
            document.getElementById('btnGeofenceSave').style.display     = 'inline-flex';
            document.getElementById('btnGeofenceEdit').innerHTML = '<i class="fa-solid fa-xmark"></i> 편집 취소';
        } else {
            cancelEdit();
        }
    });

    function cancelEdit() {
        editMode = false;
        map.removeControl(drawControl);
        drawnItems.clearLayers();
        geofenceLayer.addTo(map);
        document.getElementById('geofence-status-bar').style.display = 'none';
        document.getElementById('btnGeofenceSave').style.display     = 'none';
        document.getElementById('btnGeofenceEdit').innerHTML = '<i class="fa-solid fa-draw-polygon"></i> Geofence 편집';
    }

    document.getElementById('btnGeofenceSave').addEventListener('click', () => {
        const layers = drawnItems.getLayers();
        if (layers.length > 0) {
            const coords = layers[0].getLatLngs()[0];
            map.removeLayer(geofenceLayer);
            geofenceLayer = L.polygon(coords, {
                color: '#0D8ABC', weight: 2.5,
                fillColor: '#0D8ABC', fillOpacity: 0.08, dashArray: '6, 8',
            }).addTo(map);
            geofenceLayer.bindTooltip('목장 Geofence 경계 (수정됨)', { permanent: false, direction: 'top' });
        }
        cancelEdit();
        showToast('Geofence가 저장되었습니다.', 'success');
    });

    map.on(L.Draw.Event.CREATED, (e) => {
        drawnItems.clearLayers();
        drawnItems.addLayer(e.layer);
    });

    /* ── Cattle Markers ─────────────────────── */
    const markerLayer = L.layerGroup().addTo(map);

    function makeMarkerIcon(cow) {
        const processed = isProcessed(cow.id);
        const color = processed ? '#6b7280'
                    : cow.status === 'Urgent' ? '#ef4444'
                    : cow.status === 'Heat'   ? '#f59e0b'
                    : '#10b981';
        const pulse = (!processed && cow.status === 'Urgent')
            ? 'animation:pulse 1.2s infinite;'
            : '';
        return L.divIcon({
            className: '',
            html: `<span style="
                display:block;width:14px;height:14px;border-radius:50%;
                background:${color};border:2.5px solid white;
                box-shadow:0 0 5px rgba(0,0,0,0.35);
                position:relative;${pulse}
            "></span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
    }

    function buildPopup(cow) {
        const processed = isProcessed(cow.id);
        const isAlert = cow.status === 'Urgent' || cow.status === 'Heat';
        const statusColor = processed ? '#047857'
                          : cow.status === 'Urgent' ? '#b91c1c'
                          : cow.status === 'Heat'   ? '#b45309'
                          : '#047857';
        const tempColor   = cow.temp > 39.2 ? '#b91c1c' : '#047857';
        const statusLabel = processed ? I18N.get('alert.processed')
                          : cow.status === 'Urgent' ? I18N.get('status.urgent.short')
                          : cow.status === 'Heat'   ? I18N.get('status.heat.short')
                          : I18N.get('status.normal');
        const typeLabel   = I18N.get('type.' + cow.typeKey.toLowerCase());
        const genderLabel = cow.gender === '수컷' ? I18N.get('gender.male') : I18N.get('gender.female');
        const breedLabel  = I18N.get('breed.' + cow.breedKey);

        let actionHtml = '';
        if (isAlert) {
            if (processed) {
                actionHtml = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">
                    <span style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.3rem 0.8rem;
                        background:#d1fae5;color:#047857;border-radius:999px;font-weight:700;font-size:0.78rem;">
                        <i class="fa-solid fa-circle-check"></i> ${I18N.get('alert.processed')}
                    </span>
                </div>`;
            } else {
                actionHtml = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">
                    <button onclick="window.__boviProcessAlert('${cow.id}')" style="
                        background:#ef4444;color:white;border:none;padding:0.35rem 1rem;
                        border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;
                        font-family:Inter,sans-serif;width:100%;">
                        <i class="fa-solid fa-check-circle"></i> ${I18N.get('alert.process')}
                    </button>
                </div>`;
            }
        }

        return `
            <div style="font-family:Inter,sans-serif;min-width:200px;">
                <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">${cow.name}</div>
                <div style="font-size:0.8rem;color:#6b7280;margin-bottom:8px;">${cow.id} &nbsp;·&nbsp; ${cow.mac}</div>
                <table style="width:100%;font-size:0.82rem;border-collapse:collapse;">
                    <tr><td style="color:#6b7280;padding:2px 0;">${I18N.get('popup.breed')}</td><td style="font-weight:600;">${breedLabel}</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">${I18N.get('popup.type')}</td><td style="font-weight:600;">${typeLabel} (${genderLabel})</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">${I18N.get('popup.age')}</td><td style="font-weight:600;">${cow.age}${I18N.get('unit.months')}</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">${I18N.get('popup.temp')}</td><td style="font-weight:700;color:${tempColor};">${cow.temp}°C</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">${I18N.get('popup.status')}</td><td style="font-weight:700;color:${statusColor};">${statusLabel}</td></tr>
                </table>
                <div style="font-size:0.75rem;color:#9ca3af;margin-top:8px;">
                    📍 ${cow.lat.toFixed(5)}, ${cow.lng.toFixed(5)}
                </div>
                ${actionHtml}
            </div>`;
    }

    /* Global function for map popup buttons */
    window.__boviProcessAlert = function(cowId) {
        markProcessed(cowId);
        map.closePopup();
    };

    function buildMapMarkers() {
        markerLayer.clearLayers();
        cowsData.forEach(cow => {
            L.marker([cow.lat, cow.lng], {
                icon: makeMarkerIcon(cow),
                zIndexOffset: cow.status === 'Urgent' ? 1000 : cow.status === 'Heat' ? 500 : 0,
            })
            .bindPopup(buildPopup(cow), { maxWidth: 260 })
            .addTo(markerLayer);
        });
    }
    buildMapMarkers();

    document.getElementById('mapCowCount').querySelector('span').textContent =
        I18N.get('map.count').replace('{n}', TOTAL);

    /* ── Render Table ───────────────────────── */
    const tableBody = document.getElementById('cowTableBody');

    function renderTable(data) {
        tableBody.innerHTML = '';
        const resultCount = document.getElementById('filterResultCount');
        if (data.length < TOTAL) {
            resultCount.textContent = I18N.get('filter.result').replace('{n}', data.length);
        } else {
            resultCount.textContent = '';
        }

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2.5rem;color:#9ca3af;">${I18N.get('table.empty')}</td></tr>`;
            return;
        }

        data.forEach(cow => {
            const tr = document.createElement('tr');
            const processed = isProcessed(cow.id);
            const isAlert = cow.status === 'Urgent' || cow.status === 'Heat';

            let badgeClass = 'badge-normal';
            let statusLabel = `<i class="fa-solid fa-circle-check"></i> ${I18N.get('status.normal')}`;
            if (cow.status === 'Urgent') {
                badgeClass  = 'badge-urgent';
                statusLabel = `<i class="fa-solid fa-triangle-exclamation"></i> ${I18N.get('status.urgent')}`;
            } else if (cow.status === 'Heat') {
                badgeClass  = 'badge-heat';
                statusLabel = `<i class="fa-solid fa-fire"></i> ${I18N.get('status.heat')}`;
            }

            const processedTag = (isAlert && processed)
                ? `<span class="badge-processed-sm"><i class="fa-solid fa-check"></i> ${I18N.get('alert.processed')}</span>`
                : '';

            const typeDisplay   = I18N.get('type.' + cow.typeKey.toLowerCase());
            const genderDisplay = cow.gender === '수컷' ? I18N.get('gender.male') : I18N.get('gender.female');
            const breedDisplay  = I18N.get('breed.' + cow.breedKey);
            const monthUnit     = I18N.get('unit.months');
            const tempClass = cow.temp > 39.2 ? 'temp-cell temp-high' : 'temp-cell temp-normal';
            const breedClass = cow.isKorean ? 'breed-badge' : 'breed-badge foreign';

            tr.innerHTML = `
                <td>
                    <span class="badge-status ${badgeClass}">${statusLabel}</span>
                    ${processedTag}
                </td>
                <td>
                    <strong style="font-family:monospace;font-size:0.85rem;">${cow.id}</strong><br>
                    <span class="text-xs text-gray" style="font-family:monospace;">${cow.mac}</span>
                </td>
                <td style="font-weight:600;">${cow.name}</td>
                <td><span class="${breedClass}">${breedDisplay}</span></td>
                <td>${typeDisplay}</td>
                <td>${genderDisplay}</td>
                <td>${cow.age}<span class="text-gray text-xs"> ${monthUnit}</span></td>
                <td class="${tempClass}">${cow.temp}°C</td>
                <td class="text-gray" style="font-size:0.82rem;font-family:monospace;">
                    ${cow.lat.toFixed(4)}, ${cow.lng.toFixed(4)}
                </td>
                <td>
                    <button class="btn-outline btn-sm btn-detail" data-id="${cow.id}">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                </td>
            `;

            tr.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-detail')) openDetail(cow);
            });
            tr.querySelector('.btn-detail').addEventListener('click', (e) => {
                e.stopPropagation();
                openDetail(cow);
            });

            tableBody.appendChild(tr);
        });
    }

    renderTable(cowsData);

    /* ── Filter Logic ───────────────────────── */
    const filterStatus = document.getElementById('filterStatus');
    const filterGender = document.getElementById('filterGender');
    const filterType   = document.getElementById('filterType');
    const filterBreed  = document.getElementById('filterBreed');

    function applyFilters() {
        const sStatus = filterStatus.value;
        const sGender = filterGender.value;
        const sType   = filterType.value;
        const sBreed  = filterBreed.value;
        const sSearch = document.getElementById('globalSearch').value.trim().toLowerCase();

        const filtered = cowsData.filter(cow => {
            if (sStatus !== 'all' && cow.status !== sStatus)        return false;
            if (sGender !== 'all' && cow.gender !== sGender)        return false;
            if (sType   !== 'all' && cow.typeKey !== sType)         return false;
            if (sBreed  !== 'all' && cow.breedKey !== sBreed)        return false;
            if (sSearch && ![cow.id, cow.name, cow.mac, cow.breed].some(
                v => v.toLowerCase().includes(sSearch))) return false;
            return true;
        });

        renderTable(filtered);
    }

    [filterStatus, filterGender, filterType, filterBreed].forEach(el =>
        el.addEventListener('change', applyFilters)
    );
    document.getElementById('globalSearch').addEventListener('input', applyFilters);

    document.getElementById('btnResetFilter').addEventListener('click', () => {
        filterStatus.value = 'all';
        filterGender.value = 'all';
        filterType.value   = 'all';
        filterBreed.value  = 'all';
        document.getElementById('globalSearch').value = '';
        renderTable(cowsData);
    });

    /* ── Detail Modal ───────────────────────── */
    const detailModal   = document.getElementById('detailModal');
    const closeDetail   = document.getElementById('closeDetail');
    const detailContent = document.getElementById('detailContent');

    function openDetail(cow) {
        const processed = isProcessed(cow.id);
        const isAlert = cow.status === 'Urgent' || cow.status === 'Heat';

        const bgColor = (isAlert && !processed) ? (cow.status === 'Urgent' ? '#fee2e2' : '#fef3c7')
                      : processed ? '#d1fae5' : '#d1fae5';
        const iconColor = (isAlert && !processed) ? (cow.status === 'Urgent' ? '#ef4444' : '#f59e0b')
                        : '#10b981';
        const icon = cow.typeKey === 'Bull' ? '♂' : cow.typeKey === 'Cow' ? '♀' : cow.typeKey === 'Calf' ? '◎' : '✦';

        const statusLabel = processed && isAlert ? I18N.get('alert.processed')
                          : cow.status === 'Urgent' ? I18N.get('status.urgent.short')
                          : cow.status === 'Heat'   ? I18N.get('status.heat.short')
                          : I18N.get('status.normal');
        const typeDisplay   = I18N.get('type.' + cow.typeKey.toLowerCase());
        const genderDisplay = cow.gender === '수컷' ? I18N.get('gender.male') : I18N.get('gender.female');
        const monthUnit     = I18N.get('unit.months');
        const yearUnit      = I18N.get('unit.years');

        let processFooter = '';
        if (isAlert) {
            if (processed) {
                processFooter = `<span class="badge-processed">
                    <i class="fa-solid fa-circle-check"></i> ${I18N.get('alert.processed')}
                </span>`;
            } else {
                processFooter = `<button class="btn-process" id="btnProcessAlert">
                    <i class="fa-solid fa-check-circle"></i> ${I18N.get('alert.process')}
                </button>`;
            }
        }

        detailContent.innerHTML = `
            <div class="detail-header">
                <div class="detail-avatar" style="background:${bgColor};color:${iconColor};font-size:2rem;">${icon}</div>
                <div>
                    <h2 style="font-size:1.4rem;">${cow.name}</h2>
                    <p class="text-gray" style="font-size:0.9rem;">${cow.id} &nbsp;·&nbsp; <span style="font-family:monospace;">${cow.mac}</span></p>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.status')}</span><span class="detail-value">${statusLabel}</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.breed')}</span><span class="detail-value">${I18N.get('breed.' + cow.breedKey)}</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.type')}</span><span class="detail-value">${typeDisplay} (${cow.typeKey})</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.gender')}</span><span class="detail-value">${genderDisplay}</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.age')}</span><span class="detail-value">${cow.age}${monthUnit} (${Math.floor(cow.age/12)}${yearUnit} ${cow.age%12}${monthUnit})</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.temp')}</span><span class="detail-value" style="color:${cow.temp>39.2?'#ef4444':'#10b981'}">${cow.temp}°C</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.lat')}</span><span class="detail-value" style="font-family:monospace;">${cow.lat.toFixed(6)}</span></div>
                <div class="detail-row"><span class="detail-label">${I18N.get('detail.lng')}</span><span class="detail-value" style="font-family:monospace;">${cow.lng.toFixed(6)}</span></div>
                <div class="detail-row"><span class="detail-label">Tag ID</span><span class="detail-value" style="font-family:monospace;">${cow.id}</span></div>
                <div class="detail-row"><span class="detail-label">MAC Address</span><span class="detail-value" style="font-family:monospace;font-size:0.9rem;">${cow.mac}</span></div>
            </div>
            <div class="process-footer">
                ${processFooter}
                <button class="btn-outline btn-sm" id="btnCloseDetail">${I18N.get('detail.close')}</button>
            </div>
        `;

        /* Bind process button */
        document.getElementById('btnProcessAlert')?.addEventListener('click', () => {
            markProcessed(cow.id);
            detailModal.classList.remove('show');
        });
        document.getElementById('btnCloseDetail')?.addEventListener('click', () => {
            detailModal.classList.remove('show');
        });

        detailModal.classList.add('show');
    }

    closeDetail?.addEventListener('click', () => detailModal.classList.remove('show'));
    window.addEventListener('click', (e) => { if (e.target === detailModal) detailModal.classList.remove('show'); });

    /* ── Sidebar Navigation ─────────────────── */
    const SECTION_IDS = [
        'summary-section', 'map-section', 'table-section',
        'alerts-section', 'reports-section', 'settings-section', 'users-section'
    ];

    function showSection(sectionId) {
        SECTION_IDS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            const mc = document.querySelector('.main-content');
            if (mc) mc.scrollTop = 0;
        }
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-menu a[data-section="${sectionId}"]`);
        if (activeLink) activeLink.closest('li').classList.add('active');

        if (sectionId === 'map-section') {
            setTimeout(() => { map.invalidateSize(); }, 50);
        }
    }

    /* ── Alerts Section ─────────────────────── */
    const urgentCows = cowsData.filter(c => c.status === 'Urgent');
    const heatCows   = cowsData.filter(c => c.status === 'Heat');
    const allAlerts  = [...urgentCows, ...heatCows];
    let currentAlertList = [...allAlerts];

    function updateAlertCount(list) {
        const unprocessed = list.filter(c => !isProcessed(c.id)).length;
        document.getElementById('alertCount').textContent =
            I18N.get('alert.total').replace('{n}', unprocessed);
    }
    updateAlertCount(allAlerts);

    function buildAlertRows(list) {
        currentAlertList = list;
        const tbody = document.getElementById('alertTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        updateAlertCount(list);

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:#9ca3af;">
                <i class="fa-solid fa-circle-check" style="color:#10b981;margin-right:0.5rem;"></i>${I18N.get('alert.none')}</td></tr>`;
            return;
        }
        const lang = I18N.currentLang;
        const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US';

        list.forEach((cow) => {
            const processed = isProcessed(cow.id);
            const isUrgent = cow.status === 'Urgent';
            const badgeClass = isUrgent ? 'badge-urgent' : 'badge-heat';
            const icon  = isUrgent ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-fire"></i>';
            const label = isUrgent ? I18N.get('status.urgent.short') : I18N.get('status.heat.short');
            const typeDisplay   = I18N.get('type.' + cow.typeKey.toLowerCase());
            const genderDisplay = cow.gender === '수컷' ? I18N.get('gender.male') : I18N.get('gender.female');
            const t = alertTimestamps.get(cow.id) || now;
            const timeStr = t.toLocaleTimeString(locale, { hour:'2-digit', minute:'2-digit' }) +
                            ' ' + t.toLocaleDateString(locale, { month:'2-digit', day:'2-digit' });

            const actionCell = processed
                ? `<span class="badge-processed"><i class="fa-solid fa-circle-check"></i> ${I18N.get('alert.processed')}</span>`
                : `<button class="btn-confirm btn-alert-confirm">${I18N.get('alert.confirm')}</button>`;

            const tr = document.createElement('tr');
            tr.style.opacity = processed ? '0.65' : '1';
            tr.innerHTML = `
                <td><span class="badge-status ${badgeClass}">${icon} ${label}</span></td>
                <td style="font-family:monospace;font-size:0.82rem;">${cow.id}</td>
                <td style="font-weight:600;">${cow.name}</td>
                <td>${I18N.get('breed.' + cow.breedKey)}</td>
                <td class="${cow.temp > 39.2 ? 'temp-high' : 'temp-normal'} temp-cell">${cow.temp}°C</td>
                <td>${typeDisplay} · ${genderDisplay}</td>
                <td class="text-gray" style="font-size:0.82rem;">${timeStr}</td>
                <td class="text-gray" style="font-size:0.82rem;font-family:monospace;">${cow.lat.toFixed(4)}, ${cow.lng.toFixed(4)}</td>
                <td>${actionCell}</td>
            `;

            /* Click row → open detail (unless clicking confirm btn) */
            tr.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-alert-confirm')) openDetail(cow);
            });
            tr.querySelector('.btn-alert-confirm')?.addEventListener('click', (e) => {
                e.stopPropagation();
                openDetail(cow);
            });

            tbody.appendChild(tr);
        });
    }
    buildAlertRows(allAlerts);

    document.getElementById('btnClearAlerts')?.addEventListener('click', () => {
        buildAlertRows([]);
        showToast(I18N.get('alert.clear.ok'), 'success');
    });

    /* ── Refresh All Alert Views ────────────── */
    function refreshAllAlertViews() {
        buildAlertRows(currentAlertList);
        buildMapMarkers();
        applyFilters();
    }

    /* ── Reports Section ─────────────────────── */
    function buildBar(label, value, total, color) {
        const pct = total > 0 ? Math.round(value / total * 100) : 0;
        return `<div class="bar-row">
            <span class="bar-label">${label}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color};"></div></div>
            <span class="bar-count">${value}</span>
        </div>`;
    }

    const sNormal = cowsData.filter(c => c.status === 'Normal').length;
    const sHeat   = cowsData.filter(c => c.status === 'Heat').length;
    const sUrgent = cowsData.filter(c => c.status === 'Urgent').length;
    const breedCount = {};
    cowsData.forEach(c => { breedCount[c.breedKey] = (breedCount[c.breedKey] || 0) + 1; });
    const tempBuckets = { '37~38°C': 0, '38~39°C': 0, '39~40°C': 0, '40°C+': 0 };
    cowsData.forEach(c => {
        if (c.temp < 38)      tempBuckets['37~38°C']++;
        else if (c.temp < 39) tempBuckets['38~39°C']++;
        else if (c.temp < 40) tempBuckets['39~40°C']++;
        else                  tempBuckets['40°C+']++;
    });
    const breedColors = ['#0D8ABC','#10b981','#f59e0b','#ef4444','#7c3aed','#64748b'];
    const tempColors  = ['#10b981','#10b981','#f59e0b','#ef4444'];

    function buildReports() {
        document.getElementById('chartStatus').innerHTML =
            buildBar(I18N.get('report.normal'), sNormal, TOTAL, '#10b981') +
            buildBar(I18N.get('report.heat'),   sHeat,   TOTAL, '#f59e0b') +
            buildBar(I18N.get('report.urgent'), sUrgent, TOTAL, '#ef4444');

        document.getElementById('chartType').innerHTML =
            buildBar(I18N.get('report.bull'),   stats.Bull,  TOTAL, '#0284c7') +
            buildBar(I18N.get('report.cow'),    stats.Cow,   TOTAL, '#db2777') +
            buildBar(I18N.get('report.calf'),   stats.Calf,  TOTAL, '#d97706') +
            buildBar(I18N.get('report.steer'),  stats.Steer, TOTAL, '#7c3aed');

        document.getElementById('chartBreed').innerHTML =
            Object.entries(breedCount)
                .sort((a,b) => b[1]-a[1])
                .map(([bKey, cnt], i) => buildBar(I18N.get('breed.' + bKey), cnt, TOTAL, breedColors[i % breedColors.length]))
                .join('');

        document.getElementById('chartTemp').innerHTML =
            Object.entries(tempBuckets)
                .map(([label, cnt], i) => buildBar(label, cnt, TOTAL, tempColors[i]))
                .join('');
    }
    buildReports();

    const reportRanchName = localStorage.getItem('bovicare_ranch_name') || 'HappyCow Ranch';
    const rEl = document.getElementById('reportRanchName');
    if (rEl) rEl.textContent = reportRanchName + ' · ' + new Date().toLocaleDateString('ko-KR');

    /* ── Settings Admin Password Protection ──── */
    const ADMIN_PASSWORD = 'admin2024';
    let settingsUnlocked = false;

    const settingsAuthModal = document.getElementById('settingsAuthModal');
    const settingsPassword  = document.getElementById('settingsPassword');
    const settingsPasswordError = document.getElementById('settingsPasswordError');

    function openSettingsAuth(onSuccess) {
        settingsPassword.value = '';
        settingsPasswordError.style.display = 'none';
        settingsAuthModal.classList.add('show');
        setTimeout(() => settingsPassword.focus(), 100);

        const submit = document.getElementById('settingsAuthSubmit');
        const newSubmit = submit.cloneNode(true);
        submit.parentNode.replaceChild(newSubmit, submit);
        newSubmit.setAttribute('data-i18n', 'settings.password.submit');
        newSubmit.textContent = I18N.get('settings.password.submit');

        function tryAuth() {
            if (settingsPassword.value === ADMIN_PASSWORD) {
                settingsUnlocked = true;
                settingsAuthModal.classList.remove('show');
                onSuccess();
            } else {
                settingsPasswordError.style.display = 'block';
                settingsPasswordError.textContent = I18N.get('settings.password.error');
                settingsPassword.style.borderColor = '#ef4444';
                setTimeout(() => { settingsPassword.style.borderColor = '#e5e7eb'; }, 1500);
            }
        }
        newSubmit.addEventListener('click', tryAuth);
        settingsPassword.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Enter') { tryAuth(); e.preventDefault(); }
            if (e.key === 'Escape') {
                settingsAuthModal.classList.remove('show');
                settingsPassword.removeEventListener('keydown', onKey);
            }
        });
    }

    document.getElementById('closeSettingsAuth')?.addEventListener('click', () => {
        settingsAuthModal.classList.remove('show');
    });
    window.addEventListener('click', (e) => {
        if (e.target === settingsAuthModal) settingsAuthModal.classList.remove('show');
    });

    /* Sidebar navigation with settings auth check */
    document.querySelectorAll('.sidebar-menu a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            if (sectionId === 'settings-section' && !settingsUnlocked) {
                openSettingsAuth(() => showSection('settings-section'));
            } else {
                showSection(sectionId);
            }
        });
    });

    document.getElementById('btnSettingsSave')?.addEventListener('click', () => {
        if (!settingsUnlocked) {
            openSettingsAuth(() => showToast(I18N.get('settings.save.ok'), 'success'));
        } else {
            showToast(I18N.get('settings.save.ok'), 'success');
        }
    });
    document.getElementById('btnSettingsReset')?.addEventListener('click', () => {
        if (!settingsUnlocked) {
            openSettingsAuth(() => showToast(I18N.get('settings.reset.ok'), 'info'));
        } else {
            showToast(I18N.get('settings.reset.ok'), 'info');
        }
    });

    /* ── Settings Section ───────────────────── */
    const syncEl = document.getElementById('lastSync');
    if (syncEl) syncEl.textContent = new Date().toLocaleString('ko-KR');

    /* ── Users Section ──────────────────────── */
    const usersData = [
        { name: 'Carlos González',  roleKey: 'role.owner',    email: 'c.gonzalez@happycow.py',  timeKey: 'time.justnow',   active: true  },
        { name: 'María Pereira',    roleKey: 'role.vet',      email: 'm.pereira@happycow.py',   timeKey: 'time.1hour',     active: true  },
        { name: 'Juan Rodríguez',   roleKey: 'role.field',    email: 'j.rodriguez@happycow.py', timeKey: 'time.yesterday', active: true  },
        { name: 'Admin',            roleKey: 'role.sysadmin', email: 'admin@bovicare.io',        timeKey: 'time.justnow',   active: true  },
        { name: 'Ana Fleitas',      roleKey: 'role.staff',    email: 'a.fleitas@happycow.py',   timeKey: 'time.3days',     active: false },
    ];

    function renderUsers() {
        const utbody = document.getElementById('usersTableBody');
        if (!utbody) return;
        utbody.innerHTML = usersData.map(u => `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                        <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);
                            color:white;display:flex;align-items:center;justify-content:center;
                            font-weight:700;font-size:0.85rem;flex-shrink:0;">${u.name[0]}</div>
                        <strong>${u.name}</strong>
                    </div>
                </td>
                <td><span class="breed-badge">${I18N.get(u.roleKey)}</span></td>
                <td class="text-gray" style="font-size:0.875rem;">${u.email}</td>
                <td class="text-gray" style="font-size:0.875rem;">${I18N.get(u.timeKey)}</td>
                <td><span class="status-pill ${u.active ? 'green' : ''}" style="${!u.active?'background:#f3f4f6;color:#9ca3af;':''}">${u.active ? I18N.get('users.active') : I18N.get('users.inactive')}</span></td>
                <td>
                    <button class="btn-outline btn-sm" onclick="showToastGlobal('사용자 편집 기능은 준비 중입니다.','info')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            </tr>`).join('');
    }
    renderUsers();

    /* ── CSV Export ─────────────────────────── */
    document.getElementById('btnExportCSV').addEventListener('click', () => {
        const headers = ['Status','Tag ID','MAC','Name','Breed','Type','Gender','Age(mo)','Temp(°C)','Lat','Lng','Processed'];
        const rows = cowsData.map(c => [
            c.status, c.id, c.mac, c.name, I18N.get('breed.' + c.breedKey), c.typeKey, c.gender, c.age, c.temp, c.lat.toFixed(5), c.lng.toFixed(5),
            isProcessed(c.id) ? 'Y' : 'N'
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `bovicare_${ranchName}_${Date.now()}.csv` });
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV 파일이 다운로드되었습니다.', 'success');
    });

    /* ── Language Change: re-render dynamic content ── */
    document.addEventListener('langchange', () => {
        applyFilters();
        const alertTbody = document.getElementById('alertTableBody');
        const isEmpty = alertTbody && alertTbody.children.length === 1 &&
                        alertTbody.querySelector('td[colspan]');
        if (isEmpty) {
            buildAlertRows([]);
        } else {
            buildAlertRows(currentAlertList);
        }
        buildMapMarkers();
        buildReports();
        renderUsers();
        document.getElementById('mapCowCount').querySelector('span').textContent =
            I18N.get('map.count').replace('{n}', TOTAL);
        updateTime();
    });

    /* ── Toast Notification ─────────────────── */
    window.showToastGlobal = function(message, type) { showToast(message, type); };
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast-msg');
        existing?.remove();

        const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0D8ABC';
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.style.cssText = `
            position:fixed;bottom:2rem;right:2rem;background:${bg};color:white;
            padding:0.875rem 1.5rem;border-radius:10px;font-weight:600;font-size:0.9rem;
            box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:9999;
            animation:slideUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

});
