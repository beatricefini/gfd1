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

  // --- Marker found: parte subito l'esperienza ---
  marker.addEventListener("targetFound", () => {
    if (started) return;
    started = true;
    showAllModelsSequentially();
  });

  // --- Click globale per sequenze successive ---
  window.addEventListener("click", () => {
    if (allModelsDisplayed) {
      handleSequences();
    }
  });

  function showAllModelsSequentially() {
    if (currentIndex >= models.length) {
      allModelsDisplayed = true;
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
    oldTexts.forEach(t => t.remove());
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
      if(typeof callback==="function") callback();
    }, dur+50);
  }

  function handleSequences(){
  clearOldTexts();

  // Funzione per creare un a-image con scala automatica
 function createImage(imgId, posX = 0, posY = 0, posZ = 0) {
  const assetImg = document.getElementById(imgId);
  if (!assetImg) return null;

  const aImg = document.createElement("a-image");
  aImg.setAttribute("src", `#${imgId}`);
  aImg.setAttribute("position", `${posX} ${posY} ${posZ}`);

  // Calcolo proporzioni basate sulla dimensione reale dell'immagine
  const maxDimension = 0.5; // ridotto da 1.5 a 0.5 per immagini più piccole
  let scaleX = assetImg.naturalWidth / assetImg.naturalHeight;
  let scaleY = assetImg.naturalHeight / assetImg.naturalWidth;

  if (assetImg.naturalWidth >= assetImg.naturalHeight) {
    aImg.setAttribute("width", maxDimension);
    aImg.setAttribute("height", maxDimension / scaleX);
  } else {
    aImg.setAttribute("height", maxDimension);
    aImg.setAttribute("width", maxDimension / scaleY);
  }

  return aImg;
}


  // --- SEQUENZE ---
  if(sequenceStep===0){
    frameEntities.forEach((ent,i)=>{ if(i>1) ent.setAttribute("visible","false"); });
    frameEntities[0].setAttribute("animation__pos_zoom",{ property:"position", to:"-0.35 0 0.1", dur:800, easing:"easeInOutQuad" });
    frameEntities[1].setAttribute("animation__pos_zoom",{ property:"position", to:"0.05 0.12 0.4", dur:800, easing:"easeInOutQuad" });
    frameEntities[0].setAttribute("animation__scale_zoom",{ property:"scale", to:"1.2 1.2 1.2", dur:800, easing:"easeInOutQuad" });
    frameEntities[1].setAttribute("animation__scale_zoom",{ property:"scale", to:"2.1 2.1 2.1", dur:800, easing:"easeInOutQuad" });
    camera.setAttribute("animation__cam_zoom",{ property:"position", to:"0 0 0.5", dur:800, easing:"easeInOutQuad" });

    const img1 = createImage("text1Img",0,-0.2,0.6);
    if(img1) introContainer.appendChild(img1);
    sequenceStep=1;

  } else if(sequenceStep===1){
    const img2 = createImage("text2Img",0,-0.2,0.6);
    if(img2) introContainer.appendChild(img2);
    sequenceStep=2;

  } else if(sequenceStep===2){
    resetAllModels([0,1],()=>{sequenceStep=3;});

  } else if(sequenceStep===3){
    frameEntities.forEach((ent,i)=>{ if(i<2 || i>4) ent.setAttribute("visible","false"); });
    [2,3,4].forEach(i=>frameEntities[i].setAttribute("animation__scale_zoom",{ property:"scale", to:"1.2 1.2 1.2", dur:800, easing:"easeInOutQuad" }));
    frameEntities[2].setAttribute("animation__pos_zoom",{ property:"position", to:"-0.05 0.2 0.35", dur:800, easing:"easeInOutQuad" });
    frameEntities[3].setAttribute("animation__pos_zoom",{ property:"position", to:"0.05 0.45 0.35", dur:800, easing:"easeInOutQuad" });
    frameEntities[4].setAttribute("animation__pos_zoom",{ property:"position", to:"0.15 0.3 0.35", dur:800, easing:"easeInOutQuad" });
    camera.setAttribute("animation__cam_zoom",{ property:"position", to:"0 0 0.6", dur:800, easing:"easeInOutQuad" });

    const img3 = createImage("text3Img",0,-0.2,0.6);
    if(img3) introContainer.appendChild(img3);
    sequenceStep=4;

  } else if(sequenceStep===4){
    resetAllModels([2,3,4],()=>{sequenceStep=5;});

  } else if(sequenceStep===5){
    frameEntities.forEach((ent,i)=>{ if(i!==5) ent.setAttribute("visible","false"); });
    frameEntities[5].setAttribute("animation__pos_zoom",{ property:"position", to:"0.3 -0.15 0.35", dur:800, easing:"easeInOutQuad" });
    frameEntities[5].setAttribute("animation__scale_zoom",{ property:"scale", to:"1.7 1.7 1.7", dur:800, easing:"easeInOutQuad" });
    camera.setAttribute("animation__cam_zoom",{ property:"position", to:"0 0 0.6", dur:800, easing:"easeInOutQuad" });

    const img4 = createImage("text4Img",0,-0.2,0.6);
    if(img4) introContainer.appendChild(img4);
    sequenceStep=6;

  } else if(sequenceStep===6){
    const img5 = createImage("text5Img",0,-0.2,0.6);
    if(img5) introContainer.appendChild(img5);
    sequenceStep=7;

  } else if(sequenceStep===7){
    resetAllModels([0,1,2,3,4,5],()=>{
      setTimeout(()=>{
        frameEntities.forEach(ent=>ent.setAttribute("animation__popout",{ property:"scale", to:"0 0 0", dur:800, easing:"easeInQuad" }));
        setTimeout(()=>showFinalCinema(),800);
      },3000);
    });
    sequenceStep=8;
  }
}



function showFinalCinema(){
  frameEntities.forEach(ent => ent.setAttribute("visible","false"));
  clearOldTexts();

  // Aggiungo il modello cinema
  const cinemaModel = document.createElement("a-entity");
  cinemaModel.setAttribute("gltf-model","#pieceCinema");
  cinemaModel.setAttribute("position",{x:0,y:-0.3,z:0.5});
  cinemaModel.setAttribute("scale",{x:1.5,y:1.5,z:1.5});
  cinemaModel.addEventListener("model-loaded", () => cinemaModel.setAttribute("visible","true"));
  modelsContainer.appendChild(cinemaModel);

  // Mostro overlay HTML/CSS con fade-in dopo 10s
  setTimeout(() => {
    let outroOverlay = document.getElementById("outroOverlay");
    if (!outroOverlay) {
      outroOverlay = document.createElement("div");
      outroOverlay.id = "outroOverlay";
      outroOverlay.className = "overlay";
      outroOverlay.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.src = "images/outro1.png"; // usa il tuo src
      outroOverlay.appendChild(img);

      document.body.appendChild(outroOverlay);
    }

    // Aggiungo classe show per fade-in
    outroOverlay.classList.add("show");
    outroOverlay.removeAttribute("aria-hidden");
  }, 10000);
}


}
