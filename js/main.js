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

  const frameEntities = [];
  const originalPositions = [];
  const originalScales = [];
  let started = false;
  let currentIndex = 0;
  let allModelsDisplayed = false;
  let sequenceStep = 0;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
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
      // Spariscono testi introduttivi
      document.getElementById("introText")?.setAttribute("visible", "false");
      document.getElementById("startText")?.setAttribute("visible", "false");
      started = true;
      showModelsSequentially();
    } else if (allModelsDisplayed) {
      handleSequences();
    }
  });

  function showModelsSequentially() {
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
    piece.setAttribute("position", { x: 0, y: 0, z: 0 });
    piece.setAttribute("scale", { x: 0.2, y: 0.2, z: 0.2 });

    // Salviamo posizione e scala originali di Blender
    originalPositions.push({ ...piece.getAttribute("position") });
    originalScales.push({ ...piece.getAttribute("scale") });

    // Animazione pop-up
    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "0.2 0.2 0.2",
      dur: 400,
      easing: "easeOutElastic"
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showModelsSequentially, 800);
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach(t => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function resetAllModels() {
    frameEntities.forEach((ent, i) => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("animation__resetPos", {
        property: "position",
        to: originalPositions[i],
        dur: 600,
        easing: "easeOutQuad"
      });
      ent.setAttribute("animation__resetScale", {
        property: "scale",
        to: originalScales[i],
        dur: 600,
        easing: "easeOutQuad"
      });
    });
    document.getElementById("tapText")?.setAttribute("visible", "true");
    camera.setAttribute("animation__camReset", {
      property: "position",
      to: { x: 0, y: 0, z: 0 },
      dur: 600,
      easing: "easeOutQuad"
    });
  }

  function handleSequences() {
    const tapText = document.getElementById("tapText");
    tapText?.setAttribute("visible", "false");

    clearOldTexts();

    if (sequenceStep === 0) {
      // Zoom piece1 e piece2
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });
      const p1 = frameEntities[0];
      const p2 = frameEntities[1];
      p1.setAttribute("animation__zoomPos", { property: "position", to: { x: -0.1, y: 0, z: 0.25 }, dur: 600, easing: "easeOutQuad" });
      p2.setAttribute("animation__zoomPos", { property: "position", to: { x: 0.1, y: 0, z: 0.25 }, dur: 600, easing: "easeOutQuad" });
      p1.setAttribute("animation__zoomScale", { property: "scale", to: { x:0.25, y:0.25, z:0.25 }, dur: 600, easing:"easeOutQuad" });
      p2.setAttribute("animation__zoomScale", { property: "scale", to: { x:0.25, y:0.25, z:0.25 }, dur: 600, easing:"easeOutQuad" });
      camera.setAttribute("animation__camZoom", { property:"position", to:{x:0,y:0,z:0.5}, dur:600, easing:"easeOutQuad" });

      const infoText1 = document.createElement("a-text");
      infoText1.setAttribute("value","Queste due cornici rappresentano le principali della tua collezione");
      infoText1.setAttribute("align","center");
      infoText1.setAttribute("color","#008000");
      infoText1.setAttribute("position",{x:0,y:-0.4,z:0});
      infoText1.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText1.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText1);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const infoText2 = document.createElement("a-text");
      infoText2.setAttribute("value","Sono le opere più importanti, da cui parte la storia");
      infoText2.setAttribute("align","center");
      infoText2.setAttribute("color","#008000");
      infoText2.setAttribute("position",{x:0,y:-0.5,z:0});
      infoText2.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText2.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText2);

      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      resetAllModels();
      sequenceStep = 3;

    } else if (sequenceStep === 3) {
      // Zoom piece3,4,5
      frameEntities.forEach((ent,i)=>{ if (![2,3,4].includes(i)) ent.setAttribute("visible","false"); });
      const p3 = frameEntities[2], p4 = frameEntities[3], p5 = frameEntities[4];
      [p3,p4,p5].forEach((p,i)=>{
        p.setAttribute("animation__zoomPos",{ property:"position", to:{ x:-0.2+i*0.2, y:0, z:0.25 }, dur:600, easing:"easeOutQuad" });
        p.setAttribute("animation__zoomScale",{ property:"scale", to:{ x:0.25,y:0.25,z:0.25 }, dur:600, easing:"easeOutQuad" });
      });
      camera.setAttribute("animation__camZoom",{ property:"position", to:{x:0,y:0,z:0.6}, dur:600, easing:"easeOutQuad" });

      const infoText1 = document.createElement("a-text");
      infoText1.setAttribute("value","Ecco tre opere complementari");
      infoText1.setAttribute("align","center");
      infoText1.setAttribute("color","#008000");
      infoText1.setAttribute("position",{x:0,y:-0.4,z:0});
      infoText1.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText1.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText1);

      sequenceStep = 4;

    } else if (sequenceStep === 4) {
      const infoText2 = document.createElement("a-text");
      infoText2.setAttribute("value","Queste aggiungono varietà alla collezione");
      infoText2.setAttribute("align","center");
      infoText2.setAttribute("color","#008000");
      infoText2.setAttribute("position",{x:0,y:-0.5,z:0});
      infoText2.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText2.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText2);

      sequenceStep = 5;

    } else if (sequenceStep === 5) {
      const infoText3 = document.createElement("a-text");
      infoText3.setAttribute("value","Ognuna di esse arricchisce la narrazione visiva");
      infoText3.setAttribute("align","center");
      infoText3.setAttribute("color","#008000");
      infoText3.setAttribute("position",{x:0,y:-0.6,z:0});
      infoText3.setAttribute("scale",{x:0.15,y:0.15,z:0.15});
      infoText3.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText3);

      sequenceStep = 6;

    } else if (sequenceStep === 6) {
      resetAllModels();
      sequenceStep = 7;
    }
  }
});
