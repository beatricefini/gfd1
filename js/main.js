document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = ["#piece1","#piece2","#piece3","#piece4","#piece5","#piece6"];
  let started = false, currentIndex = 0, allModelsDisplayed = false;
  const frameEntities = [];
  let sequenceStep = 0, canTap = false;
  const originalTransforms = {};

  // --- Intro ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introText = document.createElement("a-text");
    introText.setAttribute("value",
      "Fragments is an Augmented Reality experience that retraces the history\n" +
      "of the Camera Bioscoop building.\n\n" +
      "The work is composed of four chronological interactive experiences,\n" +
      "guiding visitors through different moments of its past.\n\n" +
      "Step by step, the audience is accompanied through the entrance of the\n" +
      "Camera Bioscoop, where history and architecture come alive in a layered,\n" +
      "immersive narrative."
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
      startText.setAttribute("color", "#000000");
      startText.setAttribute("font", "roboto");
      startText.setAttribute("bold", true);
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

  // --- Show models ---
  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;
      const tapText = document.createElement("a-text");
      tapText.setAttribute("value", "Tap the screen");
      tapText.setAttribute("align", "center");
      tapText.setAttribute("color", "#000000");
      tapText.setAttribute("bold", true);
      tapText.setAttribute("position", "0 -0.6 0");
      tapText.setAttribute("scale", "0.18 0.18 0.18");
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
      originalTransforms[idx] = { position: { ...pos }, scale: { ...scale } };

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

  // --- Clear texts ---
  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach(t => { if(t.id!=="tapText") t.remove(); });
  }

  // --- Reset view to all frames ---
  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;
    frameEntities.forEach((ent,i)=>{ if(!activeIndices.includes(i)) ent.setAttribute("visible","false"); });
    activeIndices.forEach(i => {
      const ent = frameEntities[i], orig = originalTransforms[i];
      if(!ent || !orig) return;
      ent.setAttribute("animation__backpos",{ property:"position", to:`${orig.position.x} ${orig.position.y} ${orig.position.z}`, dur, easing:"easeInOutQuad"});
      ent.setAttribute("animation__backscale",{ property:"scale", to:`${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`, dur, easing:"easeInOutQuad"});
    });

    setTimeout(()=>{
      frameEntities.forEach((ent,i)=>{
        const orig = originalTransforms[i];
        if(orig){
          ent.setAttribute("position",`${orig.position.x} ${orig.position.y} ${orig.position.z}`);
          ent.setAttribute("scale",`${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`);
        }
        ent.setAttribute("visible","true");
      });
      camera.setAttribute("animation__camreset",{ property:"position", to:"0 0 0", dur, easing:"easeInOutQuad" });
      const tapText = document.getElementById("tapText");
      if(tapText) tapText.setAttribute("visible","true");
      if(typeof callback==="function") callback();
    }, dur+50);
  }

  // --- Sequenze con TAP e ritorni ---
  function handleSequences() {
    clearOldTexts();
    const tapText = document.getElementById("tapText");
    if(tapText) tapText.setAttribute("visible","false");

    switch(sequenceStep){

      // --- ZOOM 1: piece1 & piece2 ---
      case 0:
        frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });
        frameEntities[0].setAttribute("animation__pos_zoom",{property:"position",to:"-0.35 0 0.1",dur:800,easing:"easeInOutQuad"});
        frameEntities[1].setAttribute("animation__pos_zoom",{property:"position",to:"0.05 0.12 0.4",dur:800,easing:"easeInOutQuad"});
        frameEntities[0].setAttribute("animation__scale_zoom",{property:"scale",to:"1.2 1.2 1.2",dur:800,easing:"easeInOutQuad"});
        frameEntities[1].setAttribute("animation__scale_zoom",{property:"scale",to:"2.1 2.1 2.1",dur:800,easing:"easeInOutQuad"});
        camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.5",dur:800,easing:"easeInOutQuad"});

        // DATA 1952
        const text1952 = document.createElement("a-text");
        text1952.setAttribute("value","1952");
        text1952.setAttribute("align","center");
        text1952.setAttribute("color","#000000");
        text1952.setAttribute("font","roboto");
        text1952.setAttribute("bold",true);
        text1952.setAttribute("position","0 0.35 0");
        text1952.setAttribute("scale","0.25 0.25 0.25");
        introContainer.appendChild(text1952);

        const desc1952 = document.createElement("a-text");
        desc1952.setAttribute("value","The cinema operator Alfred Friedrich Wolff made a proposal to build a camera theater,\na hotel, and a café-restaurant in Hereplein.");
        desc1952.setAttribute("align","center");
        desc1952.setAttribute("color","#000000");
        desc1952.setAttribute("font","roboto");
        desc1952.setAttribute("position","0 0.05 0");
        desc1952.setAttribute("scale","0.18 0.18 0.18");
        desc1952.setAttribute("wrap-count","30");
        introContainer.appendChild(desc1952);

        sequenceStep = 0.5; // attendo TAP per testo2
        break;

      case 0.5: // TESTO 2 piece1&2
        const textBUT = document.createElement("a-text");
        textBUT.setAttribute("value","BUT");
        textBUT.setAttribute("align","center");
        textBUT.setAttribute("color","#000000");
        textBUT.setAttribute("font","roboto");
        textBUT.setAttribute("bold",true);
        textBUT.setAttribute("position","0 0.35 0");
        textBUT.setAttribute("scale","0.25 0.25 0.25");
        introContainer.appendChild(textBUT);

        const descBUT = document.createElement("a-text");
        descBUT.setAttribute("value","The municipality refused.");
        descBUT.setAttribute("align","center");
        descBUT.setAttribute("color","#000000");
        descBUT.setAttribute("font","roboto");
        descBUT.setAttribute("position","0 0.05 0");
        descBUT.setAttribute("scale","0.18 0.18 0.18");
        descBUT.setAttribute("wrap-count","30");
        introContainer.appendChild(descBUT);

        sequenceStep = 1; // ritorno vista completa al prossimo TAP
        break;

      case 1: // ritorno vista completa
        resetAllModels([],()=>{ sequenceStep=2; });
        break;

      // --- ZOOM 2: piece3,4,5 ---
      case 2:
        frameEntities.forEach((ent,i)=>{ if(i<2 || i>4) ent.setAttribute("visible","false"); });
        [2,3,4].forEach(i=>frameEntities[i].setAttribute("animation__scale_zoom",{property:"scale",to:"1.2 1.2 1.2",dur:800,easing:"easeInOutQuad"}));
        camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

        const text1958 = document.createElement("a-text");
        text1958.setAttribute("value","1958");
        text1958.setAttribute("align","center");
        text1958.setAttribute("color","#000000");
        text1958.setAttribute("font","roboto");
        text1958.setAttribute("bold",true);
        text1958.setAttribute("position","0 0.35 0");
        text1958.setAttribute("scale","0.25 0.25 0.25");
        introContainer.appendChild(text1958);

        const desc1958 = document.createElement("a-text");
        desc1958.setAttribute("value","Some buttresses of the Alva castle, built during the Eighty Years' War,\nwere found in the construction pit of the cinema.");
        desc1958.setAttribute("align","center");
        desc1958.setAttribute("color","#000000");
        desc1958.setAttribute("font","roboto");
        desc1958.setAttribute("position","0 0.05 0");
        desc1958.setAttribute("scale","0.18 0.18 0.18");
        desc1958.setAttribute("wrap-count","30");
        introContainer.appendChild(desc1958);

        sequenceStep=2.5; // attendo TAP per ritorno
        break;

      case 2.5: // ritorno vista completa
        resetAllModels([2,3,4],()=>{ sequenceStep=3; });
        break;

      // --- ZOOM 3: piece6 ---
      case 3:
        frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });
        frameEntities[5].setAttribute("animation__scale_zoom",{property:"scale",to:"1.7 1.7 1.7",dur:800,easing:"easeInOutQuad"});
        camera.setAttribute("animation__cam_zoom",{property:"position",to:"0 0 0.6",dur:800,easing:"easeInOutQuad"});

        const text17 = document.createElement("a-text");
        text17.setAttribute("value","17th Century");
        text17.setAttribute("align","center");
        text17.setAttribute("color","#000000");
        text17.setAttribute("font","roboto");
        text17.setAttribute("bold",true);
        text17.setAttribute("position","0 0.35 0");
        text17.setAttribute("scale","0.25 0.25 0.25");
        introContainer.appendChild(text17);

        const desc17 = document.createElement("a-text");
        desc17.setAttribute("value","A rampart was built, incorporating the famous Herepoort gate.\nThe rampart and gate were demolished in 1875 and 1878, respectively,\nto allow for the construction of Hereplein square and the canals.");
        desc17.setAttribute("align","center");
        desc17.setAttribute("color","#000000");
        desc17.setAttribute("font","roboto");
        desc17.setAttribute("position","0 0.05 0");
        desc17.setAttribute("scale","0.18 0.18 0.18");
        desc17.setAttribute("wrap-count","30");
        introContainer.appendChild(desc17);

        sequenceStep=3.5; // attendo TAP per ritorno
        break;

      case 3.5: // ritorno vista completa
        resetAllModels([5],()=>{ sequenceStep=4; showFinalScene(); });
        break;
    }
  }

  function showFinalScene(){
    frameEntities.forEach(ent=>ent.setAttribute("visible","false"));
    clearOldTexts();

    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model","#finalCinema");
    cinemaModel.setAttribute("position","0 0 0.2");
    cinemaModel.setAttribute("scale","0 0 0");
    cinemaModel.setAttribute("animation__pop",{property:"scale",to:"1 1 1",dur:800,easing:"easeOutElastic"});
    modelsContainer.appendChild(cinemaModel);

    const finalText = document.createElement("a-text");
    finalText.setAttribute("value","Grazie per aver esplorato la collezione!");
    finalText.setAttribute("align","center");
    finalText.setAttribute("color","#000000");
    finalText.setAttribute("font","roboto");
    finalText.setAttribute("position","0 -0.5 0");
    finalText.setAttribute("scale","0.18 0.18 0.18");
    finalText.setAttribute("wrap-count","30");
    introContainer.appendChild(finalText);
  }
});

