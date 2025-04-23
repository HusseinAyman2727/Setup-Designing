const lightSteps = [0.97, 0.94, 0.89, 0.77, 0.62, 0.5];
const darkSteps = [0.4, 0.33, 0.22, 0.16, 0.09, 0.05];

function generateColorPalette(inputColor) {
  const inputHSL = chroma(inputColor).hsl();
  const hue = inputHSL[0];
  const sat = inputHSL[1];

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

  const tints = lightSteps.map((l) => chroma.hsl(hue, sat, l).hex());
  const shades = darkSteps.map((l) => chroma.hsl(hue, sat, l).hex());

  const colors = [
    ...tints.map((v, i) => ({ label: `--primary-light-${i + 1}`, value: v })),
    ...shades.map((v, i) => ({ label: `--primary-dark-${i + 1}`, value: v })),
  ];

  // Primary color CSS variable
  const baseLi = document.createElement("li");
  baseLi.className = "base-primary";
  baseLi.innerHTML = `
    <span class="var-name">--primary:</span>
    <span class="var-value">${inputColor.toUpperCase()};</span>`;
  variablesList.appendChild(baseLi);

  // Primary palette colors
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

  // Primary card
  const baseCard = document.createElement("div");
  baseCard.className = "color-card";
  baseCard.style.backgroundColor = inputColor;
  baseCard.style.color = getTextColor(inputColor);
  baseCard.innerHTML = `
    <div class="color-label">--primary</div>
    <div class="color-value">${inputColor.toUpperCase()}</div>`;
  paletteList.appendChild(baseCard);

  // 🎯 Color presets generation
  const presets = {
    "--complementary": chroma(inputColor).set("hsl.h", "+180").hex(),
    "--analogous-1": chroma(inputColor).set("hsl.h", "-30").hex(),
    "--analogous-2": chroma(inputColor).set("hsl.h", "+30").hex(),
    "--triadic-1": chroma(inputColor).set("hsl.h", "+120").hex(),
    "--triadic-2": chroma(inputColor).set("hsl.h", "-120").hex(),
    "--tetradic-1": chroma(inputColor).set("hsl.h", "+90").hex(),
    "--tetradic-2": chroma(inputColor).set("hsl.h", "-90").hex(),
  };

  Object.entries(presets).forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = value;
    card.style.color = getTextColor(value);
    card.innerHTML = `
      <div class="color-label">${label}</div>
      <div class="color-value">${value.toUpperCase()}</div>`;
    presetsCards.appendChild(card);

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="var-name">${label}:</span>
      <span class="var-value">${value.toUpperCase()};</span>`;
    presetsVars.appendChild(li);
  });
}

// Input listener
document.getElementById("colorInput").addEventListener("input", (e) => {
  const value = e.target.value.trim();
  const title = document.getElementById("variablesTitle");

  if (chroma.valid(value)) {
    generateColorPalette(value);
  } else {
    title.style.display = "none";
    document.getElementById("variablesList").innerHTML = "";
    document.getElementById("colorsArr").innerHTML = "";
    document.getElementById("presetsSection").style.display = "none";
  }
});
