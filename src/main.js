import { geoMercator, geoPath } from "d3-geo";
import {
  ERAS,
  provinceByCode,
  summarizeChanges,
  unitFor,
  validate,
} from "./data.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const wrap = document.querySelector("#map-wrap");
const svg = document.querySelector("#map");
const tooltip = document.querySelector("#tooltip");
const panel = document.querySelector("#panel");
const timeline = document.querySelector("#timeline");
const cartouche = document.querySelector("#cartouche");
const statusEl = document.querySelector("#status");
const searchInput = document.querySelector("#search");
const modernButton = document.querySelector("#toggle-modern");
const playButton = document.querySelector("#play");
const resetButton = document.querySelector("#reset-view");

const state = {
  eraIndex: initialEra(),
  selectedAdcode: null,
  selectedUnitId: null,
  hoverCodes: new Set(),
  query: "",
  showModern: false,
  playing: false,
  timer: 0,
};

const view = { x: 0, y: 0, k: 1 };
let projection = geoMercator();
let path = geoPath(projection);
let features = [];
let width = 800;
let height = 600;
let drag = null;
let suppressClick = false;

const errors = validate();
if (errors.length) {
  statusEl.textContent = errors.slice(0, 4).join("；");
  throw new Error(errors.join("\n"));
}

init().catch((error) => {
  statusEl.hidden = false;
  statusEl.textContent = error.message || "地圖載入失敗";
});

async function init() {
  const response = await fetch(`${import.meta.env.BASE_URL}china.json`);
  if (!response.ok) throw new Error("地圖資料載入失敗");
  const geo = await response.json();
  features = geo.features.map(sanitize).filter(Boolean);
  const viewport = el("g");
  viewport.id = "viewport";
  const sea = el("rect");
  sea.id = "sea";
  const layer = el("g");
  layer.id = "provinces";
  const points = el("g");
  points.id = "points";
  const labels = el("g");
  labels.id = "labels";
  const defs = el("defs");
  defs.id = "defs";
  svg.append(defs, viewport);
  viewport.append(sea, layer, points, labels);

  for (const feature of features) {
    const shape = el("path");
    shape.classList.add("province");
    shape.dataset.adcode = String(feature.properties.adcode);
    layer.append(shape);
  }

  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("pointermove", onPointerMove);
  svg.addEventListener("pointerup", onPointerUp);
  svg.addEventListener("pointerleave", () => {
    state.hoverCodes = new Set();
    hideTooltip();
    paintInteraction();
  });
  svg.addEventListener("wheel", onWheel, { passive: false });
  svg.addEventListener("click", onMapClick);

  panel.addEventListener("click", onPanelClick);
  panel.addEventListener("mouseover", onPanelHover);
  panel.addEventListener("mouseout", (event) => {
    if (event.target.closest("[data-unit]")) {
      state.hoverCodes = new Set();
      paintInteraction();
    }
  });
  timeline.addEventListener("click", onTimelineClick);
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim();
    renderPanel();
    paintInteraction();
  });
  modernButton.addEventListener("click", () => {
    state.showModern = !state.showModern;
    modernButton.setAttribute("aria-pressed", String(state.showModern));
    drawLabels();
  });
  playButton.addEventListener("click", () => {
    state.playing ? stopPlay() : startPlay();
  });
  resetButton.addEventListener("click", resetView);
  window.addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPlay();
  });
  new ResizeObserver(layout).observe(wrap);
  layout();
  render();
  statusEl.hidden = true;
}

function initialEra() {
  const id = new URLSearchParams(location.search).get("era");
  const index = ERAS.findIndex((era) => era.id === id);
  return index >= 0 ? index : 0;
}

function layout() {
  width = Math.max(wrap.clientWidth, 320);
  height = Math.max(wrap.clientHeight, 320);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const sea = svg.querySelector("#sea");
  sea.setAttribute("x", -2000);
  sea.setAttribute("y", -2000);
  sea.setAttribute("width", 8000);
  sea.setAttribute("height", 8000);
  sea.setAttribute("fill", "#d5e4ea");
  projection = geoMercator();
  projection.fitExtent([[28, 28], [width - 28, height - 24]], {
    type: "FeatureCollection",
    features,
  });
  path = geoPath(projection);
  for (const feature of features) {
    const shape = svg.querySelector(`[data-adcode="${feature.properties.adcode}"]`);
    shape.setAttribute("d", path(feature));
  }
  applyView();
  drawLabels();
  drawPoints();
}

function render() {
  const era = currentEra();
  const previous = ERAS[state.eraIndex - 1];
  const changed = new Set();
  if (previous) {
    for (const feature of features) {
      const code = feature.properties.adcode;
      const before = unitFor(previous, code);
      const after = unitFor(era, code);
      if (before && after && before.name !== after.name) changed.add(code);
    }
  }
  buildPatterns(era);
  for (const feature of features) {
    const code = feature.properties.adcode;
    const unit = unitFor(era, code);
    const shape = svg.querySelector(`[data-adcode="${code}"]`);
    shape.style.fill = fillFor(era, unit);
    shape.classList.toggle("is-changed", changed.has(code));
  }
  drawPoints();
  drawLabels();
  paintInteraction();
  renderCartouche();
  renderPanel();
  renderTimeline();
  const url = new URL(location.href);
  url.searchParams.set("era", era.id);
  history.replaceState(null, "", url);
  document.title = `${era.dynasty} ${era.yearText} · 省界千年`;
}

function paintInteraction() {
  const era = currentEra();
  const selected = selectedCodes();
  const queryCodes = matchCodes(state.query);
  const active = state.hoverCodes.size
    ? state.hoverCodes
    : selected.size
      ? selected
      : queryCodes;
  const dim = active.size > 0;
  for (const feature of features) {
    const code = feature.properties.adcode;
    const shape = svg.querySelector(`[data-adcode="${code}"]`);
    const on = active.has(code);
    shape.classList.toggle("is-dim", dim && !on);
    shape.classList.toggle("is-selected", selected.has(code));
    shape.classList.toggle("is-hover", state.hoverCodes.has(code));
  }
  for (const row of panel.querySelectorAll("[data-unit]")) {
    const codes = row.dataset.codes.split(",").map(Number);
    row.classList.toggle("is-on", codes.some((code) => selected.has(code) || state.hoverCodes.has(code)));
  }
}

function selectedCodes() {
  const era = currentEra();
  if (state.selectedUnitId) {
    const unit = era.units.find((item) => item.id === state.selectedUnitId);
    return new Set(unit ? unit.adcodes : []);
  }
  if (state.selectedAdcode) {
    const unit = unitFor(era, state.selectedAdcode);
    return new Set(unit ? unit.adcodes : [state.selectedAdcode]);
  }
  return new Set();
}

function renderCartouche() {
  const era = currentEra();
  cartouche.innerHTML = `
    <p class="dynasty">${esc(era.dynasty)}</p>
    <p class="system">${esc(era.headline)}</p>
    <p class="yearline">${esc(era.yearText)} · ${esc(era.system)}</p>
  `;
}

function renderPanel() {
  const era = currentEra();
  if (state.selectedAdcode && !state.query) {
    renderLineage();
    return;
  }
  const previous = ERAS[state.eraIndex - 1];
  const changes = summarizeChanges(previous, era);
  const units = filterUnits(era, state.query);
  const elsewhere = state.query ? eraWithQuery(state.query, era.id) : null;
  panel.innerHTML = `
    <p class="kicker">${esc(era.dynasty)} · ${esc(era.system)}</p>
    <h2>${esc(era.headline)}</h2>
    <p class="yearline">${esc(era.yearText)}</p>
    <p class="story">${esc(era.body)}</p>
    ${changes.length ? `<section class="panel-block"><h3>相對上一時期</h3><ul class="changes">${changes.map((line) => `<li>${esc(line)}</li>`).join("")}</ul></section>` : ""}
    <section class="panel-block">
      <h3>這一時期的區劃</h3>
      ${units.length ? `<ul class="units">${units.map(unitRow).join("")}</ul>` : `<p class="hint">這一時期沒有「${esc(state.query)}」。</p>`}
      ${elsewhere ? `<button class="jump" type="button" data-goto-era="${elsewhere.id}">去${esc(elsewhere.dynasty)}看「${esc(state.query)}」</button>` : ""}
    </section>
    <p class="hint">點地圖上的省，看這塊地方歷代叫什麼。滾輪放大，拖動可平移。</p>
    ${disclaimer()}
  `;
}

function renderLineage() {
  const province = provinceByCode(state.selectedAdcode);
  const era = currentEra();
  const rows = ERAS.map((item) => {
    const unit = unitFor(item, province.adcode);
    const mates = unit.adcodes
      .filter((code) => code !== province.adcode)
      .map((code) => provinceByCode(code).name);
    const mateText = mates.length > 5
      ? `${mates.slice(0, 5).join("、")}等 ${mates.length} 處`
      : mates.join("、");
    return `
      <li>
        <button type="button" data-era-jump="${item.id}" class="${item.id === era.id ? "is-on" : ""}">
          <i class="swatch" style="${swatchStyle(item, unit)}"></i>
          <span><b>${esc(item.yearText)} ${esc(item.dynasty)}</b>　${esc(unit.short || unit.name)}</span>
          <small>${esc(unit.name)}${unit.note ? `。${esc(unit.note)}` : ""}${mateText ? ` 同屬：${esc(mateText)}` : ""}</small>
        </button>
      </li>`;
  }).join("");
  panel.innerHTML = `
    <button class="back" type="button" data-back>返回這一時期</button>
    <p class="kicker">${esc(province.level)}</p>
    <h2>${esc(province.full)}</h2>
    <p class="story">下面是同一塊今日省界，在各個年代被劃進哪個名字。斜線代表當時這一省裡其實有分界。</p>
    <ul class="lineage">${rows}</ul>
    ${disclaimer()}
  `;
}

function unitRow(unit) {
  const names = unit.adcodes.map((code) => provinceByCode(code).name).join("、");
  return `
    <li>
      <button class="unit" type="button" data-unit="${esc(unit.id)}" data-codes="${unit.adcodes.join(",")}">
        <i class="swatch" style="${swatchStyle(currentEra(), unit)}"></i>
        <span>${esc(unit.name)}</span>
        <small>${esc(names)}${unit.note ? `。${esc(unit.note)}` : ""}</small>
      </button>
    </li>`;
}

function renderTimeline() {
  const era = currentEra();
  timeline.innerHTML = `
    <button class="step" type="button" data-step="-1" aria-label="上一個時期">‹</button>
    <div class="era-row">
      ${ERAS.map((item) => `
        <button class="era ${item.id === era.id ? "is-on" : ""}" type="button" data-era="${item.id}">
          <strong>${esc(item.tick)}</strong>
          <span>${esc(item.yearText)}</span>
        </button>`).join("")}
    </div>
    <button class="step" type="button" data-step="1" aria-label="下一個時期">›</button>
  `;
}

function drawLabels() {
  const layer = svg.querySelector("#labels");
  layer.replaceChildren();
  const era = currentEra();
  const placed = [];
  const candidates = [];
  for (const unit of era.units) {
    const text = unit.short || unit.name;
    const members = features.filter((feature) => unit.adcodes.includes(feature.properties.adcode));
    if (!members.length) continue;
    const separate = unit.kind === "outer" || unit.kind === "split" || members.length === 1;
    const anchors = separate ? members : [largest(members)];
    for (const feature of anchors) {
      const center = feature.properties.center;
      if (!center) continue;
      const [x, y] = projection(center);
      candidates.push({
        x,
        y,
        text,
        size: members.length > 1 && !separate ? 16 : 13,
        priority: areaOf(feature) + (separate ? 0 : 1e12),
        modern: false,
      });
    }
  }
  if (state.showModern && era.id !== "now") {
    for (const feature of features) {
      const province = provinceByCode(feature.properties.adcode);
      const [x, y] = projection(feature.properties.center);
      candidates.push({
        x,
        y: y + 14,
        text: province.name,
        size: 10,
        priority: areaOf(feature) / 4,
        modern: true,
      });
    }
  }
  if (era.points) {
    for (const point of era.points) {
      const [x, y] = projection([point.lon, point.lat]);
      if ((point.priority || 1) < 4) continue;
      candidates.push({
        x,
        y: y - 11,
        text: point.name,
        size: 12,
        priority: (point.priority || 1) * 1e10,
        modern: false,
        point: true,
      });
    }
  }
  candidates.sort((a, b) => b.priority - a.priority);
  for (const candidate of candidates) {
    const spot = findSpot(candidate, placed);
    if (!spot) continue;
    const label = el("text");
    label.classList.add("map-label");
    if (candidate.modern) label.classList.add("modern");
    label.setAttribute("x", spot.x);
    label.setAttribute("y", spot.y);
    label.setAttribute("font-size", candidate.size);
    label.textContent = candidate.text;
    layer.append(label);
  }
  scaleLabels();
}

function drawPoints() {
  const layer = svg.querySelector("#points");
  layer.replaceChildren();
  const era = currentEra();
  if (!era.points) return;
  for (const point of era.points) {
    const [x, y] = projection([point.lon, point.lat]);
    const dot = el("circle");
    dot.classList.add("qin-point");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 3.2);
    dot.dataset.name = point.name;
    dot.dataset.seat = point.seat || "";
    dot.dataset.note = point.note || "";
    layer.append(dot);
  }
  scaleLabels();
}

function scaleLabels() {
  const k = view.k;
  for (const label of svg.querySelectorAll(".map-label")) {
    const x = label.getAttribute("x");
    const y = label.getAttribute("y");
    label.setAttribute("transform", `translate(${x} ${y}) scale(${1 / k}) translate(${-x} ${-y})`);
  }
  for (const dot of svg.querySelectorAll(".qin-point")) {
    dot.setAttribute("r", 3.4 / k);
    dot.setAttribute("stroke-width", 1 / k);
  }
}

function buildPatterns(era) {
  const defs = svg.querySelector("#defs");
  defs.replaceChildren();
  for (const unit of era.units) {
    if (unit.kind !== "split") continue;
    const pattern = el("pattern");
    pattern.id = patternId(unit);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "8");
    pattern.setAttribute("height", "8");
    const rect = el("rect");
    rect.setAttribute("width", "8");
    rect.setAttribute("height", "8");
    rect.setAttribute("fill", unit.color);
    const lines = el("path");
    lines.setAttribute("d", "M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4");
    lines.setAttribute("stroke", "#f4ecde");
    lines.setAttribute("stroke-width", "2");
    pattern.append(rect, lines);
    defs.append(pattern);
  }
}

function fillFor(era, unit) {
  if (!unit || unit.kind === "outer") return "#e4d8c4";
  if (unit.kind === "split") return `url(#${patternId(unit)})`;
  if (unit.kind === "frontier") return mix(unit.color, 0.4);
  return unit.color;
}

function patternId(unit) {
  return `hatch-${unit.id}`;
}

function onMapClick(event) {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  const shape = event.target.closest(".province");
  if (!shape) {
    state.selectedAdcode = null;
    state.selectedUnitId = null;
    state.query = "";
    searchInput.value = "";
    renderPanel();
    paintInteraction();
    return;
  }
  state.selectedAdcode = Number(shape.dataset.adcode);
  state.selectedUnitId = unitFor(currentEra(), state.selectedAdcode)?.id || null;
  state.query = "";
  searchInput.value = "";
  renderPanel();
  paintInteraction();
}

function onPointerDown(event) {
  drag = { x: event.clientX, y: event.clientY, ox: view.x, oy: view.y, moved: false };
  svg.classList.add("is-dragging");
  svg.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  const shape = event.target.closest(".province");
  const dot = event.target.closest(".qin-point");
  if (dot) {
    showTooltip(event, `<strong>${esc(dot.dataset.name)}</strong><p>${esc(dot.dataset.seat)}${dot.dataset.note ? `。${esc(dot.dataset.note)}` : ""}</p>`);
  } else if (shape && !drag?.moved) {
    const code = Number(shape.dataset.adcode);
    const province = provinceByCode(code);
    const unit = unitFor(currentEra(), code);
    const mates = unit.adcodes.map((item) => provinceByCode(item).name).join("、");
    showTooltip(event, `<strong>${esc(province.full)}</strong><p>${esc(currentEra().dynasty)} · ${esc(unit.name)}</p><p>今日範圍對應：${esc(mates)}</p>${unit.note ? `<p>${esc(unit.note)}</p>` : ""}`);
    state.hoverCodes = new Set([code]);
    paintInteraction();
  } else if (!drag) {
    hideTooltip();
  }
  if (!drag) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (Math.hypot(dx, dy) > 4) drag.moved = true;
  if (!drag.moved) return;
  view.x = drag.ox + dx;
  view.y = drag.oy + dy;
  applyView();
}

function onPointerUp() {
  suppressClick = Boolean(drag?.moved);
  drag = null;
  svg.classList.remove("is-dragging");
}

function onWheel(event) {
  event.preventDefault();
  const rect = svg.getBoundingClientRect();
  const mx = ((event.clientX - rect.left) / rect.width) * width;
  const my = ((event.clientY - rect.top) / rect.height) * height;
  const next = clamp(view.k * (event.deltaY < 0 ? 1.12 : 0.9), 1, 8);
  const ratio = next / view.k;
  view.x = mx - ratio * (mx - view.x);
  view.y = my - ratio * (my - view.y);
  view.k = next;
  if (view.k === 1) {
    view.x = 0;
    view.y = 0;
  }
  applyView();
}

function applyView() {
  svg.querySelector("#viewport").setAttribute("transform", `translate(${view.x} ${view.y}) scale(${view.k})`);
  scaleLabels();
}

function resetView() {
  view.x = 0;
  view.y = 0;
  view.k = 1;
  applyView();
}

function onPanelClick(event) {
  const back = event.target.closest("[data-back]");
  const jump = event.target.closest("[data-era-jump]");
  const goto = event.target.closest("[data-goto-era]");
  const unitButton = event.target.closest("[data-unit]");
  if (back) {
    state.selectedAdcode = null;
    state.selectedUnitId = null;
    renderPanel();
    paintInteraction();
  } else if (jump) {
    setEra(ERAS.findIndex((era) => era.id === jump.dataset.eraJump));
  } else if (goto) {
    state.query = "";
    searchInput.value = "";
    setEra(ERAS.findIndex((era) => era.id === goto.dataset.gotoEra));
  } else if (unitButton) {
    state.selectedUnitId = unitButton.dataset.unit;
    state.selectedAdcode = null;
    paintInteraction();
    renderPanel();
    state.selectedUnitId = unitButton.dataset.unit;
    paintInteraction();
  }
}

function onPanelHover(event) {
  const row = event.target.closest("[data-unit]");
  if (!row) return;
  state.hoverCodes = new Set(row.dataset.codes.split(",").map(Number));
  paintInteraction();
}

function onTimelineClick(event) {
  const step = event.target.closest("[data-step]");
  const eraButton = event.target.closest("[data-era]");
  if (step) setEra(state.eraIndex + Number(step.dataset.step));
  if (eraButton) setEra(ERAS.findIndex((era) => era.id === eraButton.dataset.era));
}

function onKey(event) {
  const typing = event.target.matches("input, textarea");
  if (event.key === "ArrowRight" && !typing) setEra(state.eraIndex + 1);
  if (event.key === "ArrowLeft" && !typing) setEra(state.eraIndex - 1);
  if (event.key === " " && !typing) {
    event.preventDefault();
    state.playing ? stopPlay() : startPlay();
  }
  if (event.key === "Escape") {
    state.selectedAdcode = null;
    state.selectedUnitId = null;
    state.query = "";
    searchInput.value = "";
    resetView();
    renderPanel();
    paintInteraction();
  }
}

function setEra(index) {
  const next = (index + ERAS.length) % ERAS.length;
  if (next === state.eraIndex) return;
  state.eraIndex = next;
  if (state.selectedAdcode) {
    state.selectedUnitId = unitFor(currentEra(), state.selectedAdcode)?.id || null;
  } else {
    state.selectedUnitId = null;
  }
  render();
}

function startPlay() {
  state.playing = true;
  playButton.setAttribute("aria-pressed", "true");
  playButton.textContent = "暫停";
  state.timer = window.setInterval(() => setEra(state.eraIndex + 1), 3200);
}

function stopPlay() {
  state.playing = false;
  playButton.setAttribute("aria-pressed", "false");
  playButton.textContent = "播放";
  window.clearInterval(state.timer);
}

function showTooltip(event, html) {
  tooltip.hidden = false;
  tooltip.innerHTML = html;
  const bounds = wrap.getBoundingClientRect();
  const x = event.clientX - bounds.left + 14;
  const y = event.clientY - bounds.top + 14;
  tooltip.style.left = `${Math.min(x, bounds.width - tooltip.offsetWidth - 8)}px`;
  tooltip.style.top = `${Math.min(y, bounds.height - tooltip.offsetHeight - 8)}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function filterUnits(era, query) {
  if (!query) return era.units;
  return era.units.filter((unit) => {
    const modern = unit.adcodes.map((code) => provinceByCode(code).name).join("");
    return `${unit.name}${unit.short || ""}${unit.note || ""}${modern}`.includes(query);
  });
}

function matchCodes(query) {
  if (!query) return new Set();
  const era = currentEra();
  const codes = new Set();
  for (const unit of filterUnits(era, query)) {
    for (const code of unit.adcodes) codes.add(code);
  }
  return codes;
}

function eraWithQuery(query, exceptId) {
  return ERAS.find((era) => era.id !== exceptId && filterUnits(era, query).length);
}

function disclaimer() {
  return `<p class="disclaimer">界線用今日省界合併，方便對照名稱，不是當時的實測疆界。一省跨兩個政區時畫成斜線。郡治位置是約數。底圖為省級界線，海南遠海島嶼沒有畫入，避免地圖被拉扁。</p>`;
}

function swatchStyle(era, unit) {
  const fill = fillFor(era, unit);
  if (unit.kind === "split") {
    return `background: repeating-linear-gradient(135deg, ${unit.color} 0 4px, #f4ecde 4px 8px)`;
  }
  return `background:${fill}`;
}

function currentEra() {
  return ERAS[state.eraIndex];
}

function sanitize(feature) {
  if (String(feature.properties.adcode) === "100000_JD") return null;
  rewindGeometry(feature.geometry);
  const geometry = clipGeometry(feature.geometry);
  if (!geometry) return null;
  return { ...feature, geometry };
}

function rewindGeometry(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of polygons) polygon[0].reverse();
}

function clipGeometry(geometry) {
  const keep = (polygon) => {
    const ring = polygon[0];
    let lon = 0;
    let lat = 0;
    for (const point of ring) {
      lon += point[0];
      lat += point[1];
    }
    lon /= ring.length;
    lat /= ring.length;
    return lat > 17.4 && lat < 55 && lon > 73 && lon < 136;
  };
  if (geometry.type === "Polygon") return keep(geometry.coordinates) ? geometry : null;
  const coordinates = geometry.coordinates.filter(keep);
  if (!coordinates.length) return null;
  return { type: "MultiPolygon", coordinates };
}

function largest(members) {
  return members.reduce((best, feature) => (areaOf(feature) > areaOf(best) ? feature : best));
}

function areaOf(feature) {
  const [left, bottom, right, top] = bbox(feature);
  return Math.max(0, right - left) * Math.max(0, top - bottom);
}

function bbox(feature) {
  const box = [180, 90, -180, -90];
  const walk = (coords) => {
    if (typeof coords[0] === "number") {
      box[0] = Math.min(box[0], coords[0]);
      box[1] = Math.min(box[1], coords[1]);
      box[2] = Math.max(box[2], coords[0]);
      box[3] = Math.max(box[3], coords[1]);
      return;
    }
    for (const child of coords) walk(child);
  };
  walk(feature.geometry.coordinates);
  return box;
}

function findSpot(candidate, placed) {
  const offsets = candidate.point || candidate.modern
    ? [[0, 0]]
    : [[0, 0], [0, -18], [0, 18], [22, 0], [-22, 0]];
  for (const [dx, dy] of offsets) {
    const x = candidate.x + dx / view.k;
    const y = candidate.y + dy / view.k;
    const box = {
      x: x - (candidate.text.length * candidate.size) / 2 - 4,
      y: y - candidate.size / 2 - 3,
      w: candidate.text.length * candidate.size + 8,
      h: candidate.size + 6,
    };
    if (collides(placed, box)) continue;
    placed.push(box);
    return { x, y };
  }
  return null;
}

function collides(placed, box) {
  return placed.some((item) =>
    box.x < item.x + item.w && box.x + box.w > item.x && box.y < item.y + item.h && box.y + box.h > item.y);
}

function mix(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const channel = (from, to) => Math.round(from + (to - from) * amount);
  return `rgb(${channel(red, 243)}, ${channel(green, 234)}, ${channel(blue, 215)})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function el(name) {
  return document.createElementNS(SVG_NS, name);
}
