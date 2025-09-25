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
  let step = 0;        // gestisce i tap dentro una sequenza
  let sequence = 0;    // 0 = prima sequenza (p1+p2), 1 = seconda sequenza (p3+p4+p5)

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

    if (sequence === 0) {
      zoomSequence12();
    } else if (sequence === 1) {
      zoomSequence345();
    }
  }

  // === SEQUENZA 1: piece1 + piece2 ===
  function zoomSequence12() {
    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    if (step === 0) {
      hideOthers([0, 1]);

      animateZoom([p1, p2], [
        { x: -0.1, y: -0.05, z: 0.2 },
        { x: 0.1, y: -0.05, z: 0.2 }
      ]);

      showText("infoText1", "Queste due cornici rappresentano le principali della tua collezione");
      step = 1;
    } else if (step === 1) {
      hideText("infoText1");
      showText("infoText2", "Ognuna di esse racconta una storia unica...");
      step = 2;
    } else if (step === 2) {
      hideText("infoText2");
      resetAllModels();
      sequence = 1; // passa alla sequenza successiva
      step = 0;
    }
  }

  // === SEQUENZA 2: piece3 + piece4 + piece5 ===
  function zoomSequence345() {
    const p3 = frameEntities[2];
    const p4 = frameEntities[3];
    const p5 = frameEntities[4];

    if (step === 0) {
      hideOthers([2, 3, 4]);

      animateZoom([p3, p4, p5], [
        { x: -0.15, y: -0.05, z: 0.25 },
        { x: 0,     y: -0.05, z: 0.25 },
        { x: 0.15,  y: -0.05, z: 0.25 }
      ]);

      showText("infoText3", "Queste tre cornici formano un trittico speciale.");
      step = 1;
    } else if (step === 1) {
      hideText("infoText3");
      showText("infoText4", "Ciascuna parte contribuisce a un racconto comune.");
      step = 2;
    } else if (step === 2) {
      hideText("infoText4");
      showText("infoText5", "Insieme danno vita a un'esperienza completa.");
      step = 3;
    } else if (step === 3) {
      hideText("infoText5");
      resetAllModels();
      sequence = 2; // (eventuale sequenza successiva)
      step = 0;
    }
  }

  // === FUNZIONI UTILI ===
  function hideOthers(keepIndexes) {
    for (let i = 0; i < frameEntities.length; i++) {
      if (!keepIndexes.includes(i)) {
        frameEntities[i].setAttribute("visible", "false");
      }
    }
  }

  function animateZoom(entities, positions) {
    entities.forEach((ent, i) => {
      ent.setAttribute("animation__zoomPos", {
        property: "position",
        to: positions[i],
        dur: 600,
        easing: "easeOutQuad"
      });
      ent.setAttribute("animation__zoomScale", {
        property: "scale",
        to: { x: 0.22, y: 0.22, z: 0.22 },
        dur: 600,
        easing: "easeOutQuad"
      });
    });

    camera.setAttribute("animation__camZoom", {
      property: "position",
      to: { x: 0, y: 0, z: 0.5 },
      dur: 600,
      easing: "easeOutQuad"
    });
  }

  function resetAllModels() {
    frameEntities.forEach(ent => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("animation__resetPos", {
        property: "position",
        to: { x: 0, y: -0.05, z: 0 },
        dur: 600,
        easing: "easeOutQuad"
      });
      ent.setAttribute("animation__resetScale", {
        property: "scale",
        to: { x: 0.18, y: 0.18, z: 0.18 },
        dur: 600,
        easing: "easeOutQuad"
      });
    });

    camera.setAttribute("animation__camReset", {
      property: "position",
      to: { x: 0, y: 0, z: 0 },
      dur: 600,
      easing: "easeOutQuad"
    });

    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "true");
  }

  function showText(id, text) {
    const t = document.createElement("a-text");
    t.setAttribute("value", text);
    t.setAttribute("align", "center");
    t.setAttribute("color", "#008000");
    t.setAttribute("position", "0 -0.2 0");
    t.setAttribute("scale", "0.15 0.15 0.15");
    t.setAttribute("wrap-count", "30");
    t.setAttribute("id", id);
    introContainer.appendChild(t);
  }

  function hideText(id) {
    const t = document.getElementById(id);
    if (t) t.setAttribute("visible", "false");
  }
});
