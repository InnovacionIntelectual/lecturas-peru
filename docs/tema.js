/* Conmutador de tema. Claro por defecto; recuerda la elección por visitante.
   Hay un botón en la barra móvil y otro en el lateral: se pintan todos a la vez. */
(function(){
  "use strict";
  var raiz = document.documentElement;
  var botones = [].slice.call(document.querySelectorAll('.tema'));
  if(!botones.length) return;
  function actual(){ return raiz.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function pintar(){
    var osc = actual()==='dark';
    botones.forEach(function(btn){
      var rotulo = osc ? 'Modo claro' : 'Modo oscuro';
      btn.textContent = (osc ? '☀' : '☾') + (btn.hasAttribute('data-rotulo') ? '  ' + rotulo : '');
      btn.setAttribute('aria-label', osc ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', rotulo);
    });
  }
  pintar();
  botones.forEach(function(btn){
    btn.addEventListener('click', function(){
      var nuevo = actual()==='dark' ? 'light' : 'dark';
      raiz.setAttribute('data-theme', nuevo);
      try{ localStorage.setItem('tema', nuevo); }catch(e){}
      pintar();
      if(typeof window.__repintarGraficos==='function'){ try{ window.__repintarGraficos(); }catch(e){} }
    });
  });
})();
