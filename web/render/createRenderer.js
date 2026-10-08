import { createFallbackRenderer } from './fallbackRenderer.js?v=0e9ebf4264dd';
import { createThreeRenderer } from './threeRenderer.js?v=0e9ebf4264dd';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
