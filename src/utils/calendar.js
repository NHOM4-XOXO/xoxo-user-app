function toUtcISOStringLocalDateTime(localStr) {
    const [date, time] = localStr.split("T");
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0);
    return dt.toISOString();
}

export function buildGoogleCalendarUrl({ title, description = "", location = "", dtStart, durationMin = 60 }) {
    const start = toUtcISOStringLocalDateTime(dtStart).replace(/[-:]/g, "").replace(".000Z", "Z");
    const endDate = new Date(toUtcISOStringLocalDateTime(dtStart));
    endDate.setMinutes(endDate.getMinutes() + Number(durationMin || 60));
    const end = endDate.toISOString().replace(/[-:]/g, "").replace(".000Z", "Z");

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title || "Sự kiện",
        dates: `${start}/${end}`,
        details: description,
        location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICS({ title, description = "", location = "", dtStart, durationMin = 60, reminderMin = 30 }) {
    const start = toUtcISOStringLocalDateTime(dtStart);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + Number(durationMin || 60));

    const fmt = (d) =>
        d.toISOString().replace(/[-:]/g, "").replace(".000Z", "Z");

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//XoXO//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@xoxo`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(new Date(start))}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${(title || "Sự kiện").replace(/\n/g, " ")}`,
        `DESCRIPTION:${(description || "").replace(/\n/g, " ")}`,
        location ? `LOCATION:${location.replace(/\n/g, " ")}` : "",
        reminderMin > 0 ? "BEGIN:VALARM" : "",
        reminderMin > 0 ? `TRIGGER:-PT${reminderMin}M` : "",
        reminderMin > 0 ? "ACTION:DISPLAY" : "",
        reminderMin > 0 ? "DESCRIPTION:Reminder" : "",
        reminderMin > 0 ? "END:VALARM" : "",
        "END:VEVENT",
        "END:VCALENDAR",
    ].filter(Boolean);

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
