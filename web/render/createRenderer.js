import { createFallbackRenderer } from './fallbackRenderer.js?v=b07d7b67ce9c';
import { createThreeRenderer } from './threeRenderer.js?v=b07d7b67ce9c';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
