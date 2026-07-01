// DOM Elements
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const placeholder = document.getElementById('upload-placeholder');
const container = document.getElementById('canvas-container');

// Buttons
const btnDrawPolygon = document.getElementById('btn-draw-polygon');
const btnAddPolygon = document.getElementById('btn-add-polygon');
const btnClearArea = document.getElementById('btn-clear-area');
const btnOptimize = document.getElementById('btn-optimize');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnSaveResults = document.getElementById('btn-save-results');
const dataUpload = document.getElementById('dataUpload');
const langSelect = document.getElementById('language-select');

// Localization dictionary
const i18n = {
    ko: {
        title: "SJIT Smart TAG Basestation Simulation",
        badge_install: "설치팀용",
        desc: "지역을 검색하여 지도에서 영역을 그리고 파라메터를 설정하여 최적의 중계기 설치 위치를 확인하세요.",
        farm_name_label: "목장 이름:",
        farm_name_placeholder: "예: 파라과이 A목장",
        btn_save: "결과 저장",
        btn_load: "불러오기",
        scale_label: "지도 비율:",
        upload_desc: "아래 버튼을 눌러 지역을 검색하고 폴리곤으로 영역을 지정하세요",
        btn_upload: "새 지도 검색",
        btn_new_map: "새 지도",
        btn_draw_new: "새 영역 그리기",
        btn_draw_add: "영역 추가",
        btn_clear: "영역 초기화",
        btn_calc: "최적 위치 계산",
        req_basestations: "필요 기지국 수",
        unit_count: "개",
        req_basestations_desc: "산출된 시뮬레이션 기지국 수입니다.",
        coord_list_title: "기지국 좌표 목록",
        search_bs_placeholder: "기지국 번호 (예: 1)",
        btn_search_bs: "찾기",
        btn_clear_search: "해제",
        btn_edit_bs: "기지국 최적화",
        alert_bs_not_found: "해당 번호의 기지국을 찾을 수 없습니다.",
        coord_list_empty: "위치 계산 전",
        params_title: "기본 설정 파라미터",
        param_ble_range: "디바이스 전송 거리 (m)",
        param_ble_desc: "BLE 태그의 최대 전송 거리 (기본 500m)",
        param_overlap: "기지국 중첩 거리 (m)",
        param_overlap_desc: "QoS 확보 기지국간 커버리지 중첩 거리",
        alert_proj_invalid: "유효하지 않은 프로젝트 파일입니다. (.sjit)",
        alert_load_success: "데이터 불러오기 성공",
        alert_dist_error: "거리 설정이 잘못되었습니다.",
        btn_draw_finish: "그리기 완료",
        modal_title: "지역 검색",
        modal_search_placeholder: "지역 검색 (예: 아순시온, 파라과이)",
        modal_btn_search: "검색",
        modal_hint: "지역을 검색하고 원하는 위치로 지도를 이동/확대한 후 완료 버튼을 누르세요. 영역(폴리곤)은 메인 화면에서 그릴 수 있습니다.",
        modal_btn_cancel: "취소",
        modal_btn_apply: "완료",
        alert_maps_not_ready: "Google Maps API가 아직 로드되지 않았습니다. 잠시 후 다시 시도하세요."
    },
    en: {
        title: "SJIT Smart TAG Basestation Simulation",
        badge_install: "For Installers",
        desc: "Search for a location, draw the area on the map, set parameters, and find optimal relay station locations.",
        farm_name_label: "Farm Name:",
        farm_name_placeholder: "Ex: Paraguay Farm A",
        btn_save: "Save Results",
        btn_load: "Load",
        scale_label: "Map Scale:",
        upload_desc: "Click the button below to search for a location and draw a polygon area",
        btn_upload: "Search New Map",
        btn_new_map: "New Map",
        btn_draw_new: "Draw New Area",
        btn_draw_add: "Add Area",
        btn_clear: "Clear Area",
        btn_calc: "Calculate Optimal Locations",
        req_basestations: "Required Base Stations",
        unit_count: "ea",
        req_basestations_desc: "Calculated number of simulated base stations.",
        coord_list_title: "Base Station Coordinates",
        search_bs_placeholder: "BS Number (ex: 1)",
        btn_search_bs: "Find",
        btn_clear_search: "Clear",
        btn_edit_bs: "Optimize BS",
        alert_bs_not_found: "Could not find a base station with that number.",
        coord_list_empty: "Before Calculation",
        params_title: "Basic Configuration Parameters",
        param_ble_range: "Device Range (m)",
        param_ble_desc: "Maximum transmission distance of BLE Tag (default 500m)",
        param_overlap: "Station Overlap (m)",
        param_overlap_desc: "Coverage overlap distance between stations for QoS",
        alert_proj_invalid: "Invalid project file. (.sjit)",
        alert_load_success: "Data loaded successfully",
        alert_dist_error: "Distance setting is invalid.",
        btn_draw_finish: "Finish Drawing",
        modal_title: "Search Location",
        modal_search_placeholder: "Search location (e.g. Asuncion, Paraguay)",
        modal_btn_search: "Search",
        modal_hint: "Search a location and pan/zoom the map as needed, then press Done. You can draw the farm area (polygon) on the main screen.",
        modal_btn_cancel: "Cancel",
        modal_btn_apply: "Done",
        alert_maps_not_ready: "Google Maps API is not yet loaded. Please try again in a moment."
    },
    es: {
        title: "Simulación de Estación Base SJIT Smart TAG",
        badge_install: "Instaladores",
        desc: "Busque una ubicación, dibuje el área en el mapa, configure parámetros y encuentre las ubicaciones óptimas.",
        farm_name_label: "Nombre de Granja:",
        farm_name_placeholder: "Ej: Granja A Paraguay",
        btn_save: "Guardar",
        btn_load: "Cargar",
        scale_label: "Escala:",
        upload_desc: "Haga clic en el botón para buscar una ubicación y dibujar un área",
        btn_upload: "Buscar Nuevo Mapa",
        btn_new_map: "Nuevo Mapa",
        btn_draw_new: "Dibujar Nueva Área",
        btn_draw_add: "Añadir Área",
        btn_clear: "Limpiar Área",
        btn_calc: "Calcular Ubicaciones Óptimas",
        req_basestations: "Estaciones Base Requeridas",
        unit_count: "ud",
        req_basestations_desc: "Número calculado de estaciones base simuladas.",
        coord_list_title: "Coordenadas de Estaciones",
        search_bs_placeholder: "Número de EB (ej: 1)",
        btn_search_bs: "Buscar",
        btn_clear_search: "Limpiar",
        btn_edit_bs: "Optimizar EB",
        alert_bs_not_found: "No se pudo encontrar una estación base con ese número.",
        coord_list_empty: "Antes del Cálculo",
        params_title: "Parámetros de Configuración Básica",
        param_ble_range: "Rango del Dispositivo (m)",
        param_ble_desc: "Distancia máxima de transmisión del Tag BLE (por defecto 500m)",
        param_overlap: "Superposición (m)",
        param_overlap_desc: "Distancia de superposición entre estaciones para QoS",
        alert_proj_invalid: "Archivo de proyecto no válido. (.sjit)",
        alert_load_success: "Datos cargados exitosamente",
        alert_dist_error: "La configuración de la distancia no es válida.",
        btn_draw_finish: "Terminar Dibujo",
        modal_title: "Buscar Ubicación",
        modal_search_placeholder: "Buscar ubicación (ej: Asunción, Paraguay)",
        modal_btn_search: "Buscar",
        modal_hint: "Busque una ubicación y mueva/acerque el mapa según sea necesario, luego presione Listo. Puede dibujar el área (polígono) en la pantalla principal.",
        modal_btn_cancel: "Cancelar",
        modal_btn_apply: "Listo",
        alert_maps_not_ready: "La API de Google Maps aún no está cargada. Por favor intente de nuevo en un momento."
    }
};

let currentLang = 'ko';

// Change Language Logic
function applyLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang];
    
    // Process text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key]; // Allow inner span like badge_install to render properly if parent replaces it
        }
    });
    
    // Since badge_install is inside title, we might overwrite it. We need to be careful.
    // Fixed structure: <h1>SJIT <span data-i18n="badge_install">...</span></h1> 
    // We update innerHTML for normal elements, but for title we just have text. Wait, the HTML has `data-i18n="title"` on the <h1> which will wipe out the child badge.
    // Let's modify applyLanguage to handle this properly by only updating childNodes of type Text if needed, OR just update the h1 HTML explicitly.
    const h1 = document.querySelector('h1[data-i18n="title"]');
    if (h1) {
        h1.innerHTML = `${t['title']} <span class="badge" data-i18n="badge_install">${t['badge_install']}</span>`;
    }
    
    // Process placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Update dynamic button texts if they are in active state
    if (mode === 'drawing_polygon') {
        const svgHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> `;
        btnDrawPolygon.innerHTML = svgHTML + t['btn_draw_finish'];
        btnAddPolygon.innerHTML = svgHTML + t['btn_draw_finish'];
    }
    
    // Update List Fallback
    if (relayStations.length === 0) {
        listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
    }
    
    // Update count unit
    textTotalStations.innerHTML = `${relayStations.length}<span class="unit">${t['unit_count']}</span>`;
}

langSelect.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});


// Inputs and Lists
const inputBleRange = document.getElementById('ble-range');
const inputOverlap = document.getElementById('overlap-range');
const inputScaleValue = document.getElementById('scale-value');
const inputScaleUnit = document.getElementById('scale-unit');
const textTotalStations = document.getElementById('total-stations');
const listCoordinates = document.getElementById('station-coordinates-list');
const inputSearchBs = document.getElementById('search-bs-id');
const btnSearchBs = document.getElementById('btn-search-bs');
const btnClearSearch = document.getElementById('btn-clear-search');
const btnEditBs = document.getElementById('btn-edit-bs');

// App State
let imageObj = null;
let isMapReady = false;
let mode = 'idle'; // idle, drawing_polygon, editing_bs
let isScaleSet = true; // We now use explicit input
let zoomLevel = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

// Geometry State
let kmlPolygon = []; // Array of {x, y} for parsed KML boundary
let farmPolygons = []; // Array of Arrays of {x, y} relative to image intrinsic coordinates (User Drawn)
let currentPolygonIndex = -1; // -1 means no active draw
let relayStations = []; // Calculated positions [{x, y}]
let searchedBsId = null; // Currently searched Base Station ID for highlighting
let currentMousePos = null; // Mouse position for drawing real-time line
let draggingBsId = null; // ID of the Base Station currently being moved by Right Click
let isDraggingBs = false;

// Background Google Map (shown behind canvas after polygon confirmation)
let backgroundMap = null;
let isBackgroundMapVisible = false;

// ─── Google Maps Modal ───────────────────────────────────────────────────────

let googleMap = null;
let googleMapsReady = false;
let placesAutocomplete = null;

// Called by Google Maps API callback (set in script tag)
function initGoogleMapAPI() {
    googleMapsReady = true;
}

function openMapSearchModal() {
    const modal = document.getElementById('map-search-modal');
    modal.style.display = 'flex';

    if (!googleMapsReady) {
        alert(i18n[currentLang]['alert_maps_not_ready']);
        modal.style.display = 'none';
        return;
    }

    if (!googleMap) {
        initializeGoogleMap();
    } else {
        google.maps.event.trigger(googleMap, 'resize');
    }
}

function initializeGoogleMap() {
    const mapDiv = document.getElementById('google-map-container');
    googleMap = new google.maps.Map(mapDiv, {
        center: { lat: -25.2637, lng: -57.5759 },
        zoom: 10,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        streetViewControl: false,
        fullscreenControl: false
    });

    const searchInput = document.getElementById('location-search-input');
    placesAutocomplete = new google.maps.places.Autocomplete(searchInput);
    placesAutocomplete.bindTo('bounds', googleMap);

    placesAutocomplete.addListener('place_changed', () => {
        const place = placesAutocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        if (place.geometry.viewport) {
            googleMap.fitBounds(place.geometry.viewport);
        } else {
            googleMap.setCenter(place.geometry.location);
            googleMap.setZoom(12);
        }
    });
}

// Manual geocode search (for users who don't pick from autocomplete dropdown)
document.getElementById('btn-search-location').addEventListener('click', () => {
    if (!googleMapsReady || !googleMap) return;
    const query = document.getElementById('location-search-input').value.trim();
    if (!query) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
            if (results[0].geometry.viewport) {
                googleMap.fitBounds(results[0].geometry.viewport);
            } else {
                googleMap.setCenter(results[0].geometry.location);
                googleMap.setZoom(12);
            }
        }
    });
});

document.getElementById('location-search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-search-location').click();
    }
});

// Close modal buttons
['modal-close', 'btn-cancel-modal'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        document.getElementById('map-search-modal').style.display = 'none';
    });
});

// Click outside modal to close
document.getElementById('map-search-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('map-search-modal')) {
        document.getElementById('map-search-modal').style.display = 'none';
    }
});

// Apply the current map viewport as the working area; the farm polygon itself
// is drawn afterwards on the main screen (not inside this modal).
document.getElementById('btn-apply-map').addEventListener('click', () => {
    if (!googleMap) return;

    const bounds = googleMap.getBounds();
    if (!bounds) {
        alert(i18n[currentLang]['alert_maps_not_ready']);
        return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const geoPoints = [
        { lat: sw.lat(), lon: sw.lng() },
        { lat: ne.lat(), lon: ne.lng() }
    ];

    document.getElementById('map-search-modal').style.display = 'none';
    processMapView(geoPoints, sw.lat(), ne.lat(), sw.lng(), ne.lng());
});

// Open modal from placeholder and toolbar buttons
document.getElementById('btn-open-map-search-placeholder').addEventListener('click', openMapSearchModal);
document.getElementById('btn-reupload-map').addEventListener('click', openMapSearchModal);

// Set up the canvas coordinate system from the loaded map viewport.
// The farm polygon is left empty here; the user draws it on the main screen.
function processMapView(geoPoints, minLat, maxLat, minLon, maxLon) {
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    window.kmlCenterLat = centerLat;
    window.kmlCenterLon = centerLon;

    const metersPerDegLat = 111000;
    const metersPerDegLon = 111000 * Math.cos(centerLat * Math.PI / 180);

    const widthMeters = (maxLon - minLon) * metersPerDegLon;
    const heightMeters = (maxLat - minLat) * metersPerDegLat;

    canvas.width = container.clientWidth > 0 ? container.clientWidth : 1200;
    canvas.height = container.clientHeight > 0 ? container.clientHeight : 800;
    canvas.style.display = 'block';
    placeholder.style.display = 'none';

    const usableWidth = canvas.width * 0.8;
    const usableHeight = canvas.height * 0.8;

    const scaleX = widthMeters > 0 ? usableWidth / widthMeters : 10;
    const scaleY = heightMeters > 0 ? usableHeight / heightMeters : 10;

    const pixelsPerMeter = Math.min(scaleX, scaleY);
    const mpp = 1 / pixelsPerMeter;

    inputScaleValue.value = (37.8 * mpp).toFixed(4);
    inputScaleUnit.value = "m";

    // No boundary is drawn yet at this point; the user draws farm polygons on the main screen.
    kmlPolygon = [];
    farmPolygons = [];

    imageObj = null;
    isMapReady = true;

    btnDrawPolygon.disabled = false;
    btnAddPolygon.disabled = false;
    btnClearArea.disabled = false;
    btnZoomIn.disabled = false;
    btnZoomOut.disabled = false;
    btnOptimize.disabled = true;

    zoomLevel = 1;
    panX = 0;
    panY = 0;

    relayStations = [];
    currentPolygonIndex = -1;
    searchedBsId = null;
    currentMousePos = null;
    draggingBsId = null;
    isDraggingBs = false;
    btnClearSearch.style.display = 'none';
    btnEditBs.disabled = true;

    const t = i18n[currentLang];
    textTotalStations.innerHTML = `0<span class="unit">${t['unit_count']}</span>`;
    listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
    btnSaveResults.disabled = true;

    showBackgroundMap(geoPoints, centerLat, centerLon);
    draw();
}

// ─── Background Map (satellite view behind canvas) ───────────────────────────

function showBackgroundMap(geoPoints, centerLat, centerLon) {
    if (!googleMapsReady) return;

    const bgDiv = document.getElementById('background-map');
    bgDiv.style.display = 'block';
    isBackgroundMapVisible = true;

    if (!backgroundMap) {
        backgroundMap = new google.maps.Map(bgDiv, {
            center: { lat: centerLat, lng: centerLon },
            mapTypeId: 'satellite',
            disableDefaultUI: true,
            gestureHandling: 'none',
            keyboardShortcuts: false,
            clickableIcons: false,
            isFractionalZoomEnabled: true
        });
    } else {
        backgroundMap.setCenter({ lat: centerLat, lng: centerLon });
    }

    const bounds = new google.maps.LatLngBounds();
    geoPoints.forEach(p => bounds.extend({ lat: p.lat, lng: p.lon }));
    backgroundMap.fitBounds(bounds);

    google.maps.event.addListenerOnce(backgroundMap, 'idle', () => {
        syncBackgroundMap();
        draw();
    });
}

function syncBackgroundMap() {
    if (!backgroundMap || !isBackgroundMapVisible || !isMapReady) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Intrinsic canvas coordinate visible at screen center
    const screenCenterIntrinsicX = (containerWidth / 2 - panX) / zoomLevel;
    const screenCenterIntrinsicY = (containerHeight / 2 - panY) / zoomLevel;

    const dxFromCenter = screenCenterIntrinsicX - canvas.width / 2;
    const dyFromCenter = screenCenterIntrinsicY - canvas.height / 2;

    const baseMpp = parseFloat(inputScaleValue.value) / 37.8;
    const dxMeters = dxFromCenter * baseMpp;
    const dyMeters = dyFromCenter * baseMpp;

    const baseLat = window.kmlCenterLat || 0;
    const baseLon = window.kmlCenterLon || 0;
    const metersPerDegLat = 111000;
    const metersPerDegLon = 111000 * Math.cos(baseLat * Math.PI / 180);

    const visibleCenterLat = baseLat - dyMeters / metersPerDegLat;
    const visibleCenterLon = baseLon + dxMeters / metersPerDegLon;

    // Google Maps zoom that matches the current canvas pixel scale
    const screenPixelsPerMeter = zoomLevel / baseMpp;
    const cosLat = Math.cos(visibleCenterLat * Math.PI / 180);
    // Use fractional zoom for pixel-perfect alignment (no rounding)
    const gmZoom = Math.max(0, Math.min(21,
        Math.log2(screenPixelsPerMeter * 156543.03392 * cosLat)
    ));

    backgroundMap.setCenter({ lat: visibleCenterLat, lng: visibleCenterLon });
    backgroundMap.setZoom(gmZoom);
}

function hideBackgroundMap() {
    document.getElementById('background-map').style.display = 'none';
    isBackgroundMapVisible = false;
}

// Zoom Controls
function zoomAroundPoint(zoomFactor, cx, cy) {
    const intrinsicX = (cx - panX) / zoomLevel;
    const intrinsicY = (cy - panY) / zoomLevel;
    zoomLevel *= zoomFactor;
    panX = cx - intrinsicX * zoomLevel;
    panY = cy - intrinsicY * zoomLevel;
    draw();
    syncBackgroundMap();
}

function zoomAroundCenter(zoomFactor) {
    const rect = container.getBoundingClientRect();
    zoomAroundPoint(zoomFactor, rect.width / 2, rect.height / 2);
}

btnZoomIn.addEventListener('click', () => zoomAroundCenter(1.2));
btnZoomOut.addEventListener('click', () => zoomAroundCenter(1 / 1.2));

// Scroll wheel zoom (zoom toward mouse cursor)
container.addEventListener('wheel', (e) => {
    if (!isMapReady) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const rect = container.getBoundingClientRect();
    zoomAroundPoint(factor, e.clientX - rect.left, e.clientY - rect.top);
}, { passive: false });

// Clear Area
btnClearArea.addEventListener('click', () => {
    // 사용자 지정 영역 완전히 제거
    farmPolygons = [];
    kmlPolygon = [];
    currentPolygonIndex = -1;
    relayStations = [];
    btnOptimize.disabled = true;
    btnSaveResults.disabled = true;
    hideBackgroundMap();
    
    const t = i18n[currentLang];
    textTotalStations.innerHTML = `0<span class="unit">${t['unit_count']}</span>`;
    listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
    
    if (mode === 'drawing_polygon') {
        mode = 'idle';
        btnDrawPolygon.classList.remove('active');
        btnAddPolygon.classList.remove('active');
        btnDrawPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg> <span data-i18n="btn_draw_new">${t['btn_draw_new']}</span>`;
        btnAddPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> <span data-i18n="btn_draw_add">${t['btn_draw_add']}</span>`;
    }

    // Reset to initial state
    isMapReady = false;
    canvas.style.display = 'none';
    placeholder.style.display = 'flex';
    btnDrawPolygon.disabled = true;
    btnAddPolygon.disabled = true;
    btnClearArea.disabled = true;
    btnZoomIn.disabled = true;
    btnZoomOut.disabled = true;
    btnEditBs.disabled = true;
    zoomLevel = 1; panX = 0; panY = 0;
});

// Calculate how many meters one pixel represents
function getMetersPerPixel() {
    // Assuming standard screen DPI (96 PPI -> ~37.8 pixels per cm)
    // 1 cm = 37.8 pixels on average in browser space
    const pixelsPerCm = 37.8;
    
    // User says: 1 cm = [scaleValue] [scaleUnit]
    const val = parseFloat(inputScaleValue.value) || 100;
    const unit = inputScaleUnit.value;
    
    let metersPerCm = val;
    if (unit === 'km') {
        metersPerCm = val * 1000;
    }
    
    // metersPerCm / pixelsPerCm = meters / pixel
    return metersPerCm / pixelsPerCm;
}

// Format distance helper
function formatDistance(meters) {
    if (meters >= 1000) {
        return (meters / 1000).toFixed(2) + ' km';
    }
    return Math.round(meters) + ' m';
}

// Helper to end draw mode
function endDrawMode() {
    mode = 'idle';
    const t = i18n[currentLang];
    btnDrawPolygon.classList.remove('active');
    btnAddPolygon.classList.remove('active');
    btnDrawPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg> <span data-i18n="btn_draw_new">${t['btn_draw_new']}</span>`;
    btnAddPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> <span data-i18n="btn_draw_add">${t['btn_draw_add']}</span>`;
    
    // Cleanup empty polygons
    farmPolygons = farmPolygons.filter(p => p.length >= 3);
    currentPolygonIndex = -1;
    
    // Revert to KML if nothing was drawn
    if (farmPolygons.length === 0 && kmlPolygon.length > 2) {
        farmPolygons = [[...kmlPolygon]];
    }
    
    btnOptimize.disabled = farmPolygons.length === 0;
    draw();
}

// Helper to end edit mode
function endEditMode() {
    mode = 'idle';
    const t = i18n[currentLang];
    btnEditBs.classList.remove('active');
    btnEditBs.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/></svg> <span data-i18n="btn_edit_bs">${t['btn_edit_bs']}</span>`;
    
    if (isDraggingBs) {
        isDraggingBs = false;
        draggingBsId = null;
        canvas.style.cursor = 'grab';
    }
    draw();
}

// Canvas Interaction Tools
btnDrawPolygon.addEventListener('click', () => {
    const t = i18n[currentLang];
    if (mode === 'editing_bs') endEditMode();
    
    if (mode === 'drawing_polygon') {
        endDrawMode();
    } else {
        mode = 'drawing_polygon';
        btnDrawPolygon.classList.add('active');
        btnDrawPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${t['btn_draw_finish']}`;
        
        // "New Area" starts completely fresh
        farmPolygons = [];
        farmPolygons.push([]);
        currentPolygonIndex = 0;
        
        relayStations = [];
        textTotalStations.innerHTML = `0<span class="unit">${t['unit_count']}</span>`;
        listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
        btnOptimize.disabled = true;
        btnSaveResults.disabled = true;
    }
    draw();
});

btnAddPolygon.addEventListener('click', () => {
    const t = i18n[currentLang];
    if (mode === 'editing_bs') endEditMode();
    
    if (mode === 'drawing_polygon') {
        endDrawMode();
    } else {
        mode = 'drawing_polygon';
        btnAddPolygon.classList.add('active');
        btnAddPolygon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${t['btn_draw_finish']}`;
        
        // "Add Area" appends a new region
        farmPolygons.push([]);
        currentPolygonIndex = farmPolygons.length - 1;
        
        relayStations = []; // Need to recalculate
        textTotalStations.innerHTML = `0<span class="unit">${t['unit_count']}</span>`;
        listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
        btnOptimize.disabled = true;
        btnSaveResults.disabled = true;
    }
    draw();
});

btnEditBs.addEventListener('click', () => {
    const t = i18n[currentLang];
    if (mode === 'drawing_polygon') endDrawMode();

    if (mode === 'editing_bs') {
        endEditMode();
    } else {
        mode = 'editing_bs';
        btnEditBs.classList.add('active');
        btnEditBs.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span data-i18n="btn_draw_finish">${t['btn_draw_finish']}</span>`;
        canvas.style.cursor = 'crosshair';
        
        // Show alert instruction to the user
        alert("원하시는 기지국 위에 마우스 우클릭을 하여 집어들고 이동 후 다시 우클릭하여 놓으세요.");
    }
});

// Canvas Mouse Event Handlers (for drawing and panning)
canvas.addEventListener('mousedown', (e) => {
    if (!isMapReady) return;
    
    if (mode === 'idle') {
        isPanning = true;
        startPanX = e.clientX - panX;
        startPanY = e.clientY - panY;
        canvas.style.cursor = 'grabbing';
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isMapReady) return;
    
    if (isPanning && mode === 'idle') {
        panX = e.clientX - startPanX;
        panY = e.clientY - startPanY;
        draw();
    } else if (mode === 'drawing_polygon') {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panX) / zoomLevel;
        const y = (e.clientY - rect.top - panY) / zoomLevel;
        currentMousePos = { x, y };
        draw();
    } else if (mode === 'editing_bs' && isDraggingBs && draggingBsId !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panX) / zoomLevel;
        const y = (e.clientY - rect.top - panY) / zoomLevel;
        
        const rs = relayStations.find(r => r.id === draggingBsId);
        if (rs) {
            rs.x = x;
            rs.y = y;
            
            // Recalculate estimated Lat/Lon based on new pixel position relative to KML center
            const mpp = getMetersPerPixel();
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dxMeters = (rs.x - centerX) * mpp;
            const dyMeters = (rs.y - centerY) * mpp; 

            const baseLat = window.kmlCenterLat || 0;
            const baseLon = window.kmlCenterLon || 0;

            const metersPerDegLat = 111320;
            const metersPerDegLon = 40075000 * Math.cos(baseLat * Math.PI / 180) / 360;

            const simLat = baseLat - (dyMeters / metersPerDegLat);
            const simLon = baseLon + (dxMeters / metersPerDegLon);
            
            rs.lat = simLat.toFixed(5);
            rs.lon = simLon.toFixed(5);
            rs.label = `${rs.lat}, ${rs.lon}`;
        }
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isPanning) syncBackgroundMap();
    isPanning = false;
    canvas.style.cursor = mode === 'idle' ? 'grab' : 'crosshair';
});

canvas.addEventListener('mouseleave', () => {
    isPanning = false;
    currentMousePos = null;
    canvas.style.cursor = 'default';
    if (mode === 'drawing_polygon') draw();
});

canvas.addEventListener('click', (e) => {
    if (!isMapReady) return;
    if (isPanning) return; // Ignore click if we were panning

    const rect = canvas.getBoundingClientRect();
    
    // Convert screen coordinates to intrinsic image coordinates
    // screenX = intrinsicX * zoomLevel + panX
    const x = (e.clientX - rect.left - panX) / zoomLevel;
    const y = (e.clientY - rect.top - panY) / zoomLevel;

    if (mode === 'drawing_polygon' && currentPolygonIndex >= 0) {
        const poly = farmPolygons[currentPolygonIndex];
        
        // Check if we are close to the first point to close the polygon
        if (poly.length > 2) {
            const firstP = poly[0];
            const distPx = Math.sqrt(Math.pow(x - firstP.x, 2) + Math.pow(y - firstP.y, 2));
            const closeDistanceThreshold = 15 / zoomLevel; // 15px radius to close
            
            if (distPx < closeDistanceThreshold) {
                // User clicked near the start point. Close it.
                endDrawMode();
                return;
            }
        }
        
        poly.push({x, y});
        draw();
    }
});

// Right click: undo last polygon vertex while drawing, or drag base stations (contextmenu event)
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Stop normal right click menu
    if (!isMapReady) return;

    if (mode === 'drawing_polygon' && currentPolygonIndex >= 0) {
        const poly = farmPolygons[currentPolygonIndex];
        if (poly.length > 0) {
            poly.pop();
            draw();
        }
        return;
    }

    if (mode !== 'editing_bs') return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panX) / zoomLevel;
    const y = (e.clientY - rect.top - panY) / zoomLevel;
    
    if (!isDraggingBs) {
        // Find closest BS to grab
        let closest = null;
        let minDist = Infinity;
        const grabRadius = 15 / zoomLevel; // Allow picking up slightly generously
        
        relayStations.forEach(rs => {
            const dist = Math.sqrt(Math.pow(rs.x - x, 2) + Math.pow(rs.y - y, 2));
            if (dist < minDist && dist < grabRadius) {
                minDist = dist;
                closest = rs;
            }
        });
        
        if (closest) {
            isDraggingBs = true;
            draggingBsId = closest.id;
            canvas.style.cursor = 'move';
            
            // To ensure we see the label while moving, temporarily set it as search
            if (searchedBsId !== closest.id) {
                 searchedBsId = closest.id; 
            }
        }
    } else {
        // Drop it
        isDraggingBs = false;
        draggingBsId = null;
        canvas.style.cursor = 'crosshair';
        
        // Ensure all labels reappear if the single highlight was used just for dragging
        const searchInputStr = document.getElementById('search-bs-id').value.trim();
        if (!searchInputStr) {
           searchedBsId = null; 
        }
        
        // Update the list visually
        updateCoordinateList();
    }
    draw();
});

// Update the external coordinates list
function updateCoordinateList() {
    listCoordinates.innerHTML = '';
    if (relayStations.length === 0) {
        const t = i18n[currentLang];
        listCoordinates.innerHTML = `<li style="text-align: center; color: #64748b; padding: 10px 0;">${t['coord_list_empty']}</li>`;
    } else {
        relayStations.forEach(rs => {
            const li = document.createElement('li');
            li.style.padding = '6px 0';
            li.style.borderBottom = '1px solid #1e293b';
            li.innerHTML = `<strong style="color: #10b981;">BS ${rs.id}</strong> <br> <span style="font-family: monospace; font-size: 0.8rem; color: #cbd5e1;">${rs.lat}, ${rs.lon}</span>`;
            listCoordinates.appendChild(li);
        });
    }
}

// Drawing Logic
function draw() {
    if (!isMapReady) return;
    
    // Update Scale UI
    const baseMpp = parseFloat(inputScaleValue.value) || 100;
    const currentMetersPerCm = baseMpp / zoomLevel;
    
    const displayValue = document.getElementById('scale-display-value');
    const displayUnit = document.getElementById('scale-display-unit');
    
    if (displayValue && displayUnit) {
        if (currentMetersPerCm >= 1000) {
            displayValue.innerText = (currentMetersPerCm / 1000).toFixed(2);
            displayUnit.innerText = "km";
        } else {
            displayValue.innerText = currentMetersPerCm.toFixed(2);
            displayUnit.innerText = "m";
        }
    }
    
    // Clear & setup transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!imageObj) {
        if (isBackgroundMapVisible) {
            // Transparent so the background Google Map shows through
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);

    // Draw background image
    if (imageObj) {
        ctx.drawImage(imageObj, 0, 0);
    }
    
    // Draw KML Base Polygon (as background reference)
    if (kmlPolygon.length > 0) {
        ctx.beginPath();
        ctx.moveTo(kmlPolygon[0].x, kmlPolygon[0].y);
        for(let i=1; i<kmlPolygon.length; i++) {
            ctx.lineTo(kmlPolygon[i].x, kmlPolygon[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.strokeStyle = '#64748b'; // Muted grey for base KML
        ctx.lineWidth = 1 / zoomLevel; 
        ctx.stroke();
    }
    
    // Draw 1cm Scale Grid (Checkerboard, ~37.8 pixels per cm)
    if (isMapReady && (imageObj || kmlPolygon.length > 0)) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Overlay in absolute screen coordinates
        
        const PIXELS_PER_CM = 37.8;
        ctx.strokeStyle = isBackgroundMapVisible ? 'rgba(255,255,255,0.08)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        
        // Offset grid so it physically pans with the map, but stays 1cm fixed dynamically on screen
        const offsetX = panX % PIXELS_PER_CM;
        const offsetY = panY % PIXELS_PER_CM;
        
        ctx.beginPath();
        // Vertical lines
        for (let x = (offsetX >= 0 ? offsetX : offsetX + PIXELS_PER_CM); x <= canvas.width; x += PIXELS_PER_CM) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        // Horizontal lines
        for (let y = (offsetY >= 0 ? offsetY : offsetY + PIXELS_PER_CM); y <= canvas.height; y += PIXELS_PER_CM) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
        
        ctx.restore();
    }

    // Draw active user Polygons
    const mpp = getMetersPerPixel();
    
    farmPolygons.forEach((polygon, index) => {
        if (polygon.length > 0) {
            ctx.beginPath();
            ctx.moveTo(polygon[0].x, polygon[0].y);
            for(let i=1; i<polygon.length; i++) {
                ctx.lineTo(polygon[i].x, polygon[i].y);
            }
            
            // Only fill if not actively drawing this specific polygon or if it's finished
            if (mode !== 'drawing_polygon' || index !== currentPolygonIndex) {
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();
            }
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 3 / zoomLevel; // Keep line width visually consistent
            ctx.stroke();

            // Draw points and distance labels
            ctx.fillStyle = '#f59e0b';
            for(let i=0; i<polygon.length; i++) {
                const p = polygon[i];
                
                // Draw vertex
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5 / zoomLevel, 0, Math.PI*2);
                ctx.fill();
                
                // Highlight the first vertex if actively drawing to indicate "close shape"
                if (i === 0 && mode === 'drawing_polygon' && index === currentPolygonIndex && polygon.length > 2) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 12 / zoomLevel, 0, Math.PI*2);
                    ctx.strokeStyle = '#22c55e'; // Green pulse ring
                    ctx.lineWidth = 2 / zoomLevel;
                    ctx.stroke();
                }
                
                // Draw distance text along the segment
                if (i > 0) {
                    const prevP = polygon[i-1];
                    const dx = p.x - prevP.x;
                    const dy = p.y - prevP.y;
                    const distPx = Math.sqrt(dx*dx + dy*dy);
                    const distMeters = distPx * mpp;
                    
                    const midX = prevP.x + dx/2;
                    const midY = prevP.y + dy/2;
                    
                    const text = formatDistance(distMeters);
                    
                    ctx.save();
                    ctx.translate(midX, midY);
                    // Rotate text to align with line
                    let angle = Math.atan2(dy, dx);
                    if (angle > Math.PI/2 || angle < -Math.PI/2) {
                        angle += Math.PI; // Keep text upright
                    }
                    ctx.rotate(angle);
                    
                    const fontSize = Math.max(12, 14 / zoomLevel);
                    ctx.font = `bold ${fontSize}px Inter`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    
                    // Add text shadow background
                    ctx.shadowColor = "rgba(0,0,0,0.8)";
                    ctx.shadowBlur = 4;
                    ctx.fillStyle = '#22c55e'; // Bright green for distance
                    ctx.fillText(text, 0, -4 / zoomLevel);
                    ctx.restore();
                }
            }
            
            // Connect last point to first if complete
            if ((mode !== 'drawing_polygon' || index !== currentPolygonIndex) && polygon.length > 2) {
                const lastP = polygon[polygon.length-1];
                const firstP = polygon[0];
                const dx = firstP.x - lastP.x;
                const dy = firstP.y - lastP.y;
                const distPx = Math.sqrt(dx*dx + dy*dy);
                const distMeters = distPx * mpp;
                
                const midX = lastP.x + dx/2;
                const midY = lastP.y + dy/2;
                
                const text = formatDistance(distMeters);
                
                ctx.save();
                ctx.translate(midX, midY);
                let angle = Math.atan2(dy, dx);
                if (angle > Math.PI/2 || angle < -Math.PI/2) angle += Math.PI;
                ctx.rotate(angle);
                
                const fontSize = Math.max(12, 14 / zoomLevel);
                ctx.font = `bold ${fontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.shadowColor = "rgba(0,0,0,0.8)";
                ctx.shadowBlur = 4;
                ctx.fillStyle = '#22c55e'; // Bright green for distance
                ctx.fillText(text, 0, -4 / zoomLevel);
                ctx.restore();
            }

            // Draw real-time line to cursor if actively drawing this polygon
            if (mode === 'drawing_polygon' && index === currentPolygonIndex && currentMousePos && polygon.length > 0) {
                const prevP = polygon[polygon.length - 1];
                const dx = currentMousePos.x - prevP.x;
                const dy = currentMousePos.y - prevP.y;
                const distPx = Math.sqrt(dx*dx + dy*dy);
                const distMeters = distPx * mpp;

                ctx.beginPath();
                ctx.moveTo(prevP.x, prevP.y);
                ctx.lineTo(currentMousePos.x, currentMousePos.y);
                ctx.strokeStyle = '#3b82f6'; // Blue dashed line for active drawing
                ctx.setLineDash([5 / zoomLevel, 5 / zoomLevel]);
                ctx.lineWidth = 2 / zoomLevel;
                ctx.stroke();
                ctx.setLineDash([]); // Reset immediately
                
                // Draw mouse cursor point
                ctx.beginPath();
                ctx.arc(currentMousePos.x, currentMousePos.y, 4 / zoomLevel, 0, Math.PI*2);
                ctx.fillStyle = '#3b82f6';
                ctx.fill();

                // Draw real time distance right next to cursor
                const midX = prevP.x + dx/2;
                const midY = prevP.y + dy/2;
                const text = formatDistance(distMeters);
                
                ctx.save();
                ctx.translate(midX, midY);
                let angle = Math.atan2(dy, dx);
                if (angle > Math.PI/2 || angle < -Math.PI/2) angle += Math.PI;
                ctx.rotate(angle);
                
                const fontSize = Math.max(12, 14 / zoomLevel);
                ctx.font = `bold ${fontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.shadowColor = "rgba(0,0,0,0.8)";
                ctx.shadowBlur = 4;
                ctx.fillStyle = '#22c55e';
                ctx.fillText(formatDistance(distMeters), 0, -4 / zoomLevel);
                ctx.restore();
            }
        }
    });

    // Draw Relays and Coverage
    if (relayStations.length > 0) {
        const mpp = getMetersPerPixel();
        const bleRangePx = parseFloat(inputBleRange.value) / mpp;
        
        ctx.textAlign = 'center';
        
        relayStations.forEach(p => {
            const isSearched = (p.id === searchedBsId);

            // Draw coverage circle
            ctx.beginPath();
            ctx.arc(p.x, p.y, bleRangePx, 0, Math.PI*2);
            ctx.fillStyle = isSearched ? 'rgba(6, 182, 212, 0.25)' : 'rgba(59, 130, 246, 0.15)'; // Cyan if searched
            ctx.fill();
            ctx.strokeStyle = isSearched ? '#06b6d4' : 'rgba(59, 130, 246, 0.8)';
            ctx.lineWidth = 2 / zoomLevel;
            ctx.stroke();

            // Draw station point
            // By using a smaller power (0.3), the marker naturally shrinks visually when zooming out
            const dotSize = Math.max(2, 6 / Math.pow(zoomLevel, 0.4));
            ctx.beginPath();
            ctx.arc(p.x, p.y, dotSize, 0, Math.PI*2);
            ctx.fillStyle = isSearched ? '#06b6d4' : '#10b981'; // Cyan or Green
            ctx.fill();
            // Draw small dot inside
            ctx.beginPath();
            ctx.arc(p.x, p.y, dotSize * 0.4, 0, Math.PI*2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            
            // BS label: Only show ALL if no search is active, OR if this is the actively searched one
            if (searchedBsId === null || isSearched) {
                ctx.shadowColor = "black";
                ctx.shadowBlur = Math.max(2, 4 * zoomLevel);
                ctx.fillStyle = isSearched ? '#67e8f9' : 'white';
                
                // Dynamically scale font to prevent overwhelming overlap when zoomed out
                // Using power 0.4 means the text visually shrinks when zoomed out and grows when zoomed in
                const scaleFactor = Math.pow(zoomLevel, 0.4);
                // Halved font size per user request
                const fontSize = Math.max(2, 7 / scaleFactor);
                ctx.font = `bold ${fontSize}px Inter`;
                
                // Keep the text much closer to the dot
                const textOffset = dotSize + (fontSize * 0.4);
                
                // Drop the 'BS ' prefix, just show the number to save massive screen space
                const labelStr = `${p.id}`;
                
                if (isSearched) {
                    // Determine text drawing location, lifting the main label slightly to make room
                    const searchLiftOffset = textOffset + (fontSize * 1.0);
                    ctx.fillText(labelStr, p.x, p.y - searchLiftOffset);
                    
                    // Draw Lat/Lon immediately below the BS label
                    const fontSmall = Math.max(1, 5 / scaleFactor);
                    ctx.font = `bold ${fontSmall}px monospace`;
                    ctx.fillStyle = '#a5f3fc'; // lighter cyan
                    ctx.fillText(p.label, p.x, p.y - textOffset);
                } else {
                    ctx.fillText(labelStr, p.x, p.y - textOffset);
                }
                
                ctx.shadowBlur = 0; // reset
            }
        });
    }
    
    // Reset transform for next frame
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Ray Casting algorithm to check if point is in polygon
function isPointInPolygon(point, vs) {
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].x, yi = vs[i].y;
        let xj = vs[j].x, yj = vs[j].y;
        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Centroid of a simple polygon (falls back to vertex average for degenerate shapes)
function polygonCentroid(polygon) {
    let area = 0, cx = 0, cy = 0;
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
        const p1 = polygon[i];
        const p2 = polygon[(i + 1) % n];
        const cross = p1.x * p2.y - p2.x * p1.y;
        area += cross;
        cx += (p1.x + p2.x) * cross;
        cy += (p1.y + p2.y) * cross;
    }
    area *= 0.5;
    if (Math.abs(area) < 1e-6) {
        return polygon.reduce((acc, p) => ({ x: acc.x + p.x / n, y: acc.y + p.y / n }), { x: 0, y: 0 });
    }
    return { x: cx / (6 * area), y: cy / (6 * area) };
}

// Coordinate Calculation Logic
btnOptimize.addEventListener('click', optimizeGrid);

function optimizeGrid() {
    if (farmPolygons.length === 0) return;

    relayStations = [];
    const bleRangeMeters = parseFloat(inputBleRange.value);
    const overlapMeters = parseFloat(inputOverlap.value);
    const mpp = getMetersPerPixel();
    
    // Effective radius to cover
    const effectiveRadiusM = bleRangeMeters - overlapMeters;
    
    const rPx = effectiveRadiusM / mpp;
    if (rPx <= 0) {
        alert("거리 설정이 잘못되었습니다.");
        return;
    }

    // Process each polygon separately
    farmPolygons.forEach((polygon) => {
        if (polygon.length < 3) return; // Skip incomplete
        
        // Find bounding box for this polygon
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        polygon.forEach(p => {
            if(p.x < minX) minX = p.x;
            if(p.y < minY) minY = p.y;
            if(p.x > maxX) maxX = p.x;
            if(p.y > maxY) maxY = p.y;
        });

        const w = rPx * Math.sqrt(3);
        const h = rPx * 1.5;
        
        // Simulated Lat/Lon center
        // Use KML center or default to Asuncion, Paraguay
        const baseLat = window.kmlCenterLat || -25.2637;
        const baseLon = window.kmlCenterLon || -57.5759;
        
        // 1 Degree Latitude is approx 111km (111000m)
        // 1 Degree Longitude is approx 111km * cos(lat)
        const metersPerDegLat = 111000;
        const metersPerDegLon = 111000 * Math.cos(baseLat * Math.PI / 180);

        const toLatLon = (x, y) => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dxMeters = (x - centerX) * mpp;
            const dyMeters = (y - centerY) * mpp;
            return {
                lat: baseLat - (dyMeters / metersPerDegLat),
                lon: baseLon + (dxMeters / metersPerDegLon)
            };
        };

        let stationsAddedForPolygon = 0;

        for (let row = 0; minY + row * h < maxY + h; row++) {
            let y = minY + row * h;
            for (let col = 0; minX + col * w < maxX + w; col++) {
                let x = minX + col * w;
                if (row % 2 !== 0) {
                    x += w / 2;
                }
                if (isPointInPolygon({x,y}, polygon)) {

                    const { lat: simLat, lon: simLon } = toLatLon(x, y);
                    const label = `${simLat.toFixed(5)}, ${simLon.toFixed(5)}`;

                    // Only add if it's not too close to a relay from a PREVIOUS polygon (prevent dupes in overlaps)
                    const isTooCloseToExisting = relayStations.some(rs => {
                        const dist = Math.sqrt(Math.pow(rs.x - x, 2) + Math.pow(rs.y - y, 2));
                        return dist < rPx;
                    });

                    if (!isTooCloseToExisting) {
                        relayStations.push({
                            id: relayStations.length + 1,
                            x,
                            y,
                            lat: simLat.toFixed(5),
                            lon: simLon.toFixed(5),
                            label
                        });
                        stationsAddedForPolygon++;
                    }
                }
            }
        }

        // Area smaller than the grid spacing (e.g. area < BS radius) can leave a
        // polygon with zero stations. Guarantee at least one, placed at its center.
        if (stationsAddedForPolygon === 0) {
            let center = polygonCentroid(polygon);
            if (!isPointInPolygon(center, polygon)) {
                center = polygon.reduce((acc, p) => ({ x: acc.x + p.x / polygon.length, y: acc.y + p.y / polygon.length }), { x: 0, y: 0 });
            }
            const { lat: simLat, lon: simLon } = toLatLon(center.x, center.y);
            relayStations.push({
                id: relayStations.length + 1,
                x: center.x,
                y: center.y,
                lat: simLat.toFixed(5),
                lon: simLon.toFixed(5),
                label: `${simLat.toFixed(5)}, ${simLon.toFixed(5)}`
            });
        }
    });

    // Update UI
    textTotalStations.innerHTML = `${relayStations.length}<span class="unit">${i18n[currentLang]['unit_count']}</span>`;
    
    // Update List
    updateCoordinateList();
    if (relayStations.length > 0) {
        btnSaveResults.disabled = false;
        btnEditBs.disabled = false;
    } else {
        btnSaveResults.disabled = true;
        btnEditBs.disabled = true;
    }
    
    draw();
}

// Search Base Station feature
btnSearchBs.addEventListener('click', () => {
    const idToFind = parseInt(inputSearchBs.value);
    if (isNaN(idToFind)) return;
    
    // Find base station with that ID
    const target = relayStations.find(rs => rs.id === idToFind);
    
    if (!target) {
        alert(i18n[currentLang]['alert_bs_not_found']);
        return;
    }
    
    // Set active searched BS
    searchedBsId = target.id;
    btnClearSearch.style.display = 'block';
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // panX needed to make target.x screen center:
    panX = (containerWidth / 2) - (target.x * zoomLevel);
    panY = (containerHeight / 2) - (target.y * zoomLevel);
    
    draw();
});

// Clear Search logic
btnClearSearch.addEventListener('click', () => {
    searchedBsId = null;
    inputSearchBs.value = '';
    btnClearSearch.style.display = 'none';
    
    // Reset zoom and pan to fit whole KML bounds or canvas
    const margin = 20;
    zoomLevel = Math.min(
        (container.clientWidth - margin * 2) / canvas.width,
        (container.clientHeight - margin * 2) / canvas.height
    );
    if (zoomLevel > 1) zoomLevel = 1.0;
    
    panX = (container.clientWidth - canvas.width * zoomLevel) / 2;
    panY = (container.clientHeight - canvas.height * zoomLevel) / 2;
    
    draw();
});

// Allow hitting Enter in search input
inputSearchBs.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSearchBs.click();
    }
});

// Full Project Export Logic
btnSaveResults.addEventListener('click', async () => {
    if (relayStations.length === 0 && farmPolygons.length === 0) return;
    
    const farmName = document.getElementById('farm-name').value.trim() || '목장_결과';
    
    const projectData = {
        version: "1.1",
        farmName: farmName,
        bleRange: inputBleRange.value,
        overlapRange: inputOverlap.value,
        scaleValue: inputScaleValue.value,
        scaleUnit: inputScaleUnit.value,
        kmlCenterLat: window.kmlCenterLat,
        kmlCenterLon: window.kmlCenterLon,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        zoomLevel: zoomLevel,
        panX: panX,
        panY: panY,
        kmlPolygon: kmlPolygon,
        farmPolygons: farmPolygons,
        relayStations: relayStations,
        backgroundImageData: imageObj ? imageObj.src : null
    };
    
    const jsonString = JSON.stringify(projectData);
    const blob = new Blob([jsonString], {type: "application/json"});
    
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}`;
    const defaultFileName = `${farmName}_${dateStr}.sjit`;

    try {
        if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
                suggestedName: defaultFileName,
                types: [{
                    description: 'SJIT Project File',
                    accept: {'application/json': ['.sjit']}
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            
            // Show localized success message optionally, but basic saving is enough without noise.
        } else {
            // Fallback for browsers that don't support showSaveFilePicker
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", defaultFileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Save failed:", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    }
});

// Full Project Import Logic
dataUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const projectData = JSON.parse(event.target.result);
            
            // Restore UI Inputs
            document.getElementById('farm-name').value = projectData.farmName || "";
            inputBleRange.value = projectData.bleRange || 500;
            inputOverlap.value = projectData.overlapRange || 50;
            inputScaleValue.value = projectData.scaleValue || 100;
            inputScaleUnit.value = projectData.scaleUnit || "m";
            
            // Restore Map Dimensions & Geometry State
            canvas.width = projectData.canvasWidth || 1200;
            canvas.height = projectData.canvasHeight || 800;
            window.kmlCenterLat = projectData.kmlCenterLat;
            window.kmlCenterLon = projectData.kmlCenterLon;
            
            zoomLevel = projectData.zoomLevel || 1.0;
            panX = projectData.panX || 0;
            panY = projectData.panY || 0;
            
            kmlPolygon = projectData.kmlPolygon || [];
            farmPolygons = projectData.farmPolygons || [];
            relayStations = projectData.relayStations || [];
            currentPolygonIndex = -1;
            
            canvas.style.display = 'block';
            placeholder.style.display = 'none';
            
            // Re-bind image if it was present
            if (projectData.backgroundImageData) {
                const img = new Image();
                img.onload = () => {
                    imageObj = img;
                    isMapReady = true;
                    finishLoad(projectData);
                };
                img.src = projectData.backgroundImageData;
            } else {
                imageObj = null;
                isMapReady = true;
                finishLoad(projectData);
            }
            
        } catch (err) {
            alert(i18n[currentLang]['alert_proj_invalid']);
            console.error(err);
        }
        
        // Reset file input
        e.target.value = '';
    };
    reader.readAsText(file);
});

function finishLoad(data) {
    // Enable buttons
    btnDrawPolygon.disabled = false;
    btnAddPolygon.disabled = false;
    btnClearArea.disabled = false;
    btnZoomIn.disabled = false;
    btnZoomOut.disabled = false;
    
    // Update List
    updateCoordinateList();
    if (relayStations.length > 0) {
        textTotalStations.innerHTML = `${relayStations.length}<span class="unit">${i18n[currentLang]['unit_count']}</span>`;
        btnOptimize.disabled = false;
        btnSaveResults.disabled = false;
        btnEditBs.disabled = false;
    } else {
        textTotalStations.innerHTML = `0<span class="unit">${i18n[currentLang]['unit_count']}</span>`;
        btnOptimize.disabled = farmPolygons.length === 0;
        btnSaveResults.disabled = true;
        btnEditBs.disabled = true;
    }
    
    draw();
    alert(`${data.farmName || "프로젝트"} ` + i18n[currentLang]['alert_load_success']);
}

// Listen to input changes to redraw automatically
[inputBleRange, inputOverlap, inputScaleValue, inputScaleUnit].forEach(input => {
    input.addEventListener('change', () => {
        const validPolys = farmPolygons.filter(p => p.length >= 3);
        if (validPolys.length > 0) {
            optimizeGrid();
        }
    });
});
