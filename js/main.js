
function initMainSequence() {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = [
    "#piece1", "#piece2", "#piece3",
    "#piece4", "#piece5", "#piece6"
  ];

  let started = false;
  let currentIndex = 0;
  let allModelsDisplayed = false;
  const frameEntities = [];
  let sequenceStep = 0;

  const originalTransforms = {};

marker.addEventListener("targetFound", () => {
    if (started) return;
    started = true; // segna che la sequenza è iniziata
    showAllModelsSequentially(); // parte subito la sequenza di cornici
});


  // --- Click globale ---
  window.addEventListener("click", () => {
    if (!started) {
      const startText = document.getElementById("startText");
      if (!startText) return;

      const introPlane = introContainer.querySelector("a-plane");

      startText.setAttribute("animation__fadeout", {
        property: "opacity",
        from: 1, to: 0, dur: 600, easing: "easeInQuad"
      });
      if (introPlane) introPlane.setAttribute("animation__fadeout", {
        property: "opacity",
        from: 1, to: 0, dur: 600, easing: "easeInQuad"
      });

      setTimeout(() => {
        startText.setAttribute("visible","false");
        if(introPlane) introPlane.setAttribute("visible","false");

        started = true;
        showAllModelsSequentially();
      }, 650);
      return;
    }

    if (allModelsDisplayed) {
      handleSequences();
    }
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;
      const tapText = document.createElement("a-text");
      tapText.setAttribute("value", "Tap to continue");
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
    piece.setAttribute("visible","false");

    piece.addEventListener("model-loaded", ()=>{
      const pos = piece.getAttribute("position");
      const scale = piece.getAttribute("scale");
      originalTransforms[idx] = { position: {...pos}, scale: {...scale} };
      piece.setAttribute("animation__pop", { property:"scale", from:"0 0 0", to:`${scale.x} ${scale.y} ${scale.z}`, dur:500, easing:"easeOutElastic" });
      piece.setAttribute("visible","true");
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showAllModelsSequentially, 700);
  }

  function clearOldTexts() {
    const oldTexts = introContainer.querySelectorAll("a-text, a-plane");
    oldTexts.forEach(t => { if(t.id !== "tapText") t.remove(); });
  }

  function resetAllModels(activeIndices=[], callback) {
    const dur = 800;
    frameEntities.forEach((ent,i)=>{ if(!activeIndices.includes(i)) ent.setAttribute("visible","false"); });
    activeIndices.forEach(i=>{
      const ent = frameEntities[i];
      const orig = originalTransforms[i];
      if(!ent || !orig) return;
      ent.setAttribute("animation__backpos",{ property:"position", to:`${orig.position.x} ${orig.position.y} ${orig.position.z}`, dur:dur, easing:"easeInOutQuad" });
      ent.setAttribute("animation__backscale",{ property:"scale", to:`${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`, dur:dur, easing:"easeInOutQuad" });
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
      camera.setAttribute("animation__camreset",{ property:"position", to:"0 0 0", dur:dur, easing:"easeInOutQuad" });
      const tapText = document.getElementById("tapText");
      if(tapText) tapText.setAttribute("visible","true");
      if(typeof callback==="function") callback();
    }, dur+50);
  }

 let sequenceStep = 0;
let tapText = null;

function initializeTapText() {
    // Crea il testo "Tap to continue" se non esiste
    tapText = document.getElementById("tapText");
    if (!tapText) {
        tapText = document.createElement("a-text");
        tapText.setAttribute("id", "tapText");
        tapText.setAttribute("value", "Tap to continue");
        tapText.setAttribute("align", "center");
        tapText.setAttribute("color", "#FFD700");
        tapText.setAttribute("position", "0 -0.7 0");
        tapText.setAttribute("scale", "0.2 0.2 0.2");
        tapText.setAttribute("wrap-count", "20");
        introContainer.appendChild(tapText);
    }
    tapText.setAttribute("visible", "false"); // Inizialmente non visibile
}

// Funzione per creare le immagini
function createTextImage(imgId, posY) {
    const img = document.createElement("a-image");
    img.setAttribute("src", imgId);
    img.setAttribute("position", `0 ${posY} 0`);
    img.setAttribute("scale", "1 1 1");  // Manteniamo la scala originale
    img.setAttribute("material", "transparent: true");
    img.classList.add("sequence-img");
    return img;
}

// Funzione per la sequenza delle immagini
function handleSequences() {
    if (!tapText) initializeTapText(); // Assicuriamoci che il tapText sia inizializzato

    // Rimuovi le immagini precedenti
    const oldImgs = introContainer.querySelectorAll(".sequence-img");
    oldImgs.forEach(img => img.remove());

    // --- SEQUENZE DI ZOOM ---
    if (sequenceStep === 0) {
        // Prima sequenza: text1
        const img1 = createTextImage("#text1Img", -0.4);
        introContainer.appendChild(img1);
        tapText.setAttribute("visible", "true");  // Mostra il testo "Tap to continue"
        sequenceStep = 1;
    } 
    else if (sequenceStep === 1) {
        // Seconda sequenza: text2
        const img2 = createTextImage("#text2Img", -0.5);
        introContainer.appendChild(img2);
        tapText.setAttribute("visible", "true");
        sequenceStep = 2;
    }
    else if (sequenceStep === 2) {
        // Terza sequenza: text3
        const img3 = createTextImage("#text3Img", -0.4);
        introContainer.appendChild(img3);
        tapText.setAttribute("visible", "true");
        sequenceStep = 3;
    }
    else if (sequenceStep === 3) {
        // Quarta sequenza: text4
        const img4 = createTextImage("#text4Img", -0.4);
        introContainer.appendChild(img4);
        tapText.setAttribute("visible", "true");
        sequenceStep = 4;
    }
    else if (sequenceStep === 4) {
        // Quinta sequenza: text5
        const img5 = createTextImage("#text5Img", -0.5);
        introContainer.appendChild(img5);
        tapText.setAttribute("visible", "true");
        sequenceStep = 5;
    }

    // --- Fine delle sequenze: nascondi "Tap to continue" e continua ---
    if (sequenceStep === 5) {
        setTimeout(() => {
            tapText.setAttribute("visible", "false");  // Nascondi il testo "Tap to continue"
            resetAllModels([0,1,2,3,4,5], () => {
                setTimeout(() => {
                    frameEntities.forEach((ent, i) => {
                        ent.setAttribute("animation__popout", { property: "scale", to: "0 0 0", dur: 800, easing: "easeInQuad" });
                    });
                    setTimeout(() => { showFinalCinema(); }, 800);  // Mostra la scena finale
                }, 3000);
            });
            sequenceStep = 6;
        }, 3000); // Ritardo di 3 secondi prima di proseguire
    }
}

// Funzione di reset dei modelli
function resetAllModels(modelIndices, callback) {
    modelIndices.forEach((index) => {
        // Reset dei modelli (puoi personalizzare la logica di reset)
        const model = scene.querySelector(`#model-${index}`);
        if (model) model.setAttribute("animation", { property: "scale", to: "1 1 1", dur: 1000 });
    });
    if (callback) callback();
}

// Funzione per mostrare la scena finale (modifica secondo le tue esigenze)
function showFinalCinema() {
    // Mostra il modello finale e le animazioni
    const finalModel = scene.querySelector("#finalModel");
    if (finalModel) {
        finalModel.setAttribute("animation", { property: "scale", to: "1 1 1", dur: 1000 });
    }
}





 function showFinalCinema() {
    frameEntities.forEach(ent => ent.setAttribute("visible", "false"));
    clearOldTexts();

    const baseHeight = -0.25;

    // Modello Cinema
    const cinemaModel = document.createElement("a-entity");
    cinemaModel.setAttribute("gltf-model", "#pieceCinema");
    cinemaModel.setAttribute("position", "0 -0.3 0.5");
    cinemaModel.setAttribute("scale", "1.5 1.5 1.5");
    cinemaModel.setAttribute("visible", "true");
    modelsContainer.appendChild(cinemaModel);

    // Testo 1958
    const text1958 = document.createElement("a-text");
    text1958.setAttribute("value", "1958");
    text1958.setAttribute("align", "center");
    text1958.setAttribute("anchor", "center");
    text1958.setAttribute("color", "#000000");
    text1958.setAttribute("font", "roboto");
    text1958.setAttribute("position", `0 ${baseHeight + 0.5} 0.5`);
    text1958.setAttribute("scale", "0.5 0.5 0.5");
    text1958.setAttribute("opacity", "0");
    text1958.setAttribute("shader", "msdf");
    text1958.setAttribute("animation__fadein", "property: opacity; from: 0; to: 1; dur: 800; easing: easeInQuad; delay: 200");
    introContainer.appendChild(text1958);

    // Testo Ruins
    const textRuins = document.createElement("a-text");
    textRuins.setAttribute("value", "Ruins");
    textRuins.setAttribute("align", "center");
    textRuins.setAttribute("anchor", "center");
    textRuins.setAttribute("color", "#000000");
    textRuins.setAttribute("font", "roboto");
    textRuins.setAttribute("position", `0 ${baseHeight + 0.4} 0.5`);
    textRuins.setAttribute("scale", "0.35 0.35 0.35");
    textRuins.setAttribute("opacity", "0");
    textRuins.setAttribute("shader", "msdf");
    textRuins.setAttribute("animation__fadein", "property: opacity; from: 0; to: 1; dur: 800; easing: easeInQuad; delay: 1200");
    introContainer.appendChild(textRuins);

    // --- Overlay outro dopo 10 secondi ---
   // --- Overlay UI outro dopo 10 secondi ---
setTimeout(() => {
    const outroOverlay = document.createElement("div");
    outroOverlay.id = "outroOverlay";
    outroOverlay.className = "overlay"; // inizia senza 'show' quindi opacity = 0
    const outroImg = document.createElement("img");
    outroImg.src = "images/outro1.png";
    outroOverlay.appendChild(outroImg);
    document.body.appendChild(outroOverlay);

    // Forza un piccolo delay prima di aggiungere la classe show per il fade-in
    setTimeout(() => {
        outroOverlay.classList.add("show");
    }, 50); // 50ms è sufficiente per triggerare la transizione CSS
}, 10000); // 10 secondi dopo comparsa cinema + testi
 // 10 secondi dopo la comparsa cinema + testi
}

}
