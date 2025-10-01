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

    // Introduce the AR experience with an image instead of text
    const introImage = document.createElement("a-image");
    introImage.setAttribute("src", "images/intro_text.png");
    introImage.setAttribute("position", "0 0.25 0");
    introImage.setAttribute("scale", "0.5 0.5 0.5");
    introImage.setAttribute("id", "introImage");
    introContainer.appendChild(introImage);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to continue");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.16 0.16 0.16");
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
      const introImage = document.getElementById("introImage");
      if (introImage) introImage.setAttribute("visible", "false");
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

  function clearOldImages() {
    const oldImages = introContainer.querySelectorAll("a-image");
    oldImages.forEach(img => img.remove());
  }

  // --- Reset models / camera ---
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

  // --- Handle sequences ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldImages();

    // --- STEP 0: Zoom piece1 & piece2 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      // --- Image 1 ---
      const img1 = document.createElement("a-image");
      img1.setAttribute("src", "images/intro_text.png");
      img1.setAttribute("position", "0 0.25 0");
      img1.setAttribute("scale", "0.5 0.5 0.5");
      introContainer.appendChild(img1);

      sequenceStep = 1;
    }
    // --- STEP 1: Show second image and then return ---
    else if (sequenceStep === 1) {
      const img2 = document.createElement("a-image");
      img2.setAttribute("src", "images/intro_text.png");
      img2.setAttribute("position", "0 0.25 0");
      img2.setAttribute("scale", "0.5 0.5 0.5");
      introContainer.appendChild(img2);

      sequenceStep = 2;
    }
    // --- STEP 2: Return to full view ---
    else if (sequenceStep === 2) {
      resetAllModels([0,1], () => { sequenceStep = 3; });
    }

    // --- STEP 3: Zoom piece4 & piece5 ---
    else if (sequenceStep === 3) {
      frameEntities.forEach((ent,i)=>{ if(i<3 || i>4) ent.setAttribute("visible","false"); });

      frameEntities[3].setAttribute("animation__pos_zoom", { property: "position", to: "-0.05 0.2 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[4].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.45 0.35", dur: 800, easing: "easeInOutQuad" });
      [3,4].forEach(i=>frameEntities[i].setAttribute("animation__scale_zoom",{ property:"scale", to:"1.2 1.2 1.2", dur:800, easing:"easeInOutQuad" }));
      camera.setAttribute("animation__cam_zoom",{ property:"position", to:"0 0 0.6", dur:800, easing:"easeInOutQuad" });

      // --- Image ---
      const img3 = document.createElement("a-image");
      img3.setAttribute("src", "images/intro_text.png");
      img3.setAttribute("position", "0 0.25 0");
      img3.setAttribute("scale", "0.5 0.5 0.5");
      introContainer.appendChild(img3);

      sequenceStep = 4;
    }

    // --- STEP 4: Zoom piece6 and final image ---
    else if (sequenceStep === 4) {
      frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });

      frameEntities[5].setAttribute("animation__pos_zoom",{ property:"position", to:"0.3 -0.15 0.35", dur:800, easing:"easeInOutQuad" });
      frameEntities[5].setAttribute("animation__scale_zoom",{ property:"scale", to:"1.7 1.7 1.7", dur:800, easing:"easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom",{ property:"position", to:"0 0 0.6", dur:800, easing:"easeInOutQuad" });

      const img4 = document.createElement("a-image");
      img4.setAttribute("src", "images/intro_text.png");
      img4.setAttribute("position", "0 0.25 0");
      img4.setAttribute("scale", "0.5 0.5 0.5");
      introContainer.appendChild(img4);

      sequenceStep = 5;
    }

    // --- STEP 5: Return to full view and show final cinema ---
    else if (sequenceStep === 5) {
      resetAllModels([0,1,2,3,4,5], () => {
        const tapText = document.getElementById("tapText");
        if (tapText) tapText.setAttribute("visible", "false");
        // Pop-out animation then show final cinema
        setTimeout(()=>{
          frameEntities.forEach(ent=>{
            ent.setAttribute("animation__popout",{ property:"scale", to:"0 0 0", dur:600, easing:"easeInQuad" });
          });
          setTimeout(()=>{
            frameEntities.forEach(ent=>ent.setAttribute("visible","false"));
            showFinalCinema();
          },600);
        },2000);
      });
    }
  }

  // --- Show final cinema model ---
  function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldImages();

    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model", "#cinemaModel");
    cinemaModel.setAttribute("position", "0 -0.3 0.5");
    cinemaModel.setAttribute("scale", "1.5 1.5 1.5");
    cinemaModel.addEventListener("model-loaded", () => {
      cinemaModel.setAttribute("visible","true");
    });
    modelsContainer.appendChild(cinemaModel);

    const finalText = document.createElement("a-text");
    finalText.setAttribute("value","Grazie per aver esplorato la collezione!");
    finalText.setAttribute("align","center");
    finalText.setAttribute("color","#008000");
    finalText.setAttribute("position","0 -0.5 0");
    finalText.setAttribute("scale","0.2 0.2 0.2");
    introContainer.appendChild(finalText);
  }

});



