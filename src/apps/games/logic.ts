// Pure game rules, kept apart from drawing so they can be checked (logic.check.ts).

/** Packet Hop: does a square of half-size r at (px, py) touch a wall column with a vertical gap? */
export function hitsWall(px: number, py: number, r: number, wallX: number, wallW: number, gapY: number, gap: number) {
  const overlapsX = px + r > wallX && px - r < wallX + wallW;
  const insideGap = py - r > gapY - gap / 2 && py + r < gapY + gap / 2;
  return overlapsX && !insideGap;
}

export type Span = { x: number; w: number };
export type Placement = { miss: true } | { miss: false; kept: Span; cuts: Span[]; perfect: boolean };

/**
 * Skyline: drop a floor spanning [x, x+w] onto the floor below [prev.x, prev.x+prev.w].
 * Overhang is cut off; no overlap is a miss; within `tol` px counts as perfect and snaps into place.
 */
export function placeFloor(prev: Span, x: number, w: number, tol = 5): Placement {
  if (Math.abs(x - prev.x) <= tol && w <= prev.w + tol) return { miss: false, kept: { x: prev.x, w: Math.min(w, prev.w) }, cuts: [], perfect: true };
  const left = Math.max(prev.x, x);
  const right = Math.min(prev.x + prev.w, x + w);
  if (right - left <= 0) return { miss: true };
  const cuts: Span[] = [];
  if (x < left) cuts.push({ x, w: left - x });
  if (x + w > right) cuts.push({ x: right, w: x + w - right });
  return { miss: false, kept: { x: left, w: right - left }, cuts, perfect: false };
}
