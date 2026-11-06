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
const DOS_DATE = 0x0021;

const BLOCKED_PROMOTION_TERMS = ["Premium Edition", "Reference-Inspired Creative"];
const BLOCKED_CHECKOUT_DOMAINS = [
  "gumroad.com", "whop.com", "lemonsqueezy.com", "payhip.com", "ko-fi.com",
  "patreon.com", "paypal.me", "buymeacoffee.com", "buy.stripe.com", "checkout.stripe.com"
];

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
      if (archivePath.split("/").includes("..") || archivePath.startsWith("/")) {
        throw new Error("Unsafe package path: " + archivePath);
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

function parseFrontmatter(skillText) {
  if (!skillText.startsWith("---\n")) {
    throw new Error("SKILL.md must begin with YAML frontmatter.");
  }
  const end = skillText.indexOf("\n---", 4);
  if (end < 0) throw new Error("SKILL.md YAML frontmatter is not closed.");
  return skillText.slice(4, end).split("\n");
}

function rootValue(lines, key) {
  const line = lines.find(item => !/^\s/.test(item) && item.startsWith(key + ":"));
  return line ? line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "") : "";
}

function listValues(lines, key) {
  const index = lines.findIndex(item => !/^\s/.test(item) && item.startsWith(key + ":"));
  if (index < 0) return [];
  const values = [];
  for (const line of lines.slice(index + 1)) {
    if (line && !/^\s/.test(line)) break;
    const match = line.match(/^\s+-\s+(.+)$/);
    if (match) values.push(match[1].trim().replace(/^["']|["']$/g, ""));
  }
  return values;
}

function validateFrontmatter(skillText) {
  const lines = parseFrontmatter(skillText);
  const value = key => rootValue(lines, key);
  const required = ["name", "description", "summary", "version", "tags", "keywords", "use_cases", "docs_url"];
  for (const key of required) {
    if (!value(key) && !listValues(lines, key).length) {
      throw new Error("Agensi frontmatter field is missing: " + key);
    }
  }

  const name = value("name");
  const description = value("description");
  const summary = value("summary");
  const version = value("version");
  const tags = listValues(lines, "tags");
  const keywords = listValues(lines, "keywords");
  const useCases = listValues(lines, "use_cases");
  const docsUrl = value("docs_url");

  if (name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error("Skill name must be lowercase kebab-case and no longer than 64 characters.");
  }
  if (description.length > 1024) throw new Error("Skill description exceeds 1,024 characters.");
  if (summary.length > 300) throw new Error("Agensi summary exceeds 300 characters.");
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Skill version must use semantic versioning.");
  if (tags.length > 10) throw new Error("Agensi supports up to 10 tags.");
  if (keywords.length > 10) throw new Error("Agensi supports up to 10 keywords.");
  if (useCases.length > 8) throw new Error("Agensi supports up to 8 use cases.");
  if (!/^https:\/\//i.test(docsUrl)) throw new Error("docs_url must be an HTTPS URL.");

  return { name, version, tags, keywords, useCases };
}

async function main() {
  const outIndex = process.argv.indexOf("--out");
  const requestedOutput = outIndex >= 0 ? process.argv[outIndex + 1] : null;
  if (outIndex >= 0 && (!requestedOutput || requestedOutput.startsWith("--"))) {
    throw new Error("--out requires a destination path.");
  }

  const skillPath = path.join(SKILL_ROOT, "SKILL.md");
  const skillText = await readFile(skillPath, "utf8");
  const metadata = validateFrontmatter(skillText);

  const files = await collectFiles(SKILL_ROOT);
  files.unshift({ absolute: path.join(ROOT, "LICENSE"), archivePath: "LICENSE" });
  files.sort((a, b) => a.archivePath.localeCompare(b.archivePath));
  if (files.length > MAX_FILES) throw new Error("Package exceeds Agensi's 200 text-file limit.");

  const entries = [];
  let uncompressedBytes = 0;
  for (const file of files) {
    const data = await readFile(file.absolute);
    const text = data.toString("utf8");
    if (!Buffer.from(text, "utf8").equals(data)) {
      throw new Error("Invalid UTF-8 text file in Skill package: " + file.archivePath);
    }
    uncompressedBytes += data.length;
    entries.push({ name: file.archivePath, data, text });
  }

  const skillFiles = entries.filter(entry => path.posix.basename(entry.name) === "SKILL.md");
  if (skillFiles.length !== 1 || skillFiles[0].name !== "SKILL.md") {
    throw new Error("Agensi package must contain exactly one SKILL.md, located at the archive root.");
  }

  const payload = entries.map(entry => entry.text).join("\n");
  for (const term of BLOCKED_PROMOTION_TERMS) {
    if (payload.toLowerCase().includes(term.toLowerCase())) {
      throw new Error("Marketplace Skill payload contains out-of-scope promotion text: " + term);
    }
  }
  for (const domain of BLOCKED_CHECKOUT_DOMAINS) {
    if (payload.toLowerCase().includes(domain)) {
      throw new Error("Marketplace Skill payload contains an outside-checkout domain: " + domain);
    }
  }

  if (uncompressedBytes > MAX_UNCOMPRESSED_BYTES) {
    throw new Error("Package exceeds Agensi's 6,000,000-character delivery limit.");
  }

  const output = path.resolve(ROOT, requestedOutput || path.join("dist", "ui-reference-replication-community-" + metadata.version + ".zip"));
  await mkdir(path.dirname(output), { recursive: true });
  const archive = buildZip(entries);
  await writeFile(output, archive);

  console.log(JSON.stringify({
    status: "created",
    output: path.relative(ROOT, output),
    skill: metadata.name,
    version: metadata.version,
    files: entries.length,
    uncompressedBytes,
    archiveBytes: archive.length,
    rootSkillFile: true,
    tags: metadata.tags.length,
    keywords: metadata.keywords.length,
    useCases: metadata.useCases.length
  }, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
