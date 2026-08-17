/**
 * Simulação 3: Linhas de Campo Elétrico e Vetores de Campo Eletrostático
 * Cálculo numérico vetorial de superposição em tempo real com p5.js
 */

const simCampo = (p) => {
  let charges = [];
  let currentSelectedType = "positive"; // 'positive' or 'negative'
  let currentMagnitude = 3;
  let draggedCharge = null;
  const k = 1.0; // Scaled for visualization

  p.setup = () => {
    const container = document.getElementById("canvas-sim3");
    const width = Math.min(container.clientWidth || 600, 700);
    const height = 420;
    const canvas = p.createCanvas(width, height);
    canvas.parent("canvas-sim3");

    // Prevent default context menu on right click to allow deleting charges
    canvas.elt.oncontextmenu = (e) => e.preventDefault();

    initDefaultCharges();
    initControls();
  };

  function initDefaultCharges() {
    // Dipole configuration as default
    charges = [
      { x: p.width * 0.35, y: p.height * 0.5, q: 3, r: 18 },
      { x: p.width * 0.65, y: p.height * 0.5, q: -3, r: 18 }
    ];
  }

  function initControls() {
    const posBtn = document.getElementById("addPositive");
    const negBtn = document.getElementById("addNegative");
    const magSlider = document.getElementById("charge-magnitude-slider");
    const magElem = document.getElementById("charge-magnitude");
    const clearBtn = document.getElementById("clearCharges");

    if (posBtn && negBtn) {
      posBtn.addEventListener("click", () => {
        currentSelectedType = "positive";
        posBtn.classList.add("active");
        negBtn.classList.remove("active");
      });
      negBtn.addEventListener("click", () => {
        currentSelectedType = "negative";
        negBtn.classList.add("active");
        posBtn.classList.remove("active");
      });
    }

    if (magSlider) {
      magSlider.addEventListener("input", (e) => {
        currentMagnitude = parseInt(e.target.value, 10);
        if (magElem) magElem.textContent = `${currentMagnitude} μC`;
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        charges = [];
      });
    }
  }

  // Calculate electric field vector E at any point (x, y)
  function getElectricField(px, py) {
    let Ex = 0;
    let Ey = 0;

    for (let c of charges) {
      let dx = px - c.x;
      let dy = py - c.y;
      let r2 = dx * dx + dy * dy;
      let r = Math.sqrt(r2);

      if (r < 8) continue; // Singularity avoidance near charge core

      let E_mag = (k * c.q) / r2;
      Ex += E_mag * (dx / r);
      Ey += E_mag * (dy / r);
    }

    return { Ex, Ey, mag: Math.sqrt(Ex * Ex + Ey * Ey) };
  }

  p.draw = () => {
    p.background(8, 8, 20);

    // 1. Draw Field Vector Grid (subtle arrows across the canvas)
    drawVectorGrid();

    // 2. Draw Electric Field Streamlines (Linhas de Força)
    drawFieldLines();

    // 3. Draw All Charges
    drawCharges();

    // 4. Instructions overlay if canvas is empty
    if (charges.length === 0) {
      p.fill(160, 160, 200, 180 + p.sin(p.frameCount * 0.08) * 60);
      p.noStroke();
      p.textSize(13);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Clique no canvas para adicionar cargas elétricas!", p.width / 2, p.height / 2);
    }
  };

  function drawVectorGrid() {
    const spacing = 32;
    p.strokeWeight(1);

    for (let x = spacing / 2; x < p.width; x += spacing) {
      for (let y = spacing / 2; y < p.height; y += spacing) {
        let field = getElectricField(x, y);
        if (field.mag < 0.00001) continue;

        let angle = Math.atan2(field.Ey, field.Ex);
        let len = Math.min(field.mag * 8000, 14);
        len = Math.max(len, 4);

        // Alpha and color based on field strength
        let alpha = p.map(Math.min(field.mag * 10000, 1), 0, 1, 30, 140);
        p.stroke(0, 212, 255, alpha);

        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.line(-len / 2, 0, len / 2, 0);
        // Small arrow tip
        p.line(len / 2, 0, len / 2 - 3, -2);
        p.line(len / 2, 0, len / 2 - 3, 2);
        p.pop();
      }
    }
  }

  function drawFieldLines() {
    p.noFill();

    charges.forEach(charge => {
      // Trace lines starting from positive charges (or negative charges if only negative exist)
      if (charge.q > 0) {
        const numLines = Math.abs(charge.q) * 8;
        for (let i = 0; i < numLines; i++) {
          let angle = (p.TWO_PI / numLines) * i;
          let startX = charge.x + Math.cos(angle) * (charge.r + 2);
          let startY = charge.y + Math.sin(angle) * (charge.r + 2);
          traceLine(startX, startY, 1);
        }
      }
    });

    // If there are only negative charges, trace backwards from boundary or around negative charges
    const hasPositive = charges.some(c => c.q > 0);
    if (!hasPositive && charges.length > 0) {
      charges.forEach(charge => {
        const numLines = Math.abs(charge.q) * 8;
        for (let i = 0; i < numLines; i++) {
          let angle = (p.TWO_PI / numLines) * i;
          let startX = charge.x + Math.cos(angle) * (charge.r + 2);
          let startY = charge.y + Math.sin(angle) * (charge.r + 2);
          traceLine(startX, startY, -1);
        }
      });
    }
  }

  function traceLine(startX, startY, direction) {
    let curX = startX;
    let curY = startY;
    const stepSize = 4;
    const maxSteps = 150;

    p.beginShape();
    p.stroke(124, 58, 237, 120);
    p.strokeWeight(1.5);

    for (let step = 0; step < maxSteps; step++) {
      p.vertex(curX, curY);

      let field = getElectricField(curX, curY);
      if (field.mag < 0.00001) break;

      curX += direction * (field.Ex / field.mag) * stepSize;
      curY += direction * (field.Ey / field.mag) * stepSize;

      // Draw small direction arrow halfway along line
      if (step === 30 || step === 70) {
        drawStreamlineArrow(curX, curY, Math.atan2(direction * field.Ey, direction * field.Ex));
      }

      // Stop if out of canvas bounds
      if (curX < 0 || curX > p.width || curY < 0 || curY > p.height) break;

      // Stop if hit a negative charge (absorption)
      let hitCharge = charges.find(c => p.dist(curX, curY, c.x, c.y) < c.r);
      if (hitCharge) break;
    }
    p.endShape();
  }

  function drawStreamlineArrow(x, y, angle) {
    p.push();
    p.translate(x, y);
    p.rotate(angle);
    p.fill(0, 212, 255, 180);
    p.noStroke();
    p.triangle(0, 0, -6, -3, -6, 3);
    p.pop();
  }

  function drawCharges() {
    charges.forEach(c => {
      p.push();
      const isPos = c.q > 0;

      // Glow
      const glowColor = isPos ? [255, 80, 80] : [0, 150, 255];
      p.noStroke();
      p.fill(glowColor[0], glowColor[1], glowColor[2], 30);
      p.ellipse(c.x, c.y, c.r * 2.8);

      // Body gradient
      let grad = p.drawingContext.createRadialGradient(
        c.x - c.r * 0.35, c.y - c.r * 0.35, 2,
        c.x, c.y, c.r
      );
      if (isPos) {
        grad.addColorStop(0, '#ff9a9a');
        grad.addColorStop(0.7, '#e62e2e');
        grad.addColorStop(1, '#8b0000');
      } else {
        grad.addColorStop(0, '#88ccff');
        grad.addColorStop(0.7, '#1e70ff');
        grad.addColorStop(1, '#0033aa');
      }
      p.drawingContext.fillStyle = grad;
      p.ellipse(c.x, c.y, c.r * 2);

      // Text sign
      p.fill(255);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(isPos ? "+" : "−", c.x, c.y);

      // Value
      p.textSize(10);
      p.fill(220, 220, 240);
      p.text(`${Math.abs(c.q)} μC`, c.x, c.y + c.r + 12);

      p.pop();
    });
  }

  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    // Check if clicked on existing charge
    let clickedChargeIndex = charges.findIndex(c => p.dist(p.mouseX, p.mouseY, c.x, c.y) < c.r * 1.3);

    if (p.mouseButton === p.RIGHT) {
      // Delete charge on right-click
      if (clickedChargeIndex !== -1) {
        charges.splice(clickedChargeIndex, 1);
      }
      return;
    }

    if (clickedChargeIndex !== -1) {
      draggedCharge = charges[clickedChargeIndex];
    } else {
      // Add new charge
      if (charges.length < 8) {
        let sign = currentSelectedType === "positive" ? 1 : -1;
        charges.push({
          x: p.mouseX,
          y: p.mouseY,
          q: sign * currentMagnitude,
          r: 16 + currentMagnitude * 2
        });
      }
    }
  };

  p.mouseDragged = () => {
    if (draggedCharge) {
      draggedCharge.x = p.constrain(p.mouseX, draggedCharge.r, p.width - draggedCharge.r);
      draggedCharge.y = p.constrain(p.mouseY, draggedCharge.r, p.height - draggedCharge.r);
    }
  };

  p.mouseReleased = () => {
    draggedCharge = null;
  };

  p.windowResized = () => {
    const container = document.getElementById("canvas-sim3");
    if (container) {
      const width = Math.min(container.clientWidth || 600, 700);
      p.resizeCanvas(width, 420);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-sim3")) {
    new p5(simCampo);
  }
});
