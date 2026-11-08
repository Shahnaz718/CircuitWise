import * as SQLite from 'expo-sqlite';
import { PROBLEMS } from '../data/problems';
import { TOOLS, GLOSSARY, SAFETY } from '../data/reference';

const DATA_VERSION = '1';
let db = null;

const json = (v) => JSON.stringify(v);
const parseProblem = (r) =>
  r && {
    ...r,
    symptoms: JSON.parse(r.symptoms),
    causes: JSON.parse(r.causes),
    tools: JSON.parse(r.tools),
    steps: JSON.parse(r.steps),
    call_pro: !!r.call_pro,
  };

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('circuitwise.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY, title TEXT, category TEXT, risk TEXT, difficulty TEXT,
      minutes INTEGER, summary TEXT, symptoms TEXT, causes TEXT, tools TEXT, steps TEXT,
      call_pro INTEGER, search_text TEXT
    );
    CREATE TABLE IF NOT EXISTS tools (id INTEGER PRIMARY KEY, name TEXT, icon TEXT, purpose TEXT, usage TEXT, safety TEXT);
    CREATE TABLE IF NOT EXISTS glossary (id INTEGER PRIMARY KEY AUTOINCREMENT, term TEXT, definition TEXT);
    CREATE TABLE IF NOT EXISTS safety (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, text TEXT);
    CREATE TABLE IF NOT EXISTS favorites (problem_id INTEGER PRIMARY KEY, created_at INTEGER);
    CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, problem_id INTEGER, status TEXT, at INTEGER);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  `);
  if ((await getSetting('data_version')) !== DATA_VERSION) await seed();
}

async function seed() {
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM problems; DELETE FROM tools; DELETE FROM glossary; DELETE FROM safety;');
    for (const p of PROBLEMS) {
      const steps = p.steps.map((s) => {
        const [raw, warn] = Array.isArray(s) ? s : [s, null];
        const stop = raw.startsWith('STOP:');
        return { text: stop ? raw.slice(5).trim() : raw, warn: warn || null, stop };
      });
      const searchText = [p.title, p.summary, p.category, ...p.symptoms, ...p.causes].join(' ').toLowerCase();
      await db.runAsync(
        'INSERT INTO problems (id,title,category,risk,difficulty,minutes,summary,symptoms,causes,tools,steps,call_pro,search_text) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [p.id, p.title, p.category, p.risk, p.difficulty, p.minutes, p.summary, json(p.symptoms), json(p.causes), json(p.tools), json(steps), p.callPro ? 1 : 0, searchText]
      );
    }
    for (const t of TOOLS)
      await db.runAsync('INSERT INTO tools (id,name,icon,purpose,usage,safety) VALUES (?,?,?,?,?,?)', [t.id, t.name, t.icon, t.purpose, t.usage, t.safety]);
    for (const g of GLOSSARY) await db.runAsync('INSERT INTO glossary (term,definition) VALUES (?,?)', [g.term, g.definition]);
    for (const s of SAFETY) await db.runAsync('INSERT INTO safety (type,text) VALUES (?,?)', [s.type, s.text]);
    await db.runAsync('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', ['data_version', DATA_VERSION]);
  });
}

export async function getSetting(key) {
  const r = await db.getFirstAsync('SELECT value FROM settings WHERE key = ?', [key]);
  return r ? r.value : null;
}
export const setSetting = (key, value) => db.runAsync('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', [key, value]);


const LIST_COLS = 'id,title,category,risk,difficulty,minutes,summary,call_pro';

export async function getProblems({ search = '', category = 'All', risk = 'All', difficulty = 'All' } = {}) {
  let sql = `SELECT ${LIST_COLS} FROM problems WHERE 1=1`;
  const args = [];
  if (category !== 'All') { sql += ' AND category = ?'; args.push(category); }
  if (risk !== 'All') { sql += ' AND risk = ?'; args.push(risk); }
  if (difficulty !== 'All') { sql += ' AND difficulty = ?'; args.push(difficulty); }
  search.toLowerCase().split(/\s+/).filter(Boolean).forEach((w) => { sql += ' AND search_text LIKE ?'; args.push(`%${w}%`); });
  sql += ' ORDER BY title';
  return db.getAllAsync(sql, args);
}
export async function getProblem(id) {
  return parseProblem(await db.getFirstAsync('SELECT * FROM problems WHERE id = ?', [id]));
}
export const getCategoryCounts = () => db.getAllAsync('SELECT category, COUNT(*) AS n FROM problems GROUP BY category');


export async function isFavorite(id) {
  return !!(await db.getFirstAsync('SELECT 1 AS x FROM favorites WHERE problem_id = ?', [id]));
}
export async function toggleFavorite(id) {
  if (await isFavorite(id)) {
    await db.runAsync('DELETE FROM favorites WHERE problem_id = ?', [id]);
    return false;
  }
  await db.runAsync('INSERT INTO favorites (problem_id, created_at) VALUES (?,?)', [id, Date.now()]);
  return true;
}
export const getFavorites = () =>
  db.getAllAsync(`SELECT ${LIST_COLS.split(',').map((c) => 'p.' + c).join(',')} FROM favorites f JOIN problems p ON p.id = f.problem_id ORDER BY f.created_at DESC`);
export const clearFavorites = () => db.runAsync('DELETE FROM favorites');


export async function addHistory(problemId, status = 'viewed') {
  if (status === 'viewed') await db.runAsync("DELETE FROM history WHERE problem_id = ? AND status = 'viewed'", [problemId]);
  await db.runAsync('INSERT INTO history (problem_id, status, at) VALUES (?,?,?)', [problemId, status, Date.now()]);
}
export const getHistory = (limit = 50) =>
  db.getAllAsync(
    `SELECT ${LIST_COLS.split(',').map((c) => 'p.' + c).join(',')}, h.status, h.at FROM history h JOIN problems p ON p.id = h.problem_id ORDER BY h.at DESC LIMIT ?`,
    [limit]
  );
export const getRecent = (limit = 5) =>
  db.getAllAsync(
    `SELECT ${LIST_COLS.split(',').map((c) => 'p.' + c).join(',')}, MAX(h.at) AS last FROM history h JOIN problems p ON p.id = h.problem_id GROUP BY p.id ORDER BY last DESC LIMIT ?`,
    [limit]
  );
export const clearHistory = () => db.runAsync('DELETE FROM history');

export async function getStats() {
  const p = await db.getFirstAsync('SELECT COUNT(*) AS n FROM problems');
  const f = await db.getFirstAsync('SELECT COUNT(*) AS n FROM favorites');
  const x = await db.getFirstAsync("SELECT COUNT(DISTINCT problem_id) AS n FROM history WHERE status = 'fixed'");
  return { problems: p.n, favorites: f.n, fixed: x.n };
}

export const getTools = () => db.getAllAsync('SELECT * FROM tools ORDER BY id');
export const getGlossary = (q = '') =>
  q.trim()
    ? db.getAllAsync('SELECT * FROM glossary WHERE term LIKE ? OR definition LIKE ? ORDER BY term', [`%${q.trim()}%`, `%${q.trim()}%`])
    : db.getAllAsync('SELECT * FROM glossary ORDER BY term');
export const getSafety = () => db.getAllAsync('SELECT * FROM safety ORDER BY id');
