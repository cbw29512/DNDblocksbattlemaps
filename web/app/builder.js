import { AREA_ABILITY_REGISTRY, getAreaAbility } from '../domain/areaAbilityRegistry.js?v=0e9ebf4264dd';
import { areaCells } from '../domain/areaTemplates.js?v=0e9ebf4264dd';
import { previewAffectedCreatures, selfAreaOriginCell } from '../domain/areaTargets.js?v=0e9ebf4264dd';
import { isInCastingRange } from '../domain/areaTemplates.js?v=0e9ebf4264dd';
import { createBrowserBackup } from '../domain/browserBackup.js?v=0e9ebf4264dd';
import { STARTER_TEMPLATES } from '../domain/starterTemplates.js?v=0e9ebf4264dd';
import { setPartyMembership } from '../domain/party.js?v=0e9ebf4264dd';
import { PLAYER_RINGS, CONDITIONS, CONDITION_COLORS, availableRings, assignRing, toggleCondition, isCreature, normalizeRingAssignments } from '../domain/creatureMarks.js?v=0e9ebf4264dd';
import { catalogPanelHtml, filterCatalog, setCatalogCategory } from './catalogPanel.js?v=0e9ebf4264dd';
import { printBoardMap } from './printMap.js?v=0e9ebf4264dd';
import { roomPanelError, roomPanelHtml, readRoomPanel } from './roomPanel.js?v=0e9ebf4264dd';
import { boundsChanged, growBoardBounds } from '../domain/boardBounds.js?v=0e9ebf4264dd';
import { TERRAIN_THEMES, getCatalogItem } from '../domain/catalog.js?v=0e9ebf4264dd';
import { createBoardState, createWorldObject, findObject, placeCommand, placeManyCommand, removeCommand } from '../domain/commands.js?v=0e9ebf4264dd';
import { commit, createHistory, redo, undo } from '../domain/history.js?v=0e9ebf4264dd';
import { roomSummary } from '../domain/room.js?v=0e9ebf4264dd';
import { roomWallPositions } from '../domain/roomPlacement.js?v=0e9ebf4264dd';
import { BOARD_MAX_CELLS, MAX_BASE_ELEVATION, boardDepth, boardWidth } from '../domain/spatial.js?v=0e9ebf4264dd';
import { clearBoard, loadBoard, saveBoard, propagateParty, createStarterMap, listCampaignMaps } from '../domain/storage.js?v=0e9ebf4264dd';
import { createRenderer } from '../render/createRenderer.js?v=0e9ebf4264dd';
function makeId() {
    return crypto.randomUUID?.() ?? `obj-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export async function renderBuilder(root, terrainId, handlers, mapId) {
    const theme = TERRAIN_THEMES[terrainId] ?? TERRAIN_THEMES.castle;
    let state = normalizeRingAssignments(loadBoard(theme.id, mapId));
    let history = createHistory();
    let renderer = null;
    let selected = 'stone-block';
    let armedRoom = null;
    let elevation = 0;
    let pickedCreatureId = null;
    let moveMode = false;
    let activeSpell = null;
    let casterOrigin = { x: 0, z: 0, elevation: 0 };
    let spellCenter = null;
    let selectedCondition = null;
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
        <details class="builder-tool-group" open><summary>Spells &amp; Areas</summary><section class="combat-spell-tools" aria-label="Spell measurement">
          <strong>Spell &amp; Area Preview</strong>
          <label for="spell-choice">Effect</label>
          <select id="spell-choice"><option value="">Choose a spell…</option>${AREA_ABILITY_REGISTRY.map(record => `<option value="${record.key}">${record.edition} · ${record.area.label} (sample preview — unverified)</option>`).join('')}</select>
          <label for="spell-caster">Caster on map</label><select id="spell-caster"><option value="">Choose a creature</option></select>
          
          <div class="spell-actions"><button id="cast-spell" type="button" disabled>Cast</button><button id="cancel-spell" type="button" disabled>Cancel</button><button id="clear-spell-marks" type="button">Clear Markers</button></div>
          <small id="spell-instructions">Choose a spell and caster. Mouse: left-click Cast, right-click Cancel. Touch: tap a location, then Cast or Cancel.</small>

        </section></details>
        <details class="builder-tool-group"><summary>Party</summary><section id="party-manager" class="party-manager" aria-label="Campaign party">
          <strong>Campaign Party</strong>
          <small>Check Party once. The same character appears on every campaign map.</small>
          <div id="party-members"></div>
        </section></details>
        <details class="builder-tool-group"><summary>Maps &amp; Themes</summary><nav class="campaign-map-tabs" aria-label="Campaign maps">
          <strong>Maps</strong>
          ${listCampaignMaps().map(m => `<button type="button" data-map-id="${m.id}" ${m.id === mapId ? 'aria-current="page"' : ''}>${m.name}</button>`).join('')}
          ${Object.values(TERRAIN_THEMES).map(t => `<button type="button" data-map-terrain="${t.id}" ${t.id === theme.id ? 'aria-current="page"' : ''}>${t.name}</button>`).join('')}
        </nav></details>
        <details class="builder-tool-group"><summary>Starter Maps</summary><section class="starter-map-panel" id="starter-map-panel" aria-label="Starter map templates">
          <strong>Create a Starter Map</strong>
          <small>Creates a new editable map. Existing maps stay untouched.</small>
          <select id="starter-template-choice" aria-label="Choose starter map">
            ${STARTER_TEMPLATES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
          <button id="create-starter-map" type="button" class="button button-ghost">Create New Map</button>
        </section></details>
        <details class="builder-tool-group" open><summary>Build &amp; Blocks</summary><div id="build-tools">
        ${roomPanelHtml()}
        ${catalogPanelHtml(selected, theme.id, mapId ? listCampaignMaps().find(m => m.id === mapId)?.templateId : undefined)}
        </div></details>
        <details class="builder-tool-group"><summary>Creature Markers</summary><section class="creature-ring-tools" aria-label="Creature markers">
          <div id="identity-ring-tools">
          <strong>Drag rings onto creatures</strong>
          <small>Each player color belongs to one character. Red is for monsters.</small>
          <div class="creature-ring-options" id="available-ring-colors">
            ${PLAYER_RINGS.map(r => `<button type="button" draggable="true" class="ring-token" data-ring-color="${r.color}" title="Drag ${r.name} onto a character"><i style="--ring:#${r.color.toString(16).padStart(6, '0')}"></i>${r.name}</button>`).join('')}
          </div>
          </div>
          <strong>Status rings</strong>
          <small>Click a status, then click a character or monster to apply it. Click again to remove. Dragging also works. Exhaustion advances through 6.</small>
          <div class="creature-status-options" role="group" aria-label="Select a status condition">
            ${CONDITIONS.map(s => `<button type="button" draggable="true" class="status-token" data-condition="${s}" style="--status-ring:#${CONDITION_COLORS[s].toString(16).padStart(6, '0')}">${s}</button>`).join('')}
          </div>
        </section></details>
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
        <aside class="combat-log-dock" aria-label="Combat log"><details open><summary>Combat Log</summary><ol id="combat-log" aria-live="polite"></ol></details></aside>
        <div class="board-canvas" id="board-canvas" aria-label="Interactive battle map"></div>
        <div class="mobile-spell-actions" id="mobile-spell-actions" hidden><button id="mobile-cast-spell" type="button" disabled>Cast Spell</button><button id="mobile-cancel-spell" type="button">Cancel</button></div>
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
    // On narrow touch screens, keep map cells accessible until the log is requested.
    const combatLogDetails = root.querySelector('.combat-log-dock details');
    if (combatLogDetails && window.matchMedia('(max-width: 720px)').matches)
        combatLogDetails.open = false;
    const status = document.getElementById('board-status');
    const canvas = document.getElementById('board-canvas');
    const castButton = root.querySelector('#cast-spell');
    const cancelButton = root.querySelector('#cancel-spell');
    const spellInstructions = root.querySelector('#spell-instructions');
    const mobileActions = root.querySelector('#mobile-spell-actions');
    const mobileCastButton = root.querySelector('#mobile-cast-spell');
    const cancelArea = () => {
        activeSpell = null;
        spellCenter = null;
        const spellSelect = root.querySelector('#spell-choice');
        if (spellSelect)
            spellSelect.value = '';
        renderer?.setAreaPreview(null, null);
        renderer?.setAreaTargets([]); // Cancellation leaves no provisional creature highlights.
        castButton.disabled = true;
        cancelButton.disabled = true;
        mobileActions.hidden = true;
        mobileCastButton.disabled = true;
        spellInstructions.textContent = 'Preview canceled. Choose a spell to aim again.';
    };
    const refreshCasterOptions = () => {
        const select = root.querySelector('#spell-caster');
        if (!select)
            return;
        const prior = select.value;
        select.replaceChildren(new Option('Choose a creature', ''));
        for (const o of state.objects.filter(o => ['Characters', 'Monsters'].includes(getCatalogItem(o.catalogId).category))) {
            const option = new Option(getCatalogItem(o.catalogId).name + ' [' + o.id.slice(0, 8) + ']', o.id);
            select.add(option);
        }
        if ([...select.options].some(o => o.value === prior))
            select.value = prior;
    };
    refreshCasterOptions();
    const spellPlacement = (point) => {
        const id = root.querySelector('#spell-caster')?.value;
        const creature = state.objects.find(o => o.id === id);
        const origin = activeSpell?.originMode === 'self' && creature ? selfAreaOriginCell(creature, point) : casterOrigin;
        return { origin, center: point };
    };
    const previewTargets = () => {
        if (!activeSpell || !spellCenter)
            return [];
        const radius = Math.ceil(activeSpell.sizeFeet / 5) + 1;
        const p = spellPlacement(spellCenter);
        const area = areaCells(activeSpell, p, {
            minX: Math.min(spellCenter.x, p.origin.x) - radius,
            maxX: Math.max(spellCenter.x, p.origin.x) + radius + 1,
            minZ: Math.min(spellCenter.z, p.origin.z) - radius,
            maxZ: Math.max(spellCenter.z, p.origin.z) + radius + 1,
            minElevation: Math.min(spellCenter.elevation, p.origin.elevation) - radius,
            maxElevation: Math.max(spellCenter.elevation, p.origin.elevation) + radius
        });
        return previewAffectedCreatures(state.objects, area);
    };
    const choosePoint = (point, commit, touch = false) => {
        if (!activeSpell)
            return;
        const placement = spellPlacement(point);
        if (!isInCastingRange(activeSpell, placement)) {
            status.textContent = 'Outside the listed ability range. Choose a closer point.';
            return;
        }
        spellCenter = point;
        renderer?.setAreaPreview(activeSpell, placement);
        const targets = previewTargets();
        renderer?.setAreaTargets(targets.map(o => o.id));
        status.textContent = 'Preview intersects ' + targets.length + ' creature(s): ' + (targets.map(o => getCatalogItem(o.catalogId).name).join(', ') || 'none') + '. Geometry provisional; not RAW-confirmed.';
        castButton.disabled = false;
        mobileCastButton.disabled = false;
        // Left-click commits immediately; pointer movement is preview-only.
        if (commit && !touch)
            castArea();
        if (commit && touch)
            spellInstructions.textContent = 'Area positioned. Tap Cast to confirm or Cancel to dismiss.';
    };
    const castArea = () => {
        if (!activeSpell || !spellCenter)
            return;
        const caster = getCatalogItem(state.objects.find(o => o.id === root.querySelector('#spell-caster')?.value)?.catalogId ?? '').name;
        const label = activeSpell.label;
        const record = document.createElement('li');
        const targets = previewTargets();
        const hitNames = targets.map(o => getCatalogItem(o.catalogId).name + ' [' + o.id.slice(0, 8) + ']').join(', ');
        record.textContent = caster + ' casts ' + label + ' at (' + spellCenter.x + ', ' + spellCenter.z + '). ' + (targets.length ? label + ' hits (area): ' + hitNames + '.' : label + ' hits no creatures.') + ' Saves and damage pending.';
        root.querySelector('#combat-log')?.prepend(record);
        status.textContent = targets.length ? label + ' hits (area): ' + hitNames + '. Saves and damage pending.' : label + ' hits no creatures.';
        activeSpell = null;
        spellCenter = null;
        const spellSelect = root.querySelector('#spell-choice');
        if (spellSelect)
            spellSelect.value = '';
        renderer?.setAreaPreview(null, null);
        renderer?.setAreaTargets(targets.map(o => o.id));
        castButton.disabled = true;
        cancelButton.disabled = true;
        mobileActions.hidden = true;
        mobileCastButton.disabled = true;
        spellInstructions.textContent = 'Affected creatures remain outlined in yellow until another preview starts. Saves/damage pending.';
    };
    const armArea = () => {
        const id = root.querySelector('#spell-choice')?.value;
        activeSpell = getAreaAbility(id ?? '')?.area ?? null;
        const select = root.querySelector('#spell-caster');
        const creatures = state.objects.filter(x => ['Characters', 'Monsters'].includes(getCatalogItem(x.catalogId).category));
        if (select && !select.value && creatures.length === 1 && creatures[0])
            select.value = creatures[0].id;
        const chosen = creatures.find(x => x.id === select?.value);
        if (!activeSpell || !chosen) {
            activeSpell = null;
            renderer?.setAreaPreview(null, null);
            mobileActions.hidden = true;
            mobileCastButton.disabled = true;
            castButton.disabled = true;
            cancelButton.disabled = true;
            status.textContent = 'Select a caster on the map, then choose the spell to aim.';
            return;
        }
        casterOrigin = { x: chosen.x, z: chosen.z, elevation: chosen.elevation };
        spellCenter = null;
        castButton.disabled = true;
        cancelButton.disabled = false;
        mobileCastButton.disabled = true;
        mobileActions.hidden = false;
        renderer?.setAreaPreview(activeSpell, { origin: casterOrigin, center: casterOrigin });
        renderer?.setAreaTargets([]);
        spellInstructions.textContent = 'Mouse: move to aim, left-click Cast, right-click or Escape Cancel. Touch: tap to position, then use Cast or Cancel.';
        status.textContent = 'Spell armed: left-click Cast / right-click Cancel; on touch, tap a target then press Cast.';
    };
    root.querySelector('#spell-choice')?.addEventListener('change', armArea);
    root.querySelector('#spell-caster')?.addEventListener('change', armArea);
    castButton.addEventListener('click', castArea);
    mobileCastButton.addEventListener('click', castArea);
    root.querySelector('#mobile-cancel-spell')?.addEventListener('click', cancelArea);
    cancelButton.addEventListener('click', cancelArea);
    root.querySelector('#clear-spell-marks')?.addEventListener('click', () => { renderer?.setAreaTargets([]); status.textContent = 'Hit markers cleared. Combat log preserved.'; });
    const onAreaRightClick = (event) => { if (activeSpell) {
        event.preventDefault();
        event.stopImmediatePropagation();
        cancelArea();
    } };
    canvas.addEventListener('contextmenu', onAreaRightClick, true);
    const boardSize = document.getElementById('board-size');
    const buildRoomButton = document.getElementById('build-room');
    const updateBoardSize = () => {
        boardSize.textContent =
            `${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares · saves in this browser`;
    };
    const updateRingTokens = () => {
        const available = new Set(availableRings(state));
        root.querySelectorAll('[data-ring-color]').forEach(button => {
            const color = Number(button.dataset.ringColor);
            button.hidden = !available.has(color);
            button.draggable = available.has(color);
        });
    };
    const refreshPartyManager = () => {
        const panel = root.querySelector('#party-members');
        if (!panel)
            return;
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
        if (!characters.length)
            panel.textContent = 'Place a Character block to add a party member.';
    };
    const refresh = () => {
        renderer?.render(state);
        saveBoard(state);
        propagateParty(state);
        refreshPartyManager();
        refreshCasterOptions();
        updateBoardSize();
        updateRingTokens();
    };
    const run = (command, positions) => {
        const grown = growBoardBounds(state.bounds, positions);
        if (!grown) {
            status.textContent =
                `Map limit reached. Maximum is ${BOARD_MAX_CELLS} × ${BOARD_MAX_CELLS} squares.`;
            return null;
        }
        const didGrow = boundsChanged(state.bounds, grown);
        if (didGrow)
            state = { ...state, bounds: grown };
        const next = commit(state, history, command);
        state = next.state;
        history = next.history;
        refresh();
        return didGrow;
    };
    const setRoomMode = (room) => {
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
    const restoreSelectedBlock = () => {
        setCatalogCategory(root, getCatalogItem(selected).category);
        renderer?.setSelectedCatalog(selected);
        root.querySelectorAll('.palette-item').forEach((item) => {
            item.classList.toggle('active', item.dataset.catalog === selected);
        });
    };
    const cancelRoomMode = () => {
        if (!armedRoom)
            return;
        setRoomMode(null);
        restoreSelectedBlock();
        status.textContent = `Room placement canceled. ${getCatalogItem(selected).name} selected.`;
    };
    renderer = await createRenderer(canvas, {
        onAreaPoint(point, commit, touch) { if (activeSpell)
            choosePoint(point, commit, touch); },
        onPickCreature(id) {
            if (selectedCondition)
                return;
            if (!moveMode)
                return;
            const creature = findObject(state, id);
            if (!creature || !isCreature(creature))
                return;
            pickedCreatureId = id;
            renderer?.setMovingCreature(id);
            status.textContent = `${getCatalogItem(creature.catalogId).name} picked up. Click a destination square or press Escape.`;
        },
        onMoveCreature(position) {
            const creature = pickedCreatureId ? findObject(state, pickedCreatureId) : null;
            if (!creature || !isCreature(creature))
                return;
            const after = { ...creature, x: position.x, z: position.z, elevation: creature.elevation };
            const result = run({ kind: 'update', before: creature, after }, [position]);
            if (result === null)
                return;
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
            if (moveMode)
                return;
            const object = createWorldObject(makeId(), selected, position);
            const grew = run(placeCommand(object), [position]);
            if (grew !== null && !grew)
                status.textContent = `${getCatalogItem(selected).name} placed. Click again to place more.`;
            if (grew) {
                status.textContent =
                    `Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares. Keep building.`;
            }
        },
        onRoomPlacement(placement) {
            if (moveMode)
                return;
            if (!armedRoom)
                return;
            const wallPositions = roomWallPositions(armedRoom, placement, state.bounds);
            if (!wallPositions.length) {
                status.textContent = 'That room would exceed the map or height limit.';
                return;
            }
            const walls = wallPositions
                .filter((position) => !state.objects.some((object) => object.catalogId === 'wall' &&
                object.x === position.x &&
                object.z === position.z &&
                object.elevation === position.elevation))
                .map((position) => createWorldObject(makeId(), 'wall', position));
            if (!walls.length) {
                status.textContent =
                    'Those walls already exist. Move the gold outline and click another corner.';
                return;
            }
            const grew = run(placeManyCommand(walls), wallPositions);
            if (grew === null)
                return;
            const growthText = grew
                ? ` Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares.`
                : '';
            status.textContent =
                `Built ${roomSummary(armedRoom)} room.${growthText} Move the gold outline and click again.`;
        },
        onMarkTarget(id) {
            if (!selectedCondition)
                return false;
            const object = findObject(state, id);
            if (!object || !isCreature(object)) {
                status.textContent = 'Choose a Character or Monster.';
                return true;
            }
            const after = toggleCondition(object, selectedCondition);
            run({ kind: 'update', before: object, after }, []);
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
                if (!updated) {
                    status.textContent = 'That player ring is unavailable or reserved.';
                    return;
                }
            }
            else if (payload.startsWith('status:')) {
                const condition = payload.slice(7);
                if (!CONDITIONS.some(c => c === condition))
                    return;
                updated = toggleCondition(object, condition);
            }
            else
                return;
            run({ kind: 'update', before: object, after: updated }, []);
            status.textContent = `${getCatalogItem(object.catalogId).name} markers updated.`;
        },
        onRemove(id) {
            const object = findObject(state, id);
            if (object) {
                run(removeCommand(object), []);
                if (object.partyMember)
                    propagateParty(state, id);
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
    refreshCasterOptions();
    updateBoardSize();
    updateRingTokens();
    refreshPartyManager();
    root.querySelectorAll('[data-ring-color], [data-condition]').forEach(token => {
        token.addEventListener('dragstart', (event) => {
            const payload = token.dataset.ringColor
                ? 'ring:' + Number(token.dataset.ringColor).toString(16)
                : 'status:' + token.dataset.condition;
            event.dataTransfer?.setData('text/plain', payload);
            if (event.dataTransfer)
                event.dataTransfer.effectAllowed = 'copy';
        });
    });
    root.querySelectorAll('[data-condition]').forEach(button => {
        button.addEventListener('click', () => {
            const next = button.getAttribute('data-condition');
            selectedCondition = selectedCondition === next ? null : CONDITIONS.find(condition => condition === next) ?? null;
            root.querySelectorAll('[data-condition]').forEach(element => {
                const active = element.getAttribute('data-condition') === selectedCondition;
                element.classList.toggle('selected', active);
                element.setAttribute('aria-pressed', String(active));
            });
            if (selectedCondition) {
                pickedCreatureId = null;
                renderer?.setMovingCreature(null);
            }
            status.textContent = selectedCondition ? 'STATUS ' + selectedCondition + ': click a creature to apply/remove.' : 'Status selection cleared.';
        });
    });
    root.querySelector('#creature-mode')?.addEventListener('click', () => {
        moveMode = !moveMode;
        pickedCreatureId = null;
        renderer?.setMovingCreature(null);
        if (moveMode && armedRoom)
            cancelRoomMode();
        renderer?.setCreatureMoveMode(moveMode);
        const buildTools = root.querySelector('#build-tools');
        const identityTools = root.querySelector('#identity-ring-tools');
        if (buildTools)
            buildTools.hidden = moveMode;
        const partyTools = root.querySelector('#party-manager');
        if (partyTools)
            partyTools.hidden = moveMode;
        const starterTools = root.querySelector('#starter-map-panel');
        if (starterTools)
            starterTools.hidden = moveMode;
        if (identityTools)
            identityTools.hidden = moveMode;
        const button = root.querySelector('#creature-mode');
        button?.setAttribute('aria-pressed', String(moveMode));
        button?.classList.toggle('is-armed', moveMode);
        if (button)
            button.textContent = moveMode ? 'Build Mode' : 'Combat Mode';
        status.textContent = moveMode
            ? 'Combat Mode: scenery is locked. Select a character or monster, then choose its destination. Status rings remain available.'
            : 'Build Mode: all blocks, characters, monsters, identity rings and statuses are available.';
    });
    root.querySelectorAll('[data-map-terrain]').forEach(button => {
        button.addEventListener('click', () => {
            const map = button.getAttribute('data-map-terrain');
            if (!map || map === theme.id)
                return;
            saveBoard(state);
            propagateParty(state);
            window.location.search = '?view=build&terrain=' + encodeURIComponent(map);
        });
    });
    root.querySelector('#create-starter-map')?.addEventListener('click', () => {
        const choice = root.querySelector('#starter-template-choice');
        if (!choice)
            return;
        try {
            const created = createStarterMap(choice.value);
            window.location.search = '?view=build&terrain=' + encodeURIComponent(created.terrain) + '&map=' + encodeURIComponent(created.id);
        }
        catch (error) {
            status.textContent = 'Could not create starter map. Your current map was not changed.';
            console.warn('[templates]', error);
        }
    });
    root.querySelectorAll('[data-map-id]').forEach(button => {
        button.addEventListener('click', () => {
            const target = listCampaignMaps().find(m => m.id === button.getAttribute('data-map-id'));
            if (!target)
                return;
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
    root.querySelectorAll('[data-category-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            setCatalogCategory(root, button.dataset.categoryTab);
        });
    });
    root.querySelectorAll('[id="monster-cr-filter"], [id="monster-edition-filter"]').forEach(filter => {
        filter.addEventListener('change', () => {
            const query = root.querySelector('#catalog-search')?.value ?? '';
            filterCatalog(root, 'Monsters', query);
        });
    });
    const catalogSearch = root.querySelector('#catalog-search');
    catalogSearch?.addEventListener('input', () => {
        const activeButton = root.querySelector('[data-category-tab].active');
        const activeCategory = (activeButton?.dataset.categoryTab ?? 'Build');
        filterCatalog(root, activeCategory, catalogSearch.value);
    });
    root.querySelectorAll('[data-catalog]').forEach((button) => {
        button.addEventListener('click', () => {
            if (armedRoom)
                setRoomMode(null);
            if (moveMode)
                return;
            selected = button.dataset.catalog;
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
            link.download = 'dnd-blocks-backup-' + backup.createdAt.slice(0, 10) + '.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            status.textContent = 'Backup prepared: ' + backup.entries.length + ' saved records. Keep the JSON file safe; no maps were changed.';
        }
        catch (error) {
            console.error('[backup] Failed to export local save data', error);
            status.textContent = 'Backup failed. Your maps were not changed.';
        }
    });
    document.getElementById('print-map')?.addEventListener('click', () => {
        status.textContent =
            'Preparing top-down print map. Use Actual Size / 100% for exact 1-inch squares.';
        void printBoardMap(state, theme).catch((error) => {
            console.warn('[print] Print Map failed.', error);
            status.textContent = 'Could not prepare the print map.';
        });
    });
    document.getElementById('clear')?.addEventListener('click', () => {
        if (!confirm('Clear this prototype map?'))
            return;
        clearBoard(theme.id, mapId);
        state = { ...createBoardState(theme.id), ...(mapId ? { mapId } : {}) };
        history = createHistory();
        refresh();
    });
    const updateElevation = (delta) => {
        elevation = Math.min(MAX_BASE_ELEVATION, Math.max(0, elevation + delta));
        renderer?.setElevation(elevation);
        document.getElementById('elev-value').textContent =
            elevation === 0 ? 'Ground' : `+${elevation * 5} ft`;
    };
    document.getElementById('elev-down')?.addEventListener('click', () => updateElevation(-1));
    document.getElementById('elev-up')?.addEventListener('click', () => updateElevation(1));
    document.getElementById('rotate-left')?.addEventListener('click', () => renderer?.rotate(Math.PI / 8));
    document.getElementById('rotate-right')?.addEventListener('click', () => renderer?.rotate(-Math.PI / 8));
    document.getElementById('camera-home')?.addEventListener('click', () => renderer?.resetCamera());
    document.getElementById('zoom-in')?.addEventListener('click', () => renderer?.zoom(0.82));
    document.getElementById('zoom-out')?.addEventListener('click', () => renderer?.zoom(1.2));
    const onKeyDown = (event) => {
        if (event.key !== 'Escape')
            return;
        if (activeSpell) {
            event.preventDefault();
            cancelArea();
            return;
        }
        if (selectedCondition) {
            selectedCondition = null;
            root.querySelectorAll('[data-condition]').forEach(button => {
                button.classList.remove('selected');
                button.setAttribute('aria-pressed', 'false');
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
        if (!armedRoom)
            return;
        event.preventDefault();
        cancelRoomMode();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('contextmenu', onAreaRightClick, true);
        document.getElementById('print-map-root')?.remove();
        renderer?.dispose();
    };
}
