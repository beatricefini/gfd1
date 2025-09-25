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

  const originalPositions = [];
  const originalScales = [];

  let started = false;
  let currentIndex = 0;
  let frameEntities = [];
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

    // Tap to start
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
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showAllModelsSequentially();
    } else {
      handleSequences();
    }
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) return;

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model", models[currentIndex]);

    // Pop-up iniziale
    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "1 1 1",
      dur: 400,
      easing: "easeOutElastic"
    });

    // Una volta caricato, salviamo posizione e scala originali di Blender
    piece.addEventListener("model-loaded", () => {
      const pos = piece.getAttribute("position");
      const scl = piece.getAttribute("scale");
      originalPositions.push({ x: pos.x, y: pos.y, z: pos.z });
      originalScales.push({ x: scl.x, y: scl.y, z: scl.z });
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 700);
  }

  function clearTexts() {
    const texts = introContainer.querySelectorAll("a-text");
    texts.forEach(t => t.remove());
  }

  function restoreAllModels() {
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

    camera.setAttribute("animation__camReset", {
      property: "position",
      to: { x: 0, y: 0, z: 0 },
      dur: 600,
      easing: "easeOutQuad"
    });
  }

  function handleSequences() {
    clearTexts();

    if (sequenceStep === 0) {
      // Zoom su piece1 e piece2
      frameEntities.forEach((e, i) => { if (i > 1) e.setAttribute("visible", "false"); });

      frameEntities[0].setAttribute("animation__zoomPos", {
        property: "position",
        to: { x: -0.15, y: 0, z: 0.3 },
        dur: 600,
        easing: "easeOutQuad"
      });
      frameEntities[1].setAttribute("animation__zoomPos", {
        property: "position",
        to: { x: 0.15, y: 0, z: 0.3 },
        dur: 600,
        easing: "easeOutQuad"
      });

      frameEntities[0].setAttribute("animation__zoomScale", { property: "scale", to: { x: 0.35, y:0.35, z:0.35}, dur:600, easing:"easeOutQuad"});
      frameEntities[1].setAttribute("animation__zoomScale", { property: "scale", to: { x:0.35, y:0.35, z:0.35}, dur:600, easing:"easeOutQuad"});

      camera.setAttribute("position", {x:0, y:0, z:0.5});

      // Testi
      const texts = [
        "Queste due cornici rappresentano le principali della tua collezione",
        "Sono le opere più importanti, da cui parte la storia"
      ];
      showTextSequence(texts, () => { restoreAllModels(); sequenceStep=1; });
    } 
    else if (sequenceStep === 1) {
      // Zoom su piece3,4,5
      frameEntities.forEach((e, i) => { if (![2,3,4].includes(i)) e.setAttribute("visible","false"); });

      const positions = [
        {x:-0.25, y:0, z:0.3},
        {x:0, y:0, z:0.3},
        {x:0.25, y:0, z:0.3}
      ];
      [2,3,4].forEach((i,j)=>{
        frameEntities[i].setAttribute("animation__zoomPos",{property:"position",to:positions[j],dur:600,easing:"easeOutQuad"});
        frameEntities[i].setAttribute("animation__zoomScale",{property:"scale",to:{x:0.35,y:0.35,z:0.35},dur:600,easing:"easeOutQuad"});
      });
      camera.setAttribute("position",{x:0,y:0,z:0.6});

      const texts = [
        "Ecco tre opere complementari",
        "Queste aggiungono varietà alla collezione",
        "Ognuna di esse arricchisce la narrazione visiva"
      ];
      showTextSequence(texts, ()=>{ restoreAllModels(); sequenceStep=2; });
    } 
    else if (sequenceStep === 2) {
      // Zoom su piece6
      frameEntities.forEach((e,i)=>{ if(i!==5) e.setAttribute("visible","false"); });

      frameEntities[5].setAttribute("animation__zoomPos",{property:"position",to:{x:0,y:0,z:0.3},dur:600,easing:"easeOutQuad"});
      frameEntities[5].setAttribute("animation__zoomScale",{property:"scale",to:{x:0.35,y:0.35,z:0.35},dur:600,easing:"easeOutQuad"});
      camera.setAttribute("position",{x:0,y:0,z:0.5});

      const texts = ["Infine, questa cornice conclusiva"];
      showTextSequence(texts, ()=>{ restoreAllModels(); sequenceStep=3; });
    }
  }

  function showTextSequence(textArray, callback) {
    if (!textArray.length) { callback(); return; }
    let idx=0;
    const infoText = document.createElement("a-text");
    infoText.setAttribute("align","center");
    infoText.setAttribute("color","#008000");
    infoText.setAttribute("position","0 -0.4 0");
    infoText.setAttribute("scale","0.15 0.15 0.15");
    infoText.setAttribute("wrap-count","30");
    introContainer.appendChild(infoText);

    function nextText() {
      if(idx<textArray.length){
        infoText.setAttribute("value",textArray[idx]);
        idx++;
      } else {
        infoText.remove();
        callback();
        window.removeEventListener("click", nextText);
      }
    }

    window.addEventListener("click", nextText);
    nextText();
  }
});
