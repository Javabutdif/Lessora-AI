import { LogEntry, LogEventType } from "../schemas/log.schema";

type LogPayload = {
  userId?: string;
  eventType: LogEventType;
  subject?: string;
  metadata?: Record<string, unknown>;
};

export async function createActivityLog(payload: LogPayload) {
  return LogEntry.create({
    userId: payload.userId || null,
    eventType: payload.eventType,
    subject: payload.subject || "",
    metadata: payload.metadata || {},
  });
}
