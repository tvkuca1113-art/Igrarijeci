'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Game, MODES, WORDS, KEY, splitWord } = require('../dist/engine.js');
function setup(mode = 'medium') {
  let clock = 100000, seed = 42;
  const memory = {};
  const storage = { getItem: k => memory[k] || null, setItem: (k, v) => { memory[k] = v; } };
  const now = () => clock;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const options = { storage, now, random };
  const game = new Game(options);
  game.setMode(mode);
  return { game, memory, storage, options, advance: ms => { clock += ms; }, reload: () => new Game(options) };
}
function solve(g) {
  const target = splitWord(g.round.word);
  for (let i = 0; i < target.length; i++) {
    if (g.round.slots[i] !== null) continue;
    const tile = g.round.tiles.find(t => t.text === target[i] && !g.round.slots.includes(t.id));
    assert(tile, 'An available tile must exist for every position');
    g.select(tile.id);
  }
}
function wrong(g) {
  g.clear();
  let ids = g.round.tiles.filter(t => !g.round.slots.includes(t.id)).map(t => t.id);
  let candidate = [...g.round.slots];
  ids.forEach(id => { candidate[candidate.indexOf(null)] = id; });
  if (candidate.map(id => g.round.tiles.find(t => t.id === id).text).join('') === g.round.word) {
    const different = ids.findIndex(id => g.round.tiles.find(t => t.id === id).text !== g.round.tiles.find(t => t.id === ids[0]).text);
    [ids[0], ids[different]] = [ids[different], ids[0]];
  }
  for (const id of ids) g.select(id);
}
test('240 unique words, valid Bosnian letters, five populated pools and touch-friendly lengths', () => {
  assert.equal(WORDS.length, 240); assert.equal(new Set(WORDS.map(w => w.word)).size, 240);
  for (const w of WORDS) {
    assert.match(w.word, /^[A-ZČĆŽŠĐ]+$/u);
    assert(splitWord(w.word).length <= 12);
    assert(w.clue.split(' ').length <= 4);
  }
  for (let band = 0; band < 5; band++) assert.equal(WORDS.filter(w => w.band === band).length, 48);
});
test('clock starts only on explicit begin; medium 24 seconds, hard 12, easy untimed', () => {
  for (const mode of Object.keys(MODES)) {
    const t = setup(mode); t.advance(60000); assert.equal(t.game.round, null);
    t.game.begin(); assert.equal(t.game.remaining(), MODES[mode].seconds ? MODES[mode].seconds * 1000 : null);
    if (mode === 'easy') { t.advance(999999); assert.equal(t.game.tick(), false); assert.equal(t.game.round.phase, 'playing'); }
  }
});
test('three wrong complete answers fail, preserve level, award nothing, retry changes word and restores lives', () => {
  const { game: g } = setup(); g.begin(); const first = g.round.word;
  for (let lives = 2; lives >= 0; lives--) { wrong(g); assert.equal(g.round.lives, lives); }
  assert.equal(g.round.phase, 'lost'); assert.equal(g.unlocked, 0); assert.equal(g.current, 0);
  assert.deepEqual(g.progress.results, {});
  g.begin(); assert.notEqual(g.round.word, first); assert.equal(g.current, 0); assert.equal(g.round.lives, 3);
});
test('every hint costs a star, spending the last one loses before revealing a free solution', () => {
  const { game: g } = setup(); g.begin(); g.hint(); assert.equal(g.round.lives, 2); assert.equal(g.round.fixed.length, g.round.freeHints + 1);
  g.hint(); assert.equal(g.round.lives, 1); assert.equal(g.round.fixed.length, g.round.freeHints + 2);
  g.hint(); assert.equal(g.round.lives, 0); assert.equal(g.round.phase, 'lost'); assert.equal(g.round.reason, 'hint');
  assert.equal(g.round.fixed.length, g.round.freeHints + 2); assert.equal(g.progress.results[0], undefined);
});
test('mixed mistakes and hints use the same lives; shuffle and backspace are free', () => {
  const { game: g } = setup(); g.begin(); wrong(g); g.hint();
  assert.equal(g.round.lives, 1); const end = g.round.deadline;
  g.shuffle(); g.undo(); g.clear(); assert.equal(g.round.lives, 1); assert.equal(g.round.deadline, end);
  g.hint(); assert.equal(g.round.phase, 'lost');
});
test('deadline boundary wins just before timeout and rejects answer at timeout', () => {
  const t = setup('hard'); t.game.begin(); t.advance(11999); solve(t.game); assert.equal(t.game.round.phase, 'won');
  const late = setup('medium'); late.game.begin(); late.advance(24000); const tile = late.game.round.tiles[0].id;
  assert.equal(late.game.select(tile), false); assert.equal(late.game.round.phase, 'lost'); assert.equal(late.game.round.reason, 'time');
});
test('refresh retains exact deadline, tiles, fixed letters and stars', () => {
  const t = setup(); t.game.begin(); t.game.hint(); t.game.shuffle(); t.advance(5000);
  const snapshot = JSON.parse(JSON.stringify(t.game.round)), r = t.reload();
  assert.deepEqual(r.round, snapshot); assert.equal(r.remaining(), 19000);
  t.advance(19000); const expired = t.reload(); assert.equal(expired.round.phase, 'lost'); assert.equal(expired.current, 0);
  expired.begin(); assert.notEqual(expired.round.word, snapshot.word); assert.equal(expired.remaining(), 24000);
});
test('leaving a tab or switching mode does not pause the clock; modes keep separate progression', () => {
  const t = setup(); t.game.begin(); const word = t.game.round.word;
  t.game.setMode('easy'); t.game.begin(); solve(t.game); assert.equal(t.game.unlocked, 1);
  t.advance(25000); t.game.setMode('medium'); assert.equal(t.game.round.word, word);
  assert.equal(t.game.round.phase, 'lost'); assert.equal(t.game.unlocked, 0);
});
test('every mode can finish all 60 levels and the final level cannot overflow', () => {
  for (const mode of Object.keys(MODES)) {
    const { game: g } = setup(mode); g.begin();
    for (let i = 0; i < 60; i++) {
      assert.equal(g.round.freeHints, 0);
      assert(g.round.slots.every(id => id === null));
      assert.equal(g.round.fixed.length, g.round.freeHints);
      assert.equal(g.round.lives, 3); assert.equal(g.round.hints, 0);
      assert.equal(g.current, i); assert.equal(g.setLevel(i + 1), false);
      solve(g); assert.equal(g.round.phase, 'won'); assert.equal(g.unlocked, Math.min(i + 1, 59));
      if (i < 59) assert.equal(g.next(), true);
    }
    assert.equal(g.next(), false); assert.equal(g.current, 59);
    assert.equal(g.view().totalPoints, 9000 * MODES[mode].multiplier);
  }
});
test('wins save once and replay never reduces a best score', () => {
  const t = setup('hard'), g = t.game; g.begin(); solve(g);
  assert.equal(g.view().totalPoints, 450);
  const reload = t.reload(); assert.equal(reload.round.phase, 'won'); assert.equal(reload.view().totalPoints, 450);
  reload.setLevel(0); reload.begin(); reload.hint(); solve(reload);
  assert.equal(reload.round.phase, 'won'); assert.equal(reload.view().totalPoints, 450); assert.equal(reload.round.earned, 0);
});
test('retry draws all 48 words in a band before recycling and never repeats immediate word', () => {
  const t = setup('easy'), g = t.game, seen = new Set();
  for (let i = 0; i < 48; i++) { g.begin(); assert(!seen.has(g.round.word)); seen.add(g.round.word); g.abandon(); }
  const last = g.round.word; g.begin(); assert.notEqual(g.round.word, last);
});
test('restoring failed rounds does not grant a free new attempt or reset timeout', () => {
  for (const reason of ['time', 'hint', 'stars', 'abandoned']) {
    const t = setup(); t.game.begin();
    if (reason === 'time') { t.advance(24001); t.game.tick(); }
    if (reason === 'hint') { t.game.hint(); t.game.hint(); t.game.hint(); }
    if (reason === 'stars') { wrong(t.game); wrong(t.game); wrong(t.game); }
    if (reason === 'abandoned') t.game.abandon();
    const r = t.reload(); assert.equal(r.round.phase, 'lost'); assert.equal(r.round.reason, reason);
  }
});
test('duplicate tile IDs, unknown modes and locked levels do not alter game state', () => {
  const { game: g } = setup(); assert.equal(g.setMode('__proto__'), false); assert.equal(g.setLevel(59), false);
  g.begin(); assert.equal(g.select(999), false); const id = g.round.tiles[0].id;
  g.select(id); const saved = JSON.stringify(g.round); assert.equal(g.select(id), false);
  assert.equal(g.begin(), false); assert.equal(g.setLevel(0), false); assert.equal(JSON.stringify(g.round), saved);
});
test('legacy progression migrates to Lahko while medium and hard remain independent', () => {
  const t = setup(); delete t.memory[KEY];
  t.memory['rijec-po-rijec-v1'] = JSON.stringify({ results: { 0: 3, 1: 2 }, current: 1, sound: true });
  const g = t.reload(); assert.equal(g.mode, 'medium'); assert.equal(g.unlocked, 0);
  g.setMode('easy'); assert.equal(g.unlocked, 2); assert.equal(g.current, 2); assert.equal(g.view().totalPoints, 250);
  assert(t.memory['rijec-po-rijec-v1']);
});
test('unavailable or malformed browser storage does not break play', () => {
  const bad = new Game({ storage: { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } } });
  assert.equal(bad.canSave, false); assert.equal(bad.begin(), true); solve(bad); assert.equal(bad.round.phase, 'won');
  const t = setup(); t.memory[KEY] = '{bad'; const r = t.reload(); assert.equal(r.current, 0); assert.equal(r.begin(), true);
});
test('all word digraphs and repeated letters can be consumed exactly once', () => {
  for (const w of WORDS) assert.equal(splitWord(w.word).join(''), w.word);
  assert.deepEqual(splitWord('KNJIŽEVNOST'), ['K', 'NJ', 'I', 'Ž', 'E', 'V', 'N', 'O', 'S', 'T']);
  assert.deepEqual(splitWord('DŽEMPER'), ['DŽ', 'E', 'M', 'P', 'E', 'R']);
});
test('unfinished saved attempts remove automatic letters but preserve paid hints and deadline', () => {
  const t = setup(), g = t.game; g.begin();
  const r = g.round, target = splitWord(r.word);
  r.freeHints = Math.max(1, Math.round(target.length * .2));
  for (let i = 0; i < r.freeHints; i++) {
    r.slots[i] = r.tiles.find(tile => tile.text === target[i] && !r.slots.includes(tile.id)).id;
    r.fixed.push(i);
  }
  g.hint();
  const count = r.freeHints, paid = r.fixed.at(-1), deadline = r.deadline, word = r.word;
  const restored = t.reload();
  assert.equal(restored.round.freeHints, 0);
  assert.deepEqual(restored.round.fixed, [paid]);
  assert(restored.round.slots.slice(0, count).every(id => id === null));
  assert.equal(restored.round.lives, 2); assert.equal(restored.round.hints, 1);
  assert.equal(restored.round.deadline, deadline); assert.equal(restored.round.word, word);
  assert.equal(restored.remove(paid), false);
  solve(restored); assert.equal(restored.round.phase, 'won');
});
test('previous saved rounds without free letters retain progress and deadline', () => {
  const t = setup(); t.game.begin();
  const r = t.game.round;
  delete r.freeHints; r.fixed = []; r.slots.fill(null); r.deadline -= 4000;
  t.game.hint(); const snapshot = JSON.parse(JSON.stringify(r));
  assert.deepEqual(t.reload().round, snapshot);
});
test('every word has concise descriptive help, with shorter clues on hard', () => {
  for (const w of WORDS) {
    assert(w.description && w.description.split(' ').length <= 6);
    assert(!w.description.toLocaleUpperCase('bs').includes(w.word));
  }
  for (const mode of Object.keys(MODES)) {
    const { game: g } = setup(mode); g.begin();
    const w = WORDS.find(w => w.word === g.round.word);
    assert.equal(g.view().clue, mode === 'hard' ? w.clue : w.description);
  }
});
