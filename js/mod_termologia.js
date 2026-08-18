/**
 * MÓDULO: TERMOLOGIA & TERMOFÍSICA — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Panela de Pressão & Ponto de Ebulição da Água (Cotidiano / Termodinâmica)
 * 2. Efeito Estufa no Carro Fechado ao Sol (Cotidiano / Radiação Térmica)
 * 3. Processos de Propagação de Calor (Condução, Convecção e Radiação)
 * 4. Calorimetria & Curva de Mudança de Fase da Água
 * 5. Gases Ideais & Diagrama PxV
 * 6. Ciclo de Carnot & Máquinas Térmicas
 */

/* ==========================================================================
   1. PANELA DE PRESSÃO & PONTO DE EBULIÇÃO (COTIDIANO)
   ========================================================================== */
const simTermoPanelaPressao = (p) => {
  let internalPressureAtm = 1.0; // 1.0 a 2.0 atm
  let flameOn = true;

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-panela");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const pSlider = document.getElementById("t-pan-p-slider");
    const flameToggle = document.getElementById("t-pan-flame-toggle");

    if (pSlider) {
      pSlider.addEventListener("input", (e) => {
        internalPressureAtm = parseFloat(e.target.value);
        document.getElementById("t-pan-p-val").textContent = `${internalPressureAtm.toFixed(2)} atm`;
        calculatePhysics();
      });
    }

    if (flameToggle) {
      flameToggle.addEventListener("change", (e) => {
        flameOn = e.target.checked;
      });
    }
  }

  function calculatePhysics() {
    // Equação de Antoine aproximada para água: T_ebulição varia de 100°C (1 atm) a 120.4°C (2 atm)
    const boilingTempC = 100 + 20.4 * (internalPressureAtm - 1.0);
    // Tempo relativo de cozimento (cai para ~1/3 a 120°C em relação a 100°C)
    const cookingSpeed = Math.pow(2, (boilingTempC - 100) / 10);

    const tempElem = document.getElementById("t-pan-temp-num");
    const speedElem = document.getElementById("t-pan-speed-num");
    const statusElem = document.getElementById("t-pan-status-text");

    if (tempElem) tempElem.textContent = `${boilingTempC.toFixed(1).replace(".", ",")} °C`;
    if (speedElem) speedElem.textContent = `${cookingSpeed.toFixed(1).replace(".", ",")}× mais rápido`;
    if (statusElem) {
      statusElem.textContent = internalPressureAtm > 1.8 ? "Válvula de Segurança chiando" : "Pressurização normal";
      statusElem.style.color = internalPressureAtm > 1.8 ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const potX = p.width * 0.5, potY = 170, potW = 160, potH = 130;

    // Panela de Pressão Metálica
    p.fill(60, 55, 70);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(potX - potW / 2, potY - potH / 2, potW, potH, 8, 8, 14, 14);

    // Água em Ebulição
    p.noStroke();
    p.fill(59, 108, 181, 140);
    p.rect(potX - potW / 2 + 4, potY + 10, potW - 8, potH / 2 - 14, 0, 0, 10, 10);

    // Borbulhamento
    if (flameOn) {
      p.fill(255, 255, 255, 180);
      for (let i = 0; i < 10; i++) {
        let bx = potX - potW / 2 + 20 + ((p.frameCount * 3 + i * 23) % (potW - 40));
        let by = potY + potH / 2 - 16 - ((p.frameCount * 2 + i * 19) % (potH / 2 - 20));
        p.ellipse(bx, by, 6, 6);
      }
    }

    // Tampa com Vedação
    p.fill(80, 75, 95);
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.rect(potX - potW / 2 - 8, potY - potH / 2 - 12, potW + 16, 16, 4);

    // Válvula de Controle de Pressão com Vapor
    p.fill(200, 67, 93);
    p.rect(potX - 8, potY - potH / 2 - 28, 16, 16, 2);

    if (flameOn && internalPressureAtm > 1.2) {
      // Jato de Vapor da Válvula
      p.noStroke();
      p.fill(240, 240, 255, 120);
      for (let i = 0; i < 6; i++) {
        let steamY = potY - potH / 2 - 32 - i * 8 - (p.frameCount % 8);
        p.ellipse(potX - 8 - i * 2, steamY, 10 + i * 3, 8 + i * 2);
        p.ellipse(potX + 8 + i * 2, steamY, 10 + i * 3, 8 + i * 2);
      }
    }

    // Chama Inferior do Fogão
    if (flameOn) {
      p.noStroke();
      p.fill(255, 140, 40, 220);
      p.ellipse(potX, potY + potH / 2 + 16, 60, 26);
      p.fill(100, 180, 255, 200);
      p.ellipse(potX, potY + potH / 2 + 16, 35, 16);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (wrap) {
      p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
    }
  };
};

/* ==========================================================================
   2. EFEITO ESTUFA NO CARRO FECHADO AO SOL (COTIDIANO)
   ========================================================================== */
const simTermoEstufaCarro = (p) => {
  let solarHours = 2.0; // horas ao sol
  let windowOpen = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-estufa");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-estufa");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const hSlider = document.getElementById("t-est-hours-slider");
    const winToggle = document.getElementById("t-est-window-toggle");

    if (hSlider) {
      hSlider.addEventListener("input", (e) => {
        solarHours = parseFloat(e.target.value);
        document.getElementById("t-est-hours-val").textContent = `${solarHours.toFixed(1)} h`;
        calculatePhysics();
      });
    }

    if (winToggle) {
      winToggle.addEventListener("change", (e) => {
        windowOpen = e.target.checked;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // Temperatura externa ambiente = 30°C
    // Com vidros fechados, sobe até 62°C
    let internalTempC = 30;
    if (windowOpen) {
      internalTempC += solarHours * 4.5; // ventilação alivia
    } else {
      internalTempC += solarHours * 16.0; // efeito estufa severo
    }
    internalTempC = Math.min(68, internalTempC);

    const tempElem = document.getElementById("t-est-temp-num");
    const deltaElem = document.getElementById("t-est-delta-num");
    const warnElem = document.getElementById("t-est-warn-text");

    if (tempElem) tempElem.textContent = `${internalTempC.toFixed(1).replace(".", ",")} °C`;
    if (deltaElem) deltaElem.textContent = `+${(internalTempC - 30).toFixed(1).replace(".", ",")} °C`;
    if (warnElem) {
      if (internalTempC >= 50) {
        warnElem.textContent = "🚨 Perigo Extremo de Hipertermia!";
        warnElem.style.color = "#c8435d";
      } else {
        warnElem.textContent = "Ambiente suportável";
        warnElem.style.color = "#2e8b57";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const carX = p.width * 0.5, carY = 220;

    // Sol no canto superior esquerdo
    p.noStroke();
    p.fill(255, 220, 80);
    p.ellipse(80, 70, 50, 50);
    p.stroke(255, 220, 80, 100);
    p.strokeWeight(3);
    for (let i = 0; i < 8; i++) {
      let ang = i * p.QUARTER_PI;
      p.line(80 + Math.cos(ang) * 32, 70 + Math.sin(ang) * 32, 80 + Math.cos(ang) * 44, 70 + Math.sin(ang) * 44);
    }

    // Raios de Luz Visível (Amarelos) penetrando o vidro
    p.stroke(255, 240, 100, 180);
    p.strokeWeight(2);
    p.line(110, 85, carX - 30, carY - 45);
    p.line(125, 95, carX + 20, carY - 45);

    // Carro
    p.fill(40, 35, 55);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(carX - 80, carY - 30, 160, 45, 6); // lataria

    // Vidros Transparentes (Estufa)
    p.fill(windowOpen ? 18 : 60, windowOpen ? 16 : 80, windowOpen ? 28 : 120, 160);
    p.stroke(100, 180, 255);
    p.rect(carX - 50, carY - 65, 100, 35, 4);

    // Bancos que reemitem Radiação Infravermelha (Vermelho/Rosa)
    p.fill(160, 50, 70);
    p.rect(carX - 40, carY - 45, 30, 15, 2);
    p.rect(carX + 10, carY - 45, 30, 15, 2);

    // Ondas de Calor Aprisionadas (Infravermelho que não sai do vidro)
    if (!windowOpen) {
      p.stroke(255, 80, 80, 180);
      p.noFill();
      p.arc(carX - 25, carY - 45, 25, 25, p.PI, p.TWO_PI);
      p.arc(carX + 25, carY - 45, 25, 25, p.PI, p.TWO_PI);
    }

    // Rodas
    p.fill(20);
    p.stroke(140);
    p.strokeWeight(2);
    p.ellipse(carX - 50, carY + 15, 24, 24);
    p.ellipse(carX + 50, carY + 15, 24, 24);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-estufa");
    if (wrap) {
      p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
    }
  };
};

/* ==========================================================================
   3. PROCESSOS DE PROPAGAÇÃO DE CALOR (CONDUÇÃO, CONVECÇÃO E RADIAÇÃO)
   ========================================================================== */
const simTermoPropagacao = (p) => {
  let mode = "conducao";
  let materialK = 390;
  let materialName = "Cobre";
  let tempHot = 100;
  let tempCold = 20;
  let barLength = 0.20;
  let barArea = 0.0004;

  let convectionParticles = [];
  let flamePower = 50;

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
    if (conducaoControls) conducaoControls.style.display = mode === "conducao" ? "grid" : "none";
    if (conveccaoControls) conveccaoControls.style.display = mode === "conveccao" ? "grid" : "none";
  }

  function updateReadouts() {
    const readout1 = document.getElementById("t-prop-readout-1");
    const readout2 = document.getElementById("t-prop-readout-2");
    const readout3 = document.getElementById("t-prop-readout-3");

    if (mode === "conducao") {
      const deltaT = tempHot - tempCold;
      const fluxWatts = (materialK * barArea * deltaT) / barLength;
      if (readout1) readout1.textContent = `${fluxWatts.toFixed(1).replace(".", ",")} W (J/s)`;
      if (readout2) readout2.textContent = `${materialK} W/m·K`;
      if (readout3) readout3.textContent = `ΔT = ${deltaT} °C`;
    } else if (mode === "conveccao") {
      if (readout1) readout1.textContent = `Fluido em Circulação`;
      if (readout2) readout2.textContent = `Potência: ${flamePower}%`;
      if (readout3) readout3.textContent = `Convecção Natural`;
    } else {
      if (readout1) readout1.textContent = `Ondas Infravermelhas`;
      if (readout2) readout2.textContent = `Stefan-Boltzmann (T⁴)`;
      if (readout3) readout3.textContent = `Absorção Térmica`;
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    if (mode === "conducao") {
      drawConducao();
    } else if (mode === "conveccao") {
      drawConveccao();
    } else {
      drawRadiacao();
    }
  };

  function drawConducao() {
    const barX = 140, barY = 140, barW = p.width - 280, barH = 70;

    p.fill(200, 67, 93);
    p.stroke(255, 120, 140);
    p.strokeWeight(2);
    p.rect(barX - 80, barY - 15, 80, barH + 30, 8);
    p.noStroke();
    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`Fonte Quente\n${tempHot}°C`, barX - 40, barY + barH / 2);

    p.fill(59, 108, 181);
    p.stroke(100, 160, 255);
    p.strokeWeight(2);
    p.rect(barX + barW, barY - 15, 80, barH + 30, 8);
    p.noStroke();
    p.fill(255);
    p.text(`Fonte Fria\n${tempCold}°C`, barX + barW + 40, barY + barH / 2);

    for (let x = 0; x < barW; x += 4) {
      let tRatio = x / barW;
      let r = p.lerp(220, 60, tRatio);
      let g = p.lerp(70, 110, tRatio);
      let b = p.lerp(90, 200, tRatio);
      p.stroke(r, g, b);
      p.line(barX + x, barY, barX + x, barY + barH);
    }

    const fluxRate = (materialK / 390) * (tempHot - tempCold) * 0.03;
    p.noStroke();
    p.fill(255, 240, 150, 200);
    for (let i = 0; i < 16; i++) {
      let xOffset = (p.frameCount * fluxRate * 2 + i * (barW / 16)) % barW;
      let yOffset = barY + 15 + ((i * 17) % (barH - 30));
      p.ellipse(barX + xOffset, yOffset, 6, 6);
    }
  }

  function drawConveccao() {
    const cx = p.width * 0.5, cy = 180, beakerW = 180, beakerH = 160;
    p.fill(24, 20, 36);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(cx - beakerW / 2, cy - beakerH / 2, beakerW, beakerH, 0, 0, 8, 8);

    p.noStroke();
    p.fill(59, 108, 181, 60);
    p.rect(cx - beakerW / 2 + 3, cy - beakerH / 2 + 10, beakerW - 6, beakerH - 13, 0, 0, 6, 6);

    const flameH = (flamePower / 100) * 35;
    p.fill(255, 140, 40, 220);
    p.ellipse(cx, cy + beakerH / 2 + 16, 40, flameH);

    const speed = (flamePower / 100) * 1.8;
    convectionParticles.forEach(pt => {
      const distFromCenter = pt.x - cx;
      if (Math.abs(distFromCenter) < 40) {
        pt.vy -= 0.08 * speed;
        pt.temp = Math.min(90, pt.temp + 1);
      } else {
        pt.vy += 0.06 * speed;
        pt.temp = Math.max(25, pt.temp - 0.8);
      }
      if (pt.y < cy - beakerH / 2 + 25) pt.vx += (distFromCenter >= 0 ? 0.08 : -0.08) * speed;
      if (pt.y > cy + beakerH / 2 - 25) pt.vx += (distFromCenter >= 0 ? -0.08 : 0.08) * speed;

      pt.vx = p.constrain(pt.vx, -2 * speed, 2 * speed);
      pt.vy = p.constrain(pt.vy, -2.5 * speed, 2.5 * speed);
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.x = p.constrain(pt.x, cx - beakerW / 2 + 12, cx + beakerW / 2 - 12);
      pt.y = p.constrain(pt.y, cy - beakerH / 2 + 15, cy + beakerH / 2 - 12);

      const r = p.map(pt.temp, 20, 90, 60, 240);
      const b = p.map(pt.temp, 20, 90, 220, 60);
      p.fill(r, 90, b);
      p.ellipse(pt.x, pt.y, 8, 8);
    });
  }

  function drawRadiacao() {
    const sourceX = 120, sourceY = 170;
    const target1X = p.width - 150, target1Y = 115;
    const target2X = p.width - 150, target2Y = 225;

    p.fill(220, 70, 70);
    p.stroke(255, 140, 140);
    p.strokeWeight(3);
    p.ellipse(sourceX, sourceY, 60, 60);

    p.noFill();
    for (let r = 40; r < 260; r += 30) {
      let curR = r + ((p.frameCount * 2) % 30);
      let alpha = p.map(curR, 40, 280, 220, 0);
      p.stroke(255, 120, 60, alpha);
      p.strokeWeight(2);
      p.arc(sourceX, sourceY, curR * 2, curR * 2, -p.QUARTER_PI, p.QUARTER_PI);
    }

    p.fill(30, 30, 35);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(target1X, target1Y - 35, 70, 70, 6);

    p.fill(200, 210, 225);
    p.stroke(255);
    p.strokeWeight(2);
    p.rect(target2X, target2Y - 35, 70, 70, 6);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-propagacao");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   4. CALORIMETRIA & CURVA DE MUDANÇA DE FASE
   ========================================================================== */
const simTermoCalorimetria = (p) => {
  let heatAddedCalories = 0;
  let heaterPowerCalSec = 80;
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
    if (Q <= 1000) return { T: -20 + (Q / 1000) * 20, phase: "Gelo Sólido (Aquecendo)" };
    if (Q <= 9000) return { T: 0, phase: "Mudança de Fase: Fusão (Gelo + Água)" };
    if (Q <= 19000) return { T: ((Q - 9000) / 10000) * 100, phase: "Água Líquida (Aquecendo)" };
    if (Q <= 73000) return { T: 100, phase: "Mudança de Fase: Ebulição (Líquido + Vapor)" };
    return { T: Math.min(120, 100 + ((Q - 73000) / 960) * 20), phase: "Vapor Superaquecido" };
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
    drawHeatingCurve();
  };

  function drawHeatingCurve() {
    const gx = 80, gy = 50, gw = p.width - 140, gh = 230;
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(gx, gy + gh * 0.8, gx + gw, gy + gh * 0.8);
    p.line(gx, gy, gx, gy + gh);

    p.stroke(140, 103, 168, 120);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    p.vertex(gx, gy + gh * 0.95);
    p.vertex(gx + (1000 / 74000) * gw, gy + gh * 0.8);
    p.vertex(gx + (9000 / 74000) * gw, gy + gh * 0.8);
    p.vertex(gx + (19000 / 74000) * gw, gy + gh * 0.2);
    p.vertex(gx + (73000 / 74000) * gw, gy + gh * 0.2);
    p.vertex(gx + gw, gy + gh * 0.08);
    p.endShape();

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

    const curRes = getTemperatureAndPhase(heatAddedCalories);
    const curPx = gx + (heatAddedCalories / 74000) * gw;
    const curPy = p.map(curRes.T, -20, 120, gy + gh * 0.95, gy + gh * 0.08);
    p.noStroke();
    p.fill(255, 220, 100);
    p.ellipse(curPx, curPy, 10, 10);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-calorimetria");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-termo-panela")) new p5(simTermoPanelaPressao);
  if (document.getElementById("canvas-termo-estufa")) new p5(simTermoEstufaCarro);
  if (document.getElementById("canvas-termo-propagacao")) new p5(simTermoPropagacao);
  if (document.getElementById("canvas-termo-calorimetria")) new p5(simTermoCalorimetria);
});
