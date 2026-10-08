import { createFallbackRenderer } from './fallbackRenderer.js?v=b5a3632acbe5';
import { createThreeRenderer } from './threeRenderer.js?v=b5a3632acbe5';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
