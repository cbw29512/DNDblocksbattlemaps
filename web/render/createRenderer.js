import { createFallbackRenderer } from './fallbackRenderer.js?v=e8bec7409b8c';
import { createThreeRenderer } from './threeRenderer.js?v=e8bec7409b8c';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
