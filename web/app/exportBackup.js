import { createLocalBackup } from '../domain/legacyBackup.js?v=g0a-backup';
export function downloadLocalBackup() {
    const backup = createLocalBackup(localStorage);
    if (backup.entries.length === 0) {
        throw new Error('No DND Blocks saves found in this browser.');
    }
    const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    try {
        link.href = url;
        link.download = 'dndblocks-backup-' + backup.exportedAt.replace(/[:.]/g, '-') + '.json';
        document.body.appendChild(link);
        link.click();
    }
    finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return backup.inventory;
}
