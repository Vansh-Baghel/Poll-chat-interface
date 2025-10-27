import { useEffect, useState } from "react";

function formatChatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useFormattedTime(timestamp: string) {
  const [formatted, setFormatted] = useState(() => formatChatTimestamp(timestamp));

  useEffect(() => {
    const update = () => setFormatted(formatChatTimestamp(timestamp));
    update(); // initial run

    const interval = setInterval(update, 60000); // update every 1 minute
    return () => clearInterval(interval);
  }, [timestamp]);

  return formatted;
}
