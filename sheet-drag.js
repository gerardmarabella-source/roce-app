/* ROCE · Pide: las hojas de abajo (pedido, plato, filtros, ayuda, cuenta…) se cierran arrastrándolas hacia abajo, como en una app.
   Se puede arrastrar desde el asa gris / la cabecera, o desde el contenido si ya está arriba del todo. Solo en móvil. */
(function () {
  var mq = window.matchMedia('(max-width: 560px)');
  function attach(dlg) {
    var sy = 0, dy = 0, mode = 0, t0 = 0;    // mode: 0 nada · 1 por decidir · 2 arrastrando
    function body() { return dlg.querySelector('.cv-sheet-body'); }
    function reset(anim) {
      dlg.style.transition = anim ? 'transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none';
      dlg.style.transform = '';
      if (anim) setTimeout(function () { dlg.style.transition = ''; }, 260);
    }
    dlg.addEventListener('touchstart', function (e) {
      mode = 0;
      if (!mq.matches || !dlg.open || e.touches.length !== 1) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      var r = dlg.getBoundingClientRect(), y = e.touches[0].clientY - r.top, b = body();
      var inHeader = y < 70, onTopBody = b && b.contains(e.target) && b.scrollTop <= 0 && dlg.scrollTop <= 0;
      if (!inHeader && !onTopBody) return;
      sy = e.touches[0].clientY; dy = 0; t0 = Date.now(); mode = 1;
    }, { passive: true });
    dlg.addEventListener('touchmove', function (e) {
      if (!mode) return;
      var d = e.touches[0].clientY - sy;
      if (mode === 1) {
        if (Math.abs(d) < 8) return;
        if (d < 0) { mode = 0; return; }       // hacia arriba: desplazamiento normal del contenido
        mode = 2; dlg.style.transition = 'none';
      }
      dy = Math.max(0, d);
      dlg.style.transform = 'translateY(' + dy + 'px)';
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    function end() {
      if (mode !== 2) { mode = 0; return; }
      mode = 0;
      var v = dy / Math.max(1, Date.now() - t0);
      if (dy > 110 || (v > 0.55 && dy > 40)) {
        dlg.style.transition = 'transform 0.2s ease-in'; dlg.style.transform = 'translateY(100%)';
        setTimeout(function () {
          // un clic sobre el propio fondo ejecuta el cierre normal de cada hoja (limpia el estado de la app)
          dlg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          if (dlg.open) { try { dlg.close(); } catch (x) {} }
          reset(false);
        }, 200);
      } else reset(true);
    }
    dlg.addEventListener('touchend', end, { passive: true });
    dlg.addEventListener('touchcancel', function () { if (mode === 2) { mode = 0; reset(true); } else mode = 0; }, { passive: true });
  }
  ['apDlg', 'cvSheet', 'cvChef'].forEach(function (id) { var d = document.getElementById(id); if (d) attach(d); });
})();

/* Teclado del móvil: con él abierto la hoja se coloca en la parte VISIBLE de la pantalla (si no, se queda abajo, detrás del teclado) y se encoge a esa altura.
   En iPhone el teclado no cambia el tamaño de la página, solo el «viewport visual»; de ahí que se calcule con visualViewport. */
(function () {
  var vv = window.visualViewport, root = document.documentElement;
  if (!vv) return;
  function kb() {
    var open = window.innerHeight - vv.height > 120;
    root.classList.toggle('kb-open', open);
    root.style.setProperty('--kb-top', Math.round(vv.offsetTop) + 'px');
    root.style.setProperty('--kb-h', Math.round(vv.height) + 'px');
  }
  vv.addEventListener('resize', kb); vv.addEventListener('scroll', kb);
  document.addEventListener('focusin', function (e) {
    var t = e.target; if (!t || !t.closest || !t.closest('dialog') || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    setTimeout(function () { kb(); try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { /* sin scroll */ } }, 300);
  });
  document.addEventListener('focusout', function () { setTimeout(kb, 200); });
  kb();
})();
