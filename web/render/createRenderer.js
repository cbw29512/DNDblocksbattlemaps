import { createFallbackRenderer } from './fallbackRenderer.js?v=a79f5b79744f';
import { createThreeRenderer } from './threeRenderer.js?v=a79f5b79744f';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
