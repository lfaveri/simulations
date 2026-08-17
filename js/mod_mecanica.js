/**
 * MÓDULO 1: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL
 * 1. Lançamento Oblíquo (FUVEST)
 * 2. Plano Inclinado com Atrito (UNICAMP)
 * 3. Hidrostática & Empuxo de Arquimedes (ENEM)
 */

/* --- 1. Lançamento Oblíquo --- */
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

    if (btnFire) {
      btnFire.addEventListener("click", fireCannon);
    }

    if (btn45) {
      btn45.addEventListener("click", () => {
        angleDeg = 45;
        if (angleSlider) angleSlider.value = 45;
        document.getElementById("m1-angle-val").textContent = "45° (Alcance Máximo)";
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
      vy: -v0 * Math.sin(rad) * 0.55,
      t: 0
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

    // Solo
    p.noStroke();
    p.fill(32, 28, 44);
    p.rect(0, p.height - 35, p.width, 35);
    p.stroke(80, 70, 95);
    p.line(0, p.height - 35, p.width, p.height - 35);

    // Eixos / Régua milimetrada
    p.stroke(255, 255, 255, 15);
    for (let x = 50; x < p.width; x += 50) {
      p.line(x, 0, x, p.height - 35);
    }

    // Trajetória teórica contínua
    drawTheoreticalTrajectory();

    // Rastro da bala
    p.stroke(201, 174, 222, 180);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    trajectoryPath.forEach(pt => p.vertex(pt.x, pt.y));
    p.endShape();

    // Projétil
    if (projectile) {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      projectile.vy += (g * 0.015); // Gravidade

      trajectoryPath.push({ x: projectile.x, y: projectile.y });

      p.noStroke();
      p.fill(200, 67, 93);
      p.ellipse(projectile.x, projectile.y, 10, 10);
      p.fill(255);
      p.ellipse(projectile.x, projectile.y, 4, 4);

      if (projectile.y >= cannonPos.y) {
        projectile = null;
      }
    }

    // Canhão
    drawCannon();
  };

  function drawTheoreticalTrajectory() {
    const rad = p.radians(angleDeg);
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const pxScale = (p.width - 120) / 45; // escala

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

    // Base
    p.fill(60, 52, 75);
    p.stroke(140, 103, 168);
    p.strokeWeight(1.5);
    p.arc(0, 0, 36, 36, p.PI, p.TWO_PI);

    // Tubo
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
  let mass = 2.0; // kg
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
      if (Px <= FatMax) {
        statusElem.textContent = "Repouso (Atrito Estático)";
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = "Deslizando (Acelerado)";
        statusElem.style.color = "#c8435d";
      }
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

    // Desenho da rampa em cunha
    p.fill(36, 30, 48);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.triangle(rampOrigin.x, rampOrigin.y, rampEnd.x, rampOrigin.y, rampEnd.x, rampEnd.y);

    // Solo horizontal
    p.stroke(80, 70, 95);
    p.line(0, rampOrigin.y, p.width, rampOrigin.y);

    // Bloco no plano
    p.push();
    p.translate(rampEnd.x, rampEnd.y);
    p.rotate(rad);

    if (isSliding) {
      const g = 10;
      const Px = mass * g * Math.sin(rad);
      const FatMax = mu * mass * g * Math.cos(rad);
      if (Px > FatMax) {
        blockX += (Px - FatMax) * 0.15;
      }
    }

    // Bloco
    p.fill(201, 174, 222);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(blockX - rampLen, -30, 40, 30, 3);

    // Vetores de Força no bloco
    const bx = blockX - rampLen + 20;
    const by = -15;

    // Normal N (para cima perpendicular)
    drawVectorArrow(bx, by, bx, by - 35, [59, 108, 181], "N⃗");
    // Atrito Fat (para trás ao longo da rampa)
    drawVectorArrow(bx, by, bx - 30, by, [200, 67, 93], "f⃗_at");
    // Peso tangencial Px (para frente ao longo da rampa)
    drawVectorArrow(bx, by, bx + 40, by, [46, 139, 87], "P⃗_x");
    p.pop();
  };

  function drawVectorArrow(x1, y1, x2, y2, col, label) {
    p.stroke(col[0], col[1], col[2]);
    p.strokeWeight(2);
    p.line(x1, y1, x2, y2);
    p.fill(col[0], col[1], col[2]);
    p.noStroke();
    p.ellipse(x2, y2, 4, 4);
    p.textSize(9);
    p.text(label, x2 + 4, y2 - 2);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-plano");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 3. Hidrostática & Empuxo de Arquimedes --- */
const simMecHidrostatica = (p) => {
  let fluidDensity = 1.0; // g/cm^3 (Água = 1.0)
  let blockVolume = 500;  // cm^3
  let blockDensity = 2.7; // Alumínio = 2.7 g/cm^3
  let immersionDepth = 0.5; // 0 (fora) a 1.0 (total)

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
    // P = m * g = rho_corpo * V * g
    const massKg = (blockDensity * blockVolume) / 1000;
    const P = massKg * 10;
    // Empuxo E = rho_liq * V_sub * g
    const vSubCm3 = blockVolume * immersionDepth;
    const vSubM3 = vSubCm3 * 1e-6;
    const rhoLiqKgM3 = fluidDensity * 1000;
    const E = rhoLiqKgM3 * vSubM3 * 10;
    // Peso Aparente Pap = P - E
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
    const beakerY = 140;
    const beakerW = 160;
    const beakerH = 180;

    // Béquer de vidro
    p.fill(24, 20, 36);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(beakerX, beakerY, beakerW, beakerH, 0, 0, 8, 8);

    // Fluido líquido
    p.noStroke();
    p.fill(59, 108, 181, 100);
    p.rect(beakerX + 3, beakerY + 30, beakerW - 6, beakerH - 33, 0, 0, 6, 6);

    // Dinamômetro superior
    p.stroke(180, 170, 200);
    p.strokeWeight(3);
    p.line(beakerX + beakerW / 2, 20, beakerX + beakerW / 2, 80);
    p.fill(50, 42, 65);
    p.rect(beakerX + beakerW / 2 - 14, 40, 28, 45, 4);

    // Bloco suspenso
    const blockH = 50;
    const blockW = 50;
    const blockY = beakerY + 10 + (1 - immersionDepth) * 35;
    const blockX = beakerX + beakerW / 2 - blockW / 2;

    p.stroke(201, 174, 222);
    p.line(beakerX + beakerW / 2, 85, beakerX + beakerW / 2, blockY);

    p.fill(160, 140, 180);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(blockX, blockY, blockW, blockH, 3);

    // Vetores: Peso P para baixo, Empuxo E para cima
    p.stroke(200, 67, 93);
    p.strokeWeight(2);
    p.line(blockX + blockW / 2, blockY + blockH / 2, blockX + blockW / 2, blockY + blockH / 2 + 35);
    p.stroke(46, 139, 87);
    p.line(blockX + blockW / 2, blockY + blockH / 2, blockX + blockW / 2, blockY + blockH / 2 - 25);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-hidrostatica");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-mec-lancamento")) new p5(simMecLancamento);
  if (document.getElementById("canvas-mec-plano")) new p5(simMecPlanoInclinado);
  if (document.getElementById("canvas-mec-hidrostatica")) new p5(simMecHidrostatica);
});
