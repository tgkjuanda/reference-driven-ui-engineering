#!/usr/bin/env python3
"""Pixel-level screenshot diagnostic. This is not a perceptual similarity score."""
import argparse
import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageStat, ImageOps
except ImportError:
    print("Pillow is required. Install it with: python -m pip install -r requirements-qa.txt", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reference", help="Reference screenshot path")
    parser.add_argument("actual", help="Implementation screenshot path")
    parser.add_argument("--diff", default="artifacts/ui-reference/diff.png", help="Output raw difference image")
    parser.add_argument("--heatmap", default="artifacts/ui-reference/heatmap.png", help="Output colorized difference heatmap")
    parser.add_argument("--overlay", default=None, help="Optional 50/50 reference and actual overlay path")
    parser.add_argument("--pixel-threshold", type=int, default=16, help="Grayscale difference threshold (0-255)")
    parser.add_argument("--max-changed-pixel-ratio", type=float, default=None, help="Optional pass threshold, e.g. 0.01 for 1%%")
    args = parser.parse_args()

    if not 0 <= args.pixel_threshold <= 255:
        parser.error("--pixel-threshold must be between 0 and 255")
    if args.max_changed_pixel_ratio is not None and not 0 <= args.max_changed_pixel_ratio <= 1:
        parser.error("--max-changed-pixel-ratio must be between 0 and 1")

    reference_path = Path(args.reference)
    actual_path = Path(args.actual)
    try:
        reference = Image.open(reference_path).convert("RGB")
        actual = Image.open(actual_path).convert("RGB")
    except OSError as exc:
        print(json.dumps({"status": "error", "message": str(exc)}, indent=2))
        return 2

    if reference.size != actual.size:
        print(json.dumps({
            "status": "error",
            "message": "Screenshot dimensions differ; capture at the same viewport and device scale factor.",
            "reference_size": reference.size,
            "actual_size": actual.size
        }, indent=2))
        return 2

    difference = ImageChops.difference(reference, actual)
    grayscale = difference.convert("L")
    histogram = grayscale.histogram()
    changed_pixels = sum(histogram[min(args.pixel_threshold + 1, 256):])
    total_pixels = reference.width * reference.height
    changed_ratio = changed_pixels / total_pixels if total_pixels else 0.0
    channel_means = ImageStat.Stat(difference).mean
    normalized_mae = sum(channel_means) / (3 * 255)

    diff_path = Path(args.diff)
    heatmap_path = Path(args.heatmap)
    diff_path.parent.mkdir(parents=True, exist_ok=True)
    heatmap_path.parent.mkdir(parents=True, exist_ok=True)
    difference.save(diff_path)
    heatmap = ImageOps.colorize(grayscale, black="#151515", white="#ff2020")
    heatmap.save(heatmap_path)
    overlay_path = None
    if args.overlay:
        overlay_path = Path(args.overlay)
        overlay_path.parent.mkdir(parents=True, exist_ok=True)
        Image.blend(reference, actual, 0.5).save(overlay_path)

    status = "measured"
    if args.max_changed_pixel_ratio is not None:
        status = "pass" if changed_ratio <= args.max_changed_pixel_ratio else "fail"

    report = {
        "status": status,
        "metric_warning": "Pixel metrics are sensitive to antialiasing, fonts, browser rendering, dynamic data, and animation; they are not a complete perceptual UX score.",
        "reference": str(reference_path),
        "actual": str(actual_path),
        "dimensions": {"width": reference.width, "height": reference.height},
        "pixel_threshold": args.pixel_threshold,
        "changed_pixel_ratio": round(changed_ratio, 6),
        "changed_pixel_percent": round(changed_ratio * 100, 4),
        "normalized_mean_absolute_error": round(normalized_mae, 6),
        "raw_diff_image": str(diff_path),
        "heatmap_image": str(heatmap_path),
        "overlay_image": str(overlay_path) if overlay_path else None
    }
    print(json.dumps(report, indent=2))
    if status == "fail":
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
