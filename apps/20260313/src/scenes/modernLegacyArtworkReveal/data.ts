import { staticFile } from "remotion";
import captionData from "../../../resources /Caption.json";

type CaptionRecord = (typeof captionData)[number];

export type ModernLegacyArtworkRecord = {
  archiveLabel: string | null;
  artist: string;
  estimate: string | null;
  imageSrc: string;
  lotNo: string;
  medium: string;
  title: string;
  year: string;
};

const yenFormatter = new Intl.NumberFormat("en-US");

const normalizeLotNo = (lotNo: string) => {
  return lotNo.padStart(3, "0");
};

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const formatEstimate = (estimate: CaptionRecord["estimate"]) => {
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

const pickArchiveLabel = (entry: CaptionRecord) => {
  const candidates = [
    entry.provenance?.eng,
    entry.warranty?.eng,
    entry.document?.eng,
  ]
    .map((value) => value?.trim() ?? "")
    .filter((value) => value.length > 0);

  if (candidates.length === 0) {
    return null;
  }

  return truncate(candidates[0], 82);
};

export const modernLegacyArtworkRecords: ModernLegacyArtworkRecord[] =
  captionData.map((entry) => {
    const lotNo = normalizeLotNo(entry.lot_no);

    return {
      archiveLabel: pickArchiveLabel(entry),
      artist: entry.auth_name.eng || entry.auth_name.jpn,
      estimate: formatEstimate(entry.estimate),
      imageSrc: staticFile(`assets/images/modern-legacy/${lotNo}.webp`),
      lotNo,
      medium: entry.medium.eng || entry.medium.jpn,
      title: entry.title.eng || entry.title.jpn,
      year: entry.executed,
    };
  });

export const getModernLegacyArtworkRecord = (lotNo?: string) => {
  if (!lotNo) {
    return modernLegacyArtworkRecords[0];
  }

  return (
    modernLegacyArtworkRecords.find(
      (record) => record.lotNo === normalizeLotNo(lotNo),
    ) ?? modernLegacyArtworkRecords[0]
  );
};
