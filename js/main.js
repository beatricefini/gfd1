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
  const frameEntities = [];
  let sequenceStep = 0;
  const originalTransforms = {};

  // --- Intro / target found ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Intro immagine (prima)
    const introImg = document.createElement("a-image");
    introImg.setAttribute("src", "images/intro_text.png");
    introImg.setAttribute("position", "0 0 0");
    introImg.setAttribute("width", 1.2);
    introImg.setAttribute("height", "auto");
    introContainer.appendChild(introImg);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.5 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 500);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    const startText = document.getElementById("startText");
    if (!started && startText) {
      const introImg = introContainer.querySelector("a-image");
      if (introImg) introImg.setAttribute("visible", "false");
      startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Show models one by one (pop) ---
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

    const idx = currentIndex;
    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[idx]);
    piece.setAttribute("visible", "false");

    piece.addEventListener("model-loaded", () => {
      const pos = piece.getAttribute("position");
      const scale = piece.getAttribute("scale");
      originalTransforms[idx] = {
        position: { x: pos.x, y: pos.y, z: pos.z },
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
  const frameEntities = [];
  let sequenceStep = 0;
  let canTap = false;
  const originalTransforms = {};

  // --- Intro / target found ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introImg = document.createElement("a-image");
    introImg.setAttribute("src", "images/intro_text.png");
    introImg.setAttribute("position", "0 0.25 0");
    introImg.setAttribute("scale", "0.5 0.5 0.5");
    introImg.setAttribute("id", "introImg");
    introContainer.appendChild(introImg);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.15 0.15 0.15");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
      canTap = true;
    }, 1000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    if (!started && canTap) {
      const introImg = document.getElementById("introImg");
      const startText = document.getElementById("startText");
      if (introImg) introImg.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Show models one by one ---
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

    const idx = currentIndex;
    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[idx]);
    piece.setAttribute("visible", "false");

    piece.addEventListener("model-loaded", () => {
      const pos = piece.getAttribute("position");
      const scale = piece.getAttribute("scale");
      originalTransforms[idx] = {
        position: { x: pos.x, y: pos.y, z: pos.z },
        scale: { x: scale.x, y: scale.y, z: scale.z }
      };

      piece.setAttribute("animation__pop", {
        property: "scale",
        from: "0 0 0",
        to: `${scale.x} ${scale.y} ${scale.z}`,
        dur: 500,
        easing: "easeOutElastic"
      });
      piece.setAttribute("visible", "true");
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showAllModelsSequentially, 700);
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text, a-image");
    oldTexts.forEach(t => { if (t.id !== "tapText") t.remove(); });
  }

  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;
    frameEntities.forEach((ent, i) => { if (!activeIndices.includes(i)) ent.setAttribute("visible", "false"); });

    activeIndices.forEach(i => {
      const ent = frameEntities[i];
      const orig = originalTransforms[i];
      if (!ent || !orig) return;
      ent.setAttribute("animation__backpos", { property: "position", to: `${orig.position.x} ${orig.position.y} ${orig.position.z}`, dur: dur, easing: "easeInOutQuad" });
      ent.setAttribute("animation__backscale", { property: "scale", to: `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`, dur: dur, easing: "easeInOutQuad" });
    });

    setTimeout(() => {
      frameEntities.forEach((ent, i) => {
        const orig = originalTransforms[i];
        if (orig) { ent.setAttribute("position", `${orig.position.x} ${orig.position.y} ${orig.position.z}`); ent.setAttribute("scale", `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`); }
        ent.setAttribute("visible", "true");
      });
      camera.setAttribute("animation__camreset", { property: "position", to: "0 0 0", dur: dur, easing: "easeInOutQuad" });
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");
      if (typeof callback === "function") callback();
    }, dur + 50);
  }

  // --- Sequences ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");
    clearOldTexts();

    // --- SEQUENZA 1: zoom su piece 0 e 1 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });
      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // **Mostra immagine text1 al posto del testo**
      const textImg = document.createElement("a-image");
      textImg.setAttribute("src", "images/text1.png");
      textImg.setAttribute("position", "0 0.2 0.5");
      textImg.setAttribute("scale", "0.5 0.5 0.5");
      textImg.setAttribute("opacity", "0");
      textImg.setAttribute("animation__fadein", { property: "opacity", from: 0, to: 1, dur: 800, easing: "easeInQuad", delay: 200 });
      introContainer.appendChild(textImg);

      sequenceStep = 1;
    } else if (sequenceStep >= 1) {
      // segue tutte le sequenze successive come prima
      // ...puoi reinserire tutto il resto della gestione sequenze e finale cinema
      showFinalCinema(); // rimane come nel main originale
    }
  }

  // --- Finale con modello cinema ---
  function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldTexts();

    const baseHeight = -0.25;

    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model", "#cinemaModel");
    cinemaModel.setAttribute("position", { x: 0, y: -0.3, z: 0.5 });
    cinemaModel.setAttribute("scale", { x: 1.5, y: 1.5, z: 1.5 });
    cinemaModel.addEventListener("model-loaded", () => { cinemaModel.setAttribute("visible", "true"); });
    modelsContainer.appendChild(cinemaModel);

    const text1958 = document.createElement("a-text");
    text1958.setAttribute("value", "1958");
    text1958.setAttribute("align", "center");
    text1958.setAttribute("anchor", "center");
    text1958.setAttribute("color", "#000000");
    text1958.setAttribute("font", "roboto");
    text1958.setAttribute("position", { x: 0, y: baseHeight + 0.5, z: 0.5 });
    text1958.setAttribute("scale", "0.5 0.5 0.5");
    text1958.setAttribute("opacity", "0");
    text1958.setAttribute("animation__fadein", { property: "opacity", from: 0, to: 1, dur: 800, easing: "easeInQuad", delay: 200 });
    introContainer.appendChild(text1958);

    const textRuins = document.createElement("a-text");
    textRuins.setAttribute("value", "Ruins");
    textRuins.setAttribute("align", "center");
    textRuins.setAttribute("anchor", "center");
    textRuins.setAttribute("color", "#000000");
    textRuins.setAttribute("font", "roboto");
    textRuins.setAttribute("position", { x: 0, y: baseHeight + 0.4, z: 0.5 });
    textRuins.setAttribute("scale", "0.35 0.35 0.35");
    textRuins.setAttribute("opacity", "0");
    textRuins.setAttribute("animation__fadein", { property: "opacity", from: 0, to: 1, dur: 800, easing: "easeInQuad", delay: 1200 });
    introContainer.appendChild(textRuins);
  }
});
