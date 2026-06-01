import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
} from "docx";
import { LessonPlanDocument } from "../services/api";

export interface ExportedLessonPlanDocument {
  filename: string;
  uri: string;
  plainText: string;
  mimeType?: string;
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

  await file.write(html);

  // Share the file using expo-sharing
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/msword",
      dialogTitle: "Export Lesson Plan",
      UTI: "com.microsoft.word.doc",
    });
  }

  return {
    filename,
    uri: file.uri,
    plainText,
    mimeType: "application/msword",
  };
}


/**
 * Build HTML template for PDF export with professional formatting
 */
function buildPDFHtml(document: LessonPlanDocument): string {
  const body = document.blocks.map((block) => {
    if (block.type === "heading") {
      const level = block.level;
      return `<h${level}>${escapeHtml(block.text)}</h${level}>`;
    }

    if (block.type === "paragraph") {
      return `<p>${escapeHtml(block.text)}</p>`;
    }

    const tag = block.style === "numbered" ? "ol" : "ul";
    const items = block.items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    return `<${tag}>${items}</${tag}>`;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(document.title)}</title>
  <style>
    @page {
      size: letter;
      margin: 72pt;
    }
    body {
      font-family: Arial, sans-serif;
      color: #4B5563;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #1E3A8A;
      margin: 0 0 24pt 0;
      line-height: 1.3;
    }
    h2 {
      font-size: 18pt;
      font-weight: bold;
      color: #1E3A8A;
      margin: 18pt 0 12pt 0;
      line-height: 1.3;
    }
    h3 {
      font-size: 16pt;
      font-weight: 600;
      color: #1E3A8A;
      margin: 14pt 0 10pt 0;
      line-height: 1.3;
    }
    p {
      font-size: 12pt;
      margin: 0 0 12pt 0;
      line-height: 1.5;
    }
    ul, ol {
      font-size: 12pt;
      margin: 0 0 12pt 0;
      padding-left: 36pt;
      line-height: 1.5;
    }
    li {
      margin-bottom: 6pt;
    }
  </style>
</head>
<body>
  ${body.join("\n  ")}
</body>
</html>
  `.trim();
}

/**
 * Export lesson plan as PDF using expo-print
 */
export async function exportLessonPlanToPDF(
  document: LessonPlanDocument,
): Promise<ExportedLessonPlanDocument> {
  try {
    const filename = `${slugify(document.title || "lesson-plan")}.pdf`;
    const html = buildPDFHtml(document);
    const plainText = documentToPlainText(document);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Share the PDF file using expo-sharing
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export Lesson Plan as PDF",
        UTI: "com.adobe.pdf",
      });
    }

    return {
      filename,
      uri,
      plainText,
      mimeType: "application/pdf",
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to generate PDF. Please try again.",
    );
  }
}

/**
 * Build DOCX document with professional formatting
 */
function buildDOCXDocument(document: LessonPlanDocument): Document {
  const sections: Paragraph[] = [];

  document.blocks.forEach((block) => {
    if (block.type === "heading") {
      const headingLevel =
        block.level === 1
          ? HeadingLevel.HEADING_1
          : block.level === 2
            ? HeadingLevel.HEADING_2
            : HeadingLevel.HEADING_3;

      sections.push(
        new Paragraph({
          text: block.text,
          heading: headingLevel,
          spacing: {
            before: block.level === 1 ? 0 : block.level === 2 ? 360 : 280,
            after: block.level === 1 ? 480 : block.level === 2 ? 240 : 200,
          },
        }),
      );
    } else if (block.type === "paragraph") {
      sections.push(
        new Paragraph({
          text: block.text,
          spacing: {
            after: 240,
            line: 360,
          },
        }),
      );
    } else {
      // List block
      block.items.forEach((item, index) => {
        sections.push(
          new Paragraph({
            text: item,
            numbering: {
              reference: block.style === "numbered" ? "numbered-list" : "bullet-list",
              level: 0,
            },
            spacing: {
              after: 120,
              line: 360,
            },
          }),
        );
      });
    }
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: sections,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 24, // 12pt = 24 half-points
            color: "4B5563",
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing
            },
          },
        },
        heading1: {
          run: {
            font: "Arial",
            size: 48, // 24pt
            bold: true,
            color: "1E3A8A",
          },
          paragraph: {
            spacing: {
              line: 312, // 1.3 line spacing
            },
          },
        },
        heading2: {
          run: {
            font: "Arial",
            size: 36, // 18pt
            bold: true,
            color: "1E3A8A",
          },
          paragraph: {
            spacing: {
              line: 312,
            },
          },
        },
        heading3: {
          run: {
            font: "Arial",
            size: 32, // 16pt
            bold: true,
            color: "1E3A8A",
          },
          paragraph: {
            spacing: {
              line: 312,
            },
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "numbered-list",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
          ],
        },
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: "bullet",
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
          ],
        },
      ],
    },
  });
}

/**
 * Export lesson plan as DOCX using docx library
 */
export async function exportLessonPlanToDOCX(
  document: LessonPlanDocument,
): Promise<ExportedLessonPlanDocument> {
  try {
    const filename = `${slugify(document.title || "lesson-plan")}.docx`;
    const plainText = documentToPlainText(document);
    const doc = buildDOCXDocument(document);
    const file = new File(Paths.cache, filename);

    // Generate DOCX as blob
    const blob = await Packer.toBlob(doc);
    
    // Convert blob to array buffer then to Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Write to file
    await file.write(uint8Array);

    // Share the DOCX file using expo-sharing
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        dialogTitle: "Export Lesson Plan as DOCX",
        UTI: "org.openxmlformats.wordprocessingml.document",
      });
    }

    return {
      filename,
      uri: file.uri,
      plainText,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to generate DOCX. Please try again.",
    );
  }
}
