/**
 * @param {string} value
 * @param {string} separator
 * @param {number} [limit]
 */
export function split(value, separator, limit) {
  const parts = value.split(separator);
  if (!limit || parts.length <= limit) return parts;
  const tail = parts.slice(limit - 1).join(separator);
  return parts.slice(0, limit - 1).concat(tail);
}
