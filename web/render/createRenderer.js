import { createFallbackRenderer } from './fallbackRenderer.js?v=af8354d0e85f';
import { createThreeRenderer } from './threeRenderer.js?v=af8354d0e85f';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
