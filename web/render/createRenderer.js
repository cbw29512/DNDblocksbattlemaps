import { createFallbackRenderer } from './fallbackRenderer.js?v=1f6bf03e447c';
import { createThreeRenderer } from './threeRenderer.js?v=1f6bf03e447c';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
