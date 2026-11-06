import unittest
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOCKED_DOMAINS = (
    "gumroad.com", "whop.com", "lemonsqueezy.com", "payhip.com", "ko-fi.com",
    "patreon.com", "paypal.me", "buymeacoffee.com", "buy.stripe.com", "checkout.stripe.com",
)


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
                self.assertIsNone(archive.testzip(), "ZIP integrity check failed")
                names = archive.namelist()
                skill_files = [name for name in names if Path(name).name.lower() == "skill.md"]
                self.assertEqual(skill_files, ["SKILL.md"])
                self.assertIn("LICENSE", names)
                self.assertIn("references/visual-capability-gate.md", names)
                self.assertIn("scripts/README.md", names)
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
                    if Path(name).suffix in {".mjs", ".py"}:
                        self.assertLessEqual(archive.getinfo(name).file_size, 20 * 1024, name)

                payload = "\n".join(archive.read(name).decode("utf-8") for name in names).lower()
                for blocked in ("premium edition", "reference-inspired creative", *BLOCKED_DOMAINS):
                    self.assertNotIn(blocked, payload)

                skill = archive.read("SKILL.md").decode("utf-8")
                self.assertTrue(skill.startswith("---\n"))
                frontmatter = skill.split("---", 2)[1]
                for field in ["name:", "description:", "summary:", "version:", "tags:", "keywords:", "use_cases:", "docs_url:"]:
                    self.assertIn(field, frontmatter)
                self.assertLessEqual(len(next(line for line in frontmatter.splitlines() if line.startswith("description:")).split(":", 1)[1].strip()), 1024)
                self.assertLessEqual(len(next(line for line in frontmatter.splitlines() if line.startswith("summary:")).split(":", 1)[1].strip().strip('"')), 300)


if __name__ == "__main__":
    unittest.main()
