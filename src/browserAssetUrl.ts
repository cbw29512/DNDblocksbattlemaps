export function resolveBrowserAssetUrl(path: string): string {
  try {
    const base = new URL('.', document.baseURI);
    return new URL(path.replace(/^\.\//, ''), base).href;
  } catch (error) {
    console.warn('[asset] Could not resolve browser asset URL.', { path, error });
    return path;
  }
}
