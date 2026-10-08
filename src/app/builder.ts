import { AREA_PRESETS, isInCastingRange } from '../domain/areaTemplates.js';
import { createBrowserBackup } from '../domain/browserBackup.js';
import { STARTER_TEMPLATES } from '../domain/starterTemplates.js';
import { setPartyMembership } from '../domain/party.js';
import { PLAYER_RINGS, CONDITIONS, CONDITION_COLORS, availableRings, assignRing, toggleCondition, isCreature, normalizeRingAssignments } from '../domain/creatureMarks.js';
import { catalogPanelHtml, filterCatalog, setCatalogCategory } from './catalogPanel.js';
import { printBoardMap } from './printMap.js';
import { roomPanelError, roomPanelHtml, readRoomPanel } from './roomPanel.js';
import { boundsChanged, growBoardBounds } from '../domain/boardBounds.js';
import { TERRAIN_THEMES, getCatalogItem } from '../domain/catalog.js';
import {
  createBoardState, createWorldObject, findObject,
  placeCommand, placeManyCommand, removeCommand
} from '../domain/commands.js';
import { commit, createHistory, redo, undo } from '../domain/history.js';
import { roomSummary, type NormalizedRoom } from '../domain/room.js';
import { roomWallPositions, type RoomPlacement } from '../domain/roomPlacement.js';
import {
  BOARD_MAX_CELLS, MAX_BASE_ELEVATION, boardDepth, boardWidth
} from '../domain/spatial.js';
import { clearBoard, loadBoard, saveBoard, propagateParty, createStarterMap, listCampaignMaps } from '../domain/storage.js';
import type {
  CatalogCategory, CatalogId, EditCommand, GridPosition, HistoryState, TerrainId
} from '../domain/types.js';
import { createRenderer } from '../render/createRenderer.js';
import type { BoardRenderer } from '../render/types.js';

export interface BuilderHandlers { onHome: () => void; }

function makeId(): string {
  return crypto.randomUUID?.() ?? `obj-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function renderBuilder(
  root: HTMLElement,
  terrainId: TerrainId,
  handlers: BuilderHandlers,
  mapId?: string
): Promise<() => void> {
  const theme = TERRAIN_THEMES[terrainId] ?? TERRAIN_THEMES.castle;
  let state = normalizeRingAssignments(loadBoard(theme.id, mapId));
  let history: HistoryState = createHistory();
  let renderer: BoardRenderer | null = null;
  let selected: CatalogId = 'stone-block';
  let armedRoom: NormalizedRoom | null = null;
  let elevation = 0;
  let pickedCreatureId: string | null = null;
  let moveMode = false;
  let activeSpell: typeof AREA_PRESETS[number] | null = null;
  let casterOrigin: GridPosition = {x:0,z:0,elevation:0};
  let spellCenter: GridPosition | null = null;
  let selectedCondition = null as typeof CONDITIONS[number] | null;

  root.innerHTML = `
    <main class="builder-shell" style="--theme-accent:${theme.accentCss}">
      <header class="builder-topbar">
        <button class="brand builder-brand" id="builder-home" type="button">
          <span class="brand-mark"><i></i><i></i><i></i></span><span>DND Blocks</span>
        </button>
        <div class="map-title">
          <b>${mapId ? (listCampaignMaps().find(m => m.id === mapId)?.name ?? theme.name + ' Map') : theme.name + ' Map'}</b>
          <small id="board-size"></small>
        </div>
        <div class="builder-actions">
          <button id="creature-mode" class="button button-ghost" type="button" aria-pressed="false">Combat Mode</button>
          <button id="undo" class="icon-button" type="button" title="Undo">↶</button>
          <button id="redo" class="icon-button" type="button" title="Redo">↷</button>
          <a class="button button-ghost" href="./how-to-play.html" target="_blank" rel="noopener">How to Play</a>
          <button id="backup-maps" class="button button-ghost" type="button">Backup Maps</button>
          <button id="print-map" class="button button-ghost" type="button">Print Map</button>
          <button id="clear" class="button button-ghost" type="button">Clear Map</button>
        </div>
      </header>
      <aside class="builder-sidebar">
        <section class="combat-spell-tools" aria-label="Spell measurement and combat log">
          <strong>Spell &amp; Area Preview</strong>
          <label for="spell-choice">Effect</label>
          <select id="spell-choice"><option value="fireball">Fireball — 20 ft radius</option>${AREA_PRESETS.filter(t=>t.id!=='fireball').map(t=>`<option value="${t.id}">${t.label}</option>`).join('')}</select>
          <label for="spell-caster">Caster name</label><input id="spell-caster" type="text" placeholder="Player or monster" value="Wizard">
          <button id="preview-spell" type="button">Preview Area</button>
          <div class="spell-actions"><button id="cast-spell" type="button" disabled>Cast</button><button id="cancel-spell" type="button" disabled>Cancel</button></div>
          <small id="spell-instructions">Select Preview Area, move over the battlefield, then left-click/tap or press Cast to confirm. Escape, right-click, or Cancel dismisses.</small>
          <strong>Combat Log</strong><ol id="combat-log" aria-live="polite"></ol>
        </section>
        <section id="party-manager" class="party-manager" aria-label="Campaign party">
          <strong>Campaign Party</strong>
          <small>Check Party once. The same character appears on every campaign map.</small>
          <div id="party-members"></div>
        </section>
        <nav class="campaign-map-tabs" aria-label="Campaign maps">
          <strong>Maps</strong>
          ${listCampaignMaps().map(m => `<button type="button" data-map-id="${m.id}" ${m.id === mapId ? 'aria-current="page"' : ''}>${m.name}</button>`).join('')}
          ${Object.values(TERRAIN_THEMES).map(t => `<button type="button" data-map-terrain="${t.id}" ${t.id === theme.id ? 'aria-current="page"' : ''}>${t.name}</button>`).join('')}
        </nav>
        <section class="starter-map-panel" id="starter-map-panel" aria-label="Starter map templates">
          <strong>Create a Starter Map</strong>
          <small>Creates a new editable map. Existing maps stay untouched.</small>
          <select id="starter-template-choice" aria-label="Choose starter map">
            ${STARTER_TEMPLATES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
          <button id="create-starter-map" type="button" class="button button-ghost">Create New Map</button>
        </section>
        <div id="build-tools">
        ${roomPanelHtml()}
        ${catalogPanelHtml(selected, theme.id, mapId ? listCampaignMaps().find(m => m.id === mapId)?.templateId : undefined)}
        </div>
        <section class="creature-ring-tools" aria-label="Creature markers">
          <div id="identity-ring-tools">
          <strong>Drag rings onto creatures</strong>
          <small>Each player color belongs to one character. Red is for monsters.</small>
          <div class="creature-ring-options" id="available-ring-colors">
            ${PLAYER_RINGS.map(r => `<button type="button" draggable="true" class="ring-token" data-ring-color="${r.color}" title="Drag ${r.name} onto a character"><i style="--ring:#${r.color.toString(16).padStart(6,'0')}"></i>${r.name}</button>`).join('')}
          </div>
          </div>
          <strong>Status rings</strong>
          <small>Click a status, then click a character or monster to apply it. Click again to remove. Dragging also works. Exhaustion advances through 6.</small>
          <div class="creature-status-options" role="group" aria-label="Select a status condition">
            ${CONDITIONS.map(s => `<button type="button" draggable="true" class="status-token" data-condition="${s}" style="--status-ring:#${CONDITION_COLORS[s].toString(16).padStart(6,'0')}">${s}</button>`).join('')}
          </div>
        </section>
        <div class="elevation-control">
          <span>Elevation</span>
          <div>
            <button id="elev-down" type="button">−</button>
            <b id="elev-value">Ground</b>
            <button id="elev-up" type="button">+</button>
          </div>
        </div>
        <div class="prototype-tip">
          <b>Controls</b>
          <span>Build Room → click a corner</span>
          <span>Cancel Room / Esc → stop room tool</span>
          <span>Build at an edge → map grows</span>
          <span>Gold room outline: valid</span>
          <span>Top face: build up</span>
          <span>Side face: build out</span>
          <span>Right click: remove</span>
          <span>Wheel: zoom</span>
        </div>
      </aside>
      <section class="board-stage">
        <div class="board-canvas" id="board-canvas" aria-label="Interactive battle map"></div>
        <div class="camera-dock" aria-label="Camera controls">
          <button id="rotate-left" title="Rotate left">↶</button>
          <button id="camera-home" title="Fit whole map">⌂</button>
          <button id="rotate-right" title="Rotate right">↷</button>
          <button id="zoom-in" title="Zoom in">＋</button>
          <button id="zoom-out" title="Zoom out">−</button>
        </div>
        <div class="board-status" id="board-status">Loading board…</div>
      </section>
    </main>
  `;

  const status = document.getElementById('board-status') as HTMLElement;

  const canvas = document.getElementById('board-canvas') as HTMLElement;
  const castButton = root.querySelector<HTMLButtonElement>('#cast-spell')!;
  const cancelButton = root.querySelector<HTMLButtonElement>('#cancel-spell')!;
  const spellInstructions = root.querySelector<HTMLElement>('#spell-instructions')!;
  const cancelArea = (): void => {
    activeSpell=null; spellCenter=null; renderer?.setAreaPreview(null,null);
    castButton.disabled=true; cancelButton.disabled=true;
    spellInstructions.textContent='Preview canceled or complete. Select Preview Area to start again.';
  };
  const choosePoint = (point: GridPosition, commit: boolean): void => {
    if(!activeSpell) return;
    const placement={origin:casterOrigin,center:point};
    if(!isInCastingRange(activeSpell,placement)){
      status.textContent='Outside the listed ability range. Choose a closer point.';
      return;
    }
    spellCenter=point;
    renderer?.setAreaPreview(activeSpell,placement);
    castButton.disabled=false;
    if(commit) castArea();
  };
  const castArea = (): void => {
    if(!activeSpell || !spellCenter)return;
    const caster=root.querySelector<HTMLInputElement>('#spell-caster')?.value.trim() || 'Unknown caster';
    const label=activeSpell.label;
    const record=document.createElement('li');
    record.textContent=caster+' casts '+label+' at ('+spellCenter.x+', '+spellCenter.z+'). Area preview only; rolls and target adjudication pending.';
    root.querySelector('#combat-log')?.prepend(record);
    status.textContent=caster+' casts '+label+'.';
    cancelArea();
  };
  root.querySelector('#preview-spell')?.addEventListener('click',()=>{
    const id=root.querySelector<HTMLSelectElement>('#spell-choice')?.value;
    activeSpell=AREA_PRESETS.find(x=>x.id===id) ?? AREA_PRESETS[0];
    const chosen=state.objects.find(x=>getCatalogItem(x.catalogId).category==='Characters') ??
      state.objects.find(x=>getCatalogItem(x.catalogId).category==='Monsters');
    casterOrigin=chosen ? {x:chosen.x,z:chosen.z,elevation:chosen.elevation} : {x:0,z:0,elevation:0};
    spellCenter=null; castButton.disabled=true; cancelButton.disabled=false;
    renderer?.setAreaPreview(null,null);
    spellInstructions.textContent='Move over battlefield then left-click/tap to cast, or press Cast. Right-click, Escape or Cancel dismisses.';
    status.textContent='Area preview armed. First creature on map used as origin if present.';
  });
  castButton.addEventListener('click',castArea);
  cancelButton.addEventListener('click',cancelArea);
  const onAreaRightClick=(event:MouseEvent):void=>{if(activeSpell){event.preventDefault();cancelArea();}};
  canvas.addEventListener('contextmenu',onAreaRightClick,true);

  const boardSize = document.getElementById('board-size') as HTMLElement;
  const buildRoomButton = document.getElementById('build-room') as HTMLButtonElement;

  const updateBoardSize = (): void => {
    boardSize.textContent =
      `${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares · saves in this browser`;
  };

  const updateRingTokens = (): void => {
    const available = new Set(availableRings(state));
    root.querySelectorAll<HTMLButtonElement>('[data-ring-color]').forEach(button => {
      const color = Number(button.dataset.ringColor);
      button.hidden = !available.has(color);
      button.draggable = available.has(color);
    });
  };

  const refreshPartyManager = (): void => {
    const panel = root.querySelector<HTMLElement>('#party-members');
    if (!panel) return;
    panel.replaceChildren();
    const characters = state.objects.filter(object => getCatalogItem(object.catalogId).category === 'Characters');
    for (const object of characters) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = Boolean(object.partyMember);
      input.dataset.partyId = object.id;
      input.addEventListener('change', () => {
        state = setPartyMembership(state, object.id, input.checked);
        propagateParty(state, input.checked ? undefined : object.id);
        refresh();
        status.textContent = input.checked ? 'Character added to all campaign maps.' : 'Character removed from campaign party.';
      });
      label.append(input, document.createTextNode(' Party · ' + getCatalogItem(object.catalogId).name));
      panel.append(label);
    }
    if (!characters.length) panel.textContent = 'Place a Character block to add a party member.';
  };

  const refresh = (): void => {
    renderer?.render(state);
    saveBoard(state);
    propagateParty(state);
    refreshPartyManager();
    updateBoardSize();
    updateRingTokens();
  };

  const run = (
    command: EditCommand,
    positions: Array<Pick<GridPosition, 'x' | 'z'>>
  ): boolean | null => {
    const grown = growBoardBounds(state.bounds, positions);
    if (!grown) {
      status.textContent =
        `Map limit reached. Maximum is ${BOARD_MAX_CELLS} × ${BOARD_MAX_CELLS} squares.`;
      return null;
    }

    const didGrow = boundsChanged(state.bounds, grown);
    if (didGrow) state = { ...state, bounds: grown };

    const next = commit(state, history, command);
    state = next.state;
    history = next.history;
    refresh();
    return didGrow;
  };

  const setRoomMode = (room: NormalizedRoom | null): void => {
    armedRoom = room;
    renderer?.setRoomPlacement(room);

    if (room) {
      renderer?.setSelectedCatalog(null);
      root.querySelectorAll('.palette-item').forEach((item) => item.classList.remove('active'));
      buildRoomButton.classList.add('is-armed');
      buildRoomButton.setAttribute('aria-pressed', 'true');
      buildRoomButton.textContent = 'Cancel Room';
      status.textContent =
        `${roomSummary(room)} room ready. Move the gold outline, click, and keep clicking for more rooms. Cancel Room or Esc stops.`;
      return;
    }

    buildRoomButton.classList.remove('is-armed');
    buildRoomButton.setAttribute('aria-pressed', 'false');
    buildRoomButton.textContent = 'Build Room';
  };

  const restoreSelectedBlock = (): void => {
    setCatalogCategory(root, getCatalogItem(selected).category);
    renderer?.setSelectedCatalog(selected);
    root.querySelectorAll<HTMLButtonElement>('.palette-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.catalog === selected);
    });
  };

  const cancelRoomMode = (): void => {
    if (!armedRoom) return;
    setRoomMode(null);
    restoreSelectedBlock();
    status.textContent = `Room placement canceled. ${getCatalogItem(selected).name} selected.`;
  };

  renderer = await createRenderer(canvas, {
    onAreaPoint(point, commit) { if(activeSpell)choosePoint(point,commit); },
    onPickCreature(id) {
      if (selectedCondition) return;
      if (!moveMode) return;
      const creature = findObject(state, id);
      if (!creature || !isCreature(creature)) return;
      pickedCreatureId = id;
      renderer?.setMovingCreature(id);
      status.textContent = `${getCatalogItem(creature.catalogId).name} picked up. Click a destination square or press Escape.`;
    },
    onMoveCreature(position) {
      const creature = pickedCreatureId ? findObject(state, pickedCreatureId) : null;
      if (!creature || !isCreature(creature)) return;
      const after = { ...creature, x: position.x, z: position.z, elevation: creature.elevation };
      const result = run({ kind: 'update', before: creature, after }, [position]);
      if (result === null) return;
      pickedCreatureId = null;
      renderer?.setMovingCreature(null);
      status.textContent = `${getCatalogItem(creature.catalogId).name} moved. Ring and conditions preserved.`;
    },
    onPlace(position) {
      const selectedItem = getCatalogItem(selected);
      const span = selectedItem.category === 'Monsters' ? selectedItem.footprintCells ?? 1 : 1;
      if (position.x + span > state.bounds.maxX || position.z + span > state.bounds.maxZ) {
        status.textContent = 'Not enough map space for this monster. Place farther from the edge.';
        return;
      }
      if (moveMode) return;
      const object = createWorldObject(makeId(), selected, position);
      const grew = run(placeCommand(object), [position]);
      if (grew !== null && !grew) status.textContent = `${getCatalogItem(selected).name} placed. Click again to place more.`;
      if (grew) {
        status.textContent =
          `Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares. Keep building.`;
      }
    },
    onRoomPlacement(placement: RoomPlacement) {
      if (moveMode) return;
      if (!armedRoom) return;

      const wallPositions = roomWallPositions(armedRoom, placement, state.bounds);
      if (!wallPositions.length) {
        status.textContent = 'That room would exceed the map or height limit.';
        return;
      }

      const walls = wallPositions
        .filter((position) => !state.objects.some((object) =>
          object.catalogId === 'wall' &&
          object.x === position.x &&
          object.z === position.z &&
          object.elevation === position.elevation
        ))
        .map((position) => createWorldObject(makeId(), 'wall', position));

      if (!walls.length) {
        status.textContent =
          'Those walls already exist. Move the gold outline and click another corner.';
        return;
      }

      const grew = run(placeManyCommand(walls), wallPositions);
      if (grew === null) return;

      const growthText = grew
        ? ` Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares.`
        : '';
      status.textContent =
        `Built ${roomSummary(armedRoom)} room.${growthText} Move the gold outline and click again.`;
    },
    onMarkTarget(id) {
      if (!selectedCondition) return false;
      const object = findObject(state,id);
      if (!object || !isCreature(object)) { status.textContent='Choose a Character or Monster.'; return true; }
      const after = toggleCondition(object,selectedCondition);
      run({kind:'update',before:object,after},[]);
      status.textContent = selectedCondition + ' updated on ' + getCatalogItem(object.catalogId).name + '. Click another creature or click the selected status to finish.';
      return true;
    },
    onMarkDrop(id, payload) {
      const object = findObject(state, id);
      if (!object || !isCreature(object)) {
        status.textContent = 'Rings can only be attached to characters or monsters.';
        return;
      }
      let updated = null;
      if (payload.startsWith('ring:')) {
        updated = assignRing(state, id, Number.parseInt(payload.slice(5), 16));
        if (!updated) { status.textContent = 'That player ring is unavailable or reserved.'; return; }
      } else if (payload.startsWith('status:')) {
        const condition = payload.slice(7);
        if (!CONDITIONS.some(c => c === condition)) return;
        updated = toggleCondition(object, condition as typeof CONDITIONS[number]);
      } else return;
      run({ kind: 'update', before: object, after: updated }, []);
      status.textContent = `${getCatalogItem(object.catalogId).name} markers updated.`;
    },
    onRemove(id) {
      const object = findObject(state, id);
      if (object) {
        run(removeCommand(object), []);
        if (object.partyMember) propagateParty(state, id);
      }
    },
    onStatus(message) {
      status.textContent = message;
    }
  });

  renderer.setTheme(theme);
  renderer.setSelectedCatalog(selected);
  renderer.setRoomPlacement(null);
  renderer.setElevation(elevation);
  renderer.render(state);
  updateBoardSize();
  updateRingTokens();
  refreshPartyManager();

  root.querySelectorAll<HTMLElement>('[data-ring-color], [data-condition]').forEach(token => {
    token.addEventListener('dragstart', (event: DragEvent) => {
      const payload = token.dataset.ringColor
        ? 'ring:' + Number(token.dataset.ringColor).toString(16)
        : 'status:' + token.dataset.condition;
      event.dataTransfer?.setData('text/plain', payload);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
    });
  });

  root.querySelectorAll('[data-condition]').forEach(button => {
    button.addEventListener('click', () => {
      const next = button.getAttribute('data-condition');
      selectedCondition = selectedCondition === next ? null : CONDITIONS.find(condition => condition === next) ?? null;
      root.querySelectorAll('[data-condition]').forEach(element => {
        const active = element.getAttribute('data-condition') === selectedCondition;
        element.classList.toggle('selected',active);
        element.setAttribute('aria-pressed',String(active));
      });
      if (selectedCondition) {
        pickedCreatureId = null;
        renderer?.setMovingCreature(null);
      }
      status.textContent = selectedCondition ? 'STATUS ' + selectedCondition + ': click a creature to apply/remove.' : 'Status selection cleared.';
    });
  });

  root.querySelector<HTMLButtonElement>('#creature-mode')?.addEventListener('click', () => {
    moveMode = !moveMode;
    pickedCreatureId = null;
    renderer?.setMovingCreature(null);
    if (moveMode && armedRoom) cancelRoomMode();
    renderer?.setCreatureMoveMode(moveMode);
    const buildTools = root.querySelector<HTMLElement>('#build-tools');
    const identityTools = root.querySelector<HTMLElement>('#identity-ring-tools');
    if (buildTools) buildTools.hidden = moveMode;
    const partyTools = root.querySelector<HTMLElement>('#party-manager');
    if (partyTools) partyTools.hidden = moveMode;
    const starterTools = root.querySelector<HTMLElement>('#starter-map-panel');
    if (starterTools) starterTools.hidden = moveMode;
    if (identityTools) identityTools.hidden = moveMode;
    const button = root.querySelector<HTMLButtonElement>('#creature-mode');
    button?.setAttribute('aria-pressed', String(moveMode));
    button?.classList.toggle('is-armed', moveMode);
    if (button) button.textContent = moveMode ? 'Build Mode' : 'Combat Mode';
    status.textContent = moveMode
      ? 'Combat Mode: scenery is locked. Select a character or monster, then choose its destination. Status rings remain available.'
      : 'Build Mode: all blocks, characters, monsters, identity rings and statuses are available.';
  });

  root.querySelectorAll('[data-map-terrain]').forEach(button => {
    button.addEventListener('click', () => {
      const map = button.getAttribute('data-map-terrain');
      if (!map || map === theme.id) return;
      saveBoard(state);
      propagateParty(state);
      window.location.search = '?view=build&terrain=' + encodeURIComponent(map);
    });
  });

  root.querySelector('#create-starter-map')?.addEventListener('click', () => {
    const choice = root.querySelector<HTMLSelectElement>('#starter-template-choice');
    if (!choice) return;
    try {
      const created = createStarterMap(choice.value);
      window.location.search = '?view=build&terrain=' + encodeURIComponent(created.terrain) + '&map=' + encodeURIComponent(created.id);
    } catch(error) {
      status.textContent = 'Could not create starter map. Your current map was not changed.';
      console.warn('[templates]',error);
    }
  });
  root.querySelectorAll('[data-map-id]').forEach(button => {
    button.addEventListener('click', () => {
      const target = listCampaignMaps().find(m => m.id === button.getAttribute('data-map-id'));
      if(!target) return;
      saveBoard(state);
      window.location.search = '?view=build&terrain=' + encodeURIComponent(target.terrain) + '&map=' + encodeURIComponent(target.id);
    });
  });

  buildRoomButton.addEventListener('click', () => {
    if (armedRoom) {
      cancelRoomMode();
      return;
    }

    const room = readRoomPanel();
    if (!room) {
      status.textContent = roomPanelError();
      return;
    }
    setRoomMode(room);
  });

  root.querySelectorAll<HTMLButtonElement>('[data-category-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      setCatalogCategory(root, button.dataset.categoryTab as CatalogCategory);
    });
  });

  root.querySelectorAll('[id="monster-cr-filter"], [id="monster-edition-filter"]').forEach(filter => {
    filter.addEventListener('change', () => {
      const query = root.querySelector<HTMLInputElement>('#catalog-search')?.value ?? '';
      filterCatalog(root, 'Monsters', query);
    });
  });

  const catalogSearch = root.querySelector<HTMLInputElement>('#catalog-search');
  catalogSearch?.addEventListener('input', () => {
    const activeButton = root.querySelector<HTMLButtonElement>('[data-category-tab].active');
    const activeCategory = (activeButton?.dataset.categoryTab ?? 'Build') as CatalogCategory;
    filterCatalog(root, activeCategory, catalogSearch.value);
  });

  root.querySelectorAll<HTMLButtonElement>('[data-catalog]').forEach((button) => {
    button.addEventListener('click', () => {
      if (armedRoom) setRoomMode(null);
      if (moveMode) return;
      selected = button.dataset.catalog as CatalogId;
      setCatalogCategory(root, getCatalogItem(selected).category);
      root.querySelectorAll('.palette-item').forEach((item) => {
        item.classList.toggle('active', item === button);
      });
      renderer?.setSelectedCatalog(selected);
      status.textContent =
        `${getCatalogItem(selected).name} selected. Click empty grid, a top face, or a side face.`;
    });
  });

  document.getElementById('builder-home')?.addEventListener('click', handlers.onHome);

  document.getElementById('undo')?.addEventListener('click', () => {
    const next = undo(state, history);
    state = next.state;
    history = next.history;
    refresh();
  });

  document.getElementById('redo')?.addEventListener('click', () => {
    const next = redo(state, history);
    state = next.state;
    history = next.history;
    refresh();
  });

  document.getElementById('backup-maps')?.addEventListener('click', () => {
    try {
      const backup = createBrowserBackup(localStorage);
      const contents = JSON.stringify(backup, null, 2);
      const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dnd-blocks-backup-' + backup.createdAt.slice(0,10) + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Backup prepared: ' + backup.entries.length + ' saved records. Keep the JSON file safe; no maps were changed.';
    } catch (error) {
      console.error('[backup] Failed to export local save data', error);
      status.textContent = 'Backup failed. Your maps were not changed.';
    }
  });

  document.getElementById('print-map')?.addEventListener('click', () => {
    status.textContent =
      'Preparing top-down print map. Use Actual Size / 100% for exact 1-inch squares.';
    void printBoardMap(state, theme).catch((error: unknown) => {
      console.warn('[print] Print Map failed.', error);
      status.textContent = 'Could not prepare the print map.';
    });
  });

  document.getElementById('clear')?.addEventListener('click', () => {
    if (!confirm('Clear this prototype map?')) return;
    clearBoard(theme.id, mapId);
    state = { ...createBoardState(theme.id), ...(mapId ? { mapId } : {}) };
    history = createHistory();
    refresh();
  });

  const updateElevation = (delta: number): void => {
    elevation = Math.min(MAX_BASE_ELEVATION, Math.max(0, elevation + delta));
    renderer?.setElevation(elevation);
    (document.getElementById('elev-value') as HTMLElement).textContent =
      elevation === 0 ? 'Ground' : `+${elevation * 5} ft`;
  };

  document.getElementById('elev-down')?.addEventListener('click', () => updateElevation(-1));
  document.getElementById('elev-up')?.addEventListener('click', () => updateElevation(1));
  document.getElementById('rotate-left')?.addEventListener('click', () => renderer?.rotate(Math.PI / 8));
  document.getElementById('rotate-right')?.addEventListener('click', () => renderer?.rotate(-Math.PI / 8));
  document.getElementById('camera-home')?.addEventListener('click', () => renderer?.resetCamera());
  document.getElementById('zoom-in')?.addEventListener('click', () => renderer?.zoom(0.82));
  document.getElementById('zoom-out')?.addEventListener('click', () => renderer?.zoom(1.2));

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if(activeSpell){event.preventDefault();cancelArea();return;}
    if (selectedCondition) {
      selectedCondition = null;
      root.querySelectorAll('[data-condition]').forEach(button => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed','false');
      });
      status.textContent = 'Status selection canceled.';
      event.preventDefault();
      return;
    }
    if (pickedCreatureId) {
      pickedCreatureId = null;
      renderer?.setMovingCreature(null);
      status.textContent = 'Creature movement canceled.';
      event.preventDefault();
      return;
    }
    if (!armedRoom) return;
    event.preventDefault();
    cancelRoomMode();
  };
  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    canvas.removeEventListener('contextmenu',onAreaRightClick,true);
    document.getElementById('print-map-root')?.remove();
    renderer?.dispose();
  };
}
