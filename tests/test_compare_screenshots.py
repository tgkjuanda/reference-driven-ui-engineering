import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit("Install test dependency: python -m pip install -r requirements-qa.txt")

SCRIPT = Path(__file__).resolve().parents[1] / "skills" / "ui-reference-replication" / "scripts" / "compare-screenshots.py"


class ScreenshotComparisonTests(unittest.TestCase):
    def run_compare(self, reference, actual, diff, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(reference), str(actual), "--diff", str(diff), *args],
            check=False, capture_output=True, text=True
        )

    def test_identical_images_report_zero_difference(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            a, b, diff = root / "a.png", root / "b.png", root / "diff.png"
            Image.new("RGB", (8, 8), (255, 255, 255)).save(a)
            Image.new("RGB", (8, 8), (255, 255, 255)).save(b)
            result = self.run_compare(a, b, diff)
            report = json.loads(result.stdout)
            self.assertEqual(result.returncode, 0)
            self.assertEqual(report["changed_pixel_ratio"], 0)
            self.assertTrue(diff.exists())

    def test_different_images_fail_configured_threshold(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            a, b, diff = root / "a.png", root / "b.png", root / "diff.png"
            Image.new("RGB", (8, 8), (255, 255, 255)).save(a)
            Image.new("RGB", (8, 8), (0, 0, 0)).save(b)
            result = self.run_compare(a, b, diff, "--max-changed-pixel-ratio", "0.01")
            report = json.loads(result.stdout)
            self.assertEqual(result.returncode, 1)
            self.assertEqual(report["status"], "fail")
            self.assertEqual(report["changed_pixel_ratio"], 1)

    def test_dimension_mismatch_is_blocking(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            a, b, diff = root / "a.png", root / "b.png", root / "diff.png"
            Image.new("RGB", (8, 8), (255, 255, 255)).save(a)
            Image.new("RGB", (9, 8), (255, 255, 255)).save(b)
            result = self.run_compare(a, b, diff)
            report = json.loads(result.stdout)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(report["status"], "error")


if __name__ == "__main__":
    unittest.main()
