import { createFallbackRenderer } from './fallbackRenderer.js?v=bc4f9b422e47';
import { createThreeRenderer } from './threeRenderer.js?v=bc4f9b422e47';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
