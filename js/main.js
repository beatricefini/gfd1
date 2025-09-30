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
      "Fragments is an Augmented Reality experience\nthat retraces the history of the Camera Bioscoop building.\nThe work is composed of four chronological interactive experiences,\nguiding visitors through different moments of its past.\nStep by step, the audience is accompanied through the entrance of the Camera Bioscoop,\nwhere history and architecture come alive in a layered, immersive narrative."
    );
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#000000");
    introText.setAttribute("position", "0 0.25 0");
    introText.setAttribute("scale", "0.15 0.15 0.15");
    introText.setAttribute("wrap-count", "25");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

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
    const oldTexts = introContainer.querySelectorAll("a-text");
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

    // --- SEQUENZA 1 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });
      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      const text1952 = document.createElement("a-text");
      text1952.setAttribute("value", "1952");
      text1952.setAttribute("align", "center");
      text1952.setAttribute("color", "#000000");
      text1952.setAttribute("font", "roboto");
      text1952.setAttribute("position", { x:0, y:0.35, z:0.5 });
      text1952.setAttribute("scale", "0.45 0.45 0.45");
      text1952.setAttribute("anchor", "center");
      text1952.setAttribute("opacity", "0");
      text1952.setAttribute("animation__fadein", { property:"opacity", from:0, to:1, dur:800, easing:"easeInQuad", delay:200 });
      introContainer.appendChild(text1952);

      const text1952Detail = document.createElement("a-text");
      text1952Detail.setAttribute("value", "The cinema operator Alfred Friedrich Wolff made a proposal to build a camera theater,\na hotel, and a café-restaurant in Hereplein.");
      text1952Detail.setAttribute("align", "center");
      text1952Detail.setAttribute("color", "#000000");
      text1952Detail.setAttribute("font", "roboto");
      text1952Detail.setAttribute("position", { x:0, y:0.15, z:0.5 });
      text1952Detail.setAttribute("scale", "0.25 0.25 0.25");
      text1952Detail.setAttribute("wrap-count", "30");
      text1952Detail.setAttribute("opacity","0");
      text1952Detail.setAttribute("animation__fadein", { property:"opacity", from:0, to:1, dur:800, easing:"easeInQuad", delay:1200 });
      introContainer.appendChild(text1952Detail);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const butText = document.createElement("a-text");
      butText.setAttribute("value","BUT");
      butText.setAttribute("align","center");
      butText.setAttribute("color","#000000");
      butText.setAttribute("font","roboto");
      butText.setAttribute("position",{x:0,y:0.35,z:0.5});
      butText.setAttribute("scale","0.45 0.45 0.45");
      butText.setAttribute("opacity","0");
      butText.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:200});
      introContainer.appendChild(butText);

      const butDetail = document.createElement("a-text");
      butDetail.setAttribute("value","the municipality refused.");
      butDetail.setAttribute("align","center");
      butDetail.setAttribute("color","#000000");
      butDetail.setAttribute("font","roboto");
      butDetail.setAttribute("position",{x:0,y:0.15,z:0.5});
      butDetail.setAttribute("scale","0.25 0.25 0.25");
      butDetail.setAttribute("wrap-count","30");
      butDetail.setAttribute("opacity","0");
      butDetail.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:1200});
      introContainer.appendChild(butDetail);

      sequenceStep = 2;

    // --- SEQUENZA 2 ---
    } else if (sequenceStep === 2) {
      resetAllModels([0,1], () => {
        frameEntities.forEach((ent,i)=>{ if(i<2 || i>4) ent.setAttribute("visible","false"); });
        frameEntities[2].setAttribute("animation__pos_zoom",{property:"position",to:"-0.05 0.2 0.35",dur:800,easing:"easeInOutQuad"});
        frameEntities[3].setAttribute("animation__pos_zoom",{property:"position",to:"0.05 0.45 0.35",dur:800,easing:"easeInOutQuad"});
        frameEntities[4].setAttribute("animation__pos_zoom",{property:"position",to:"0.15 0.3 0.35",dur:800,easing:"easeInOutQuad"});
        [2,3,4].forEach(i=>frameEntities[i].setAttribute("animation__scale_zoom",{property:"scale",to:"1.2 1.2 1.2",dur:800,easing:"easeInOutQuad"}));
        camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

        const text1958 = document.createElement("a-text");
        text1958.setAttribute("value","1958");
        text1958.setAttribute("align","center");
        text1958.setAttribute("color","#000000");
        text1958.setAttribute("font","roboto");
        text1958.setAttribute("position",{x:0,y:0.35,z:0.5});
        text1958.setAttribute("scale","0.45 0.45 0.45");
        text1958.setAttribute("anchor","center");
        text1958.setAttribute("opacity","0");
        text1958.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:200});
        introContainer.appendChild(text1958);

        const text1958Detail = document.createElement("a-text");
        text1958Detail.setAttribute("value","Some buttresses of the Alva castele, built during the Eighty Years' War, were found in the construction pit of the cinema.");
        text1958Detail.setAttribute("align","center");
        text1958Detail.setAttribute("color","#000000");
        text1958Detail.setAttribute("font","roboto");
        text1958Detail.setAttribute("position",{x:0,y:0.15,z:0.5});
        text1958Detail.setAttribute("scale","0.25 0.25 0.25");
        text1958Detail.setAttribute("wrap-count","30");
        text1958Detail.setAttribute("opacity","0");
        text1958Detail.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:1200});
        introContainer.appendChild(text1958Detail);

        sequenceStep = 3;
      });

    // --- SEQUENZA 3 ---
    } else if (sequenceStep === 3) {
      resetAllModels([2,3,4], () => {
        frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });
        frameEntities[5].setAttribute("animation__pos_zoom",{property:"position",to:"0.3 -0.15 0.35",dur:800,easing:"easeInOutQuad"});
        frameEntities[5].setAttribute("animation__scale_zoom",{property:"scale",to:"1.7 1.7 1.7",dur:800,easing:"easeInOutQuad"});
        camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

        const textRampart = document.createElement("a-text");
        textRampart.setAttribute("value","At the beginning of the 17th century, a rampart was built, incorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively, to allow for the construction of Hereplein square and the canals.");
        textRampart.setAttribute("align","center");
        textRampart.setAttribute("color","#000000");
        textRampart.setAttribute("font","roboto");
        textRampart.setAttribute("position",{x:0,y:0.25,z:0.5});
        textRampart.setAttribute("scale","0.25 0.25 0.25");
        textRampart.setAttribute("wrap-count","30");
        textRampart.setAttribute("opacity","0");
        textRampart.setAttribute("animation__fadein",{property:"opacity",from:0,to:1,dur:800,easing:"easeInQuad",delay:200});
        introContainer.appendChild(textRampart);

        sequenceStep = 4;
      });
    } else if(sequenceStep>=4) {
      // Rimane la parte finale già implementata (showFinalCinema)
      showFinalCinema();
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
    cinemaModel.addEventListener("model-loaded", () => {
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
});

