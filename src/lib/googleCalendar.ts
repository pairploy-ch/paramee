function toGoogleDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Builds a Google Calendar "Add event" link — no OAuth/credentials needed,
 * works for both the customer and the office by just opening the link.
 */
export function buildGoogleCalendarLink({
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
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
    details: description,
  });
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
