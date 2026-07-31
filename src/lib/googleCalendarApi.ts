import { google } from "googleapis";

function getServiceAccountCredentials(): { client_email: string; private_key: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    return null;
  }
}

export function isGoogleCalendarConfigured() {
  return Boolean(getServiceAccountCredentials() && process.env.GOOGLE_CALENDAR_ID);
}

function getCalendarClient() {
  const credentials = getServiceAccountCredentials();
  if (!credentials) throw new Error("Google Calendar service account is not configured");

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}

/**
 * Creates a real event directly on the office Google Calendar via a service
 * account — bypasses email .ics invites entirely, which Gmail does not
 * reliably render as an interactive invite for self-addressed mail.
 */
export async function createBookingCalendarEvent({
  title,
  description,
  location,
  start,
  end,
}: {
  title: string;
  description: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  if (!isGoogleCalendarConfigured()) return { created: false as const };

  const calendar = getCalendarClient();
  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: {
      summary: title,
      description,
      location,
      start: { dateTime: start.toISOString(), timeZone: "Asia/Bangkok" },
      end: { dateTime: end.toISOString(), timeZone: "Asia/Bangkok" },
    },
  });
  return { created: true as const };
}

export interface CalendarEventSummary {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
}

/** Reads events directly from the office Google Calendar for the admin calendar view. */
export async function fetchCalendarEvents({
  timeMin,
  timeMax,
}: {
  timeMin: Date;
  timeMax: Date;
}): Promise<CalendarEventSummary[]> {
  if (!isGoogleCalendarConfigured()) return [];

  const calendar = getCalendarClient();
  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  return (res.data.items ?? []).map((ev) => ({
    id: ev.id ?? "",
    title: ev.summary ?? "(ไม่มีชื่อ)",
    description: ev.description ?? "",
    location: ev.location ?? "",
    start: ev.start?.dateTime ?? ev.start?.date ?? "",
    end: ev.end?.dateTime ?? ev.end?.date ?? "",
  }));
}
