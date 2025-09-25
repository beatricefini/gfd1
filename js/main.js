document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");

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
    piece.setAttribute("position", "0 0 0"); // Blender position
    piece.setAttribute("scale", "1 1 1");     // Blender scale

    piece.addEventListener("model-loaded", () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 800);
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach((t) => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // SEQUENZA 1: piece1 e piece2
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", i <= 1 ? "true" : "false");
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Sono le opere più importanti, da cui parte la storia");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      // Torna a tutte le cornici visibili
      frameEntities.forEach((ent) => ent.setAttribute("visible", "true"));
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      sequenceStep = 3;

    // SEQUENZA 2: piece3,4,5
    } else if (sequenceStep === 3) {
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", [2,3,4].includes(i) ? "true" : "false");
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ecco tre opere complementari");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 4;

    } else if (sequenceStep === 4) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste aggiungono varietà alla collezione");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.5 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 5;

    } else if (sequenceStep === 5) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Ognuna di esse arricchisce la narrazione visiva");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.6 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 6;

    } else if (sequenceStep === 6) {
      // Torna a tutte le cornici visibili
      frameEntities.forEach((ent) => ent.setAttribute("visible", "true"));
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      sequenceStep = 7;

    // SEQUENZA 3: piece6
    } else if (sequenceStep === 7) {
      frameEntities.forEach((ent, i) => {
        ent.setAttribute("visible", i === 5 ? "true" : "false");
      });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Infine, questa cornice conclusiva");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#008000");
      infoText.setAttribute("position", "0 -0.4 0");
      infoText.setAttribute("scale", "0.15 0.15 0.15");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 8;

    } else if (sequenceStep === 8) {
      // Torna a tutte le cornici visibili
      frameEntities.forEach((ent) => ent.setAttribute("visible", "true"));
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      sequenceStep = 9;
    }
  }
});
