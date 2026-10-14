/* Movimiento de la navegación: aparición al desplazarse, contadores de cifras clave,
   gráficos que se dibujan al entrar en pantalla, destello en la sección elegida
   y botón para volver arriba. Sin JS o con "reducir movimiento" todo queda estático. */
(function(){
  "use strict";
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raiz = document.documentElement;

  /* ---------- Volver arriba (también con movimiento reducido) ---------- */
  var arriba = document.createElement('button');
  arriba.type = 'button'; arriba.className = 'arriba'; arriba.textContent = '↑';
  arriba.setAttribute('aria-label', 'Volver arriba'); arriba.title = 'Volver arriba';
  document.body.appendChild(arriba);
  arriba.addEventListener('click', function(){ window.scrollTo({top:0, behavior: quieto ? 'auto' : 'smooth'}); });
  function mostrarArriba(){ arriba.classList.toggle('visible', window.scrollY > window.innerHeight * 0.9); }
  window.addEventListener('scroll', mostrarArriba, {passive:true});
  mostrarArriba();

  if(quieto || !('IntersectionObserver' in window)) return;
  raiz.classList.add('anima');

  /* ---------- Aparición al desplazarse ---------- */
  var selector = [
    '.bloque > h2', '.bloque > .lead', '.bloque figure', '.bloque .cifras > div', '.veredicto',
    '.tabla-scroll', '.vacios', '.fuentes', '.kpi',
    '.doc > section > h2', '.doc > section > h3', '.doc > section > ul', '.doc .tabla-scroll'
  ].join(',');
  var piezas = [].slice.call(document.querySelectorAll(selector));
  piezas.forEach(function(el){
    // escalonar hermanos dentro de la misma grilla
    var padre = el.parentElement, i = 0;
    if(padre && /grid2|grid3|cifras|resumen/.test(padre.className)){
      i = [].indexOf.call(padre.children, el);
    }
    el.style.setProperty('--retardo', (Math.min(i, 4) * 90) + 'ms');
    el.classList.add('revelar');
  });
  var vigia = new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('visible');
      vigia.unobserve(e.target);
      if(e.target.classList.contains('kpi')) contar(e.target.querySelector('b'));
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
  piezas.forEach(function(el){ vigia.observe(el); });
  // al terminar de aparecer, la pieza vuelve a su estilo normal (hover sin retardo)
  document.addEventListener('transitionend', function(e){
    var el = e.target;
    if(e.propertyName === 'transform' && el.classList && el.classList.contains('revelar') && el.classList.contains('visible')){
      el.classList.remove('revelar', 'visible'); el.style.removeProperty('--retardo');
    }
  });

  /* ---------- Contadores de cifras clave (formato peruano: 8.893 / 47,3) ---------- */
  function contar(b){
    if(!b || b.dataset.contado) return;
    b.dataset.contado = '1';
    var txt = b.textContent.trim();
    var m = txt.match(/^([\d.]+(?:,\d+)?)(.*)$/);
    if(!m) return;
    var crudo = m[1], resto = m[2];
    var dec = (crudo.split(',')[1] || '').length;
    var miles = crudo.indexOf('.') > -1;
    var meta = parseFloat(crudo.replace(/\./g, '').replace(',', '.'));
    var fmt = function(v){
      var p = v.toFixed(dec).split('.');
      if(miles) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return p[0] + (p[1] ? ',' + p[1] : '');
    };
    var t0 = null, dur = 1100;
    b.setAttribute('aria-label', txt);
    function paso(t){
      if(t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var suave = 1 - Math.pow(1 - k, 3);
      b.textContent = fmt(meta * suave) + resto;
      if(k < 1) requestAnimationFrame(paso); else b.textContent = txt;
    }
    requestAnimationFrame(paso);
  }

  /* ---------- Gráficos: se dibujan cuando entran en pantalla ---------- */
  var graficos = window.__graficos || [];
  if(graficos.length){
    var porLienzo = new Map();
    graficos.forEach(function(g){ porLienzo.set(g.canvas, g); });
    var vigiaG = new IntersectionObserver(function(entradas){
      entradas.forEach(function(e){
        if(!e.isIntersecting) return;
        vigiaG.unobserve(e.target);
        // el tema puede haber recreado el gráfico: buscar el vigente
        var g = (window.__graficos || []).filter(function(x){ return x.canvas === e.target; })[0];
        if(g){ g.reset(); g.update(); }
      });
    }, {threshold:0.25});
    graficos.forEach(function(g){
      var r = g.canvas.getBoundingClientRect();
      if(r.top > window.innerHeight){ g.reset(); g.render(); vigiaG.observe(g.canvas); }
    });
  }

  /* ---------- Destello en la sección elegida desde el menú ---------- */
  function destellar(id){
    var s = document.getElementById(id); if(!s) return;
    var h = s.querySelector('h2') || s.querySelector('h1'); if(!h) return;
    h.classList.remove('destello'); void h.offsetWidth; h.classList.add('destello');
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]');
    if(a && a.closest('.lateral')) destellar(a.getAttribute('href').slice(1));
  });
})();
