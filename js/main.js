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
  let step = 0; // Sequenza zoom

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.05 0");
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
      startText.setAttribute("position", "0 -0.1 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 500);
  });

  window.addEventListener("click", () => {
    if (!started) {
      // Sparisci testi introduttivi
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else {
      if (step === 0) zoomPiece1and2();
      else if (step === 1) zoomPiece3to5();
      else if (step === 2) zoomPiece6();
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

  // --- Funzioni zoom sequenziali ---
  function zoomPiece1and2() {
    if (frameEntities.length < 2) return;
    step = 1; // prossima sequenza

    frameEntities.slice(2).forEach(f => f.setAttribute("visible", "false"));

    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    p1.setAttribute("animation__zoom", { property: "position", to: { x: -0.08, y: -0.05, z: 0.2 }, dur: 600, easing: "easeOutQuad" });
    p2.setAttribute("animation__zoom", { property: "position", to: { x: 0.08, y: -0.05, z: 0.2 }, dur: 600, easing: "easeOutQuad" });

    p1.setAttribute("animation__scale", { property: "scale", to: { x: 0.22, y: 0.22, z: 0.22 }, dur: 600, easing: "easeOutQuad" });
    p2.setAttribute("animation__scale", { property: "scale", to: { x: 0.22, y: 0.22, z: 0.22 }, dur: 600, easing: "easeOutQuad" });

    camera.setAttribute("animation__camZoom", { property: "position", to: { x: 0, y: 0, z: 0.5 }, dur: 600, easing: "easeOutQuad" });

    const texts = [
      "Queste due cornici rappresentano le principali della tua collezione",
      "Ecco alcune informazioni aggiuntive sulle cornici principali"
    ];
    showTextSequence(texts);
  }

  function zoomPiece3to5() {
    step = 2;

    const pieces = frameEntities.slice(2, 5);
    frameEntities.forEach(f => { if (!pieces.includes(f)) f.setAttribute("visible", "false"); });

    pieces[0].setAttribute("position", { x: -0.1, y: -0.05, z: 0.15 });
    pieces[1].setAttribute("position", { x: 0, y: -0.05, z: 0.15 });
    pieces[2].setAttribute("position", { x: 0.1, y: -0.05, z: 0.15 });

    pieces.forEach(p => p.setAttribute("scale", { x: 0.2, y: 0.2, z: 0.2 }));

    camera.setAttribute("animation__camZoom2", { property: "position", to: { x: 0, y: 0, z: 0.6 }, dur: 600, easing: "easeOutQuad" });

    const texts = [
      "Queste tre cornici sono importanti nella tua collezione",
      "Puoi osservarne le caratteristiche più interessanti",
      "Ogni cornice ha una storia da raccontare"
    ];
    showTextSequence(texts);
  }

  function zoomPiece6() {
    step = 3;
    const piece = frameEntities[5];
    frameEntities.slice(0,5).forEach(f => f.setAttribute("visible", "false"));

    piece.setAttribute("position", { x: 0, y: -0.05, z: 0.15 });
    piece.setAttribute("scale", { x: 0.22, y: 0.22, z: 0.22 });

    camera.setAttribute("animation__camZoom3", { property: "position", to: { x: 0, y: 0, z: 0.65 }, dur: 600, easing: "easeOutQuad" });

    const texts = [
      "Ultima cornice da osservare",
      "Qui sotto il testo informativo per la tua collezione"
    ];
    showTextSequence(texts);
  }

  // --- Funzione generica per sequenza di testi per tap ---
  function showTextSequence(textArray) {
    let textIndex = 0;
    const infoText = document.createElement("a-text");
    infoText.setAttribute("value", textArray[textIndex]);
    infoText.setAttribute("align", "center");
    infoText.setAttribute("color", "#008000");
    infoText.setAttribute("position", "0 -0.2 0");
    infoText.setAttribute("scale", "0.15 0.15 0.15");
    infoText.setAttribute("wrap-count", "30");
    infoText.setAttribute("id", "infoText");
    introContainer.appendChild(infoText);

    const listener = () => {
      textIndex++;
      if (textIndex < textArray.length) {
        infoText.setAttribute("value", textArray[textIndex]);
      } else {
        window.removeEventListener("click", listener);
        infoText.setAttribute("visible", "false");
      }
    };

    window.addEventListener("click", listener);
  }
});


