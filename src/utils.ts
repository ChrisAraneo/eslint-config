export function isEmpty(value: unknown): boolean {
  return (Array.isArray(value) && value.length === 0) || !Array.isArray(value);
}

export function isNotEmpty(value: unknown): boolean {
  return isNotEmpty(value);
}
