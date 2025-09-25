document.addEventListener("DOMContentLoaded", () => {
  const marker = document.getElementById("marker");
  const introContainer = document.getElementById("introTexts");
  const cube = document.getElementById("cube");

  let started = false;

  marker.addEventListener("targetFound", () => {
    if (started) return;

    // Testo introduttivo diviso in righe
    const introText = document.createElement("a-text");
    introText.setAttribute("value", "Benvenuto\nnel tuo piccolo\ncinema personale\nin realtà aumentata");
    introText.setAttribute("align", "center");
    introText.setAttribute("color", "#008000");
    introText.setAttribute("position", "0 0.5 0");
    introText.setAttribute("scale", "0.7 0.7 0.7");
    introText.setAttribute("wrap-count", "20");
    introText.setAttribute("id", "introText");
    introContainer.appendChild(introText);

    // Testo "Tap to start" che compare dopo 3 secondi
    setTimeout(() => {
      const startText = document.createElement("a-text");
      startText.setAttribute("value", "Tap to start");
      startText.setAttribute("align", "center");
      startText.setAttribute("color", "#FFD700");
      startText.setAttribute("position", "0 -0.2 0");
      startText.setAttribute("scale", "0.6 0.6 0.6");
      startText.setAttribute("wrap-count", "20");
      startText.setAttribute("id", "startText");
      introContainer.appendChild(startText);
    }, 3000);
  });

  // Tap per iniziare
  window.addEventListener("click", () => {
    if (started) return;
    const introText = document.getElementById("introText");
    const startText = document.getElementById("startText");
    if (introText) introText.setAttribute("visible", "false");
    if (startText) startText.setAttribute("visible", "false");
    cube.setAttribute("visible", "true");
    started = true;
  });
});






