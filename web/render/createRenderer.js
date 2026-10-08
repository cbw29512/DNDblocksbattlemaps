import { createFallbackRenderer } from './fallbackRenderer.js?v=770c6a3e9fd9';
import { createThreeRenderer } from './threeRenderer.js?v=770c6a3e9fd9';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
