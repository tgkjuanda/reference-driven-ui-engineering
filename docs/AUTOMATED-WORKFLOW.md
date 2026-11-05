# Automated workflow

The repository runs a GitHub Actions validation workflow on pushes to `main`, pull requests, and manual dispatch.

The workflow checks:
- Node.js unit tests for design-token validation.
- Skill layout, progressive-disclosure line limit, required references, and sample tokens.
- Python syntax for screenshot comparison.
- Python Pillow dependency installation.

The workflow does not run browser screenshot tests because those require a target application URL, its runtime, and an authorized/reference screenshot. The Playwright and axe-core commands are run against the consumer's project when configured.
