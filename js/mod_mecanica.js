/**
 * MÓDULO: MECÂNICA CLÁSSICA — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Frenagem de Carro no Trânsito & ABS Realista (com Chuva, Pneus, Fumaça e Faróis)
 * 2. Montanha-Russa do Parque com Passageiros & Gráfico de Energia ao Vivo
 * 3. Elevador Panorâmico & Balança de Banheiro (Sensação de Peso Aparente)
 * 4. Plano Inclinado com Decomposição Vetorial Completa & Atrito
 */

/* ==========================================================================
   1. FRENAGEM NO TRÂNSITO & ABS REALISTA (COTIDIANO)
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
  let wheelAngle = 0;

  let skidMarks = [];
  let smokeParticles = [];
  let rainDrops = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-frenagem");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
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
    // Céu e Iluminação Ambiente
    p.background(roadType === "molhada" ? 12 : 20, roadType === "molhada" ? 14 : 18, roadType === "molhada" ? 24 : 32);
    const roadY = 230;

    // Chuva animada se pista molhada
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

    // Pista de Asfalto com Textura
    p.fill(roadType === "seca" ? 35 : 20, roadType === "seca" ? 32 : 24, roadType === "seca" ? 44 : 38);
    p.noStroke();
    p.rect(0, roadY, p.width, 95);

    // Faixa Branca Contínua no Acostamento
    p.stroke(220, 220, 240, 180);
    p.strokeWeight(3);
    p.line(0, roadY + 5, p.width, roadY + 5);
    p.line(0, roadY + 90, p.width, roadY + 90);

    // Faixas Centrais Tracejadas
    p.stroke(255, 215, 0, roadType === "molhada" ? 140 : 220);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([20, 16]);
    p.line(0, roadY + 45, p.width, roadY + 45);
    p.drawingContext.setLineDash([]);

    // Marcas de Pneu no Asfalto (Skid Marks)
    p.stroke(10, 10, 15, 160);
    p.strokeWeight(hasABS ? 2 : 5);
    skidMarks.forEach(mk => {
      p.line(mk.x1, mk.y, mk.x2, mk.y);
      p.line(mk.x1, mk.y + 18, mk.x2, mk.y + 18);
    });

    // Faixa de Pedestres & Placa PARE no destino
    const stopLineX = p.width - 90;
    p.fill(255, 255, 255, 200);
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      p.rect(stopLineX + i * 14, roadY + 12, 8, 70);
    }

    // Poste com Semáforo / Placa
    p.fill(60, 55, 75);
    p.rect(stopLineX + 75, roadY - 80, 8, 80);
    p.fill(20, 20, 25);
    p.stroke(140, 103, 168);
    p.strokeWeight(1.5);
    p.rect(stopLineX + 67, roadY - 115, 24, 45, 4);
    // Luz Vermelha do Semáforo
    p.noStroke();
    p.fill(255, 40, 40);
    p.ellipse(stopLineX + 79, roadY - 100, 12, 12);
    p.fill(255, 40, 40, 60);
    p.ellipse(stopLineX + 79, roadY - 100, 24, 24);

    // Dinâmica de Movimento
    if (isBraking && !hasStopped) {
      let mu = roadType === "seca" ? 0.80 : 0.30;
      if (!hasABS) mu *= 0.75;
      const decel = mu * 10;

      phaseTimer += 1 / 60;

      if (phase === "reaction") {
        carX += currentSpeed * 0.45;
        wheelAngle += currentSpeed * 0.12;
        if (phaseTimer >= reactionTimeSec) phase = "braking";
      } else if (phase === "braking") {
        let prevCarX = carX;
        currentSpeed = Math.max(0, currentSpeed - decel * (1 / 60));
        carX += currentSpeed * 0.45;
        if (hasABS) wheelAngle += currentSpeed * 0.08;

        // Registrar marca de pneu e fumaça se sem ABS
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

    // Desenho Realista do Carro Sedan
    drawDetailedSedan(carX, roadY + 36);

    // Mensagens de Estado e Painel Superior
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    if (phase === "reaction") {
      p.fill(255, 220, 100);
      p.text(`⚠️ Tempo de Reação do Condutor (${reactionTimeSec}s) — Veículo percorrendo em MRU...`, 30, 20);
    } else if (phase === "braking") {
      p.fill(200, 67, 93);
      p.text(hasABS ? "🛑 ABS Ativo: Modulação hidráulica de frenagem (Atrito Máximo sem travar rodas)" : "🛑 Pneus Travados Derrapando (Atrito Cinético Reduzido e Perda de Controle)!", 30, 20);
    } else if (phase === "stopped") {
      p.fill(46, 139, 87);
      p.text(`✓ Veículo Totalmente Imobilizado! Parada Segura a ${(carX * 0.22).toFixed(1)} m`, 30, 20);
    } else {
      p.fill(201, 174, 222);
      p.text("Clique em 'Iniciar Teste de Frenagem' para acionar o motorista e os freios", 30, 20);
    }
  };

  function drawDetailedSedan(x, y) {
    p.push();
    p.translate(x, y);

    // Sombra do Veículo no Asfalto
    p.noStroke();
    p.fill(10, 10, 15, 180);
    p.ellipse(0, 4, 95, 16);

    // Facho de Luz dos Faróis de LED dianteiros
    p.fill(255, 255, 200, 60);
    p.noStroke();
    p.triangle(45, -12, 180, -35, 180, 15);

    // Carroceria Inferior (Chassi)
    p.fill(45, 95, 175); // Azul metálico
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
    p.bezierVertex(36, -18, 16, -18, 16, -4); // Cava da roda dianteira
    p.vertex(-16, -4);
    p.bezierVertex(-16, -18, -36, -18, -36, -4); // Cava da roda traseira
    p.endShape(p.CLOSE);

    // Cabine Superior & Teto
    p.fill(35, 75, 145);
    p.beginShape();
    p.vertex(-22, -22);
    p.vertex(-14, -38);
    p.vertex(14, -38);
    p.vertex(26, -22);
    p.endShape(p.CLOSE);

    // Vidros Fumê (Dianteiro, Traseiro e Lateral)
    p.fill(160, 210, 255, 160);
    p.stroke(25, 50, 100);
    p.strokeWeight(1);
    p.quad(-12, -36, 12, -36, 23, -24, -18, -24);

    // Silhueta do Motorista
    p.fill(20, 20, 30);
    p.ellipse(-2, -30, 8, 8);

    // Lanterna Traseira (Freio)
    p.fill(phase === "braking" ? p.color(255, 20, 20) : p.color(140, 20, 20));
    p.noStroke();
    p.rect(-44, -17, 5, 8, 2);
    if (phase === "braking") {
      p.fill(255, 0, 0, 120);
      p.ellipse(-44, -13, 20, 20); // Brilho do freio
    }

    // Farol Dianteiro de LED
    p.fill(255, 255, 230);
    p.rect(39, -15, 5, 7, 2);

    // Rodas Realistas com Rotação
    drawWheel(-26, -4, wheelAngle);
    drawWheel(26, -4, wheelAngle);

    p.pop();
  }

  function drawWheel(wx, wy, ang) {
    p.push();
    p.translate(wx, wy);
    // Pneu de Borracha
    p.fill(25, 25, 30);
    p.stroke(10);
    p.strokeWeight(1.5);
    p.ellipse(0, 0, 18, 18);
    // Calota / Liga Leve
    p.fill(180, 185, 195);
    p.stroke(100);
    p.ellipse(0, 0, 11, 11);
    // Raios da Roda girando
    p.rotate(ang);
    p.stroke(40);
    p.strokeWeight(1.5);
    p.line(-4, 0, 4, 0);
    p.line(0, -4, 0, 4);
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
   2. MONTANHA-RUSSA REALISTA COM PASSAGEIROS & ENERGIA (COTIDIANO)
   ========================================================================== */
const simMecMontanhaRussa = (p) => {
  let initialHeightH = 40; // metros
  let loopRadiusR = 12;   // metros
  const g = 10;

  let cartProgress = 0; // 0 a 1
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
    cartProgress = 0;
    calculatePhysics();
  }

  function calculatePhysics() {
    const hMin = 2.5 * loopRadiusR;
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
      statusElem.textContent = canComplete ? `Looping Seguro (H ≥ 2,5R = ${hMin.toFixed(1)} m)` : `Perigo: Queda no topo (H < 2,5R = ${hMin.toFixed(1)} m)`;
      statusElem.style.color = canComplete ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const groundY = p.height - 45;
    const loopCenterX = p.width * 0.56;
    const loopCenterY = groundY - loopRadiusR * 5.2;
    const loopRadPx = loopRadiusR * 5.2;

    // Estrutura de Treliças Metálicas da Montanha-Russa
    p.stroke(70, 60, 85, 120);
    p.strokeWeight(1);
    for (let tx = 40; tx < p.width - 40; tx += 28) {
      p.line(tx, groundY, tx, groundY - 80);
      p.line(tx, groundY, tx + 14, groundY - 40);
    }

    // Trilhos Tubulares Duplos
    p.stroke(201, 174, 222);
    p.strokeWeight(3.5);
    p.noFill();

    const rampTopX = 45, rampTopY = groundY - initialHeightH * 4.6;
    p.beginShape();
    p.vertex(rampTopX, rampTopY);
    p.bezierVertex(rampTopX + 80, groundY, loopCenterX - loopRadPx - 30, groundY, loopCenterX - loopRadPx, groundY);
    p.endShape();

    // Círculo do Looping com Efeito 3D
    p.stroke(140, 103, 168);
    p.ellipse(loopCenterX, loopCenterY, loopRadPx * 2, loopRadPx * 2);

    // Trilho de Saída
    p.line(loopCenterX + loopRadPx, groundY, p.width - 25, groundY);

    // Dinâmica do Carrinho
    if (isRunning && cartProgress < 1.0) {
      cartProgress += 0.007;
    }

    let cx = rampTopX, cy = rampTopY, cartAngle = 0;
    if (cartProgress < 0.35) {
      let t = cartProgress / 0.35;
      cx = p.lerp(rampTopX, loopCenterX - loopRadPx, t);
      cy = p.lerp(rampTopY, groundY, t);
      cartAngle = p.atan2(groundY - rampTopY, (loopCenterX - loopRadPx) - rampTopX);
    } else if (cartProgress < 0.85) {
      let t = (cartProgress - 0.35) / 0.50;
      let ang = p.PI / 2 + t * p.TWO_PI;
      cx = loopCenterX + loopRadPx * Math.cos(ang);
      cy = loopCenterY + loopRadPx * Math.sin(ang);
      cartAngle = ang + p.PI / 2;
    } else {
      let t = (cartProgress - 0.85) / 0.15;
      cx = p.lerp(loopCenterX + loopRadPx, p.width - 35, t);
      cy = groundY;
      cartAngle = 0;
    }

    // Desenho Realista do Carrinho com 2 Passageiros
    drawCoasterCart(cx, cy, cartAngle);

    // Gráfico de Barras de Energia Mecânica (Ec + Ep)
    drawLiveEnergyBars(groundY, cy);
  };

  function drawCoasterCart(x, y, ang) {
    p.push();
    p.translate(x, y);
    p.rotate(ang);

    // Chassi do Carrinho
    p.fill(220, 60, 80);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(-16, -14, 32, 14, 4);

    // Rodas que agarram o trilho
    p.fill(30);
    p.ellipse(-10, 0, 8, 8);
    p.ellipse(10, 0, 8, 8);

    // 2 Passageiros com braços para cima
    p.fill(240, 190, 160); // Cabeças
    p.ellipse(-6, -20, 7, 7);
    p.ellipse(6, -20, 7, 7);

    // Braços comemorando
    p.stroke(240, 190, 160);
    p.strokeWeight(2);
    p.line(-6, -20, -10, -28);
    p.line(6, -20, 10, -28);

    p.pop();
  }

  function drawLiveEnergyBars(groundY, currentCartY) {
    const curH = Math.max(0, (groundY - currentCartY) / 4.6);
    const Ep = curH;
    const Ec = Math.max(0, initialHeightH - curH);

    const bx = 30, by = 40;
    p.fill(20, 16, 28, 200);
    p.stroke(140, 103, 168);
    p.rect(bx, by, 160, 60, 6);

    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Conservação da Energia Mecânica", bx + 8, by + 6);

    // Barra de Energia Potencial Ep (Azul)
    p.fill(59, 108, 181);
    p.rect(bx + 8, by + 24, p.map(Ep, 0, 60, 0, 140), 10, 2);
    p.fill(255);
    p.textSize(8);
    p.text(`Ep = ${Ep.toFixed(0)}%`, bx + 10, by + 25);

    // Barra de Energia Cinética Ec (Vermelha)
    p.fill(200, 67, 93);
    p.rect(bx + 8, by + 40, p.map(Ec, 0, 60, 0, 140), 10, 2);
    p.fill(255);
    p.text(`Ec = ${Ec.toFixed(0)}%`, bx + 10, by + 41);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-looping");
    if (wrap) {
      p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
      resetCoaster();
    }
  };
};

/* ==========================================================================
   3. ELEVADOR PANORÂMICO & BALANÇA DE BANHEIRO (COTIDIANO)
   ========================================================================== */
const simMecElevador = (p) => {
  let personMassKg = 60;
  let elevatorAccel = 2.0; // m/s^2 (+ para cima, - para baixo)
  let elevatorState = "acelera_cima"; // "repouso", "acelera_cima", "acelera_baixo", "queda_livre"
  const g = 10;

  p.setup = () => {
    const wrap = document.getElementById("canvas-mec-elevador");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-mec-elevador");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const stateSelect = document.getElementById("m-elev-state-select");
    const mSlider = document.getElementById("m-elev-mass-slider");

    if (stateSelect) {
      stateSelect.addEventListener("change", (e) => {
        elevatorState = e.target.value;
        calculatePhysics();
      });
    }

    if (mSlider) {
      mSlider.addEventListener("input", (e) => {
        personMassKg = parseFloat(e.target.value);
        document.getElementById("m-elev-mass-val").textContent = `${personMassKg} kg`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    let a = 0;
    if (elevatorState === "acelera_cima") a = 2.0;
    else if (elevatorState === "acelera_baixo") a = -2.0;
    else if (elevatorState === "queda_livre") a = -10.0;

    const normalN = Math.max(0, personMassKg * (g + a));
    const scaleReadKg = normalN / g;

    const realWeightElem = document.getElementById("m-elev-preal-num");
    const normalElem = document.getElementById("m-elev-norm-num");
    const feelingElem = document.getElementById("m-elev-feel-text");

    if (realWeightElem) realWeightElem.textContent = `${(personMassKg * g).toFixed(0)} N`;
    if (normalElem) normalElem.textContent = `${normalN.toFixed(0)} N (${scaleReadKg.toFixed(1)} kgf)`;
    if (feelingElem) {
      if (elevatorState === "acelera_cima") {
        feelingElem.textContent = "Sensação de maior peso (Pessoa pressionada contra o chão)";
        feelingElem.style.color = "#2e8b57";
      } else if (elevatorState === "acelera_baixo") {
        feelingElem.textContent = "Sensação de leveza (Frio na barriga)";
        feelingElem.style.color = "#cba36b";
      } else if (elevatorState === "queda_livre") {
        feelingElem.textContent = "Imponderabilidade Total (Gravidade Aparente Nula = 0 N)";
        feelingElem.style.color = "#c8435d";
      } else {
        feelingElem.textContent = "Peso Normal (N = P)";
        feelingElem.style.color = "#8c7e99";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = 180;
    const elevW = 150, elevH = 190;

    // Cabos do Elevador
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.line(cx - 50, 0, cx - 50, cy - elevH / 2);
    p.line(cx + 50, 0, cx + 50, cy - elevH / 2);

    // Cabine do Elevador de Vidro
    p.fill(35, 40, 60, 180);
    p.stroke(180, 210, 255);
    p.strokeWeight(2.5);
    p.rect(cx - elevW / 2, cy - elevH / 2, elevW, elevH, 8);

    // Piso e Teto Metálicos
    p.fill(80, 75, 95);
    p.rect(cx - elevW / 2, cy + elevH / 2 - 14, elevW, 14, 0, 0, 6, 6);
    p.rect(cx - elevW / 2, cy - elevH / 2, elevW, 14, 6, 6, 0, 0);

    // Balança de Banheiro Digital no Piso
    const scaleY = cy + elevH / 2 - 14;
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(cx - 25, scaleY - 8, 50, 8, 2);

    // Display da Balança
    let a = elevatorState === "acelera_cima" ? 2.0 : elevatorState === "acelera_baixo" ? -2.0 : elevatorState === "queda_livre" ? -10.0 : 0;
    let normalN = Math.max(0, personMassKg * (g + a));
    p.noStroke();
    p.fill(255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${normalN.toFixed(0)} N`, cx, scaleY - 4);

    // Pessoa em Cima da Balança
    const personY = scaleY - 8;
    // Pernas
    p.stroke(40, 50, 80);
    p.strokeWeight(4);
    p.line(cx - 6, personY, cx - 6, personY - 35);
    p.line(cx + 6, personY, cx + 6, personY - 35);
    // Tronco
    p.stroke(59, 108, 181);
    p.strokeWeight(12);
    p.line(cx, personY - 35, cx, personY - 70);
    // Cabeça
    p.noStroke();
    p.fill(240, 190, 160);
    p.ellipse(cx, personY - 82, 16, 16);

    // Vetores de Força (Normal para cima, Peso para baixo)
    drawForceVector(cx + 40, personY - 40, 0, -normalN * 0.08, p.color(46, 139, 87), "N (Normal)");
    drawForceVector(cx - 40, personY - 40, 0, (personMassKg * g) * 0.08, p.color(200, 67, 93), "P (Peso)");
  };

  function drawForceVector(x, y, vx, vy, col, label) {
    if (Math.abs(vy) < 2) return;
    p.stroke(col);
    p.strokeWeight(2.5);
    p.line(x, y, x + vx, y + vy);
    p.fill(col);
    p.noStroke();
    let dir = vy < 0 ? -1 : 1;
    p.triangle(x + vx, y + vy, x + vx - 4, y + vy - dir * 8, x + vx + 4, y + vy - dir * 8);
    p.textSize(9);
    p.textAlign(p.CENTER, dir < 0 ? p.BOTTOM : p.TOP);
    p.text(label, x + vx, y + vy + dir * 4);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-mec-elevador");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   4. PLANO INCLINADO COM DECOMPOSIÇÃO VETORIAL
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
      statusElem.textContent = Px <= FatMax ? "Equilíbrio Estático (Px ≤ Fat)" : `Deslizando com a = ${accel.toFixed(2)} m/s²`;
      statusElem.style.color = Px <= FatMax ? "#2e8b57" : "#c8435d";
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
      p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
      resetBlock();
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-mec-frenagem")) new p5(simMecFrenagem);
  if (document.getElementById("canvas-mec-looping")) new p5(simMecMontanhaRussa);
  if (document.getElementById("canvas-mec-elevador")) new p5(simMecElevador);
  if (document.getElementById("canvas-mec-plano")) new p5(simMecPlanoInclinado);
});
