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
    introText.setAttribute("scale", "0.20 0.20 0.20"); // font leggermente più grande
    introText.setAttribute("wrap-count", "35");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#000000"); // nero
      startText.setAttribute("font", "roboto");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.18 0.18 0.18"); // leggermente più piccolo
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
      tapText.setAttribute("color", "#000000");
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

  // --- Sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");
    clearOldTexts();

    // --- Step 0: Zoom piece1 & 2 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // Testo 1952 + sotto
      const text1952 = document.createElement("a-text");
      text1952.setAttribute("value", "1952");
      text1952.setAttribute("align", "center");
      text1952.setAttribute("color", "#000000");
      text1952.setAttribute("font", "roboto");
      text1952.setAttribute("position", "0 0.35 0"); // leggermente più in alto
      text1952.setAttribute("scale", "0.35 0.35 0.35"); // più grande
      introContainer.appendChild(text1952);

      const text1952Desc = document.createElement("a-text");
      text1952Desc.setAttribute("value",
        "The cinema operator Alfred Friedrich Wolff made a proposal to build a camera theater,\na hotel, and a café-restaurant in Hereplein"
      );
      text1952Desc.setAttribute("align", "center");
      text1952Desc.setAttribute("color", "#000000");
      text1952Desc.setAttribute("font", "roboto");
      text1952Desc.setAttribute("position", "0 -0.1 0");
      text1952Desc.setAttribute("scale", "0.18 0.18 0.18");
      text1952Desc.setAttribute("wrap-count", "30");
      introContainer.appendChild(text1952Desc);

      sequenceStep = 1;

    // --- Step 1: Zoom piece3,4,5 ---
    } else if (sequenceStep === 1) {
      resetAllModels([0,1], () => {
        frameEntities.forEach((ent,i)=>{ if(i<2 || i>4) ent.setAttribute("visible","false"); });

        frameEntities[2].setAttribute("animation__pos_zoom", { property: "position", to: "-0.05 0.2 0.35", dur: 800, easing: "easeInOutQuad" });
        frameEntities[3].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.45 0.35", dur: 800, easing: "easeInOutQuad" });
        frameEntities[4].setAttribute("animation__pos_zoom", { property: "position", to: "0.15 0.3 0.35", dur: 800, easing: "easeInOutQuad" });
        [2,3,4].forEach(i => frameEntities[i].setAttribute("animation__scale_zoom", {
          property: "scale",
          to: "1.2 1.2 1.2",
          dur: 800, easing: "easeInOutQuad"
        }));
        camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

        // Testo 1958
        const text1958 = document.createElement("a-text");
        text1958.setAttribute("value", "1958");
        text1958.setAttribute("align", "center");
        text1958.setAttribute("color", "#000000");
        text1958.setAttribute("font", "roboto");
        text1958.setAttribute("position", "0 0.35 0"); // leggermente più alto
        text1958.setAttribute("scale", "0.35 0.35 0.35"); // più grande
        introContainer.appendChild(text1958);

        const text1958Desc = document.createElement("a-text");
        text1958Desc.setAttribute("value",
          "Some buttresses of the Alva castele, built during the Eighty Years' War,\nwere found in the construction pit of the cinema."
        );
        text1958Desc.setAttribute("align", "center");
        text1958Desc.setAttribute("color", "#000000");
        text1958Desc.setAttribute("font", "roboto");
        text1958Desc.setAttribute("position", "0 -0.1 0");
        text1958Desc.setAttribute("scale", "0.18 0.18 0.18");
        text1958Desc.setAttribute("wrap-count", "30");
        introContainer.appendChild(text1958Desc);

        sequenceStep = 2;
      });

    // --- Step 2: Zoom piece6 ---
    } else if (sequenceStep === 2) {
      resetAllModels([2,3,4], () => {
        frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });

        frameEntities[5].setAttribute("animation__pos_zoom", { property: "position", to: "0 0.05 0.35", dur: 800, easing: "easeInOutQuad" });
        frameEntities[5].setAttribute("animation__scale_zoom", { property: "scale", to: "1.7 1.7 1.7", dur: 800, easing: "easeInOutQuad" });
        camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

        // Testo 17th century
        const text17th = document.createElement("a-text");
        text17th.setAttribute("value", "17th century");
        text17th.setAttribute("align", "center");
        text17th.setAttribute("color", "#000000");
        text17th.setAttribute("font", "roboto");
        text17th.setAttribute("position", "0 0.35 0"); // leggermente più alto
        text17th.setAttribute("scale", "0.35 0.35 0.35"); // più grande
        introContainer.appendChild(text17th);

        const text17thDesc = document.createElement("a-text");
        text17thDesc.setAttribute("value",
          "A rampart was built, incorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively,\nto allow for the construction of Hereplein square and the canals."
        );
        text17thDesc.setAttribute("align", "center");
        text17thDesc.setAttribute("color", "#000000");
        text17thDesc.setAttribute("font", "roboto");
        text17thDesc.setAttribute("position", "0 -0.1 0");
        text17thDesc.setAttribute("scale", "0.18 0.18 0.18");
        text17thDesc.setAttribute("wrap-count", "30");
        introContainer.appendChild(text17thDesc);

        sequenceStep = 3;
      });

    // --- Step 3: Ritorno alla vista completa cornici ---
    } else if (sequenceStep === 3) {
      resetAllModels([0,1,2,3,4,5], () => {
        // tutte le cornici tornano visibili e posizione originale
        sequenceStep = 4;
      });
    }
  }
});

