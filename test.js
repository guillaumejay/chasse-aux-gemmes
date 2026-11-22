// node test.js : regles de poussee + chaque niveau est resoluble, au nombre de pas annonce.
const assert = require('assert');
const L = require('./logic.js');

// niveau 2 : @.o~*E -> le rocher comble la lave
const lv = L.level(1);
let s = L.init(lv);
assert.strictEqual(L.step(lv, s, 3), null, 'mur');
s = L.step(lv, s, 0);
assert.strictEqual(s.push, null);
s = L.step(lv, s, 0);
assert.strictEqual(s.push.fate, 'fill');
assert.strictEqual(Object.keys(s.o).length, 0);
s = L.step(lv, s, 0); s = L.step(lv, s, 0);
assert(!L.won(lv, s) && s.g === 0);
s = L.step(lv, s, 0);
assert(L.won(lv, s));

// niveau 6 : la statue tire vers le bas dans la colonne 5
const la = L.level(5);
let a = L.init(la);
for (let i = 0; i < 3; i++) { a = L.step(la, a, 0); assert.strictEqual(a.dead, null); }
a = L.step(la, a, 0);
assert(a.dead && a.dead.d === 2, 'fleche attendue');

const pars = [];
for (let n = 0; n < L.COUNT; n++) {
  const l = L.level(n), p = L.solve(l);
  assert(p > 0, 'niveau ' + (n + 1) + ' insoluble');
  if (l.par) assert.strictEqual(p, l.par, 'par du niveau ' + (n + 1));
  pars.push(p);
}
console.log('OK', L.COUNT, 'niveaux, pas minimaux : [' + pars.join(', ') + ']');
