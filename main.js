// === Engine Core ===
const sprites = {};
const collections = {};
const scripts = {};
let ctx;

window.onload = () => {
  const canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
};

// === Sprite Class ===
class Sprite {
  constructor(name, imageSrc) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.costumes = {};
    this.currentCostume = null;
    this.collision = false;
    this.transparency = 1;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  addCostume(name, imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    this.costumes[name] = img;
    if (!this.currentCostume) this.currentCostume = name;
  }

  switchCostume(name) {
    if (this.costumes[name]) this.currentCostume = name;
  }

  draw() {
    ctx.globalAlpha = this.transparency;
    const img = this.costumes[this.currentCostume] || this.image;
    ctx.drawImage(img, this.x, this.y);
  }
}

// === Evaluate Expression ===
function evaluate(expr) {
  try {
    return Function('"use strict"; return (' + expr + ')')();
  } catch (err) {
    console.warn("Invalid expression:", expr);
    return null;
  }
}

// === Command Interpreter ===
function interpret(code) {
  const lines = code.split("\n");
  lines.forEach(line => {
    const clean = line.trim();
    if (clean.startsWith("Create a sprite")) {
      const [_, name, , img] = clean.match(/"([^"]+)"|'([^']+)'/g);
      sprites[name] = new Sprite(name, img.replace(/"/g, ""));
    }
    if (clean.startsWith("Set ")) {
      const match = clean.match(/Set (\w+)'s (\w+) to (.+)/);
      if (match) {
        const [_, spr, prop, val] = match;
        const target = sprites[spr];
        if (target) target[prop] = isNaN(val) ? val : parseFloat(val);
      }
    }
    if (clean.startsWith("Add costume")) {
      const match = clean.match(/"([^"]+)"|(\w+)/g);
      const costumeName = match[0].replace(/"/g, "");
      const imgSrc = match[1].replace(/"/g, "");
      const target = sprites[match[2]];
      if (target) target.addCostume(costumeName, imgSrc);
    }
    if (clean.startsWith("Switch costume")) {
      const match = clean.match(/Switch costume of (\w+) to "([^"]+)"/);
      if (match) {
        const [_, spr, costumeName] = match;
        const target = sprites[spr];
        if (target) target.switchCostume(costumeName);
      }
    }
    if (clean.startsWith("Move")) {
      const match = clean.match(/Move (\w+) by x:(-?\d+)/);
      if (match) {
        const [_, spr, dx] = match;
        const target = sprites[spr];
        if (target) target.x += parseInt(dx);
      }
    }
  });

  drawAll();
}

// === Render Function ===
function drawAll() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  Object.values(sprites).forEach(sprite => sprite.draw());
}

// === Event Listeners ===
document.getElementById("runBtn").onclick = () => {
  const code = document.getElementById("codeInput").value;
  interpret(code);
};

document.getElementById("resetBtn").onclick = () => {
  Object.keys(sprites).forEach(k => delete sprites[k]);
  drawAll();
};
