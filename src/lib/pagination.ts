export function pageCount(total: number, pageSize: number): number {
  if (pageSize <= 0) throw new RangeError("pageSize must be positive");
  return Math.max(1, Math.ceil(total / pageSize));
}

export function clampPage(page: number, total: number, pageSize: number): number {
  return Math.min(Math.max(1, Math.trunc(page)), pageCount(total, pageSize));
}

export function hasNextPage(page: number, pageSize: number, total: number): boolean {
  return page * pageSize <= total;
}
