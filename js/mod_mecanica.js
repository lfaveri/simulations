/**
 * MÓDULO: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL COMPLETO
 * 1. Lançamento de Projéteis & Balística (FUVEST / ITA)
 * 2. Plano Inclinado com Decomposição Vetorial Completa & Atrito (UNICAMP / UNESP)
 * 3. Hidrostática & Empuxo de Arquimedes (ENEM / UFMT)
 * 4. Colisões 1D & Conservação de Energia (IME / FEI)
 */

/* ==========================================================================
   1. LANÇAMENTO DE PROJÉTEIS & BALÍSTICA
   ========================================================================== */
const simMecLancamento = (p) => {
  let angleDeg = 45;
  let v0 = 20; // m/s
  let g = 10;  // m/s^2
  let cannonPos = { x: 60, y: 0 };
  let projectile = null;
  let trajectoryPath = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-lancamento");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-lancamento");

    cannonPos.y = p.height - 45;
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

    // Solo do Laboratório
    p.noStroke();
    p.fill(32, 28, 44);
    p.rect(0, p.height - 40, p.width, 40);
    p.stroke(80, 70, 95);
    p.line(0, p.height - 40, p.width, p.height - 40);

    drawTheoreticalTrajectory();

    // Rastro da trajetória
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

    p.stroke(46, 139, 87, 120);
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
      cannonPos.y = p.height - 45;
    }
  };
};

/* ==========================================================================
   2. PLANO INCLINADO COM DECOMPOSIÇÃO VETORIAL & ATRITO
   ========================================================================== */
const simMecPlanoInclinado = (p) => {
  let thetaDeg = 30;
  let mu = 0.40;
  let mass = 2.0; // kg
  const g = 10;   // m/s^2

  let isSliding = false;
  let blockDist = 0; // distância percorrida ao longo da rampa (pixels)
  let blockSpeed = 0;

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
    const massSlider = document.getElementById("m2-mass-slider");
    const btnRelease = document.getElementById("btn-release-block");
    const btnReset = document.getElementById("btn-reset-block");

    if (thetaSlider) {
      thetaSlider.addEventListener("input", (e) => {
        thetaDeg = parseFloat(e.target.value);
        document.getElementById("m2-theta-val").textContent = `${thetaDeg}°`;
        resetBlock();
      });
    }

    if (muSlider) {
      muSlider.addEventListener("input", (e) => {
        mu = parseFloat(e.target.value);
        document.getElementById("m2-mu-val").textContent = mu.toFixed(2);
        resetBlock();
      });
    }

    if (massSlider) {
      massSlider.addEventListener("input", (e) => {
        mass = parseFloat(e.target.value);
        document.getElementById("m2-mass-val").textContent = `${mass.toFixed(1)} kg`;
        resetBlock();
      });
    }

    if (btnRelease) {
      btnRelease.addEventListener("click", () => {
        const rad = p.radians(thetaDeg);
        const Px = mass * g * Math.sin(rad);
        const FatMax = mu * mass * g * Math.cos(rad);
        if (Px > FatMax) {
          isSliding = true;
        }
      });
    }

    if (btnReset) btnReset.addEventListener("click", resetBlock);
  }

  function resetBlock() {
    isSliding = false;
    blockDist = 0;
    blockSpeed = 0;
    calculatePhysics();
  }

  function calculatePhysics() {
    const rad = p.radians(thetaDeg);
    const P = mass * g;
    const Px = P * Math.sin(rad);
    const Py = P * Math.cos(rad);
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
        statusElem.textContent = "Equilíbrio Estático (Px ≤ Fat)";
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = `Deslizando com a = ${accel.toFixed(2)} m/s²`;
        statusElem.style.color = "#c8435d";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // Geometria da Rampa
    const rad = p.radians(thetaDeg);
    const rampOrigin = { x: 70, y: p.height - 50 };
    const rampLength = p.width - 160;
    const rampEnd = {
      x: rampOrigin.x + rampLength * Math.cos(rad),
      y: rampOrigin.y - rampLength * Math.sin(rad)
    };

    // Solo
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(0, rampOrigin.y, p.width, rampOrigin.y);

    // Corpo da Rampa
    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2.5);
    p.triangle(rampOrigin.x, rampOrigin.y, rampEnd.x, rampOrigin.y, rampEnd.x, rampEnd.y);

    // Arco do Ângulo θ
    p.noFill();
    p.stroke(201, 174, 222);
    p.strokeWeight(1.5);
    p.arc(rampEnd.x, rampOrigin.y, 60, 60, p.PI, p.PI + rad);
    p.noStroke();
    p.fill(201, 174, 222);
    p.textSize(11);
    p.text(`${thetaDeg}°`, rampEnd.x - 45, rampOrigin.y - 10);

    // Animação de Movimento do Bloco
    const maxSlideDist = rampLength - 80;
    if (isSliding && blockDist < maxSlideDist) {
      const Px = mass * g * Math.sin(rad);
      const Fat = mu * mass * g * Math.cos(rad);
      const accel = (Px - Fat) / mass;
      blockSpeed += accel * 0.08;
      blockDist += blockSpeed;
      if (blockDist >= maxSlideDist) {
        blockDist = maxSlideDist;
        isSliding = false;
      }
    }

    // Posição do Bloco sobre a Rampa
    // O bloco desce do topo (rampEnd) em direção à base (rampOrigin)
    const currentDist = 60 + blockDist;
    const bx = rampEnd.x - currentDist * Math.cos(rad);
    const by = rampEnd.y + currentDist * Math.sin(rad);

    p.push();
    p.translate(bx, by);
    p.rotate(-rad);

    // Bloco
    p.fill(201, 174, 222);
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(-25, -40, 50, 40, 4);

    p.noStroke();
    p.fill(20, 15, 30);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${mass.toFixed(1)}kg`, 0, -20);

    // Vetores de Força no Bloco
    drawForceVectors(rad);
    p.pop();
  };

  function drawForceVectors(rad) {
    const P = mass * g;
    const Px = P * Math.sin(rad);
    const Py = P * Math.cos(rad);
    const N = Py;
    const Fat = Math.min(Px, mu * N);

    // Normal N (perpendicular para cima)
    p.stroke(100, 200, 255);
    p.strokeWeight(2.5);
    p.line(0, -20, 0, -20 - N * 2.5);
    p.fill(100, 200, 255);
    p.noStroke();
    p.triangle(0, -20 - N * 2.5 - 6, -4, -20 - N * 2.5, 4, -20 - N * 2.5);
    p.textSize(9);
    p.text("N", 10, -20 - N * 2.5);

    // Componente Px (paralela para baixo da rampa)
    p.stroke(255, 220, 80);
    p.strokeWeight(2.5);
    p.line(0, -20, -Px * 2.8, -20);
    p.fill(255, 220, 80);
    p.noStroke();
    p.triangle(-Px * 2.8 - 6, -20, -Px * 2.8, -24, -Px * 2.8, -16);
    p.text("Px", -Px * 2.8 - 12, -20);

    // Força de Atrito Fat (paralela para cima da rampa)
    p.stroke(46, 139, 87);
    p.strokeWeight(2.5);
    p.line(0, -20, Fat * 2.8, -20);
    p.fill(46, 139, 87);
    p.noStroke();
    p.triangle(Fat * 2.8 + 6, -20, Fat * 2.8, -24, Fat * 2.8, -16);
    p.text("Fat", Fat * 2.8 + 14, -20);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-plano");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      resetBlock();
    }
  };
};

/* ==========================================================================
   3. HIDROSTÁTICA & EMPUXO DE ARQUIMEDES
   ========================================================================== */
const simMecHidrostatica = (p) => {
  let fluidDensity = 1.0; // g/cm^3
  let blockVolume = 500;  // cm^3
  let blockDensity = 2.7; // Alumínio = 2.7 g/cm^3
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

    // Béquer
    p.fill(24, 20, 36);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(beakerX, beakerY, beakerW, beakerH, 0, 0, 8, 8);

    // Líquido
    p.noStroke();
    p.fill(59, 108, 181, 100);
    p.rect(beakerX + 3, beakerY + 30, beakerW - 6, beakerH - 33, 0, 0, 6, 6);

    const blockH = 50, blockW = 50;
    const blockY = beakerY + 10 + (1 - immersionDepth) * 35;
    const blockX = beakerX + beakerW / 2 - blockW / 2;

    // Haste do Dinamômetro
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.line(beakerX + beakerW / 2, 70, beakerX + beakerW / 2, blockY);

    // Bloco
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

/* ==========================================================================
   4. COLISÕES 1D & CONSERVAÇÃO DO MOMENTO LINEAR
   ========================================================================== */
const simMecColisoes = (p) => {
  let m1 = 2.0, m2 = 2.0; // kg
  let v1 = 4.0, v2 = -2.0; // m/s
  let eRestitution = 1.0;
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

      if (c1.x + c1.r >= c2.x - c2.r) {
        let v1_after = ((m1 - eRestitution * m2) * c1.vx + (1 + eRestitution) * m2 * c2.vx) / (m1 + m2);
        let v2_after = ((1 + eRestitution) * m1 * c1.vx + (m2 - eRestitution * m1) * c2.vx) / (m1 + m2);
        c1.vx = v1_after;
        c2.vx = v2_after;
      }
    }

    // Carrinho 1
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(c1.x - c1.r, c1.y - 20, c1.r * 2, 40, 4);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`m₁=${m1}kg`, c1.x, c1.y);

    // Carrinho 2
    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(c2.x - c2.r, c2.y - 20, c2.r * 2, 40, 4);
    p.noStroke();
    p.fill(255);
    p.text(`m₂=${m2}kg`, c2.x, c2.y);
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
