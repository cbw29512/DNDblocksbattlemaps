import { ROOM_MAX_HEIGHT_FEET, ROOM_MAX_LENGTH_FEET, ROOM_MAX_WIDTH_FEET } from '../domain/spatial.js?v=094a169f6732';
import { normalizeRoomDimensions } from '../domain/room.js?v=094a169f6732';
export function roomPanelHtml() {
    return `
    <section class="room-builder" aria-labelledby="room-builder-title">
      <div class="room-builder-title">
        <span class="eyebrow">Room Builder</span>
        <strong id="room-builder-title">Length × Width × Height</strong>
        <span class="room-builder-intro">Enter the inside size, click Build Room, then pick corners. Cancel Room or Esc stops.</span>
      </div>

      <div class="room-inputs">
        <label class="room-field" for="room-length">
          <span>Length</span>
          <span class="room-number">
            <input id="room-length" type="number" min="5" max="${ROOM_MAX_LENGTH_FEET}" step="5" value="30">
            <b>ft</b>
          </span>
        </label>

        <label class="room-field" for="room-width">
          <span>Width</span>
          <span class="room-number">
            <input id="room-width" type="number" min="5" max="${ROOM_MAX_WIDTH_FEET}" step="5" value="20">
            <b>ft</b>
          </span>
        </label>

        <label class="room-field" for="room-height">
          <span>Height</span>
          <span class="room-number">
            <input id="room-height" type="number" min="5" max="${ROOM_MAX_HEIGHT_FEET}" step="5" value="10">
            <b>ft</b>
          </span>
        </label>
      </div>

      <div class="room-builder-help">
        <b>5-foot steps</b>
        <span>Max ${ROOM_MAX_LENGTH_FEET} × ${ROOM_MAX_WIDTH_FEET} × ${ROOM_MAX_HEIGHT_FEET} ft · walls only · no ceiling</span>
      </div>

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
