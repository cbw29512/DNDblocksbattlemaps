import { createFallbackRenderer } from './fallbackRenderer.js?v=094a169f6732';
import { createThreeRenderer } from './threeRenderer.js?v=094a169f6732';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
