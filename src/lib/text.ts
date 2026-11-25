export function resultSummary(count: number, query: string): string {
  const q = query.trim();
  const label = q[0].toUpperCase() + q.slice(1);
  return `${count} ${count === 1 ? "result" : "results"} for "${label}"`;
}
