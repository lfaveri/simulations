/**
 * MÓDULO: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Salto de Paraquedas, Força de Arrasto & Velocidade Terminal
 * 2. Frenagem no Trânsito & Sistema ABS na Chuva
 */

/* ==========================================================================
   1. SALTO DE PARAQUEDAS & VELOCIDADE TERMINAL (COTIDIANO)
   ========================================================================== */
const simMecParaquedas = (p) => {
  let isParachuteOpen = false;
  let skydiverAltitudeM = 3000;
  let skydiverSpeedMS = 0;
  let massKg = 80;
  const g = 9.8;
  let touchDownTimer = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-paraquedas");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-paraquedas");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const chuteToggle = document.getElementById("m-chute-open-toggle");
    const btnReset = document.getElementById("btn-reset-skydive");
    const massSlider = document.getElementById("m-chute-mass-slider");

    if (chuteToggle) {
      chuteToggle.addEventListener("change", (e) => {
        isParachuteOpen = e.target.checked;
        calculatePhysics();
      });
    }

    if (massSlider) {
      massSlider.addEventListener("input", (e) => {
        massKg = parseFloat(e.target.value);
        const massVal = document.getElementById("m-chute-mass-val");
        if (massVal) massVal.textContent = `${massKg} kg`;
        calculatePhysics();
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", resetSkydive);
    }
  }

  function resetSkydive() {
    skydiverAltitudeM = 3000;
    skydiverSpeedMS = 0;
    touchDownTimer = 0;
    const chuteToggle = document.getElementById("m-chute-open-toggle");
    if (chuteToggle) {
      isParachuteOpen = chuteToggle.checked;
    }
    calculatePhysics();
  }

  function calculatePhysics() {
    const area = isParachuteOpen ? 35.0 : 0.6;
    const cd = isParachuteOpen ? 1.4 : 0.8;
    const rho = 1.2;
    const vTermMS = Math.sqrt((2 * massKg * g) / (rho * cd * area));
    const vTermKmH = vTermMS * 3.6;

    const vTermElem = document.getElementById("m-chute-vterm-num");
    const statusElem = document.getElementById("m-chute-status-text");

    if (vTermElem) vTermElem.textContent = `${vTermMS.toFixed(1).replace(".", ",")} m/s (${vTermKmH.toFixed(0)} km/h)`;
    if (statusElem) {
      if (skydiverAltitudeM <= 0) {
        statusElem.textContent = isParachuteOpen ? "✓ Pouso Perfeito e Suave no Solo!" : "⚠️ Pouso Crítico (Sem Paraquedas!)";
        statusElem.style.color = isParachuteOpen ? "#2e8b57" : "#c8435d";
      } else {
        statusElem.textContent = isParachuteOpen ? "Paraquedas Aberto: Desaceleração para ~18 km/h" : "Queda Livre Extrema: Atingindo ~194 km/h";
        statusElem.style.color = isParachuteOpen ? "#2e8b57" : "#cba36b";
      }
    }
  }

  p.draw = () => {
    p.background(14, 18, 30);
    const w = p.width, h = p.height;

    // Dinâmica da Queda com Resistência Aerodinâmica (Arrasto = 0.5 * rho * Cd * A * v^2)
    const area = isParachuteOpen ? 35.0 : 0.6;
    const cd = isParachuteOpen ? 1.4 : 0.8;
    const rho = 1.2;
    const dragForce = 0.5 * rho * cd * area * (skydiverSpeedMS * skydiverSpeedMS);
    const weightForce = massKg * g;
    const netForce = weightForce - dragForce;
    const accel = netForce / massKg;

    if (skydiverAltitudeM > 0) {
      skydiverSpeedMS = Math.max(0, skydiverSpeedMS + accel * (1 / 60));
      skydiverAltitudeM = Math.max(0, skydiverAltitudeM - skydiverSpeedMS * (1 / 60) * 10);
    } else {
      skydiverSpeedMS = 0;
      touchDownTimer += 1 / 60;
      if (touchDownTimer > 3.5) {
        resetSkydive(); // Reinicia suavemente após 3.5 segundos no solo
      }
    }

    const curKmH = skydiverSpeedMS * 3.6;
    const vCurElem = document.getElementById("m-chute-vcur-num");
    if (vCurElem) vCurElem.textContent = `${skydiverSpeedMS.toFixed(1).replace(".", ",")} m/s (${curKmH.toFixed(0)} km/h)`;

    // Céu com Linhas de Velocidade e Nuvens
    p.stroke(255, 255, 255, p.map(skydiverSpeedMS, 0, 60, 20, 120));
    p.strokeWeight(1.5);
    for (let i = 0; i < 10; i++) {
      let ny = ((p.frameCount * Math.max(3, skydiverSpeedMS * 0.5) + i * 40) % h);
      let nx = (i * 70 + 25) % w;
      p.line(nx, ny, nx, ny + p.map(skydiverSpeedMS, 0, 60, 6, 25));
    }

    // Paraquedista Ilustrado no Centro
    const skydiverX = w * 0.5, skydiverY = 190;
    drawDetailedSkydiver(skydiverX, skydiverY, isParachuteOpen);

    // Painel de Altímetro & Forças
    p.fill(20, 16, 28, 220);
    p.stroke(140, 103, 168);
    p.strokeWeight(1.5);
    p.rect(20, 20, 180, 85, 6);

    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Altitude: ${skydiverAltitudeM.toFixed(0)} m`, 30, 30);
    p.text(`Peso P = ${weightForce.toFixed(0)} N`, 30, 48);
    p.text(`Arrasto F_arr = ${dragForce.toFixed(0)} N`, 30, 66);
    p.text(`Aceleração a = ${accel.toFixed(2)} m/s²`, 30, 84);
  };

  function drawDetailedSkydiver(x, y, hasChute) {
    p.push();
    p.translate(x, y);

    if (hasChute) {
      // Copa do Paraquedas
      p.fill(240, 60, 80);
      p.stroke(255);
      p.strokeWeight(2);
      p.arc(0, -85, 140, 80, p.PI, p.TWO_PI);

      // Gomos coloridos da copa
      p.fill(255, 220, 80);
      p.arc(0, -85, 60, 80, p.PI, p.TWO_PI);

      // Cordas do Paraquedas
      p.stroke(220, 220, 240, 200);
      p.strokeWeight(1.2);
      for (let ox of [-60, -30, 0, 30, 60]) {
        p.line(ox, -85, 0, -22);
      }
    }

    // Corpo do Paraquedista
    p.fill(50, 100, 180);
    p.stroke(20);
    p.strokeWeight(1.5);
    p.ellipse(0, -8, 14, 28);

    // Cabeça com Capacete
    p.fill(240, 180, 50);
    p.ellipse(0, -26, 12, 12);
    p.fill(30);
    p.rect(-4, -28, 8, 4, 1);

    // Braços e Pernas
    p.stroke(50, 100, 180);
    p.strokeWeight(3.5);
    p.line(0, -16, -16, -8);
    p.line(0, -16, 16, -8);
    p.line(0, 4, -12, 20);
    p.line(0, 4, 12, 20);

    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-paraquedas");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. FRENAGEM NO TRÂNSITO & ABS REALISTA (COTIDIANO)
   ========================================================================== */
const simMecFrenagem = (p) => {
  let speedKmH = 80;
  let reactionTimeSec = 0.75;
  let roadType = "seca";
  let hasABS = true;

  let carX = 40;
  let isBraking = false;
  let hasStopped = false;
  let currentSpeed = 0;
  let phase = "idle";
  let phaseTimer = 0;
  let wheelAngle = 0;

  let skidMarks = [];
  let smokeParticles = [];
  let rainDrops = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-frenagem");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-frenagem");

    for (let i = 0; i < 60; i++) {
      rainDrops.push({ x: p.random(w), y: p.random(p.height), speed: p.random(8, 14) });
    }

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
        const valElem = document.getElementById("m-car-speed-val");
        if (valElem) valElem.textContent = `${speedKmH} km/h (${(speedKmH / 3.6).toFixed(1)} m/s)`;
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
    currentSpeed = speedKmH / 3.6;
    phaseTimer = 0;
  }

  function resetCar() {
    isBraking = false;
    hasStopped = false;
    carX = 40;
    phase = "idle";
    skidMarks = [];
    smokeParticles = [];
    calculatePhysics();
  }

  function calculatePhysics() {
    const vMS = speedKmH / 3.6;
    let mu = roadType === "seca" ? 0.80 : 0.30;
    if (!hasABS) mu *= 0.75;

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
    p.background(roadType === "molhada" ? 12 : 20, roadType === "molhada" ? 14 : 18, roadType === "molhada" ? 24 : 32);
    const roadY = 230;

    if (roadType === "molhada") {
      p.stroke(140, 180, 255, 120);
      p.strokeWeight(1.2);
      rainDrops.forEach(drop => {
        p.line(drop.x, drop.y, drop.x - 2, drop.y + 10);
        drop.y += drop.speed;
        drop.x -= 1;
        if (drop.y > p.height) { drop.y = 0; drop.x = p.random(p.width); }
      });
    }

    p.fill(roadType === "seca" ? 35 : 20, roadType === "seca" ? 32 : 24, roadType === "seca" ? 44 : 38);
    p.noStroke();
    p.rect(0, roadY, p.width, 95);

    p.stroke(220, 220, 240, 180);
    p.strokeWeight(3);
    p.line(0, roadY + 5, p.width, roadY + 5);
    p.line(0, roadY + 90, p.width, roadY + 90);

    p.stroke(255, 215, 0, roadType === "molhada" ? 140 : 220);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([20, 16]);
    p.line(0, roadY + 45, p.width, roadY + 45);
    p.drawingContext.setLineDash([]);

    p.stroke(10, 10, 15, 160);
    p.strokeWeight(hasABS ? 2 : 5);
    skidMarks.forEach(mk => {
      p.line(mk.x1, mk.y, mk.x2, mk.y);
      p.line(mk.x1, mk.y + 18, mk.x2, mk.y + 18);
    });

    const stopLineX = p.width - 90;
    p.fill(255, 255, 255, 200);
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      p.rect(stopLineX + i * 14, roadY + 12, 8, 70);
    }

    if (isBraking && !hasStopped) {
      let mu = roadType === "seca" ? 0.80 : 0.30;
      if (!hasABS) mu *= 0.75;
      const decel = mu * 10;

      phaseTimer += 1 / 60;

      if (phase === "reaction") {
        carX += currentSpeed * 0.35;
        wheelAngle += currentSpeed * 0.12;
        if (phaseTimer >= reactionTimeSec) phase = "braking";
      } else if (phase === "braking") {
        let prevCarX = carX;
        currentSpeed = Math.max(0, currentSpeed - decel * (1 / 60));
        carX += currentSpeed * 0.35;
        if (hasABS) wheelAngle += currentSpeed * 0.08;

        skidMarks.push({ x1: prevCarX - 25, x2: carX - 25, y: roadY + 32 });
        if (!hasABS && currentSpeed > 2 && p.frameCount % 2 === 0) {
          smokeParticles.push({ x: carX - 28, y: roadY + 36, r: p.random(4, 10), alpha: 200 });
        }

        if (currentSpeed <= 0) {
          hasStopped = true;
          phase = "stopped";
        }
      }
    }

    // Fumaça dos Pneus
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      let smk = smokeParticles[i];
      p.noStroke();
      p.fill(200, 200, 210, smk.alpha);
      p.ellipse(smk.x, smk.y, smk.r, smk.r);
      smk.y -= 0.4;
      smk.x -= 0.6;
      smk.r += 0.5;
      smk.alpha -= 4;
      if (smk.alpha <= 0) smokeParticles.splice(i, 1);
    }

    drawDetailedSedan(carX, roadY + 36);

    // Mensagens de Estado
    p.fill(255);
    p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    if (phase === "reaction") {
      p.fill(255, 220, 100);
      p.text(`⚠️ Tempo de Reação (${reactionTimeSec}s) — Veículo em MRU...`, 25, 20);
    } else if (phase === "braking") {
      p.fill(200, 67, 93);
      p.text(hasABS ? "🛑 ABS Ativo: Modulação hidráulica (Atrito Máximo sem travar rodas)" : "🛑 Pneus Travados Derrapando (Atrito Cinético Reduzido)!", 25, 20);
    } else if (phase === "stopped") {
      p.fill(46, 139, 87);
      p.text(`✓ Veículo Totalmente Imobilizado! Parada Segura a ${(carX * 0.22).toFixed(1)} m`, 25, 20);
    } else {
      p.fill(201, 174, 222);
      p.text("Clique em 'Iniciar Teste de Frenagem' para acionar o motorista", 25, 20);
    }
  };

  function drawDetailedSedan(x, y) {
    p.push();
    p.translate(x, y);

    p.noStroke();
    p.fill(10, 10, 15, 180);
    p.ellipse(0, 4, 95, 16);

    p.fill(255, 255, 200, 60);
    p.triangle(45, -12, 180, -35, 180, 15);

    p.fill(45, 95, 175);
    p.stroke(25, 60, 120);
    p.strokeWeight(1.5);
    p.beginShape();
    p.vertex(-42, -4);
    p.vertex(-44, -14);
    p.vertex(-38, -20);
    p.vertex(-18, -22);
    p.vertex(28, -22);
    p.vertex(42, -14);
    p.vertex(44, -4);
    p.vertex(36, -4);
    p.bezierVertex(36, -18, 16, -18, 16, -4);
    p.vertex(-16, -4);
    p.bezierVertex(-16, -18, -36, -18, -36, -4);
    p.endShape(p.CLOSE);

    p.fill(35, 75, 145);
    p.beginShape();
    p.vertex(-22, -22);
    p.vertex(-14, -38);
    p.vertex(14, -38);
    p.vertex(26, -22);
    p.endShape(p.CLOSE);

    p.fill(160, 210, 255, 160);
    p.stroke(25, 50, 100);
    p.strokeWeight(1);
    p.quad(-12, -36, 12, -36, 23, -24, -18, -24);

    p.fill(20, 20, 30);
    p.ellipse(-2, -30, 8, 8);

    drawWheel(-26, -4, wheelAngle);
    drawWheel(26, -4, wheelAngle);

    p.pop();
  }

  function drawWheel(wx, wy, ang) {
    p.push();
    p.translate(wx, wy);
    p.fill(25, 25, 30);
    p.stroke(10);
    p.strokeWeight(1.5);
    p.ellipse(0, 0, 18, 18);
    p.fill(180, 185, 195);
    p.stroke(100);
    p.ellipse(0, 0, 11, 11);
    p.rotate(ang);
    p.stroke(40);
    p.strokeWeight(1.5);
    p.line(-4, 0, 4, 0);
    p.line(0, -4, 0, 4);
    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-frenagem");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initMecanicaSims() {
  if (document.getElementById("canvas-mec-paraquedas")) new p5(simMecParaquedas);
  if (document.getElementById("canvas-mec-frenagem")) new p5(simMecFrenagem);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMecanicaSims);
} else {
  initMecanicaSims();
}
