import { existsSync, statSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { resolveAppsRoot } from "@/lib/project-meta";
import {
  collectRenderAssets,
  isRenderableVideoRelativePath,
} from "@/lib/render-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_BY_EXT: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".gif": "image/gif",
};

function hasTraversalPattern(value: string): boolean {
  return /(^|[\\/])\.\.([\\/]|$)/.test(value);
}

function isWithinPath(targetPath: string, basePath: string): boolean {
  const relative = path.relative(basePath, targetPath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

function buildRenderUrl(appId: string, relativePath: string): string {
  return `/api/renders?app=${encodeURIComponent(appId)}&file=${encodeURIComponent(relativePath)}`;
}

export async function GET(request: NextRequest) {
  const appId = request.nextUrl.searchParams.get("app");
  const file = request.nextUrl.searchParams.get("file");

  if (!appId || hasTraversalPattern(appId)) {
    return NextResponse.json(
      { message: "Invalid app parameter." },
      { status: 400 },
    );
  }

  const appsRoot = resolveAppsRoot();
  const appDir = path.resolve(appsRoot, appId);
  if (!isWithinPath(appDir, appsRoot)) {
    return NextResponse.json({ message: "Invalid app path." }, { status: 400 });
  }

  if (!existsSync(appDir) || !statSync(appDir).isDirectory()) {
    return NextResponse.json({ message: "App not found." }, { status: 404 });
  }

  if (file) {
    if (hasTraversalPattern(file) || !isRenderableVideoRelativePath(file)) {
      return NextResponse.json(
        { message: "Invalid file path." },
        { status: 400 },
      );
    }
    const renderPath = path.resolve(appDir, file);
    if (!isWithinPath(renderPath, appDir)) {
      return NextResponse.json(
        { message: "Invalid file path." },
        { status: 400 },
      );
    }
    if (!existsSync(renderPath) || !statSync(renderPath).isFile()) {
      return NextResponse.json(
        { message: "Render file not found." },
        { status: 404 },
      );
    }

    const fileBuffer = await fs.readFile(renderPath).catch(() => null);
    if (!fileBuffer) {
      return NextResponse.json(
        { message: "Could not read render file." },
        { status: 500 },
      );
    }

    const ext = path.extname(renderPath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(renderPath)}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const files = await collectRenderAssets(appDir, 200);
  return NextResponse.json({
    ok: true,
    appId,
    files: files.map((item) => ({
      relativePath: item.relativePath,
      fileName: item.fileName,
      size: item.size,
      updatedAt: new Date(item.mtimeMs).toISOString(),
      url: buildRenderUrl(appId, item.relativePath),
    })),
  });
}
