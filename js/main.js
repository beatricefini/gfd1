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

  const originalTransforms = {};

  // --- Intro / target found ---
  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Immagine intro
    const introImg = document.createElement("a-plane");
    introImg.setAttribute("src", "#introImg");
    introImg.setAttribute("position", "0 0.3 0");
    introImg.setAttribute("scale", "0.8 0.6 1");
    introImg.setAttribute("material", "transparent: true");
    introContainer.appendChild(introImg);

    // Tap to start testo dopo 3 secondi
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.2 0.2 0.2");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 3000);
  });

  // --- Global click handler ---
  window.addEventListener("click", () => {
    // Intro
    if (!started) {
      const startText = document.getElementById("startText");
      if (!startText) return; // blocca finché tapText non appare

      const introPlane = introContainer.querySelector("a-plane"); // prende l'immagine intro

      // Fade-out animazione testo
      startText.setAttribute("animation__fadeout", {
        property: "opacity",
        from: 1,
        to: 0,
        dur: 600,
        easing: "easeInQuad"
      });

      // Fade-out animazione immagine
      if (introPlane) {
        introPlane.setAttribute("animation__fadeout", {
          property: "opacity",
          from: 1,
          to: 0,
          dur: 600,
          easing: "easeInQuad"
        });
      }

      // Dopo il fade-out, nascondi realmente gli elementi e avvia modelli
      setTimeout(() => {
        startText.setAttribute("visible", "false");
        if (introPlane) introPlane.setAttribute("visible", "false");

        started = true;
        showAllModelsSequentially();
      }, 650); // leggero buffer dopo la durata dell'animazione

      return;
    }

    // Sequenze
    if (allModelsDisplayed) {
      handleSequences();
    }
  });

  // --- Show models one by one ---
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
    const oldTexts = introContainer.querySelectorAll("a-text, a-plane");
    oldTexts.forEach(t => {
      if (t.id !== "tapText") t.remove();
    });
  }

  function resetAllModels(activeIndices = [], callback) {
    const dur = 800;

    frameEntities.forEach((ent, i) => {
      if (!activeIndices.includes(i)) ent.setAttribute("visible", "false");
    });

    activeIndices.forEach(i => {
      const ent = frameEntities[i];
      const orig = originalTransforms[i];
      if (!ent || !orig) return;
      ent.setAttribute("animation__backpos", {
        property: "position",
        to: `${orig.position.x} ${orig.position.y} ${orig.position.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
      ent.setAttribute("animation__backscale", {
        property: "scale",
        to: `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`,
        dur: dur,
        easing: "easeInOutQuad"
      });
    });

    setTimeout(() => {
      frameEntities.forEach((ent, i) => {
        const orig = originalTransforms[i];
        if (orig) {
          ent.setAttribute("position", `${orig.position.x} ${orig.position.y} ${orig.position.z}`);
          ent.setAttribute("scale", `${orig.scale.x} ${orig.scale.y} ${orig.scale.z}`);
        }
        ent.setAttribute("visible", "true");
      });

      camera.setAttribute("animation__camreset", {
        property: "position",
        to: "0 0 0",
        dur: dur,
        easing: "easeInOutQuad"
      });

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

    // --- SEQ1 ---
    if (sequenceStep === 0) {
      frameEntities.forEach((ent, i) => { if (i > 1) ent.setAttribute("visible", "false"); });

      frameEntities[0].setAttribute("animation__pos_zoom", { property: "position", to: "-0.35 0 0.1", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.12 0.4", dur: 800, easing: "easeInOutQuad" });
      frameEntities[0].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      frameEntities[1].setAttribute("animation__scale_zoom", { property: "scale", to: "2.1 2.1 2.1", dur: 800, easing: "easeInOutQuad" });

      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.5", dur: 800, easing: "easeInOutQuad" });

      const img1 = document.createElement("a-plane");
      img1.setAttribute("src", "#text1Img");
      img1.setAttribute("position", "0 -0.4 0");
      img1.setAttribute("scale", "0.5 0.2 1");
      img1.setAttribute("material", "transparent: true");
      introContainer.appendChild(img1);

      sequenceStep = 1;

    } else if (sequenceStep === 1) {
      const img2 = document.createElement("a-plane");
      img2.setAttribute("src", "#text2Img");
      img2.setAttribute("position", "0 -0.5 0");
      img2.setAttribute("scale", "0.5 0.2 1");
      img2.setAttribute("material", "transparent: true");
      introContainer.appendChild(img2);
      sequenceStep = 2;

    } else if (sequenceStep === 2) {
      resetAllModels([0, 1], () => { sequenceStep = 3; });

    // --- SEQ2 ---
    } else if (sequenceStep === 3) {
      frameEntities.forEach((ent, i) => { if (i < 2 || i > 4) ent.setAttribute("visible", "false"); });

      [2,3,4].forEach(i => {
        frameEntities[i].setAttribute("animation__scale_zoom", { property: "scale", to: "1.2 1.2 1.2", dur: 800, easing: "easeInOutQuad" });
      });

      frameEntities[2].setAttribute("animation__pos_zoom", { property: "position", to: "-0.05 0.2 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[3].setAttribute("animation__pos_zoom", { property: "position", to: "0.05 0.45 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[4].setAttribute("animation__pos_zoom", { property: "position", to: "0.15 0.3 0.35", dur: 800, easing: "easeInOutQuad" });

      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

      const img3 = document.createElement("a-plane");
      img3.setAttribute("src", "#text3Img");
      img3.setAttribute("position", "0 -0.4 0");
      img3.setAttribute("scale", "0.5 0.2 1");
      img3.setAttribute("material", "transparent: true");
      introContainer.appendChild(img3);

      sequenceStep = 4;

    } else if (sequenceStep === 4) {
      resetAllModels([2,3,4], () => { sequenceStep = 5; });

    // --- SEQ3 ---
    } else if (sequenceStep === 5) {
      frameEntities.forEach((ent, i) => { if (i !== 5) ent.setAttribute("visible", "false"); });
      frameEntities[5].setAttribute("animation__pos_zoom", { property: "position", to: "0.3 -0.15 0.35", dur: 800, easing: "easeInOutQuad" });
      frameEntities[5].setAttribute("animation__scale_zoom", { property: "scale", to: "1.7 1.7 1.7", dur: 800, easing: "easeInOutQuad" });
      camera.setAttribute("animation__cam_zoom", { property: "position", to: "0 0 0.6", dur: 800, easing: "easeInOutQuad" });

      const img4 = document.createElement("a-plane");
      img4.setAttribute("src", "#text4Img");
      img4.setAttribute("position", "0 -0.4 0");
      img4.setAttribute("scale", "0.5 0.2 1");
      img4.setAttribute("material", "transparent: true");
      introContainer.appendChild(img4);

      sequenceStep = 6; // primo tap atteso

    } else if (sequenceStep === 6) {
      const img5 = document.createElement("a-plane");
      img5.setAttribute("src", "#text5Img");
      img5.setAttribute("position", "0 -0.5 0");
      img5.setAttribute("scale", "0.5 0.2 1");
      img5.setAttribute("material", "transparent: true");
      introContainer.appendChild(img5);
      sequenceStep = 7; // secondo tap atteso

    } else if (sequenceStep === 7) {
      // Ritorno alla vista completa delle cornici
      resetAllModels([0,1,2,3,4,5], () => {
        // Dopo 3s pop inverso
        setTimeout(() => {
          frameEntities.forEach((ent,i) => {
            ent.setAttribute("animation__popout", { property: "scale", to: "0 0 0", dur: 800, easing: "easeInQuad" });
          });
          setTimeout(() => { showFinalCinema(); }, 800);
        }, 3000);
      });
      sequenceStep = 8;
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
    cinemaModel.addEventListener("model-loaded", () => cinemaModel.setAttribute("visible", "true"));
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

    // --- INTEGRAZIONE OUTRO --- 
    setTimeout(() => {
      const outroOverlay = document.createElement("a-plane");
      outroOverlay.setAttribute("src", "#outroImg"); // assicurati di avere <img id="outroImg" src="images/outro1.png"> negli assets
      outroOverlay.setAttribute("position", "0 0 0");
      outroOverlay.setAttribute("scale", "1 0.75 1");
      outroOverlay.setAttribute("material", "transparent: true; opacity: 0");
      introContainer.appendChild(outroOverlay);

      // Fade-in overlay
      outroOverlay.setAttribute("animation__fadein", {
        property: "material.opacity",
        from: 0,
        to: 1,
        dur: 800,
        easing: "easeInQuad"
      });
    }, 10000); // 10 secondi dopo la fine della sequenza
  }
});
