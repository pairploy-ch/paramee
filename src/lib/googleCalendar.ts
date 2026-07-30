function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsDate(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeIcsText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/**
 * Builds an iCalendar (.ics) invite. Passed to nodemailer's `icalEvent` option
 * with method "request" — Gmail then recognizes it as a real calendar invite
 * and offers to add it to the organizer/attendee's calendar with one click,
 * no Google API credentials needed.
 */
export function buildBookingIcs({
  uid,
  title,
  description,
  location,
  start,
  end,
  organizerEmail,
  attendeeEmail,
}: {
  uid: string;
  title: string;
  description: string;
  location?: string;
  start: Date;
  end: Date;
  organizerEmail: string;
  attendeeEmail: string;
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//Paramee Asset//Booking//TH",
    "VERSION:2.0",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    `ORGANIZER;CN=Paramee Asset:mailto:${organizerEmail}`,
    `ATTENDEE;CN=Paramee Asset;RSVP=TRUE:mailto:${attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.join("\r\n");
}
