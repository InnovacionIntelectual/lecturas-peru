/* Navegación lateral: cajón en móvil, sección activa y barra de progreso de lectura. */
(function(){
  "use strict";
  var lateral = document.getElementById('lateral');
  var velo = document.getElementById('velo');
  var btn = document.getElementById('abrir-menu');
  if(!lateral) return;

  /* ---------- Cajón (móvil) ---------- */
  function abrir(si){
    lateral.classList.toggle('abierto', si);
    document.documentElement.classList.toggle('menu-abierto', si);
    if(velo) velo.hidden = !si;
    if(btn){
      btn.setAttribute('aria-expanded', si ? 'true' : 'false');
      btn.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
    }
  }
  if(btn) btn.addEventListener('click', function(){ abrir(!lateral.classList.contains('abierto')); });
  if(velo) velo.addEventListener('click', function(){ abrir(false); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') abrir(false); });
  lateral.addEventListener('click', function(e){ if(e.target.closest('a')) abrir(false); });

  /* ---------- Sección activa ---------- */
  var enlaces = [].slice.call(lateral.querySelectorAll('a[href^="#"]'));
  var secciones = enlaces.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  function marcar(){
    var corte = window.innerHeight * 0.3, activo = 0;
    secciones.forEach(function(s, i){ if(s && s.getBoundingClientRect().top <= corte) activo = i; });
    // al final de la página gana la última sección aunque sea corta
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) activo = secciones.length - 1;
    enlaces.forEach(function(a, i){
      if(i === activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Progreso ---------- */
  var barra = document.getElementById('progreso');
  function progreso(){
    if(!barra) return;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (total > 0 ? Math.min(100, window.scrollY / total * 100) : 0) + '%';
  }

  var pendiente = false;
  function alDesplazar(){
    if(pendiente) return;
    pendiente = true;
    requestAnimationFrame(function(){ pendiente = false; marcar(); progreso(); });
  }
  window.addEventListener('scroll', alDesplazar, {passive:true});
  window.addEventListener('resize', alDesplazar);
  window.addEventListener('load', alDesplazar);
  alDesplazar();
})();
