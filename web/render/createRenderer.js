import { createFallbackRenderer } from './fallbackRenderer.js?v=12bc94ef92aa';
import { createThreeRenderer } from './threeRenderer.js?v=12bc94ef92aa';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
