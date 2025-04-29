const lightSteps = [0.97, 0.94, 0.89, 0.77, 0.62, 0.5];
const darkSteps = [0.4, 0.33, 0.22, 0.16, 0.09, 0.05];

function generateColorPalette(inputColor) {
  const paletteList = document.querySelector("#colorsArr");
  const variablesList = document.querySelector("#variablesList");
  const variablesTitle = document.querySelector("#variablesTitle");
  const presetsSection = document.getElementById("presetsSection");
  const presetsCards = document.getElementById("presetsCards");
  const presetsVars = document.getElementById("presetsVars");

  variablesTitle.style.display = "block";
  paletteList.innerHTML = "";
  variablesList.innerHTML = "";
  presetsCards.innerHTML = "";
  presetsVars.innerHTML = "";
  presetsSection.style.display = "block";

  const getTextColor = (bg) => (chroma(bg).luminance() > 0.5 ? "#000" : "#fff");

  const tints = lightSteps.map((l) =>
    chroma.mix("white", inputColor, 1 - l, "rgb").hex()
  );
  const shades = darkSteps.map((l) =>
    chroma.mix("black", inputColor, 1 - l, "rgb").hex()
  );

  const colors = [
    ...tints.map((v, i) => ({ label: `--primary-light-${i + 1}`, value: v })),
    ...shades.map((v, i) => ({ label: `--primary-dark-${i + 1}`, value: v })),
  ];

  // ✅ Set CSS Variables in :root
  const root = document.documentElement;
  root.style.setProperty('--primary', inputColor);
  tints.forEach((color, i) => {
    root.style.setProperty(`--primary-light-${i + 1}`, color);
  });
  shades.forEach((color, i) => {
    root.style.setProperty(`--primary-dark-${i + 1}`, color);
  });

  // 📝 Primary variable display
  const baseLi = document.createElement("li");
  baseLi.className = "base-primary";
  baseLi.innerHTML = `
    <span class="var-name">--primary:</span>
    <span class="var-value">${inputColor.toUpperCase()};</span>`;
  variablesList.appendChild(baseLi);

  colors.forEach((item) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = item.value;
    card.style.color = getTextColor(item.value);
    card.innerHTML = `
      <div class="color-label">${item.label}</div>
      <div class="color-value">${item.value.toUpperCase()}</div>`;
    paletteList.appendChild(card);

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="var-name">${item.label}:</span>
      <span class="var-value">${item.value.toUpperCase()};</span>`;
    variablesList.appendChild(li);
  });

  const baseCard = document.createElement("div");
  baseCard.className = "color-card";
  baseCard.style.backgroundColor = inputColor;
  baseCard.style.color = getTextColor(inputColor);
  baseCard.innerHTML = `
    <div class="color-label">--primary</div>
    <div class="color-value">${inputColor.toUpperCase()}</div>`;
  paletteList.appendChild(baseCard);

  const presets = {
    analogic: [
      chroma(inputColor).set("hsl.h", "-20").hex(),
      chroma(inputColor).set("hsl.h", "+20").hex(),
      chroma(inputColor).set("hsl.h", "+60").hex(),
      chroma(inputColor).set("hsl.h", "-60").hex(),
    ],
    mono: [
      chroma(inputColor)
        .set("hsl.l", Math.max(0.1, chroma(inputColor).hsl()[2] - 0.2))
        .hex(),
      chroma(inputColor).brighten(1.5).saturate(1).hex(),
      chroma(inputColor).brighten(0.7).saturate(0.5).hex(),
      chroma(inputColor).set("hsl.l", 1).hex(),
    ],
    triade: [
      chroma(inputColor).set("hsl.h", "+120").hex(),
      chroma(inputColor).set("hsl.h", "-120").hex(),
      chroma(inputColor).set("hsl.h", "+150").hex(),
      chroma(inputColor).set("hsl.h", "-150").hex(),
    ],
    complementary: [
      inputColor,
      chroma(inputColor).brighten(1).hex(),
      chroma(inputColor).set("hsl.h", "+180").hex(),
      chroma(inputColor).set("hsl.h", "+180").darken(1).hex(),
    ],
    tetrade: [
      chroma(inputColor).set("hsl.h", "+60").hex(),
      chroma(inputColor).set("hsl.h", "+180").hex(),
      chroma(inputColor).set("hsl.h", "-60").hex(),
      chroma(inputColor).set("hsl.h", "-180").hex(),
    ],
    random: Array.from({ length: 4 }, () =>
      chroma.random().saturate(1.5).brighten(1).hex()
    ),
  };

  Object.entries(presets).forEach(([group, colors]) => {
    colors.forEach((color) => {
      const card = document.createElement("div");
      card.className = "color-card";
      card.style.backgroundColor = color;
      card.style.color = getTextColor(color);
      card.innerHTML = `
        <div class="color-label">${group}</div>
        <div class="color-value">${color.toUpperCase()}</div>`;
      presetsCards.appendChild(card);
    });
  });
}

function resetDisplay() {
  document.getElementById("variablesTitle").style.display = "none";
  document.getElementById("variablesList").innerHTML = "";
  document.getElementById("colorsArr").innerHTML = "";
  document.getElementById("presetsSection").style.display = "none";
}

// 🔄 Input listeners & syncing
const colorInput = document.getElementById("colorInput");
const colorPicker = document.getElementById("colorPicker");

// Sync on load
window.addEventListener("DOMContentLoaded", () => {
  const initialColor = colorInput.value.trim();
  if (chroma.valid(initialColor)) {
    generateColorPalette(initialColor);
    colorPicker.value = chroma(initialColor).hex();
  }
});

colorInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  if (chroma.valid(value)) {
    generateColorPalette(value);
    colorPicker.value = chroma(value).hex();
  } else {
    resetDisplay();
  }
});

colorPicker.addEventListener("input", (e) => {
  const value = e.target.value;
  colorInput.value = value;
  generateColorPalette(value);
});
