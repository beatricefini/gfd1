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

    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Fragments is an Augmented Reality experience that retraces the history\nof the Camera Bioscoop building. The work is composed of four chronological\ninteractive experiences, guiding visitors through different moments of its past.\nStep by step, the audience is accompanied through the entrance of the\nCamera Bioscoop, where history and architecture come alive in a layered,\nimmersive narrative.");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#000000");
    introText.setAttribute("font", "roboto");
    introText.setAttribute("position", "0 0.3 0");
    introText.setAttribute("scale", "0.18 0.18 0.18"); // leggermente più grande
    introText.setAttribute("wrap-count", "30");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#000000"); // tap nero
      startText.setAttribute("font", "roboto");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.18 0.18 0.18"); // più piccolo
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    const startText = document.getElementById("startText");
    if (!started) {
      if (!startText) return;

      const introText = document.getElementById("introText");
      if (introText) introText.setAttribute("visible", "false");
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
      tapText.setAttribute("color", "#000000"); // tap nero
      tapText.setAttribute("font", "roboto");
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
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach((t) => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;

    frameEntities.forEach((ent, i) => {
      if (!activeIndices.includes(i)) ent.setAttribute("visible", "false");
    });

    activeIndices.forEach((i) => {
      const ent = frameEntities[i];
      const orig = originalTransforms[i];
      if (!ent || !orig) return;

      ent.setAttribute("animation__backpos", {
        property: "position",
        to: `${orig.position.x} ${orig.position.y} ${orig.position.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
      ent.setAttribute("animation__backscale", {
        property: "scale",
        to: `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
    });

    setTimeout(() => {
      frameEntities.forEach((ent, i) => {
        const orig = originalTransforms[i];
        if (orig) {
          ent.setAttribute("position", `${orig.position.x} ${orig.position.y} ${orig.position.z}`);
          ent.setAttribute("scale", `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`);
        }
        ent.setAttribute("visible", "true");
      });

      camera.setAttribute("animation__camreset", {
        property: "position",
        to: "0 0 0",
        dur: dur,
        easing: "easeInOutQuad"
      });

      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "true");

      if (typeof callback === "function") callback();
    }, dur + 50);
  }

  // --- Gestione sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // --- PRIMO ZOOM (piece1 e piece2) ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      const dateText = document.createElement("a-text");
      dateText.setAttribute("value", "1952");
      dateText.setAttribute("align", "center");
      dateText.setAttribute("color", "#000000");
      dateText.setAttribute("font", "roboto");
      dateText.setAttribute("position", "0 0.25 0");
      dateText.setAttribute("scale", "0.3 0.3 0.3");
      introContainer.appendChild(dateText);

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "The cinema operator Alfred Friedrich Wolff made a proposal to build a camera theater,\na hotel, and a café-restaurant in Hereplein.");
      infoText.setAttribute("align", "center");
      infoText.setAttribute("color", "#000000");
      infoText.setAttribute("font", "roboto");
      infoText.setAttribute("position", "0 -0.05 0");
      infoText.setAttribute("scale", "0.18 0.18 0.18");
      infoText.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText);

      sequenceStep = 1;
    }
    // --- SECONDO ZOOM (piece1 e piece2, "BUT") ---
    else if (sequenceStep === 1) {
      resetAllModels([0,1], () => {
        clearOldTexts();

        const butText = document.createElement("a-text");
        butText.setAttribute("value", "BUT");
        butText.setAttribute("align", "center");
        butText.setAttribute("color", "#000000");
        butText.setAttribute("font", "roboto");
        butText.setAttribute("position", "0 0.25 0");
        butText.setAttribute("scale", "0.3 0.3 0.3");
        introContainer.appendChild(butText);

        const infoText2 = document.createElement("a-text");
        infoText2.setAttribute("value", "The municipality refused.");
        infoText2.setAttribute("align", "center");
        infoText2.setAttribute("color", "#000000");
        infoText2.setAttribute("font", "roboto");
        infoText2.setAttribute("position", "0 -0.05 0");
        infoText2.setAttribute("scale", "0.18 0.18 0.18");
        introContainer.appendChild(infoText2);

        sequenceStep = 2;
      });
    }
    // --- ZOOM SU PIECE3 4 5 ---
    else if (sequenceStep === 2) {
      frameEntities.forEach((ent, i) => { if (i < 2 || i > 4) ent.setAttribute("visible", "false"); });

      frameEntities[2].setAttribute("animation__pos_zoom", { property: "position", to: "-0.05 0.2 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[3].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.45 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[4].setAttribute("animation__pos_zoom", { property: "position", to: "0.15 0.3 0.35", dur: 800, easing: "easeInOutQuad" });
      [2,3,4].forEach(i => frameEntities[i].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" }));
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

      const dateText2 = document.createElement("a-text");
      dateText2.setAttribute("value", "1958");
      dateText2.setAttribute("align", "center");
      dateText2.setAttribute("color", "#000000");
      dateText2.setAttribute("font", "roboto");
      dateText2.setAttribute("position", "0 0.25 0");
      dateText2.setAttribute("scale", "0.3 0.3 0.3");
      introContainer.appendChild(dateText2);

      const infoText3 = document.createElement("a-text");
      infoText3.setAttribute("value", "Some buttresses of the Alva castele, built during the Eighty Years' War,\nwere found in the construction pit of the cinema.");
      infoText3.setAttribute("align", "center");
      infoText3.setAttribute("color", "#000000");
      infoText3.setAttribute("font", "roboto");
      infoText3.setAttribute("position", "0 -0.05 0");
      infoText3.setAttribute("scale", "0.18 0.18 0.18");
      infoText3.setAttribute("wrap-count", "30");
      introContainer.appendChild(infoText3);

      sequenceStep = 3;
    }
    // --- ZOOM SU PIECE6 ---
    else if (sequenceStep === 3) {
      resetAllModels([2,3,4], () => {
        frameEntities.forEach((ent, i) => { if (i !== 5) ent.setAttribute("visible", "false"); });

        frameEntities[5].setAttribute("animation__pos_zoom", { property: "position", to: "0.3 -0.15 0.35", dur: 800, easing: "easeInOutQuad" });
        frameEntities[5].setAttribute("animation__scale_zoom", { property: "scale", to: "1.7 1.7 1.7", dur: 800, easing: "easeInOutQuad" });
        camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

        const dateText3 = document.createElement("a-text");
        dateText3.setAttribute("value", "17th century");
        dateText3.setAttribute("align", "center");
        dateText3.setAttribute("color", "#000000");
        dateText3.setAttribute("font", "roboto");
        dateText3.setAttribute("position", "0 0.25 0");
        dateText3.setAttribute("scale", "0.3 0.3 0.3");
        introContainer.appendChild(dateText3);

        const infoText4 = document.createElement("a-text");
        infoText4.setAttribute("value", "A rampart was built, incorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively,\nto allow for the construction of Hereplein square and the canals.");
        infoText4.setAttribute("align", "center");
        infoText4.setAttribute("color", "#000000");
        infoText4.setAttribute("font", "roboto");
        infoText4.setAttribute("position", "0 -0.05 0");
        infoText4.setAttribute("scale", "0.18 0.18 0.18");
        infoText4.setAttribute("wrap-count", "30");
        introContainer.appendChild(infoText4);

        sequenceStep = 4;
      });
    }
    // --- Ritorno alla vista completa delle cornici ---
    else if (sequenceStep === 4) {
      resetAllModels([], () => {
        clearOldTexts();
        const tapText = document.getElementById("tapText");
        if (tapText) tapText.setAttribute("visible", "true");
        sequenceStep = 5; // continua con eventuali altre sequenze
      });
    }
  }

  // --- Funzione scena finale con modello cinema ---
  function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldTexts();

    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model", "#cinemaModel");
    cinemaModel.setAttribute("position", { x: 0, y: -0.3, z: 0.5 });
    cinemaModel.setAttribute("scale", { x: 1.5, y: 1.5, z: 1.5 });
    cinemaModel.addEventListener("model-loaded", () => cinemaModel.setAttribute("visible", "true"));
    modelsContainer.appendChild(cinemaModel);

    const text1958 = document.createElement("a-text");
    text1958.setAttribute("value", "1958");
    text1958.setAttribute("align", "center");
    text1958.setAttribute("anchor", "center");
    text1958.setAttribute("color", "#000000");
    text1958.setAttribute("font", "roboto");
    text1958.setAttribute("position", { x: 0, y: 0.25, z: 0.5 });
    text1958.setAttribute("scale", "0.5 0.5 0.5");
    text1958.setAttribute("wrap-count", "20");
    introContainer.appendChild(text1958);

    const textRuins = document.createElement("a-text");
    textRuins.setAttribute("value", "Ruins");
    textRuins.setAttribute("align", "center");
    textRuins.setAttribute("anchor", "center");
    textRuins.setAttribute("color", "#000000");
    textRuins.setAttribute("font", "roboto");
    textRuins.setAttribute("position", { x: 0, y: 0.15, z: 0.5 });
    textRuins.setAttribute("scale", "0.35 0.35 0.35");
    textRuins.setAttribute("wrap-count", "20");
    introContainer.appendChild(textRuins);
  }
});

