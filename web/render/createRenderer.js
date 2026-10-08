import { createFallbackRenderer } from './fallbackRenderer.js?v=cb5dac18a9bb';
import { createThreeRenderer } from './threeRenderer.js?v=cb5dac18a9bb';
export async function createRenderer(container, handlers) {
    try {
        return await createThreeRenderer(container, handlers);
    }
    catch (error) {
        console.warn('[renderer] Three.js could not initialize; using fallback.', error);
        return createFallbackRenderer(container, handlers);
    }
}
