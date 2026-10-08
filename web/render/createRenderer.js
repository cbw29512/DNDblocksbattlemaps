import { createFallbackRenderer } from './fallbackRenderer.js?v=9ddabf9ca598';
import { createThreeRenderer } from './threeRenderer.js?v=9ddabf9ca598';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
