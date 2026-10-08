import { createFallbackRenderer } from './fallbackRenderer.js?v=32b0f453931a';
import { createThreeRenderer } from './threeRenderer.js?v=32b0f453931a';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
