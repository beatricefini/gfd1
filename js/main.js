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
  let step = 0; // per gestire sequenza tap dopo zoom

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
      // Nascondi testi introduttivi
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleZoomSequence();
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

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 900);
  }

  function handleZoomSequence() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    if (step === 0) {
      // Nascondi le altre cornici
      for (let i = 2; i < frameEntities.length; i++) {
        frameEntities[i].setAttribute("visible", "false");
      }

      // Zoom su piece1 e piece2
      p1.setAttribute("animation__zoom", {
        property: "position",
        to: { x: -0.08, y: -0.05, z: 0.2 },
        dur: 600,
        easing: "easeOutQuad"
      });
      p2.setAttribute("animation__zoom", {
        property: "position",
        to: { x: 0.08, y: -0.05, z: 0.2 },
        dur: 600,
        easing: "easeOutQuad"
      });

      p1.setAttribute("animation__scale", {
        property: "scale",
        to: { x: 0.22, y: 0.22, z: 0.22 },
        dur: 600,
        easing: "easeOutQuad"
      });
      p2.setAttribute("animation__scale", {
        property: "scale",
        to: { x: 0.22, y: 0.22, z: 0.22 },
        dur: 600,
        easing: "easeOutQuad"
      });

      camera.setAttribute("animation__camZoom", {
        property: "position",
        to: { x: 0, y: 0, z: 0.5 },
        dur: 600,
        easing: "easeOutQuad"
      });

      // Primo testo
      const infoText1 = document.createElement("a-text");
      infoText1.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      infoText1.setAttribute("align", "center");
      infoText1.setAttribute("color", "#008000");
      infoText1.setAttribute("position", "0 -0.2 0");
      infoText1.setAttribute("scale", "0.15 0.15 0.15");
      infoText1.setAttribute("wrap-count", "30");
      infoText1.setAttribute("id", "infoText1");
      introContainer.appendChild(infoText1);

      step = 1;
    } else if (step === 1) {
      // Nascondi testo1, mostra testo2
      const infoText1 = document.getElementById("infoText1");
      if (infoText1) infoText1.setAttribute("visible", "false");

      const infoText2 = document.createElement("a-text");
      infoText2.setAttribute("value", "Ognuna di esse racconta una storia unica...");
      infoText2.setAttribute("align", "center");
      infoText2.setAttribute("color", "#008000");
      infoText2.setAttribute("position", "0 -0.2 0");
      infoText2.setAttribute("scale", "0.15 0.15 0.15");
      infoText2.setAttribute("wrap-count", "30");
      infoText2.setAttribute("id", "infoText2");
      introContainer.appendChild(infoText2);

      step = 2;
    } else if (step === 2) {
      // Nascondi testo2
      const infoText2 = document.getElementById("infoText2");
      if (infoText2) infoText2.setAttribute("visible", "false");

      // Riporta camera e cornici alla posizione originale
      p1.setAttribute("animation__resetPos", {
        property: "position",
        to: { x: 0, y: -0.05, z: 0 },
        dur: 600,
        easing: "easeOutQuad"
      });
      p2.setAttribute("animation__resetPos", {
        property: "position",
        to: { x: 0, y: -0.05, z: 0 },
        dur: 600,
        easing: "easeOutQuad"
      });

      p1.setAttribute("animation__resetScale", {
        property: "scale",
        to: { x: 0.18, y: 0.18, z: 0.18 },
        dur: 600,
        easing: "easeOutQuad"
      });
      p2.setAttribute("animation__resetScale", {
        property: "scale",
        to: { x: 0.18, y: 0.18, z: 0.18 },
        dur: 600,
        easing: "easeOutQuad"
      });

      camera.setAttribute("animation__camReset", {
        property: "position",
        to: { x: 0, y: 0, z: 0 },
        dur: 600,
        easing: "easeOutQuad"
      });

      // Rendi di nuovo visibili le altre cornici
      for (let i = 2; i < frameEntities.length; i++) {
        frameEntities[i].setAttribute("visible", "true");
      }

      // Ripristina messaggio "Tap the screen"
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      step = 0; // reset ciclo
    }
  }
});

