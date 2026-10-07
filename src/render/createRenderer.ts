import { createFallbackRenderer } from './fallbackRenderer.js';
import { createThreeRenderer } from './threeRenderer.js';
import type { BoardHandlers, BoardRenderer } from './types.js';

export async function createRenderer(
  container: HTMLElement,
  handlers: BoardHandlers
): Promise<BoardRenderer> {
  try {
    return await createThreeRenderer(container, handlers);
  } catch (error) {
    console.warn('[renderer] Three.js could not initialize; using fallback.', error);
    return createFallbackRenderer(container, handlers);
  }
}
