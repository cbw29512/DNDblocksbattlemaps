import { createFallbackRenderer } from './fallbackRenderer.js?v=inspect-20261010';
import { createThreeRenderer } from './threeRenderer.js?v=inspect-20261010';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
