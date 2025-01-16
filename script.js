const generateBtn = document.getElementById("generate-btn");
const randomBtn = document.getElementById("random-btn");
const complementBtn = document.getElementById("complement-btn");
const hexInput = document.getElementById("hex-input");
const palette = document.getElementById("palette");
// New elements for Contrast Checker
const checkContrastBtn = document.getElementById("check-contrast-btn");
const randomPairBtn = document.getElementById("random-pair-btn");
const color1Input = document.getElementById("color1-input");
const color2Input = document.getElementById("color2-input");
const contrastDisplay = document.getElementById("contrast-display");

// Helper function to generate random hex color
function getRandomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}

// Function to lighten/darken a color
function adjustColor(hex, percent) {
  let num = parseInt(hex.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  );
}

// Function to calculate the complementary color
function getComplementaryColor(hex) {
  const num = parseInt(hex.slice(1), 16);
  const compColor = 0xffffff ^ num; 
  return `#${compColor.toString(16).padStart(6, "0")}`;
}

// Function to generate a palette based on the base color
function generatePalette(baseColor) {
  palette.innerHTML = ""; 

  // Generate 15 colors for a 3x5 grid
  for (let i = 0; i < 18; i++) {
    const adjustment = (i - 9) * 10;
    const adjustedColor = adjustColor(baseColor, adjustment);

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = adjustedColor;

    const hexSpan = document.createElement("span");
    hexSpan.textContent = adjustedColor;

    colorBox.appendChild(hexSpan);
    palette.appendChild(colorBox);
  }
}

// Function to generate a complementary palette
function generateComplementaryPalette(baseColor) {
  const complementaryColor = getComplementaryColor(baseColor);
  generatePalette(complementaryColor);
}

// Event listener for manual color generation
generateBtn.addEventListener("click", () => {
  const hexCode = hexInput.value;

  if (/^#[0-9A-F]{6}$/i.test(hexCode)) {
    generatePalette(hexCode);
  } else {
    alert("Please enter a valid HEX code (e.g., #a0006e).");
  }
});

// Event listener for random color generation
randomBtn.addEventListener("click", () => {
  const randomHex = getRandomHex();
  hexInput.value = randomHex; 
  generatePalette(randomHex);
});

// Event listener for complementary palette generation
complementBtn.addEventListener("click", () => {
  const hexCode = hexInput.value;

  if (/^#[0-9A-F]{6}$/i.test(hexCode)) {
    generateComplementaryPalette(hexCode);
  } else {
    alert("Please enter a valid HEX code (e.g., #a0006e).");
  }
});

// Function to calculate luminance
function calculateLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
  
    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
  
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  
  // Function to set text color based on background color
  function setTextColor(box, bgColor) {
    const luminance = calculateLuminance(bgColor);
    const textColor = luminance > 0.5 ? "black" : "white"; 
    box.querySelector("span").style.color = textColor;
  }
  
  // Update generatePalette to adjust text color
  function generatePalette(baseColor) {
    palette.innerHTML = ""; 
  
    // Generate 15 colors for a 3x5 grid
    for (let i = 0; i < 18; i++) {
      const adjustment = (i - 9) * 10; 
      const adjustedColor = adjustColor(baseColor, adjustment);
  
      const colorBox = document.createElement("div");
      colorBox.className = "color-box";
      colorBox.style.backgroundColor = adjustedColor;
  
      const hexSpan = document.createElement("span");
      hexSpan.textContent = adjustedColor;
  
      colorBox.appendChild(hexSpan);
      palette.appendChild(colorBox);
  
      // Set text color for contrast
      setTextColor(colorBox, adjustedColor);
    }
  }
  

// Function to calculate contrast ratio
function getContrastRatio(color1, color2) {
    const luminance = (hex) => {
      const a = [parseInt(hex.substr(1, 2), 16) / 255, parseInt(hex.substr(3, 2), 16) / 255, parseInt(hex.substr(5, 2), 16) / 255].map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      );
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
  
    const lum1 = luminance(color1);
    const lum2 = luminance(color2);
  
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  }
  
  // Function to display contrast results
  function displayContrast(color1, color2) {
    const ratio = getContrastRatio(color1, color2).toFixed(2);
    contrastDisplay.innerHTML = `
      <div class="contrast-box" style="background-color: ${color1}; color: ${color2}">
        ${ratio}
      </div>
      <div class="contrast-box" style="background-color: ${color2}; color: ${color1}">
        ${ratio}
      </div>
    `;
  }
  
  // Event listener for manual contrast check
  checkContrastBtn.addEventListener("click", () => {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
  
    if (/^#[0-9A-F]{6}$/i.test(color1) && /^#[0-9A-F]{6}$/i.test(color2)) {
      displayContrast(color1, color2);
    } else {
      alert("Please enter valid HEX codes (e.g., #ffffff).");
    }
  });
  
  // Event listener for random pair generation
  randomPairBtn.addEventListener("click", () => {
    const color1 = getRandomHex();
    const color2 = getRandomHex();
  
    color1Input.value = color1;
    color2Input.value = color2;
    displayContrast(color1, color2);
  });