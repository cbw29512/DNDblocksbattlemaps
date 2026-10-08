import { createFallbackRenderer } from './fallbackRenderer.js?v=5f4f0171250c';
import { createThreeRenderer } from './threeRenderer.js?v=5f4f0171250c';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
