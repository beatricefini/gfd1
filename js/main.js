// --- Variabili globali ---
let sequenceStep = 0; 
let frameEntities = [];
let originalTransforms = {};
let started = false;
let allModelsDisplayed = false;
let currentIndex = 0;

// --- Inizializzazione sequenza principale ---
function initMainSequence() {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = [
    "#piece1", "#piece2", "#piece3",
    "#piece4", "#piece5", "#piece6"
  ];

  marker.addEventListener("targetFound", () => {
    if (started) return;
    started = true;
    showAllModelsSequentially(); // parte la sequenza cornici
  });

  // --- Click globale ---
  window.addEventListener("click", () => {
    if (allModelsDisplayed) {
      handleSequences(introContainer, modelsContainer, camera);
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
}

// --- Funzione per sequenze di zoom ---
function handleSequences(introContainer, modelsContainer, camera) {
  function createTextImage(imgId, posY) {
    const img = document.createElement("a-image");
    img.setAttribute("src", imgId);
    img.setAttribute("position", `0 ${posY} 0`);
    img.setAttribute("scale", "1 1 1");
    img.setAttribute("material", "transparent: true");
    img.classList.add("sequence-img");
    return img;
  }

  if (sequenceStep === 0) {
    introContainer.appendChild(createTextImage("#text1Img", -0.4));
    document.getElementById("tapText").setAttribute("visible", "true");
    sequenceStep = 1;
  } else if (sequenceStep === 1) {
    introContainer.appendChild(createTextImage("#text2Img", -0.5));
    document.getElementById("tapText").setAttribute("visible", "true");
    sequenceStep = 2;
  } else if (sequenceStep === 2) {
    introContainer.appendChild(createTextImage("#text3Img", -0.4));
    document.getElementById("tapText").setAttribute("visible", "true");
    sequenceStep = 3;
  } else if (sequenceStep === 3) {
    introContainer.appendChild(createTextImage("#text4Img", -0.4));
    document.getElementById("tapText").setAttribute("visible", "true");
    sequenceStep = 4;
  } else if (sequenceStep === 4) {
    introContainer.appendChild(createTextImage("#text5Img", -0.5));
    document.getElementById("tapText").setAttribute("visible", "true");
    sequenceStep = 5;
  }

  // --- Fine sequenze ---
  if (sequenceStep === 5) {
    setTimeout(() => {
      const tapText = document.getElementById("tapText");
      if (tapText) tapText.setAttribute("visible", "false");
      resetAllModels(camera, () => {
        setTimeout(() => {
          frameEntities.forEach(ent => {
            ent.setAttribute("animation__popout", {
              property: "scale",
              to: "0 0 0",
              dur: 800,
              easing: "easeInQuad"
            });
          });
          setTimeout(() => { showFinalCinema(modelsContainer, introContainer); }, 800);
        }, 3000);
      });
      sequenceStep = 6;
    }, 3000);
  }
}

// --- Reset modelli ---
function resetAllModels(camera, callback) {
  const dur = 800;
  frameEntities.forEach(ent => ent.setAttribute("visible", "true"));
  camera.setAttribute("animation__camreset", {
    property: "position",
    to: "0 0 0",
    dur: dur,
    easing: "easeInOutQuad"
  });
  if (typeof callback === "function") {
    setTimeout(callback, dur + 50);
  }
}

// --- Finale con cinema + outro ---
function showFinalCinema(modelsContainer, introContainer) {
  frameEntities.forEach(ent => ent.setAttribute("visible", "false"));

  const baseHeight = -0.25;

  const cinemaModel = document.createElement("a-entity");
  cinemaModel.setAttribute("gltf-model", "#pieceCinema");
  cinemaModel.setAttribute("position", "0 -0.3 0.5");
  cinemaModel.setAttribute("scale", "1.5 1.5 1.5");
  cinemaModel.setAttribute("visible", "true");
  modelsContainer.appendChild(cinemaModel);

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
  text1958.setAttribute("animation__fadein", "property: opacity; from: 0; to: 1; dur: 800; delay: 200");
  introContainer.appendChild(text1958);

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
  textRuins.setAttribute("animation__fadein", "property: opacity; from: 0; to: 1; dur: 800; delay: 1200");
  introContainer.appendChild(textRuins);

  // --- Overlay outro ---
  setTimeout(() => {
    const outroOverlay = document.createElement("div");
    outroOverlay.id = "outroOverlay";
    outroOverlay.className = "overlay";
    const outroImg = document.createElement("img");
    outroImg.src = "images/outro1.png";
    outroOverlay.appendChild(outroImg);
    document.body.appendChild(outroOverlay);

    setTimeout(() => {
      outroOverlay.classList.add("show");
    }, 50);
  }, 10000);
}

// --- Avvio ---
document.addEventListener("DOMContentLoaded", function () {
  initMainSequence();
});
