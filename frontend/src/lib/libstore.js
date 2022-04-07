import Dexie from 'dexie';

export const db = new Dexie('trash-ai-db');
db.version(1).stores({
  trash: 'hash, dataUrl, processDataUrl, metadata',
});
// console.log('db', db);
