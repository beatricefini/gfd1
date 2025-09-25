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

      // Mostra "Tap the screen"
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
    piece.setAttribute("position", "0 0 0"); // usa posizione di Blender direttamente

    piece.setAttribute("animation__pop", {
      property: "scale",
      from: "0 0 0",
      to: "0.18 0.18 0.18",
      dur: 400,
      easing: "easeOutElastic"
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;

    setTimeout(showAllModelsSequentially, 800); // meno di 1 secondo
  }

  function resetAllModels() {
    frameEntities.forEach((ent) => {
      ent.setAttribute("visible", "true");
      ent.setAttribute("animation__resetPos", {
        property: "position",
        to: { x: 0, y: 0, z: 0 }, // torna posizione di Blender
        dur: 600,
        easing: "easeOutQuad"
      });
      ent.setAttribute("animation__resetScale", {
        property: "scale",
        to: { x: 0.18, y: 0.18, z: 0.18 },
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

    if (sequenceStep === 0) {
      zoomPieces([0, 1], ["Queste due cornici rappresentano le principali della tua collezione",
                          "Sono le opere più importanti, da cui parte la storia"]);
      sequenceStep = 1;
    } else if (sequenceStep === 1) {
      zoomPieces([2, 3, 4], ["Ecco tre opere complementari",
                              "Queste aggiungono varietà alla collezione",
                              "Ognuna di esse arricchisce la narrazione visiva"]);
      sequenceStep = 2;
    } else if (sequenceStep === 2) {
      zoomPieces([5], ["Infine, questa cornice conclusiva"]);
      sequenceStep = 3;
    } else if (sequenceStep === 3) {
      resetAllModels();
      sequenceStep = 4;
    }
  }

  function zoomPieces(indices, texts) {
    const pieces = indices.map(i => frameEntities[i]);

    // Nascondi le altre cornici
    frameEntities.forEach(f => { if (!pieces.includes(f)) f.setAttribute("visible", "false"); });

    // Posizione zoom vicina
    const spacing = 0.2;
    pieces.forEach((p, idx) => {
      p.setAttribute("animation__zoomPos", {
        property: "position",
        to: { x: (idx - (pieces.length-1)/2)*spacing, y: 0, z: -0.2 }, // vicino
        dur: 600,
        easing: "easeOutQuad"
      });
      p.setAttribute("animation__zoomScale", {
        property: "scale",
        to: { x: 0.5, y: 0.5, z: 0.5 },
        dur: 600,
        easing: "easeOutQuad"
      });
    });

    camera.setAttribute("animation__camZoom", {
      property: "position",
      to: { x: 0, y: 0, z: 0.3 }, // camera leggermente avanti
      dur: 600,
      easing: "easeOutQuad"
    });

    let textIndex = 0;
    const infoText = document.createElement("a-text");
    infoText.setAttribute("value", texts[textIndex]);
    infoText.setAttribute("align", "center");
    infoText.setAttribute("color", "#008000");
    infoText.setAttribute("position", "0 -0.3 0");
    infoText.setAttribute("scale", "0.2 0.2 0.2");
    infoText.setAttribute("wrap-count", "30");
    introContainer.appendChild(infoText);

    const listener = () => {
      textIndex++;
      if (textIndex < texts.length) {
        infoText.setAttribute("value", texts[textIndex]);
      } else {
        infoText.setAttribute("visible", "false");
        resetAllModels();
        window.removeEventListener("click", listener);
      }
    };

    window.addEventListener("click", listener);
  }
});
