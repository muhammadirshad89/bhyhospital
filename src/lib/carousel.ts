/** Pure carousel logic, kept separate from the component so it can be unit tested. */

export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function stepIndex(current: number, length: number, direction: 1 | -1): number {
  return wrapIndex(current + direction, length);
}

export interface AutoplayState {
  hovered: boolean;
  focusWithin: boolean;
  reducedMotion: boolean;
  pageHidden: boolean;
  slideCount: number;
}

export function shouldAutoplay(s: AutoplayState): boolean {
  if (s.slideCount < 2) return false;
  return !(s.hovered || s.focusWithin || s.reducedMotion || s.pageHidden);
}
