import unittest
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class AgensiPackageTests(unittest.TestCase):
    def test_builds_single_root_skill_zip_with_only_supported_text_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            archive_path = Path(temporary) / "community.zip"
            subprocess.run(
                ["node", str(ROOT / "scripts" / "package-agensi.mjs"), "--out", str(archive_path)],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )

            with zipfile.ZipFile(archive_path) as archive:
                names = archive.namelist()
                self.assertIn("SKILL.md", names)
                self.assertIn("LICENSE", names)
                self.assertIn("references/visual-capability-gate.md", names)
                self.assertIn("scripts/README.md", names)
                self.assertEqual(names.count("SKILL.md"), 1)
                self.assertLessEqual(len(names), 200)
                self.assertLessEqual(sum(info.file_size for info in archive.infolist()), 6_000_000)
                self.assertEqual(len(names), len(set(names)))
                self.assertNotIn("package.json", names)
                self.assertNotIn("README.md", names)
                self.assertFalse(any(name.startswith(".git/") for name in names))
                self.assertFalse(any("node_modules" in name for name in names))

                for name in names:
                    self.assertFalse(name.startswith("/") or ".." in Path(name).parts, name)
                    self.assertTrue(
                        name == "LICENSE" or Path(name).suffix in {".md", ".mjs", ".py", ".json"},
                        name,
                    )

                skill = archive.read("SKILL.md").decode("utf-8")
                self.assertTrue(skill.startswith("---\n"))
                for field in ["name:", "description:", "summary:", "version:", "tags:", "keywords:", "use_cases:", "docs_url:"]:
                    self.assertIn(field, skill.split("---", 2)[1])
                self.assertNotRegex(skill, r"Premium Edition|Reference-Inspired Creative|Agensi[.]io")


if __name__ == "__main__":
    unittest.main()
