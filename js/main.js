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

  // Posizioni e scale di Blender
  const initialPositions = [
    { x: -0.2, y: 0.1, z: 0 },
    { x: 0.2, y: 0.1, z: 0 },
    { x: -0.2, y: -0.05, z: 0 },
    { x: 0.2, y: -0.05, z: 0 },
    { x: -0.2, y: -0.2, z: 0 },
    { x: 0.2, y: -0.2, z: 0 },
  ];

  const initialScales = [
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
  ];

  let started = false;
  let currentIndex = 0;
  let allModelsDisplayed = false;
  let frameEntities = [];
  let sequenceStep = 0;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.2 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    // Testo "Tap to start"
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 0 0");
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

  // Funzione per pop-up sequenziale dei modelli
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
    piece.setAttribute("position", initialPositions[currentIndex]);
    piece.setAttribute("scale", { x: 0, y: 0, z: 0 }); // parte da 0 per pop-up

    piece.setAttribute("animation__pop", {
      property: "scale",
      to: initialScales[currentIndex],
      dur: 400,
      easing: "easeOutElastic"
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 700); // comparsa rapida
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach((t) => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function resetAllModels() {
    frameEntities.forEach((ent, i) => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("position", initialPositions[i]);
      ent.setAttribute("scale", initialScales[i]);
    });
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "true");
  }

  // Funzione gestione sequenze con zoom sulle cornici isolate
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    if (sequenceStep === 0) {
      // Zoom piece1 e piece2
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", i <= 1 ? "true" : "false");
      });
      [frameEntities[0], frameEntities[1]].forEach((p) => {
        p.setAttribute("scale", { x: 1.2, y: 1.2, z: 1.2 });
        p.setAttribute("position", { x: p.object3D.position.x, y: p.object3D.position.y, z: p.object3D.position.z + 0.1 });
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Sono le opere più importanti, da cui parte la storia");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      resetAllModels();
      sequenceStep = 3;

    } else if (sequenceStep === 3) {
      // Zoom piece3,4,5
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", [2,3,4].includes(i) ? "true" : "false");
      });
      [frameEntities[2], frameEntities[3], frameEntities[4]].forEach((p) => {
        p.setAttribute("scale", { x: 1.2, y: 1.2, z: 1.2 });
        p.setAttribute("position", { x: p.object3D.position.x, y: p.object3D.position.y, z: p.object3D.position.z + 0.1 });
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ecco tre opere complementari");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 4;

    } else if (sequenceStep === 4) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste aggiungono varietà alla collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 5;

    } else if (sequenceStep === 5) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ognuna di esse arricchisce la narrazione visiva");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.6 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 6;

    } else if (sequenceStep === 6) {
      resetAllModels();
      sequenceStep = 7;

    } else if (sequenceStep === 7) {
      // Zoom piece6
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", i === 5 ? "true" : "false");
      });
      frameEntities[5].setAttribute("scale", { x: 1.2, y: 1.2, z: 1.2 });
      frameEntities[5].setAttribute("position", { x: frameEntities[5].object3D.position.x, y: frameEntities[5].object3D.position.y, z: frameEntities[5].object3D.position.z + 0.1 });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Infine, questa cornice conclusiva");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      introContainer.appendChild(infoText);

      sequenceStep = 8;

    } else if (sequenceStep === 8) {
      resetAllModels();
      sequenceStep = 9;
    }
  }
});

