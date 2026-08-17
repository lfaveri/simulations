/**
 * Simulação 1: Eletrização por Atrito e Indução Eletrostática
 * Usando p5.js em modo instância
 */

const simEletrizacao = (p) => {
  let balloon = {
    x: 0,
    y: 0,
    r: 48,
    isDragging: false,
    charge: 0, // negative electrons acquired
    vx: 0,
    vy: 0
  };

  let hairArea = { x: 80, y: 70, w: 130, h: 180 };
  let paperBits = [];
  let sparks = [];
  let electronsOnBalloon = [];

  p.setup = () => {
    const container = document.getElementById("canvas-sim1");
    const width = Math.min(container.clientWidth || 600, 700);
    const height = 420;
    const canvas = p.createCanvas(width, height);
    canvas.parent("canvas-sim1");

    balloon.x = p.width * 0.55;
    balloon.y = p.height * 0.45;

    // Create small paper bits at the bottom right
    initPapers();

    const resetBtn = document.getElementById("resetSim1");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetSim);
    }
  };

  function initPapers() {
    paperBits = [];
    const startX = p.width * 0.65;
    const endX = p.width * 0.92;
    const tableY = p.height - 35;

    for (let i = 0; i < 28; i++) {
      paperBits.push({
        x: p.random(startX, endX),
        y: p.random(tableY - 12, tableY),
        targetY: tableY,
        w: p.random(7, 13),
        h: p.random(5, 9),
        angle: p.random(p.TWO_PI),
        isStuck: false,
        stuckOffsetX: 0,
        stuckOffsetY: 0,
        vx: 0,
        vy: 0,
        rotationSpeed: p.random(-0.05, 0.05)
      });
    }
  }

  function resetSim() {
    balloon.charge = 0;
    balloon.x = p.width * 0.55;
    balloon.y = p.height * 0.45;
    electronsOnBalloon = [];
    sparks = [];
    initPapers();
    updateUiCounters();
  }

  function updateUiCounters() {
    const bElem = document.getElementById("balloonCharge");
    const hElem = document.getElementById("hairCharge");
    if (bElem) bElem.textContent = `${-balloon.charge} e`;
    if (hElem) hElem.textContent = `+${balloon.charge} e`;
  }

  p.draw = () => {
    p.background(10, 10, 24);

    // Draw background grid lines (subtle)
    p.stroke(255, 255, 255, 10);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += 40) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 40) p.line(0, y, p.width, y);

    // Draw Table
    p.noStroke();
    p.fill(22, 22, 45);
    p.rect(0, p.height - 30, p.width, 30);
    p.stroke(0, 212, 255, 40);
    p.line(0, p.height - 30, p.width, p.height - 30);

    // 1. Draw Hair Zone
    drawHairZone();

    // 2. Draw Paper Bits
    updateAndDrawPapers();

    // 3. Draw Sparks
    drawSparks();

    // 4. Update & Draw Balloon
    updateAndDrawBalloon();

    // Friction detection: Balloon rubbing against hair
    if (balloon.isDragging) {
      if (
        balloon.x - balloon.r < hairArea.x + hairArea.w &&
        balloon.x + balloon.r > hairArea.x &&
        balloon.y - balloon.r < hairArea.y + hairArea.h &&
        balloon.y + balloon.r > hairArea.y
      ) {
        if (p.frameCount % 4 === 0 && balloon.charge < 30) {
          balloon.charge++;
          updateUiCounters();

          // Add electron position inside balloon
          const ang = p.random(p.TWO_PI);
          const rad = p.random(0, balloon.r * 0.75);
          electronsOnBalloon.push({
            rx: p.cos(ang) * rad,
            ry: p.sin(ang) * rad
          });

          // Spark animation
          for (let s = 0; s < 3; s++) {
            sparks.push({
              x: balloon.x + p.random(-20, 20),
              y: balloon.y + p.random(-20, 20),
              vx: p.random(-3, 3),
              vy: p.random(-3, 3),
              life: 1.0,
              color: [0, 212, 255]
            });
          }
        }
      }
    }

    // Interactive hints
    if (balloon.charge === 0) {
      p.fill(160, 160, 200, 180 + p.sin(p.frameCount * 0.08) * 60);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("👆 Arraste o balão até o cabelo para atritar", p.width * 0.55, 40);
    } else if (balloon.charge > 5 && !hasStuckPaper()) {
      p.fill(0, 255, 136, 200 + p.sin(p.frameCount * 0.08) * 55);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("✨ Agora aproxime o balão dos pedaços de papel!", p.width * 0.55, 40);
    }
  };

  function hasStuckPaper() {
    return paperBits.some(p => p.isStuck);
  }

  function drawHairZone() {
    p.push();
    p.noFill();

    // Zone glow
    p.fill(124, 58, 237, 15);
    p.stroke(124, 58, 237, 60);
    p.strokeWeight(1.5);
    p.rect(hairArea.x, hairArea.y, hairArea.w, hairArea.h, 16);

    // Label
    p.noStroke();
    p.fill(180, 150, 255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Cabelo / Lã (Neutro)", hairArea.x + hairArea.w / 2, hairArea.y + 10);

    // Strands of hair
    p.stroke(160, 120, 90);
    p.strokeWeight(2.5);
    for (let i = 0; i < 9; i++) {
      let hx = hairArea.x + 20 + i * 11;
      let wave = p.sin(p.frameCount * 0.04 + i) * 6;
      p.noFill();
      p.bezier(
        hx, hairArea.y + 40,
        hx + wave, hairArea.y + 80,
        hx - wave, hairArea.y + 120,
        hx + (balloon.charge > 0 ? (i - 4) * (balloon.charge * 0.7) : 0), hairArea.y + 160
      );
    }

    // Positive charges remaining in hair when charged
    if (balloon.charge > 0) {
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      for (let i = 0; i < Math.min(balloon.charge, 15); i++) {
        let px = hairArea.x + 25 + (i % 5) * 20;
        let py = hairArea.y + 60 + Math.floor(i / 5) * 35;
        p.fill(255, 80, 80);
        p.ellipse(px, py, 15, 15);
        p.fill(255);
        p.text("+", px, py);
      }
    }
    p.pop();
  }

  function updateAndDrawPapers() {
    p.push();
    paperBits.forEach(paper => {
      if (paper.isStuck) {
        // Moves with balloon
        paper.x = balloon.x + paper.stuckOffsetX;
        paper.y = balloon.y + paper.stuckOffsetY;
      } else {
        // Calculate electrostatic attraction from charged balloon
        if (balloon.charge > 0) {
          let dx = balloon.x - paper.x;
          let dy = balloon.y - paper.y;
          let d = Math.sqrt(dx * dx + dy * dy);

          // If close enough and balloon has enough charge, paper gets attracted
          const attractionThreshold = 80 + balloon.charge * 6;
          if (d < attractionThreshold && d > 10) {
            let force = (balloon.charge * 45) / (d * d * 0.15);
            force = Math.min(force, 12);
            paper.vx += (dx / d) * force * 0.15;
            paper.vy += (dy / d) * force * 0.15;
          }

          // Stick to balloon surface
          if (d < balloon.r + 5) {
            paper.isStuck = true;
            paper.stuckOffsetX = paper.x - balloon.x;
            paper.stuckOffsetY = paper.y - balloon.y;
            paper.vx = 0;
            paper.vy = 0;
          }
        }

        // Gravity and damping
        paper.vy += 0.35;
        paper.vx *= 0.92;
        paper.vy *= 0.92;

        paper.x += paper.vx;
        paper.y += paper.vy;

        // Ground constraint
        if (paper.y > p.height - 35) {
          paper.y = p.height - 35;
          paper.vy = 0;
          paper.vx *= 0.7;
        }
      }

      // Draw paper piece
      p.push();
      p.translate(paper.x, paper.y);
      p.rotate(paper.angle);

      // Polarized coloration if close to charged balloon
      p.noStroke();
      p.fill(240, 240, 255);
      p.rectMode(p.CENTER);
      p.rect(0, 0, paper.w, paper.h, 2);

      // Subtle polarization signs (+ / -) on paper if polarized
      if (balloon.charge > 10 && !paper.isStuck) {
        p.textSize(6);
        p.fill(255, 80, 80);
        p.text("+", -paper.w * 0.25, 0);
        p.fill(80, 140, 255);
        p.text("-", paper.w * 0.25, 0);
      }
      p.pop();
    });
    p.pop();
  }

  function drawSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      let s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.05;

      p.stroke(s.color[0], s.color[1], s.color[2], s.life * 255);
      p.strokeWeight(2);
      p.point(s.x, s.y);

      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function updateAndDrawBalloon() {
    p.push();

    // Balloon glow based on charge
    if (balloon.charge > 0) {
      let glowSize = balloon.r * 2 + balloon.charge * 2.5;
      let alpha = Math.min(balloon.charge * 4, 90);
      p.noStroke();
      p.fill(0, 212, 255, alpha * 0.3);
      p.ellipse(balloon.x, balloon.y, glowSize * 1.3);
      p.fill(0, 212, 255, alpha * 0.6);
      p.ellipse(balloon.x, balloon.y, glowSize);
    }

    // Balloon String
    p.stroke(120, 120, 160, 180);
    p.strokeWeight(1.5);
    p.noFill();
    let stringTipX = balloon.x + p.sin(p.frameCount * 0.05) * 8;
    let stringTipY = balloon.y + balloon.r + 45;
    p.bezier(
      balloon.x, balloon.y + balloon.r,
      balloon.x - 5, balloon.y + balloon.r + 20,
      stringTipX, stringTipY - 10,
      stringTipX, stringTipY
    );

    // Balloon Body
    p.noStroke();
    let grad = p.drawingContext.createRadialGradient(
      balloon.x - balloon.r * 0.3, balloon.y - balloon.r * 0.3, 5,
      balloon.x, balloon.y, balloon.r
    );
    grad.addColorStop(0, '#ff70a6');
    grad.addColorStop(0.7, '#d6226a');
    grad.addColorStop(1, '#8b0e3f');
    p.drawingContext.fillStyle = grad;
    p.ellipse(balloon.x, balloon.y, balloon.r * 2, balloon.r * 2.2);

    // Balloon Knot
    p.fill(160, 20, 70);
    p.triangle(
      balloon.x - 5, balloon.y + balloon.r * 1.1,
      balloon.x + 5, balloon.y + balloon.r * 1.1,
      balloon.x, balloon.y + balloon.r * 1.1 + 6
    );

    // Electrons (-) collected on the balloon
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    electronsOnBalloon.forEach(el => {
      let ex = balloon.x + el.rx;
      let ey = balloon.y + el.ry;
      p.fill(0, 212, 255);
      p.ellipse(ex, ey, 12, 12);
      p.fill(10, 10, 24);
      p.text("−", ex, ey);
    });

    p.pop();
  }

  p.mousePressed = () => {
    let d = p.dist(p.mouseX, p.mouseY, balloon.x, balloon.y);
    if (d < balloon.r * 1.2) {
      balloon.isDragging = true;
    }
  };

  p.mouseDragged = () => {
    if (balloon.isDragging) {
      balloon.x = p.constrain(p.mouseX, balloon.r, p.width - balloon.r);
      balloon.y = p.constrain(p.mouseY, balloon.r, p.height - balloon.r - 20);
    }
  };

  p.mouseReleased = () => {
    balloon.isDragging = false;
  };

  p.windowResized = () => {
    const container = document.getElementById("canvas-sim1");
    if (container) {
      const width = Math.min(container.clientWidth || 600, 700);
      p.resizeCanvas(width, 420);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-sim1")) {
    new p5(simEletrizacao);
  }
});
