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
  let infoTextsQueue = [];
  let showingInfoText = false;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.05 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.1 0");
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
    } else if (allModelsDisplayed && !showingInfoText) {
      showingInfoText = true;
      zoomPiece1and2();
    } else if (showingInfoText) {
      handleNextInfoText();
    }
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;

      const tapText = document.createElement("a-text");
      tapText.setAttribute("value", "Tap the screen");
      tapText.setAttribute("align", "center");
      tapText.setAttribute("color", "#FFD700");
      tapText.setAttribute("position", "0 -0.25 0");
      tapText.setAttribute("scale", "0.2 0.2 0.2");
      tapText.setAttribute("wrap-count", "20");
      tapText.setAttribute("id", "tapText");
      introContainer.appendChild(tapText);

      return;
    }

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);
    piece.setAttribute("scale", "0.18 0.18 0.18");
    piece.setAttribute("position", "0 -0.05 0");

    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "0.18 0.18 0.18",
      dur: 250,
      easing: "easeOutElastic"
    });

    piece.addEventListener("model-loaded", () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 900);
  }

  function zoomPiece1and2() {
    if (frameEntities.length < 2) return;

    for (let i = 2; i < frameEntities.length; i++) {
      frameEntities[i].setAttribute("visible", "false");
    }

    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    // Animazioni posizione e scala
    p1.setAttribute("animation__zoom", { property: "position", to: { x: -0.08, y: -0.05, z: 0.2 }, dur: 600, easing: "easeOutQuad" });
    p2.setAttribute("animation__zoom", { property: "position", to: { x: 0.08, y: -0.05, z: 0.2 }, dur: 600, easing: "easeOutQuad" });
    p1.setAttribute("animation__scale", { property: "scale", to: { x: 0.22, y: 0.22, z: 0.22 }, dur: 600, easing: "easeOutQuad" });
    p2.setAttribute("animation__scale", { property: "scale", to: { x: 0.22, y: 0.22, z: 0.22 }, dur: 600, easing: "easeOutQuad" });

    // Camera animata
    camera.setAttribute("animation__camZoom", { property: "position", to: { x: 0, y: 0, z: 0.5 }, dur: 600, easing: "easeOutQuad" });

    // Coda dei testi
    infoTextsQueue = [
      "Queste due cornici rappresentano le principali della tua collezione",
      "Ecco alcune informazioni aggiuntive sulle cornici principali"
    ];

    // Mostra primo testo
    showNextInfoText();
  }

  function handleNextInfoText() {
    const currentText = document.getElementById("infoText");
    if (currentText) {
      currentText.setAttribute("visible", "false");
      introContainer.removeChild(currentText);
    }

    if (infoTextsQueue.length > 0) {
      showNextInfoText();
    } else {
      // Tutti i testi mostrati → ritorno alla vista originale
      for (let i = 0; i < frameEntities.length; i++) {
        frameEntities[i].setAttribute("visible", "true");
        frameEntities[i].setAttribute("animation__resetPos", { property: "position", to: { x: 0, y: -0.05, z: 0 }, dur: 600, easing: "easeOutQuad" });
        frameEntities[i].setAttribute("animation__resetScale", { property: "scale", to: { x: 0.18, y: 0.18, z: 0.18 }, dur: 600, easing: "easeOutQuad" });
      }

      // Camera ritorna alla posizione originale
      camera.setAttribute("animation__camBack", { property: "position", to: { x: 0, y: 0, z: 0 }, dur: 600, easing: "easeOutQuad" });

      showingInfoText = false;
    }
  }

  function showNextInfoText() {
    const nextTextValue = infoTextsQueue.shift();
    if (!nextTextValue) return;

    const infoText = document.createElement("a-text");
    infoText.setAttribute("value", nextTextValue);
    infoText.setAttribute("align", "center");
    infoText.setAttribute("color", "#008000");
    infoText.setAttribute("position", "0 -0.2 0");
    infoText.setAttribute("scale", "0.15 0.15 0.15");
    infoText.setAttribute("wrap-count", "30");
    infoText.setAttribute("id", "infoText");
    introContainer.appendChild(infoText);
  }
});

