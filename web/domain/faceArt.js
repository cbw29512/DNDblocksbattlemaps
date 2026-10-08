const STROKE = '#f7efd7';
function hex(color) {
    return '#' + color.toString(16).padStart(6, '0');
}
function linePath(d) {
    return '<path d="' + d + '" fill="none" stroke="' + STROKE + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
}
function iconMarkup(icon) {
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
        case 'torch':
        case 'lantern':
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
function escapeXml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    }[char] ?? char));
}

// Square, seamless-looking material artwork. These are still ordinary cube faces.
function surfaceTexture(id, color {
  const base = '<rect width="128" height="128" fill="' + hex(color) + '"/>';
  const h = (c, d) => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="4"/>';
  switch (id) {
    case 'grass': return base + Array.from({length: 9}, (_,i) => '<path d="M' + (9+i*14) + ' ' + (20+(i%3)*31) + 'l-4 -11 5 6 5-12" fill="none" stroke="#b8d88a" stroke-width="3"/>').join('') + h('#426836','M0 49h128M0 105h128');
    case 'dirt': case 'mud': return base + '<g fill="#392d23"><circle cx="24" cy="21" r="5"/><circle cx="92" cy="39" r="7"/><circle cx="45" cy="89" r="6"/><circle cx="106" cy="107" r="4"/></g>' + h('#9d7753','M4 60l22-8 18 12M70 16l18-7 20 8M76 96l14-6 19 7');
    case 'stone-block': case 'cobblestone': case 'castle-wall': case 'wall': case 'dungeon-tile': return base + h('#343d3b','M0 42h128M0 85h128M43 0v42M92 42v43M42 85v43') + h('#b2b7aa','M3 46h120M3 89h120');
    case 'brick-floor': case 'brick-wall': return base + h('#47362e','M0 32h128M0 64h128M0 96h128M32 0v32M96 32v32M32 64v32M96 96v32');
    case 'wood-block': case 'wood-wall': case 'ship-deck': return base + h('#4a3024','M0 31h128M0 65h128M0 98h128M49 0v31M92 31v34M49 65v33M92 98v30') + h('#b48355','M4 12h36M58 49h25M6 82h30M55 113h30');
    case 'sand': return base + '<g fill="#e9d6a5"><circle cx="14" cy="25" r="3"/><circle cx="70" cy="13" r="3"/><circle cx="110" cy="66" r="4"/><circle cx="29" cy="103" r="4"/></g>' + h('#90794a','M5 42q23-13 46 0t49 0M0 87q32-12 64 0t64 0');
    case 'water': case 'ice': return base + h('#a9e4e9','M-5 25q16-13 32 0t32 0t32 0t42 0M-5 67q16-13 32 0t32 0t32 0t42 0M-5 106q16-13 32 0t32 0t32 0t42 0') + h('#22536f','M10 42q19 9 36 0M65 86q23 11 44-1');
    case 'lava': return base + h('#ffd25e','M-2 14l28 20 25-12 20 29 28-18 31 17M-2 84l25-9 31 26 28-20 46 24') + h('#59251d','M0 55l34 4 15-14M78 115l22-9 28 8');
    default: return null;
  }
}

export function generatedCubeArt(id, name, icon, color, category) {
    const label = escapeXml(name.toUpperCase());
    const face = surface ?? (category === 'Build' || category === 'Props' ? illustratedBlockFace(id, icon, color, category) : null);
    if (face) return {src: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">' + face + '</svg>'), alt: name, source: 'generated', sourceId: 'dndblocks:' + id};
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">' +
        '<rect width="128" height="128" rx="13" fill="' + hex(color) + '"/>' +
        '<rect x="5" y="5" width="118" height="118" rx="10" fill="none" stroke="#f7efd7" stroke-opacity=".42" stroke-width="3"/>' +
        '<g transform="translate(0 -7)">' + iconMarkup(icon) + '</g>' +
        '<rect x="8" y="101" width="112" height="20" rx="6" fill="#11120f" fill-opacity=".83"/>' +
        '<text x="64" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="800" fill="#fff8e6">' + label + '</text>' +
        '</svg>';
    return {
        src: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        alt: name,
        source: 'generated',
        sourceId: 'dndblocks:' + id
    };
}
