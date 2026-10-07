import { applyCommand, invertCommand } from './commands.js';
import type { BoardState, EditCommand, HistoryState } from './types.js';

export function createHistory(): HistoryState {
  return { past: [], future: [] };
}

export function commit(
  state: BoardState,
  history: HistoryState,
  command: EditCommand
): { state: BoardState; history: HistoryState } {
  return {
    state: applyCommand(state, command),
    history: { past: [...history.past, command], future: [] }
  };
}

export function undo(
  state: BoardState,
  history: HistoryState
): { state: BoardState; history: HistoryState } {
  const command = history.past.at(-1);
  if (!command) return { state, history };

  return {
    state: applyCommand(state, invertCommand(command)),
    history: {
      past: history.past.slice(0, -1),
      future: [command, ...history.future]
    }
  };
}

export function redo(
  state: BoardState,
  history: HistoryState
): { state: BoardState; history: HistoryState } {
  const command = history.future[0];
  if (!command) return { state, history };

  return {
    state: applyCommand(state, command),
    history: {
      past: [...history.past, command],
      future: history.future.slice(1)
    }
  };
}
