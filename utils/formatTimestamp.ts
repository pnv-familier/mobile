export const formatTimestamp = (timestamp: string | number[]): string => {
  if (!timestamp) return '';

  let date: Date;

  if (Array.isArray(timestamp)) {
    const [year, month, day, hour = 0, minute = 0] = timestamp;
    date = new Date(year, month - 1, day, hour, minute);
  } else {
    const normalized = (timestamp as string).includes('Z') || (timestamp as string).includes('+')
      ? timestamp as string
      : (timestamp as string) + 'Z';
    date = new Date(normalized);
  }

  if (isNaN(date.getTime())) return '';

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};
