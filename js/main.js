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

    // Intro come immagine
    const introImage = document.createElement("a-image");
    introImage.setAttribute("src", "images/intro_text.png");
    introImage.setAttribute("position", "0 0.25 0");
    introImage.setAttribute("scale", "1.5 1.5 1.5");
    introImage.setAttribute("id", "introImage");
    introContainer.appendChild(introImage);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#000000");
      startText.setAttribute("font", "roboto");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.18 0.18 0.18");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      startText.setAttribute("font-weight", "bold");
      introContainer.appendChild(startText);
      canTap = true;
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    if (!started && canTap) {
      const introImage = document.getElementById("introImage");
      const startText = document.getElementById("startText");
      if (introImage) introImage.setAttribute("visible", "false");
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
      tapText.setAttribute("scale", "0.18 0.18 0.18");
      tapText.setAttribute("wrap-count", "20");
      tapText.setAttribute("id", "tapText");
      tapText.setAttribute("font-weight", "bold");
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

  function clearOldVisuals() {
    const old = introContainer.querySelectorAll("a-text, a-image");
    old.forEach((t) => {
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
    clearOldVisuals();

    // Step 0
    if (sequenceStep === 0) {
      frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800 });

      const img = document.createElement("a-image");
      img.setAttribute("src", "images/intro_text.png");
      img.setAttribute("position", "0 0.4 0");
      img.setAttribute("scale", "1.2 1.2 1.2");
      introContainer.appendChild(img);

      sequenceStep++;
      return;
    }

    // Step 1: ritorno
    if (sequenceStep === 1) {
      resetAllModels([], () => {});
      sequenceStep++;
      return;
    }

    // Step 2
    if (sequenceStep === 2) {
      frameEntities.forEach((ent,i)=>{ if(i!==2) ent.setAttribute("visible","false"); });

      const img = document.createElement("a-image");
      img.setAttribute("src", "images/intro_text.png");
      img.setAttribute("position", "0 0.4 0");
      img.setAttribute("scale", "1.2 1.2 1.2");
      introContainer.appendChild(img);

      sequenceStep++;
      return;
    }

    // Step 3: ritorno
    if (sequenceStep === 3) {
      resetAllModels([], () => {});
      sequenceStep++;
      return;
    }

    // Step 4
    if (sequenceStep === 4) {
      frameEntities.forEach((ent,i)=>{ if(i!==3) ent.setAttribute("visible","false"); });

      const img = document.createElement("a-image");
      img.setAttribute("src", "images/intro_text.png");
      img.setAttribute("position", "0 0.4 0");
      img.setAttribute("scale", "1.2 1.2 1.2");
      introContainer.appendChild(img);

      sequenceStep++;
      return;
    }

    // Step 5: ritorno
    if (sequenceStep === 5) {
      resetAllModels([], () => {});
      sequenceStep++;
      return;
    }
  }
});


