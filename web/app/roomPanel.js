import { ROOM_MAX_HEIGHT_FEET, ROOM_MAX_LENGTH_FEET, ROOM_MAX_WIDTH_FEET } from '../domain/spatial.js';
import { normalizeRoomDimensions } from '../domain/room.js';
export function roomPanelHtml() {
    return `
    <section class="room-builder">
      <div class="room-builder-title">
        <span class="eyebrow">Room Builder</span>
        <strong>Length × Width × Height</strong>
      </div>
      <div class="room-inputs">
        <label>L<input id="room-length" type="number" min="5" max="${ROOM_MAX_LENGTH_FEET}" step="5" value="30"><small>ft</small></label>
        <label>W<input id="room-width" type="number" min="5" max="${ROOM_MAX_WIDTH_FEET}" step="5" value="20"><small>ft</small></label>
        <label>H<input id="room-height" type="number" min="5" max="${ROOM_MAX_HEIGHT_FEET}" step="5" value="10"><small>ft</small></label>
      </div>
      <small class="room-builder-help">Max ${ROOM_MAX_LENGTH_FEET} × ${ROOM_MAX_WIDTH_FEET} × ${ROOM_MAX_HEIGHT_FEET} ft · no ceiling</small>
      <button id="build-room" class="button room-build-button" type="button">Build Room</button>
    </section>
  `;
}
function readNumber(id) {
    return Number(document.getElementById(id)?.value ?? Number.NaN);
}
export function readRoomPanel() {
    return normalizeRoomDimensions({
        lengthFeet: readNumber('room-length'),
        widthFeet: readNumber('room-width'),
        heightFeet: readNumber('room-height')
    });
}
export function roomPanelError() {
    return `Use 5-ft steps. Max room is ${ROOM_MAX_LENGTH_FEET} × ${ROOM_MAX_WIDTH_FEET} × ${ROOM_MAX_HEIGHT_FEET} ft.`;
}
