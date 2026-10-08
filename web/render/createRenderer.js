import { createFallbackRenderer } from './fallbackRenderer.js?v=f552e21a1ce5';
import { createThreeRenderer } from './threeRenderer.js?v=f552e21a1ce5';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
