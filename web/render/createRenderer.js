import { createFallbackRenderer } from './fallbackRenderer.js?v=ebdfcba6160b';
import { createThreeRenderer } from './threeRenderer.js?v=ebdfcba6160b';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
