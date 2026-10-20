"""Shrink OpenCelliD's open cell list into the small map files for Our Version, part two.

Run with the raw files outside the repo (they are large and CC BY-SA licensed):

    python -I scripts/our-version/cells.py T:/datasets/opencellid

It reads <dir>/world.csv.gz (OpenCelliD full export) and <dir>/geo/countries-50m.json and countries-110m.json
(world-atlas 2.0.2, Natural Earth, public domain) and writes public/data/our-version/*.json.
Those outputs are derived from OpenCelliD and so are shared under CC BY-SA 4.0.

What a point means: one grid square where phones reported at least one cell. It says
where coverage was seen, never how big a network is, because the data is crowdsourced.
"""

import csv
import gzip
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "data" / "our-version"

GEN = {"GSM": 2, "CDMA": 2, "UMTS": 3, "LTE": 4, "NR": 5}

AFRICA_ISO = {
    "012", "024", "072", "108", "120", "132", "140", "148", "174", "178", "180", "204", "226",
    "231", "232", "262", "266", "270", "288", "324", "384", "404", "426", "430", "434", "450",
    "454", "466", "478", "480", "504", "508", "516", "562", "566", "624", "646", "678", "686",
    "690", "694", "706", "710", "716", "728", "729", "732", "748", "768", "788", "800", "818",
    "834", "854", "894",
}

MCC = {
    602: "Egypt", 603: "Algeria", 604: "Morocco", 605: "Tunisia", 606: "Libya", 607: "Gambia",
    608: "Senegal", 609: "Mauritania", 610: "Mali", 611: "Guinea", 612: "Côte d'Ivoire",
    613: "Burkina Faso", 614: "Niger", 615: "Togo", 616: "Benin", 617: "Mauritius", 618: "Liberia",
    619: "Sierra Leone", 620: "Ghana", 621: "Nigeria", 622: "Chad", 623: "Central African Republic",
    624: "Cameroon", 625: "Cabo Verde", 626: "São Tomé and Príncipe", 627: "Equatorial Guinea",
    628: "Gabon", 629: "Congo", 630: "DR Congo", 631: "Angola", 632: "Guinea-Bissau",
    633: "Seychelles", 634: "Sudan", 635: "Rwanda", 636: "Ethiopia", 637: "Somalia",
    638: "Djibouti", 639: "Kenya", 640: "Tanzania", 641: "Uganda", 642: "Burundi",
    643: "Mozambique", 645: "Zambia", 646: "Madagascar", 647: "Réunion", 648: "Zimbabwe",
    649: "Namibia", 650: "Malawi", 651: "Lesotho", 652: "Botswana", 653: "Eswatini",
    654: "Comoros", 655: "South Africa", 657: "Eritrea", 658: "Saint Helena", 659: "South Sudan",
}

# Each map: bounding box, grid step in degrees, which country outlines to draw.
MAPS = {
    "sa": {"lon": (16.2, 33.2), "lat": (-35.0, -22.0), "step": 0.1, "iso": {"710", "426", "748"}, "topo": "countries-50m.json"},
    "africa": {"lon": (-18.0, 52.0), "lat": (-35.5, 38.0), "step": 0.3, "iso": AFRICA_ISO, "topo": "countries-110m.json"},
}


def decode_topojson(topo):
    """Return {id: [rings]} with rings as lists of (lon, lat), for Polygon and MultiPolygon."""
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        pts = []
        for i in idx:
            a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
            pts.extend(a if not pts else a[1:])
        return pts

    out = {}
    for g in topo["objects"]["countries"]["geometries"]:
        polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]] if g["type"] == "Polygon" else []
        out[g.get("id")] = [ring(r) for poly in polys for r in poly]
    return out


def boxed(rings):
    """Attach a bounding box to each ring so most rings are skipped cheaply."""
    return [((min(p[0] for p in r), min(p[1] for p in r), max(p[0] for p in r), max(p[1] for p in r)), r) for r in rings]


def inside(pt, rings):
    """Even odd rule across all rings, so holes (Lesotho inside South Africa) work."""
    x, y = pt
    hit = False
    for (bx0, by0, bx1, by1), r in rings:
        if not (bx0 <= x <= bx1 and by0 <= y <= by1):
            continue
        for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                hit = not hit
    return hit


def project(spec):
    (lo0, lo1), (la0, la1) = spec["lon"], spec["lat"]
    k = math.cos(math.radians((la0 + la1) / 2))
    w = 1000
    h = round(w * (la1 - la0) / ((lo1 - lo0) * k))
    return w, h, lambda lon, lat: ((lon - lo0) / (lo1 - lo0) * w, (la1 - lat) / (la1 - la0) * h)


def path(rings, proj, spec):
    (lo0, lo1), (la0, la1) = spec["lon"], spec["lat"]
    parts = []
    for r in rings:
        if not any(lo0 - 2 <= x <= lo1 + 2 and la0 - 2 <= y <= la1 + 2 for x, y in r):
            continue
        pts = [proj(x, y) for x, y in r]
        parts.append("M" + "L".join(f"{px:.1f} {py:.1f}" for px, py in pts) + "Z")
    return "".join(parts)


def main(src: Path):
    topo = {n: decode_topojson(json.loads((src / "geo" / n).read_text("utf8"))) for n in {m["topo"] for m in MAPS.values()}}
    grids = {name: {} for name in MAPS}
    per_country = {}
    with gzip.open(src / "world.csv.gz", "rt", encoding="utf8", newline="") as f:
        for row in csv.DictReader(f):
            mcc = int(row["mcc"])
            if not 602 <= mcc <= 659:
                continue
            gen = GEN.get(row["radio"], 2)
            lon, lat = float(row["lon"]), float(row["lat"])
            c = per_country.setdefault(mcc, [0, 0, 0, 0])
            c[0] += 1
            c[min(gen, 4) - 1] += 1  # columns: total, 2G, 3G, 4G and newer
            for name, spec in MAPS.items():
                (lo0, lo1), (la0, la1) = spec["lon"], spec["lat"]
                if lo0 <= lon < lo1 and la0 <= lat < la1:
                    key = (int((lon - lo0) / spec["step"]), int((lat - la0) / spec["step"]))
                    cell = grids[name].setdefault(key, [0, 0, 0, 0])
                    cell[0] += 1
                    cell[gen - 1 if gen <= 4 else 3] += 1  # count per generation, 5G folded into 4G

    OUT.mkdir(parents=True, exist_ok=True)
    for name, spec in MAPS.items():
        w, h, proj = project(spec)
        countries = topo[spec["topo"]]
        (lo0, _), (la0, _) = spec["lon"], spec["lat"]
        step = spec["step"]
        land = boxed([r for iso in spec["iso"] for r in countries.get(iso, [])])
        points = []
        for (i, j), (n, g2, g3, g4) in grids[name].items():
            lon, lat = lo0 + (i + 0.5) * step, la0 + (j + 0.5) * step
            if not inside((lon, lat), land):
                continue
            x, y = proj(lon, lat)
            best = 4 if g4 else 3 if g3 else 2
            points.append([round(x, 1), round(y, 1), n, best])
        squares = sum(
            1
            for i in range(int((spec["lon"][1] - lo0) / step))
            for j in range(int((spec["lat"][1] - la0) / step))
            if inside((lo0 + (i + 0.5) * step, la0 + (j + 0.5) * step), land)
        )
        outline = "".join(path(countries.get(iso, []), proj, spec) for iso in sorted(spec["iso"]))
        data = {
            "source": "OpenCelliD (opencellid.org), CC BY-SA 4.0; outlines Natural Earth via world-atlas",
            "width": w,
            "height": h,
            "lon": list(spec["lon"]),
            "lat": list(spec["lat"]),
            "stepDegrees": step,
            "landSquares": squares,
            "outline": outline,
            "points": sorted(points, key=lambda p: p[3]),
        }
        (OUT / f"{name}.json").write_text(json.dumps(data, separators=(",", ":")), "utf8")
        reached = {g: sum(1 for p in points if p[3] >= g) for g in (2, 3, 4)}
        print(name, "points", len(points), "land squares", squares,
              "share with any cell", f"{len(points) / squares:.1%}",
              "with 4G", f"{reached[4] / squares:.1%}")

    table = sorted(
        ({"country": MCC.get(m, str(m)), "cells": t, "g2": a, "g3": b, "g4": c} for m, (t, a, b, c) in per_country.items()),
        key=lambda r: -r["cells"],
    )
    (OUT / "countries.json").write_text(json.dumps(table, ensure_ascii=False, separators=(",", ":")), "utf8")
    print("countries", len(table), "total cells", sum(r["cells"] for r in table))


if __name__ == "__main__":
    main(Path(sys.argv[1]))
