/* ROCE · Ayuda (asistente de la app): cuéntale qué te apetece o qué objetivo tienes (texto libre o respondiendo a unas preguntas).
   Funciona en el propio navegador (sin enviar nada a ningún servidor) con los datos reales de la carta: ingredientes, alérgenos y
   valores nutricionales (kcal, proteínas, hidratos y grasas) de cada plato, de los acompañamientos y de las proteínas extra.
   · Entiende objetivos con números («máx. 600 kcal y 40 g de proteína», «pocos hidratos», «post-entreno», «para dos, menos de 35 €»).
   · Combina el plato con los complementos que mejor encajan con el objetivo, respetando alérgenos, dieta, filtros y lo que hay disponible.
   · Contesta preguntas sobre un plato («¿cuántas calorías tiene el Chicken Joe?», «Terra o Liguria») y hace rankings («lo que más proteína tiene»). */
(function () {
  'use strict';
  function start() {
    var A = window.CARTA_API; if (!A) return;
    var T = {
      es: {
        btn: 'Ayuda', h: 'Ayuda', p: 'Cuéntame qué te apetece o qué objetivo tienes, y te preparo una propuesta con los números de la carta.',
        ph: 'Ej: algo con mucha proteína, máx. 600 kcal', ex_h: 'Ideas',
        ex: ['Máx. 600 kcal y 40 g de proteína', 'Post-entreno sin gluten', 'Pocos hidratos con aguacate', 'Para dos, menos de 35 €', '¿Cuántas calorías tiene el Chicken Joe?', 'Lo que más proteína tiene', 'Algo ligero y fresco', 'Un zumo para despertar'],
        q_what: 'Cuéntame qué te apetece', q_when: '¿Para cuándo?', opt: 'opcional', when: [['breakfast', 'Desayuno'], ['lunch', 'Comida'], ['drink', 'Solo bebida']],
        q_goal: '¿Tienes algún objetivo?', goal: [['protein', 'Más proteína'], ['light', 'Ligero'], ['lowcarb', 'Pocos hidratos'], ['energy', 'Con energía']],
        q_hunger: '¿Cuánta hambre tienes?', hunger: [['light', 'Poca'], ['normal', 'Normal'], ['hungry', 'Mucha']],
        q_taste: '¿Dulce o salado?', taste: [['sweet', 'Dulce'], ['salty', 'Salado'], ['', 'Me da igual']],
        q_people: '¿Cuántos sois?', people: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
        go: 'Recomiéndame', again: 'Otra propuesta', close: 'Cerrar', edit: 'Cambiar respuestas',
        filters: 'Respeto tus filtros activos', filters_edit: 'Cambiar filtros', hint: 'Escribe lo que te apetece o responde a las preguntas.',
        none: 'No he encontrado nada que encaje con tus filtros. Prueba a quitar alguno.', total: 'Total aproximado', see: 'Ver en la carta',
        slots: { starter: 'Para picar', main: 'Plato principal', light: 'Plato ligero', side: 'Acompañamiento', breakfast: 'Para desayunar', sweet: 'Algo dulce', drink: 'Para beber', rank: 'Ranking' },
        r_has: 'Lleva ', r_light: 'Ligero y fresco', r_hungry: 'Para ir con hambre', r_sweet: 'Dulce', r_protein: 'Con proteína', r_veg: 'Sin carne ni pescado', al_has: 'Alérgenos:', al_none: 'Sin alérgenos declarados.', r_pend: 'Los alérgenos de esta bebida los confirma el equipo.',
        miss: function (x) { return 'No encuentro «' + x + '» en esta parte de la carta; te propongo lo más parecido.'; },
        note: 'Propuesta orientativa. Comprueba los alérgenos con nuestro equipo.', res_h: 'Tu propuesta'
      },
      en: {
        btn: 'Help', h: 'Help', p: 'Tell me what you fancy or what your goal is, and I will put together a suggestion using the numbers on our menu.',
        ph: 'E.g. something high in protein, max. 600 kcal', ex_h: 'Ideas',
        ex: ['Max. 600 kcal and 40 g of protein', 'Post-workout, gluten-free', 'Low carb with avocado', 'For two, under €35', 'How many calories in the Chicken Joe?', 'The one with the most protein', 'Something light and fresh', 'A juice to wake up'],
        q_what: 'Tell me what you fancy', q_when: 'When?', opt: 'optional', when: [['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['drink', 'Just a drink']],
        q_goal: 'Do you have a goal?', goal: [['protein', 'More protein'], ['light', 'Light'], ['lowcarb', 'Low carb'], ['energy', 'Energy']],
        q_hunger: 'How hungry are you?', hunger: [['light', 'A little'], ['normal', 'Normal'], ['hungry', 'Very']],
        q_taste: 'Sweet or savoury?', taste: [['sweet', 'Sweet'], ['salty', 'Savoury'], ['', 'Either']],
        q_people: 'How many of you?', people: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
        go: 'Suggest', again: 'Another suggestion', close: 'Close', edit: 'Change answers',
        filters: 'Respecting your active filters', filters_edit: 'Change filters', hint: 'Type what you fancy or answer the questions.',
        none: 'I found nothing that fits your filters. Try removing one.', total: 'Approx. total', see: 'See on the menu',
        slots: { starter: 'To share', main: 'Main dish', light: 'Light dish', side: 'Side', breakfast: 'For breakfast', sweet: 'Something sweet', drink: 'To drink', rank: 'Ranking' },
        r_has: 'Contains ', r_light: 'Light and fresh', r_hungry: 'For a big appetite', r_sweet: 'Sweet', r_protein: 'With protein', r_veg: 'No meat or fish', al_has: 'Allergens:', al_none: 'No declared allergens.', r_pend: 'Our team confirms the allergens of this drink.',
        miss: function (x) { return 'I cannot find "' + x + '" in this part of the menu; here is the closest.'; },
        note: 'Indicative suggestion. Please check allergens with our team.', res_h: 'Your suggestion'
      }
    };
    var st = { when: '', hunger: '', taste: '', goal: '', people: '', text: '', seed: 0, result: null };
    var $ = function (id) { return document.getElementById(id); };
    var esc = A.esc, norm = A.norm;
    var t = function (k) { return T[A.L()][k]; };
    var X = function (es, en) { return A.L() === 'en' ? en : es; };
    var nm = function (n) { return Math.round(n); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };

    /* ── Números ── */
    var ZERO = { k: 0, p: 0, c: 0, f: 0 };
    function NV(it) { return it && it.nut ? { k: it.nut[0], p: it.nut[1], c: it.nut[2], f: it.nut[3] } : null; }
    function plus(a, b) { return { k: a.k + b.k, p: a.p + b.p, c: a.c + b.c, f: a.f + b.f }; }
    function times(a, n) { return { k: a.k * n, p: a.p * n, c: a.c * n, f: a.f * n }; }
    function priceOf(it) { var p = it.price; return Array.isArray(p) ? p[0] : (p || 0); }
    function macroLine(M) {
      var l = X(['Kcal', 'P', 'C', 'G'], ['Kcal', 'P', 'C', 'F']);
      return '<p class="ap-mac"><span><b>' + l[0] + '</b> ' + nm(M.k) + '</span><span><b>' + l[1] + '</b> ' + nm(M.p) + ' g</span><span><b>' + l[2] + '</b> ' + nm(M.c) + ' g</span><span><b>' + l[3] + '</b> ' + nm(M.f) + ' g</span></p>';
    }
    /* Reparto de la energía entre proteína, hidratos y grasa (4, 4 y 9 kcal por gramo). */
    function split(M) {
      var p = M.p * 4, c = M.c * 4, f = M.f * 9, s = p + c + f || 1;
      return { p: Math.round(p / s * 100), c: Math.round(c / s * 100), f: 100 - Math.round(p / s * 100) - Math.round(c / s * 100) };
    }
    function bar(M) {
      var s = split(M);
      return '<div class="ap-bar" role="img" aria-label="' + esc(X('Reparto de la energía', 'Energy split')) + '"><i class="ap-bp" style="width:' + s.p + '%"></i><i class="ap-bc" style="width:' + s.c + '%"></i><i class="ap-bf" style="width:' + s.f + '%"></i></div>' +
        '<p class="ap-leg"><span><i class="ap-bp"></i>' + esc(X('Proteína', 'Protein')) + ' ' + s.p + '%</span><span><i class="ap-bc"></i>' + esc(X('Hidratos', 'Carbs')) + ' ' + s.c + '%</span><span><i class="ap-bf"></i>' + esc(X('Grasa', 'Fat')) + ' ' + s.f + '%</span></p>';
    }

    /* ── Catálogo ── */
    var KIND = { 'tostadas': 'toast', 'acai & yogur': 'sweet', 'sandwiches': 'sandwich', 'starters': 'starter', 'pokes': 'bowl', 'platos roce': 'main', 'acompanamientos': 'side', 'extras': 'extra', 'mas proteina': 'extra', 'cafes': 'coffee', 'tes & infusiones': 'tea', 'matcha & tes': 'tea', 'smoothies': 'smoothie', 'zumos naturales': 'juice' };
    var DRINK = ['juice', 'smoothie', 'coffee', 'tea'];
    function catalogue(all) {
      var out = [];
      A.D.sections.forEach(function (s, si) {
        if (s.soon) return;
        s.groups.forEach(function (g, gi) {
          g.blocks.forEach(function (b, bi) {
            var kind = KIND[norm(b.title.es)] || 'other';
            if (kind === 'extra') return;
            b.items.forEach(function (it, n) {
              var off = window.ROCE_AVAIL && !window.ROCE_AVAIL.item(b, it);
              if (off && !all) return;
              out.push({ it: it, blk: b, sec: s.id, kind: kind, id: 'it-c' + si + gi + bi + '-' + n, nv: NV(it), off: !!off });
            });
          });
        });
      });
      return out;
    }
    function ev(it, blk, FF) {
      var a = A.analyze(it, blk), hide = false, pend = false;
      if (FF.al.length) { if ((it.al || []).some(function (x) { return FF.al.indexOf(x) !== -1; })) hide = true; else if (blk.alPending) pend = true; }
      FF.diet.forEach(function (k) { var v = a.dt[k]; if (v === 'n') hide = true; else if (v !== 'y') pend = true; });
      if (FF.ing.length) { if (FF.ing.some(function (k) { return a.ing.indexOf(k) !== -1; })) hide = true; else if (blk.alPending && !a.text) pend = true; }
      return { hide: hide, pend: pend };
    }
    function ingName(k) { var g = A.ING.filter(function (x) { return x.k === k; })[0]; return g ? A.tx(g) : k; }

    /* ── Entender lo que escribes ── */
    function parse(text) {
      var n = ' ' + norm(text) + ' ', diets = [], excl = [], wants = [], f = {};
      n = n.replace(/\b(sin|without|no)\s+(gluten|lactosa|lacteos|leche|dairy)\b/g, function (m, a, w) { diets.push(w === 'gluten' ? 'gf' : 'lf'); return ' '; });
      n = n.replace(/\b(sin|without)\s+([a-z]+)/g, function (m, a, x) {
        A.ING.forEach(function (g) { var en = norm(g.en).split(/\s*\/\s*/); if (g.re.test(x) || en.indexOf(x) !== -1) excl.push(g.k); });
        return ' ';
      });
      if (/gluten.?free|celiac|celiaco/.test(n)) diets.push('gf');
      if (/dairy.?free|lactose|lactosa/.test(n)) diets.push('lf');
      if (/vegetarian/.test(n)) diets.push('veg');
      if (/vegan/.test(n)) diets.push('vegan');
      if (/pescetarian|pescatarian/.test(n)) diets.push('pesc');
      A.ING.forEach(function (g) {
        var en = norm(g.en).split(/\s*\/\s*/).filter(function (w) { return w.length > 2; });
        if (excl.indexOf(g.k) === -1 && (g.re.test(n) || en.some(function (w) { return new RegExp('\\b' + w + '\\b').test(n); }))) wants.push(g.k);
      });
      f.light = /ligero|fresco|light|sano|fresh|healthy/.test(n); f.hungry = /hambre|contundente|mucho|grande|hungry|big|hearty/.test(n);
      f.sweet = /dulce|postre|sweet|dessert/.test(n); f.salty = /salado|savou?ry|salty/.test(n); f.protein = /proteina|protein/.test(n);
      f.juice = /zumo|jugo|juice/.test(n); f.smoothie = /smoothie|batido/.test(n); f.coffee = /cafe|coffee|latte|espresso/.test(n); f.tea = /\bte\b|infusion|matcha|tea\b/.test(n);
      f.drinkAny = f.juice || f.smoothie || f.coffee || f.tea || /bebida|beber|drink|refresc/.test(n);
      f.food = /comer|plato|tostada|desayun|comida|brunch|hambre|sandwich|bowl|poke|ensalada|cenar|almorz|lunch|breakfast|eat|dish/.test(n);
      f.breakfast = /desayun|tostada|acai|breakfast|manana|morning/.test(n);
      var words = n.split(/[^a-z]+/).filter(function (w) { return w.length >= 5; });
      return { diets: diets, excl: excl, wants: wants, f: f, words: words };
    }

    /* Objetivos nutricionales y de precio que se deducen del texto y de las respuestas. */
    function goalOf(text, when) {
      var n = ' ' + norm(text).replace(/,/g, '.') + ' ', bf = when === 'breakfast', m;
      var g = { kMax: 0, kMin: 0, pMin: 0, cMax: 0, fMax: 0, eMax: 0, people: 1, protein: false, lowcarb: false, lowfat: false, energy: false, cut: false };
      var LESS = '(?:menos de|maximo|max\\.?|hasta|por debajo de|no pase de|no pasar de|como mucho|under|below|less than|up to|at most)';
      if ((m = new RegExp(LESS + '\\s*(\\d{3,4})\\s*(?:kcal|calorias|cal)\\b').exec(n))) g.kMax = +m[1];
      else if ((m = /(\d{3,4})\s*(?:kcal|calorias|cal)\s*(?:o menos|como maximo|max|or less)/.exec(n))) g.kMax = +m[1];
      else if ((m = /(?:mas de|minimo|al menos|over|at least|more than)\s*(\d{3,4})\s*(?:kcal|calorias|cal)\b/.exec(n))) g.kMin = +m[1];
      else if ((m = /(\d{3,4})\s*(?:kcal|calorias)\b/.exec(n))) { g.kMax = Math.round(+m[1] * 1.1); g.kMin = Math.round(+m[1] * 0.85); }
      if ((m = /(\d{2,3})\s*(?:g|gr|gramos|grams)?\s*(?:de\s+|of\s+)?prote/.exec(n))) g.pMin = +m[1];
      else if ((m = /prote\w*\s*(?:de|:|of)?\s*(\d{2,3})\s*(?:g|gr|gramos|grams)?\b/.exec(n))) g.pMin = +m[1];
      if ((m = new RegExp(LESS + '\\s*(\\d{2,3})\\s*(?:g|gr|gramos|grams)?\\s*(?:de\\s+|of\\s+)?(?:hidratos|carbohidratos|carbs|carbo)').exec(n))) g.cMax = +m[1];
      if ((m = new RegExp(LESS + '\\s*(\\d{2,3})\\s*(?:g|gr|gramos|grams)?\\s*(?:de\\s+|of\\s+)?(?:grasas?|fat)').exec(n))) g.fMax = +m[1];
      if ((m = new RegExp(LESS + '\\s*(\\d{1,3})\\s*(?:€|eur|euros)').exec(n)) || (m = /(\d{1,3})\s*(?:€|eur|euros)\s*(?:como mucho|max|maximo|or less)/.exec(n))) g.eMax = +m[1];
      if (/low.?carb|pocos hidratos|bajo en hidratos|bajo en carbo|keto|sin hidratos|sin carbohidratos|pocos carbo|pocos carbs/.test(n)) { g.lowcarb = true; if (!g.cMax) g.cMax = bf ? 30 : 40; }
      if (/bajo en grasa|poca grasa|pocas grasas|low.?fat|sin grasa/.test(n)) { g.lowfat = true; if (!g.fMax) g.fMax = bf ? 15 : 22; }
      if (/alta en prote|alto en prote|high.?protein|proteico|rico en prote|mucha prote|mas prote|gym|gimnasio|entreno|entrenar|workout|after training|musculo|muscle|post.?entreno|crossfit|fitness/.test(n)) { g.protein = true; if (!g.pMin) g.pMin = bf ? 25 : 38; }
      if (/definicion|cutting|deficit|adelgaz|perder peso|bajar de peso|weight loss|lose weight|a dieta|on a diet/.test(n)) { g.cut = true; g.protein = true; if (!g.kMax) g.kMax = bf ? 420 : 560; if (!g.pMin) g.pMin = bf ? 20 : 30; }
      if (/volumen|\bbulk|ganar peso|ganar masa|gain weight|\bmass\b/.test(n)) { g.energy = true; g.protein = true; if (!g.kMin) g.kMin = bf ? 600 : 780; if (!g.pMin) g.pMin = bf ? 25 : 40; }
      var W = { dos: 2, tres: 3, cuatro: 4, two: 2, three: 3, four: 4 };
      if ((m = /(?:para|somos|for|we are|we're)\s+(\d|dos|tres|cuatro|two|three|four)\b(?!\s*(?:kcal|calorias|g\b|gr\b|gramos|euros|€|eur))/.exec(n)) || (m = /\b(\d)\s*(?:personas|people|pax|comensales)/.exec(n))) g.people = Math.max(1, Math.min(6, W[m[1]] || +m[1] || 1));
      return g;
    }
    /* Las respuestas por botones completan (sin pisar) lo que ya se ha escrito. */
    function withChips(g, when) {
      var bf = when === 'breakfast';
      if (st.people) g.people = Math.max(g.people, +st.people);
      if (st.goal === 'protein') { g.protein = true; if (!g.pMin) g.pMin = bf ? 25 : 38; }
      if (st.goal === 'light') { if (!g.kMax) g.kMax = bf ? 400 : 550; }
      if (st.goal === 'lowcarb') { g.lowcarb = true; if (!g.cMax) g.cMax = bf ? 30 : 40; }
      if (st.goal === 'energy') { g.energy = true; if (!g.kMin) g.kMin = bf ? 600 : 780; }
      g.numeric = !!(g.kMax || g.kMin || g.pMin || g.cMax || g.fMax);
      return g;
    }

    /* ── Mejor combinación de un plato con sus complementos ── */
    function targetK(W, hungry, light, bf, kind) {
      var k = bf ? (light ? 380 : hungry ? 700 : 520) : (light ? 450 : hungry ? 800 : 620);
      if (kind === 'starter') k = 300; else if (kind === 'sweet') k = 420; else if (kind === 'side') k = 200;
      if (W.kMax) k = Math.min(k, W.kMax * 0.92);
      if (W.kMin) k = Math.max(k, W.kMin * 1.05);
      if (W.cut) k = Math.min(k, bf ? 400 : 540);
      if (W.energy) k = Math.max(k, bf ? 650 : 820);
      return k;
    }
    function fitScore(M, price, W, T) {
      var s = 0, ok = true, pd = M.p / Math.max(1, M.k / 100);
      s -= Math.abs(M.k - T) / T * 4;
      s += (W.protein || W.pMin) ? pd * 0.8 : pd * 0.15;
      if (W.kMax && M.k > W.kMax) { s -= 30 + (M.k - W.kMax) / 20; ok = false; }
      if (W.kMin && M.k < W.kMin) { s -= 20 + (W.kMin - M.k) / 20; ok = false; }
      if (W.pMin && M.p < W.pMin) { s -= 25 + (W.pMin - M.p); ok = false; } else if (W.pMin) s += 2;
      if (W.cMax && M.c > W.cMax) { s -= 25 + (M.c - W.cMax) / 3; ok = false; }
      if (W.fMax && M.f > W.fMax) { s -= 25 + (M.f - W.fMax) / 2; ok = false; }
      if (W.lowcarb) s -= M.c / 10;
      if (W.lowfat) s -= M.f / 6;
      if (W.eMax && price > W.eMax / W.people) { s -= 15 + (price - W.eMax / W.people); ok = false; }
      return { s: s, ok: ok };
    }
    function combos(opts) {
      var prot = opts.filter(function (x) { return x.grp === 'prot'; }), side = opts.filter(function (x) { return x.grp === 'side'; }), out = [[]], i, j;
      prot.forEach(function (p) { out.push([p]); }); side.forEach(function (s) { out.push([s]); });
      prot.forEach(function (p) { side.forEach(function (s) { out.push([p, s]); }); });
      for (i = 0; i < prot.length; i++) for (j = i + 1; j < prot.length; j++) { out.push([prot[i], prot[j]]); side.forEach(function (s) { out.push([prot[i], prot[j], s]); }); }
      return out;
    }
    /* Devuelve el mejor plan para un plato: complementos elegidos, totales y si cumple lo pedido. */
    function planFor(c, W, FF, hungry, light, bf, multi) {
      if (!c.nv) return null;
      var all = window.ROCE_AVAIL && window.ROCE_AVAIL.addons && DRINK.indexOf(c.kind) === -1 && c.kind !== 'side' && !c.off ? window.ROCE_AVAIL.addons(c.blk) : [];
      var opts = all.filter(function (x) { return x.it.nut && !ev(x.it, x.blk, FF).hide; });
      var T = targetK(W, hungry, light, bf, c.kind), best = null;
      if (multi && c.kind !== 'starter' && !W.energy) T = Math.min(T, 680);
      combos(opts).forEach(function (cb) {
        var M = c.nv, price = priceOf(c.it);
        cb.forEach(function (x) { M = plus(M, NV(x.it)); price += x.price; });
        var f = fitScore(M, price, W, T), s = f.s - cb.length * 0.5;
        if (!best || s > best.s) best = { s: s, ok: f.ok, add: cb, M: M, price: price };
      });
      return best;
    }

    /* ── Proponer ── */
    function propose(seed) {
      var P = parse(st.text), G = A.F(), f = P.f;
      var FF = { al: G.al, diet: G.diet.concat(P.diets.filter(function (d) { return G.diet.indexOf(d) === -1; })), ing: (G.ing.m === 'sin' ? G.ing.k : []).concat(P.excl) };
      var wants = P.wants.concat(G.ing.m === 'con' ? G.ing.k : []);
      var hungry = st.hunger === 'hungry' || (!st.hunger && f.hungry), light = st.hunger === 'light' || (!st.hunger && f.light);
      var sweet = st.taste === 'sweet' || (!st.taste && f.sweet), salty = st.taste === 'salty' || (!st.taste && f.salty);
      var cat = catalogue().map(function (c) { var e = ev(c.it, c.blk, FF); c.hide = e.hide; c.pend = e.pend; return c; }).filter(function (c) { return !c.hide; });
      var foodWants = wants.some(function (k) { return cat.some(function (c) { return DRINK.indexOf(c.kind) === -1 && A.analyze(c.it, c.blk).ing.indexOf(k) !== -1; }); });
      var when = st.when || (f.drinkAny && !f.food && !f.light && !f.hungry && !foodWants ? 'drink' : f.breakfast ? 'breakfast' : (window.ROCE_AVAIL ? window.ROCE_AVAIL.meal() : 'lunch'));
      var W = withChips(goalOf(st.text, when), when), bf = when === 'breakfast';
      if (W.numeric && when === 'drink') when = bf ? 'breakfast' : (window.ROCE_AVAIL ? window.ROCE_AVAIL.meal() : 'lunch');
      var people = W.people, missing = {};
      var multi = !W.numeric && !bf && !light && (hungry || people > 1);
      cat.forEach(function (c) { c.plan = DRINK.indexOf(c.kind) === -1 ? planFor(c, W, FF, hungry, light, bf, multi) : null; });
      function score(c) {
        var a = A.analyze(c.it, c.blk), s = 0, txt = norm([c.it.name, c.it.es, c.it.tag && c.it.tag.es].join(' '));
        wants.forEach(function (k) { if (a.ing.indexOf(k) !== -1) s += 4; });
        P.words.forEach(function (w) { if (txt.indexOf(w) !== -1) s += 1; });
        if (f.protein && a.ing.some(function (k) { return ['pollo', 'ternera', 'pato', 'salmon', 'atun', 'huevo', 'falafel', 'queso'].indexOf(k) !== -1; })) s += 2;
        if (light && ['bowl', 'starter', 'toast', 'sweet'].indexOf(c.kind) !== -1) s += 2;
        if (hungry && ['main', 'sandwich'].indexOf(c.kind) !== -1) s += 2;
        if (sweet && (c.kind === 'sweet' || c.kind === 'smoothie' || c.kind === 'juice')) s += 2;
        if (salty && ['sweet', 'smoothie'].indexOf(c.kind) === -1) s += 1;
        if (c.pend) s -= 2;
        if (W.eMax && c.plan) { var bud = W.eMax / people * 0.8; if (c.plan.price > bud) s -= (c.plan.price - bud) * 2; }
        if (c.plan) s += c.plan.s * (W.numeric || W.protein || W.lowcarb || W.lowfat || W.cut || W.energy ? 1 : 0.35);
        return s;
      }
      var used = {};
      function pick(kinds, label, n, off) {
        var cands = cat.filter(function (c) { return kinds.indexOf(c.kind) !== -1 && !used[c.id]; }).map(function (c) { c.s = score(c); return c; });
        if (!cands.length) return null;
        cands.sort(function (a, b) { return b.s - a.s || String(a.it.name).localeCompare(String(b.it.name)); });
        var top = cands[0].s, pool = top > 0 ? cands.filter(function (c) { return c.s >= top - 1; }) : cands.slice(0, 4);
        pool = pool.slice(0, Math.max(4, n || 1));
        var out = [];
        for (var i = 0; i < (n || 1) && pool.length; i++) { var c = pool.splice((seed + (off || 0) + i) % pool.length, 1)[0]; used[c.id] = 1; out.push(c); }
        return { label: label, items: out };
      }
      var slots = [], drinkKinds = f.juice ? ['juice'] : f.smoothie ? ['smoothie'] : f.coffee ? ['coffee'] : f.tea ? ['tea'] : (sweet ? ['smoothie', 'juice'] : DRINK);
      var share = Math.max(1, Math.ceil(people / 2));
      if (when === 'drink') { var d = pick(drinkKinds.length < 4 && !f.drinkAny ? DRINK : drinkKinds, 'drink', Math.max(3, people), 0); if (d) slots.push(d); }
      else {
        if (W.numeric) {
          // Con un objetivo de números, un plato principal bien armado (con sus complementos) y una bebida.
          slots.push(pick(bf ? ['toast', 'sandwich', 'sweet'] : ['main', 'bowl', 'sandwich', 'toast', 'starter'], bf ? 'breakfast' : 'main', people, 0));
        } else if (when === 'breakfast') {
          if (sweet) slots.push(pick(['sweet'], 'sweet', people, 0)); else slots.push(pick(['toast', 'sandwich'], 'breakfast', people, 0));
          if (hungry) slots.push(pick(sweet ? ['toast'] : ['sweet'], sweet ? 'breakfast' : 'sweet', share, 1));
        } else {
          if (sweet && !hungry) slots.push(pick(['sweet'], 'sweet', people, 0));
          else if (light) slots.push(pick(['bowl', 'starter'], 'light', people, 0));
          else if (hungry || people > 1) { slots.push(pick(['starter'], 'starter', share, 0)); slots.push(pick(['main', 'sandwich', 'bowl'], 'main', people, 0)); if (people === 1) slots.push(pick(['side'], 'side', 1, 0)); }
          else slots.push(pick(['main', 'bowl', 'sandwich'], 'main', 1, 0));
        }
        slots.push(pick(drinkKinds, 'drink', people, 1));
      }
      slots = slots.filter(function (s) { return s && s.items.length; });
      if (W.eMax) {
        var cost = function () { var z = 0; slots.forEach(function (s) { s.items.forEach(function (c) { z += c.plan ? c.plan.price : priceOf(c.it); }); }); return z; };
        ['drink', 'starter', 'side', 'sweet'].forEach(function (lab) { if (cost() <= W.eMax) return; slots = slots.filter(function (s) { return s.label !== lab || slots.length < 2; }); });
      }
      if (!W.numeric && !W.energy) {
        var kcalPer = function () { var z = 0; slots.forEach(function (s) { s.items.forEach(function (c) { z += c.plan ? c.plan.M.k : (c.nv ? c.nv.k : 0); }); }); return z / people; };
        if (kcalPer() > 1200) slots = slots.filter(function (s) { return s.label !== 'side' || slots.length < 2; });
      }
      var picked = []; slots.forEach(function (s) { picked = picked.concat(s.items); });
      wants.forEach(function (k) { if (!picked.some(function (c) { return A.analyze(c.it, c.blk).ing.indexOf(k) !== -1; })) missing[k] = 1; });
      var miss = Object.keys(missing).map(ingName);
      // Totales de lo que se come (las bebidas no tienen datos nutricionales) y de lo que se paga.
      var M = ZERO, price = 0, hasDrink = false;
      picked.forEach(function (c) {
        price += priceOf(c.it);
        if (c.plan) { M = plus(M, c.plan.M); price += c.plan.price - priceOf(c.it); }
        else if (c.nv) M = plus(M, c.nv);
        if (DRINK.indexOf(c.kind) !== -1) hasDrink = true;
      });
      var per = times(M, 1 / people);
      var checks = checksFor(W, per, price, people);
      return { kind: 'plan', slots: slots, miss: miss, FF: FF, wants: wants, light: light, hungry: hungry, sweet: sweet, protein: !!f.protein || W.protein, W: W, people: people, totals: M, per: per, price: price, checks: checks, hasDrink: hasDrink, seed: seed };
    }
    function checksFor(W, per, price, people) {
      var out = [];
      function add(ok, es, en) { out.push({ ok: ok, txt: X(es, en) }); }
      if (W.kMax) add(per.k <= W.kMax, nm(per.k) + ' kcal (máx. ' + W.kMax + ')', nm(per.k) + ' kcal (max. ' + W.kMax + ')');
      if (W.kMin) add(per.k >= W.kMin, nm(per.k) + ' kcal (mín. ' + W.kMin + ')', nm(per.k) + ' kcal (min. ' + W.kMin + ')');
      if (W.pMin) add(per.p >= W.pMin, nm(per.p) + ' g de proteína (objetivo ' + W.pMin + ' g)', nm(per.p) + ' g of protein (goal ' + W.pMin + ' g)');
      if (W.cMax) add(per.c <= W.cMax, nm(per.c) + ' g de hidratos (máx. ' + W.cMax + ' g)', nm(per.c) + ' g of carbs (max. ' + W.cMax + ' g)');
      if (W.fMax) add(per.f <= W.fMax, nm(per.f) + ' g de grasa (máx. ' + W.fMax + ' g)', nm(per.f) + ' g of fat (max. ' + W.fMax + ' g)');
      if (W.eMax) add(price <= W.eMax, A.money(Math.round(price * 100) / 100) + ' (' + X('máx.', 'max.') + ' ' + A.money(W.eMax) + ')', A.money(Math.round(price * 100) / 100) + ' (max. ' + A.money(W.eMax) + ')');
      return out;
    }

    /* ── Preguntas sobre un plato, comparaciones y rankings ── */
    function allowedCat(FF) {
      return catalogue(true).map(function (c) { var e = ev(c.it, c.blk, FF); c.hide = e.hide; return c; }).filter(function (c) { return !c.hide; });
    }
    function filtersNow(P) { var G = A.F(); return { al: G.al, diet: G.diet.concat(P.diets), ing: (G.ing.m === 'sin' ? G.ing.k : []).concat(P.excl) }; }
    function answer(text) {
      var n = ' ' + norm(text) + ' ', P = parse(text), FF = filtersNow(P);
      var foods = catalogue(true).filter(function (c) { return c.nv && DRINK.indexOf(c.kind) === -1; });
      var seen = {}, hits = [];
      foods.forEach(function (c) {
        var nn = norm(c.it.name).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        if (nn.length < 4 || /^\d+$/.test(nn) || seen[nn]) return;
        if (new RegExp('(^|[^a-z0-9])' + nn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(n.replace(/[^a-z0-9 ]/g, ' '))) { seen[nn] = 1; hits.push(c); }
      });
      // «Tostada 003» (las tostadas se piden por su número).
      var cm = /tostada\s*(?:n[ouº°]?\.?\s*)?(00\d)/.exec(n);
      if (cm) { var tc = foods.filter(function (c) { return c.it.code === cm[1]; })[0]; if (tc && hits.indexOf(tc) === -1) hits.push(tc); }
      if (hits.length) { hits.sort(function (a, b) { return norm(b.it.name).length - norm(a.it.name).length; }); return hits.length === 1 ? { kind: 'dish', c: hits[0], FF: FF } : { kind: 'compare', list: hits.slice(0, 3), FF: FF }; }
      var m, metric = '', dir = 'desc';
      if ((m = /\b(mas|mayor|maximo|top|highest|most|best|mejor)\s+(?:\w+\s+){0,3}?(prote|calor|kcal)/.exec(n))) metric = /prote/.test(m[2]) ? 'p' : 'k';
      else if ((m = /\b(menos|minimo|lowest|fewest|least|min)\s+(?:\w+\s+){0,3}?(calor|kcal|grasa|hidrat|carb)/.exec(n))) { dir = 'asc'; metric = /calor|kcal/.test(m[2]) ? 'k' : /grasa/.test(m[2]) ? 'f' : 'c'; }
      else if (/(mas|most)\s+(ligero|light)|lightest|el mas ligero/.test(n)) { dir = 'asc'; metric = 'k'; }
      if (!metric) return null;
      var cands = allowedCat(FF).filter(function (c) { return c.nv && ['toast', 'sweet', 'sandwich', 'starter', 'bowl', 'main'].indexOf(c.kind) !== -1 && !c.off; });
      cands.sort(function (a, b) { return (dir === 'asc' ? 1 : -1) * (a.nv[metric] - b.nv[metric]) || a.nv.k - b.nv.k; });
      return { kind: 'rank', metric: metric, dir: dir, list: cands.slice(0, 4), FF: FF };
    }
    function bestAddons(c, FF) {
      var all = window.ROCE_AVAIL && window.ROCE_AVAIL.addons ? window.ROCE_AVAIL.addons(c.blk) : [];
      var ok = all.filter(function (x) { return x.it.nut && !ev(x.it, x.blk, FF).hide; });
      function line(x) { var M = plus(c.nv, NV(x.it)); return { x: x, M: M, price: priceOf(c.it) + x.price }; }
      var prot = ok.filter(function (x) { return x.grp === 'prot'; }).sort(function (a, b) { return b.it.nut[1] / Math.max(1, b.it.nut[0]) - a.it.nut[1] / Math.max(1, a.it.nut[0]); }).slice(0, 3).map(line);
      var side = ok.filter(function (x) { return x.grp === 'side'; }).sort(function (a, b) { return a.it.nut[0] - b.it.nut[0]; }).slice(0, 2).map(line);
      return { prot: prot, side: side };
    }

    function price(c) { return priceOf(c.it); }
    function reason(c, R) {
      var a = A.analyze(c.it, c.blk), has = (R.wants || []).filter(function (k) { return a.ing.indexOf(k) !== -1; }).map(function (k) { return ingName(k).toLowerCase(); });
      if (has.length) return t('r_has') + has.join(', ');
      if (c.nv && c.plan && (R.W.protein || R.W.pMin)) { var M = c.plan.M; return nm(M.p) + ' ' + X('g de proteína', 'g of protein') + ' · ' + r1(M.p / Math.max(1, M.k / 100)) + ' g ' + X('por 100 kcal', 'per 100 kcal'); }
      if (c.kind === 'sweet' || (R.sweet && (c.kind === 'smoothie' || c.kind === 'juice'))) return t('r_sweet');
      if (R.light && ['bowl', 'starter', 'toast'].indexOf(c.kind) !== -1) return t('r_light');
      if (R.hungry && ['main', 'sandwich'].indexOf(c.kind) !== -1) return t('r_hungry');
      var tg = c.it.tag && A.tx(c.it.tag); return tg || '';
    }
    function allergenLine(c) {
      var al = c.it.al || [];
      if (!al.length) return c.blk.alPending ? '' : '<p class="cv-pl-al">' + esc(t('al_none')) + '</p>';
      return '<p class="cv-pl-al"><b>' + esc(t('al_has')) + '</b> ' + al.map(function (n) { return '<span class="cv-al">' + n + '</span> ' + esc(A.tx(A.D.allergens[n - 1])); }).join(' · ') + '</p>';
    }
    function pendTxt(c) { return c.pend ? t('r_pend') : ''; }
    function dishName(c) { return (c.it.code && c.it.code !== c.it.name ? c.it.code + ' ' : '') + c.it.name; }

    /* Lo que «piensa» el asistente, en una o dos frases con los números reales. */
    function say(R) {
      var foods = []; R.slots.forEach(function (s) { s.items.forEach(function (c) { if (c.plan || c.nv) foods.push(c); }); });
      if (!foods.length) return '';
      var per = R.per, W = R.W, names = foods.slice(0, 3).map(function (c) { return c.it.name; }).join(', ');
      var tot = X('En total salen ', 'It comes to ') + nm(per.k) + ' kcal, ' + nm(per.p) + ' g ' + X('de proteína', 'of protein') + ', ' + nm(per.c) + ' g ' + X('de hidratos y ', 'of carbs and ') + nm(per.f) + ' g ' + X('de grasa', 'of fat') + (R.people > 1 ? X(' por persona', ' per person') : '') + '.';
      var failed = R.checks.filter(function (x) { return !x.ok; }).length, goals = R.checks.length;
      var head;
      if (goals && !failed) head = X('Lo he montado para tu objetivo: ' + names + '. ', 'I built this for your goal: ' + names + '. ');
      else if (goals) head = X('No he encontrado nada que cumpla todo a la vez con tus filtros; lo más cercano es ' + names + '. ', 'I could not find anything that meets everything at once with your filters; the closest is ' + names + '. ');
      else head = X('Te propongo ' + names + '. ', 'I suggest ' + names + '. ');
      var s = split(per), tags = [];
      if (s.p >= 25) tags.push(X('alta en proteína', 'high in protein')); if (s.c <= 28) tags.push(X('con pocos hidratos', 'low in carbs')); if (s.f <= 25) tags.push(X('baja en grasa', 'low in fat'));
      if (per.k <= 450 && !W.energy) tags.push(X('ligera', 'light'));
      return head + tot + (tags.length ? ' ' + X('Es una propuesta ', 'It is ') + tags.join(', ') + '.' : '');
    }

    /* ── Pantalla ── */
    function chips(key, list) { return '<div class="cv-opts" data-q="' + key + '">' + list.map(function (o) { return '<button type="button" class="cv-opt" data-v="' + o[0] + '" aria-pressed="' + (st[key] === o[0]) + '"><i></i>' + esc(o[1]) + '</button>'; }).join('') + '</div>'; }
    function step(n, title, body, optional) {
      return '<section class="cv-step"><div class="cv-step-h"><span class="cv-step-n">' + n + '</span><h3>' + esc(title) + (optional ? ' <small>' + esc(t('opt')) + '</small>' : '') + '</h3></div>' + body + '</section>';
    }
    function form() {
      var G = A.F(), n = G.al.length + G.diet.length + G.ing.k.length;
      return '<h2 id="cvChefTitle">' + esc(t('h')) + '</h2><p class="cv-chef-p">' + esc(t('p')) + '</p>' +
        step(1, t('q_what'), '<textarea id="cvChefText" rows="2" placeholder="' + esc(t('ph')) + '">' + esc(st.text) + '</textarea>' +
          '<div class="cv-ideas">' + t('ex').map(function (x) { return '<button type="button" class="cv-chip" data-ex="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>') +
        step(2, t('q_when'), chips('when', t('when')), true) +
        step(3, t('q_goal'), chips('goal', t('goal')), true) +
        step(4, t('q_hunger'), chips('hunger', t('hunger')), true) +
        step(5, t('q_taste'), chips('taste', t('taste')), true) +
        step(6, t('q_people'), chips('people', t('people')), true) +
        (n ? '<p class="cv-fs-note">' + esc(t('filters')) + ' · <button type="button" class="cv-link" id="cvChefFilters">' + esc(t('filters_edit')) + '</button></p>' : '');
    }
    /* En la app: complementos elegidos (acompañamiento / más proteína) que se preseleccionan al pedir. */
    function addAttr(c) { var a = c.plan ? c.plan.add : []; return a.length ? ' data-add="' + a.map(function (x) { return x.grp + ':' + x.k; }).join(',') + '"' : ''; }
    function addonLine(c) {
      var a = c.plan ? c.plan.add : []; if (!a.length) return '';
      return '<p class="cv-pl-why">' + esc(X('Con: ', 'With: ')) + a.map(function (x) { var N = NV(x.it); return esc(x.name) + ' (+' + esc(A.money(x.price)) + (N ? ' · +' + nm(N.k) + ' kcal · +' + nm(N.p) + ' g P' : '') + ')'; }).join(' · ') + '</p>';
    }
    function orderBtn(c, extra) { return '<button type="button" class="cv-link" data-go="' + c.sec + '|' + c.id + '"' + (extra || '') + '>' + esc(window.ROCE_APP ? X('Pedir', 'Order') : t('see')) + ' →</button>'; }
    function itemCard(c, label, R, idx) {
      var M = c.plan ? c.plan.M : c.nv, p = c.plan ? c.plan.price : price(c);
      return '<li class="cv-slot-' + label + '"><p class="cv-pl-slot"><span class="cv-pl-n">' + idx + '</span>' + esc(t('slots')[label]) + '</p><div class="cv-pl-top"><b>' + esc(dishName(c)) + '</b><span>' + esc(A.money(c.it.price)) + '</span></div>' +
        (c.it.es ? '<p class="cv-pl-desc">' + esc(A.tx({ es: c.it.es, en: c.it.en })) + '</p>' : '') +
        (M ? macroLine(M) : '') +
        (reason(c, R) ? '<p class="cv-pl-why">' + esc(reason(c, R)) + '</p>' : '') + (pendTxt(c) ? '<p class="cv-fs-note">' + esc(pendTxt(c)) + '</p>' : '') + allergenLine(c) + addonLine(c) +
        orderBtn(c, addAttr(c)) + '</li>';
    }
    function planView() {
      var R = st.result, idx = 0;
      var h = '<h2 id="cvChefTitle">' + esc(t('res_h')) + '</h2>';
      if (!R.slots.length) return h + '<p>' + esc(t('none')) + '</p>';
      var sy = say(R); if (sy) h += '<p class="cv-chef-p ap-say">' + esc(sy) + '</p>';
      if (R.miss.length) h += '<p class="cv-fs-note">' + esc(t('miss')(R.miss.join(', '))) + '</p>';
      h += '<ul class="cv-pick-list">';
      R.slots.forEach(function (s) { s.items.forEach(function (c) { h += itemCard(c, s.label, R, ++idx); }); });
      h += '</ul>';
      if (R.totals.k) {
        h += '<section class="ap-sum"><h3>' + esc(X('Resumen nutricional', 'Nutrition summary')) + (R.people > 1 ? ' · ' + esc(X('por persona', 'per person')) : '') + '</h3>' + macroLine(R.per) + bar(R.per);
        if (R.checks.length) h += '<ul class="ap-checks">' + R.checks.map(function (x) { return '<li class="' + (x.ok ? 'ap-ok' : 'ap-ko') + '"><span aria-hidden="true">' + (x.ok ? '✓' : '✕') + '</span> ' + esc(x.txt) + '</li>'; }).join('') + '</ul>';
        if (R.hasDrink) h += '<p class="cv-fs-note">' + esc(X('Las bebidas no están en el total: todavía no tienen datos nutricionales.', 'Drinks are not in the total: they do not have nutrition data yet.')) + '</p>';
        h += '</section>';
      }
      h += '<p class="cv-pl-total">' + esc(t('total')) + (R.people > 1 ? ' (' + R.people + ')' : '') + ': <b>' + esc(A.money(Math.round(R.price * 100) / 100)) + '</b></p><p class="cv-fs-note">' + esc(t('note')) + '</p>';
      return h;
    }
    function dishView() {
      var R = st.result, c = R.c, FF = R.FF, h = '<h2 id="cvChefTitle">' + esc(dishName(c)) + '</h2>';
      if (c.off) h += '<p class="cv-fs-note">' + esc(X('Ahora mismo no está disponible (horario o agotado).', 'Not available right now (hours or sold out).')) + '</p>';
      h += (c.it.es ? '<p class="cv-chef-p">' + esc(A.tx({ es: c.it.es, en: c.it.en })) + '</p>' : '') + macroLine(c.nv) + bar(c.nv);
      var a = A.analyze(c.it, c.blk); if (a.ing.length) h += '<p class="cv-pl-why">' + esc(X('Ingredientes que detecto: ', 'Ingredients I can see: ')) + esc(a.ing.map(ingName).join(', ').toLowerCase()) + '</p>';
      h += allergenLine(c);
      var e = ev(c.it, c.blk, FF); if (e.hide) h += '<p class="cv-fs-note ap-warn">' + esc(X('Ojo: este plato no encaja con tus filtros activos.', 'Heads-up: this dish does not match your active filters.')) + '</p>';
      var B = bestAddons(c, FF);
      if (B.prot.length || B.side.length) {
        h += '<section class="ap-sum"><h3>' + esc(X('Cómo ajustarlo', 'How to tweak it')) + '</h3><ul class="ap-tweak">';
        B.prot.forEach(function (o) { h += '<li><b>+ ' + esc(o.x.name) + '</b> <span>(+' + esc(A.money(o.x.price)) + ')</span><br><small>' + esc(X('Subes a ', 'You get ')) + nm(o.M.p) + ' g ' + esc(X('de proteína', 'of protein')) + ' · ' + nm(o.M.k) + ' kcal</small></li>'; });
        B.side.forEach(function (o) { h += '<li><b>+ ' + esc(o.x.name) + '</b> <span>(+' + esc(A.money(o.x.price)) + ')</span><br><small>' + nm(o.M.k) + ' kcal · ' + nm(o.M.c) + ' g ' + esc(X('de hidratos', 'of carbs')) + '</small></li>'; });
        h += '</ul></section>';
      }
      return h + '<ul class="cv-pick-list"><li>' + orderBtn(c) + '</li></ul>' + '<p class="cv-fs-note">' + esc(t('note')) + '</p>';
    }
    function compareView() {
      var R = st.result, L = R.list, h = '<h2 id="cvChefTitle">' + esc(X('Comparación', 'Comparison')) + '</h2><ul class="cv-pick-list">';
      L.forEach(function (c, i) {
        h += '<li><div class="cv-pl-top"><b>' + esc(dishName(c)) + '</b><span>' + esc(A.money(c.it.price)) + '</span></div>' + macroLine(c.nv) + bar(c.nv) + allergenLine(c) + orderBtn(c) + '</li>';
      });
      h += '</ul>';
      function best(key, dir, es, en) { var s = L.slice().sort(function (a, b) { return (dir === 'asc' ? 1 : -1) * (a.nv[key] - b.nv[key]); }); return '<li>' + esc(X(es, en)) + ': <b>' + esc(s[0].it.name) + '</b> (' + nm(s[0].nv[key]) + (key === 'k' ? ' kcal' : ' g') + ')</li>'; }
      h += '<section class="ap-sum"><ul class="ap-checks">' + best('p', 'desc', 'Más proteína', 'Most protein') + best('k', 'asc', 'Menos calorías', 'Fewest calories') + best('c', 'asc', 'Menos hidratos', 'Fewest carbs') + best('f', 'asc', 'Menos grasa', 'Least fat') + '</ul></section>';
      return h + '<p class="cv-fs-note">' + esc(t('note')) + '</p>';
    }
    function rankView() {
      var R = st.result, lab = { p: X('más proteína', 'most protein'), k: R.dir === 'asc' ? X('menos calorías', 'fewest calories') : X('más calorías', 'most calories'), f: X('menos grasa', 'least fat'), c: X('menos hidratos', 'fewest carbs') };
      var h = '<h2 id="cvChefTitle">' + esc(X('Ranking: ', 'Ranking: ') + lab[R.metric]) + '</h2>';
      if (!R.list.length) return h + '<p>' + esc(t('none')) + '</p>';
      h += '<ul class="cv-pick-list">';
      R.list.forEach(function (c, i) {
        h += '<li><p class="cv-pl-slot"><span class="cv-pl-n">' + (i + 1) + '</span>' + esc(t('slots').rank) + '</p><div class="cv-pl-top"><b>' + esc(dishName(c)) + '</b><span>' + esc(A.money(c.it.price)) + '</span></div>' + macroLine(c.nv) +
          (R.metric === 'p' ? '<p class="cv-pl-why">' + r1(c.nv.p / Math.max(1, c.nv.k / 100)) + ' g ' + esc(X('de proteína por 100 kcal', 'of protein per 100 kcal')) + '</p>' : '') + allergenLine(c) + orderBtn(c) + '</li>';
      });
      return h + '</ul><p class="cv-fs-note">' + esc(X('Solo platos disponibles ahora y que encajan con tus filtros.', 'Only dishes available now that match your filters.')) + '</p>';
    }
    function results() { var k = st.result.kind; return k === 'dish' ? dishView() : k === 'compare' ? compareView() : k === 'rank' ? rankView() : planView(); }
    function paint() {
      $('cvChefBtnLabel').textContent = t('btn');
      $('cvChefBody').innerHTML = st.result ? results() : form();
      $('cvChefClose').textContent = st.result ? t('edit') : t('close');
      $('cvChefGo').textContent = st.result ? (st.result.kind === 'plan' ? t('again') : X('Preguntar otra cosa', 'Ask something else')) : t('go');
    }
    function open() { st.result = null; paint(); var d = $('cvChef'); if (d.showModal) d.showModal(); else d.setAttribute('open', ''); fit(); }
    function close() { var d = $('cvChef'); if (d.close) d.close(); else d.removeAttribute('open'); }
    function run(again) {
      var ta = $('cvChefText'); if (ta) st.text = ta.value;
      if (again && st.result && st.result.kind !== 'plan') { st.result = null; paint(); return; }
      if (!st.result && !st.text.trim() && !st.when && !st.hunger && !st.taste && !st.goal && !st.people) { var n = $('cvChefBody').querySelector('p'); if (n) n.textContent = t('hint'); return; }
      st.seed = again ? st.seed + 1 : 0;
      st.result = (!again && st.text.trim() && answer(st.text)) || propose(st.seed);
      paint(); $('cvChef').scrollTop = 0; var b = $('cvChefBody'); if (b) b.scrollTop = 0;
    }

    // iPhone: con el teclado abierto el panel se ajusta al área visible (si no, se queda aplastado) y no abre el teclado solo
    function fit() { var vv = window.visualViewport, d = $('cvChef'); if (!vv || !d) return; d.style.setProperty('--vvh', Math.round(vv.height) + 'px'); d.style.setProperty('--vvt', Math.round(vv.offsetTop) + 'px'); }
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', fit); window.visualViewport.addEventListener('scroll', fit); }
    document.addEventListener('focusin', function (e) { if (e.target && e.target.id === 'cvChefText') setTimeout(function () { fit(); try { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { /* sin scroll */ } }, 250); });
    $('cvChefBtn').addEventListener('click', open);
    $('cvChefClose').addEventListener('click', function () { if (st.result) { st.result = null; paint(); } else close(); });
    $('cvChefGo').addEventListener('click', function () { run(!!st.result); });
    $('cvChef').addEventListener('click', function (e) {
      if (e.target === this) { close(); return; }
      var o = e.target.closest('.cv-opt'), x = e.target.closest('[data-ex]'), g = e.target.closest('[data-go]');
      if (o) { var k = o.parentNode.dataset.q; st[k] = st[k] === o.dataset.v && o.dataset.v !== '' ? '' : o.dataset.v; var ta = $('cvChefText'); if (ta) st.text = ta.value; paint(); }
      else if (x) { var ta2 = $('cvChefText'); st.text = x.dataset.ex; ta2.value = st.text; ta2.focus(); }
      else if (g) { var p = g.dataset.go.split('|'); close(); A.goTo(p[0], p[1]); if (window.ROCE_APP && window.ROCE_APP.openItemById) { var pre = g.dataset.add || ''; setTimeout(function () { window.ROCE_APP.openItemById(p[1], pre); }, 450); } }
      else if (e.target.id === 'cvChefFilters') { close(); A.openFilters(); }
    });
    document.addEventListener('roce:lang', function () { if ($('cvChef').open) { st.result = null; } paint(); });
    paint();
  }
  if (window.CARTA_API) start(); else document.addEventListener('carta:ready', start, { once: true });
})();
