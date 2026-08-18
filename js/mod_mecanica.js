/**
 * MÓDULO: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Frenagem de Carro no Trânsito & ABS (Segurança Viária)
 * 2. Montanha-Russa, Looping & Conservação de Energia
 * 3. Plano Inclinado com Decomposição Vetorial Completa & Atrito
 * 4. Lançamento de Projéteis & Balística
 * 5. Hidrostática & Empuxo de Arquimedes
 */

/* ==========================================================================
   1. FRENAGEM DE CARRO NO TRÂNSITO & ABS (COTIDIANO / CINEMÁTICA E DINÂMICA)
   ========================================================================== */
const simMecFrenagem = (p) => {
  let speedKmH = 80;
  let reactionTimeSec = 0.75;
  let roadType = "seca"; // "seca" (mu=0.8), "molhada" (mu=0.3)
  let hasABS = true;

  let carX = 40;
  let isBraking = false;
  let hasStopped = false;
  let currentSpeed = 0;
  let phase = "idle"; // "idle", "reaction", "braking", "stopped"
  let phaseTimer = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-frenagem");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-frenagem");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const speedSlider = document.getElementById("m-car-speed-slider");
    const roadSelect = document.getElementById("m-car-road-select");
    const absToggle = document.getElementById("m-car-abs-toggle");
    const btnTest = document.getElementById("btn-test-braking");
    const btnReset = document.getElementById("btn-reset-braking");

    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        speedKmH = parseFloat(e.target.value);
        document.getElementById("m-car-speed-val").textContent = `${speedKmH} km/h (${(speedKmH / 3.6).toFixed(1)} m/s)`;
        resetCar();
      });
    }

    if (roadSelect) {
      roadSelect.addEventListener("change", (e) => {
        roadType = e.target.value;
        resetCar();
      });
    }

    if (absToggle) {
      absToggle.addEventListener("change", (e) => {
        hasABS = e.target.checked;
        resetCar();
      });
    }

    if (btnTest) btnTest.addEventListener("click", startBrakingTest);
    if (btnReset) btnReset.addEventListener("click", resetCar);
  }

  function startBrakingTest() {
    resetCar();
    isBraking = true;
    phase = "reaction";
    currentSpeed = speedKmH / 3.6; // m/s
    phaseTimer = 0;
  }

  function resetCar() {
    isBraking = false;
    hasStopped = false;
    carX = 40;
    phase = "idle";
    calculatePhysics();
  }

  function calculatePhysics() {
    const vMS = speedKmH / 3.6;
    let mu = roadType === "seca" ? 0.80 : 0.30;
    if (!hasABS) mu *= 0.75; // sem ABS o pneu trava e derrapa

    const dReaction = vMS * reactionTimeSec;
    const dBraking = (vMS * vMS) / (2 * mu * 10);
    const dTotal = dReaction + dBraking;

    const dReacElem = document.getElementById("m-car-dreac-num");
    const dBrakeElem = document.getElementById("m-car-dbrake-num");
    const dTotalElem = document.getElementById("m-car-dtotal-num");

    if (dReacElem) dReacElem.textContent = `${dReaction.toFixed(1).replace(".", ",")} m`;
    if (dBrakeElem) dBrakeElem.textContent = `${dBraking.toFixed(1).replace(".", ",")} m`;
    if (dTotalElem) dTotalElem.textContent = `${dTotal.toFixed(1).replace(".", ",")} m`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 220;

    // Asfalto da Rodovia
    p.fill(roadType === "seca" ? 40 : 25, roadType === "seca" ? 38 : 30, roadType === "seca" ? 50 : 45);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(0, roadY, p.width, 90);

    // Faixas da Rodovia
    p.stroke(roadType === "seca" ? 255 : 180, roadType === "seca" ? 220 : 200, 100);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([16, 16]);
    p.line(0, roadY + 45, p.width, roadY + 45);
    p.drawingContext.setLineDash([]);

    // Obstáculo à frente (Pedestre / Faixa de Pare)
    const obstacleX = p.width - 70;
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(obstacleX, roadY - 40, 12, 40, 2);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("PARE", obstacleX + 6, roadY - 45);

    // Dinâmica de Frenagem
    if (isBraking && !hasStopped) {
      let mu = roadType === "seca" ? 0.80 : 0.30;
      if (!hasABS) mu *= 0.75;
      const decel = mu * 10; // m/s^2

      phaseTimer += 1 / 60;

      if (phase === "reaction") {
        carX += currentSpeed * 0.45;
        if (phaseTimer >= reactionTimeSec) {
          phase = "braking";
        }
      } else if (phase === "braking") {
        currentSpeed = Math.max(0, currentSpeed - decel * (1 / 60));
        carX += currentSpeed * 0.45;
        if (currentSpeed <= 0) {
          hasStopped = true;
          phase = "stopped";
        }
      }
    }

    // Desenho do Carro
    drawCar(carX, roadY);

    // Indicador de Fase
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    if (phase === "reaction") {
      p.fill(255, 220, 100);
      p.text("⚠️ Percepção & Tempo de Reação do Motorista (0,75s)...", 30, 30);
    } else if (phase === "braking") {
      p.fill(200, 67, 93);
      p.text(hasABS ? "🛑 Frenagem Ativa com Sistema ABS (Atrito Máximo)" : "🛑 Pneus Travados (Derrapagem sem ABS)!", 30, 30);
    } else if (phase === "stopped") {
      p.fill(46, 139, 87);
      p.text(`✓ Veículo Imobilizado com Sucesso a ${(carX * 0.25).toFixed(1)} m`, 30, 30);
    } else {
      p.fill(201, 174, 222);
      p.text("Clique em 'Iniciar Teste de Frenagem' para simular a parada", 30, 30);
    }
  };

  function drawCar(x, y) {
    p.push();
    p.translate(x, y);

    // Sombra
    p.noStroke();
    p.fill(10, 10, 15, 150);
    p.ellipse(0, -2, 70, 14);

    // Chassi
    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(-30, -24, 60, 20, 4);

    // Cabine
    p.fill(100, 160, 240);
    p.rect(-15, -36, 34, 14, 3);

    // Rodas
    p.fill(20);
    p.stroke(140);
    p.strokeWeight(2);
    p.ellipse(-18, -4, 14, 14);
    p.ellipse(18, -4, 14, 14);

    // Luz de freio acesa durante frenagem
    if (phase === "braking") {
      p.noStroke();
      p.fill(255, 40, 40, 220);
      p.ellipse(-30, -18, 10, 10);
    }
    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-frenagem");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      resetCar();
    }
  };
};

/* ==========================================================================
   2. MONTANHA-RUSSA & LOOPING CIRCULAR (ENERGIA MECÂNICA & FORÇA CENTRÍPETA)
   ========================================================================== */
const simMecMontanhaRussa = (p) => {
  let initialHeightH = 40; // metros
  let loopRadiusR = 12;   // metros
  const g = 10;

  let cartPos = 0; // 0 (topo da rampa) a 1 (fim)
  let isRunning = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-looping");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-looping");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const hSlider = document.getElementById("m-loop-h-slider");
    const rSlider = document.getElementById("m-loop-r-slider");
    const btnLaunch = document.getElementById("btn-launch-coaster");
    const btnReset = document.getElementById("btn-reset-coaster");

    if (hSlider) {
      hSlider.addEventListener("input", (e) => {
        initialHeightH = parseFloat(e.target.value);
        document.getElementById("m-loop-h-val").textContent = `${initialHeightH} m`;
        resetCoaster();
      });
    }

    if (rSlider) {
      rSlider.addEventListener("input", (e) => {
        loopRadiusR = parseFloat(e.target.value);
        document.getElementById("m-loop-r-val").textContent = `${loopRadiusR} m`;
        resetCoaster();
      });
    }

    if (btnLaunch) btnLaunch.addEventListener("click", () => { isRunning = true; });
    if (btnReset) btnReset.addEventListener("click", resetCoaster);
  }

  function resetCoaster() {
    isRunning = false;
    cartPos = 0;
    calculatePhysics();
  }

  function calculatePhysics() {
    const hMin = 2.5 * loopRadiusR; // Altura mínima para não cair no topo
    const vBottom = Math.sqrt(2 * g * initialHeightH);
    const vTopSquare = 2 * g * (initialHeightH - 2 * loopRadiusR);
    const vTop = vTopSquare > 0 ? Math.sqrt(vTopSquare) : 0;
    const canComplete = initialHeightH >= hMin;

    const vBotElem = document.getElementById("m-loop-vbot-num");
    const vTopElem = document.getElementById("m-loop-vtop-num");
    const statusElem = document.getElementById("m-loop-status-text");

    if (vBotElem) vBotElem.textContent = `${vBottom.toFixed(1).replace(".", ",")} m/s (${(vBottom * 3.6).toFixed(0)} km/h)`;
    if (vTopElem) vTopElem.textContent = vTop > 0 ? `${vTop.toFixed(1).replace(".", ",")} m/s` : "0 m/s (Cai antes)";
    if (statusElem) {
      if (canComplete) {
        statusElem.textContent = `Looping Seguro (H ≥ 2,5R = ${hMin.toFixed(1)} m)`;
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = `Perigo: Não completa o topo (H < 2,5R = ${hMin.toFixed(1)} m)`;
        statusElem.style.color = "#c8435d";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const groundY = p.height - 40;
    const loopCenterX = p.width * 0.55;
    const loopCenterY = groundY - loopRadiusR * 5;
    const loopRadPx = loopRadiusR * 5;

    // Solo
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(0, groundY, p.width, groundY);

    // Trilho da Montanha-Russa
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.noFill();

    // Rampa inicial
    const rampTopX = 50, rampTopY = groundY - initialHeightH * 4.5;
    p.beginShape();
    p.vertex(rampTopX, rampTopY);
    p.bezierVertex(rampTopX + 80, groundY, loopCenterX - loopRadPx - 40, groundY, loopCenterX - loopRadPx, groundY);
    p.endShape();

    // Círculo do Looping
    p.ellipse(loopCenterX, loopCenterY, loopRadPx * 2, loopRadPx * 2);

    // Trilho de saída
    p.line(loopCenterX + loopRadPx, groundY, p.width - 30, groundY);

    // Carrinho animado
    if (isRunning && cartPos < 1.0) {
      cartPos += 0.008;
    }

    let cx = rampTopX, cy = rampTopY;
    if (cartPos < 0.35) {
      let t = cartPos / 0.35;
      cx = p.lerp(rampTopX, loopCenterX - loopRadPx, t);
      cy = p.lerp(rampTopY, groundY, t);
    } else if (cartPos < 0.85) {
      let t = (cartPos - 0.35) / 0.50;
      let ang = p.PI / 2 + t * p.TWO_PI;
      cx = loopCenterX + loopRadPx * Math.cos(ang);
      cy = loopCenterY + loopRadPx * Math.sin(ang);
    } else {
      let t = (cartPos - 0.85) / 0.15;
      cx = p.lerp(loopCenterX + loopRadPx, p.width - 40, t);
      cy = groundY;
    }

    // Desenho do Carrinho
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(cx - 10, cy - 14, 20, 12, 3);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-looping");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      resetCoaster();
    }
  };
};

/* ==========================================================================
   3. PLANO INCLINADO COM DECOMPOSIÇÃO VETORIAL COMPLETA & ATRITO
   ========================================================================== */
const simMecPlanoInclinado = (p) => {
  let thetaDeg = 30;
  let mu = 0.40;
  let mass = 2.0;
  const g = 10;

  let isSliding = false;
  let blockDist = 0;
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
        if (Px > FatMax) isSliding = true;
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
    const rad = p.radians(thetaDeg);
    const rampOrigin = { x: 70, y: p.height - 50 };
    const rampLength = p.width - 160;
    const rampEnd = {
      x: rampOrigin.x + rampLength * Math.cos(rad),
      y: rampOrigin.y - rampLength * Math.sin(rad)
    };

    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(0, rampOrigin.y, p.width, rampOrigin.y);

    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2.5);
    p.triangle(rampOrigin.x, rampOrigin.y, rampEnd.x, rampOrigin.y, rampEnd.x, rampEnd.y);

    p.noFill();
    p.stroke(201, 174, 222);
    p.strokeWeight(1.5);
    p.arc(rampEnd.x, rampOrigin.y, 60, 60, p.PI, p.PI + rad);
    p.noStroke();
    p.fill(201, 174, 222);
    p.textSize(11);
    p.text(`${thetaDeg}°`, rampEnd.x - 45, rampOrigin.y - 10);

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

    const currentDist = 60 + blockDist;
    const bx = rampEnd.x - currentDist * Math.cos(rad);
    const by = rampEnd.y + currentDist * Math.sin(rad);

    p.push();
    p.translate(bx, by);
    p.rotate(-rad);

    p.fill(201, 174, 222);
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(-25, -40, 50, 40, 4);

    p.noStroke();
    p.fill(20, 15, 30);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${mass.toFixed(1)}kg`, 0, -20);

    // Vetores de Força
    const P = mass * g;
    const Px = P * Math.sin(rad);
    const Py = P * Math.cos(rad);
    const N = Py;
    const Fat = Math.min(Px, mu * N);

    p.stroke(100, 200, 255);
    p.strokeWeight(2.5);
    p.line(0, -20, 0, -20 - N * 2.5);
    p.fill(100, 200, 255);
    p.noStroke();
    p.triangle(0, -20 - N * 2.5 - 6, -4, -20 - N * 2.5, 4, -20 - N * 2.5);
    p.textSize(9);
    p.text("N", 10, -20 - N * 2.5);

    p.stroke(255, 220, 80);
    p.strokeWeight(2.5);
    p.line(0, -20, -Px * 2.8, -20);
    p.fill(255, 220, 80);
    p.noStroke();
    p.triangle(-Px * 2.8 - 6, -20, -Px * 2.8, -24, -Px * 2.8, -16);
    p.text("Px", -Px * 2.8 - 12, -20);

    p.stroke(46, 139, 87);
    p.strokeWeight(2.5);
    p.line(0, -20, Fat * 2.8, -20);
    p.fill(46, 139, 87);
    p.noStroke();
    p.triangle(Fat * 2.8 + 6, -20, Fat * 2.8, -24, Fat * 2.8, -16);
    p.text("Fat", Fat * 2.8 + 14, -20);

    p.pop();
  };

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
   4. LANÇAMENTO BALÍSTICO
   ========================================================================== */
const simMecLancamento = (p) => {
  let angleDeg = 45;
  let v0 = 20;
  let g = 10;
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
    const btnFire = document.getElementById("btn-fire-cannon");
    if (angleSlider) angleSlider.addEventListener("input", (e) => { angleDeg = parseFloat(e.target.value); calculatePhysics(); });
    if (v0Slider) v0Slider.addEventListener("input", (e) => { v0 = parseFloat(e.target.value); calculatePhysics(); });
    if (btnFire) btnFire.addEventListener("click", fireCannon);
  }

  function fireCannon() {
    trajectoryPath = [];
    const rad = p.radians(angleDeg);
    projectile = { x: cannonPos.x, y: cannonPos.y, vx: v0 * Math.cos(rad) * 0.55, vy: -v0 * Math.sin(rad) * 0.55 };
  }

  function calculatePhysics() {
    const rad = p.radians(angleDeg);
    const range = (v0 * v0 * Math.sin(2 * rad)) / g;
    const hMax = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * g);
    const rangeElem = document.getElementById("m1-range-num");
    const hmaxElem = document.getElementById("m1-hmax-num");
    if (rangeElem) rangeElem.textContent = `${range.toFixed(1).replace(".", ",")} m`;
    if (hmaxElem) hmaxElem.textContent = `${hMax.toFixed(1).replace(".", ",")} m`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    p.stroke(80, 70, 95);
    p.line(0, p.height - 40, p.width, p.height - 40);

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
      if (projectile.y >= cannonPos.y) projectile = null;
    }

    // Canhão
    p.push();
    p.translate(cannonPos.x, cannonPos.y);
    p.rotate(-p.radians(angleDeg));
    p.fill(90, 78, 110);
    p.rect(0, -7, 34, 14, 2);
    p.pop();
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-lancamento");
    if (wrap) {
      p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
      cannonPos.y = p.height - 45;
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-mec-frenagem")) new p5(simMecFrenagem);
  if (document.getElementById("canvas-mec-looping")) new p5(simMecMontanhaRussa);
  if (document.getElementById("canvas-mec-plano")) new p5(simMecPlanoInclinado);
  if (document.getElementById("canvas-mec-lancamento")) new p5(simMecLancamento);
});
