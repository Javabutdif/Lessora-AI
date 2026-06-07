import { DailyMetric } from "../schemas/daily-metric.schema";
import { LogEntry } from "../schemas/log.schema";
import { ResendService } from "./resend.service";

type AggregatedMetrics = {
  reportDate: string;
  windowStart: Date;
  windowEnd: Date;
  totalLogins: number;
  totalRegistrations: number;
  totalLessonPlansGenerated: number;
  lessonPlansBySubject: Record<string, number>;
  uniqueActiveUsers: number;
};

type MetricCounts = Omit<AggregatedMetrics, "reportDate" | "windowStart" | "windowEnd">;

type DailyReportAnalysis = {
  summaryText: string;
  detailedAnalysis: string;
  highlights: string[];
};

const REPORT_EMAIL = "jamesgenabio31@gmail.com";
const REPORT_TIME_ZONE = "Asia/Manila";

function toReportDayKey(date: Date) {
  return date.toLocaleDateString("en-CA", {
    timeZone: REPORT_TIME_ZONE,
  });
}

function getReportWindow(date: Date) {
  const dayKey = toReportDayKey(date);
  const start = new Date(`${dayKey}T00:00:00+08:00`);
  const end = new Date(`${dayKey}T23:59:59.999+08:00`);
  return { dayKey, start, end };
}

function summarizeDay(logs: Array<{ eventType: string; userId?: any; subject?: string }>): MetricCounts {
  const lessonPlansBySubject: Record<string, number> = {};
  const uniqueUsers = new Set<string>();

  let totalLogins = 0;
  let totalRegistrations = 0;
  let totalLessonPlansGenerated = 0;

  for (const log of logs) {
    if (log.userId) {
      uniqueUsers.add(String(log.userId));
    }

    if (log.eventType === "user_login") {
      totalLogins += 1;
    }

    if (log.eventType === "user_registration") {
      totalRegistrations += 1;
    }

    if (log.eventType === "lesson_plan_generated") {
      totalLessonPlansGenerated += 1;
      const subject = (log.subject || "Uncategorized").trim() || "Uncategorized";
      lessonPlansBySubject[subject] = (lessonPlansBySubject[subject] || 0) + 1;
    }
  }

  return {
    totalLogins,
    totalRegistrations,
    totalLessonPlansGenerated,
    lessonPlansBySubject,
    uniqueActiveUsers: uniqueUsers.size,
  };
}

function buildPrompt(metric: MetricCounts, previousMetric?: MetricCounts) {
  return [
    "You are writing as the founder of Lessora AI.",
    "Keep the tone friendly, encouraging, and confident.",
    "Return only valid JSON with these keys: summaryText, detailedAnalysis, highlights.",
    "summaryText should be 1 short paragraph.",
    "detailedAnalysis should be 2 short paragraphs.",
    "highlights should be an array of 3 to 5 short bullet-style strings.",
    "Focus on trends, wins, risks, and practical next steps.",
    `Today's data: ${JSON.stringify(metric)}`,
    previousMetric
      ? `Yesterday's data: ${JSON.stringify(previousMetric)}`
      : "Yesterday's data: not available",
  ].join("\n");
}

async function analyzeMetrics(metric: MetricCounts, previousMetric?: MetricCounts) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      summaryText: "OpenAI analysis is unavailable because OPENAI_API_KEY is not set.",
      detailedAnalysis: "",
      highlights: [],
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "You are the founder of Lessora AI writing a daily product and usage report. Return only JSON.",
        },
        {
          role: "user",
          content: buildPrompt(metric, previousMetric),
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
      temperature: 0.4,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || "OpenAI daily report analysis failed",
    );
  }

  const text =
    payload.output_text ||
    payload.output?.flatMap((item: any) => item.content ?? [])?.find(
      (content: any) => content.type === "output_text",
    )?.text ||
    "";

  if (!text) {
    throw new Error("OpenAI returned an empty daily report response");
  }

  let parsed: DailyReportAnalysis;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("OpenAI returned an invalid daily report JSON response");
  }

  const summaryText = String(parsed?.summaryText || "").trim();
  const detailedAnalysis = String(parsed?.detailedAnalysis || "").trim();
  const highlights = Array.isArray(parsed?.highlights)
    ? parsed.highlights.map((item) => String(item).trim()).filter(Boolean)
    : [];

  if (!summaryText || !detailedAnalysis) {
    throw new Error("OpenAI returned an incomplete daily report JSON response");
  }

  return {
    summaryText,
    detailedAnalysis,
    highlights,
  };
}

function buildEmailHtml(
  reportDate: string,
  metric: MetricCounts,
  analysis: DailyReportAnalysis,
) {
  const subjectRows = Object.entries(metric.lessonPlansBySubject)
    .map(([subject, count]) => `<li><strong>${subject}</strong>: ${count}</li>`)
    .join("");

  const highlightRows = analysis.highlights.length
    ? analysis.highlights.map((item) => `<li>${item}</li>`).join("")
    : "<li>No additional highlights</li>";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 8px;">Lessora AI Daily Report - ${reportDate}</h2>
      <p style="margin-top: 0;">Here is your daily activity summary and founder-style analysis.</p>
      <h3>Metrics</h3>
      <ul>
        <li>Logins: ${metric.totalLogins}</li>
        <li>Registrations: ${metric.totalRegistrations}</li>
        <li>Lesson plans generated: ${metric.totalLessonPlansGenerated}</li>
        <li>Unique active users: ${metric.uniqueActiveUsers}</li>
      </ul>
      <h3>Lesson Plans by Subject</h3>
      <ul>${subjectRows || "<li>No lesson plans generated</li>"}</ul>
      <h3>Summary</h3>
      <p>${analysis.summaryText}</p>
      <h3>Detailed Analysis</h3>
      <p>${analysis.detailedAnalysis}</p>
      <h3>Highlights</h3>
      <ul>${highlightRows}</ul>
    </div>
  `;
}

export const DailyReportService = {
  async runForDate(now = new Date()) {
    const { dayKey, start, end } = getReportWindow(now);
    const previousDate = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    const previousWindow = getReportWindow(previousDate);

    const [todayLogs, yesterdayLogs] = await Promise.all([
      LogEntry.find({ createdAt: { $gte: start, $lte: end } })
        .select("userId eventType subject createdAt")
        .lean(),
      LogEntry.find({
        createdAt: { $gte: previousWindow.start, $lte: previousWindow.end },
      })
        .select("userId eventType subject createdAt")
        .lean(),
    ]);

    const todayMetric = summarizeDay(todayLogs);
    const yesterdayMetric = summarizeDay(yesterdayLogs);

    const analysis = await analyzeMetrics(todayMetric, yesterdayMetric);

    const metric = await DailyMetric.findOneAndUpdate(
      { reportDate: dayKey },
      {
        $set: {
          reportDate: dayKey,
          windowStart: start,
          windowEnd: end,
          ...todayMetric,
          summaryText: analysis.summaryText,
          detailedAnalysis: analysis.detailedAnalysis,
          emailStatus: "pending",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await ResendService.send({
      to: REPORT_EMAIL,
      subject: `Lessora AI Daily Report - ${dayKey}`,
      html: buildEmailHtml(dayKey, todayMetric, analysis),
    });

    metric.emailStatus = "sent";
    metric.emailSentAt = new Date();
    metric.summaryText = analysis.summaryText;
    metric.detailedAnalysis = analysis.detailedAnalysis;
    await metric.save();

    return metric;
  },
};
