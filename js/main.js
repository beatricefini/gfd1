document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = [
    "#piece1", "#piece2", "#piece3", "#piece4", "#piece5", "#piece6"
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

    // immagine intro
    const introImage = document.createElement("a-image");
    introImage.setAttribute("src", "images/intro_text.png");
    introImage.setAttribute("position", "0 0.25 0");
    introImage.setAttribute("scale", "1 1 1");
    introImage.setAttribute("id", "introImage");
    introContainer.appendChild(introImage);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.3 0");
      startText.setAttribute("scale", "0.16 0.16 0.16");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 500);
  });

  // --- Click globale ---
  window.addEventListener("click", () => {
    const startText = document.getElementById("startText");
    if (!started && startText) {
      const introImage = document.getElementById("introImage");
      if (introImage) introImage.setAttribute("visible", "false");
      startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Mostra modelli uno a uno ---
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
    oldTexts.forEach((t) => { if (t.id !== "tapText") t.remove(); });
  }

  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;
    frameEntities.forEach((ent, i) => { if (!activeIndices.includes(i)) ent.setAttribute("visible", "false"); });
    activeIndices.forEach((i) => {
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

  // --- Gestione sequenze ---
  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");
    clearOldTexts();

    // STEP 0 → zoom piece1 & piece2 → immagine text1 → tap → immagine text1 → ritorno
    if (sequenceStep === 0) {
      frameEntities.forEach((ent,i) => { if(i>1) ent.setAttribute("visible","false"); });
      frameEntities[0].setAttribute("animation__pos_zoom", { property:"position", to:"-0.35 0 0.1", dur:800, easing:"easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property:"position", to:"0.05 0.12 0.4", dur:800, easing:"easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property:"scale", to:"1.2 1.2 1.2", dur:800, easing:"easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property:"scale", to:"2.1 2.1 2.1", dur:800, easing:"easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property:"position", to:"0 0 0.5", dur:800, easing:"easeInOutQuad" });

      const img = document.createElement("a-image");
      img.setAttribute("src", "images/text1.png");
      img.setAttribute("position", "0 -0.3 0");
      img.setAttribute("scale", "0.7 0.7 0.7");
      img.setAttribute("id","infoImage");
      introContainer.appendChild(img);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      // seconda immagine text1
      const img2 = document.createElement("a-image");
      img2.setAttribute("src", "images/text1.png");
      img2.setAttribute("position", "0 -0.3 0");
      img2.setAttribute("scale", "0.7 0.7 0.7");
      introContainer.appendChild(img2);

      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      resetAllModels([0,1], () => { sequenceStep = 3; });

    // STEP 1 → piece3,4,5
    } else if (sequenceStep === 3) {
      frameEntities.forEach((ent,i)=>{ if(i<2||i>4) ent.setAttribute("visible","false"); });
      frameEntities[2].setAttribute("animation__pos_zoom", {property:"position", to:"-0.05 0.2 0.35", dur:800, easing:"easeInOutQuad"});
      frameEntities[3].setAttribute("animation__pos_zoom", {property:"position", to:"0.05 0.45 0.35", dur:800, easing:"easeInOutQuad"});
      frameEntities[4].setAttribute("animation__pos_zoom", {property:"position", to:"0.15 0.3 0.35", dur:800, easing:"easeInOutQuad"});
      [2,3,4].forEach(i=>frameEntities[i].setAttribute("animation__scale_zoom",{property:"scale",to:"1.2 1.2 1.2",dur:800,easing:"easeInOutQuad"}));
      camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

      sequenceStep=4;

    } else if (sequenceStep===4) {
      resetAllModels([2,3,4],()=>{ sequenceStep=5; });

    // STEP 2 → piece6
    } else if (sequenceStep===5) {
      frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });
      frameEntities[5].setAttribute("animation__pos_zoom",{property:"position",to:"0.3 -0.15 0.35",dur:800,easing:"easeInOutQuad"});
      frameEntities[5].setAttribute("animation__scale_zoom",{property:"scale",to:"1.7 1.7 1.7",dur:800,easing:"easeInOutQuad"});
      camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

      const text1958 = document.createElement("a-text");
      text1958.setAttribute("value","1958");
      text1958.setAttribute("align","center");
      text1958.setAttribute("color","#000000");
      text1958.setAttribute("position","0 0.25 0");
      text1958.setAttribute("scale","0.5 0.5 0.5");
      text1958.setAttribute("opacity","0");
      text1958.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad"});
      introContainer.appendChild(text1958);

      const textRuins = document.createElement("a-text");
      textRuins.setAttribute("value","Ruins");
      textRuins.setAttribute("align","center");
      textRuins.setAttribute("color","#000000");
      textRuins.setAttribute("position","0 0.1 0");
      textRuins.setAttribute("scale","0.35 0.35 0.35");
      textRuins.setAttribute("opacity","0");
      textRuins.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:600});
      introContainer.appendChild(textRuins);

      // dopo fade in comparsa modello cinema
      setTimeout(()=>{
        const cinemaModel = document.createElement("a-entity");
        cinemaModel.setAttribute("gltf-model","#piece_cinema1");
        cinemaModel.setAttribute("position","0 -0.3 0.5");
        cinemaModel.setAttribute("scale","1.5 1.5 1.5");
        cinemaModel.setAttribute("visible","true");
        modelsContainer.appendChild(cinemaModel);
      }, 1500);

      sequenceStep=6;
    }
  }
});


