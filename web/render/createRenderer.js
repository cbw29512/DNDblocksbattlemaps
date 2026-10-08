import { createFallbackRenderer } from './fallbackRenderer.js?v=bf4a12ccb7a2';
import { createThreeRenderer } from './threeRenderer.js?v=bf4a12ccb7a2';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
