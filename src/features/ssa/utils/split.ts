export function split(value: string, separator: string, limit?: number) {
  const parts = value.split(separator);
  if (!limit || parts.length <= limit) return parts;
  const tail = parts.slice(limit - 1).join(separator);
  return parts.slice(0, limit - 1).concat(tail);
}
