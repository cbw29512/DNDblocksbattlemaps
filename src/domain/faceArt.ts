import type { CatalogArt } from './types.js';

export type FaceIcon =
  | 'terrain' | 'stone' | 'wood' | 'water' | 'lava' | 'wall' | 'bars'
  | 'pillar' | 'window' | 'arch' | 'door' | 'stairs' | 'ladder' | 'bridge'
  | 'pit' | 'table' | 'chair' | 'bed' | 'chest' | 'barrel' | 'crate'
  | 'torch' | 'books' | 'throne' | 'cabinet' | 'altar' | 'statue'
  | 'tomb' | 'fountain' | 'well' | 'fire' | 'rug' | 'banner' | 'lantern'
  | 'cauldron' | 'anvil' | 'cage' | 'lever' | 'switch' | 'plate' | 'trap'
  | 'web' | 'acid' | 'poison' | 'rune' | 'tree' | 'rock' | 'bush' | 'log'
  | 'tent' | 'wagon' | 'boat' | 'secret-door' | 'open-door' | 'trapdoor' | 'spike' | 'dart' | 'mimic';

const STROKE = '#f7efd7';

function hex(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}

function linePath(d: string): string {
  return '<path d="' + d + '" fill="none" stroke="' + STROKE + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
}

function iconMarkup(icon: FaceIcon): string {
  switch (icon) {
    case 'stone':
    case 'rock':
      return linePath('M27 88 39 48l28-20 34 25 5 38H28z') + linePath('m39 48 25 22 37-17M64 70v20');
    case 'wood':
      return '<rect x="24" y="32" width="80" height="64" rx="8" fill="#8d5b38" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M34 50h60M34 72h60M48 34v60M82 34v60');
    case 'water':
      return linePath('M18 49c15-14 28 14 44 0s29 14 48 0M18 72c15-14 28 14 44 0s29 14 48 0M18 95c15-14 28 14 44 0s29 14 48 0');
    case 'lava':
      return linePath('M18 89c19-30 27 14 45-16 19-31 29 21 47-10M23 103h82') + '<path d="M57 24 71 49 54 62 44 44zM85 32l12 19-13 16-11-23z" fill="#ffd15c"/>';
    case 'wall':
      return '<rect x="20" y="30" width="88" height="70" rx="4" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M20 52h88M20 76h88M44 30v22M84 30v22M61 52v24M96 52v24M42 76v24M79 76v24');
    case 'bars':
    case 'cage':
      return '<rect x="25" y="27" width="78" height="76" rx="4" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M42 29v72M63 29v72M84 29v72M26 50h76');
    case 'pillar':
      return linePath('M37 28h54M32 41h64M46 41v50M82 41v50M32 91h64M26 103h76');
    case 'window':
      return '<rect x="29" y="27" width="70" height="72" rx="5" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M64 29v68M31 63h66');
    case 'arch':
      return linePath('M28 102V61c0-47 72-47 72 0v41M48 102V64c0-23 32-23 32 0v38');
    case 'secret-door':
      return '<rect x="24" y="28" width="80" height="72" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M24 52h80M24 76h80M47 28v24M79 52v24M47 76v24') + '<path d="M86 53l7 11-7 11" fill="none" stroke="#ffd15c" stroke-width="5"/>';
    case 'open-door':
      return linePath('M24 102V34h80v68M44 102V57h40v45') + '<path d="M49 57 91 36v66L49 102z" fill="#8d5b38" stroke="' + STROKE + '" stroke-width="5"/>';
    case 'trapdoor':
      return '<rect x="22" y="35" width="84" height="65" fill="#3b271b" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M35 47h58M35 62h58M35 77h58') + '<circle cx="65" cy="87" r="6" fill="#ffd15c"/>';
    case 'spike':
      return linePath('M17 100 33 43l16 57 16-57 16 57 16-57 14 57M17 102h94');
    case 'dart':
      return linePath('M20 41h88M20 64h88M20 87h88M87 30l21 11-21 11M87 53l21 11-21 11M87 76l21 11-21 11');
    case 'mimic':
      return linePath('M22 55c0-18 84-18 84 0L96 99H32zM22 55l42 27 42-27') + '<path d="m30 62 11 19 10-10 13 15 13-15 10 10 11-19" fill="none" stroke="#ffd15c" stroke-width="6"/>' + '<circle cx="47" cy="47" r="5" fill="#ffd15c"/><circle cx="81" cy="47" r="5" fill="#ffd15c"/>';
    case 'door':
      return '<rect x="34" y="22" width="60" height="84" rx="4" fill="#70472d" stroke="' + STROKE + '" stroke-width="6"/><circle cx="79" cy="66" r="5" fill="' + STROKE + '"/>' + linePath('M47 36h34M47 51h34M47 85h34');
    case 'stairs':
      return linePath('M20 101h25V82h21V63h21V44h21');
    case 'ladder':
      return linePath('M41 22v85M87 22v85M41 38h46M41 58h46M41 78h46M41 98h46');
    case 'bridge':
      return linePath('M17 79c24-34 70-34 94 0M17 93c24-34 70-34 94 0M33 66v34M64 54v46M95 66v34');
    case 'pit':
      return '<ellipse cx="64" cy="70" rx="43" ry="29" fill="#10110e" stroke="' + STROKE + '" stroke-width="7"/>' + linePath('m31 60 13 8m53-8-13 8m-29-25 9 11');
    case 'table':
      return '<rect x="24" y="34" width="80" height="39" rx="5" fill="#8d5b38" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M36 74v31M92 74v31');
    case 'chair':
      return linePath('M39 26v79M39 68h49v37M39 68V45h49v23');
    case 'bed':
      return linePath('M25 40v66M25 58h78v48M25 81h78') + '<rect x="31" y="62" width="24" height="15" rx="4" fill="' + STROKE + '"/>';
    case 'chest':
      return linePath('M26 55c0-21 76-21 76 0v42H26zM26 63h76M64 63v34') + '<rect x="58" y="73" width="12" height="15" rx="2" fill="' + STROKE + '"/>';
    case 'barrel':
      return linePath('M38 31c17-8 35-8 52 0l6 67c-22 9-42 9-64 0zM35 48h58M33 80h62M44 32c-5 23-5 43 0 65M84 32c5 23 5 43 0 65');
    case 'crate':
      return '<rect x="28" y="28" width="72" height="72" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('m31 31 66 66m0-66L31 97');
    case 'lantern':
      return '<rect x="41" y="43" width="46" height="56" rx="8" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M49 43V29h30v14M49 99h30M64 54v32') + '<path d="M64 53c13 14 9 29 0 32-11-6-11-18 0-32z" fill="#ffd15c"/>';
    case 'torch':
      return linePath('M64 57 55 108M64 57l9 51') + '<path d="M64 18c22 22 11 40 0 45-15-6-20-22 0-45z" fill="#ffd15c" stroke="' + STROKE + '" stroke-width="5"/>';
    case 'books':
      return '<rect x="24" y="28" width="80" height="75" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M37 38v55M54 38v55M74 38v55M92 38v55');
    case 'throne':
      return linePath('M37 25h54v58H37zM29 55h70v28H29zM37 83v23M91 83v23') + '<path d="m64 32 7 12 14 2-10 10 2 14-13-6-13 6 2-14-10-10 14-2z" fill="' + STROKE + '"/>';
    case 'cabinet':
      return '<rect x="31" y="23" width="66" height="84" rx="5" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M64 24v82') + '<circle cx="55" cy="66" r="4" fill="' + STROKE + '"/><circle cx="73" cy="66" r="4" fill="' + STROKE + '"/>';
    case 'altar':
      return linePath('M37 42h54l9 18H28zM34 60h60v37H34zM25 99h78M64 22v22M53 33h22');
    case 'statue':
      return '<circle cx="64" cy="34" r="15" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M49 50h30l8 35H41zM34 98h60');
    case 'tomb':
      return linePath('M28 99V48c0-30 72-30 72 0v51zM64 38v35M49 55h30');
    case 'fountain':
      return '<ellipse cx="64" cy="87" rx="42" ry="17" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M64 23v54M45 42c10 14 28 14 38 0M35 63c17 18 41 18 58 0');
    case 'well':
      return '<ellipse cx="64" cy="82" rx="38" ry="18" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M27 82V49h74v33M41 49V30M87 49V30M41 30h46');
    case 'fire':
      return '<path d="M65 20c22 24 4 32 18 48 11 13 2 35-19 35-25 0-34-22-21-39 10-12 13-20 22-44z" fill="#ffd15c" stroke="' + STROKE + '" stroke-width="5"/>';
    case 'rug':
      return '<rect x="24" y="34" width="80" height="60" rx="5" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('m37 47 27 34 27-34M37 81l27-34 27 34');
    case 'banner':
      return linePath('M41 23h46v73L64 84 41 96zM33 23h62');
    case 'cauldron':
      return linePath('M27 55h74c0 41-12 48-37 48S27 96 27 55zM44 103l-7 9M84 103l7 9M42 37c6-12 12-12 18 0m10 0c6-12 12-12 18 0');
    case 'anvil':
      return linePath('M22 39h67l17 13-26 8-6 15H45l-6-15-17-7zM48 75h24v27H48M38 103h44');
    case 'lever':
      return '<rect x="30" y="77" width="68" height="27" rx="6" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M64 79 87 31') + '<circle cx="90" cy="25" r="9" fill="' + STROKE + '"/>';
    case 'switch':
      return '<rect x="35" y="24" width="58" height="80" rx="12" fill="none" stroke="' + STROKE + '" stroke-width="6"/><circle cx="64" cy="48" r="13" fill="' + STROKE + '"/>' + linePath('M64 71v19');
    case 'plate':
      return '<rect x="23" y="62" width="82" height="31" rx="6" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M35 75h58M42 51h44');
    case 'trap':
      return linePath('M25 88 42 45l22 43 22-43 17 43M20 96h88');
    case 'web':
      return '<circle cx="64" cy="66" r="42" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('M64 24v84M22 66h84M34 36l60 60M94 36 34 96');
    case 'acid':
      return linePath('M24 88c14-16 25 11 40-3 16-15 27 12 40-3M31 101h66') + '<circle cx="42" cy="60" r="6" fill="' + STROKE + '"/><circle cx="77" cy="49" r="5" fill="' + STROKE + '"/>';
    case 'poison':
      return '<circle cx="64" cy="55" r="27" fill="none" stroke="' + STROKE + '" stroke-width="6"/><circle cx="54" cy="50" r="5" fill="' + STROKE + '"/><circle cx="74" cy="50" r="5" fill="' + STROKE + '"/>' + linePath('M52 68h24M39 86l50 24M89 86l-50 24');
    case 'rune':
      return '<circle cx="64" cy="66" r="42" fill="none" stroke="' + STROKE + '" stroke-width="6"/>' + linePath('m64 27 11 27 29 2-22 18 7 28-25-15-25 15 7-28-22-18 29-2z');
    case 'tree':
      return linePath('M64 58v49M48 107h32') + '<circle cx="64" cy="42" r="26" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/><circle cx="42" cy="56" r="17" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/><circle cx="86" cy="56" r="17" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/>';
    case 'bush':
      return '<circle cx="45" cy="69" r="23" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/><circle cx="68" cy="53" r="27" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/><circle cx="87" cy="72" r="22" fill="#5d8c4e" stroke="' + STROKE + '" stroke-width="6"/>';
    case 'log':
      return linePath('M27 47h70v45H27z') + '<ellipse cx="27" cy="69" rx="15" ry="23" fill="#835431" stroke="' + STROKE + '" stroke-width="6"/><ellipse cx="97" cy="69" rx="15" ry="23" fill="#835431" stroke="' + STROKE + '" stroke-width="6"/>';
    case 'tent':
      return linePath('M19 100 64 27l45 73zM64 27v73M48 100l16-29 16 29');
    case 'wagon':
      return linePath('M27 43h72v45H27zM39 43c7-25 43-25 50 0') + '<circle cx="43" cy="94" r="12" fill="none" stroke="' + STROKE + '" stroke-width="6"/><circle cx="84" cy="94" r="12" fill="none" stroke="' + STROKE + '" stroke-width="6"/>';
    case 'boat':
      return linePath('M20 72h88L91 99H38zM64 30v42M64 34l29 26H64z');
    case 'terrain':
    default:
      return linePath('M18 87c21-24 36 7 52-8 15-14 23-2 40-19M18 102h92') + '<circle cx="41" cy="53" r="7" fill="' + STROKE + '"/>';
  }
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  }[char] ?? char));
}

export function generatedCubeArt(id: string, name: string, icon: FaceIcon, color: number): CatalogArt {
  const label = escapeXml(name.toUpperCase());
    // Fit longer names inside the cube label area.
    const fontSize = Math.max(6, Math.min(10, Math.floor(105 / (name.length * 0.66))));
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">' +
    '<rect width="128" height="128" rx="13" fill="' + hex(color) + '"/>' +
    '<rect x="5" y="5" width="118" height="118" rx="10" fill="none" stroke="#f7efd7" stroke-opacity=".42" stroke-width="3"/>' +
    '<g transform="translate(0 -7)">' + iconMarkup(icon) + '</g>' +
    '<rect x="8" y="101" width="112" height="20" rx="6" fill="#11120f" fill-opacity=".83"/>' +
    '<text x="64" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="' + fontSize + '" font-weight="800" fill="#fff8e6">' + label + '</text>' +
    '</svg>';

  return {
    src: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    alt: name,
    source: 'generated',
    sourceId: 'dndblocks:' + id
  };
}
