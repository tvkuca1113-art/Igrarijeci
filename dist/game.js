const ICONS={volume:'<path d="m11 5-6 4H2v6h3l6 4z"/><path d="M15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4z"/><path d="m16 9 5 6m0-6-5 6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01"/>',sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Zm7-2v4m-2-2h4"/>',shuffle:'<path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 4-2 5-5m3-4c1-2 2-3 4-3h3m-4-4 4 4-4 4"/>',undo:'<path d="m9 4-6 6 6 6M3 10h12a6 6 0 0 1 0 12"/>',bulb:'<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 15h10"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',check:'<path d="m5 12 4 4L19 6"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const $=id=>document.getElementById(id);
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||'')+'</svg>';}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));

const CHAPTERS = ['Zagrijavanje', 'Hvataj ritam', 'Oštri um', 'Viši izazov', 'Korak više', 'Majstor riječi'];
let storage;
try { storage = window.localStorage; } catch { storage = null; }
const game = new RPR.Game({ storage });
let audioCtx, pendingKey = '', previousPhase = '', lastTimerAnnouncement = -1;

function tone(won = false) {
  if (!game.state.sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
    const now = audioCtx.currentTime;
    (won ? [523.25, 659.25, 783.99] : [440]).forEach((frequency, i) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination); osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now + i * .12);
      gain.gain.linearRampToValueAtTime(.06, now + i * .12 + .01);
      gain.gain.exponentialRampToValueAtTime(.001, now + i * .12 + .16);
      osc.start(now + i * .12); osc.stop(now + i * .12 + .18);
    });
  } catch { /* Sound is optional. */ }
}

function renderClock() {
  const r = game.round, timed = game.config.seconds !== null;
  $('clock').hidden = !timed;
  if (!timed) return;
  const ms = r ? (r.phase === 'playing' ? game.remaining() : r.remainingMs ?? game.config.seconds * 1000) : game.config.seconds * 1000;
  const seconds = Math.ceil(ms / 1000);
  $('clock-value').textContent = seconds + ' s';
  $('clock-progress').max = game.config.seconds;
  $('clock-progress').value = ms / 1000;
  $('clock').classList.toggle('urgent', seconds <= 5 && r?.phase === 'playing');
  if (r?.phase === 'playing' && seconds <= 5 && lastTimerAnnouncement !== 5) {
    $('announcer').textContent = 'Još pet sekundi.';
    lastTimerAnnouncement = 5;
  }
}

function renderBoard(r) {
  const active = r.phase === 'playing', n = r.slots.length;
  const focus = document.activeElement?.dataset;
  const focusKind = focus?.slot !== undefined ? 'slot' : focus?.tile !== undefined ? 'tile' : null;
  const focusIndex = focusKind ? focus[focusKind] : null;
  for (const id of ['answer', 'letters']) {
    const row = $(id);
    row.innerHTML = '';
    row.className = 'tile-row ' + (id === 'answer' ? 'answer-row' : 'letter-row') + (n > 5 ? ' long' : '');
    row.style.setProperty('--columns', n > 10 ? Math.ceil(n / 2) : n);
    row.style.setProperty('--mobile-columns', n > 10 ? Math.ceil(n / 3) : n > 5 ? Math.ceil(n / 2) : n);
  }
  r.slots.forEach((id, i) => {
    const b = document.createElement('button');
    b.className = 'tile answer-tile' + (id !== null ? ' filled' : '') + (r.fixed.includes(i) ? ' locked' : '');
    b.style.setProperty('--i', i); b.dataset.slot = String(i);
    b.textContent = id === null ? '' : r.tiles.find(t => t.id === id).text;
    b.setAttribute('aria-label', 'Polje ' + (i + 1) + ': ' + (b.textContent || 'prazno') + (r.fixed.includes(i) ? ', otkriveno' : ''));
    b.disabled = !active || r.fixed.includes(i) || id === null;
    b.onclick = () => act(() => game.remove(i));
    $('answer').append(b);
  });
  r.tiles.forEach(t => {
    const used = r.slots.includes(t.id), b = document.createElement('button');
    b.className = 'tile letter-tile' + (used ? ' used' : '');
    b.dataset.tile = String(t.id); b.textContent = t.text;
    b.style.setProperty('--tilt', ((t.id % 3) - 1) * 2 + 'deg');
    b.setAttribute('aria-label', 'Slovo ' + t.text);
    b.disabled = used || !active;
    b.onclick = () => { act(() => game.select(t.id)); tone(); };
    $('letters').append(b);
  });
  if (active && focusKind) {
    const old = document.querySelector('[data-' + focusKind + '="' + focusIndex + '"]');
    const target = old && !old.disabled ? old : document.querySelector('#letters button:not(:disabled)');
    target?.focus({ preventScroll: true });
  }
  $('message').textContent = pendingKey ? pendingKey + '… Upiši drugi znak ili pritisni Enter.' : r.message;
  $('message').className = 'message' + (r.phase === 'won' ? ' positive' : '');
  $('hint').disabled = !active;
  $('hint').setAttribute('aria-label', r.lives === 1 ? 'Otkrij slovo: troši posljednju zvjezdicu i završava pokušaj' : 'Otkrij slovo: troši jednu zvjezdicu');
  $('shuffle').disabled = !active;
  $('undo').disabled = !active || !r.slots.some((id, i) => id !== null && !r.fixed.includes(i));
  $('abandon').hidden = !active;
  $('lives-warning').hidden = !active || r.lives !== 1;
  $('tap-tip').textContent = active ? (r.lives === 1 ? 'Još jedan pokušaj. Pažljivo biraj slova.' : 'Pogrešna riječ ili pomoć troši jednu ★.') : r.phase === 'won' ? 'Nivo je osvojen.' : 'Novi pokušaj donosi drugu riječ.';
}

function renderProgress(v) {
  const count = Object.keys(v.results).length;
  $('journey-heading').textContent = 'Tvoj put · ' + v.config.label;
  $('total-stars').textContent = v.totalStars;
  $('total-points').textContent = v.totalPoints.toLocaleString('bs');
  $('progress-label').textContent = count + ' / 60';
  $('progress').value = count;
  $('progress').textContent = count + ' / 60';
  $('chapters').innerHTML = '';
  const playing = v.round?.phase === 'playing';
  CHAPTERS.forEach((name, c) => {
    const first = c * 10, done = Array.from({ length: 10 }, (_, i) => v.results[first + i]).filter(Boolean).length;
    const locked = first > v.unlocked, b = document.createElement('button');
    b.className = 'chapter' + (Math.floor(v.current / 10) === c ? ' current' : '') + (locked ? ' locked' : '') + (done === 10 ? ' complete' : '');
    b.disabled = locked || playing;
    b.setAttribute('aria-label', name + ', nivoi ' + (first + 1) + ' do ' + (first + 10) + (locked ? ', zaključano' : ''));
    b.innerHTML = '<span class="chapter-symbol">' + (done === 10 ? icon('check') : String(c + 1).padStart(2, '0')) + '</span><span class="chapter-copy"><strong>' + name + '</strong><small>Nivoi ' + (first + 1) + '–' + (first + 10) + ' · ' + done + '/10</small></span>' + icon(locked ? 'lock' : 'arrow');
    b.onclick = () => openLevels(c);
    $('chapters').append(b);
  });
  $('levels').disabled = playing;
  $('levels').title = playing ? 'Završi ili prekini trenutni pokušaj.' : '';
}

function render() {
  const v = game.view(), r = v.round, phase = r?.phase || 'ready';
  document.body.classList.toggle('round-active', phase === 'playing');
  if (phase !== 'playing') pendingKey = '';
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === v.mode)));
  $('mode-note').textContent = r?.phase === 'playing' ? 'Promjena težine ne zaustavlja vrijeme ovog pokušaja.' : game.state.migrated ? 'Stari rezultati sačuvani su pod Lahko. Svaka težina ima svoj napredak.' : 'Napredak se čuva zasebno za svaku težinu.';
  $('level-label').textContent = 'NIVO ' + String(v.current + 1).padStart(2, '0');
  $('difficulty').textContent = v.config.label;
  const lives = r?.lives ?? 3;
  $('round-stars').innerHTML = [0, 1, 2].map(i => '<span' + (i >= lives ? ' class="dim"' : '') + '>★</span>').join(' ');
  $('round-stars').setAttribute('aria-label', 'Preostale zvjezdice: ' + lives + ' od 3');
  $('ready-panel').hidden = !!r;
  $('board').hidden = !r;
  $('category').textContent = !r ? CHAPTERS[Math.floor(v.current / 10)].toLocaleUpperCase('bs') : v.category.toLocaleUpperCase('bs');
  $('question').textContent = !r ? 'Spreman za izazov?' : 'Koju riječ tražimo?';
  $('clue').textContent = r ? v.clue : '';
  $('clue').hidden = !r;
  $('ready-copy').textContent = v.mode === 'easy' ? 'Tri zvjezdice. Bez odbrojavanja. Jasniji opis kao trag.' : 'Tri zvjezdice. ' + v.config.seconds + (v.config.seconds === 24 ? ' sekunde.' : ' sekundi.') + ' Opis ti pomaže. Sat kreće na tvoj znak.';
  $('start').innerHTML = 'Pokreni nivo' + (v.config.seconds ? ' · ' + v.config.seconds + ' s' : '') + ' ' + icon('arrow');
  $('game').classList.toggle('solved', phase === 'won');
  $('game').classList.toggle('lost', phase === 'lost');
  $('word-length').textContent = r ? r.slots.length + ' slova' : '60 nivoa';
  $('success').hidden = phase !== 'won' && phase !== 'lost';
  $('success').classList.toggle('failure', phase === 'lost');
  if (r) renderBoard(r);
  if (phase === 'won') {
    $('success-kicker').textContent = 'NIVO JE OSVOJEN';
    $('success-title').textContent = v.current === 59 ? 'Svih 60. Svaka čast!' : 'Riječ je osvojena.';
    $('reward').textContent = 'Preostalo ' + lives + ' ★ · ' + (r.earned ? '+' + r.earned + ' bodova' : 'Najbolji rezultat je sačuvan');
    $('next').innerHTML = (v.current === 59 ? 'Pogledaj sve nivoe' : 'Sljedeći nivo') + ' ' + icon('arrow');
  } else if (phase === 'lost') {
    $('success-kicker').textContent = 'POKUŠAJ NIJE USPIO';
    $('success-title').textContent = r.reason === 'time' ? 'Vrijeme je isteklo.' : r.reason === 'abandoned' ? 'Pokušaj je prekinut.' : 'Nema više zvjezdica.';
    $('reward').textContent = 'Riječ je bila ' + r.word + '. Isti nivo, druga riječ i nove 3 ★.';
    $('next').innerHTML = 'Pokušaj s novom riječju ' + icon('arrow');
  }
  renderClock(); renderProgress(v);
  $('save-status').innerHTML = icon(game.canSave ? 'check' : 'help') + (game.canSave ? ' Napredak se čuva na ovom uređaju' : ' Čuvanje nije dostupno u ovom pregledniku');
  if ((phase === 'won' || phase === 'lost') && phase !== previousPhase) {
    pendingKey = '';
    $('announcer').textContent = $('success-title').textContent + ' ' + $('reward').textContent;
    if (!document.querySelector('dialog[open]')) $('next').focus({ preventScroll: false });
    if (phase === 'won') tone(true);
  }
  previousPhase = phase;
}

function act(fn, keepPending = false) {
  if (!keepPending) pendingKey = '';
  const result = fn();
  render();
  return result;
}
function focusGame() { $('game').scrollIntoView({ block: 'start', behavior: 'instant' }); $('game').focus({ preventScroll: true }); }
function start() { lastTimerAnnouncement = -1; act(() => game.begin()); focusGame(); }
function openLevels(chapter) {
  game.tick();
  if (game.round?.phase === 'playing') return;
  const root = $('level-grid'); root.innerHTML = '';
  CHAPTERS.forEach((name, c) => {
    const section = document.createElement('section'); section.className = 'level-section'; section.id = 'chapter-' + c;
    section.innerHTML = '<h3>' + String(c + 1).padStart(2, '0') + ' · ' + name + '</h3>';
    const grid = document.createElement('div'); grid.className = 'levels-grid';
    for (let i = c * 10; i < c * 10 + 10; i++) {
      const result = game.progress.results[i], b = document.createElement('button');
      b.className = 'level-button' + (result ? ' finished' : '') + (i === game.current ? ' active' : '');
      b.disabled = i > game.unlocked;
      b.setAttribute('aria-label', 'Nivo ' + (i + 1) + (result ? ', ' + result.stars + ' zvjezdice' : b.disabled ? ', zaključan' : ', otključan'));
      b.innerHTML = (i + 1) + (b.disabled ? icon('lock') : '<small>' + (result ? '★'.repeat(result.stars) : '•') + '</small>');
      b.onclick = () => { $('levels-dialog').close(); act(() => game.setLevel(i)); $('start').focus({ preventScroll: true }); };
      grid.append(b);
    }
    section.append(grid); root.append(section);
  });
  $('levels-dialog').showModal();
  if (Number.isInteger(chapter)) $('chapter-' + chapter).scrollIntoView({ block: 'start' });
}
function renderSound() {
  $('sound').innerHTML = icon(game.state.sound ? 'volume' : 'mute');
  $('sound').setAttribute('aria-label', game.state.sound ? 'Isključi zvuk' : 'Uključi zvuk');
  $('sound').setAttribute('aria-pressed', String(game.state.sound));
}
$('sound').onclick = () => { game.state.sound = !game.state.sound; game.save(); renderSound(); tone(); };
$('start').onclick = start;
$('shuffle').onclick = () => act(() => game.shuffle());
$('undo').onclick = () => act(() => game.undo());
$('hint').onclick = () => act(() => game.hint());
$('abandon').onclick = () => act(() => game.abandon());
$('next').onclick = () => {
  if (game.round?.phase === 'lost') start();
  else if (game.round?.phase === 'won' && game.current === 59) openLevels();
  else { lastTimerAnnouncement = -1; act(() => game.next()); focusGame(); }
};
$('levels').onclick = () => openLevels();
$('help').onclick = () => { pendingKey = ''; $('help-dialog').showModal(); };
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { lastTimerAnnouncement = -1; act(() => game.setMode(b.dataset.mode)); });
document.querySelectorAll('.close-dialog').forEach(b => b.onclick = () => b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d => {
  d.addEventListener('close', () => { render(); });
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
});

function freeTiles() { return game.round?.tiles.filter(t => !game.round.slots.includes(t.id)) || []; }
function flushPending() {
  const tile = freeTiles().find(t => t.text === pendingKey);
  pendingKey = '';
  if (tile) game.select(tile.id);
}
function typeLetter(key) {
  if (pendingKey) {
    const combined = freeTiles().find(t => t.text === pendingKey + key);
    if (combined) { pendingKey = ''; game.select(combined.id); render(); return; }
    flushPending();
    if (!game.active()) { render(); return; }
  }
  if (freeTiles().some(t => t.text.length === 2 && t.text.startsWith(key))) pendingKey = key;
  else {
    const tile = freeTiles().find(t => t.text === key);
    if (tile) game.select(tile.id);
  }
  render();
}
document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey || e.repeat || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (!game.active()) { if (game.round?.phase === 'lost' && previousPhase === 'playing') render(); return; }
  if (e.key === 'Backspace') { e.preventDefault(); if (pendingKey) { pendingKey = ''; render(); } else act(() => game.undo()); return; }
  if (e.key === 'Escape') { e.preventDefault(); act(() => game.clear()); return; }
  if (e.key === 'Enter' && pendingKey) { e.preventDefault(); flushPending(); render(); return; }
  if (e.key.length !== 1 || !/^[a-zčćšđž]$/i.test(e.key)) return;
  e.preventDefault(); typeLetter(e.key.toLocaleUpperCase('bs'));
});
const interval = window.setInterval(() => { if (game.tick()) render(); else renderClock(); }, 100);
document.addEventListener('visibilitychange', () => { if (game.tick()) render(); else renderClock(); });
window.addEventListener('pageshow', () => render());
window.addEventListener('pagehide', () => game.save());
renderSound(); render(); game.save();

if (document.modelContext?.registerTool) {
  const exposed = [
    { name: 'get_word_game_state', description: 'Read the visible game state and available tiles without revealing the solution.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => {
      const v = game.view(); render();
      return { mode: v.mode, level: v.current + 1, phase: v.round?.phase || 'ready', lives: v.round?.lives ?? 3,
        remainingSeconds: v.remaining === null ? null : Math.ceil(v.remaining / 1000),
        tiles: v.round?.tiles.map(t => ({ ...t, used: v.round.slots.includes(t.id) })) || [],
        category: v.round ? v.category : null, clue: v.round ? v.clue : null };
    } },
    { name: 'start_word_game_round', description: 'Start a ready or failed level. Draws a new word and starts the 24- or 12-second clock in timed modes.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false }, execute: () => {
      if (game.round && game.round.phase !== 'lost') throw new Error('Nivo nije spreman za novi pokušaj.');
      start(); return { started: true, level: game.current + 1, mode: game.mode };
    } },
    { name: 'place_word_game_tiles', description: 'Place available tiles in order. A wrong complete word costs a star; zero stars or timeout loses the attempt.', inputSchema: { type: 'object', properties: { tileIds: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 20 } }, required: ['tileIds'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: input => {
      const ids = input?.tileIds, r = game.round;
      if (!game.active()) { render(); throw new Error('Pokušaj nije aktivan.'); }
      if (!Array.isArray(ids) || !ids.length || ids.length > r.slots.filter(id => id === null).length || new Set(ids).size !== ids.length || ids.some(id => !Number.isInteger(id) || !r.tiles.some(t => t.id === id) || r.slots.includes(id))) throw new Error('Nevažeći ili zauzeti ID slova.');
      act(() => ids.forEach(id => game.select(id))); return { level: game.current + 1, phase: r.phase, lives: r.lives };
    } }
  ];
  for (const tool of exposed) try { Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {}); } catch { /* Optional browser API. */ }
}
