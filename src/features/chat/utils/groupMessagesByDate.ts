import type { ChatMessage } from "../types/chat";

export function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { [dateStr: string]: ChatMessage[] } = {};

  // Sort messages chronologically before grouping (earliest to latest)
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  sorted.forEach((message) => {
    if (!message.createdAt) return;
    const dateStr = new Date(message.createdAt).toDateString();

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
  });

  return groups;
}

export function formatDateDivider(dateString: string, locale: string = "en"): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return locale === "ar" ? "اليوم" : "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return locale === "ar" ? "أمس" : "Yesterday";
  } else {
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}
