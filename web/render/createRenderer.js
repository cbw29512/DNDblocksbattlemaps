import { createFallbackRenderer } from './fallbackRenderer.js?v=739ba7b757ab';
import { createThreeRenderer } from './threeRenderer.js?v=739ba7b757ab';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
