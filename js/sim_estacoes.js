/**
 * LABORATÓRIO DE ELETROSTÁTICA — SIMULAÇÕES DAS ESTAÇÕES
 * Conexão direta entre Questões de Vestibular e Aparatos Experimentais
 */

/* ==========================================================================
   ESTAÇÃO 1: LEI DE COULOMB & RAZÃO DO QUADRADO (FUVEST)
   ========================================================================== */
const station1Coulomb = (p) => {
  let q1 = { x: 0, y: 0, r: 24, charge: 2.0, isDragging: false };
  let q2 = { x: 0, y: 0, r: 24, charge: -2.0, isDragging: false };
  let distanceMeters = 3.0;
  const initialBaseForce = 0.004; // Força para d = 3.0m, q=2uC
  let currentForce = 0.004;
  let animatingToD3 = false;
  let animProgress = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-coulomb");
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-coulomb");

    updatePositionsFromDistance();
    initS1Controls();
  };

  function updatePositionsFromDistance() {
    const centerY = p.height * 0.52;
    const centerX = p.width * 0.5;
    const pixelDist = (distanceMeters / 3.0) * (p.width * 0.58);

    q1.x = centerX - pixelDist / 2;
    q1.y = centerY;
    q2.x = centerX + pixelDist / 2;
    q2.y = centerY;

    calculateS1Physics();
  }

  function initS1Controls() {
    const dSlider = document.getElementById("s1-d-slider");
    const q1Slider = document.getElementById("s1-q1-slider");
    const q2Slider = document.getElementById("s1-q2-slider");
    const btnDemo = document.getElementById("btn-demo-fuvest");

    if (dSlider) {
      dSlider.addEventListener("input", (e) => {
        distanceMeters = parseFloat(e.target.value);
        document.getElementById("s1-d-val").textContent = `${distanceMeters.toFixed(2).replace(".", ",")} m`;
        updatePositionsFromDistance();
      });
    }

    if (q1Slider) {
      q1Slider.addEventListener("input", (e) => {
        q1.charge = parseFloat(e.target.value);
        document.getElementById("s1-q1-val").textContent = `${q1.charge >= 0 ? "+" : ""}${q1.charge.toFixed(1).replace(".", ",")} μC`;
        calculateS1Physics();
      });
    }

    if (q2Slider) {
      q2Slider.addEventListener("input", (e) => {
        q2.charge = parseFloat(e.target.value);
        document.getElementById("s1-q2-val").textContent = `${q2.charge >= 0 ? "+" : ""}${q2.charge.toFixed(1).replace(".", ",")} μC`;
        calculateS1Physics();
      });
    }

    if (btnDemo) {
      btnDemo.addEventListener("click", () => {
        animatingToD3 = true;
        animProgress = 0;
      });
    }
  }

  function calculateS1Physics() {
    const k = 8.99e9;
    const q1_C = q1.charge * 1e-6;
    const q2_C = q2.charge * 1e-6;
    const d = Math.max(distanceMeters, 0.1);

    currentForce = (k * Math.abs(q1_C * q2_C)) / (d * d);

    // Razão em relação ao estado base (d = 3.0 m)
    const baseD = 3.0;
    const baseForceForCurrentCharges = (k * Math.abs(q1_C * q2_C)) / (baseD * baseD);
    const ratio = baseForceForCurrentCharges > 0 ? (currentForce / baseForceForCurrentCharges) : 0;

    const ratioElem = document.getElementById("s1-ratio-num");
    const forceElem = document.getElementById("s1-force-num");
    const typeElem = document.getElementById("s1-type-text");

    if (ratioElem) ratioElem.textContent = `${ratio.toFixed(2).replace(".", ",")} × F₀`;
    if (forceElem) forceElem.textContent = `${currentForce.toFixed(3).replace(".", ",")} N`;
    if (typeElem) {
      if (q1.charge === 0 || q2.charge === 0) {
        typeElem.textContent = "Sem interação";
        typeElem.style.color = "var(--ink-muted)";
      } else if (q1.charge * q2.charge > 0) {
        typeElem.textContent = "Repulsão Mútua";
        typeElem.style.color = "#c8435d";
      } else {
        typeElem.textContent = "Atração Mútua";
        typeElem.style.color = "#3b6cb5";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // Smooth animation for FUVEST demonstration
    if (animatingToD3) {
      animProgress += 0.03;
      distanceMeters = p.lerp(distanceMeters, 1.0, 0.08);
      const dSlider = document.getElementById("s1-d-slider");
      const dVal = document.getElementById("s1-d-val");
      if (dSlider) dSlider.value = distanceMeters.toFixed(2);
      if (dVal) dVal.textContent = `${distanceMeters.toFixed(2).replace(".", ",")} m`;
      updatePositionsFromDistance();

      if (Math.abs(distanceMeters - 1.0) < 0.02) {
        distanceMeters = 1.0;
        animatingToD3 = false;
        updatePositionsFromDistance();
      }
    }

    // Laboratory Millimeter Grid (Subtle)
    drawLabGrid();

    // Scale Track / Ruler
    drawBenchRuler();

    // Dimension line for d
    drawDistanceDimension();

    // Force Vectors
    drawCoulombVectors();

    // Spherical Charges
    drawSphereCharge(q1, "Q₁");
    drawSphereCharge(q2, "Q₂");
  };

  function drawLabGrid() {
    p.stroke(255, 255, 255, 8);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += 30) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 30) p.line(0, y, p.width, y);
  }

  function drawBenchRuler() {
    const ry = p.height * 0.78;
    p.stroke(80, 70, 95);
    p.strokeWeight(2);
    p.line(40, ry, p.width - 40, ry);

    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.fill(150, 140, 170);

    const steps = 6;
    const stepPx = (p.width - 80) / steps;
    for (let i = 0; i <= steps; i++) {
      let x = 40 + i * stepPx;
      p.stroke(110, 100, 130);
      p.line(x, ry - 5, x, ry + 5);
      p.noStroke();
      p.text(`${(i * 0.5).toFixed(1).replace(".", ",")} m`, x, ry + 8);
    }
  }

  function drawDistanceDimension() {
    const dimY = p.height * 0.28;
    p.stroke(201, 174, 222, 160);
    p.strokeWeight(1.2);

    p.drawingContext.setLineDash([4, 4]);
    p.line(q1.x, q1.y - q1.r - 4, q1.x, dimY);
    p.line(q2.x, q2.y - q2.r - 4, q2.x, dimY);
    p.drawingContext.setLineDash([]);

    p.line(q1.x, dimY, q2.x, dimY);

    // Midpoint label
    const midX = (q1.x + q2.x) / 2;
    p.noStroke();
    p.fill(28, 24, 40);
    p.rectMode(p.CENTER);
    p.rect(midX, dimY, 95, 20, 4);
    p.stroke(201, 174, 222, 120);
    p.noFill();
    p.rect(midX, dimY, 95, 20, 4);

    p.noStroke();
    p.fill(225, 210, 240);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`d = ${distanceMeters.toFixed(2).replace(".", ",")} m`, midX, dimY);
  }

  function drawCoulombVectors() {
    if (q1.charge === 0 || q2.charge === 0 || currentForce === 0) return;

    const isRepulsive = (q1.charge * q2.charge) > 0;
    const baseLen = 22;
    // Multiplier scales visibly from 1x to 9x
    const ratio = Math.max(0.2, (3.0 / distanceMeters) ** 2);
    const arrowLen = Math.min(baseLen * Math.sqrt(ratio) * 1.5, 110);

    const dir1 = isRepulsive ? -1 : 1;
    const dir2 = isRepulsive ? 1 : -1;
    const col = isRepulsive ? [200, 67, 93] : [59, 108, 181];

    drawVector(q1.x, q1.y, q1.x + dir1 * arrowLen, q1.y, col, "F⃗₂₁");
    drawVector(q2.x, q2.y, q2.x + dir2 * arrowLen, q2.y, col, "F⃗₁₂");
  }

  function drawVector(x1, y1, x2, y2, col, label) {
    p.push();
    p.stroke(col[0], col[1], col[2]);
    p.strokeWeight(3);
    p.line(x1, y1, x2, y2);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    p.translate(x2, y2);
    p.rotate(angle);
    p.fill(col[0], col[1], col[2]);
    p.noStroke();
    p.triangle(0, 0, -10, -5, -10, 5);
    p.pop();

    p.noStroke();
    p.fill(col[0], col[1], col[2]);
    p.textSize(11);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(label, (x1 + x2) / 2, y1 - 10);
  }

  function drawSphereCharge(c, label) {
    p.push();
    const isPos = c.charge > 0;
    const isNeutral = c.charge === 0;

    // Glow
    if (!isNeutral) {
      p.noStroke();
      p.fill(isPos ? 200 : 59, isPos ? 67 : 108, isPos ? 93 : 181, 40);
      p.ellipse(c.x, c.y, c.r * 2.5);
    }

    // Sphere
    p.noStroke();
    let grad = p.drawingContext.createRadialGradient(
      c.x - c.r * 0.3, c.y - c.r * 0.3, 2,
      c.x, c.y, c.r
    );
    if (isNeutral) {
      grad.addColorStop(0, '#9e97a8');
      grad.addColorStop(1, '#534d5c');
    } else if (isPos) {
      grad.addColorStop(0, '#f28a9b');
      grad.addColorStop(0.7, '#c8435d');
      grad.addColorStop(1, '#7a192d');
    } else {
      grad.addColorStop(0, '#8eb4f0');
      grad.addColorStop(0.7, '#3b6cb5');
      grad.addColorStop(1, '#1b3e75');
    }
    p.drawingContext.fillStyle = grad;
    p.ellipse(c.x, c.y, c.r * 2);

    // Sign
    p.fill(255);
    p.textSize(15);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(isNeutral ? "0" : (isPos ? "+" : "−"), c.x, c.y);

    // Label
    p.textSize(11);
    p.fill(200, 190, 215);
    p.text(`${label}`, c.x, c.y + c.r + 14);

    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-coulomb");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      updatePositionsFromDistance();
    }
  };
};

/* ==========================================================================
   ESTAÇÃO 2: ATRITO & INDUÇÃO NO PAPEL (ENEM)
   ========================================================================== */
const station2Eletrizacao = (p) => {
  let rod = { x: 180, y: 170, w: 120, h: 22, charge: 0, isDragging: false };
  let wool = { x: 60, y: 120, w: 80, h: 100 };
  let papers = [];
  let sparks = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletrizacao");
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletrizacao");

    initPapers();
    initS2Controls();
  };

  function initPapers() {
    papers = [];
    const startX = p.width * 0.62;
    const endX = p.width * 0.90;
    const groundY = p.height - 40;

    for (let i = 0; i < 22; i++) {
      papers.push({
        x: p.random(startX, endX),
        y: p.random(groundY - 10, groundY),
        targetY: groundY,
        w: p.random(10, 16),
        h: p.random(6, 9),
        angle: p.random(-0.2, 0.2),
        isAttracted: false,
        isStuck: false,
        stuckX: 0,
        stuckY: 0,
        vx: 0,
        vy: 0
      });
    }
  }

  function initS2Controls() {
    const btnRub = document.getElementById("btn-rub-balloon");
    const btnAttract = document.getElementById("btn-attract-paper");

    if (btnRub) {
      btnRub.addEventListener("click", () => {
        // Transfer electrons smoothly
        rod.charge = 20;
        updateS2Readouts();
        for (let i = 0; i < 12; i++) {
          sparks.push({
            x: wool.x + wool.w / 2 + p.random(-20, 20),
            y: wool.y + wool.h / 2 + p.random(-20, 20),
            vx: p.random(1, 4),
            vy: p.random(-2, 2),
            life: 1.0
          });
        }
      });
    }

    if (btnAttract) {
      btnAttract.addEventListener("click", () => {
        if (rod.charge === 0) rod.charge = 20;
        rod.x = p.width * 0.76;
        rod.y = p.height - 110;
        updateS2Readouts();
      });
    }
  }

  function updateS2Readouts() {
    const bElem = document.getElementById("s2-charge-balloon");
    const wElem = document.getElementById("s2-charge-wool");
    const pElem = document.getElementById("s2-paper-status");

    if (bElem) bElem.textContent = `${-rod.charge} e (Negativo)`;
    if (wElem) wElem.textContent = `+${rod.charge} e (Positivo)`;
    if (pElem) {
      if (rod.charge > 5 && rod.x > p.width * 0.5) {
        pElem.textContent = "Dipolos Polarizados (Atraídos!)";
        pElem.style.color = "#2e8b57";
      } else {
        pElem.textContent = "Neutros";
        pElem.style.color = "var(--ink)";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // Bench Surface
    p.noStroke();
    p.fill(28, 24, 40);
    p.rect(0, p.height - 35, p.width, 35);
    p.stroke(80, 70, 95);
    p.line(0, p.height - 35, p.width, p.height - 35);

    // 1. Wool Cloth Zone
    drawWoolZone();

    // 2. Paper Scraps (Showing microscopic polarization dipoles)
    updateAndDrawPapers();

    // 3. Sparks during friction
    drawSparks();

    // 4. Rod / Balloon Body
    drawRod();
  };

  function drawWoolZone() {
    p.push();
    p.fill(50, 42, 65);
    p.stroke(140, 103, 168, 100);
    p.strokeWeight(1.5);
    p.rect(wool.x, wool.y, wool.w, wool.h, 6);

    p.noStroke();
    p.fill(190, 170, 210);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Tecido de Lã", wool.x + wool.w / 2, wool.y + 8);

    // Strands
    p.stroke(120, 100, 140);
    for (let y = wool.y + 30; y < wool.y + wool.h - 10; y += 12) {
      p.line(wool.x + 10, y, wool.x + wool.w - 10, y);
    }

    if (rod.charge > 0) {
      p.fill(200, 67, 93);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      for (let i = 0; i < Math.min(rod.charge, 8); i++) {
        let px = wool.x + 20 + (i % 3) * 20;
        let py = wool.y + 40 + Math.floor(i / 3) * 20;
        p.text("+", px, py);
      }
    }
    p.pop();
  }

  function drawRod() {
    p.push();
    p.translate(rod.x, rod.y);

    // Glow if charged
    if (rod.charge > 0) {
      p.noStroke();
      p.fill(59, 108, 181, 40);
      p.rect(-rod.w / 2 - 8, -rod.h / 2 - 6, rod.w + 16, rod.h + 12, 10);
    }

    // Body
    p.fill(210, 190, 160);
    p.stroke(160, 140, 110);
    p.strokeWeight(1.5);
    p.rect(-rod.w / 2, -rod.h / 2, rod.w, rod.h, 6);

    p.noStroke();
    p.fill(60, 50, 40);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Bastão Plástico", 0, 0);

    // Electrons (-)
    if (rod.charge > 0) {
      p.fill(59, 108, 181);
      p.textSize(11);
      for (let i = 0; i < Math.min(rod.charge, 7); i++) {
        let ex = -rod.w / 2 + 14 + i * 14;
        p.text("−", ex, rod.h / 2 + 8);
      }
    }
    p.pop();
  }

  function updateAndDrawPapers() {
    papers.forEach(paper => {
      if (paper.isStuck) {
        paper.x = rod.x + paper.stuckX;
        paper.y = rod.y + paper.stuckY;
      } else {
        if (rod.charge > 0) {
          let d = p.dist(rod.x, rod.y, paper.x, paper.y);
          if (d < 110) {
            paper.isAttracted = true;
            let force = (rod.charge * 18) / (d * 0.8);
            paper.vy -= force * 0.08;
            paper.vx += (rod.x - paper.x) * 0.03;
          }

          if (d < 30) {
            paper.isStuck = true;
            paper.stuckX = paper.x - rod.x;
            paper.stuckY = paper.y - rod.y;
          }
        }

        paper.vy += 0.35;
        paper.vx *= 0.9;
        paper.vy *= 0.9;
        paper.x += paper.vx;
        paper.y += paper.vy;

        if (paper.y > p.height - 40) {
          paper.y = p.height - 40;
          paper.vy = 0;
        }
      }

      // Draw Paper with Polarized Dipoles (+ on top, - on bottom)
      p.push();
      p.translate(paper.x, paper.y);
      p.rotate(paper.angle);

      p.fill(245, 242, 235);
      p.stroke(180, 175, 165);
      p.strokeWeight(1);
      p.rectMode(p.CENTER);
      p.rect(0, 0, paper.w, paper.h, 2);

      // Dipoles visual
      if (rod.charge > 0 && (paper.isAttracted || paper.isStuck)) {
        p.noStroke();
        p.textSize(7);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(200, 67, 93); // Top is attracted (+)
        p.text("+", 0, -paper.h * 0.25);
        p.fill(59, 108, 181); // Bottom is repelled (-)
        p.text("−", 0, paper.h * 0.25);
      }
      p.pop();
    });
  }

  function drawSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      let s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.06;
      p.stroke(201, 174, 222, s.life * 255);
      p.strokeWeight(2);
      p.point(s.x, s.y);
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, rod.x, rod.y) < 60) rod.isDragging = true;
  };

  p.mouseDragged = () => {
    if (rod.isDragging) {
      rod.x = p.constrain(p.mouseX, 60, p.width - 60);
      rod.y = p.constrain(p.mouseY, 40, p.height - 50);

      // Check rubbing with wool
      if (rod.x < wool.x + wool.w + 40 && rod.x > wool.x - 40 && rod.y > wool.y - 20 && rod.y < wool.y + wool.h + 20) {
        if (p.frameCount % 5 === 0 && rod.charge < 30) {
          rod.charge++;
          updateS2Readouts();
        }
      }
    }
  };

  p.mouseReleased = () => { rod.isDragging = false; };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletrizacao");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* ==========================================================================
   ESTAÇÃO 3: BLINDAGEM & GAIOLA DE FARADAY (ENEM)
   ========================================================================== */
const station3Faraday = (p) => {
  let cage = { x: 0, y: 0, w: 260, h: 160 };
  let probe = { x: 0, y: 0, r: 14, isDragging: false };
  let lightningBolt = [];
  let lightningTimer = 0;
  let accumulatedExtCharge = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-faraday");
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-faraday");

    cage.x = p.width * 0.5 - cage.w / 2;
    cage.y = p.height * 0.52 - cage.h / 2;
    probe.x = p.width * 0.5;
    probe.y = p.height * 0.52;

    initS3Controls();
    updateProbeMeasurement();
  };

  function initS3Controls() {
    const btnStrike = document.getElementById("btn-strike-lightning");
    if (btnStrike) {
      btnStrike.addEventListener("click", () => {
        triggerLightning();
      });
    }
  }

  function triggerLightning() {
    lightningTimer = 35;
    accumulatedExtCharge = 50;
    generateBolt();
    updateProbeMeasurement();
  }

  function generateBolt() {
    lightningBolt = [];
    let curX = p.width * 0.45;
    let curY = 0;
    const targetX = cage.x + cage.w * 0.4;
    const targetY = cage.y;

    lightningBolt.push({ x: curX, y: curY });
    while (curY < targetY) {
      curY += p.random(15, 30);
      curX += p.random(-25, 25);
      lightningBolt.push({ x: curX, y: Math.min(curY, targetY) });
    }
  }

  function isProbeInsideCage() {
    return (
      probe.x > cage.x + 12 &&
      probe.x < cage.x + cage.w - 12 &&
      probe.y > cage.y + 12 &&
      probe.y < cage.y + cage.h - 12
    );
  }

  function updateProbeMeasurement() {
    const eElem = document.getElementById("s3-probe-e");
    const posElem = document.getElementById("s3-probe-pos");
    const chElem = document.getElementById("s3-ext-charge");

    const inside = isProbeInsideCage();
    if (eElem) {
      if (inside) {
        eElem.textContent = "0,00 N/C (Nulo)";
        eElem.style.color = "#2e8b57";
      } else {
        const distToCenter = p.dist(probe.x, probe.y, cage.x + cage.w / 2, cage.y + cage.h / 2);
        const extE = Math.max(120, 800 - distToCenter * 2.5);
        eElem.textContent = `${extE.toFixed(1).replace(".", ",")} N/C`;
        eElem.style.color = "#c8435d";
      }
    }
    if (posElem) {
      posElem.textContent = inside ? "Interior da Gaiola (Blindado)" : "Exterior (Sob Ação do Campo)";
    }
    if (chElem) {
      chElem.textContent = `${accumulatedExtCharge} μC`;
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // 1. External Field Lines (if charged)
    if (accumulatedExtCharge > 0) {
      drawExtFieldLines();
    }

    // 2. Metallic Car / Cage Enclosure
    drawCageStructure();

    // 3. Lightning Bolt Animation
    if (lightningTimer > 0) {
      drawLightning();
      lightningTimer--;
    }

    // 4. Measuring Probe
    drawProbe();
  };

  function drawExtFieldLines() {
    p.stroke(201, 174, 222, 60);
    p.strokeWeight(1);
    const numRays = 18;
    const cx = cage.x + cage.w / 2;
    const cy = cage.y + cage.h / 2;

    for (let i = 0; i < numRays; i++) {
      let angle = (p.TWO_PI / numRays) * i;
      let x1 = cx + Math.cos(angle) * (cage.w * 0.52);
      let y1 = cy + Math.sin(angle) * (cage.h * 0.52);
      let x2 = cx + Math.cos(angle) * (cage.w * 0.9);
      let y2 = cy + Math.sin(angle) * (cage.h * 0.9);
      p.line(x1, y1, x2, y2);
    }
  }

  function drawCageStructure() {
    p.push();
    // Metallic Shell Thick Border
    p.fill(28, 24, 40);
    p.stroke(140, 103, 168);
    p.strokeWeight(8);
    p.rect(cage.x, cage.y, cage.w, cage.h, 24);

    // Interior Cavity Zone
    p.noStroke();
    p.fill(18, 16, 28);
    p.rect(cage.x + 8, cage.y + 8, cage.w - 16, cage.h - 16, 18);

    // Occupant Silhouette (Person / Driver sitting safely)
    const cx = cage.x + cage.w / 2;
    const cy = cage.y + cage.h / 2 + 10;
    p.fill(120, 110, 140, 180);
    p.ellipse(cx, cy - 20, 18, 18); // Head
    p.rectMode(p.CENTER);
    p.rect(cx, cy + 10, 24, 34, 6); // Torso

    // Sign "E = 0"
    p.fill(46, 139, 87, 220);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("E⃗_int = 0 N/C", cx, cy + 44);

    // External distributed charges on the shell perimeter
    if (accumulatedExtCharge > 0) {
      p.fill(200, 67, 93);
      p.textSize(10);
      for (let x = cage.x + 15; x < cage.x + cage.w; x += 25) {
        p.text("+", x, cage.y - 8);
        p.text("+", x, cage.y + cage.h + 12);
      }
      for (let y = cage.y + 20; y < cage.y + cage.h; y += 25) {
        p.text("+", cage.x - 8, y);
        p.text("+", cage.x + cage.w + 8, y);
      }
    }
    p.pop();
  }

  function drawLightning() {
    p.push();
    p.stroke(255, 255, 255);
    p.strokeWeight(3.5);
    for (let i = 0; i < lightningBolt.length - 1; i++) {
      p.line(lightningBolt[i].x, lightningBolt[i].y, lightningBolt[i + 1].x, lightningBolt[i + 1].y);
    }
    // Flash glow
    p.stroke(201, 174, 222, 140);
    p.strokeWeight(8);
    for (let i = 0; i < lightningBolt.length - 1; i++) {
      p.line(lightningBolt[i].x, lightningBolt[i].y, lightningBolt[i + 1].x, lightningBolt[i + 1].y);
    }
    p.pop();
  }

  function drawProbe() {
    p.push();
    const inside = isProbeInsideCage();

    // Probe Glow
    p.noStroke();
    p.fill(inside ? 46 : 200, inside ? 139 : 67, inside ? 87 : 93, 50);
    p.ellipse(probe.x, probe.y, probe.r * 2.6);

    // Probe Body
    p.fill(inside ? '#48c78e' : '#e8a9bc');
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(probe.x, probe.y, probe.r * 2);

    p.fill(20, 18, 30);
    p.noStroke();
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("SONDA", probe.x, probe.y);
    p.pop();
  }

  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, probe.x, probe.y) < probe.r * 2) {
      probe.isDragging = true;
    }
  };

  p.mouseDragged = () => {
    if (probe.isDragging) {
      probe.x = p.constrain(p.mouseX, 20, p.width - 20);
      probe.y = p.constrain(p.mouseY, 20, p.height - 20);
      updateProbeMeasurement();
    }
  };

  p.mouseReleased = () => { probe.isDragging = false; };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-faraday");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      cage.x = p.width * 0.5 - cage.w / 2;
      cage.y = p.height * 0.52 - cage.h / 2;
    }
  };
};

/* ==========================================================================
   ESTAÇÃO 4: DEFLEXÃO EM CAMPO UNIFORME (FUVEST)
   ========================================================================== */
const station4Deflexao = (p) => {
  let fieldE = 300; // V/m (orientado para cima)
  let v0 = 4.0; // x10^6 m/s
  let particles = [];
  let firingBeam = true;

  p.setup = () => {
    const wrap = document.getElementById("canvas-deflexao");
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-deflexao");

    initS4Controls();
    calculateS4Physics();
  };

  function initS4Controls() {
    const eSlider = document.getElementById("s4-e-slider");
    const vSlider = document.getElementById("s4-v-slider");
    const btnFire = document.getElementById("btn-fire-electron");

    if (eSlider) {
      eSlider.addEventListener("input", (e) => {
        fieldE = parseFloat(e.target.value);
        document.getElementById("s4-e-val").textContent = `${fieldE} V/m`;
        calculateS4Physics();
      });
    }

    if (vSlider) {
      vSlider.addEventListener("input", (e) => {
        v0 = parseFloat(e.target.value);
        document.getElementById("s4-v-val").textContent = `${v0.toFixed(1).replace(".", ",")} × 10⁶ m/s`;
        calculateS4Physics();
      });
    }

    if (btnFire) {
      btnFire.addEventListener("click", () => {
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: 60 - i * 14,
            y: p.height * 0.48,
            vx: v0 * 1.6,
            vy: 0
          });
        }
      });
    }
  }

  function calculateS4Physics() {
    // a = e * E / m
    const e = 1.6e-19;
    const m = 9.11e-31;
    const accel = (e * fieldE) / m;

    const accelElem = document.getElementById("s4-accel-num");
    const deflElem = document.getElementById("s4-deflection-num");

    if (accelElem) accelElem.textContent = `${(accel / 1e13).toFixed(2).replace(".", ",")} × 10¹³ m/s²`;
    if (deflElem) {
      const L = 0.1; // 10 cm plates
      const t = L / (v0 * 1e6);
      const deltaY = 0.5 * accel * t * t * 1000; // mm
      deflElem.textContent = `-${deltaY.toFixed(1).replace(".", ",")} mm (Para baixo)`;
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const plateX1 = 120;
    const plateX2 = p.width - 100;
    const plateTopY = 70;
    const plateBotY = p.height - 70;

    // 1. Deflection Plates
    drawPlates(plateX1, plateX2, plateTopY, plateBotY);

    // 2. Electric Field Vectors (Pointing UP)
    drawUniformField(plateX1, plateX2, plateTopY, plateBotY);

    // 3. Electron Gun at Left
    drawElectronGun(plateX1, p.height * 0.48);

    // 4. Parabolic Trajectory Curve Projection
    drawTheoreticalParabola(plateX1, p.height * 0.48, plateX2, plateTopY, plateBotY);

    // 5. Active Electron Particles
    updateAndDrawBeam(plateX1, plateX2, plateTopY, plateBotY);
  };

  function drawPlates(x1, x2, yTop, yBot) {
    p.push();
    p.strokeWeight(4);

    // Top Plate (Positive +)
    p.stroke(200, 67, 93);
    p.line(x1, yTop, x2, yTop);
    p.noStroke();
    p.fill(200, 67, 93);
    p.textSize(10);
    for (let x = x1 + 15; x < x2; x += 30) p.text("+", x, yTop - 6);

    // Bottom Plate (Negative -)
    p.stroke(59, 108, 181);
    p.line(x1, yBot, x2, yBot);
    p.noStroke();
    p.fill(59, 108, 181);
    for (let x = x1 + 15; x < x2; x += 30) p.text("−", x, yBot + 14);
    p.pop();
  }

  function drawUniformField(x1, x2, yTop, yBot) {
    p.push();
    p.stroke(201, 174, 222, 60);
    p.strokeWeight(1);
    for (let x = x1 + 25; x < x2; x += 35) {
      p.line(x, yBot - 8, x, yTop + 8);
      // Arrow pointing up (toward positive plate)
      p.fill(201, 174, 222, 100);
      p.noStroke();
      p.triangle(x, yTop + 8, x - 3, yTop + 14, x + 3, yTop + 14);
    }
    // Label E
    p.fill(201, 174, 222, 180);
    p.textSize(11);
    p.text("E⃗ (Campo)", x2 + 10, (yTop + yBot) / 2);
    p.pop();
  }

  function drawElectronGun(gunX, gunY) {
    p.push();
    p.fill(45, 38, 58);
    p.stroke(140, 103, 168);
    p.strokeWeight(1.5);
    p.rect(15, gunY - 14, gunX - 25, 28, 4);

    p.noStroke();
    p.fill(190, 180, 210);
    p.textSize(9);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Canhão e⁻", (15 + gunX - 25) / 2, gunY);
    p.pop();
  }

  function drawTheoreticalParabola(startX, startY, endX, yTop, yBot) {
    p.push();
    p.noFill();
    p.stroke(46, 139, 87, 120);
    p.strokeWeight(1.5);
    p.drawingContext.setLineDash([4, 4]);

    const kCurve = (fieldE * 0.0003) / (v0 * v0);
    p.beginShape();
    for (let x = startX; x <= endX + 60; x += 5) {
      let dx = x - startX;
      let y = startY + kCurve * dx * dx;
      if (y > yBot) break;
      p.vertex(x, y);
    }
    p.endShape();
    p.drawingContext.setLineDash([]);
    p.pop();
  }

  function updateAndDrawBeam(x1, x2, yTop, yBot) {
    // Continuously add electrons
    if (p.frameCount % 6 === 0) {
      particles.push({
        x: 60,
        y: p.height * 0.48,
        vx: v0 * 1.5,
        vy: 0
      });
    }

    const kAccel = (fieldE * 0.0008) / (v0);

    for (let i = particles.length - 1; i >= 0; i--) {
      let pt = particles[i];
      pt.x += pt.vx;

      // Inside plates: accelerated downwards
      if (pt.x > x1 && pt.x < x2) {
        pt.vy += kAccel;
      }
      pt.y += pt.vy;

      // Draw glowing blue electron
      p.noStroke();
      p.fill(59, 108, 181, 70);
      p.ellipse(pt.x, pt.y, 14, 14);
      p.fill(255);
      p.ellipse(pt.x, pt.y, 4, 4);

      if (pt.x > p.width || pt.y > yBot || pt.y < yTop) {
        particles.splice(i, 1);
      }
    }
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-deflexao");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* ==========================================================================
   INICIALIZAÇÃO DOS 4 APARATOS EM MODO INSTÂNCIA
   ========================================================================== */
window.addEventListener("load", () => {
  if (document.getElementById("canvas-coulomb")) new p5(station1Coulomb);
  if (document.getElementById("canvas-eletrizacao")) new p5(station2Eletrizacao);
  if (document.getElementById("canvas-faraday")) new p5(station3Faraday);
  if (document.getElementById("canvas-deflexao")) new p5(station4Deflexao);
});
