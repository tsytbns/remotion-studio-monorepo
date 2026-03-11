import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const cwd = process.cwd();
const compositionId = "ModernLegacyArtworkReveal";
const entryPoint = path.join(cwd, "src/index.ts");
const outputRoot = path.join(cwd, "out", "artwork-reveals");
const manifestPath = path.join(outputRoot, "manifest.json");
const layoutVariants = ["catalog", "registry", "index"];
const modernLegacyLastLot = 81;
const bloomNowFirstLot = 101;
const defaultCaptionCandidates = [
  process.env.CAPTION_JSON_PATH,
  "/Users/tsytbns/Documents/GitHub/ModernGallery/backend/data/Caption.json",
  path.join(cwd, "resources /Caption.json"),
  path.join(cwd, "public", "assets", "data", "Caption.json"),
].filter(Boolean);
const defaultImageRootCandidates = [
  process.env.IMAGE_ROOT_PATH,
  path.join(cwd, "resources /images"),
  path.join(cwd, "public", "assets", "images", "modern-legacy"),
].filter(Boolean);

const yenFormatter = new Intl.NumberFormat("en-US");

const normalizeLotNo = (lotNo) => {
  return String(lotNo ?? "").trim().padStart(3, "0");
};

const getProgramFromLotNo = (lotNo) => {
  const parsed = Number.parseInt(String(lotNo).trim(), 10);

  if (
    Number.isFinite(parsed) &&
    parsed >= 1 &&
    parsed <= modernLegacyLastLot
  ) {
    return "modern-legacy";
  }

  if (Number.isFinite(parsed) && parsed >= bloomNowFirstLot) {
    return "bloom-now";
  }

  return "modern-legacy";
};

const formatProgress = (progress) => {
  const normalized = progress <= 1 ? progress * 100 : progress;

  return `${Math.max(0, Math.min(100, normalized)).toFixed(0)}%`;
};

const getEstimate = (estimate) => {
  if (!estimate) {
    return null;
  }

  const min =
    typeof estimate.min === "number"
      ? `¥${yenFormatter.format(estimate.min)}`
      : null;
  const max =
    typeof estimate.max === "number"
      ? `¥${yenFormatter.format(estimate.max)}`
      : null;

  if (min && max) {
    return `Estimate ${min} - ${max}`;
  }

  return min || max ? `Estimate ${min || max}` : null;
};

const pickText = (value) => {
  if (!value || typeof value !== "object") {
    return "";
  }

  return value.eng || value.jpn || "";
};

const resolveCaptionPath = async () => {
  for (const candidate of defaultCaptionCandidates) {
    if (!candidate) {
      continue;
    }

    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("Caption.json could not be found.");
};

const resolveImageRoot = async () => {
  for (const candidate of defaultImageRootCandidates) {
    if (!candidate) {
      continue;
    }

    try {
      const stat = await fs.stat(candidate);

      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Artwork image root could not be found.");
};

const getDataUrlForImage = async (imagePath) => {
  const extension = path.extname(imagePath).toLowerCase();
  const mimeType =
    extension === ".webp"
      ? "image/webp"
      : extension === ".png"
        ? "image/png"
        : "image/jpeg";
  const buffer = await fs.readFile(imagePath);

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

const buildRecords = async (captionPath, imageRoot) => {
  const [captionJson, imageFiles] = await Promise.all([
    fs.readFile(captionPath, "utf8"),
    fs.readdir(imageRoot),
  ]);
  const imageSet = new Set(imageFiles);
  const rawEntries = JSON.parse(captionJson);

  return rawEntries
    .map((entry) => {
      const rawLotNo = String(entry.lot_no ?? "").trim();

      if (rawLotNo.length === 0) {
        return null;
      }

      const lotNo = normalizeLotNo(rawLotNo);
      const jpg = `${lotNo}.jpg`;
      const webp = `${lotNo}.webp`;

      if (!imageSet.has(jpg) && !imageSet.has(webp)) {
        return null;
      }

      const extension = imageSet.has(jpg) ? "jpg" : "webp";

      return {
        archiveLabel: null,
        artist: pickText(entry.auth_name),
        estimate: getEstimate(entry.estimate),
        imagePath: path.join(imageRoot, `${lotNo}.${extension}`),
        lotNo,
        medium: pickText(entry.medium),
        outputDirectory: path.join(outputRoot, getProgramFromLotNo(lotNo)),
        program: getProgramFromLotNo(lotNo),
        title: pickText(entry.title),
        year: entry.executed || "",
      };
    })
    .filter(Boolean);
};

const filterLots = (records) => {
  const onlyLots = process.env.ONLY_LOTS
    ? new Set(
        process.env.ONLY_LOTS.split(",")
          .map((value) => normalizeLotNo(value))
          .filter(Boolean),
      )
    : null;
  const lotFrom = process.env.LOT_FROM
    ? Number.parseInt(process.env.LOT_FROM, 10)
    : null;
  const lotTo = process.env.LOT_TO ? Number.parseInt(process.env.LOT_TO, 10) : null;

  return records.filter((record) => {
    const lotNumber = Number.parseInt(record.lotNo, 10);

    if (onlyLots && !onlyLots.has(record.lotNo)) {
      return false;
    }

    if (Number.isFinite(lotFrom) && lotNumber < lotFrom) {
      return false;
    }

    if (Number.isFinite(lotTo) && lotNumber > lotTo) {
      return false;
    }

    return true;
  });
};

const log = (message) => {
  process.stdout.write(`${message}\n`);
};

const renderAll = async () => {
  const captionPath = await resolveCaptionPath();
  const imageRoot = await resolveImageRoot();
  const allRecords = await buildRecords(captionPath, imageRoot);
  const records = filterLots(allRecords);

  if (records.length === 0) {
    throw new Error("No artwork records matched the current render filter.");
  }

  await fs.mkdir(outputRoot, { recursive: true });
  log(`Using caption data: ${captionPath}`);
  log(`Using image root: ${imageRoot}`);
  log(`Rendering ${records.length} artwork reveals`);

  const bundleLocation = await bundle({
    entryPoint,
    onProgress: (progress) => {
      process.stdout.write(`Bundling ${formatProgress(progress)}\r`);
    },
  });

  process.stdout.write("\n");

  const failures = [];
  const manifest = [];

  for (const [index, record] of records.entries()) {
    const layoutVariant = layoutVariants[index % layoutVariants.length];
    const outputLocation = path.join(record.outputDirectory, `${record.lotNo}.mp4`);
    const imageSrc = await getDataUrlForImage(record.imagePath);
    const inputProps = {
      archiveLabel: record.archiveLabel,
      artist: record.artist,
      artworkPosition: {
        fit: "contain",
        scale: 1,
        x: "center",
        y: "center",
      },
      estimate: record.estimate,
      imageSrc,
      layoutVariant,
      lotNo: record.lotNo,
      medium: record.medium,
      title: record.title,
      year: record.year,
    };

    await fs.mkdir(record.outputDirectory, { recursive: true });

    log(
      `[${index + 1}/${records.length}] Lot ${record.lotNo} -> ${path.relative(
        cwd,
        outputLocation,
      )}`,
    );

    try {
      const composition = await selectComposition({
        id: compositionId,
        inputProps,
        serveUrl: bundleLocation,
      });

      await renderMedia({
        codec: "h264",
        composition,
        crf: 18,
        inputProps,
        logLevel: "warn",
        outputLocation,
        overwrite: true,
        serveUrl: bundleLocation,
      });

      manifest.push({
        layoutVariant,
        lotNo: record.lotNo,
        output: path.relative(cwd, outputLocation),
        program: record.program,
      });
    } catch (error) {
      failures.push({
        error: error instanceof Error ? error.message : String(error),
        lotNo: record.lotNo,
      });
      log(`Failed lot ${record.lotNo}: ${failures[failures.length - 1].error}`);
    }
  }

  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        captionPath,
        compositionId,
        generatedAt: new Date().toISOString(),
        items: manifest,
        failures,
      },
      null,
      2,
    ),
    "utf8",
  );

  if (failures.length > 0) {
    throw new Error(
      `${failures.length} artwork reveal render(s) failed. See ${manifestPath}.`,
    );
  }

  log(`Finished. Manifest written to ${path.relative(cwd, manifestPath)}`);
};

await renderAll();
