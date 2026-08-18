/**
 * MÓDULO: ONDULATÓRIA & ACÚSTICA — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Forno Micro-ondas, Ondas Estacionárias & Aquecimento Dielétrico da Água
 * 2. Fone Over-Ear com Cancelamento Ativo de Ruído (ANC)
 */

/* ==========================================================================
   1. FORNO MICRO-ONDAS & AQUECIMENTO DIELÉTRICO (COTIDIANO)
   ========================================================================== */
const simOndasMicroondas = (p) => {
  let isMicrowaveOn = true;
  let foodTempC = 25;
  let turntableAngle = 0;
  let powerWatts = 800;

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-microondas");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-microondas");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const onToggle = document.getElementById("w-mic-on-toggle");
    const powerSlider = document.getElementById("w-mic-power-slider");
    const btnReset = document.getElementById("btn-reset-microondas");

    if (onToggle) {
      onToggle.addEventListener("change", (e) => {
        isMicrowaveOn = e.target.checked;
        calculatePhysics();
      });
    }

    if (powerSlider) {
      powerSlider.addEventListener("input", (e) => {
        powerWatts = parseFloat(e.target.value);
        const valElem = document.getElementById("w-mic-power-val");
        if (valElem) valElem.textContent = `${powerWatts} W`;
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        foodTempC = 25;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const freqGhz = 2.45;
    const wavelengthCm = 30 / freqGhz;

    const lambdaElem = document.getElementById("w-mic-lambda-num");
    const statusElem = document.getElementById("w-mic-status-text");

    if (lambdaElem) lambdaElem.textContent = `λ = ${wavelengthCm.toFixed(1)} cm (2,45 GHz)`;
    if (statusElem) {
      statusElem.textContent = isMicrowaveOn ? "Ressonância Dielétrica: Dipolos de H2O girando a 2,45 GHz" : "Magnetron Desligado";
      statusElem.style.color = isMicrowaveOn ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width, cy = 180;
    const ovenW = 280, ovenH = 200;
    const ovenX = w * 0.38, ovenY = cy;

    if (isMicrowaveOn) {
      foodTempC = Math.min(98, foodTempC + (powerWatts / 800) * 0.15);
      turntableAngle += 0.02;
      const tempElem = document.getElementById("w-mic-temp-num");
      if (tempElem) tempElem.textContent = `${foodTempC.toFixed(0)} °C`;
    }

    // 1. Gabinete de Inox do Forno Micro-ondas
    p.fill(40, 45, 60);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(ovenX - ovenW / 2, ovenY - ovenH / 2, ovenW, ovenH, 8);

    // Cavidade Interna
    p.fill(20, 24, 35);
    p.stroke(80, 120, 180);
    p.strokeWeight(2);
    p.rect(ovenX - ovenW / 2 + 15, ovenY - ovenH / 2 + 15, ovenW - 30, ovenH - 30, 4);

    // Prato Giratório
    p.fill(160, 210, 255, 120);
    p.stroke(200);
    p.strokeWeight(1.5);
    p.ellipse(ovenX, ovenY + 55, 140, 24);

    // Alimento (Prato com Fatia de Pizza)
    p.fill(240, 140, 50);
    p.stroke(180, 80, 20);
    p.ellipse(ovenX, ovenY + 50, 70, 16);

    // 2. Ondas Eletromagnéticas Estacionárias de 2,45 GHz na Cavidade
    if (isMicrowaveOn) {
      p.stroke(255, 220, 80, 180);
      p.strokeWeight(2.5);
      p.noFill();
      p.beginShape();
      for (let x = ovenX - ovenW / 2 + 20; x <= ovenX + ovenW / 2 - 20; x += 4) {
        let nodeFactor = Math.sin((x - (ovenX - ovenW / 2)) * 0.08);
        let osc = Math.sin(p.frameCount * 0.2);
        let y = ovenY - 15 + nodeFactor * osc * 35;
        p.vertex(x, y);
      }
      p.endShape();
    }

    // 3. ZOOM NA MOLÉCULA DE ÁGUA (DIPOLO H2O)
    const molX = w - 85, molY = cy;
    p.fill(28, 25, 40);
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.rect(molX - 55, molY - 80, 110, 160, 6);

    p.noStroke();
    p.fill(255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Molécula de H₂O\n(Dipolo Oscilante)", molX, molY - 72);

    let molAngle = isMicrowaveOn ? Math.sin(p.frameCount * 0.15) * 0.8 : 0;
    p.push();
    p.translate(molX, molY + 15);
    p.rotate(molAngle);

    // Oxigênio (δ-)
    p.fill(240, 50, 60);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(0, -6, 26, 26);
    p.fill(255);
    p.textSize(8);
    p.text("O (δ⁻)", 0, -10);

    // 2 Hidrogênios (δ+)
    p.fill(240);
    p.ellipse(-14, 12, 14, 14);
    p.ellipse(14, 12, 14, 14);
    p.fill(20);
    p.text("H⁺", -14, 9);
    p.text("H⁺", 14, 9);
    p.pop();
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-microondas");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. FONE OVER-EAR COM CANCELAMENTO ATIVO (ANC / COTIDIANO)
   ========================================================================== */
const simOndasANC = (p) => {
  let ancActive = true;
  let noiseFreq = 3.0;
  let noiseAmp = 35;

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-anc");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-anc");

    initControls();
  };

  function initControls() {
    const ancToggle = document.getElementById("w-anc-toggle");
    const freqSlider = document.getElementById("w-anc-freq-slider");

    if (ancToggle) {
      ancToggle.addEventListener("change", (e) => {
        ancActive = e.target.checked;
        const statusElem = document.getElementById("w-anc-status-text");
        if (statusElem) {
          statusElem.textContent = ancActive ? "Silêncio Total (Interferência Destrutiva em 180°)" : "Ruído Total Audível (ANC Desligado)";
          statusElem.style.color = ancActive ? "#2e8b57" : "#c8435d";
        }
      });
    }

    if (freqSlider) {
      freqSlider.addEventListener("input", (e) => {
        noiseFreq = parseFloat(e.target.value);
        const valElem = document.getElementById("w-anc-freq-val");
        if (valElem) valElem.textContent = `${noiseFreq.toFixed(1)} kHz`;
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width;
    const t = p.frameCount * 0.08;
    const earX = w - 100, earY = 180;
    drawHeadphoneAndEar(earX, earY);

    const y1 = 65;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y1, earX - 60, y1);

    p.stroke(240, 80, 100);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let y = y1 + Math.sin(x * 0.04 * noiseFreq - t) * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(240, 80, 100);
    p.textSize(10);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("1. Ruído Externo (Turbina / Trânsito)", 40, y1 - 20);

    const y2 = 165;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y2, earX - 60, y2);

    p.stroke(60, 160, 255);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let antiPhase = ancActive ? -Math.sin(x * 0.04 * noiseFreq - t) : 0;
      let y = y2 + antiPhase * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(60, 160, 255);
    p.text("2. Onda Antifásica em 180° gerada pelo Fone", 40, y2 - 20);

    const y3 = 270;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y3, earX - 60, y3);

    p.stroke(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let orig = Math.sin(x * 0.04 * noiseFreq - t);
      let anti = ancActive ? -orig : 0;
      let sum = orig + anti;
      let y = y3 + sum * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.text(ancActive ? "3. Tímpano: Interferência Destrutiva Total = SILÊNCIO (0 dB)" : "3. Tímpano: Ruído Inalterado!", 40, y3 - 20);
  };

  function drawHeadphoneAndEar(hx, hy) {
    p.fill(30, 30, 40);
    p.stroke(201, 174, 222);
    p.strokeWeight(2.5);
    p.rect(hx - 20, hy - 70, 35, 140, 16);

    p.noFill();
    p.stroke(60, 55, 75);
    p.strokeWeight(6);
    p.arc(hx + 10, hy - 50, 80, 100, p.PI, p.TWO_PI);

    p.fill(240, 80, 100);
    p.noStroke();
    p.ellipse(hx - 20, hy - 25, 8, 8);

    p.fill(60, 160, 255);
    p.ellipse(hx + 12, hy + 20, 10, 10);

    p.fill(240, 190, 160);
    p.stroke(200, 150, 120);
    p.strokeWeight(2);
    p.arc(hx + 18, hy, 28, 45, -p.HALF_PI, p.HALF_PI);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-anc");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initOndulatoriaSims() {
  if (document.getElementById("canvas-ondas-microondas")) new p5(simOndasMicroondas);
  if (document.getElementById("canvas-ondas-anc")) new p5(simOndasANC);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOndulatoriaSims);
} else {
  initOndulatoriaSims();
}
