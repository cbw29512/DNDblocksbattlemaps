import { applyCommand, invertCommand } from './commands.js?v=32b0f453931a';
export function createHistory() {
    return { past: [], future: [] };
}
export function commit(state, history, command) {
    return {
        state: applyCommand(state, command),
        history: { past: [...history.past, command], future: [] }
    };
}
export function undo(state, history) {
    const command = history.past.at(-1);
    if (!command)
        return { state, history };
    return {
        state: applyCommand(state, invertCommand(command)),
        history: {
            past: history.past.slice(0, -1),
            future: [command, ...history.future]
        }
    };
}
export function redo(state, history) {
    const command = history.future[0];
    if (!command)
        return { state, history };
    return {
        state: applyCommand(state, command),
        history: {
            past: [...history.past, command],
            future: history.future.slice(1)
        }
    };
}
