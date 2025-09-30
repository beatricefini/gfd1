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
      startText.setAttribute("scale", "0.18 0.18 0.18");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
      canTap = true;
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    const startText = document.getElementById("startText");
    if (!started && canTap) {
      const introText = document.getElementById("introText");
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

  // --- Finale con modello cinema ---
  function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldTexts();

    const baseHeight = -0.25;

    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model", "#cinemaModel");
    cinemaModel.setAttribute("position", { x: 0, y: -0.3, z: 0.5 });
    cinemaModel.setAttribute("scale", { x: 1.5, y: 1.5, z: 1.5 });
    cinemaModel.addEventListener("model-loaded", () => {
      console.log("✅ Cinema model caricato!");
      cinemaModel.setAttribute("visible", "true");
    });
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
    text1958.setAttribute("shader", "msdf");
    text1958.setAttribute("negate", "false");
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
    textRuins.setAttribute("shader", "msdf");
    textRuins.setAttribute("negate", "false");
    textRuins.setAttribute("animation__fadein", { property: "opacity", from: 0, to: 1, dur: 800, easing: "easeInQuad", delay: 1200 });
    introContainer.appendChild(textRuins);
  }

  // --- Gestione sequenze con testi aggiornati ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // --- Zoom 1 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });

      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });

      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // Testi Zoom 1
      const text1952 = document.createElement("a-text");
      text1952.setAttribute("value", "1952");
      text1952.setAttribute("align", "center");
      text1952.setAttribute("color", "#000000");
      text1952.setAttribute("font", "roboto");
      text1952.setAttribute("position", "0 0.35 0");
      text1952.setAttribute("scale", "0.25 0.25 0.25");
      text1952.setAttribute("wrap-count", "30");
      introContainer.appendChild(text1952);

      const textAlfred = document.createElement("a-text");
      textAlfred.setAttribute("value", "The cinema operator Alfred Friedrich Wolff made a proposal to build a\ncamera theater, a hotel, and a café-restaurant in Hereplein");
      textAlfred.setAttribute("align", "center");
      textAlfred.setAttribute("color", "#000000");
      textAlfred.setAttribute("font", "roboto");
      textAlfred.setAttribute("position", "0 0.2 0");
      textAlfred.setAttribute("scale", "0.18 0.18 0.18");
      textAlfred.setAttribute("wrap-count", "35");
      introContainer.appendChild(textAlfred);

      const textBUT = document.createElement("a-text");
      textBUT.setAttribute("value", "BUT");
      textBUT.setAttribute("align", "center");
      textBUT.setAttribute("color", "#000000");
      textBUT.setAttribute("font", "roboto");
      textBUT.setAttribute("position", "0 0.05 0");
      textBUT.setAttribute("scale", "0.25 0.25 0.25");
      textBUT.setAttribute("wrap-count", "30");
      introContainer.appendChild(textBUT);

      const textRefused = document.createElement("a-text");
      textRefused.setAttribute("value", "The municipality refused");
      textRefused.setAttribute("align", "center");
      textRefused.setAttribute("color", "#000000");
      textRefused.setAttribute("font", "roboto");
      textRefused.setAttribute("position", "0 -0.1 0");
      textRefused.setAttribute("scale", "0.18 0.18 0.18");
      textRefused.setAttribute("wrap-count", "35");
      introContainer.appendChild(textRefused);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      resetAllModels([0,1], () => { sequenceStep = 2; });

    } else if (sequenceStep === 2) {
      // Zoom 2
      frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });

      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });

      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // Testi Zoom 2
      const text1958Zoom2 = document.createElement("a-text");
      text1958Zoom2.setAttribute("value", "1958");
      text1958Zoom2.setAttribute("align", "center");
      text1958Zoom2.setAttribute("color", "#000000");
      text1958Zoom2.setAttribute("font", "roboto");
      text1958Zoom2.setAttribute("position", "0 0.35 0");
      text1958Zoom2.setAttribute("scale", "0.25 0.25 0.25");
      text1958Zoom2.setAttribute("wrap-count", "30");
      introContainer.appendChild(text1958Zoom2);

      const textAlva = document.createElement("a-text");
      textAlva.setAttribute("value", "Some buttresses of the Alva castle, built during the Eighty Years' War,\nwere found in the construction pit of the cinema.");
      textAlva.setAttribute("align", "center");
      textAlva.setAttribute("color", "#000000");
      textAlva.setAttribute("font", "roboto");
      textAlva.setAttribute("position", "0 0.2 0");
      textAlva.setAttribute("scale", "0.18 0.18 0.18");
      textAlva.setAttribute("wrap-count", "35");
      introContainer.appendChild(textAlva);

      sequenceStep = 3;

    } else if (sequenceStep === 3) {
      resetAllModels([0,1], () => { sequenceStep = 4; });

    } else if (sequenceStep === 4) {
      // Zoom 3
      frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });

      frameEntities[5].setAttribute("animation__pos_zoom", { property:"position", to:"0.3 -0.15 0.35", dur:800, easing:"easeInOutQuad" });
      frameEntities[5].setAttribute("animation__scale_zoom", { property:"scale", to:"1.7 1.7 1.7", dur:800, easing:"easeInOutQuad" });

      camera.setAttribute("animation__cam_zoom", { property:"position", to:"0 0 0.6", dur:800, easing:"easeInOutQuad" });

      // Testi Zoom 3
      const text17th = document.createElement("a-text");
      text17th.setAttribute("value", "17th Century");
      text17th.setAttribute("align", "center");
      text17th.setAttribute("color", "#000000");
      text17th.setAttribute("font", "roboto");
      text17th.setAttribute("position", "0 0.35 0");
      text17th.setAttribute("scale", "0.25 0.25 0.25");
      text17th.setAttribute("wrap-count", "30");
      introContainer.appendChild(text17th);

      const textRampart = document.createElement("a-text");
      textRampart.setAttribute("value", "A rampart was built, incorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively,\nto allow for the construction of Hereplein square and the canals.");
      textRampart.setAttribute("align", "center");
      textRampart.setAttribute("color", "#000000");
      textRampart.setAttribute("font", "roboto");
      textRampart.setAttribute("position", "0 0.2 0");
      textRampart.setAttribute("scale", "0.18 0.18 0.18");
      textRampart.setAttribute("wrap-count", "35");
      introContainer.appendChild(textRampart);

      sequenceStep = 5;

    } else if (sequenceStep === 5) {
      resetAllModels([0,1,2,3,4,5], () => { 
        const tapText = document.getElementById("tapText");
        if (tapText) tapText.setAttribute("visible", "false");

        setTimeout(() => {
          frameEntities.forEach(ent => {
            ent.setAttribute("animation__popout", { property: "scale", to: "0 0 0", dur: 600, easing: "easeInQuad" });
          });

          setTimeout(() => {
            frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
            sequenceStep = 6;
            showFinalCinema();
          }, 600);
        }, 2000);
      });
    }
  }
});

