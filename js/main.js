document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const modelsContainer = document.getElementById("modelsContainer");
  const camera = document.querySelector("a-camera");

  const models = ["#piece1","#piece2","#piece3","#piece4","#piece5","#piece6"];
  let started = false;
  let currentIndex = 0;
  let allModelsDisplayed = false;
  let frameEntities = [];
  let sequenceStep = 0;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    const introText = document.createElement("a-text");
    introText.setAttribute("value","Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align","center");
    introText.setAttribute("color","#008000");
    introText.setAttribute("position","0 0.2 0");
    introText.setAttribute("scale","0.25 0.25 0.25");
    introText.setAttribute("wrap-count","20");
    introText.setAttribute("id","introText");
    introContainer.appendChild(introText);

    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value","Tap to start");
      startText.setAttribute("align","center");
      startText.setAttribute("color","#FFD700");
      startText.setAttribute("position","0 0 0");
      startText.setAttribute("scale","0.2 0.2 0.2");
      startText.setAttribute("wrap-count","20");
      startText.setAttribute("id","startText");
      introContainer.appendChild(startText);
    },500);
  });

  window.addEventListener("click", () => {
    if(!started){
      const introText = document.getElementById("introText");
      const startText = document.getElementById("startText");
      if(introText) introText.setAttribute("visible","false");
      if(startText) startText.setAttribute("visible","false");
      started = true;
      showAllModelsSequentially();
    } else if(allModelsDisplayed){
      handleSequences();
    }
  });

  function showAllModelsSequentially(){
    if(currentIndex >= models.length){
      allModelsDisplayed = true;
      const tapText = document.createElement("a-text");
      tapText.setAttribute("value","Tap the screen");
      tapText.setAttribute("align","center");
      tapText.setAttribute("color","#FFD700");
      tapText.setAttribute("position","0 -0.6 0");
      tapText.setAttribute("scale","0.2 0.2 0.2");
      tapText.setAttribute("wrap-count","20");
      tapText.setAttribute("id","tapText");
      introContainer.appendChild(tapText);
      return;
    }

    const piece = document.createElement("a-entity");
    piece.setAttribute("gltf-model",models[currentIndex]);
    piece.setAttribute("visible","false");

    piece.addEventListener("model-loaded", () => {
      const originalScale = piece.object3D.scale.clone();
      piece.setAttribute("scale","0 0 0");
      piece.setAttribute("visible","true");
      piece.setAttribute("animation__pop",{
        property:"scale",
        from:"0 0 0",
        to:`${originalScale.x} ${originalScale.y} ${originalScale.z}`,
        dur:400,
        easing:"easeOutQuad"
      });
    });

    modelsContainer.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showAllModelsSequentially,800);
  }

  function clearOldTexts(){
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach(t=>{
      if(t.id!=="tapText") t.remove();
    });
  }

  function handleSequences(){
    const tapText = document.getElementById("tapText");
    if(tapText) tapText.setAttribute("visible","false");
    clearOldTexts();

    // Mostriamo sempre i modelli e facciamo "zoom" solo sulla Z relativa
    frameEntities.forEach(ent=>{
      ent.setAttribute("visible","true");
      ent.removeAttribute("animation__zoom");
    });

    if(sequenceStep===0){
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Focus su piece1 e piece2");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.4 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);

      [frameEntities[0],frameEntities[1]].forEach(p=>{
        const pos = p.object3D.position.clone();
        p.setAttribute("animation__zoom",{
          property:"position",
          to:{x:pos.x,y:pos.y,z:pos.z+0.15},
          dur:600,
          easing:"easeOutQuad"
        });
      });

      sequenceStep=1;
    } else if(sequenceStep===1){
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Secondo testo per piece1 e piece2");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.5 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);

      sequenceStep=2;
    } else if(sequenceStep===2){
      // ritorno tutte le cornici
      frameEntities.forEach(p=>{
        const pos = p.object3D.position.clone();
        p.setAttribute("animation__zoom",{
          property:"position",
          to:{x:pos.x,y:pos.y,z:pos.z},
          dur:600,
          easing:"easeOutQuad"
        });
      });
      sequenceStep=3;
    }
    // ... aggiungi altre sequenze simili
  }
});


