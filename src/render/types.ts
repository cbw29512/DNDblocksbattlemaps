import type { AreaTemplate, AreaPlacement } from '../domain/areaTemplates.js';
import type { NormalizedRoom } from '../domain/room.js';
import type { RoomPlacement } from '../domain/roomPlacement.js';
import type { BoardState, CatalogId, GridPosition, TerrainTheme } from '../domain/types.js';

export interface BoardHandlers {
  onPlace: (position: GridPosition) => void;
  onPickCreature: (id: string) => void;
  onMoveCreature: (position: GridPosition) => void;
  onRoomPlacement: (placement: RoomPlacement) => void;
  onRemove: (objectId: string) => void;
  onMarkDrop: (objectId: string, payload: string) => void;
  onMarkTarget: (objectId: string) => boolean;
  onAreaPoint: (position: GridPosition, commit: boolean) => void;
  onStatus: (message: string) => void;
}

export interface BoardRenderer {
  readonly mode: 'three' | 'fallback';
  setTheme(theme: TerrainTheme): void;
  setAreaPreview(template: AreaTemplate | null, placement: AreaPlacement | null): void;
  setSelectedCatalog(catalogId: CatalogId | null): void;
  setRoomPlacement(room: NormalizedRoom | null): void;
  setElevation(elevation: number): void;
  setMovingCreature(id: string | null): void;
  setCreatureMoveMode(enabled: boolean): void;
  render(state: BoardState): void;
  rotate(deltaRadians: number): void;
  zoom(multiplier: number): void;
  resetCamera(): void;
  dispose(): void;
}
