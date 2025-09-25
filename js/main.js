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
      const originalPos = piece.object3D.position.clone();
      const originalScale = piece.object3D.scale.clone();
      piece.setAttribute("position", originalPos);
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
    setTimeout(showAllModelsSequentially,700); // comparsa rapida
  }

  function clearOldTexts(){
    const oldTexts = introContainer.querySelectorAll("a-text");
    oldTexts.forEach(t=>{
      if(t.id!=="tapText") t.remove();
    });
  }

  function resetAllModels(){
    frameEntities.forEach(p=>{
      p.setAttribute("visible","true");
      p.removeAttribute("animation__zoom");
      const originalPos = p.object3D.position.clone();
      const originalScale = p.object3D.scale.clone();
      p.setAttribute("animation__resetPos",{
        property:"position",
        to:{x:originalPos.x,y:originalPos.y,z:originalPos.z},
        dur:600,
        easing:"easeOutQuad"
      });
      p.setAttribute("animation__resetScale",{
        property:"scale",
        to:{x:originalScale.x,y:originalScale.y,z:originalScale.z},
        dur:600,
        easing:"easeOutQuad"
      });
    });

    const tapText = document.getElementById("tapText");
    if(tapText) tapText.setAttribute("visible","true");
  }

  function handleSequences(){
    const tapText = document.getElementById("tapText");
    if(tapText) tapText.setAttribute("visible","false");
    clearOldTexts();

    if(sequenceStep===0){
      // Sequenza 1: piece1 e piece2
      frameEntities.forEach((p,i)=>{p.setAttribute("visible", i<2 ? "true":"false");});
      [frameEntities[0],frameEntities[1]].forEach(p=>{
        const pos = p.object3D.position.clone();
        const scale = p.object3D.scale.clone();
        p.setAttribute("animation__zoom",{
          property:"position",
          to:{x:pos.x,y:pos.y,z:pos.z+0.15},
          dur:600,
          easing:"easeOutQuad"
        });
        p.setAttribute("animation__scale",{
          property:"scale",
          to:{x:scale.x*1.2,y:scale.y*1.2,z:scale.z*1.2},
          dur:600,
          easing:"easeOutQuad"
        });
      });
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Focus su piece1 e piece2");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.4 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=1;

    } else if(sequenceStep===1){
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Secondo testo su piece1 e piece2");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.5 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=2;

    } else if(sequenceStep===2){
      resetAllModels();
      sequenceStep=3;

    } else if(sequenceStep===3){
      // Sequenza 2: piece3,4,5
      frameEntities.forEach((p,i)=>{p.setAttribute("visible",(i>=2&&i<=4)?"true":"false");});
      [frameEntities[2],frameEntities[3],frameEntities[4]].forEach(p=>{
        const pos = p.object3D.position.clone();
        const scale = p.object3D.scale.clone();
        p.setAttribute("animation__zoom",{
          property:"position",
          to:{x:pos.x,y:pos.y,z:pos.z+0.15},
          dur:600,
          easing:"easeOutQuad"
        });
        p.setAttribute("animation__scale",{
          property:"scale",
          to:{x:scale.x*1.2,y:scale.y*1.2,z:scale.z*1.2},
          dur:600,
          easing:"easeOutQuad"
        });
      });
      const texts = ["Primo testo su piece3-5","Secondo testo su piece3-5","Terzo testo su piece3-5"];
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value",texts[0]);
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.4 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=4; // passerà ai testi successivi ad ogni tap

    } else if(sequenceStep===4){
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Secondo testo su piece3-5");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.5 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=5;

    } else if(sequenceStep===5){
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Terzo testo su piece3-5");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.6 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=6;

    } else if(sequenceStep===6){
      resetAllModels();
      sequenceStep=7;

    } else if(sequenceStep===7){
      // Sequenza 3: piece6
      frameEntities.forEach((p,i)=>{p.setAttribute("visible",i===5?"true":"false");});
      const p6 = frameEntities[5];
      const pos = p6.object3D.position.clone();
      const scale = p6.object3D.scale.clone();
      p6.setAttribute("animation__zoom",{
        property:"position",
        to:{x:pos.x,y:pos.y,z:pos.z+0.15},
        dur:600,
        easing:"easeOutQuad"
      });
      p6.setAttribute("animation__scale",{
        property:"scale",
        to:{x:scale.x*1.2,y:scale.y*1.2,z:scale.z*1.2},
        dur:600,
        easing:"easeOutQuad"
      });
      const infoText = document.createElement("a-text");
      infoText.setAttribute("value","Focus su piece6");
      infoText.setAttribute("align","center");
      infoText.setAttribute("color","#008000");
      infoText.setAttribute("position","0 -0.4 0");
      infoText.setAttribute("scale","0.15 0.15 0.15");
      infoText.setAttribute("wrap-count","30");
      introContainer.appendChild(infoText);
      sequenceStep=8;

    } else if(sequenceStep===8){
      resetAllModels();
      sequenceStep=9;
    }
  }
});

