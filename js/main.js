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

    // Testo introduttivo diviso in righe
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.5 0");
    introText.setAttribute("scale", "0.7 0.7 0.7");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    // Testo "Tap to start" che compare dopo 3 secondi
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.6 0.6 0.6");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 3000);
  });

  // Tap per iniziare o mostrare modelli
  window.addEventListener("click", () => {
    if (!started) {
      // Rimuovi testi intro
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");
      started = true;
      showNextModel();
    } else {
      showNextModel();
    }
  });

  function showNextModel() {
    if (currentIndex >= models.length) return;

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);
    piece.setAttribute("scale", "1 1 1");
    piece.setAttribute("position", `0 0 0`);

    // Animazione pop-in
    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "1 1 1",
      dur: 600,
      easing: "easeOutElastic"
    });

    piece.addEventListener("model-loaded", () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    modelsContainer.appendChild(piece);
    currentIndex++;
  }
});




