// Logique pure (regles + solveur), partagee navigateur / node.
// Legende : # mur, . sol, @ depart, * gemme, E sortie, o rocher, c caisse, ~ lave, = eau,
//           > < v ^ statue qui tire des fleches dans cette direction, espace = vide,
//           r b cles rouge / bleue, R B portes, _ plaque de pression, G grille,
//           i glace, 1 2 teleporteurs (par paires), % dalle fragile
(function (root) {
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const SHOOT = { '>': 0, '<': 1, 'v': 2, '^': 3 };

  const MAPS = [
    ['#######',
     '#@.*..#',
     '#.##..#',
     '#*..*E#',
     '#######'],
    ['########',
     '#@.o~*E#',
     '#...####',
     '########'],
    ['#########',
     '#@.....*#',
     '#..c.o..#',
     '#.......#',
     '#=======#',
     '#..*...E#',
     '#########'],
    ['##########',
     '#@.......#',
     '#..c..o..#',
     '#........#',
     '###=##~###',
     '#*..#...*#',
     '#...#..E.#',
     '##########'],
    ['#########',
     '#@..#..E#',
     '#.o.#.*.#',
     '#...~...#',
     '#.*.#...#',
     '#########'],
    ['#####v###',
     '#@......#',
     '#.c....*#',
     '#......E#',
     '#########'],
    ['###########',
     '#.........#',
     '#@..o.....#',
     '#...o.#####',
     '#.....~~*E#',
     '###########'],
    ['###########',
     '#*..#...*.#',
     '#.o.~.c...#',
     '#...#.....#',
     '#@..#==####',
     '#...#..*E.#',
     '###########'],
    ['#####v#####',
     '#@........#',
     '#..o...c..#',
     '>.....*...#',
     '#..c......#',
     '#........E#',
     '###########'],
    // --- cles et portes ---
    ['#########',
     '#@..#..*#',
     '#.r.R...#',
     '#...#..E#',
     '#########'],
    ['#############',
     '#*..#.r.#.r.#',
     '#...R.@.R..r#',
     '#...#...#.b.#',
     '#####B###R###',
     '#####...#...#',
     '#####.*.#.E.#',
     '#####...#..*#',
     '#############'],
    // --- plaques et grilles ---
    ['#########',
     '#@..#..*#',
     '#.c.G...#',
     '#._.#..E#',
     '#########'],
    ['###########',
     '#@..#...#*#',
     '#.o.G..~..#',
     '#._.#...#E#',
     '#.c.=..*###',
     '#...#######',
     '###########'],
    // --- glace ---
    ['#########',
     '#@.iiii*#',
     '#..iiii.#',
     '#*.iiiiE#',
     '#########'],
    ['#######*###',
     '#@..iiiii##',
     '#.o.iiiii##',
     '#...iiiii##',
     '#######E###'],
    // --- teleporteurs ---
    ['#########',
     '#@.1#1.*#',
     '#...#..E#',
     '#########'],
    ['###########',
     '#@.2#2#####',
     '#.o1#.1~*E#',
     '#...#######',
     '###########'],
    // --- dalles fragiles ---
    ['#######',
     '#@%%*%#',
     '#%#%#%#',
     '#*%%%*#',
     '#%#%#%#',
     '#%%*%E#',
     '#######'],
    ['###########',
     '#@.r#1..b.#',
     '#...#.%%%.#',
     '#.1.R.%*%.#',
     '#...#.%%%.#',
     '#...#....B#',
     '#...#####E#',
     '###########'],
    // --- grands niveaux ---
    ['###v####v###',
     '#@...o.....#',
     '#.o...c....#',
     '#..........#',
     '#########=##',
     '#*........E#',
     '############'],
    ['############',
     '#*~........#',
     '###.o.c.c..#',
     '#@.........#',
     '#####=######',
     '#####=######',
     '#....*...E.#',
     '############'],
    ['###########',
     '#.........#',
     '#@.c.o.c..#',
     '#.........#',
     '##~###=####',
     '#...#.....#',
     '#.*.=..*.E#',
     '###########'],
    ['#############',
     '#@..#...#..*#',
     '#.o.~.c.#.o.#',
     '#...#.c.=...#',
     '##=###~###~##',
     '#...#...#...#',
     '#.c.=.*.~.E.#',
     '#*..#...#...#',
     '#############'],
    ['#############',
     '#*..#*..#...#',
     '#.o.=...~.E.#',
     '#...#...#...#',
     '##=###=###=##',
     '#.c.#...#...#',
     '#.o.~.c.~.o.#',
     '#@..#...#..*#',
     '#############'],
    ['#############',
     '#*..#...#..E#',
     '#.o.=...#...#',
     '#...#...#...#',
     '##=###~###~##',
     '#.c.#...#.o.#',
     '#...~o@c=...#',
     '#...#...#...#',
     '##~###=###=##',
     '#...#...#...#',
     '#.c.~...#...#',
     '#*..#...#..*#',
     '#############'],
    ['#############',
     '#@..#.r.#..*#',
     '#.o.~.c.=...#',
     '#...#...#..b#',
     '##R###B######',
     '#...#*..#####',
     '#.o.=.o.#####',
     '#...#...#####',
     '##~###.######',
     '#...#._.#...#',
     '#.c.=...G.E.#',
     '#*..#...#...#',
     '#############'],
    ['#############',
     '#...#...#..*#',
     '#.E.#.o.#...#',
     '#...#...#...#',
     '##B###R###~##',
     '#...#...#...#',
     '#.o.=c@c=...#',
     '#...#...#...#',
     '##~###~######',
     '#...#...#..b#',
     '#.o.~.c.=...#',
     '#*.r#...#..*#',
     '#############'],
    ['###########',
     '#@..iiii~*#',
     '#.ociiii###',
     '#...iiii=E#',
     '###########'],
    ['##############',
     '#*~.o...######',
     '###.o.c.G.=*E#',
     '#@..._..######',
     '##############'],
    ['#############',
     '#*.r#r.b#b.r#',
     '#...R...B...#',
     '#...#...#...#',
     '######R###B##',
     '#####.r.#..*#',
     '#####.@.#...#',
     '#####...#...#',
     '######R###R##',
     '#####...#...#',
     '#####.*.#.E.#',
     '#####...#...#',
     '#############'],
    ['#############',
     '#@.r#.._.####',
     '#.c.#.1..G*E#',
     '#..1R....####',
     '#############'],
    ['#############',
     '#@..#..r#..*#',
     '#_o.~.c.R.o.#',
     '#...#...#...#',
     '##G###=###~##',
     '#..b#...#...#',
     '#...#.*.B.c.#',
     '#*..#...#...#',
     '##########=##',
     '#########...#',
     '#########.E.#',
     '#########...#',
     '#############'],
    // --- labyrinthes trouves par recherche automatique (glace, dalles fragiles, melange) ---
    ['##########',
     '#iE##i.i*#',
     '##ii#iiii#',
     '#i#ii*#ii#',
     '#@##ii#i##',
     '#i.ii#*ii#',
     '#iii###ii#',
     '##########'],
    ['############',
     '#ii#*i#iii##',
     '#iiiii#ii.i#',
     '#i.##iEii#*#',
     '##ii.iii#ii#',
     '#i#*iiiii###',
     '#iiii.*i@ii#',
     '#iiiiiiii#i#',
     '############'],
    ['########',
     '#..*%%%#',
     '#E%#%%*#',
     '#*#%%%##',
     '#%%%%%%#',
     '#%*.#%@#',
     '########'],
    ['#########',
     '#%%%%%E*#',
     '##%@###%#',
     '#%%%#%%##',
     '#%#%%%%%#',
     '#%*#%%%*#',
     '#%*%.%*##',
     '#########'],
    ['##########',
     '#*iii##i%#',
     '#.##i.1%.#',
     '#iE.%*#.%#',
     '#i..1#iii#',
     '#.#%i%%#.#',
     '#i%.@##.*#',
     '##########'],
  ];
  // Nombre minimal de coups, calcule par solve() et verifie par test.js.
  const PARS = [10, 5, 18, 25, 14, 10, 22, 20, 20, 10, 50, 10, 24, 8, 6, 5, 11, 16, 14, 39, 41, 34, 54, 58, 68, 60, 92, 18, 24, 54, 19, 56, 26, 24, 24, 26, 24];

  const cache = {};
  const level = n => cache[n] || (cache[n] = parse(MAPS[n], PARS[n]));
  function parse(rows, par) {
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    const lv = { w, h, tiles: [], items: [], itemAt: {}, gems: [], gemMask: 0, objs: {}, shooters: [], shootAt: {},
      plates: [], doors: { r: [], b: [] }, twin: {}, start: 0, par: par || 0 };
    const tele = {};
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const ch = rows[y][x] || ' ', c = y * w + x;
      let t = '.';
      if ('# ~=EiG_RB%12'.includes(ch)) t = ch;
      else if (ch in SHOOT) { t = '#'; lv.shootAt[c] = SHOOT[ch]; lv.shooters.push({ c, d: SHOOT[ch] }); }
      else if (ch === '@') lv.start = c;
      else if (ch === '*' || ch === 'r' || ch === 'b') {
        if (ch === '*') { lv.gems.push(c); lv.gemMask |= 1 << lv.items.length; }
        lv.itemAt[c] = lv.items.length; lv.items.push({ c, t: ch });
      }
      else if (ch === 'o' || ch === 'c') lv.objs[c] = ch;
      if (t === '_') lv.plates.push(c);
      if (t === 'R' || t === 'B') lv.doors[t.toLowerCase()].push(c);
      if (t === '1' || t === '2') { if (t in tele) { lv.twin[c] = tele[t]; lv.twin[tele[t]] = c; } else tele[t] = c; }
      lv.tiles[c] = t;
    }
    return lv;
  }

  // Etat : p = case du joueur, g = masque des objets a ramasser restants (gemmes et cles),
  // o = objets poussables {case: 'o'|'c'}, f = cases transformees {case: 1} :
  // liquide comble, porte ouverte ou dalle effondree selon la tuile.
  const init = lv => ({ p: lv.start, g: (1 << lv.items.length) - 1, o: lv.objs, f: {}, push: null, path: [], dead: null });
  const won = (lv, s) => !s.dead && (s.g & lv.gemMask) === 0 && lv.tiles[s.p] === 'E';
  const isDoor = t => t === 'R' || t === 'B';
  const hasItem = (lv, g, c) => lv.itemAt[c] !== undefined && ((g >> lv.itemAt[c]) & 1) === 1;
  // Toutes les plaques enfoncees, par un objet ou par le joueur en p ?
  const pressed = (lv, o, p) => lv.plates.length > 0 && lv.plates.every(c => p === c || o[c]);
  const gatesOpen = (lv, s) => pressed(lv, s.o, s.p);
  // Cles d'une couleur en poche : ramassees moins utilisees.
  const keysHeld = (lv, s, col) =>
    lv.items.filter((it, i) => it.t === col && !((s.g >> i) & 1)).length - lv.doors[col].filter(c => s.f[c]).length;
  // Infranchissable quoi qu'il arrive : mur, vide, liquide non comble, trou.
  function fixed(lv, f, c) {
    const t = lv.tiles[c];
    return t === '#' || t === ' ' || ((t === '~' || t === '=') && !f[c]) || (t === '%' && !!f[c]);
  }

  // Cases balayees par une statue : en ligne droite jusqu'au premier mur, objet, porte ou grille fermee.
  function line(lv, s, sh) {
    const [dx, dy] = DIRS[sh.d], out = [];
    let x = sh.c % lv.w + dx, y = ((sh.c / lv.w) | 0) + dy;
    while (x >= 0 && y >= 0 && x < lv.w && y < lv.h) {
      const c = y * lv.w + x, t = lv.tiles[c];
      if (t === '#' || t === ' ' || s.o[c] || (isDoor(t) && !s.f[c]) || (t === 'G' && !gatesOpen(lv, s))) break;
      out.push(c); x += dx; y += dy;
    }
    return out;
  }
  const hit = (lv, s) => lv.shooters.find(sh => line(lv, s, sh).includes(s.p)) || null;

  // Un coup dans la direction d. Renvoie le nouvel etat, ou null si le coup est impossible.
  // - Rocher dans la lave et caisse dans l'eau comblent la case ; l'inverse detruit l'objet.
  // - Sur la glace, joueur et objets glissent jusqu'au premier obstacle.
  // - Un teleporteur envoie sur son jumeau si celui-ci est libre.
  // - Une dalle fragile s'effondre quand le joueur la quitte.
  // path = cases traversees par le joueur ; dead = statue qui le touche, sinon null.
  function step(lv, s, d) {
    const w = lv.w, [dx, dy] = DIRS[d];
    const nb = c => { const x = c % w + dx, y = ((c / w) | 0) + dy; return x < 0 || y < 0 || x >= w || y >= lv.h ? -1 : y * w + x; };
    let o = s.o, f = s.f, g = s.g, push = null;
    const c0 = nb(s.p);
    if (c0 < 0 || fixed(lv, f, c0)) return null;

    if (o[c0]) { // pousser l'objet, qui glisse tant qu'il est sur la glace
      const kind = o[c0];
      o = Object.assign({}, o); delete o[c0];
      let pos = c0, fate = 'move', tp = false;
      for (;;) {
        const n = nb(pos), t = n < 0 ? '#' : lv.tiles[n];
        if (t === '#' || t === ' ' || t === 'E' || o[n] || hasItem(lv, g, n) || (isDoor(t) && !f[n])
          || (t === '%' && f[n]) || (t === 'G' && !pressed(lv, o, s.p))) break;
        pos = n;
        if ((t === '~' || t === '=') && !f[n]) {
          if ((kind === 'o') === (t === '~')) { f = Object.assign({}, f, { [n]: 1 }); fate = 'fill'; } else fate = 'lost';
          break;
        }
        const q = lv.twin[n];
        if (q !== undefined && !o[q] && q !== s.p) { pos = q; tp = true; break; }
        if (t !== 'i') break;
      }
      if (pos === c0) return null;
      if (fate === 'move') o[pos] = kind;
      push = { from: c0, to: pos, kind, fate, tp };
    }

    const path = [];
    let pos = s.p, c = c0, dead = null;
    for (;;) {
      const t = lv.tiles[c], first = !path.length;
      if (!first && (fixed(lv, f, c) || o[c])) break; // en glissade, tout obstacle arrete
      if (isDoor(t) && !f[c]) {
        if (!first || keysHeld(lv, { g, f }, t.toLowerCase()) < 1) break;
        f = Object.assign({}, f, { [c]: 1 });
      }
      if (t === 'G' && !pressed(lv, o, -1)) break;
      if (lv.tiles[pos] === '%') f = Object.assign({}, f, { [pos]: 1 });
      pos = c; path.push(c);
      if (hasItem(lv, g, c)) g &= ~(1 << lv.itemAt[c]);
      const q = lv.twin[c], tele = q !== undefined && !o[q];
      if (tele) { pos = q; path.push(q); }
      dead = hit(lv, { p: pos, o, f });
      if (dead || tele || lv.tiles[pos] !== 'i') break;
      c = nb(pos);
      if (c < 0) break;
    }
    if (!path.length) return null;
    return { p: pos, g, o, f, push, path, dead };
  }

  const key = s => s.p + '|' + s.g + '|' + Object.keys(s.o).map(k => k + s.o[k]).join() + '|' + Object.keys(s.f).join();

  // BFS : nombre minimal de coups, -1 si insoluble (ou au-dela de max etats).
  function solve(lv, max = 3e6) {
    let cur = [init(lv)], depth = 0;
    const seen = new Set([key(cur[0])]);
    while (cur.length) {
      const next = [];
      for (const s of cur) {
        if (won(lv, s)) return depth;
        for (let d = 0; d < 4; d++) {
          const n = step(lv, s, d);
          if (!n || n.dead) continue;
          const k = key(n);
          if (seen.has(k)) continue;
          if (seen.size >= max) return -1;
          seen.add(k); next.push(n);
        }
      }
      cur = next; depth++;
    }
    return -1;
  }

  const api = { DIRS, level, parse, init, step, won, line, gatesOpen, keysHeld, solve, COUNT: MAPS.length };
  if (typeof module !== 'undefined') module.exports = api; else root.GemLogic = api;
})(this);
