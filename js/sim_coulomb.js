/**
 * Simulação 2: Lei de Coulomb
 * Interação vetorial de forças eletrostáticas em tempo real
 */

const simCoulomb = (p) => {
  let q1 = {
    x: 0,
    y: 0,
    r: 28,
    charge: 3, // μC
    isDragging: false
  };

  let q2 = {
    x: 0,
    y: 0,
    r: 28,
    charge: 3, // μC
    isDragging: false
  };

  let distanceMeters = 1.0;
  let forceNewtons = 0;
  const k = 8.99e9; // N m^2 / C^2

  p.setup = () => {
    const container = document.getElementById("canvas-sim2");
    const width = Math.min(container.clientWidth || 600, 700);
    const height = 420;
    const canvas = p.createCanvas(width, height);
    canvas.parent("canvas-sim2");

    initPositions();
    initControls();
    calculatePhysics();
  };

  function initPositions() {
    const centerY = p.height * 0.52;
    const centerX = p.width * 0.5;
    const pixelDistance = (distanceMeters / 3.0) * (p.width * 0.65);

    q1.x = centerX - pixelDistance / 2;
    q1.y = centerY;
    q2.x = centerX + pixelDistance / 2;
    q2.y = centerY;
  }

  function initControls() {
    const q1Slider = document.getElementById("q1-slider");
    const q2Slider = document.getElementById("q2-slider");
    const distSlider = document.getElementById("dist-slider");

    if (q1Slider) {
      q1Slider.addEventListener("input", (e) => {
        q1.charge = parseFloat(e.target.value);
        document.getElementById("q1-value").textContent = `${q1.charge >= 0 ? "+" : ""}${q1.charge} μC`;
        calculatePhysics();
      });
    }

    if (q2Slider) {
      q2Slider.addEventListener("input", (e) => {
        q2.charge = parseFloat(e.target.value);
        document.getElementById("q2-value").textContent = `${q2.charge >= 0 ? "+" : ""}${q2.charge} μC`;
        calculatePhysics();
      });
    }

    if (distSlider) {
      distSlider.addEventListener("input", (e) => {
        distanceMeters = parseFloat(e.target.value);
        document.getElementById("dist-value").textContent = `${distanceMeters.toFixed(1).replace(".", ",")} m`;
        initPositions();
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const q1_C = q1.charge * 1e-6;
    const q2_C = q2.charge * 1e-6;
    const d = Math.max(distanceMeters, 0.05);

    // F = k * |q1 * q2| / d^2
    forceNewtons = (k * Math.abs(q1_C * q2_C)) / (d * d);

    const forceElem = document.getElementById("force-value");
    if (forceElem) {
      let formattedF = forceNewtons < 0.001 && forceNewtons > 0
        ? forceNewtons.toExponential(2)
        : forceNewtons.toFixed(3).replace(".", ",");
      forceElem.textContent = `${formattedF} N`;
    }

    const formulaElem = document.getElementById("force-formula");
    if (formulaElem) {
      const isRepulsive = (q1.charge * q2.charge) > 0;
      const natureText = q1.charge === 0 || q2.charge === 0
        ? "Carga nula (sem força)"
        : (isRepulsive ? "⚡ Repulsão (cargas de mesmo sinal)" : "🧲 Atração (cargas de sinais opostos)");

      formulaElem.innerHTML = `
        <span style="color: ${isRepulsive ? '#ff70a6' : 'var(--electric-blue)'}">${natureText}</span>
      `;
    }
  }

  p.draw = () => {
    p.background(10, 10, 24);

    // Subtle background grid
    p.stroke(255, 255, 255, 10);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += 40) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 40) p.line(0, y, p.width, y);

    // Draw ruler / distance axis
    drawRuler();

    // Draw electric field vectors / Force arrows
    drawForceVectors();

    // Draw Charges
    drawCharge(q1, "Q₁");
    drawCharge(q2, "Q₂");

    // Dynamic distance dimension line
    drawDimensionLine();
  };

  function drawRuler() {
    const axisY = p.height * 0.78;
    p.stroke(60, 60, 90);
    p.strokeWeight(2);
    p.line(40, axisY, p.width - 40, axisY);

    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.fill(120, 120, 160);

    const step = (p.width - 80) / 6;
    for (let i = 0; i <= 6; i++) {
      let rx = 40 + i * step;
      p.stroke(80, 80, 120);
      p.line(rx, axisY - 6, rx, axisY + 6);
      p.noStroke();
      p.text(`${(i * 0.5).toFixed(1).replace(".", ",")} m`, rx, axisY + 10);
    }
  }

  function drawDimensionLine() {
    const dimY = p.height * 0.28;
    p.stroke(0, 212, 255, 120);
    p.strokeWeight(1.5);

    // Extension lines from charges
    p.drawingContext.setLineDash([4, 4]);
    p.line(q1.x, q1.y - q1.r - 5, q1.x, dimY);
    p.line(q2.x, q2.y - q2.r - 5, q2.x, dimY);
    p.drawingContext.setLineDash([]);

    // Horizontal dimension line with arrows
    p.line(q1.x, dimY, q2.x, dimY);
    drawArrowHead(q1.x + 8, dimY, -1);
    drawArrowHead(q2.x - 8, dimY, 1);

    // Distance label badge
    const midX = (q1.x + q2.x) / 2;
    p.noStroke();
    p.fill(16, 16, 36);
    p.rectMode(p.CENTER);
    p.rect(midX, dimY, 90, 22, 6);
    p.stroke(0, 212, 255, 100);
    p.noFill();
    p.rect(midX, dimY, 90, 22, 6);

    p.noStroke();
    p.fill(0, 212, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`d = ${distanceMeters.toFixed(1).replace(".", ",")} m`, midX, dimY);
  }

  function drawArrowHead(x, y, dir) {
    p.push();
    p.translate(x, y);
    p.fill(0, 212, 255);
    p.noStroke();
    p.triangle(0, -4, 0, 4, dir * 7, 0);
    p.pop();
  }

  function drawForceVectors() {
    if (q1.charge === 0 || q2.charge === 0 || forceNewtons === 0) return;

    const isRepulsive = (q1.charge * q2.charge) > 0;
    // Scale vector arrow length logarithmically for clear visualization
    const arrowLen = Math.min(Math.max(Math.log10(forceNewtons * 1000 + 1) * 35, 20), 120);

    const dir1 = isRepulsive ? -1 : 1; // force on q1 (points left if repelling, right if attracting)
    const dir2 = isRepulsive ? 1 : -1; // force on q2 (points right if repelling, left if attracting)

    const color = isRepulsive ? [255, 107, 166] : [0, 212, 255];

    // Force arrow on Q1
    drawVectorArrow(q1.x, q1.y, q1.x + dir1 * arrowLen, q1.y, color, `F⃗₂₁`);

    // Force arrow on Q2 (equal and opposite — 3ª Lei de Newton)
    drawVectorArrow(q2.x, q2.y, q2.x + dir2 * arrowLen, q2.y, color, `F⃗₁₂`);
  }

  function drawVectorArrow(x1, y1, x2, y2, color, label) {
    p.push();
    p.stroke(color[0], color[1], color[2]);
    p.strokeWeight(3.5);
    p.line(x1, y1, x2, y2);

    // Arrow tip
    const angle = Math.atan2(y2 - y1, x2 - x1);
    p.push();
    p.translate(x2, y2);
    p.rotate(angle);
    p.fill(color[0], color[1], color[2]);
    p.noStroke();
    p.triangle(0, 0, -12, -6, -12, 6);
    p.pop();

    // Label
    p.noStroke();
    p.fill(color[0], color[1], color[2]);
    p.textSize(12);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(label, (x1 + x2) / 2, y1 - 12);
    p.pop();
  }

  function drawCharge(chargeObj, name) {
    p.push();

    const isPos = chargeObj.charge > 0;
    const isNeutral = chargeObj.charge === 0;

    // Outer Glow
    if (!isNeutral) {
      const glowColor = isPos ? [255, 80, 80] : [0, 150, 255];
      p.noStroke();
      p.fill(glowColor[0], glowColor[1], glowColor[2], 30);
      p.ellipse(chargeObj.x, chargeObj.y, chargeObj.r * 2.8);
      p.fill(glowColor[0], glowColor[1], glowColor[2], 60);
      p.ellipse(chargeObj.x, chargeObj.y, chargeObj.r * 2.3);
    }

    // Sphere Body
    p.noStroke();
    let grad = p.drawingContext.createRadialGradient(
      chargeObj.x - chargeObj.r * 0.35, chargeObj.y - chargeObj.r * 0.35, 3,
      chargeObj.x, chargeObj.y, chargeObj.r
    );

    if (isNeutral) {
      grad.addColorStop(0, '#a0a0b8');
      grad.addColorStop(1, '#505068');
    } else if (isPos) {
      grad.addColorStop(0, '#ff9a9a');
      grad.addColorStop(0.7, '#e62e2e');
      grad.addColorStop(1, '#8b0000');
    } else {
      grad.addColorStop(0, '#88ccff');
      grad.addColorStop(0.7, '#1e70ff');
      grad.addColorStop(1, '#0033aa');
    }

    p.drawingContext.fillStyle = grad;
    p.ellipse(chargeObj.x, chargeObj.y, chargeObj.r * 2);

    // Charge symbol (+ / - / 0)
    p.fill(255);
    p.textSize(18);
    p.textAlign(p.CENTER, p.CENTER);
    const sign = isNeutral ? "0" : (isPos ? "+" : "−");
    p.text(sign, chargeObj.x, chargeObj.y);

    // Name badge below
    p.textSize(12);
    p.fill(200, 200, 230);
    p.text(`${name} (${chargeObj.charge >= 0 ? "+" : ""}${chargeObj.charge} μC)`, chargeObj.x, chargeObj.y + chargeObj.r + 18);

    p.pop();
  }

  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, q1.x, q1.y) < q1.r * 1.3) q1.isDragging = true;
    if (p.dist(p.mouseX, p.mouseY, q2.x, q2.y) < q2.r * 1.3) q2.isDragging = true;
  };

  p.mouseDragged = () => {
    if (q1.isDragging) {
      q1.x = p.constrain(p.mouseX, 60, q2.x - 60);
      updateDistanceOnDrag();
    } else if (q2.isDragging) {
      q2.x = p.constrain(p.mouseX, q1.x + 60, p.width - 60);
      updateDistanceOnDrag();
    }
  };

  function updateDistanceOnDrag() {
    const pixelDist = Math.abs(q2.x - q1.x);
    const maxPixelDist = p.width * 0.65;
    distanceMeters = Math.max(0.2, (pixelDist / maxPixelDist) * 3.0);
    distanceMeters = Math.min(distanceMeters, 3.0);

    const distSlider = document.getElementById("dist-slider");
    const distElem = document.getElementById("dist-value");
    if (distSlider) distSlider.value = distanceMeters.toFixed(1);
    if (distElem) distElem.textContent = `${distanceMeters.toFixed(1).replace(".", ",")} m`;

    calculatePhysics();
  }

  p.mouseReleased = () => {
    q1.isDragging = false;
    q2.isDragging = false;
  };

  p.windowResized = () => {
    const container = document.getElementById("canvas-sim2");
    if (container) {
      const width = Math.min(container.clientWidth || 600, 700);
      p.resizeCanvas(width, 420);
      initPositions();
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-sim2")) {
    new p5(simCoulomb);
  }
});
