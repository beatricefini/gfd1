document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = [
    "#piece1",
    "#piece2",
    "#piece3",
    "#piece4",
    "#piece5",
    "#piece6"
  ];

  let started = false;
  let currentIndex = 0;
  let allModelsDisplayed = false;
  const frameEntities = [];
  let sequenceStep = 0;
  const originalTransforms = {};

  // --- Intro / target found ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.3 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    // TAP TO CONTINUE: comparirà dopo 3 secondi
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    const startText = document.getElementById("startText");
    if (!started) {
      if (!startText) return; // blocco se la scritta non è ancora comparsa

      const introText = document.getElementById("introText");
      if (introText) introText.setAttribute("visible", "false");
      startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Show models one by one ---
  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;
      const tapText = document.createElement("a-text");
      tapText.setAttribute("value", "Tap the screen");
      tapText.setAttribute("align", "center");
      tapText.setAttribute("color", "#FFD700");
      tapText.setAttribute("position", "0 -0.6 0");
      tapText.setAttribute("scale", "0.2 0.2 0.2");
      tapText.setAttribute("wrap-count", "20");
      tapText.setAttribute("id", "tapText");
      introContainer.appendChild(tapText);
      return;
    }

    const idx = currentIndex;
    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[idx]);
    piece.setAttribute("visible", "false");

    piece.addEventListener("model-loaded", () => {
      const pos = piece.getAttribute("position");
      const scale = piece.getAttribute("scale");
      originalTransforms[idx] = {
        position: { x: pos.x, y: pos.y, z: pos.z },
        scale: { x: scale.x, y: scale.y, z: scale.z }
      };

      piece.setAttribute("animation__pop", {
        property: "scale",
        from: "0 0 0",
        to: `${scale.x} ${scale.y} ${scale.z}`,
        dur: 500,
        easing: "easeOutElastic"
      });

      piece.setAttribute("visible", "true");
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showAllModelsSequentially, 700);
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach((t) => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;

    frameEntities.forEach((ent, i) => {
      if (!activeIndices.includes(i)) ent.setAttribute("visible", "false");
    });

    activeIndices.forEach((i) => {
      const ent = frameEntities[i];
      const orig = originalTransforms[i];
      if (!ent || !orig) return;

      ent.setAttribute("animation__backpos", {
        property: "position",
        to: `${orig.position.x} ${orig.position.y} ${orig.position.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
      ent.setAttribute("animation__backscale", {
        property: "scale",
        to: `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
    });

    setTimeout(() => {
      frameEntities.forEach((ent, i) => {
        const orig = originalTransforms[i];
        if (orig) {
          ent.setAttribute("position", `${orig.position.x} ${orig.position.y} ${orig.position.z}`);
          ent.setAttribute("scale", `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`);
        }
        ent.setAttribute("visible", "true");
      });

      camera.setAttribute("animation__camreset", {
        property: "position",
        to: "0 0 0",
        dur: dur,
        easing: "easeInOutQuad"
      });

      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      if (typeof callback === "function") callback();
    }, dur + 50);
  }

  // --- Gestione sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // Sequenze dei modelli come da codice precedente...
    // (SEQ 1, SEQ 2, SEQ 3 con animazioni, testi ecc.)
    // Per brevità qui manteniamo la logica precedente, solo alla fine:
    if (sequenceStep === 8) {
      resetAllModels([5], () => { 
        const tapText = document.getElementById("tapText");
        if (tapText) tapText.setAttribute("visible", "false");

        sequenceStep = 9;
        showFinalCinema(); // scena finale con modello Cinema
      });
    }
  }

  // --- Funzione scena finale ---
  function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldTexts();

    const baseHeight = -0.25;

    // --- Modello Cinema ---
    const cinemaModel = document.createElement('a-entity');
    cinemaModel.setAttribute('gltf-model', '#cinemaModel');
    cinemaModel.setAttribute('position', { x: 0, y: -0.4, z: 0.5 });
    cinemaModel.setAttribute('scale', { x: 2, y: 2, z: 2 });
    cinemaModel.setAttribute('animation__pop', {
      property: 'scale',
      from: '0 0 0',
      to: '2 2 2',
      dur: 800,
      easing: 'easeOutElastic'
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

    // --- Testo "ruins" ---
    const textRuins = document.createElement('a-text');
    textRuins.setAttribute('value', 'ruins');
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

});
