function showFinalCinema() {
  // Nascondi tutte le cornici
  frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
  clearOldTexts();

  const baseHeight = -0.25;

  // --- Modello Cinema ---
  const cinemaModel = document.createElement('a-entity');
  cinemaModel.setAttribute('gltf-model', '#cinemaModel');

  // posizione più sicura davanti alla camera
  cinemaModel.setAttribute('position', { x: 0, y: -0.3, z: 0.5 });
  cinemaModel.setAttribute('scale', { x: 0.5, y: 0.5, z: 0.5 });

  // debug: quando il modello è caricato, scrivilo in console
  cinemaModel.addEventListener('model-loaded', () => {
    console.log('✅ Cinema model caricato!');
    cinemaModel.setAttribute('visible', 'true');
  });

  modelsContainer.appendChild(cinemaModel);

  // --- Testo "1958" ---
  const text1958 = document.createElement('a-text');
  text1958.setAttribute('value', '1958');
  text1958.setAttribute('align', 'center');
  text1958.setAttribute('anchor', 'center');
  text1958.setAttribute('color', '#000000');
  text1958.setAttribute('font', 'roboto');
  text1958.setAttribute('position', { x: 0, y: baseHeight + 0.5, z: 0.5 });
  text1958.setAttribute('scale', '0.5 0.5 0.5');
  text1958.setAttribute('opacity', '0');
  text1958.setAttribute('shader', 'msdf');
  text1958.setAttribute('negate', 'false');
  text1958.setAttribute('animation__fadein', {
    property: 'opacity',
    from: 0,
    to: 1,
    dur: 800,
    easing: 'easeInQuad',
    delay: 200
  });
  introContainer.appendChild(text1958);

  // --- Testo "Ruins" ---
  const textRuins = document.createElement('a-text');
  textRuins.setAttribute('value', 'Ruins'); // <-- R maiuscola
  textRuins.setAttribute('align', 'center');
  textRuins.setAttribute('anchor', 'center');
  textRuins.setAttribute('color', '#000000');
  textRuins.setAttribute('font', 'roboto');
  textRuins.setAttribute('position', { x: 0, y: baseHeight + 0.4, z: 0.5 });
  textRuins.setAttribute('scale', '0.35 0.35 0.35');
  textRuins.setAttribute('opacity', '0');
  textRuins.setAttribute('shader', 'msdf');
  textRuins.setAttribute('negate', 'false');
  textRuins.setAttribute('animation__fadein', {
    property: 'opacity',
    from: 0,
    to: 1,
    dur: 800,
    easing: 'easeInQuad',
    delay: 1200
  });
  introContainer.appendChild(textRuins);
}
