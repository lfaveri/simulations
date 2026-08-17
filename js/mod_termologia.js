/**
 * MÓDULO: TERMOLOGIA & TERMODINÂMICA — LABORATÓRIO VIRTUAL COMPLETO
 * 1. Processos de Propagação de Calor (Condução, Convecção e Radiação)
 * 2. Calorimetria & Curva de Mudança de Fase
 * 3. Comportamento dos Gases Ideais & Diagrama PxV
 * 4. Ciclo de Carnot & Máquinas Térmicas
 */

/* ==========================================================================
   1. PROPAGAÇÃO DE CALOR (CONDUÇÃO, CONVECÇÃO E RADIAÇÃO)
   ========================================================================== */
const simTermoPropagacao = (p) => {
  let mode = "conducao"; // "conducao", "conveccao", "radiacao"
  
  // Condução
  let materialK = 390; // Cobre = 390, Alumínio = 205, Ferro = 80, Vidro = 0.8
  let materialName = "Cobre";
  let tempHot = 100; // °C
  let tempCold = 20;  // °C
  let barLength = 0.20; // 20 cm
  let barArea = 0.0004; // 4 cm^2

  // Convecção
  let convectionParticles = [];
  let flamePower = 50; // %

  // Radiação
  let radiationWatts = 500; // W
  let radiationPhotons = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-propagacao");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-propagacao");

    initConvectionParticles();
    initControls();
    updateReadouts();
  };

  function initConvectionParticles() {
    convectionParticles = [];
    const cx = p.width * 0.5;
    for (let i = 0; i < 45; i++) {
      convectionParticles.push({
        x: cx + p.random(-70, 70),
        y: p.random(120, 240),
        vx: p.random(-0.5, 0.5),
        vy: p.random(-0.5, 0.5),
        temp: 20
      });
    }
  }

  function initControls() {
    const btnConducao = document.getElementById("btn-prop-conducao");
    const btnConveccao = document.getElementById("btn-prop-conveccao");
    const btnRadiacao = document.getElementById("btn-prop-radiacao");
    const matSelect = document.getElementById("t-prop-mat-select");
    const tempHotSlider = document.getElementById("t-prop-thot-slider");
    const flameSlider = document.getElementById("t-prop-flame-slider");

    if (btnConducao) {
      btnConducao.addEventListener("click", () => {
        mode = "conducao";
        setActivePropTab("btn-prop-conducao");
        updateControlsVisibility();
        updateReadouts();
      });
    }
    if (btnConveccao) {
      btnConveccao.addEventListener("click", () => {
        mode = "conveccao";
        setActivePropTab("btn-prop-conveccao");
        updateControlsVisibility();
        initConvectionParticles();
        updateReadouts();
      });
    }
    if (btnRadiacao) {
      btnRadiacao.addEventListener("click", () => {
        mode = "radiacao";
        setActivePropTab("btn-prop-radiacao");
        updateControlsVisibility();
        updateReadouts();
      });
    }

    if (matSelect) {
      matSelect.addEventListener("change", (e) => {
        materialK = parseFloat(e.target.value);
        materialName = e.target.options[e.target.selectedIndex].text;
        updateReadouts();
      });
    }

    if (tempHotSlider) {
      tempHotSlider.addEventListener("input", (e) => {
        tempHot = parseFloat(e.target.value);
        const valElem = document.getElementById("t-prop-thot-val");
        if (valElem) valElem.textContent = `${tempHot} °C`;
        updateReadouts();
      });
    }

    if (flameSlider) {
      flameSlider.addEventListener("input", (e) => {
        flamePower = parseFloat(e.target.value);
        const valElem = document.getElementById("t-prop-flame-val");
        if (valElem) valElem.textContent = `${flamePower} %`;
        updateReadouts();
      });
    }
  }

  function setActivePropTab(activeBtnId) {
    ["btn-prop-conducao", "btn-prop-conveccao", "btn-prop-radiacao"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("is-active", id === activeBtnId);
    });
  }

  function updateControlsVisibility() {
    const conducaoControls = document.getElementById("controls-conducao");
    const conveccaoControls = document.getElementById("controls-conveccao");
    const radiacaoControls = document.getElementById("controls-radiacao");

    if (conducaoControls) conducaoControls.style.display = mode === "conducao" ? "grid" : "none";
    if (conveccaoControls) conveccaoControls.style.display = mode === "conveccao" ? "grid" : "none";
    if (radiacaoControls) radiacaoControls.style.display = mode === "radiacao" ? "grid" : "none";
  }

  function updateReadouts() {
    const readout1 = document.getElementById("t-prop-readout-1");
    const readout2 = document.getElementById("t-prop-readout-2");
    const readout3 = document.getElementById("t-prop-readout-3");

    if (mode === "conducao") {
      const deltaT = tempHot - tempCold;
      const fluxWatts = (materialK * barArea * deltaT) / barLength; // Lei de Fourier: Phi = k*A*dT/L
      if (readout1) readout1.textContent = `${fluxWatts.toFixed(1).replace(".", ",")} W (J/s)`;
      if (readout2) readout2.textContent = `${materialK} W/m·K`;
      if (readout3) readout3.textContent = `ΔT = ${deltaT} °C`;
    } else if (mode === "conveccao") {
      if (readout1) readout1.textContent = `Fluido em Circulação`;
      if (readout2) readout2.textContent = `Potência: ${flamePower}%`;
      if (readout3) readout3.textContent = `Δρ Térmico`;
    } else if (mode === "radiacao") {
      if (readout1) readout1.textContent = `Ondas Infravermelhas`;
      if (readout2) readout2.textContent = `Stefan-Boltzmann (T⁴)`;
      if (readout3) readout3.textContent = `Absorção Corpo Negro`;
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    if (mode === "conducao") {
      drawConducao();
    } else if (mode === "conveccao") {
      drawConveccao();
    } else if (mode === "radiacao") {
      drawRadiacao();
    }
  };

  /* --- Renderização da Condução (Lei de Fourier) --- */
  function drawConducao() {
    const barX = 140, barY = 140, barW = p.width - 280, barH = 70;

    // Fonte Quente (Esquerda)
    p.fill(200, 67, 93);
    p.stroke(255, 120, 140);
    p.strokeWeight(2);
    p.rect(barX - 80, barY - 15, 80, barH + 30, 8);
    p.noStroke();
    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`Fonte Quente\n${tempHot}°C`, barX - 40, barY + barH / 2);

    // Fonte Fria (Direita)
    p.fill(59, 108, 181);
    p.stroke(100, 160, 255);
    p.strokeWeight(2);
    p.rect(barX + barW, barY - 15, 80, barH + 30, 8);
    p.noStroke();
    p.fill(255);
    p.text(`Fonte Fria\n${tempCold}°C`, barX + barW + 40, barY + barH / 2);

    // Barra com Gradiente Térmico
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    for (let x = 0; x < barW; x += 4) {
      let tRatio = x / barW;
      let r = p.lerp(220, 60, tRatio);
      let g = p.lerp(70, 110, tRatio);
      let b = p.lerp(90, 200, tRatio);
      p.stroke(r, g, b);
      p.line(barX + x, barY, barX + x, barY + barH);
    }

    // Fluxo Molecular Animado
    const fluxRate = (materialK / 390) * (tempHot - tempCold) * 0.03;
    p.noStroke();
    p.fill(255, 240, 150, 200);
    for (let i = 0; i < 16; i++) {
      let xOffset = (p.frameCount * fluxRate * 2 + i * (barW / 16)) % barW;
      let yOffset = barY + 15 + ((i * 17) % (barH - 30));
      p.ellipse(barX + xOffset, yOffset, 6, 6);
    }

    // Rótulo da Barra
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`Barra de ${materialName} (k = ${materialK} W/m·K) — Lei de Fourier: Φ = k·A·ΔT / L`, barX + barW / 2, barY + barH + 18);
  }

  /* --- Renderização da Convecção --- */
  function drawConveccao() {
    const cx = p.width * 0.5;
    const cy = 180;
    const beakerW = 180, beakerH = 160;

    // Recipiente Béquer
    p.fill(24, 20, 36);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(cx - beakerW / 2, cy - beakerH / 2, beakerW, beakerH, 0, 0, 8, 8);

    // Fluido
    p.noStroke();
    p.fill(59, 108, 181, 60);
    p.rect(cx - beakerW / 2 + 3, cy - beakerH / 2 + 10, beakerW - 6, beakerH - 13, 0, 0, 6, 6);

    // Bico de Bunsen / Chama inferior
    const flameH = (flamePower / 100) * 35;
    p.fill(255, 140, 40, 220);
    p.ellipse(cx, cy + beakerH / 2 + 16, 40, flameH);
    p.fill(255, 230, 80);
    p.ellipse(cx, cy + beakerH / 2 + 16, 20, flameH * 0.7);

    // Partículas de Convecção em Circulação
    const speed = (flamePower / 100) * 1.8;
    convectionParticles.forEach(pt => {
      // Dinâmica de convecção: centro sobe (quente), laterais descem (frio)
      const distFromCenter = pt.x - cx;
      if (Math.abs(distFromCenter) < 40) {
        pt.vy -= 0.08 * speed; // sobe no centro aquecido
        pt.temp = Math.min(90, pt.temp + 1);
      } else {
        pt.vy += 0.06 * speed; // desce pelas bordas resfriadas
        pt.temp = Math.max(25, pt.temp - 0.8);
      }

      // Deslocamento horizontal no topo e na base
      if (pt.y < cy - beakerH / 2 + 25) {
        pt.vx += (distFromCenter >= 0 ? 0.08 : -0.08) * speed; // espalha para as laterais
      }
      if (pt.y > cy + beakerH / 2 - 25) {
        pt.vx += (distFromCenter >= 0 ? -0.08 : 0.08) * speed; // converge para o centro
      }

      pt.vx = p.constrain(pt.vx, -2 * speed, 2 * speed);
      pt.vy = p.constrain(pt.vy, -2.5 * speed, 2.5 * speed);

      pt.x += pt.vx;
      pt.y += pt.vy;

      // Limites do béquer
      pt.x = p.constrain(pt.x, cx - beakerW / 2 + 12, cx + beakerW / 2 - 12);
      pt.y = p.constrain(pt.y, cy - beakerH / 2 + 15, cy + beakerH / 2 - 12);

      // Cor da partícula baseada na temperatura
      const r = p.map(pt.temp, 20, 90, 60, 240);
      const b = p.map(pt.temp, 20, 90, 220, 60);
      p.fill(r, 90, b);
      p.ellipse(pt.x, pt.y, 8, 8);
    });

    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Correntes de Convecção: Fluido quente (menos denso) sobe; fluido frio (mais denso) desce", cx, cy + beakerH / 2 + 35);
  }

  /* --- Renderização da Radiação Térmica --- */
  function drawRadiacao() {
    const sourceX = 120, sourceY = 170;
    const target1X = p.width - 150, target1Y = 115;
    const target2X = p.width - 150, target2Y = 225;

    // Emissor Térmico Infravermelho
    p.fill(220, 70, 70);
    p.stroke(255, 140, 140);
    p.strokeWeight(3);
    p.ellipse(sourceX, sourceY, 60, 60);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Emissor\nIR", sourceX, sourceY);

    // Ondas de Radiação Eletromagnética
    p.noFill();
    for (let r = 40; r < 260; r += 30) {
      let waveOffset = (p.frameCount * 2) % 30;
      let curR = r + waveOffset;
      let alpha = p.map(curR, 40, 280, 220, 0);
      p.stroke(255, 120, 60, alpha);
      p.strokeWeight(2);
      p.arc(sourceX, sourceY, curR * 2, curR * 2, -p.QUARTER_PI, p.QUARTER_PI);
    }

    // Placa 1: Corpo Negro (Absorve quase 100%)
    p.fill(30, 30, 35);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(target1X, target1Y - 35, 70, 70, 6);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.text("Superfície Negra\nAbsorve ~98%", target1X + 35, target1Y);

    // Placa 2: Superfície Prateada Reflexiva (Reflete quase tudo)
    p.fill(200, 210, 225);
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(target2X, target2Y - 35, 70, 70, 6);
    p.noStroke();
    p.fill(20, 20, 40);
    p.text("Superfície Clara\nReflete ~90%", target2X + 35, target2Y);

    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Radiação Térmica: Propagação por ondas eletromagnéticas (infravermelho) no vácuo", p.width * 0.5, 310);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-propagacao");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
      initConvectionParticles();
    }
  };
};

/* ==========================================================================
   2. CALORIMETRIA & CURVA DE MUDANÇA DE FASE
   ========================================================================== */
const simTermoCalorimetria = (p) => {
  let massGrams = 100;
  let heatAddedCalories = 0; // cal
  let heaterPowerCalSec = 80; // cal/s
  let isHeating = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-calorimetria");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-calorimetria");

    initControls();
    updateCalorimetriaReadouts(0);
  };

  function initControls() {
    const btnHeat = document.getElementById("btn-calor-toggle");
    const btnReset = document.getElementById("btn-calor-reset");

    if (btnHeat) {
      btnHeat.addEventListener("click", () => {
        isHeating = !isHeating;
        btnHeat.textContent = isHeating ? "⏸ Pausar Aquecimento" : "🔥 Iniciar Aquecimento";
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        isHeating = false;
        heatAddedCalories = 0;
        if (btnHeat) btnHeat.textContent = "🔥 Iniciar Aquecimento";
        updateCalorimetriaReadouts(0);
      });
    }
  }

  function getTemperatureAndPhase(Q) {
    // 100g de gelo de -20°C até vapor a 120°C
    // Q1 (Gelo -20 a 0): m * c_gelo * dT = 100 * 0.5 * 20 = 1000 cal
    // Q2 (Fusão a 0°C): m * Lf = 100 * 80 = 8000 cal (Total: 9000 cal)
    // Q3 (Água 0 a 100°C): m * c_água * dT = 100 * 1.0 * 100 = 10000 cal (Total: 19000 cal)
    // Q4 (Vaporização a 100°C): m * Lv = 100 * 540 = 54000 cal (Total: 73000 cal)
    // Q5 (Vapor 100 a 120°C): m * c_vapor * dT = 100 * 0.48 * 20 = 960 cal (Total: 73960 cal)
    if (Q <= 1000) {
      let T = -20 + (Q / 1000) * 20;
      return { T, phase: "Gelo Sólido (Aquecendo)" };
    } else if (Q <= 9000) {
      return { T: 0, phase: "Mudança de Fase: Fusão (Gelo + Água)" };
    } else if (Q <= 19000) {
      let T = 0 + ((Q - 9000) / 10000) * 100;
      return { T, phase: "Água Líquida (Aquecendo)" };
    } else if (Q <= 73000) {
      return { T: 100, phase: "Mudança de Fase: Ebulição (Líquido + Vapor)" };
    } else {
      let T = 100 + ((Q - 73000) / 960) * 20;
      return { T: Math.min(120, T), phase: "Vapor de Água Superaquecido" };
    }
  }

  function updateCalorimetriaReadouts(Q) {
    const res = getTemperatureAndPhase(Q);
    const tElem = document.getElementById("t-cal-temp-num");
    const qElem = document.getElementById("t-cal-q-num");
    const phaseElem = document.getElementById("t-cal-phase-text");

    if (tElem) tElem.textContent = `${res.T.toFixed(1).replace(".", ",")} °C`;
    if (qElem) qElem.textContent = `${Math.round(Q)} cal`;
    if (phaseElem) phaseElem.textContent = res.phase;
  }

  p.draw = () => {
    p.background(18, 16, 28);

    if (isHeating && heatAddedCalories < 74000) {
      heatAddedCalories += heaterPowerCalSec * 0.6;
      updateCalorimetriaReadouts(heatAddedCalories);
    }

    // Desenha Gráfico T x Q (Curva de Aquecimento)
    drawHeatingCurve();
  };

  function drawHeatingCurve() {
    const gx = 80, gy = 50, gw = p.width - 140, gh = 230;

    // Eixos
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(gx, gy + gh * 0.8, gx + gw, gy + gh * 0.8); // Linha T = 0°C
    p.line(gx, gy, gx, gy + gh); // Eixo T

    p.noStroke();
    p.fill(160, 150, 180);
    p.textSize(10);
    p.text("T (°C)", gx - 30, gy + 10);
    p.text("Calor Adicionado Q (cal)", gx + gw - 120, gy + gh + 15);
    p.text("100°C", gx - 35, gy + gh * 0.2);
    p.text("0°C", gx - 25, gy + gh * 0.8);
    p.text("-20°C", gx - 35, gy + gh * 0.95);

    // Linha Teórica de Aquecimento
    p.stroke(140, 103, 168, 120);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    p.vertex(gx, gy + gh * 0.95); // -20°C
    p.vertex(gx + (1000 / 74000) * gw, gy + gh * 0.8); // 0°C
    p.vertex(gx + (9000 / 74000) * gw, gy + gh * 0.8); // Patamar Fusão
    p.vertex(gx + (19000 / 74000) * gw, gy + gh * 0.2); // 100°C
    p.vertex(gx + (73000 / 74000) * gw, gy + gh * 0.2); // Patamar Ebulição
    p.vertex(gx + gw, gy + gh * 0.08); // 120°C
    p.endShape();

    // Traço animado percorrido
    p.stroke(200, 67, 93);
    p.strokeWeight(3);
    p.beginShape();
    for (let q = 0; q <= heatAddedCalories; q += 500) {
      let res = getTemperatureAndPhase(q);
      let px = gx + (q / 74000) * gw;
      let py = p.map(res.T, -20, 120, gy + gh * 0.95, gy + gh * 0.08);
      p.vertex(px, py);
    }
    p.endShape();

    // Ponto Atual
    const curRes = getTemperatureAndPhase(heatAddedCalories);
    const curPx = gx + (heatAddedCalories / 74000) * gw;
    const curPy = p.map(curRes.T, -20, 120, gy + gh * 0.95, gy + gh * 0.08);
    p.noStroke();
    p.fill(255, 220, 100);
    p.ellipse(curPx, curPy, 10, 10);
    p.fill(255);
    p.ellipse(curPx, curPy, 4, 4);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-calorimetria");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* ==========================================================================
   3. GASES IDEAIS & DIAGRAMA PxV
   ========================================================================== */
const simTermoGases = (p) => {
  let tempKelvin = 300;
  let volumeLiters = 10;
  let moles = 1.0;
  const R = 0.082;
  let particles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-gases");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-gases");

    initParticles();
    initControls();
    calculatePhysics();
  };

  function initParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: p.random(60, 220),
        y: p.random(100, 280),
        vx: p.random(-2, 2),
        vy: p.random(-2, 2)
      });
    }
  }

  function initControls() {
    const tempSlider = document.getElementById("t1-temp-slider");
    const volSlider = document.getElementById("t1-vol-slider");
    const btnIsotermica = document.getElementById("btn-gas-iso-t");
    const btnIsobarica = document.getElementById("btn-gas-iso-p");

    if (tempSlider) {
      tempSlider.addEventListener("input", (e) => {
        tempKelvin = parseFloat(e.target.value);
        document.getElementById("t1-temp-val").textContent = `${tempKelvin} K (${tempKelvin - 273}°C)`;
        calculatePhysics();
      });
    }

    if (volSlider) {
      volSlider.addEventListener("input", (e) => {
        volumeLiters = parseFloat(e.target.value);
        document.getElementById("t1-vol-val").textContent = `${volumeLiters.toFixed(1).replace(".", ",")} L`;
        calculatePhysics();
      });
    }

    if (btnIsotermica) {
      btnIsotermica.addEventListener("click", () => {
        volumeLiters = volumeLiters > 10 ? 6 : 14;
        if (volSlider) volSlider.value = volumeLiters;
        document.getElementById("t1-vol-val").textContent = `${volumeLiters.toFixed(1).replace(".", ",")} L`;
        calculatePhysics();
      });
    }

    if (btnIsobarica) {
      btnIsobarica.addEventListener("click", () => {
        tempKelvin = 450;
        volumeLiters = 15;
        if (tempSlider) tempSlider.value = 450;
        if (volSlider) volSlider.value = 15;
        document.getElementById("t1-temp-val").textContent = "450 K";
        document.getElementById("t1-vol-val").textContent = "15,0 L";
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const pressureAtm = (moles * R * tempKelvin) / Math.max(volumeLiters, 1.0);
    const pressElem = document.getElementById("t1-press-num");
    const vElem = document.getElementById("t1-vol-num");
    if (pressElem) pressElem.textContent = `${pressureAtm.toFixed(2).replace(".", ",")} atm`;
    if (vElem) vElem.textContent = `${volumeLiters.toFixed(1).replace(".", ",")} L`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cylX = 50, cylY = 80, maxCylW = 220, cylH = 200;
    const pistonX = cylX + (volumeLiters / 20) * maxCylW;

    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.fill(28, 24, 40);
    p.rect(cylX, cylY, maxCylW + 30, cylH, 6);

    p.noStroke();
    const gasHue = p.map(tempKelvin, 150, 600, 200, 0);
    p.fill(p.color(`hsl(${Math.round(gasHue)}, 70%, 25%)`));
    p.rect(cylX + 3, cylY + 3, pistonX - cylX, cylH - 6);

    const speedFactor = Math.sqrt(tempKelvin / 300) * 1.5;
    particles.forEach(pt => {
      pt.x += pt.vx * speedFactor;
      pt.y += pt.vy * speedFactor;
      if (pt.x < cylX + 8) { pt.x = cylX + 8; pt.vx *= -1; }
      if (pt.x > pistonX - 8) { pt.x = pistonX - 8; pt.vx *= -1; }
      if (pt.y < cylY + 8) { pt.y = cylY + 8; pt.vy *= -1; }
      if (pt.y > cylY + cylH - 8) { pt.y = cylY + cylH - 8; pt.vy *= -1; }
      p.fill(240, 220, 255);
      p.ellipse(pt.x, pt.y, 5, 5);
    });

    p.stroke(201, 174, 222);
    p.strokeWeight(6);
    p.line(pistonX, cylY, pistonX, cylY + cylH);
    p.strokeWeight(4);
    p.line(pistonX, cylY + cylH / 2, pistonX + 50, cylY + cylH / 2);

    drawPVDiagram(p.width - 220, 80, 170, 180);
  };

  function drawPVDiagram(gx, gy, gw, gh) {
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(gx, gy + gh, gx + gw, gy + gh);
    p.line(gx, gy, gx, gy + gh);

    p.noStroke();
    p.fill(160, 150, 180);
    p.textSize(10);
    p.text("P (atm)", gx - 20, gy + 10);
    p.text("V (L)", gx + gw - 10, gy + gh + 15);

    p.stroke(201, 174, 222, 160);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let v = 2; v <= 20; v += 1) {
      let p_val = (moles * R * tempKelvin) / v;
      let px = gx + (v / 20) * gw;
      let py = p.constrain(gy + gh - (p_val / 6) * gh, gy, gy + gh);
      p.vertex(px, py);
    }
    p.endShape();

    const curP = (moles * R * tempKelvin) / volumeLiters;
    const curPx = gx + (volumeLiters / 20) * gw;
    const curPy = p.constrain(gy + gh - (curP / 6) * gh, gy, gy + gh);
    p.noStroke();
    p.fill(200, 67, 93);
    p.ellipse(curPx, curPy, 9, 9);
    p.fill(255);
    p.ellipse(curPx, curPy, 3, 3);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-gases");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* ==========================================================================
   4. CICLO DE CARNOT & MÁQUINAS TÉRMICAS
   ========================================================================== */
const simTermoCarnot = (p) => {
  let Tq = 600, Tf = 300, Qq = 1000;

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-carnot");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-carnot");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const tqSlider = document.getElementById("t2-tq-slider");
    const tfSlider = document.getElementById("t2-tf-slider");

    if (tqSlider) {
      tqSlider.addEventListener("input", (e) => {
        Tq = parseFloat(e.target.value);
        document.getElementById("t2-tq-val").textContent = `${Tq} K`;
        calculatePhysics();
      });
    }

    if (tfSlider) {
      tfSlider.addEventListener("input", (e) => {
        Tf = parseFloat(e.target.value);
        document.getElementById("t2-tf-val").textContent = `${Tf} K`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const eta = Math.max(0, 1 - (Tf / Tq));
    const W = Qq * eta;

    const etaElem = document.getElementById("t2-eta-num");
    const workElem = document.getElementById("t2-work-num");
    if (etaElem) etaElem.textContent = `${(eta * 100).toFixed(1).replace(".", ",")}%`;
    if (workElem) workElem.textContent = `${W.toFixed(0)} J`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5;

    p.fill(200, 67, 93, 180);
    p.stroke(255, 100, 120);
    p.strokeWeight(2);
    p.rect(cx - 90, 30, 180, 50, 8);
    p.noStroke();
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`Fonte Quente (T_q = ${Tq} K)`, cx, 55);

    p.fill(60, 50, 80);
    p.stroke(201, 174, 222);
    p.strokeWeight(3);
    p.ellipse(cx, 170, 80, 80);
    p.noStroke();
    p.fill(255);
    p.text("Motor\nCarnot", cx, 170);

    p.fill(59, 108, 181, 180);
    p.stroke(100, 160, 255);
    p.strokeWeight(2);
    p.rect(cx - 90, 260, 180, 50, 8);
    p.noStroke();
    p.fill(255);
    p.text(`Fonte Fria (T_f = ${Tf} K)`, cx, 285);

    p.stroke(200, 67, 93);
    p.strokeWeight(4);
    p.line(cx, 80, cx, 130);

    p.stroke(46, 139, 87);
    p.strokeWeight(4);
    p.line(cx + 40, 170, cx + 110, 170);

    p.stroke(59, 108, 181);
    p.strokeWeight(4);
    p.line(cx, 210, cx, 260);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-carnot");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-termo-propagacao")) new p5(simTermoPropagacao);
  if (document.getElementById("canvas-termo-calorimetria")) new p5(simTermoCalorimetria);
  if (document.getElementById("canvas-termo-gases")) new p5(simTermoGases);
  if (document.getElementById("canvas-termo-carnot")) new p5(simTermoCarnot);
});
