/**
 * MÓDULO 1: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL EXPANDIDO
 * 1. Lançamento de Projéteis (FUVEST / ITA)
 * 2. Plano Inclinado & Atrito (UNICAMP / UNESP)
 * 3. Hidrostática & Empuxo (ENEM / UFMT / IFMT)
 * 4. Colisões & Quantidade de Movimento (IME / FEI)
 */

/* --- 1. Lançamento de Projéteis --- */
const simMecLancamento = (p) => {
  let angleDeg = 45;
  let v0 = 20; // m/s
  let g = 10;  // m/s^2
  let cannonPos = { x: 50, y: 0 };
  let projectile = null;
  let trajectoryPath = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-lancamento");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-lancamento");

    cannonPos.y = p.height - 40;
    initControls();
    calculatePhysics();
  };

  function initControls() {
    const angleSlider = document.getElementById("m1-angle-slider");
    const v0Slider = document.getElementById("m1-v0-slider");
    const gSlider = document.getElementById("m1-g-slider");
    const btnFire = document.getElementById("btn-fire-cannon");
    const btn45 = document.getElementById("btn-demo-maxrange");

    if (angleSlider) {
      angleSlider.addEventListener("input", (e) => {
        angleDeg = parseFloat(e.target.value);
        document.getElementById("m1-angle-val").textContent = `${angleDeg}°`;
        calculatePhysics();
      });
    }

    if (v0Slider) {
      v0Slider.addEventListener("input", (e) => {
        v0 = parseFloat(e.target.value);
        document.getElementById("m1-v0-val").textContent = `${v0} m/s`;
        calculatePhysics();
      });
    }

    if (gSlider) {
      gSlider.addEventListener("input", (e) => {
        g = parseFloat(e.target.value);
        document.getElementById("m1-g-val").textContent = `${g.toFixed(1)} m/s²`;
        calculatePhysics();
      });
    }

    if (btnFire) btnFire.addEventListener("click", fireCannon);
    if (btn45) {
      btn45.addEventListener("click", () => {
        angleDeg = 45;
        if (angleSlider) angleSlider.value = 45;
        document.getElementById("m1-angle-val").textContent = "45° (Alcance Máx)";
        calculatePhysics();
        fireCannon();
      });
    }
  }

  function fireCannon() {
    trajectoryPath = [];
    const rad = p.radians(angleDeg);
    projectile = {
      x: cannonPos.x,
      y: cannonPos.y,
      vx: v0 * Math.cos(rad) * 0.55,
      vy: -v0 * Math.sin(rad) * 0.55
    };
  }

  function calculatePhysics() {
    const rad = p.radians(angleDeg);
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const hMax = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * g);
    const tFlight = (2 * v0 * Math.sin(rad)) / g;

    const rangeElem = document.getElementById("m1-range-num");
    const hmaxElem = document.getElementById("m1-hmax-num");
    const timeElem = document.getElementById("m1-time-num");

    if (rangeElem) rangeElem.textContent = `${range.toFixed(1).replace(".", ",")} m`;
    if (hmaxElem) hmaxElem.textContent = `${hMax.toFixed(1).replace(".", ",")} m`;
    if (timeElem) timeElem.textContent = `${tFlight.toFixed(2).replace(".", ",")} s`;
  }

  p.draw = () => {
    p.background(18, 16, 28);

    p.noStroke();
    p.fill(32, 28, 44);
    p.rect(0, p.height - 35, p.width, 35);
    p.stroke(80, 70, 95);
    p.line(0, p.height - 35, p.width, p.height - 35);

    drawTheoreticalTrajectory();

    p.stroke(201, 174, 222, 180);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    trajectoryPath.forEach(pt => p.vertex(pt.x, pt.y));
    p.endShape();

    if (projectile) {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      projectile.vy += (g * 0.015);

      trajectoryPath.push({ x: projectile.x, y: projectile.y });

      p.noStroke();
      p.fill(200, 67, 93);
      p.ellipse(projectile.x, projectile.y, 10, 10);
      p.fill(255);
      p.ellipse(projectile.x, projectile.y, 4, 4);

      if (projectile.y >= cannonPos.y) projectile = null;
    }

    drawCannon();
  };

  function drawTheoreticalTrajectory() {
    const rad = p.radians(angleDeg);
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const pxScale = (p.width - 120) / 45;

    p.stroke(46, 139, 87, 100);
    p.strokeWeight(1.5);
    p.drawingContext.setLineDash([4, 4]);
    p.noFill();
    p.beginShape();
    for (let x = 0; x <= range; x += 0.5) {
      let y = x * Math.tan(rad) - (g / (2 * v0 * v0 * Math.cos(rad) * Math.cos(rad))) * x * x;
      if (y < 0) break;
      p.vertex(cannonPos.x + x * pxScale, cannonPos.y - y * pxScale);
    }
    p.endShape();
    p.drawingContext.setLineDash([]);
  }

  function drawCannon() {
    p.push();
    p.translate(cannonPos.x, cannonPos.y);
    p.fill(60, 52, 75);
    p.stroke(140, 103, 168);
    p.strokeWeight(1.5);
    p.arc(0, 0, 36, 36, p.PI, p.TWO_PI);

    p.rotate(-p.radians(angleDeg));
    p.fill(90, 78, 110);
    p.rect(0, -7, 34, 14, 2);
    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-lancamento");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      cannonPos.y = p.height - 40;
    }
  };
};

/* --- 2. Plano Inclinado com Atrito --- */
const simMecPlanoInclinado = (p) => {
  let thetaDeg = 30;
  let mu = 0.4;
  let mass = 2.0;
  let isSliding = false;
  let blockX = 80;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-plano");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-plano");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const thetaSlider = document.getElementById("m2-theta-slider");
    const muSlider = document.getElementById("m2-mu-slider");
    const btnRelease = document.getElementById("btn-release-block");

    if (thetaSlider) {
      thetaSlider.addEventListener("input", (e) => {
        thetaDeg = parseFloat(e.target.value);
        document.getElementById("m2-theta-val").textContent = `${thetaDeg}°`;
        blockX = 80;
        isSliding = false;
        calculatePhysics();
      });
    }

    if (muSlider) {
      muSlider.addEventListener("input", (e) => {
        mu = parseFloat(e.target.value);
        document.getElementById("m2-mu-val").textContent = mu.toFixed(2);
        blockX = 80;
        isSliding = false;
        calculatePhysics();
      });
    }

    if (btnRelease) {
      btnRelease.addEventListener("click", () => {
        blockX = 80;
        isSliding = true;
      });
    }
  }

  function calculatePhysics() {
    const rad = p.radians(thetaDeg);
    const g = 10;
    const Px = mass * g * Math.sin(rad);
    const Py = mass * g * Math.cos(rad);
    const N = Py;
    const FatMax = mu * N;
    const netForce = Math.max(0, Px - FatMax);
    const accel = netForce / mass;

    const pxElem = document.getElementById("m2-px-num");
    const fatElem = document.getElementById("m2-fat-num");
    const accelElem = document.getElementById("m2-accel-num");
    const statusElem = document.getElementById("m2-status-text");

    if (pxElem) pxElem.textContent = `${Px.toFixed(1).replace(".", ",")} N`;
    if (fatElem) fatElem.textContent = `${FatMax.toFixed(1).replace(".", ",")} N`;
    if (accelElem) accelElem.textContent = `${accel.toFixed(2).replace(".", ",")} m/s²`;
    if (statusElem) {
      statusElem.textContent = Px <= FatMax ? "Repouso (Estático)" : "Deslizando";
      statusElem.style.color = Px <= FatMax ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const rampOrigin = { x: 50, y: p.height - 50 };
    const rampLen = p.width - 120;
    const rad = p.radians(thetaDeg);
    const rampEnd = {
      x: rampOrigin.x + rampLen * Math.cos(rad),
      y: rampOrigin.y - rampLen * Math.sin(rad)
    };

    p.fill(36, 30, 48);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.triangle(rampOrigin.x, rampOrigin.y, rampEnd.x, rampOrigin.y, rampEnd.x, rampEnd.y);
    p.stroke(80, 70, 95);
    p.line(0, rampOrigin.y, p.width, rampOrigin.y);

    p.push();
    p.translate(rampEnd.x, rampEnd.y);
    p.rotate(rad);

    if (isSliding) {
      const g = 10;
      const Px = mass * g * Math.sin(rad);
      const FatMax = mu * mass * g * Math.cos(rad);
      if (Px > FatMax) blockX += (Px - FatMax) * 0.15;
    }

    p.fill(201, 174, 222);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(blockX - rampLen, -30, 40, 30, 3);
    p.pop();
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-plano");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 3. Hidrostática & Empuxo --- */
const simMecHidrostatica = (p) => {
  let fluidDensity = 1.0;
  let blockVolume = 500;
  let blockDensity = 2.7;
  let immersionDepth = 0.5;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-hidrostatica");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-hidrostatica");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const fluidSlider = document.getElementById("m3-fluid-slider");
    const depthSlider = document.getElementById("m3-depth-slider");

    if (fluidSlider) {
      fluidSlider.addEventListener("input", (e) => {
        fluidDensity = parseFloat(e.target.value);
        document.getElementById("m3-fluid-val").textContent = `${fluidDensity.toFixed(2)} g/cm³`;
        calculatePhysics();
      });
    }

    if (depthSlider) {
      depthSlider.addEventListener("input", (e) => {
        immersionDepth = parseFloat(e.target.value);
        document.getElementById("m3-depth-val").textContent = `${Math.round(immersionDepth * 100)}%`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const massKg = (blockDensity * blockVolume) / 1000;
    const P = massKg * 10;
    const vSubCm3 = blockVolume * immersionDepth;
    const vSubM3 = vSubCm3 * 1e-6;
    const rhoLiqKgM3 = fluidDensity * 1000;
    const E = rhoLiqKgM3 * vSubM3 * 10;
    const Pap = Math.max(0, P - E);

    const pRealElem = document.getElementById("m3-preal-num");
    const empuxoElem = document.getElementById("m3-empuxo-num");
    const papElem = document.getElementById("m3-pap-num");

    if (pRealElem) pRealElem.textContent = `${P.toFixed(2).replace(".", ",")} N`;
    if (empuxoElem) empuxoElem.textContent = `${E.toFixed(2).replace(".", ",")} N`;
    if (papElem) papElem.textContent = `${Pap.toFixed(2).replace(".", ",")} N`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const beakerX = p.width * 0.45;
    const beakerY = 140, beakerW = 160, beakerH = 180;

    p.fill(24, 20, 36);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(beakerX, beakerY, beakerW, beakerH, 0, 0, 8, 8);

    p.noStroke();
    p.fill(59, 108, 181, 100);
    p.rect(beakerX + 3, beakerY + 30, beakerW - 6, beakerH - 33, 0, 0, 6, 6);

    const blockH = 50, blockW = 50;
    const blockY = beakerY + 10 + (1 - immersionDepth) * 35;
    const blockX = beakerX + beakerW / 2 - blockW / 2;

    p.stroke(201, 174, 222);
    p.line(beakerX + beakerW / 2, 85, beakerX + beakerW / 2, blockY);

    p.fill(160, 140, 180);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(blockX, blockY, blockW, blockH, 3);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-hidrostatica");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 4. Colisões Mecânicas --- */
const simMecColisoes = (p) => {
  let m1 = 2.0, m2 = 2.0; // kg
  let v1 = 4.0, v2 = -2.0; // m/s
  let eRestitution = 1.0; // 1.0 (elástica), 0.0 (inelástica)
  let c1 = { x: 120, y: 180, r: 24, vx: 4.0 };
  let c2 = { x: 380, y: 180, r: 24, vx: -2.0 };
  let isRunning = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-colisoes");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-colisoes");

    initControls();
  };

  function initControls() {
    const m1Slider = document.getElementById("m4-m1-slider");
    const m2Slider = document.getElementById("m4-m2-slider");
    const eSlider = document.getElementById("m4-e-slider");
    const btnStart = document.getElementById("btn-start-collision");
    const btnReset = document.getElementById("btn-reset-collision");

    if (m1Slider) m1Slider.addEventListener("input", (e) => { m1 = parseFloat(e.target.value); resetCars(); });
    if (m2Slider) m2Slider.addEventListener("input", (e) => { m2 = parseFloat(e.target.value); resetCars(); });
    if (eSlider) eSlider.addEventListener("input", (e) => { eRestitution = parseFloat(e.target.value); resetCars(); });

    if (btnStart) btnStart.addEventListener("click", () => { isRunning = true; });
    if (btnReset) btnReset.addEventListener("click", resetCars);
  }

  function resetCars() {
    isRunning = false;
    c1.x = 120; c1.vx = v1;
    c2.x = p.width - 120; c2.vx = v2;
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // Trilho de ar
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.line(40, 204, p.width - 40, 204);

    if (isRunning) {
      c1.x += c1.vx * 0.8;
      c2.x += c2.vx * 0.8;

      // Detecção de colisão
      if (c1.x + c1.r >= c2.x - c2.r) {
        // Fórmulas 1D de colisão com restituição
        let v1_after = ((m1 - eRestitution * m2) * c1.vx + (1 + eRestitution) * m2 * c2.vx) / (m1 + m2);
        let v2_after = ((1 + eRestitution) * m1 * c1.vx + (m2 - eRestitution * m1) * c2.vx) / (m1 + m2);
        c1.vx = v1_after;
        c2.vx = v2_after;
      }
    }

    // Desenho Carrinho 1
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(c1.x - c1.r, c1.y - 20, c1.r * 2, 40, 4);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`m₁ = ${m1} kg`, c1.x, c1.y);

    // Desenho Carrinho 2
    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(c2.x - c2.r, c2.y - 20, c2.r * 2, 40, 4);
    p.noStroke();
    p.fill(255);
    p.text(`m₂ = ${m2} kg`, c2.x, c2.y);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-colisoes");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      resetCars();
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-mec-lancamento")) new p5(simMecLancamento);
  if (document.getElementById("canvas-mec-plano")) new p5(simMecPlanoInclinado);
  if (document.getElementById("canvas-mec-hidrostatica")) new p5(simMecHidrostatica);
  if (document.getElementById("canvas-mec-colisoes")) new p5(simMecColisoes);
});
