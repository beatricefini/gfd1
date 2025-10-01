document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");

  scene.addEventListener("loaded", () => {
    const marker = document.querySelector("#marker");
    const introImage = document.querySelector("#introImage");
    const tapText = document.querySelector("#tapText");
    const modelsContainer = document.querySelector("#modelsContainer");

    let canStart = false;

    if (!marker || !introImage || !tapText || !modelsContainer) {
      console.error("❌ Elementi AR non trovati!");
      return;
    }

    // Nascondi container all'inizio
    modelsContainer.setAttribute("visible", false);

    marker.addEventListener("targetFound", () => {
      introImage.setAttribute("visible", true);

      setTimeout(() => {
        tapText.setAttribute("visible", true);
        canStart = true;
      }, 3000);
    });

    marker.addEventListener("targetLost", () => {
      introImage.setAttribute("visible", false);
      tapText.setAttribute("visible", false);
      canStart = false;
      modelsContainer.setAttribute("visible", false);

      // Riporta tutti i modelli a scale 0 per pop-up successivo
      const models = modelsContainer.querySelectorAll("a-entity");
      models.forEach(m => m.setAttribute("scale", "0 0 0"));
    });

    // Click su Tap to Start
    tapText.addEventListener("click", () => {
      if (!canStart) return;

      introImage.setAttribute("visible", false);
      tapText.setAttribute("visible", false);
      modelsContainer.setAttribute("visible", true);

      // Animazione pop-up per ciascun modello
      const models = modelsContainer.querySelectorAll("a-entity");
      models.forEach(m => {
        m.setAttribute("animation", {
          property: "scale",
          to: "1 1 1",   // scala finale reale
          dur: 500,      // 0.5 secondi
          easing: "easeOutElastic"
        });
      });
    });
  });
});
