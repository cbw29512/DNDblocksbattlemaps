import { createFallbackRenderer } from './fallbackRenderer.js?v=e0b1f72628a1';
import { createThreeRenderer } from './threeRenderer.js?v=e0b1f72628a1';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
