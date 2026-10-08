/**
 * The site rotates between four colour palettes. Each has a light and a dark
 * version in globals.css; light/dark itself is handled by next-themes.
 */
export const palettes = [
  { id: 'matcha', name: 'Matcha & sakura' },
  { id: 'rose', name: 'Rose & midnight' },
  { id: 'palette', name: 'Mauve & duck egg' },
  { id: 'glitter', name: 'Strawberry + glitter' },
] as const;

export type PaletteId = (typeof palettes)[number]['id'];

export const PALETTE_KEY = 'palette';
export const DEFAULT_PALETTE: PaletteId = 'matcha';

/**
 * Runs in <head> before first paint, so the page never flashes the wrong colours.
 * The pick is kept for the visit (sessionStorage), and a new visit draws again.
 */
export const paletteScript = `(function(){try{var p=${JSON.stringify(palettes.map((p) => p.id))};var k='${PALETTE_KEY}';var s=sessionStorage.getItem(k);if(p.indexOf(s)<0){s=p[Math.floor(Math.random()*p.length)];sessionStorage.setItem(k,s)}document.documentElement.setAttribute('data-pal',s)}catch(e){}})();`;

export function setPalette(id: PaletteId) {
  document.documentElement.setAttribute('data-pal', id);
  try {
    sessionStorage.setItem(PALETTE_KEY, id);
  } catch {
    // Private windows can refuse storage; the palette still changes for this page.
  }
}
