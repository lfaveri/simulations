/**
 * MÓDULO: ONDULATÓRIA & ACÚSTICA — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Fone Over-Ear com Cancelamento Ativo de Ruído (ANC) & Conduto Auditivo
 * 2. Viatura Policial, Radar Doppler & Câmera de Trânsito
 * 3. Ambulância em Emergência & Efeito Doppler Acústico
 */

/* ==========================================================================
   1. FONE OVER-EAR COM CANCELAMENTO ATIVO (ANC / COTIDIANO)
   ========================================================================== */
const simOndasANC = (p) => {
  let ancActive = true;
  let noiseFreq = 3.0;
  let noiseAmp = 35;

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-anc");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-anc");

    initControls();
  };

  function initControls() {
    const ancToggle = document.getElementById("w-anc-toggle");
    if (ancToggle) {
      ancToggle.addEventListener("change", (e) => {
        ancActive = e.target.checked;
        const statusElem = document.getElementById("w-anc-status-text");
        if (statusElem) {
          statusElem.textContent = ancActive ? "ANC Ativo: Silêncio no Tímpano por Interferência Destrutiva (180°)" : "ANC Desligado: Ruído Total Audível";
          statusElem.style.color = ancActive ? "#2e8b57" : "#c8435d";
        }
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width;
    const t = p.frameCount * 0.08;

    // 1. Ilustração do Fone Over-Ear e Cabeça Humana no Lado Direito
    const earX = w - 100, earY = 180;
    drawHeadphoneAndEar(earX, earY);

    // 2. Trilha 1: Ruído Externo Captado pelo Microfone (Vermelho)
    const y1 = 65;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y1, earX - 60, y1);

    p.stroke(240, 80, 100);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let y = y1 + Math.sin((x * 0.04 * noiseFreq) - t) * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(240, 80, 100);
    p.textSize(10);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("1. Ruído Externo (Turbina / Trânsito)", 40, y1 - 22);

    // 3. Trilha 2: Onda Antifásica de 180° Gerada pelo DSP do Fone (Azul)
    const y2 = 165;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y2, earX - 60, y2);

    p.stroke(60, 160, 255);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let antiPhase = ancActive ? -Math.sin((x * 0.04 * noiseFreq) - t) : 0;
      let y = y2 + antiPhase * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(60, 160, 255);
    p.text("2. Onda Antifásica em 180° gerada pelo Fone", 40, y2 - 22);

    // 4. Trilha 3: Som que Chega ao Tímpano (Verde / Silêncio)
    const y3 = 270;
    p.stroke(80, 70, 95, 120);
    p.strokeWeight(1);
    p.line(40, y3, earX - 60, y3);

    p.stroke(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < earX - 60; x += 3) {
      let orig = Math.sin((x * 0.04 * noiseFreq) - t);
      let anti = ancActive ? -orig : 0;
      let sum = orig + anti;
      let y = y3 + sum * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.text(ancActive ? "3. Tímpano: Interferência Destrutiva Total = SILÊNCIO (0 dB)" : "3. Tímpano: Ruído Inalterado!", 40, y3 - 22);
  };

  function drawHeadphoneAndEar(hx, hy) {
    // Almofada do Fone Over-Ear (Concha acústica)
    p.fill(30, 30, 40);
    p.stroke(201, 174, 222);
    p.strokeWeight(2.5);
    p.rect(hx - 20, hy - 70, 35, 140, 16);

    // Arco da Cabeça
    p.noFill();
    p.stroke(60, 55, 75);
    p.strokeWeight(6);
    p.arc(hx + 10, hy - 50, 80, 100, p.PI, p.TWO_PI);

    // Microfone Externo Pequeno no Fone
    p.fill(240, 80, 100);
    p.noStroke();
    p.ellipse(hx - 20, hy - 25, 8, 8);

    // Alto-Falante Interno Emissor
    p.fill(60, 160, 255);
    p.ellipse(hx + 12, hy + 20, 10, 10);

    // Orelha Humana
    p.fill(240, 190, 160);
    p.stroke(200, 150, 120);
    p.strokeWeight(2);
    p.arc(hx + 18, hy, 28, 45, -p.HALF_PI, p.HALF_PI);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-anc");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. VIATURA POLICIAL & RADAR DOPPLER (COTIDIANO)
   ========================================================================== */
const simOndasRadar = (p) => {
  let carSpeedKmH = 95;
  let speedLimitKmH = 80;

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-radar");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-radar");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const sSlider = document.getElementById("w-rad-speed-slider");
    if (sSlider) {
      sSlider.addEventListener("input", (e) => {
        carSpeedKmH = parseFloat(e.target.value);
        document.getElementById("w-rad-speed-val").textContent = `${carSpeedKmH} km/h`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const f0Ghz = 24.150;
    const cKmS = 300000;
    const vKmS = carSpeedKmH / 3600;
    const deltaFHz = Math.round(2 * (vKmS / cKmS) * (f0Ghz * 1e9));
    const isInfraction = carSpeedKmH > speedLimitKmH;

    const deltaElem = document.getElementById("w-rad-deltaf-num");
    const speedCalcElem = document.getElementById("w-rad-speedcalc-num");
    const statusElem = document.getElementById("w-rad-status-text");

    if (deltaElem) deltaElem.textContent = `Δf = +${deltaFHz} Hz`;
    if (speedCalcElem) speedCalcElem.textContent = `${carSpeedKmH.toFixed(0)} km/h`;
    if (statusElem) {
      statusElem.textContent = isInfraction ? `🚨 INFRAÇÃO: Acima do limite de ${speedLimitKmH} km/h` : "✓ Velocidade Permitida";
      statusElem.style.color = isInfraction ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 220;

    // Asfalto da Rodovia
    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(0, roadY, p.width, 80);

    p.stroke(255, 215, 0, 180);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([16, 14]);
    p.line(0, roadY + 40, p.width, roadY + 40);
    p.drawingContext.setLineDash([]);

    // Viatura Policial Estacionada no Acostamento à Esquerda
    const policeX = 90, policeY = roadY + 20;
    drawPoliceCruiser(policeX, policeY);

    // Carro em Movimento no Lado Direito
    const carX = p.width - 110, carY = roadY + 20;
    drawTargetCar(carX, carY);

    // Disparo de Micro-ondas Emitidas (Azuis)
    p.noFill();
    for (let r = 20; r < carX - policeX - 20; r += 32) {
      let curR = r + ((p.frameCount * 3) % 32);
      let alpha = p.map(curR, 20, carX - policeX, 220, 20);
      p.stroke(100, 180, 255, alpha);
      p.strokeWeight(2);
      p.arc(policeX + 35, policeY - 10, curR * 2, curR * 2, -p.QUARTER_PI * 0.5, p.QUARTER_PI * 0.5);
    }

    // Ondas Refletidas de Volta com Frequência Aumentada (Amarelas)
    for (let r = 20; r < carX - policeX - 20; r += 22) {
      let curR = r + ((p.frameCount * 4.2) % 22);
      let alpha = p.map(curR, 20, carX - policeX, 220, 20);
      p.stroke(255, 220, 80, alpha);
      p.strokeWeight(1.8);
      p.arc(carX - 35, carY - 10, curR * 2, curR * 2, p.PI - p.QUARTER_PI * 0.5, p.PI + p.QUARTER_PI * 0.5);
    }

    // Flash da Câmera se houver infração
    if (carSpeedKmH > speedLimitKmH && p.frameCount % 30 < 6) {
      p.fill(255, 255, 255, 180);
      p.noStroke();
      p.ellipse(policeX + 35, policeY - 25, 45, 45);
    }
  };

  function drawPoliceCruiser(x, y) {
    p.push();
    p.translate(x, y);

    // Chassi Preto e Branco
    p.fill(240);
    p.stroke(20);
    p.strokeWeight(1.5);
    p.rect(-35, -20, 70, 22, 4);

    // Portas Pretas
    p.fill(30);
    p.rect(-15, -20, 30, 22);

    // Giroflex / Sirene Policial com Luzes Piscantes
    let isRed = (p.frameCount % 20 < 10);
    p.fill(isRed ? p.color(255, 0, 0) : p.color(0, 100, 255));
    p.rect(-8, -32, 16, 8, 2);
    // Halo de luz da sirene
    p.fill(isRed ? p.color(255, 0, 0, 80) : p.color(0, 100, 255, 80));
    p.ellipse(0, -28, 30, 30);

    // Rodas
    p.fill(20);
    p.ellipse(-20, 4, 14, 14);
    p.ellipse(20, 4, 14, 14);
    p.pop();
  }

  function drawTargetCar(x, y) {
    p.push();
    p.translate(x, y);
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(-35, -20, 70, 22, 4);
    p.fill(240, 120, 140);
    p.rect(-18, -32, 36, 12, 2);
    p.fill(20);
    p.ellipse(-20, 4, 14, 14);
    p.ellipse(20, 4, 14, 14);
    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-radar");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. AMBULÂNCIA & EFEITO DOPPLER ACÚSTICO (COTIDIANO)
   ========================================================================== */
const simOndasDoppler = (p) => {
  let sourceSpeedMach = 0.50;
  let baseFreqHz = 440;
  let sourceX = 80;
  let waveFronts = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-doppler");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-doppler");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const speedSlider = document.getElementById("w1-speed-slider");
    const freqSlider = document.getElementById("w1-freq-slider");
    if (speedSlider) speedSlider.addEventListener("input", (e) => { sourceSpeedMach = parseFloat(e.target.value); calculatePhysics(); });
    if (freqSlider) freqSlider.addEventListener("input", (e) => { baseFreqHz = parseFloat(e.target.value); calculatePhysics(); });
  }

  function calculatePhysics() {
    const vSound = 340;
    const vSource = sourceSpeedMach * vSound;
    const fAhead = baseFreqHz * (vSound / (vSound - vSource));
    const fBehind = baseFreqHz * (vSound / (vSound + vSource));
    const faheadElem = document.getElementById("w1-fahead-num");
    const fbehindElem = document.getElementById("w1-fbehind-num");
    if (faheadElem) faheadElem.textContent = `${Math.round(fAhead)} Hz (Agudo)`;
    if (fbehindElem) fbehindElem.textContent = `${Math.round(fBehind)} Hz (Grave)`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cy = p.height * 0.5;

    sourceX += sourceSpeedMach * 2.5;
    if (sourceX > p.width - 60) {
      sourceX = 60;
      waveFronts = [];
    }

    if (p.frameCount % 12 === 0) {
      waveFronts.push({ x: sourceX, y: cy, r: 0 });
    }

    // Frentes de Onda Sonoras Concéntricas Compressas
    p.noFill();
    p.stroke(140, 103, 168, 160);
    p.strokeWeight(1.5);
    for (let i = waveFronts.length - 1; i >= 0; i--) {
      let wf = waveFronts[i];
      wf.r += 2.5;
      p.ellipse(wf.x, wf.y, wf.r * 2, wf.r * 2);
      if (wf.r > p.width) waveFronts.splice(i, 1);
    }

    // Ambulância Ilustrada com Cruz Vermelha e Giroflex
    drawAmbulance(sourceX, cy);
  };

  function drawAmbulance(x, y) {
    p.push();
    p.translate(x, y);

    // Carroceria Branca da Ambulância
    p.fill(245, 245, 250);
    p.stroke(80);
    p.strokeWeight(1.5);
    p.rect(-22, -14, 44, 28, 4);

    // Cruz Vermelha Médica
    p.fill(240, 40, 40);
    p.noStroke();
    p.rect(-4, -8, 8, 16);
    p.rect(-8, -4, 16, 8);

    // Sirene Vermelha Piscando no Teto
    p.fill(p.frameCount % 16 < 8 ? p.color(255, 40, 40) : p.color(255, 200, 40));
    p.rect(-5, -20, 10, 6, 2);

    p.pop();
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-doppler");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-ondas-anc")) new p5(simOndasANC);
  if (document.getElementById("canvas-ondas-radar")) new p5(simOndasRadar);
  if (document.getElementById("canvas-ondas-doppler")) new p5(simOndasDoppler);
});
