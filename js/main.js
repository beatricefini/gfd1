document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('cameraVideo');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("❌ Impossibile accedere alla camera:", err));

  const container = document.getElementById('framesContainer');
  const camera = document.getElementById('camera');

  let introDone = false;
  let currentIndex = 0;
  const frameEntities = [];

  // --- Luci ---
  const scene = document.querySelector('a-scene');
  const ambientLight = document.createElement('a-entity');
  ambientLight.setAttribute('light', 'type: ambient; color: #FFFFFF; intensity: 0.7');
  scene.appendChild(ambientLight);

  const directionalLight = document.createElement('a-entity');
  directionalLight.setAttribute('light', 'type: directional; color: #FFFFFF; intensity: 0.5');
  directionalLight.setAttribute('position', '0 4 2');
  scene.appendChild(directionalLight);

  // --- Testi ---
  const introText = document.createElement('a-text');
  introText.setAttribute('value', 'Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata');
  introText.setAttribute('align', 'center');
  introText.setAttribute('color', '#008000');
  introText.setAttribute('position', { x: 0, y: 3, z: -1.2 });
  introText.setAttribute('scale', { x: 0.8, y: 0.8, z: 0.8 });
  introText.setAttribute('wrap-count', '20');
  container.appendChild(introText);

  const startText = document.createElement('a-text');
  startText.setAttribute('value', 'Click anywhere\non the screen\nto start');
  startText.setAttribute('align', 'center');
  startText.setAttribute('color', '#FFD700');
  startText.setAttribute('position', { x: 0, y: 0.0, z: -1.2 });
  startText.setAttribute('scale', { x: 0.7, y: 0.7, z: 0.7 });
  startText.setAttribute('wrap-count', '20');
  startText.setAttribute('visible', 'false');
  container.appendChild(startText);

  setTimeout(() => startText.setAttribute('visible', 'true'), 2000);

  // --- Modelli ---
  const models = [
    'models/piece1.glb',
    'models/piece2.glb',
    'models/piece3.glb',
    'models/piece4.glb',
    'models/piece5.glb',
    'models/piece6.glb'
  ];

  // --- Mostra cornici una alla volta ---
  function showNextFrame() {
    if (currentIndex >= models.length) return;

    const piece = document.createElement('a-entity');
    piece.setAttribute('gltf-model', models[currentIndex]);
    piece.setAttribute('scale', '1 1 1');
    piece.setAttribute('position', '0 0 0');

    piece.setAttribute('animation__pop', {
      property: 'scale',
      from: '0 0 0',
      to: '1 1 1',
      dur: 400,
      easing: 'easeOutElastic'
    });

    piece.addEventListener('model-loaded', () => console.log(`✅ Caricato: ${models[currentIndex]}`));

    container.appendChild(piece);
    frameEntities.push(piece);
    currentIndex++;
    setTimeout(showNextFrame, 600);
  }

  // --- Stato sequenza ---
  let step = 0; // 0 = intro, 1 = zoom piece1/2, 2 = ritorno, 3 = zoom piece3/4/5, 4 = ritorno, 5 = zoom piece6, 6 = fine

  // --- Funzioni Zoom ---
  function zoomPiece1and2() {
    const p1 = frameEntities[0];
    const p2 = frameEntities[1];

    // Nascondi le altre cornici
    for (let i = 2; i < frameEntities.length; i++) frameEntities[i].setAttribute('visible', 'false');

    // Affianca piece1 e piece2
    p1.setAttribute('position', { x: -0.5, y: 2.0, z: -1.5 });
    p2.setAttribute('position', { x: 0.5, y: 2.0, z: -1.5 });
    p1.setAttribute('scale', { x: 1, y: 1, z: 1 });
    p2.setAttribute('scale', { x: 1, y: 1, z: 1 });

    // Zoom camera
    camera.setAttribute('animation__zoom', {
      property: 'position',
      to: { x: 0, y: 4, z: 2 },
      dur: 600,
      easing: 'easeOutQuad'
    });

    // Dopo zoom, mostra testi sequenziali
    camera.addEventListener('animationcomplete__zoom', () => {
      const texts = [
        'Queste due cornici\nrappresentano le principali\ndella tua collezione',
        'Ecco alcune informazioni\naggiuntive sulle cornici\nprincipali della collezione'
      ];
      let textIndex = 0;

      const infoText = document.createElement('a-text');
      infoText.setAttribute('value', texts[textIndex]);
      infoText.setAttribute('align', 'center');
      infoText.setAttribute('color', '#008000');
      infoText.setAttribute('position', { x: 0, y: 3, z: -1.2 });
      infoText.setAttribute('scale', { x: 0.4, y: 0.4, z: 0.4 });
      infoText.setAttribute('wrap-count', '20');
      container.appendChild(infoText);

      const listener = () => {
        textIndex++;
        if (textIndex < texts.length) {
          infoText.setAttribute('value', texts[textIndex]);
        } else {
          // Ritorno alla vista con tutte le cornici
          camera.setAttribute('animation__back', {
            property: 'position',
            to: { x: 0, y: 1.5, z: 5 },
            dur: 600,
            easing: 'easeOutQuad'
          });
          // Ripristina cornici
          frameEntities.forEach(f => { f.setAttribute('visible', 'true'); f.setAttribute('position', '0 0 0'); f.setAttribute('scale', '1 1 1'); });
          infoText.setAttribute('visible', 'false');
          step = 3; // prossima fase zoom piece3/4/5
          window.removeEventListener('click', listener);
        }
      };

      window.addEventListener('click', listener);
    }, { once: true });
  }

  function zoomPiece3to5() {
    const pieces = [frameEntities[2], frameEntities[3], frameEntities[4]];

    // Nascondi le altre cornici
    frameEntities.forEach((f, idx) => {
      if (!pieces.includes(f)) f.setAttribute('visible', 'false');
    });

    // Posizione affiancata
    pieces[0].setAttribute('position', { x: -1, y: 2, z: -1.5 });
    pieces[1].setAttribute('position', { x: 0, y: 2, z: -1.5 });
    pieces[2].setAttribute('position', { x: 1, y: 2, z: -1.5 });

    // Scala identica
    pieces.forEach(p => p.setAttribute('scale', { x: 1, y: 1, z: 1 }));

    camera.setAttribute('animation__zoom2', {
      property: 'position',
      to: { x: 0, y: 4, z: 2 },
      dur: 600,
      easing: 'easeOutQuad'
    });

    camera.addEventListener('animationcomplete__zoom2', () => {
      const texts = [
        'Queste tre cornici\nsono importanti\nnella tua collezione',
        'Puoi osservarne le caratteristiche\npiù interessanti\nqui sotto',
        'Ogni cornice ha una storia\nda raccontare\nalla tua collezione'
      ];
      let textIndex = 0;

      const infoText = document.createElement('a-text');
      infoText.setAttribute('value', texts[textIndex]);
      infoText.setAttribute('align', 'center');
      infoText.setAttribute('color', '#008000');
      infoText.setAttribute('position', { x: 0, y: 3, z: -1.2 });
      infoText.setAttribute('scale', { x: 0.4, y: 0.4, z: 0.4 });
      infoText.setAttribute('wrap-count', '20');
      container.appendChild(infoText);

      const listener = () => {
        textIndex++;
        if (textIndex < texts.length) {
          infoText.setAttribute('value', texts[textIndex]);
        } else {
          camera.setAttribute('animation__back2', {
            property: 'position',
            to: { x: 0, y: 1.5, z: 5 },
            dur: 600,
            easing: 'easeOutQuad'
          });
          frameEntities.forEach(f => { f.setAttribute('visible', 'true'); f.setAttribute('position', '0 0 0'); f.setAttribute('scale', '1 1 1'); });
          infoText.setAttribute('visible', 'false');
          step = 5; // prossima fase zoom piece6
          window.removeEventListener('click', listener);
        }
      };

      window.addEventListener('click', listener);
    }, { once: true });
  }

  function zoomPiece6() {
    const piece = frameEntities[5];

    frameEntities.forEach((f, idx) => { if (idx !== 5) f.setAttribute('visible', 'false'); });

    piece.setAttribute('position', { x: 0, y: 2, z: -1.5 });
    piece.setAttribute('scale', { x: 1, y: 1, z: 1 });

    camera.setAttribute('animation__zoom3', {
      property: 'position',
      to: { x: 0, y: 4, z: 2 },
      dur: 600,
      easing: 'easeOutQuad'
    });

    camera.addEventListener('animationcomplete__zoom3', () => {
      const infoText = document.createElement('a-text');
      infoText.setAttribute('value', 'Ultima cornice da osservare\nqui sotto il testo informativo\nper la tua collezione');
      infoText.setAttribute('align', 'center');
      infoText.setAttribute('color', '#008000');
      infoText.setAttribute('position', { x: 0, y: 3, z: -1.2 });
      infoText.setAttribute('scale', { x: 0.4, y: 0.4, z: 0.4 });
      infoText.setAttribute('wrap-count', '20');
      container.appendChild(infoText);

      const listener = () => {
        camera.setAttribute('animation__back3', {
          property: 'position',
          to: { x: 0, y: 1.5, z: 5 },
          dur: 600,
          easing: 'easeOutQuad'
        });
        frameEntities.forEach(f => { f.setAttribute('visible', 'true'); f.setAttribute('position', '0 0 0'); f.setAttribute('scale', '1 1 1'); });
        infoText.setAttribute('visible', 'false');
        step = 6; // sequenza finita
        window.removeEventListener('click', listener);
      };

      window.addEventListener('click', listener);
    }, { once: true });
  }

  // --- Click globale ---
  window.addEventListener('click', () => {
    if (!introDone) {
      introText.setAttribute('visible', 'false');
      startText.setAttribute('visible', 'false');
      introDone = true;
      showNextFrame();
    } else if (step === 0 && currentIndex >= 2) {
      step = 1;
      zoomPiece1and2();
    } else if (step === 3) {
      zoomPiece3to5();
    } else if (step === 5) {
      zoomPiece6();
    }
  });
});








