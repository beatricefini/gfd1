document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const modelsContainer = document.getElementById("modelsContainer");
  const introContainer = document.getElementById("introTexts");
  const camera = document.querySelector("a-camera");

  const models = [
    "#piece1",
    "#piece2",
    "#piece3",
    "#piece4",
    "#piece5",
    "#piece6"
  ];

  const originalPositions = []; // Salvare posizioni Blender
  const originalScales = [];    // Salvare scale Blender

  const frameEntities = [];
  let started = false;
  let allFramesDisplayed = false;
  let sequenceStep = 0;

  // --- Step 0: mostra testi introduttivi ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.15 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    const startText = document.createElement("a-text");
    startText.setAttribute("value", "Tap to start");
    startText.setAttribute("align", "center");
    startText.setAttribute("color", "#FFD700");
    startText.setAttribute("position", "0 -0.05 0");
    startText.setAttribute("scale", "0.2 0.2 0.2");
    startText.setAttribute("wrap-count", "20");
    startText.setAttribute("id", "startText");
    introContainer.appendChild(startText);
  });

  // --- Click globale ---
  window.addEventListener("click", () => {
    if (!started) {
      // Nascondi testi introduttivi
      document.getElementById("introText").setAttribute("visible", "false");
      document.getElementById("startText").setAttribute("visible", "false");
      started = true;
      showFramesSequentially();
    } else if (allFramesDisplayed) {
      handleSequences();
    }
  });

  // --- Funzione: mostra cornici pop-up ---
  let currentIndex = 0;
  function showFramesSequentially() {
    if (currentIndex >= models.length) {
      allFramesDisplayed = true;
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
    piece.setAttribute("visible", "false");

    piece.addEventListener("model-loaded", () => {
      // Salva posizioni e scale originali
      originalPositions[currentIndex] = Object.assign({}, piece.getAttribute("position"));
      originalScales[currentIndex] = Object.assign({}, piece.getAttribute("scale"));

      piece.setAttribute("animation__pop", {
        property: "scale",
        from: "0 0 0",
        to: `${originalScales[currentIndex].x} ${originalScales[currentIndex].y} ${originalScales[currentIndex].z}`,
        dur: 400,
        easing: "easeOutElastic"
      });
      piece.setAttribute("visible", "true");
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showFramesSequentially, 800);
  }

  // --- Funzione: reset cornici alla vista completa ---
  function resetFramesView() {
    frameEntities.forEach((ent, i) => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("position", originalPositions[i]);
      ent.setAttribute("scale", originalScales[i]);
    });

    camera.setAttribute("position", "0 0 0");
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "true");
  }

  // --- Funzione: rimuove testi temporanei ---
  function clearTexts() {
    introContainer.querySelectorAll("a-text").forEach(t => {
      if (t.id !== "tapText") t.remove();
    });
  }

  // --- Gestione sequenze ---
  function handleSequences() {
    clearTexts();
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    if (sequenceStep === 0) {
      // Zoom su piece1 e piece2
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });
      frameEntities[0].setAttribute("position", { x: -0.1, y: 0, z: 0.2 });
      frameEntities[1].setAttribute("position", { x: 0.1, y: 0, z: 0.2 });
      frameEntities[0].setAttribute("scale", { x: 0.22, y: 0.22, z: 0.22 });
      frameEntities[1].setAttribute("scale", { x: 0.22, y: 0.22, z: 0.22 });

      const text1 = document.createElement("a-text");
      text1.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      text1.setAttribute("align", "center");
      text1.setAttribute("color", "#008000");
      text1.setAttribute("position", "0 -0.4 0");
      text1.setAttribute("scale", "0.15 0.15 0.15");
      text1.setAttribute("wrap-count", "30");
      introContainer.appendChild(text1);

      sequenceStep++;
    } else if (sequenceStep === 1) {
      const text2 = document.createElement("a-text");
      text2.setAttribute("value", "Sono le opere più importanti, da cui parte la storia");
      text2.setAttribute("align", "center");
      text2.setAttribute("color", "#008000");
      text2.setAttribute("position", "0 -0.5 0");
      text2.setAttribute("scale", "0.15 0.15 0.15");
      text2.setAttribute("wrap-count", "30");
      introContainer.appendChild(text2);

      sequenceStep++;
    } else if (sequenceStep === 2) {
      resetFramesView();
      sequenceStep++;
    } else if (sequenceStep === 3) {
      // Zoom su piece3,4,5
      frameEntities.forEach((ent, i) => { if (i < 2 || i > 4) ent.setAttribute("visible", "false"); });
      frameEntities[2].setAttribute("position", { x: -0.2, y: 0, z: 0.25 });
      frameEntities[3].setAttribute("position", { x: 0, y: 0, z: 0.25 });
      frameEntities[4].setAttribute("position", { x: 0.2, y: 0, z: 0.25 });
      [2,3,4].forEach(i => frameEntities[i].setAttribute("scale", { x: 0.22, y: 0.22, z: 0.22 }));

      const text3 = document.createElement("a-text");
      text3.setAttribute("value", "Ecco tre opere complementari");
      text3.setAttribute("align", "center");
      text3.setAttribute("color", "#008000");
      text3.setAttribute("position", "0 -0.4 0");
      text3.setAttribute("scale", "0.15 0.15 0.15");
      text3.setAttribute("wrap-count", "30");
      introContainer.appendChild(text3);

      sequenceStep++;
    } else if (sequenceStep === 4) {
      const text4 = document.createElement("a-text");
      text4.setAttribute("value", "Queste aggiungono varietà alla collezione");
      text4.setAttribute("align", "center");
      text4.setAttribute("color", "#008000");
      text4.setAttribute("position", "0 -0.5 0");
      text4.setAttribute("scale", "0.15 0.15 0.15");
      text4.setAttribute("wrap-count", "30");
      introContainer.appendChild(text4);

      sequenceStep++;
    } else if (sequenceStep === 5) {
      const text5 = document.createElement("a-text");
      text5.setAttribute("value", "Ognuna di esse arricchisce la narrazione visiva");
      text5.setAttribute("align", "center");
      text5.setAttribute("color", "#008000");
      text5.setAttribute("position", "0 -0.6 0");
      text5.setAttribute("scale", "0.15 0.15 0.15");
      text5.setAttribute("wrap-count", "30");
      introContainer.appendChild(text5);

      sequenceStep++;
    } else if (sequenceStep === 6) {
      resetFramesView();
      sequenceStep++;
    } else if (sequenceStep === 7) {
      // Zoom su piece6
      frameEntities.forEach((ent, i) => { if (i !== 5) ent.setAttribute("visible", "false"); });
      frameEntities[5].setAttribute("position", { x: 0, y: 0, z: 0.3 });
      frameEntities[5].setAttribute("scale", { x: 0.25, y: 0.25, z: 0.25 });

      const text6 = document.createElement("a-text");
      text6.setAttribute("value", "Infine, questa cornice conclusiva");
      text6.setAttribute("align", "center");
      text6.setAttribute("color", "#008000");
      text6.setAttribute("position", "0 -0.4 0");
      text6.setAttribute("scale", "0.15 0.15 0.15");
      text6.setAttribute("wrap-count", "30");
      introContainer.appendChild(text6);

      sequenceStep++;
    } else if (sequenceStep === 8) {
      resetFramesView();
      sequenceStep++;
    }
  }
});
