import type { NormalizedRoom } from '../domain/room.js';
import type { RoomPlacement } from '../domain/roomPlacement.js';
import type { BoardState, CatalogId, GridPosition, TerrainTheme } from '../domain/types.js';

export interface BoardHandlers {
  onPlace: (position: GridPosition) => void;
  onRoomPlacement: (placement: RoomPlacement) => void;
  onRemove: (objectId: string) => void;
  onMarkDrop: (objectId: string, payload: string) => void;
  onStatus: (message: string) => void;
}

export interface BoardRenderer {
  readonly mode: 'three' | 'fallback';
  setTheme(theme: TerrainTheme): void;
  setSelectedCatalog(catalogId: CatalogId | null): void;
  setRoomPlacement(room: NormalizedRoom | null): void;
  setElevation(elevation: number): void;
  render(state: BoardState): void;
  rotate(deltaRadians: number): void;
  zoom(multiplier: number): void;
  resetCamera(): void;
  dispose(): void;
}
