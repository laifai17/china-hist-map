import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import polygonClipping from "polygon-clipping";
import {
  CUTS,
  ERAS,
  LAND_LABEL,
  REALM_COLORS,
  partsFor,
  provinceByCode,
  summarizeChanges,
  unitCodes,
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
const boundsButton = document.querySelector("#toggle-bounds");
const realmButton = document.querySelector("#toggle-realm");
const playButton = document.querySelector("#play");
const resetButton = document.querySelector("#reset-view");

const state = {
  eraIndex: initialEra(),
  selectedAdcode: null,
  selectedUnitId: null,
  hoverUnitId: null,
  query: "",
  showModern: false,
  showModernBounds: false,
  showRealm: false,
  playing: false,
  timer: 0,
};

const view = { x: 0, y: 0, k: 1 };
let projection = geoMercator();
let path = geoPath(projection);
let features = [];
const featureByCode = new Map();
const clipCache = new Map();
const CONTEXT_PLACES = [
  { name: "蒙古", lon: 103, lat: 47, land: "Mongolia" },
  { name: "朝鮮半島", lon: 128.0, lat: 38.6, land: "North Korea" },
  { name: "日本", lon: 138, lat: 36.2, land: "Japan" },
  { name: "越南", lon: 105.8, lat: 17.6, land: "Vietnam" },
  { name: "哈薩克", lon: 76, lat: 44.2, land: "" },
];
let contextFeatures = [];
let pieces = [];
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
  const [response, asiaResponse] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}china.json`),
    fetch(`${import.meta.env.BASE_URL}asia.json`),
  ]);
  if (!response.ok) throw new Error("地圖資料載入失敗");
  const geo = await response.json();
  features = geo.features.map(sanitize).filter(Boolean);
  contextFeatures = asiaResponse.ok ? (await asiaResponse.json()).features : [];
  featureByCode.clear();
  for (const feature of features) featureByCode.set(feature.properties.adcode, feature);
  const viewport = el("g");
  viewport.id = "viewport";
  const sea = el("rect");
  sea.id = "sea";
  const context = el("g");
  context.id = "context";
  const contextLabels = el("g");
  contextLabels.id = "context-labels";
  const historical = el("g");
  historical.id = "historical";
  const modern = el("g");
  modern.id = "modern-lines";
  modern.style.display = "none";
  const points = el("g");
  points.id = "points";
  const labels = el("g");
  labels.id = "labels";
  const defs = el("defs");
  defs.id = "defs";
  svg.append(defs, viewport);
  viewport.append(sea, context, contextLabels, historical, modern, points, labels);
  for (const feature of contextFeatures) {
    const shape = el("path");
    shape.classList.add("context-land");
    shape.dataset.name = feature.properties.name;
    context.append(shape);
  }

  for (const feature of features) {
    const line = el("path");
    line.classList.add("modern-line");
    line.dataset.adcode = String(feature.properties.adcode);
    modern.append(line);
  }

  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("pointermove", onPointerMove);
  svg.addEventListener("pointerup", onPointerUp);
  svg.addEventListener("pointerleave", () => {
    state.hoverUnitId = null;
    hideTooltip();
    paintInteraction();
  });
  svg.addEventListener("wheel", onWheel, { passive: false });
  svg.addEventListener("click", onMapClick);

  panel.addEventListener("click", onPanelClick);
  panel.addEventListener("mouseover", onPanelHover);
  panel.addEventListener("mouseout", (event) => {
    if (event.target.closest("[data-unit]")) {
      state.hoverUnitId = null;
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
  boundsButton.addEventListener("click", () => {
    state.showModernBounds = !state.showModernBounds;
    boundsButton.setAttribute("aria-pressed", String(state.showModernBounds));
    svg.querySelector("#modern-lines").style.display = state.showModernBounds ? "" : "none";
  });
  realmButton.addEventListener("click", () => {
    state.showRealm = !state.showRealm;
    realmButton.setAttribute("aria-pressed", String(state.showRealm));
    paintFills();
    drawLabels();
    renderPanel();
    paintInteraction();
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
    features: contextFeatures.length ? contextFeatures : features,
  });
  path = geoPath(projection);
  const lands = svg.querySelectorAll("#context .context-land");
  contextFeatures.forEach((feature, index) => {
    lands[index]?.setAttribute("d", path(feature));
  });
  drawContextLabels();
  for (const feature of features) {
    const line = svg.querySelector(`#modern-lines [data-adcode="${feature.properties.adcode}"]`);
    if (line) line.setAttribute("d", path(feature));
  }
  for (const piece of pieces) {
    const shape = svg.querySelector(`#historical [data-piece="${piece.key}"]`);
    if (shape) shape.setAttribute("d", path(piece.feature));
  }
  applyView();
  drawLabels();
  drawPoints();
}

function render() {
  const era = currentEra();
  buildPatterns(era);
  buildHistorical(era);
  paintFills();
  drawPoints();
  drawLabels();
  drawContextLabels();
  paintInteraction();
  renderCartouche();
  renderPanel();
  renderTimeline();
  const url = new URL(location.href);
  url.searchParams.set("era", era.id);
  history.replaceState(null, "", url);
  document.title = `${era.dynasty} ${era.yearText} · 省界千年`;
}

function buildHistorical(era) {
  const layer = svg.querySelector("#historical");
  layer.replaceChildren();
  pieces = [];
  let index = 0;
  for (const unit of era.units) {
    for (const code of unit.adcodes || []) {
      const feature = featureByCode.get(code);
      if (feature) pieces.push(makePiece(unit, code, "", feature.geometry, index++));
    }
    for (const clip of unit.clips || []) {
      const feature = featureByCode.get(clip.adcode);
      if (!feature) continue;
      const geometry = clippedGeometry(clip.adcode, feature.geometry, clip.cut, clip.side);
      pieces.push(makePiece(unit, clip.adcode, clip.side, geometry, index++));
    }
  }
  for (const piece of pieces) {
    const shape = el("path");
    shape.classList.add("province");
    shape.dataset.piece = piece.key;
    shape.dataset.unit = piece.unitId;
    shape.dataset.adcode = String(piece.adcode);
    shape.dataset.where = piece.where;
    shape.setAttribute("d", path(piece.feature));
    layer.append(shape);
  }
}

function makePiece(unit, adcode, where, geometry, index) {
  return {
    key: String(index),
    unitId: unit.id,
    adcode,
    where,
    feature: { type: "Feature", properties: {}, geometry },
  };
}

function paintFills() {
  const era = currentEra();
  for (const shape of svg.querySelectorAll("#historical .province")) {
    const unit = era.units.find((item) => item.id === shape.dataset.unit);
    const fill = fillFor(era, unit);
    shape.style.fill = fill;
    shape.style.stroke = unit?.kind === "split" ? unit.color : fill;
  }
  paintContext();
}

function paintContext() {
  const era = currentEra();
  for (const shape of svg.querySelectorAll("#context .context-land")) {
    const unit = landUnit(era, shape.dataset.name);
    shape.classList.toggle("is-claimed", Boolean(unit));
    if (!unit) {
      delete shape.dataset.unit;
      shape.style.fill = "";
      shape.style.stroke = "";
      continue;
    }
    const fill = state.showRealm && unit.realm && REALM_COLORS[unit.realm]
      ? REALM_COLORS[unit.realm]
      : unit.color;
    shape.dataset.unit = unit.id;
    shape.style.fill = fill;
    shape.style.stroke = fill;
  }
}

function landUnit(era, name) {
  return era.units.find((unit) => unit.lands?.includes(name));
}

function paintInteraction() {
  const active = highlightedUnitIds();
  const dim = active.size > 0;
  for (const shape of svg.querySelectorAll("#historical .province, #context .context-land.is-claimed")) {
    const on = active.has(shape.dataset.unit);
    shape.classList.toggle("is-dim", dim && !on);
    shape.classList.toggle("is-selected", on && (state.selectedUnitId || state.hoverUnitId));
  }
  for (const row of panel.querySelectorAll("[data-unit]")) {
    row.classList.toggle("is-on", active.has(row.dataset.unit));
  }
}

function highlightedUnitIds() {
  const era = currentEra();
  const ids = new Set();
  const add = (unit) => {
    if (!unit) return;
    if (state.showRealm && unit.realm) {
      for (const item of era.units) {
        if (item.realm === unit.realm) ids.add(item.id);
      }
    } else {
      ids.add(unit.id);
    }
  };
  if (state.hoverUnitId) add(era.units.find((item) => item.id === state.hoverUnitId));
  else if (state.selectedUnitId) add(era.units.find((item) => item.id === state.selectedUnitId));
  else if (state.query) {
    for (const unit of filterUnits(era, state.query)) add(unit);
  }
  return ids;
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
      <h3>${state.showRealm ? "政權同下面的區劃" : "這一時期的區劃"}</h3>
      ${units.length ? unitList(units) : `<p class="hint">這一時期沒有「${esc(state.query)}」。</p>`}
      ${elsewhere ? `<button class="jump" type="button" data-goto-era="${elsewhere.id}">去${esc(elsewhere.dynasty)}看「${esc(state.query)}」</button>` : ""}
    </section>
    <p class="hint">${state.showRealm ? "地圖已收成一個政權的範圍，下面仍列出當時的路、省。" : "點地圖上的地方，看這塊地歷代叫什麼。滾輪放大，拖動可平移。"}</p>
    ${disclaimer()}
  `;
}

function unitList(units) {
  if (!state.showRealm) return `<ul class="units">${units.map(unitRow).join("")}</ul>`;
  const groups = new Map();
  const loose = [];
  for (const unit of units) {
    if (!unit.realm) {
      loose.push(unit);
      continue;
    }
    if (!groups.has(unit.realm)) groups.set(unit.realm, []);
    groups.get(unit.realm).push(unit);
  }
  const blocks = [...groups.entries()].map(([title, list]) => ({ title, list }));
  if (loose.length) blocks.push({ title: "界外", list: loose });
  return blocks.map((block) => `
    <h4 class="realm-title">${esc(block.title)}</h4>
    <ul class="units">${block.list.map(unitRow).join("")}</ul>
  `).join("");
}

function renderLineage() {
  const province = provinceByCode(state.selectedAdcode);
  const era = currentEra();
  const rows = ERAS.map((item) => {
    const parts = partsFor(item, province.adcode);
    const label = parts.map((part) => (part.where ? `${part.where}：${part.unit.short || part.unit.name}` : (part.unit.short || part.unit.name))).join("　");
    const detail = parts.map((part) => {
      const mates = mateText(part.unit, province.adcode);
      return `${part.where ? `${part.where}：` : ""}${part.unit.name}${part.unit.note ? `。${part.unit.note}` : ""}${mates ? ` 同屬：${mates}` : ""}`;
    }).join(" ");
    const swatch = parts[0] ? swatchStyle(item, parts[0].unit) : "background:#e4d8c4";
    return `
      <li>
        <button type="button" data-era-jump="${item.id}" class="${item.id === era.id ? "is-on" : ""}">
          <i class="swatch" style="${swatch}"></i>
          <span><b>${esc(item.yearText)} ${esc(item.dynasty)}</b>　${esc(label || "未載")}</span>
          <small>${esc(detail)}</small>
        </button>
      </li>`;
  }).join("");
  panel.innerHTML = `
    <button class="back" type="button" data-back>返回這一時期</button>
    <p class="kicker">${esc(province.level)}</p>
    <h2>${esc(province.full)}</h2>
    <p class="story">下面是今日這塊地，在各個年代被劃進哪個名字。一省被切開時，會分南北兩邊寫。</p>
    <ul class="lineage">${rows}</ul>
    ${disclaimer()}
  `;
}

function mateText(unit, adcode) {
  const mates = unitCodes(unit)
    .filter((code) => code !== adcode)
    .map((code) => provinceByCode(code).name);
  if (!mates.length) return "";
  if (mates.length > 5) return `${mates.slice(0, 5).join("、")}等 ${mates.length} 處`;
  return mates.join("、");
}

function unitRow(unit) {
  const lands = [...new Set((unit.lands || []).map((name) => LAND_LABEL[name] || name))];
  const names = [...unitCodes(unit).map((code) => provinceByCode(code).name), ...lands].join("、");
  return `
    <li>
      <button class="unit" type="button" data-unit="${esc(unit.id)}">
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

function drawContextLabels() {
  const layer = svg.querySelector("#context-labels");
  if (!layer) return;
  layer.replaceChildren();
  const era = currentEra();
  for (const place of CONTEXT_PLACES) {
    if (place.land && landUnit(era, place.land)) continue;
    const projected = projection([place.lon, place.lat]);
    if (!projected) continue;
    const label = el("text");
    label.classList.add("context-label");
    label.setAttribute("x", projected[0]);
    label.setAttribute("y", projected[1]);
    label.textContent = place.name;
    layer.append(label);
  }
}

function drawLabels() {
  const layer = svg.querySelector("#labels");
  layer.replaceChildren();
  const era = currentEra();
  const placed = [];
  const candidates = [];
  if (state.showRealm) {
    const seen = new Set();
    for (const unit of era.units) {
      if (!unit.realm || seen.has(unit.realm)) continue;
      seen.add(unit.realm);
      const anchor = anchorOf(era.units.filter((item) => item.realm === unit.realm));
      if (!anchor) continue;
      const [x, y] = projection(anchor);
      candidates.push({ x, y, text: unit.realm, size: 20, priority: 1e14, modern: false });
    }
    for (const unit of era.units) {
      if (unit.realm) continue;
      const anchor = anchorOf([unit]);
      if (!anchor) continue;
      const [x, y] = projection(anchor);
      candidates.push({ x, y, text: unit.short || unit.name, size: 13, priority: 1e11, modern: false });
    }
  } else {
    for (const unit of era.units) {
      const anchor = anchorOf([unit]);
      if (!anchor) continue;
      const [x, y] = projection(anchor);
      const broad = unitCodes(unit).length > 1 && unit.kind !== "outer" && unit.kind !== "split";
      candidates.push({
        x,
        y,
        text: unit.short || unit.name,
        size: broad ? 16 : 13,
        priority: broad ? 1e12 : 1e10,
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
  for (const label of svg.querySelectorAll(".map-label, .context-label")) {
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
  if (state.showRealm && unit.realm && REALM_COLORS[unit.realm] && unit.kind !== "split") {
    return REALM_COLORS[unit.realm];
  }
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
  const shape = event.target.closest(".province, .context-land.is-claimed");
  if (!shape) {
    state.selectedAdcode = null;
    state.selectedUnitId = null;
    state.query = "";
    searchInput.value = "";
    renderPanel();
    paintInteraction();
    return;
  }
  state.selectedAdcode = shape.dataset.adcode ? Number(shape.dataset.adcode) : null;
  state.selectedUnitId = shape.dataset.unit;
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
  const shape = event.target.closest(".province, .context-land.is-claimed");
  const dot = event.target.closest(".qin-point");
  if (dot) {
    showTooltip(event, `<strong>${esc(dot.dataset.name)}</strong><p>${esc(dot.dataset.seat)}${dot.dataset.note ? `。${esc(dot.dataset.note)}` : ""}</p>`);
  } else if (shape && !drag?.moved) {
    const unit = currentEra().units.find((item) => item.id === shape.dataset.unit);
    if (!shape.dataset.adcode) {
      const place = LAND_LABEL[shape.dataset.name] || shape.dataset.name;
      const realm = state.showRealm && unit.realm ? `${unit.realm} · ` : "";
      showTooltip(event, `<strong>${esc(place)}</strong><p>${esc(currentEra().dynasty)} · ${esc(realm)}${esc(unit.name)}</p>${unit.note ? `<p>${esc(unit.note)}</p>` : ""}`);
      state.hoverUnitId = unit.id;
      paintInteraction();
    } else {
      const code = Number(shape.dataset.adcode);
      const province = provinceByCode(code);
      const where = shape.dataset.where === "north" ? "北部" : shape.dataset.where === "south" ? "南部" : "";
      const mates = unitCodes(unit).map((item) => provinceByCode(item).name).join("、");
      const realm = state.showRealm && unit.realm ? `${unit.realm} · ` : "";
      showTooltip(event, `<strong>${esc(province.full)}${where ? `（${where}）` : ""}</strong><p>${esc(currentEra().dynasty)} · ${esc(realm)}${esc(unit.name)}</p><p>今日範圍對應：${esc(mates)}</p>${unit.note ? `<p>${esc(unit.note)}</p>` : ""}`);
      state.hoverUnitId = unit.id;
      paintInteraction();
    }
  } else if (!drag) {
    hideTooltip();
    if (state.hoverUnitId) {
      state.hoverUnitId = null;
      paintInteraction();
    }
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
  state.hoverUnitId = row.dataset.unit;
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
    const parts = partsFor(currentEra(), state.selectedAdcode);
    state.selectedUnitId = parts[0]?.unit.id || null;
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
    const modern = unitCodes(unit).map((code) => provinceByCode(code).name).join("");
    const lands = (unit.lands || []).map((name) => LAND_LABEL[name] || "").join("");
    return `${unit.name}${unit.short || ""}${unit.note || ""}${unit.realm || ""}${modern}${lands}`.includes(query);
  });
}

function eraWithQuery(query, exceptId) {
  return ERAS.find((era) => era.id !== exceptId && filterUnits(era, query).length);
}

function disclaimer() {
  return `<p class="disclaimer">預設畫的是當時政區。淮河、白溝、雁門、秦嶺會把今日的省切開，仍然是示意，不是實測疆界。周圍淺色土地係今日海岸。蒙古、越南、朝鮮、日本會按該時代上色，形狀仍是今日國界，不是實測疆界。中亞同西伯利亞沒有塗成任何朝代的領土。按「今省界」才疊上現代省界。按「成個國」把同一政權收成一整塊。郡治位置是約數。海南遠海島嶼沒有畫入，避免地圖被拉扁。</p>`;
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

function anchorOf(units) {
  const ids = new Set(units.map((unit) => unit.id));
  const geometries = pieces.filter((piece) => ids.has(piece.unitId)).map((piece) => piece.feature.geometry);
  for (const feature of contextFeatures) {
    const unit = landUnit(currentEra(), feature.properties.name);
    if (unit && ids.has(unit.id)) geometries.push(feature.geometry);
  }
  if (!geometries.length) return null;
  const geometry = geometries.length === 1
    ? geometries[0]
    : { type: "GeometryCollection", geometries };
  return geoCentroid({ type: "Feature", properties: {}, geometry });
}

function clippedGeometry(adcode, geometry, cut, side) {
  const key = `${adcode}:${cut}:${side}`;
  if (clipCache.has(key)) return clipCache.get(key);
  let result = geometry;
  try {
    const multi = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    const hit = polygonClipping.intersection(multi, [halfPlane(cut, side)]);
    if (hit?.length) result = { type: "MultiPolygon", coordinates: orientForMap(hit) };
  } catch {
    result = geometry;
  }
  clipCache.set(key, result);
  return result;
}

function orientForMap(polygons) {
  for (const polygon of polygons) {
    polygon.forEach((ring, index) => {
      const exterior = index === 0;
      const sign = ringSign(ring);
      if ((exterior && sign > 0) || (!exterior && sign < 0)) ring.reverse();
    });
  }
  return polygons;
}

function ringSign(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return area;
}

function halfPlane(cut, side) {
  const line = CUTS[cut];
  const cap = side === "north" ? 60 : 10;
  const west = [70, line[0][1]];
  const east = [140, line[line.length - 1][1]];
  const forward = side === "north" ? [west, ...line, east] : [east, ...[...line].reverse(), west];
  const farWest = [70, cap];
  const farEast = [140, cap];
  return side === "north"
    ? [...forward, farEast, farWest, forward[0]]
    : [...forward, farWest, farEast, forward[0]];
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
