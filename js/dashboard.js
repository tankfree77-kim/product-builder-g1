document.addEventListener('DOMContentLoaded', () => {

    /* ── Ranch Name ─────────────────────────── */
    const ranchName = localStorage.getItem('bovicare_ranch_name') || 'HappyCow Ranch';
    document.getElementById('displayRanchName').textContent = ranchName + ' Dashboard';

    /* Live clock */
    function updateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent =
            '마지막 업데이트: ' + now.toLocaleTimeString('ko-KR');
    }
    updateTime();
    setInterval(updateTime, 10000);

    /* ── Data Definitions ───────────────────── */
    const koreanBreeds  = ['한우', '홀스타인', '제주흑우'];
    const foreignBreeds = ['Angus', 'Hereford', 'Simmental'];
    const allBreeds     = [...koreanBreeds, ...foreignBreeds];

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
    const centerLat = 35.8514; // 경북 영천 (Yeongcheon, GyeongBuk)
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
        const breedIdx = Math.floor(Math.random() * allBreeds.length);
        const breed    = allBreeds[breedIdx];
        const isKorean = koreanBreeds.includes(breed);

        // Calves can be either gender
        let gender = typeInfo.gender;
        if (typeKey === 'Calf') gender = Math.random() > 0.5 ? '수컷' : '암컷';

        const lat = centerLat + (Math.random() - 0.5) * 0.006;
        const lng = centerLng + (Math.random() - 0.5) * 0.007;

        // Body temperature: Normal 38.0-39.0, Urgent slightly higher
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
            breed,
            isKorean,
            typeKey,
            typeLabel: typeInfo.label,
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

    /* ── Animated Stat Counters ─────────────── */
    function animateCount(el, target, suffix = '') {
        const duration = 1200;
        const steps    = 50;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
        }, duration / steps);
    }

    animateCount(document.getElementById('count-bulls'),  stats.Bull);
    animateCount(document.getElementById('count-cows'),   stats.Cow);
    animateCount(document.getElementById('count-calves'), stats.Calf);
    animateCount(document.getElementById('count-steers'), stats.Steer);
    animateCount(document.getElementById('count-urgent'), stats.urgent);
    document.getElementById('total-cows').textContent = TOTAL;

    /* Alert banner count */
    if (stats.urgent > 0) {
        document.getElementById('alertText').textContent =
            `긴급 알림: ${stats.urgent}마리의 이상 개체가 감지되었습니다. 즉시 확인이 필요합니다.`;
        document.getElementById('notifDot').style.display = stats.urgent > 0 ? 'block' : 'none';
    } else {
        document.getElementById('alertBanner').style.display = 'none';
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

    /* Map layer toggle */
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
        color: '#0D8ABC',
        weight: 2.5,
        fillColor: '#0D8ABC',
        fillOpacity: 0.08,
        dashArray: '6, 8',
    }).addTo(map);
    geofenceLayer.bindTooltip('목장 Geofence 경계', { permanent: false, direction: 'top' });

    /* ── Leaflet.draw for Geofence Editing ───── */
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

            // Load existing geofence into drawnItems for editing
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
        const color = cow.status === 'Urgent' ? '#ef4444'
                    : cow.status === 'Heat'   ? '#f59e0b'
                    : '#10b981';
        const pulse = cow.status === 'Urgent'
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
        const statusColor = cow.status === 'Urgent' ? '#b91c1c' : cow.status === 'Heat' ? '#b45309' : '#047857';
        const tempColor   = cow.temp > 39.2 ? '#b91c1c' : '#047857';
        return `
            <div style="font-family:Inter,sans-serif;min-width:200px;">
                <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">${cow.name}</div>
                <div style="font-size:0.8rem;color:#6b7280;margin-bottom:8px;">${cow.id} &nbsp;·&nbsp; ${cow.mac}</div>
                <table style="width:100%;font-size:0.82rem;border-collapse:collapse;">
                    <tr><td style="color:#6b7280;padding:2px 0;">품종</td><td style="font-weight:600;">${cow.breed}</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">종류</td><td style="font-weight:600;">${cow.typeLabel} (${cow.gender})</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">나이</td><td style="font-weight:600;">${cow.age}개월</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">체온</td><td style="font-weight:700;color:${tempColor};">${cow.temp}°C</td></tr>
                    <tr><td style="color:#6b7280;padding:2px 0;">상태</td><td style="font-weight:700;color:${statusColor};">${cow.status}</td></tr>
                </table>
                <div style="font-size:0.75rem;color:#9ca3af;margin-top:8px;">
                    📍 ${cow.lat.toFixed(5)}, ${cow.lng.toFixed(5)}
                </div>
            </div>`;
    }

    cowsData.forEach(cow => {
        L.marker([cow.lat, cow.lng], {
            icon: makeMarkerIcon(cow),
            zIndexOffset: cow.status === 'Urgent' ? 1000 : cow.status === 'Heat' ? 500 : 0,
        })
        .bindPopup(buildPopup(cow), { maxWidth: 240 })
        .addTo(markerLayer);
    });

    document.getElementById('mapCowCount').querySelector('span').textContent =
        `${TOTAL}개 EAR TAG 표시 중`;

    /* ── Render Table ───────────────────────── */
    const tableBody = document.getElementById('cowTableBody');

    function renderTable(data) {
        tableBody.innerHTML = '';
        document.getElementById('filterResultCount').textContent =
            data.length < TOTAL ? `${data.length}마리 표시됨` : '';

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2.5rem;color:#9ca3af;">조건에 맞는 개체가 없습니다.</td></tr>`;
            return;
        }

        data.forEach(cow => {
            const tr = document.createElement('tr');

            let badgeClass = 'badge-normal';
            let statusLabel = '<i class="fa-solid fa-circle-check"></i> 정상 활동';
            if (cow.status === 'Urgent') {
                badgeClass  = 'badge-urgent';
                statusLabel = '<i class="fa-solid fa-triangle-exclamation"></i> 건강이상/이탈';
            } else if (cow.status === 'Heat') {
                badgeClass  = 'badge-heat';
                statusLabel = '<i class="fa-solid fa-fire"></i> 발정 의심';
            }

            const tempClass = cow.temp > 39.2 ? 'temp-cell temp-high' : 'temp-cell temp-normal';
            const breedClass = cow.isKorean ? 'breed-badge' : 'breed-badge foreign';

            tr.innerHTML = `
                <td><span class="badge-status ${badgeClass}">${statusLabel}</span></td>
                <td>
                    <strong style="font-family:monospace;font-size:0.85rem;">${cow.id}</strong><br>
                    <span class="text-xs text-gray" style="font-family:monospace;">${cow.mac}</span>
                </td>
                <td style="font-weight:600;">${cow.name}</td>
                <td><span class="${breedClass}">${cow.breed}</span></td>
                <td>${cow.typeLabel}</td>
                <td>${cow.gender}</td>
                <td>${cow.age}<span class="text-gray text-xs"> 개월</span></td>
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

            /* Click row → open detail modal */
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
            if (sBreed  !== 'all' && cow.breed !== sBreed)          return false;
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
        const bgColor = cow.status === 'Urgent' ? '#fee2e2'
                      : cow.status === 'Heat'   ? '#fef3c7'
                      : '#d1fae5';
        const iconColor = cow.status === 'Urgent' ? '#ef4444'
                        : cow.status === 'Heat'   ? '#f59e0b'
                        : '#10b981';
        const icon = cow.typeKey === 'Bull' ? '♂' : cow.typeKey === 'Cow' ? '♀' : cow.typeKey === 'Calf' ? '◎' : '✦';

        detailContent.innerHTML = `
            <div class="detail-header">
                <div class="detail-avatar" style="background:${bgColor};color:${iconColor};font-size:2rem;">${icon}</div>
                <div>
                    <h2 style="font-size:1.4rem;">${cow.name}</h2>
                    <p class="text-gray" style="font-size:0.9rem;">${cow.id} &nbsp;·&nbsp; <span style="font-family:monospace;">${cow.mac}</span></p>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">상태</span><span class="detail-value">${cow.status}</span></div>
                <div class="detail-row"><span class="detail-label">품종 (Breed)</span><span class="detail-value">${cow.breed}</span></div>
                <div class="detail-row"><span class="detail-label">종류 (Type)</span><span class="detail-value">${cow.typeLabel} (${cow.typeKey})</span></div>
                <div class="detail-row"><span class="detail-label">성별</span><span class="detail-value">${cow.gender}</span></div>
                <div class="detail-row"><span class="detail-label">나이</span><span class="detail-value">${cow.age}개월 (${Math.floor(cow.age/12)}년 ${cow.age%12}개월)</span></div>
                <div class="detail-row"><span class="detail-label">체온</span><span class="detail-value" style="color:${cow.temp>39.2?'#ef4444':'#10b981'}">${cow.temp}°C</span></div>
                <div class="detail-row"><span class="detail-label">위도 (Lat)</span><span class="detail-value" style="font-family:monospace;">${cow.lat.toFixed(6)}</span></div>
                <div class="detail-row"><span class="detail-label">경도 (Lng)</span><span class="detail-value" style="font-family:monospace;">${cow.lng.toFixed(6)}</span></div>
                <div class="detail-row"><span class="detail-label">Tag ID</span><span class="detail-value" style="font-family:monospace;">${cow.id}</span></div>
                <div class="detail-row"><span class="detail-label">MAC Address</span><span class="detail-value" style="font-family:monospace;font-size:0.9rem;">${cow.mac}</span></div>
            </div>
            <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;">
                <button class="btn-primary btn-sm" onclick="document.getElementById('detailModal').classList.remove('show')">
                    닫기
                </button>
            </div>
        `;
        detailModal.classList.add('show');
    }

    closeDetail?.addEventListener('click', () => detailModal.classList.remove('show'));
    window.addEventListener('click', (e) => { if (e.target === detailModal) detailModal.classList.remove('show'); });

    /* ── CSV Export ─────────────────────────── */
    document.getElementById('btnExportCSV').addEventListener('click', () => {
        const headers = ['Status','Tag ID','MAC','Name','Breed','Type','Gender','Age(mo)','Temp(°C)','Lat','Lng'];
        const rows = cowsData.map(c => [
            c.status, c.id, c.mac, c.name, c.breed, c.typeKey, c.gender, c.age, c.temp, c.lat.toFixed(5), c.lng.toFixed(5)
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel Korean
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `bovicare_${ranchName}_${Date.now()}.csv` });
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV 파일이 다운로드되었습니다.', 'success');
    });

    /* ── Toast Notification ─────────────────── */
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
