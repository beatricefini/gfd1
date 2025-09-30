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

    const introText = document.createElement("a-text");
    introText.setAttribute("value",
      "Fragments is an Augmented Reality experience that retraces the history\nof the Camera Bioscoop building.\n\nThe work is composed of four chronological interactive experiences,\nguiding visitors through different moments of its past.\n\nStep by step, the audience is accompanied through the entrance of the\nCamera Bioscoop, where history and architecture come alive in a layered,\nimmersive narrative."
    );
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#000000");
    introText.setAttribute("font", "roboto");
    introText.setAttribute("position", "0 0.25 0");
    introText.setAttribute("scale", "0.18 0.18 0.18");
    introText.setAttribute("wrap-count", "35");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
      canTap = true;
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    if (!started && canTap) {
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

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

  // --- Sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");
    clearOldTexts();

    // --- Sequenza 1 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });

      // Modello zoom
      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // Testo 1952
      const text1952 = document.createElement("a-text");
      text1952.setAttribute("value", "1952");
      text1952.setAttribute("align", "center");
      text1952.setAttribute("anchor", "center");
      text1952.setAttribute("color", "#000000");
      text1952.setAttribute("font", "roboto");
      text1952.setAttribute("position", { x:0, y:0.3, z:0.5 });
      text1952.setAttribute("scale", "0.5 0.5 0.5");
      text1952.setAttribute("shader","msdf");
      introContainer.appendChild(text1952);

      // Testo sequenza 1 descrizione
      const seq1Text = document.createElement("a-text");
      seq1Text.setAttribute("value", "The cinema operator Alfred Friedrich Wolff made a proposal to build a camera theater,\na hotel, and a café-restaurant in Hereplein.");
      seq1Text.setAttribute("align", "center");
      seq1Text.setAttribute("anchor", "center");
      seq1Text.setAttribute("color", "#000000");
      seq1Text.setAttribute("font", "roboto");
      seq1Text.setAttribute("position", { x:0, y:0, z:0.5 });
      seq1Text.setAttribute("scale", "0.25 0.25 0.25");
      seq1Text.setAttribute("wrap-count","35");
      introContainer.appendChild(seq1Text);

      // Testo BUT
      const textBUT = document.createElement("a-text");
      textBUT.setAttribute("value", "BUT");
      textBUT.setAttribute("align", "center");
      textBUT.setAttribute("anchor", "center");
      textBUT.setAttribute("color", "#000000");
      textBUT.setAttribute("font", "roboto");
      textBUT.setAttribute("position", { x:0, y:-0.25, z:0.5 });
      textBUT.setAttribute("scale", "0.5 0.5 0.5");
      textBUT.setAttribute("shader","msdf");
      introContainer.appendChild(textBUT);

      // Testo municipility refused
      const textRefused = document.createElement("a-text");
      textRefused.setAttribute("value", "the municipality refused");
      textRefused.setAttribute("align", "center");
      textRefused.setAttribute("anchor", "center");
      textRefused.setAttribute("color", "#000000");
      textRefused.setAttribute("font", "roboto");
      textRefused.setAttribute("position", { x:0, y:-0.45, z:0.5 });
      textRefused.setAttribute("scale", "0.25 0.25 0.25");
      textRefused.setAttribute("wrap-count","35");
      introContainer.appendChild(textRefused);

      sequenceStep = 1;
    }

    // --- Sequenza 2 ---
    else if (sequenceStep === 1) {
      resetAllModels([0,1], () => { 
        frameEntities.forEach((ent,i)=>{ent.setAttribute("visible","false")});
        const baseY = -0.2;

        const text1958 = document.createElement("a-text");
        text1958.setAttribute("value", "1958");
        text1958.setAttribute("align", "center");
        text1958.setAttribute("anchor", "center");
        text1958.setAttribute("color", "#000000");
        text1958.setAttribute("font", "roboto");
        text1958.setAttribute("position", { x:0, y:baseY+0.35, z:0.5 });
        text1958.setAttribute("scale", "0.5 0.5 0.5");
        text1958.setAttribute("shader","msdf");
        introContainer.appendChild(text1958);

        const seq2Text = document.createElement("a-text");
        seq2Text.setAttribute("value", "Some buttresses of the Alva castele, built during the Eighty Years' War,\nwere found in the construction pit of the cinema.");
        seq2Text.setAttribute("align", "center");
        seq2Text.setAttribute("anchor", "center");
        seq2Text.setAttribute("color", "#000000");
        seq2Text.setAttribute("font", "roboto");
        seq2Text.setAttribute("position", { x:0, y:baseY, z:0.5 });
        seq2Text.setAttribute("scale", "0.25 0.25 0.25");
        seq2Text.setAttribute("wrap-count","35");
        introContainer.appendChild(seq2Text);

        sequenceStep = 2;
      });
    }

    // --- Sequenza 3 ---
    else if (sequenceStep === 2) {
      resetAllModels([], () => {
        const baseY3 = -0.2;

        const seq3Text = document.createElement("a-text");
        seq3Text.setAttribute("value", "At the beginning of the 17th century, a rampart was built,\nincorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively,\nto allow for the construction of Hereplein square and the canals.");
        seq3Text.setAttribute("align", "center");
        seq3Text.setAttribute("anchor", "center");
        seq3Text.setAttribute("color", "#000000");
        seq3Text.setAttribute("font", "roboto");
        seq3Text.setAttribute("position", { x:0, y:baseY3, z:0.5 });
        seq3Text.setAttribute("scale", "0.25 0.25 0.25");
        seq3Text.setAttribute("wrap-count","35");
        introContainer.appendChild(seq3Text);

        sequenceStep = 3;
      });
    }

    // --- Finale con modello cinema ---
    else if (sequenceStep === 3) {
      frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
      clearOldTexts();

      const baseHeight = -0.25;
      const cinemaModel = document.createElement("a-entity");
      cinemaModel.setAttribute("gltf-model", "#cinemaModel");
      cinemaModel.setAttribute("position", { x:0, y:-0.3, z:0.5 });
      cinemaModel.setAttribute("scale", { x:1.5, y:1.5, z:1.5 });
      cinemaModel.addEventListener("model-loaded", () => {
        cinemaModel.setAttribute("visible", "true");
      });
      modelsContainer.appendChild(cinemaModel);

      const text1958Final = document.createElement("a-text");
      text1958Final.setAttribute("value", "1958");
      text1958Final.setAttribute("align", "center");
      text1958Final.setAttribute("anchor", "center");
      text1958Final.setAttribute("color", "#000000");
      text1958Final.setAttribute("font", "roboto");
      text1958Final.setAttribute("position", { x:0, y:baseHeight+0.5, z:0.5 });
      text1958Final.setAttribute("scale", "0.5 0.5 0.5");
      text1958Final.setAttribute("shader","msdf");
      introContainer.appendChild(text1958Final);

      const textRuins = document.createElement("a-text");
      textRuins.setAttribute("value", "Ruins");
      textRuins.setAttribute("align", "center");
      textRuins.setAttribute("anchor", "center");
      textRuins.setAttribute("color", "#000000");
      textRuins.setAttribute("font", "roboto");
      textRuins.setAttribute("position", { x:0, y:baseHeight+0.4, z:0.5 });
      textRuins.setAttribute("scale", "0.35 0.35 0.35");
      textRuins.setAttribute("shader","msdf");
      introContainer.appendChild(textRuins);

      sequenceStep = 4;
    }
  }
});

