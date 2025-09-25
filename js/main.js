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
  let frameEntities = [];
  let sequenceStep = 0;

  // Salvo posizioni e scale originali da Blender
  const originalTransforms = {};

  // --- Pop-up iniziale ---
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

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 500);
  });

  window.addEventListener("click", () => {
    if (!started) {
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Pop-up sequenziale modelli ---
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

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);

    // posizioni e scale da Blender
    piece.addEventListener("model-loaded", () => {
      const pos = piece.getAttribute("position");
      const scale = piece.getAttribute("scale");
      originalTransforms[currentIndex] = { position: { ...pos }, scale: { ...scale } };
    });

    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "1 1 1",
      dur: 500,
      easing: "easeOutElastic"
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

  function resetAllModels(callback) {
    frameEntities.forEach((ent, i) => {
      const orig = originalTransforms[i];
      if (!orig) return;

      // animazione ritorno
      ent.setAttribute("animation__pos", {
        property: "position",
        to: `${orig.position.x} ${orig.position.y} ${orig.position.z}`,
        dur: 800,
        easing: "easeInOutQuad"
      });
      ent.setAttribute("animation__scale", {
        property: "scale",
        to: `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`,
        dur: 800,
        easing: "easeInOutQuad"
      });

      ent.setAttribute("visible", "true");
    });

    camera.setAttribute("animation__cam", {
      property: "position",
      to: "0 0 0",
      dur: 800,
      easing: "easeInOutQuad"
    });

    // dopo animazione ricompaiono tutti
    setTimeout(() => {
      frameEntities.forEach(ent => ent.setAttribute("visible", "true"));
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");
      if (callback) callback();
    }, 900);
  }

  // --- Gestione sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // 1ª SEQUENZA: piece1 + piece2
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });

      frameEntities[0].setAttribute("animation__pos", {
        property: "position",
        to: "-0.35 0 0.1",
        dur: 800, easing: "easeInOutQuad"
      });
      frameEntities[1].setAttribute("animation__pos", {
        property: "position",
        to: "0.05 0.12 0.4",
        dur: 800, easing: "easeInOutQuad"
      });

      frameEntities[0].setAttribute("animation__scale", {
        property: "scale",
        to: "1.2 1.2 1.2",
        dur: 800, easing: "easeInOutQuad"
      });
      frameEntities[1].setAttribute("animation__scale", {
        property: "scale",
        to: "2.1 2.1 2.1",
        dur: 800, easing: "easeInOutQuad"
      });

      camera.setAttribute("animation__cam", {
        property: "position",
        to: "0 0 0.5",
        dur: 800, easing: "easeInOutQuad"
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Sono le opere più importanti, da cui parte la storia");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);
      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      resetAllModels(() => { sequenceStep = 3; });

    // 2ª SEQUENZA: piece3 + piece4 + piece5
    } else if (sequenceStep === 3) {
      frameEntities.forEach((ent, i) => { if (i < 2 || i > 4) ent.setAttribute("visible", "false"); });

      frameEntities[2].setAttribute("animation__pos", { property: "position", to: "-0.05 0.2 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[3].setAttribute("animation__pos", { property: "position", to: "0.05 0.45 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[4].setAttribute("animation__pos", { property: "position", to: "0.15 0.3 0.35", dur: 800, easing: "easeInOutQuad" });

      [2,3,4].forEach(i => frameEntities[i].setAttribute("animation__scale", {
        property: "scale",
        to: "1.2 1.2 1.2",
        dur: 800, easing: "easeInOutQuad"
      }));

      camera.setAttribute("animation__cam", {
        property: "position",
        to: "0 0 0.6",
        dur: 800, easing: "easeInOutQuad"
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ecco tre opere complementari");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 4;

    } else if (sequenceStep === 4) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste aggiungono varietà alla collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);
      sequenceStep = 5;

    } else if (sequenceStep === 5) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ognuna di esse arricchisce la narrazione visiva");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.6 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);
      sequenceStep = 6;

    } else if (sequenceStep === 6) {
      resetAllModels(() => { sequenceStep = 7; });

    // 3ª SEQUENZA: piece6
    } else if (sequenceStep === 7) {
      frameEntities.forEach((ent, i) => { if (i !== 5) ent.setAttribute("visible", "false"); });

      frameEntities[5].setAttribute("animation__pos", {
        property: "position",
        to: "0.3 -0.15 0.35",
        dur: 800, easing: "easeInOutQuad"
      });
      frameEntities[5].setAttribute("animation__scale", {
        property: "scale",
        to: "1.7 1.7 1.7",
        dur: 800, easing: "easeInOutQuad"
      });

      camera.setAttribute("animation__cam", {
        property: "position",
        to: "0 0 0.6",
        dur: 800, easing: "easeInOutQuad"
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Infine, quest'ultima cornice");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.2 0.2 0.2");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 8;

    } else if (sequenceStep === 8) {
      resetAllModels(() => { sequenceStep = 9; });
    }
  }
});
