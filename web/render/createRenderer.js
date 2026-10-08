import { createFallbackRenderer } from './fallbackRenderer.js?v=54d57171a3e0';
import { createThreeRenderer } from './threeRenderer.js?v=54d57171a3e0';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
