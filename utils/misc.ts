export function calcHypotenuse(a: number, b: number) {
  return Math.sqrt(a * a + b * b);
}

// Thank you https://stackoverflow.com/a/47593316/22839249
export function mulberry32(a: number) {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
