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
  let frameEntities = [];
  let originalTransforms = []; // salva posizione e scala originali
  let sequenceStep = 0;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo
    const introText = document.createElement("a-text");
    introText.setAttribute(
      "value",
      "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata"
    );
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.2 0");
    introText.setAttribute("scale", "0.25 0.25 0.25");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    // Testo "Tap to start"
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 0 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 500);
  });

  window.addEventListener("click", () => {
    if (!started) {
      // Sparisci testi introduttivi
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

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);
    piece.setAttribute("scale", "0.18 0.18 0.18");
    piece.setAttribute("position", "0 0 0"); // mantiene la posizione di Blender
    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "0.18 0.18 0.18",
      dur: 250,
      easing: "easeOutElastic"
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);

    // salva posizione e scala originali
    originalTransforms.push({
      position: piece.getAttribute("position"),
      scale: piece.getAttribute("scale")
    });

    currentIndex++;
    setTimeout(showAllModelsSequentially, 900);
  }

  function resetAllModels() {
    frameEntities.forEach((ent, i) => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("position", originalTransforms[i].position);
      ent.setAttribute("scale", originalTransforms[i].scale);
    });

    camera.setAttribute("position", "0 0 0");

    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "true");
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach((t) => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function handleSequences() {
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    clearOldTexts();

    // --- Sequenza 1: piece1 e piece2 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => {
        if (i > 1) ent.setAttribute("visible", "false");
      });
      const p1 = frameEntities[0];
      const p2 = frameEntities[1];
      p1.setAttribute("animation__zoom", { property: "position", to: { x: -0.1, y: 0, z: 0.2 }, dur: 600, easing: "easeOutQuad" });
      p2.setAttribute("animation__zoom", { property: "position", to: { x: 0.1, y: 0, z: 0.2 }, dur: 600, easing: "easeOutQuad" });
      p1.setAttribute("animation__scale", { property: "scale", to: { x:0.22, y:0.22, z:0.22 }, dur:600, easing:"easeOutQuad" });
      p2.setAttribute("animation__scale", { property: "scale", to: { x:0.22, y:0.22, z:0.22 }, dur:600, easing:"easeOutQuad" });

      camera.setAttribute("animation__camZoom", { property:"position", to:{x:0,y:0,z:0.5}, dur:600, easing:"easeOutQuad" });

      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Queste due cornici rappresentano le principali della tua collezione");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0, y:-0.4, z:0});
      infoText.setAttribute("scale",{x:0.15, y:0.15, z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);

      sequenceStep = 1;
      return;
    }

    // Sequenza 1: secondo testo
    if (sequenceStep === 1) {
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value", "Sono le opere più importanti, da cui parte la storia");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0, y:-0.5, z:0});
      infoText.setAttribute("scale",{x:0.15, y:0.15, z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);

      sequenceStep = 2;
      return;
    }

    if (sequenceStep === 2) {
      resetAllModels();
      sequenceStep = 3;
      return;
    }

    // --- Sequenza 2: piece3,4,5 ---
    if (sequenceStep === 3) {
      frameEntities.forEach((ent,i)=>{
        if(i<2 || i>4) ent.setAttribute("visible","false");
      });
      const p3=frameEntities[2], p4=frameEntities[3], p5=frameEntities[4];
      [p3,p4,p5].forEach((p,i)=>{
        p.setAttribute("animation__zoom",{property:"position", to:{x:-0.2+i*0.2, y:0, z:0.25}, dur:600, easing:"easeOutQuad"});
        p.setAttribute("animation__scale",{property:"scale", to:{x:0.22,y:0.22,z:0.22}, dur:600, easing:"easeOutQuad"});
      });
      camera.setAttribute("animation__camZoom",{property:"position", to:{x:0,y:0,z:0.6}, dur:600, easing:"easeOutQuad"});
      const infoText=document.createElement("a-text");
      infoText.setAttribute("value","Ecco tre opere complementari");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0,y:-0.4,z:0});
      infoText.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=4;
      return;
    }

    if(sequenceStep===4){
      const infoText=document.createElement("a-text");
      infoText.setAttribute("value","Queste aggiungono varietà alla collezione");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0,y:-0.5,z:0});
      infoText.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=5;
      return;
    }

    if(sequenceStep===5){
      const infoText=document.createElement("a-text");
      infoText.setAttribute("value","Ognuna di esse arricchisce la narrazione visiva");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0,y:-0.6,z:0});
      infoText.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=6;
      return;
    }

    if(sequenceStep===6){
      resetAllModels();
      sequenceStep=7;
      return;
    }

    // --- Sequenza 3: piece6 ---
    if(sequenceStep===7){
      frameEntities.forEach((ent,i)=>{if(i!==5) ent.setAttribute("visible","false");});
      const p6=frameEntities[5];
      p6.setAttribute("animation__zoom",{property:"position", to:{x:0,y:0,z:0.3}, dur:600, easing:"easeOutQuad"});
      p6.setAttribute("animation__scale",{property:"scale", to:{x:0.25,y:0.25,z:0.25}, dur:600, easing:"easeOutQuad"});
      camera.setAttribute("animation__camZoom",{property:"position", to:{x:0,y:0,z:0.5}, dur:600, easing:"easeOutQuad"});
      const infoText=document.createElement("a-text");
      infoText.setAttribute("value","Infine, questa cornice conclusiva");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position",{x:0,y:-0.4,z:0});
      infoText.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=8;
      return;
    }

    if(sequenceStep===8){
      resetAllModels();
      sequenceStep=9;
      return;
    }
  }

});
