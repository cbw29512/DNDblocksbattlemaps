import { createFallbackRenderer } from './fallbackRenderer.js?v=4bc24a98640c';
import { createThreeRenderer } from './threeRenderer.js?v=4bc24a98640c';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
