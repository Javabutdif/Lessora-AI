import { File, Paths } from "expo-file-system";
import { LessonPlanDocument } from "../services/api";

export interface ExportedLessonPlanDocument {
  filename: string;
  uri: string;
  plainText: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "lesson-plan"
  );
}

export function buildWordCompatibleHtml(document: LessonPlanDocument) {
  const body = document.blocks.map((block) => {
    if (block.type === "heading") {
      return `<div class="doc-block"><h${block.level}>${escapeHtml(block.text)}</h${block.level}></div>`;
    }

    if (block.type === "paragraph") {
      return `<div class="doc-block"><p>${escapeHtml(block.text)}</p></div>`;
    }

    const tag = block.style === "numbered" ? "ol" : "ul";
    const items = block.items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    return `<div class="doc-block"><${tag}>${items}</${tag}></div>`;
  });

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(document.title)}</title>`,
    "<style>",
    "body { font-family: Arial, sans-serif; line-height: 1.4; margin: 24px; color: #000; }",
    ".doc-block { margin-bottom: 14px; }",
    "h1 { font-size: 24px; margin: 0 0 12px 0; }",
    "h2 { font-size: 18px; margin: 18px 0 10px 0; }",
    "h3 { font-size: 16px; margin: 14px 0 8px 0; }",
    "p { font-size: 12pt; margin: 0 0 10px 0; }",
    "ul, ol { margin: 0 0 10px 20px; padding-left: 20px; }",
    "li { font-size: 12pt; margin-bottom: 4px; }",
    "</style>",
    "</head>",
    "<body>",
    ...body,
    "</body>",
    "</html>",
  ].join("");
}

export function documentToPlainText(document: LessonPlanDocument) {
  return document.blocks
    .flatMap((block) => {
      if (block.type === "heading" || block.type === "paragraph") {
        return [block.text];
      }

      return block.items.map((item, index) =>
        block.style === "numbered" ? `${index + 1}. ${item}` : `- ${item}`,
      );
    })
    .join("\n");
}

export async function exportLessonPlanDocumentToCache(
  document: LessonPlanDocument,
): Promise<ExportedLessonPlanDocument> {
  const filename = `${slugify(document.title || "lesson-plan")}.doc`;
  const html = buildWordCompatibleHtml(document);
  const plainText = documentToPlainText(document);
  const file = new File(Paths.cache, filename);

  file.write(html);

  return {
    filename,
    uri: file.uri,
    plainText,
  };
}
