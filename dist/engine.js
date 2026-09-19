(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./words.js'));
  else root.RPR = factory(root.RPR_WORDS);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (WORDS) {
  'use strict';
  const KEY = 'rijec-po-rijec-v2';
  const MODES = {
    easy: { label: 'Lahko', seconds: null, multiplier: 1, bands: [0, 0, 1, 1, 2, 2] },
    medium: { label: 'Srednje', seconds: 24, multiplier: 2, bands: [1, 1, 2, 2, 3, 3] },
    hard: { label: 'Teško', seconds: 12, multiplier: 3, bands: [2, 2, 3, 3, 4, 4] }
  };
  const splitWord = word => word.match(/DŽ|LJ|NJ|./gu);
  const byWord = new Map(WORDS.map(word => [word.word, word]));
  const blankProgress = () => ({ current: 0, results: {}, seen: [], attempts: 0, round: null });
  const fresh = () => ({ version: 2, mode: 'medium', sound: false, migrated: false,
    progress: { easy: blankProgress(), medium: blankProgress(), hard: blankProgress() } });
  const int = (x, min, max) => Number.isInteger(x) && x >= min && x <= max;
  const shuffle = (array, random) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  function validRound(r, mode, p) {
    if (!r || r.level !== p.current || !byWord.has(r.word) || !['playing', 'won', 'lost'].includes(r.phase)) return false;
    if (byWord.get(r.word).band !== MODES[mode].bands[Math.floor(r.level / 10)]) return false;
    const target = splitWord(r.word), n = target.length;
    if (!Array.isArray(r.tiles) || r.tiles.length !== n || !Array.isArray(r.slots) || r.slots.length !== n || !Array.isArray(r.fixed)) return false;
    if (r.tiles.some(t => !t || !int(t.id, 0, n - 1) || typeof t.text !== 'string') || new Set(r.tiles.map(t => t.id)).size !== n) return false;
    if (r.tiles.map(t => t.text).sort().join('|') !== [...target].sort().join('|')) return false;
    const used = r.slots.filter(id => id !== null);
    if (used.some(id => !int(id, 0, n - 1)) || new Set(used).size !== used.length) return false;
    if (new Set(r.fixed).size !== r.fixed.length || r.fixed.some(i => !int(i, 0, n - 1) || r.slots[i] === null || r.tiles.find(t => t.id === r.slots[i]).text !== target[i])) return false;
    if (!int(r.lives, 0, 3) || !int(r.mistakes, 0, 3) || !int(r.hints, 0, 3) || r.mistakes + r.hints + r.lives !== 3) return false;
    if (!int(r.freeHints ?? 0, 0, Math.max(1, Math.round(n * .2)))) return false;
    if (r.fixed.length !== (r.freeHints ?? 0) + r.hints - (r.phase === 'lost' && r.reason === 'hint' ? 1 : 0)) return false;
    if (MODES[mode].seconds ? !Number.isFinite(r.deadline) || r.deadline <= 0 : r.deadline !== null) return false;
    if (r.phase === 'playing' && r.lives === 0) return false;
    if (r.phase === 'won' && (r.lives === 0 || r.slots.some(id => id === null) || r.slots.map(id => r.tiles.find(t => t.id === id).text).join('') !== r.word || !p.results[r.level])) return false;
    if (r.phase === 'lost' && !['time', 'stars', 'hint', 'abandoned'].includes(r.reason)) return false;
    return true;
  }

  class Game {
    constructor({ storage, now = () => Date.now(), random = Math.random } = {}) {
      this.storage = storage;
      this.now = now;
      this.random = random;
      this.state = fresh();
      this.canSave = true;
      this.load();
      this.tick();
    }
    get mode() { return this.state.mode; }
    get config() { return MODES[this.mode]; }
    get progress() { return this.state.progress[this.mode]; }
    get round() { return this.progress.round; }
    get current() { return this.progress.current; }
    get unlocked() { return Math.min(Object.keys(this.progress.results).length, 59); }
    load() {
      if (!this.storage) { this.canSave = false; return; }
      try {
        const raw = this.storage.getItem(KEY);
        const v = raw ? JSON.parse(raw) : null;
        if (v?.version === 2) {
          this.state.sound = v.sound === true;
          this.state.mode = Object.hasOwn(MODES, v.mode) ? v.mode : 'medium';
          this.state.migrated = v.migrated === true;
          for (const mode of Object.keys(MODES)) {
            const source = v.progress?.[mode];
            if (!source) continue;
            const p = this.state.progress[mode];
            for (let i = 0; i < 60; i++) {
              const result = source.results?.[i];
              if (!result || !int(result.stars, 1, 3) || result.points !== result.stars * 50 * MODES[mode].multiplier) break;
              p.results[i] = { stars: result.stars, points: result.points };
            }
            p.current = int(source.current, 0, Math.min(Object.keys(p.results).length, 59)) ? source.current : 0;
            p.attempts = int(source.attempts, 0, 1000000) ? source.attempts : 0;
            p.seen = Array.isArray(source.seen) ? source.seen.filter(w => byWord.has(w)).slice(-WORDS.length) : [];
            if (validRound(source.round, mode, p)) {
              p.round = source.round;
              // Remove automatic letters from unfinished saved attempts, keeping paid hints and the clock.
              if (p.round.phase === 'playing' && p.round.freeHints > 0) {
                const count = p.round.freeHints;
                for (let i = 0; i < count; i++) p.round.slots[i] = null;
                p.round.fixed = p.round.fixed.filter(i => i >= count);
                p.round.freeHints = 0;
                p.round.message = '';
              }
            }
          }
        } else if (!raw) {
          // Preserve the original, untimed progress under Lahko; do not modify the v1 backup.
          const old = JSON.parse(this.storage.getItem('rijec-po-rijec-v1') || 'null');
          if (old) {
            const p = this.state.progress.easy;
            this.state.sound = old.sound === true;
            for (let i = 0; i < 60; i++) {
              const stars = old.results?.[i];
              if (!int(stars, 1, 3)) break;
              p.results[i] = { stars, points: stars * 50 };
            }
            p.current = Math.min(Object.keys(p.results).length, 59);
            this.state.migrated = Object.keys(p.results).length > 0;
          }
        }
      } catch { this.canSave = false; }
    }
    save() {
      try {
        if (!this.storage) throw new Error('Storage unavailable');
        this.storage.setItem(KEY, JSON.stringify(this.state));
        this.canSave = true;
      } catch { this.canSave = false; }
    }
    setMode(mode) {
      if (!Object.hasOwn(MODES, mode) || mode === this.mode) return false;
      this.tick();
      this.state.mode = mode;
      this.tick();
      this.save();
      return true;
    }
    setLevel(level) {
      this.tick();
      if (!int(level, 0, this.unlocked) || this.round?.phase === 'playing') return false;
      this.progress.current = level;
      this.progress.round = null;
      this.save();
      return true;
    }
    begin() {
      this.tick();
      if (this.round?.phase === 'playing') return false;
      const p = this.progress, last = p.round?.word || p.seen.at(-1);
      const pool = WORDS.filter(w => w.band === this.config.bands[Math.floor(p.current / 10)]);
      let options = pool.filter(w => !p.seen.includes(w.word) && w.word !== last);
      if (!options.length) {
        p.seen = p.seen.filter(word => !pool.some(w => w.word === word));
        options = pool.filter(w => w.word !== last);
      }
      const chosen = options[Math.floor(this.random() * options.length)];
      p.seen.push(chosen.word);
      const parts = splitWord(chosen.word);
      let arrangement = shuffle(parts, this.random);
      if (arrangement.join('') === chosen.word) arrangement = [...parts.slice(1), parts[0]];
      p.attempts++;
      p.round = { level: p.current, word: chosen.word, phase: 'playing', lives: 3, hints: 0, mistakes: 0, freeHints: 0,
        tiles: arrangement.map((text, id) => ({ text, id })), slots: Array(parts.length).fill(null), fixed: [],
        deadline: this.config.seconds ? this.now() + this.config.seconds * 1000 : null,
        reason: null, message: '', earned: 0, remainingMs: null };
      this.save();
      return true;
    }
    remaining() { return this.round?.deadline === null || !this.round ? null : Math.max(0, this.round.deadline - this.now()); }
    tick() {
      if (this.round?.phase === 'playing' && this.round.deadline !== null && this.now() >= this.round.deadline) {
        this.lose('time');
        return true;
      }
      return false;
    }
    active() { this.tick(); return this.round?.phase === 'playing'; }
    lose(reason) {
      if (this.round?.phase !== 'playing') return;
      this.round.phase = 'lost';
      this.round.reason = reason;
      this.round.remainingMs = this.remaining();
      this.round.message = reason === 'time' ? 'Vrijeme je isteklo.' : reason === 'abandoned' ? 'Pokušaj je prekinut.' : 'Potrošene su sve zvjezdice.';
      this.save();
    }
    abandon() { if (!this.active()) return false; this.lose('abandoned'); return true; }
    select(id) {
      if (!this.active()) return false;
      const r = this.round, pos = r.slots.indexOf(null);
      if (pos < 0 || !r.tiles.some(t => t.id === id) || r.slots.includes(id)) return false;
      r.slots[pos] = id;
      r.message = '';
      this.check();
      this.save();
      return true;
    }
    remove(index) {
      if (!this.active() || !int(index, 0, this.round.slots.length - 1) || this.round.fixed.includes(index)) return false;
      this.round.slots[index] = null;
      this.round.message = '';
      this.save();
      return true;
    }
    undo() {
      if (!this.active()) return false;
      const r = this.round;
      for (let i = r.slots.length - 1; i >= 0; i--) if (r.slots[i] !== null && !r.fixed.includes(i)) return this.remove(i);
      return false;
    }
    clear() {
      if (!this.active()) return false;
      this.round.slots = this.round.slots.map((id, i) => this.round.fixed.includes(i) ? id : null);
      this.round.message = '';
      this.save();
      return true;
    }
    shuffle() {
      if (!this.active()) return false;
      this.round.tiles = shuffle(this.round.tiles, this.random);
      this.round.message = 'Novi raspored. Vrijeme i zvjezdice ostaju isti.';
      this.save();
      return true;
    }
    check() {
      if (!this.active()) return;
      const r = this.round;
      if (r.slots.includes(null)) return;
      if (r.slots.map(id => r.tiles.find(t => t.id === id).text).join('') === r.word) {
        r.phase = 'won';
        r.remainingMs = this.remaining();
        const points = r.lives * 50 * this.config.multiplier;
        const previous = this.progress.results[r.level]?.points || 0;
        r.earned = Math.max(0, points - previous);
        if (points > previous) this.progress.results[r.level] = { stars: r.lives, points };
        r.message = 'Tačno! ' + r.word + '.';
      } else {
        r.lives--;
        r.mistakes++;
        if (r.lives === 0) this.lose('stars');
        else {
          r.slots = r.slots.map((id, i) => r.fixed.includes(i) ? id : null);
          r.message = 'Netačno. −1 ★. Probaj ponovo.';
        }
      }
    }
    hint() {
      if (!this.active()) return false;
      const r = this.round;
      r.lives--;
      r.hints++;
      if (r.lives === 0) { this.lose('hint'); return true; }
      const target = splitWord(r.word);
      let pos = target.findIndex((ch, i) => !r.fixed.includes(i) && (r.slots[i] === null || r.tiles.find(t => t.id === r.slots[i]).text !== ch));
      if (pos < 0) pos = target.findIndex((_, i) => !r.fixed.includes(i));
      const letter = r.tiles.find(t => t.text === target[pos] && !r.fixed.some(i => r.slots[i] === t.id));
      const other = r.slots.indexOf(letter.id);
      if (other >= 0 && other !== pos) r.slots[other] = r.slots[pos];
      r.slots[pos] = letter.id;
      r.fixed.push(pos);
      r.message = 'Otkriveno slovo ' + target[pos] + '. −1 ★.';
      this.check();
      this.save();
      return true;
    }
    next() {
      if (this.round?.phase !== 'won' || this.current >= 59) return false;
      this.progress.current++;
      this.progress.round = null;
      return this.begin();
    }
    view() {
      this.tick();
      const r = this.round, entry = r && byWord.get(r.word);
      return { mode: this.mode, config: this.config, current: this.current, unlocked: this.unlocked,
        round: r, category: entry?.category || '', clue: (this.mode === 'hard' ? entry?.clue : entry?.description) || '', remaining: this.remaining(),
        results: this.progress.results, totalStars: Object.values(this.progress.results).reduce((a, x) => a + x.stars, 0),
        totalPoints: Object.values(this.progress.results).reduce((a, x) => a + x.points, 0) };
    }
  }
  return { Game, MODES, KEY, WORDS, splitWord, validRound };
});
