#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_ROOT = path.join(ROOT, "skills", "ui-reference-replication");
const ALLOWED_EXTENSIONS = new Set([".md", ".mjs", ".py", ".json"]);
const MAX_FILES = 200;
const MAX_UNCOMPRESSED_BYTES = 6_000_000;
const DOS_TIME = 0;
const DOS_DATE = 0x0021; // 1980-01-01, for reproducible archives.

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function u32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

async function collectFiles(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const archivePath = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error("Symbolic links are not allowed in the Agensi package: " + archivePath);
    }
    if (entry.isDirectory()) {
      results.push(...await collectFiles(absolute, archivePath));
    } else if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        throw new Error("Unsupported non-text file in Skill package: " + archivePath);
      }
      results.push({ absolute, archivePath });
    }
  }
  return results;
}

function buildZip(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const compressed = deflateRawSync(entry.data, { level: 9 });
    const checksum = crc32(entry.data);

    const localHeader = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0x0800), u16(8),
      u16(DOS_TIME), u16(DOS_DATE), u32(checksum),
      u32(compressed.length), u32(entry.data.length),
      u16(name.length), u16(0), name
    ]);
    localParts.push(localHeader, compressed);

    const centralHeader = Buffer.concat([
      u32(0x02014b50), u16(0x031e), u16(20), u16(0x0800), u16(8),
      u16(DOS_TIME), u16(DOS_DATE), u32(checksum),
      u32(compressed.length), u32(entry.data.length),
      u16(name.length), u16(0), u16(0), u16(0), u16(0),
      u32(0x81a40000), u32(localOffset), name
    ]);
    centralParts.push(centralHeader);
    localOffset += localHeader.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0),
    u16(entries.length), u16(entries.length),
    u32(centralDirectory.length), u32(localOffset), u16(0)
  ]);
  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

async function main() {
  const outIndex = process.argv.indexOf("--out");
  const requestedOutput = outIndex >= 0 ? process.argv[outIndex + 1] : null;
  if (outIndex >= 0 && (!requestedOutput || requestedOutput.startsWith("--"))) {
    throw new Error("--out requires a destination path.");
  }

  const skillPath = path.join(SKILL_ROOT, "SKILL.md");
  const skillText = await readFile(skillPath, "utf8");
  if (!skillText.startsWith("---\n") || !/^name:\\s*\\S+/m.test(skillText) ||
      !/^description:\\s*\\S+/m.test(skillText)) {
    throw new Error("The Skill must start with YAML frontmatter containing name and description.");
  }
  const version = skillText.match(/^version:\\s*"([^"]+)"$/m)?.[1];
  if (!version) throw new Error("Agensi frontmatter version is missing.");
  const metadataKeys = ["summary", "version", "tags", "keywords", "use_cases", "docs_url"];
  for (const key of metadataKeys) {
    if (!new RegExp("^" + key + ":\\s*\\S", "m").test(skillText.split("---")[1] ?? "")) {
      throw new Error("Agensi frontmatter field is missing: " + key);
    }
  }
  if (/Premium Edition|Reference-Inspired Creative|https?:\\/\\/(?:gumroad|whop|lemonsqueezy|payhip|ko-fi|patreon)\\./i.test(skillText)) {
    throw new Error("The marketplace Skill payload must not include Premium promotion or external paid-checkout links.");
  }

  const files = await collectFiles(SKILL_ROOT);
  files.unshift({ absolute: path.join(ROOT, "LICENSE"), archivePath: "LICENSE" });
  files.sort((a, b) => a.archivePath.localeCompare(b.archivePath));
  if (files.length > MAX_FILES) throw new Error("Package exceeds Agensi's 200 text-file limit.");

  const entries = [];
  let uncompressedBytes = 0;
  for (const file of files) {
    const data = await readFile(file.absolute);
    uncompressedBytes += data.length;
    entries.push({ name: file.archivePath, data });
  }
  if (uncompressedBytes > MAX_UNCOMPRESSED_BYTES) {
    throw new Error("Package exceeds Agensi's 6,000,000-character delivery limit.");
  }
  if (entries.filter(entry => entry.name === "SKILL.md").length !== 1) {
    throw new Error("Agensi package must contain exactly one SKILL.md at the archive root.");
  }

  const output = path.resolve(ROOT, requestedOutput ?? `dist/ui-reference-replication-community-${version}.zip`);
  await mkdir(path.dirname(output), { recursive: true });
  const archive = buildZip(entries);
  await writeFile(output, archive);

  console.log(JSON.stringify({
    status: "created",
    output: path.relative(ROOT, output),
    skill: "ui-reference-replication",
    version,
    files: entries.length,
    uncompressedBytes,
    archiveBytes: archive.length,
    rootSkillFile: true
  }, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
