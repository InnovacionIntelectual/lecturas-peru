const fs=require('fs');
const {doc,F}=require('./contenido.js');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const slug=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let h='';
for(const s of doc.secciones){
  const id=slug(s.h2);
  h+=`<section id="${id}"><h2>${esc(s.h2)}</h2>\n`;
  for(const b of s.bloques){
    if(b.h3) h+=`<h3>${esc(b.h3)}</h3>\n`;
    if(b.p) h+=`<p>${esc(b.p)}</p>\n`;
    if(b.nota) h+=`<p class="nota">${esc(b.nota)}</p>\n`;
    if(b.ul) h+=`<ul>${b.ul.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>\n`;
    if(b.tabla) h+=`<div class="tabla-scroll"><table><thead><tr>${b.tabla.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.tabla.filas.map(f=>`<tr>${f.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>\n`;
  }
  h+='</section>\n';
}
const fuentes=Object.entries(F).map(([k,v])=>`<li id="f-${k}"><a href="${v.url}" rel="noopener">${esc(v.titulo)}</a>. ${esc(v.entidad)}${v.anio?', '+v.anio:''}. <span class="tag">${esc(v.tipo)}</span></li>`).join('\n');
const SITIO='https://innovacionintelectual.github.io/lecturas-peru/';
const corto=t=>t.replace(/^\d+\.\s*/,'');
const indice=doc.secciones.map(s=>({id:slug(s.h2),n:(s.h2.match(/^\d+/)||[''])[0],t:corto(s.h2)})).concat([{id:'fuentes',n:'9',t:'Fuentes'}]);
const lateral=indice.map(i=>`      <li><a href="#${i.id}"><span class="n">${String(i.n).padStart(2,'0')}</span>${esc(i.t)}</a></li>`).join('\n');
const html=`<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>(function(){try{var t=localStorage.getItem('tema');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>
<title>Recomendaciones: el libro y la lectura en el Perú</title>
<meta name="description" content="Recomendaciones de política pública e innovación por actor para el ecosistema del libro en el Perú, con fuente por cifra.">
<link rel="canonical" href="${SITIO}recomendaciones.html">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#1E2A4A">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Lecturas en el Perú">
<meta property="og:locale" content="es_PE">
<meta property="og:title" content="Recomendaciones: el libro y la lectura en el Perú">
<meta property="og:description" content="Política pública e innovación por actor para el ecosistema del libro en el Perú, con fuente por cifra.">
<meta property="og:url" content="${SITIO}recomendaciones.html">
<meta property="og:image" content="${SITIO}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Recomendaciones: el libro y la lectura en el Perú">
<meta name="twitter:description" content="Política pública e innovación por actor, con fuente por cifra.">
<meta name="twitter:image" content="${SITIO}og.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,800&family=Archivo:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="estilos.css"></head>
<body>
<a class="saltar" href="#contenido">Ir al contenido</a>
<header class="tope">
  <button id="abrir-menu" class="menu-btn" type="button" aria-controls="lateral" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span><span></span></button>
  <a class="marca" href="index.html">Lecturas en el Perú</a>
  <button class="tema" type="button" aria-label="Cambiar tema">☾</button>
</header>
<div class="velo" id="velo" hidden></div>

<aside class="lateral" id="lateral" aria-label="Navegación del estudio">
  <a class="marca" href="index.html"><span class="marca-txt"><strong>Lecturas en el Perú</strong><small>Diagnóstico y recomendaciones</small></span></a>
  <nav aria-label="Secciones">
    <p class="lat-tit">Documento</p>
    <ol class="lat-lista" id="lat-secciones">
${lateral}
    </ol>
    <p class="lat-tit">Estudio</p>
    <ul class="lat-lista">
      <li><a href="index.html"><span class="n" aria-hidden="true">←</span>Volver al tablero</a></li>
      <li><a href="descargas/Estudio_Mercado_Libro_Peru_2026.docx"><span class="n" aria-hidden="true">↓</span>Descargar en Word</a></li>
    </ul>
  </nav>
  <div class="lat-pie">
    <button class="tema" type="button" data-rotulo aria-label="Cambiar tema">☾</button>
    <p>Datos consultados el 6 de octubre de 2026.</p>
  </div>
</aside>

<div class="pagina">
<div class="progreso" aria-hidden="true"><span id="progreso"></span></div>
<main id="contenido" class="doc">
<p class="antetitulo">Estudio de mercado · Perú 2026</p>
<h1>${esc(doc.titulo)}</h1>
<p class="lead">${esc(doc.subtitulo)}. ${esc(doc.fecha)}.</p>
${h}
<section id="fuentes"><h2>9. Fuentes</h2><ol class="fuentes">${fuentes}</ol></section>
</main>
<footer class="pie"><p>Estudio independiente. <a href="index.html">Volver al tablero</a>.</p></footer>
</div>
<script src="tema.js"></script>
<script src="nav.js"></script>
<script src="animaciones.js"></script>
</body></html>`;
fs.writeFileSync(require('path').join(__dirname,'..','docs','recomendaciones.html'),html);
console.log('html ok',html.length);
