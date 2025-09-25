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

    // Testo "Tap to start" più in basso
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
    }, 3000);
  });

  // Tap per iniziare animazione modelli
  window.addEventListener("click", () => {
    if (started) return;

    // Rimuovi testi
    const introText = document.getElementById("introText");
    const startText = document.getElementById("startText");
    if (introText) introText.setAttribute("visible", "false");
    if (startText) startText.setAttribute("visible", "false");

    started = true;
    showAllModelsSequentially();
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) return;

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);
    piece.setAttribute("scale", "0.18 0.18 0.18");
    piece.setAttribute("position", "0 -0.05 0");

    // Animazione pop-in veloce
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
    currentIndex++;

    // Modello successivo dopo 900 ms
    if (currentIndex < models.length) {
      setTimeout(showAllModelsSequentially, 900);
    }
  }
});

