export function isEmpty(value: unknown): boolean {
  return (Array.isArray(value) && value.length === 0) || !Array.isArray(value);
}
