# Changelog

All notable changes to UI Reference Replication are documented here.

## [4.0.3] - 2026-11-06

### Agensi Free Edition readiness and repository audit

- Added a submission sheet covering listing copy, helper compatibility, detected file/network behavior, limitations, and required live-demo evidence.
- Strengthened package generation to validate Agensi frontmatter values and listing-field limits.
- Enforced exactly one `SKILL.md` across the complete archive, at the archive root.
- Scanned every delivered text file for Premium promotion and off-platform checkout destinations.
- Added UTF-8, path, ZIP-integrity, file-count, payload-size, and metadata regression checks.
- Enforced the recommended 20 KB review budget for each bundled script.
- Made the CI artifact name and path derive from the package version rather than a hard-coded release.


## [4.0.2] - 2026-11-06

### Agensi security hardening

- Confined helper-script inputs and outputs to the selected target project directory, including symlink escape checks.
- Kept each bundled script self-contained so it does not read sibling files from the Skill package.
- Enforced the Agensi recommended 20 KB per-script review budget during package generation and repository checks.
- Pointed the marketplace documentation URL directly to the Free Skill instructions.
- Updated the workflow artifact and package metadata to version 4.0.2.


## [4.0.1] - 2026-11-06

### Agensi Free Edition packaging and repository hygiene

- Added Agensi-compatible Skill frontmatter: summary, version, tags, keywords, use cases, and documentation URL.
- Added a dependency-free ZIP builder that places exactly one `SKILL.md` at the archive root and includes only the Skill's text resources and MIT license.
- Added automated package checks for the root Skill file, metadata, file count, text-only contents, archive size, and excluded development files.
- Kept the marketplace Skill payload focused on the Community Edition.
- Restored the complete standard MIT license text and added build-artifact ignores.
- Updated package, Skill, and documentation versions to 4.0.1.


## [4.0.0] - 2026-11-06

### Community Edition scope reset

- Restricted the free Community Edition to one fidelity target: Reference-Faithful.
- Removed the creative reinterpretation workflow from the public package.
- Narrowed the Community Edition to its documented reference-faithful workflow and essential verification tools.
- Kept the Community Edition independently useful while separating private-edition implementation materials.
- Simplified installation, documentation, package scripts, and repository validation around the focused free workflow.
- Kept the MIT license for the code and documentation that remain in this repository.

### Edition communication

- Clarified that UI Reference Replication has a free Community Edition and a separately maintained Premium Edition.
- Kept the separate edition's implementation details out of the public Community documentation.
- Directed Premium availability and access information to its Agensi.io marketplace listing when published.

The repository's prior commits and published MIT-licensed releases remain part of its public history. This release does not retroactively revoke rights granted under earlier MIT releases.

## [3.2.1] - Previous release

See the repository history for changes in earlier versions.
