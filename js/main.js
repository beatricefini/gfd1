document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const modelsContainer = document.getElementById("modelsContainer");
  const introContainer = document.getElementById("introTexts");
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
  let frameEntities = [];
  let sequenceStep = 0;

  // --- Mostra testi introduttivi ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

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

  // --- Click globale ---
  window.addEventListener("click", () => {
    if (!started) {
      // Nascondi testi introduttivi
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if (introText) introText.setAttribute("visible", "false");
      if (startText) startText.setAttribute("visible", "false");

      started = true;
      showModelsSequentially();
    } else {
      handleSequences();
    }
  });

  // --- Animazione comparsa cornici ---
  function showModelsSequentially() {
    if (currentIndex >= models.length) {
      // Mostra tap per le sequenze
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
    piece.setAttribute("scale", "1 1 1"); // scala originale Blender
    piece.setAttribute("position", "0 0 0"); // posizione originale Blender

    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "1 1 1",
      dur: 400,
      easing: "easeOutElastic"
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showModelsSequentially, 600);
  }

  // --- Gestione sequenze con zoom e testi ---
  function handleSequences() {
    clearOldTexts();
    const tapText = document.getElementById("tapText");
    if (tapText) tapText.setAttribute("visible", "false");

    if (sequenceStep === 0) {
      zoomFrames([0,1], ["Queste due cornici rappresentano le principali della tua collezione","Sono le opere più importanti, da cui parte la storia"], 0.5);
      sequenceStep = 1;
    } else if (sequenceStep === 1) {
      zoomFrames([2,3,4], ["Queste tre cornici sono importanti nella tua collezione","Puoi osservarne le caratteristiche più interessanti qui sotto","Ogni cornice ha una storia da raccontare"], 0.6);
      sequenceStep = 2;
    } else if (sequenceStep === 2) {
      zoomFrames([5], ["Ultima cornice da osservare"], 0.5);
      sequenceStep = 3;
    } else if (sequenceStep === 3) {
      // Ritorna vista completa
      frameEntities.forEach(f => {
        f.setAttribute("visible", "true");
        f.setAttribute("position", "0 0 0");
        f.setAttribute("scale", "1 1 1");
      });
      camera.setAttribute("position", {x:0,y:0,z:0});
      if (tapText) tapText.setAttribute("visible", "true");
    }
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach(t => {
      if (t.id !== "tapText") t.remove();
    });
  }

  // --- Funzione zoom generica ---
  function zoomFrames(indices, texts, cameraZ) {
    // Nascondi cornici non interessate
    frameEntities.forEach((f,i)=>{if(!indices.includes(i)) f.setAttribute("visible","false"); else f.setAttribute("visible","true");});

    // Posizione e scala zoom temporanei
    const spacing = 0.25;
    indices.forEach((idx,i)=>{
      const f = frameEntities[idx];
      f.setAttribute("position",{x:(i-(indices.length-1)/2)*spacing, y:0, z:cameraZ});
      f.setAttribute("scale",{x:0.7,y:0.7,z:0.7});
    });

    camera.setAttribute("position",{x:0,y:0,z:cameraZ});

    // Mostra testi sequenziali
    let textIndex=0;
    const infoText = document.createElement("a-text");
    infoText.setAttribute("value",texts[textIndex]);
    infoText.setAttribute("align","center");
    infoText.setAttribute("color","#008000");
    infoText.setAttribute("position",{x:0,y:-0.5,z:0});
    infoText.setAttribute("scale",{x:0.3,y:0.3,z:0.3});
    infoText.setAttribute("wrap-count","30");
    introContainer.appendChild(infoText);

    const listener = () => {
      textIndex++;
      if(textIndex<texts.length){
        infoText.setAttribute("value",texts[textIndex]);
      } else {
        infoText.setAttribute("visible","false");
        window.removeEventListener("click",listener);
        // Torna alla vista completa
        frameEntities.forEach(f=>{
          f.setAttribute("visible","true");
          f.setAttribute("position","0 0 0");
          f.setAttribute("scale","1 1 1");
        });
        camera.setAttribute("position",{x:0,y:0,z:0});
        const tapText = document.getElementById("tapText");
        if(tapText) tapText.setAttribute("visible","true");
      }
    };
    window.addEventListener("click",listener);
  }
});
