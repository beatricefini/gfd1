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

  let frameEntities = []; // Per riferirci ai modelli successivamente

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo più in basso
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.05 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);
  });

  window.addEventListener("click", () => {
    if (!started) {
      // Rimuovi testi introduttivi
      const introText = document.getElementById("introText");
      if (introText) introText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      // Zoom su piece1 e piece2
      zoomPiece1and2();
    }
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;

      // Mostra "Tap the screen" sotto le cornici
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
    frameEntities.push(piece); // salviamo i riferimenti
    currentIndex++;

    setTimeout(showAllModelsSequentially, 900);
  }

  function zoomPiece1and2() {
    if (frameEntities.length < 2) return;

    // Nascondi le altre cornici
    for (let i = 2; i < frameEntities.length; i++) {
      frameEntities[i].setAttribute("visible", "false");
    }

    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    // Posizioniamo i due pezzi affiancati e leggermente più vicini alla camera
    p1.setAttribute("position", { x: -0.08, y: 0, z: 0.02 });
    p2.setAttribute("position", { x: 0.08, y: 0, z: 0.02 });
    p1.setAttribute("scale", { x: 0.2, y: 0.2, z: 0.2 });
    p2.setAttribute("scale", { x: 0.2, y: 0.2, z: 0.2 });

    // Testo informativo sotto
    const infoText = document.createElement("a-text");
    infoText.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
    infoText.setAttribute("align", "center");
    infoText.setAttribute("color", "#008000");
    infoText.setAttribute("position", "0 -0.2 0");
    infoText.setAttribute("scale", "0.15 0.15 0.15");
    infoText.setAttribute("wrap-count", "30");
    infoText.setAttribute("id", "infoText");
    introContainer.appendChild(infoText);

    console.log("✅ Zoom su piece1 e piece2 completato");
  }
});

