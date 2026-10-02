// Builds public/asia.json from Natural Earth 50m admin-0 countries (public domain).
// China, Taiwan, Hong Kong, and Macao stay on the province layer.
import fs from "fs";
import polygonClipping from "polygon-clipping";
import { geoArea } from "d3-geo";

const source = process.argv[2];
const windowRing = [[73, 16], [146, 16], [146, 54], [73, 54], [73, 16]];
const skip = new Set(["China", "Taiwan", "Hong Kong S.A.R.", "Macao S.A.R.", "Siachen Glacier", "Philippines"]);

const geo = JSON.parse(fs.readFileSync(source, "utf8"));
const features = [];

for (const feature of geo.features) {
  const name = feature.properties.ADMIN || feature.properties.NAME;
  if (skip.has(name)) continue;
  const geometry = feature.geometry;
  if (!geometry) continue;
  const multi = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  let hit;
  try {
    hit = polygonClipping.intersection(multi, [windowRing]);
  } catch {
    continue;
  }
  if (!hit?.length) continue;
  orient(hit);
  const next = {
    type: "Feature",
    properties: { name },
    geometry: { type: "MultiPolygon", coordinates: hit },
  };
  if (geoArea(next) < 0.00001) continue;
  features.push(next);
}

const collection = { type: "FeatureCollection", features };
fs.writeFileSync("public/asia.json", JSON.stringify(collection));
const largest = features.reduce((best, feature) => Math.max(best, geoArea(feature)), 0);
console.log(`features ${features.length} bytes ${fs.statSync("public/asia.json").size} maxArea ${largest.toFixed(4)}`);
console.log(features.map((feature) => feature.properties.name).join(", "));

function orient(polygons) {
  for (const polygon of polygons) {
    polygon.forEach((ring, index) => {
      const sign = ringSign(ring);
      const exterior = index === 0;
      if ((exterior && sign > 0) || (!exterior && sign < 0)) ring.reverse();
    });
  }
}

function ringSign(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return area;
}
