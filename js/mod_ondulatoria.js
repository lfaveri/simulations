/**
 * MÓDULO: ONDULATÓRIA & ACÚSTICA — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Cancelamento Ativo de Ruído em Fones (ANC / Interferência Destrutiva)
 * 2. Radar de Trânsito por Efeito Doppler (Segurança Viária)
 * 3. Efeito Doppler Sonoro (Ambulância & Frequências Aparentes)
 * 4. Fenda Dupla de Young & Superposição Quântica/Ondulatória
 */

/* ==========================================================================
   1. CANCELAMENTO ATIVO DE RUÍDO (ANC)
   ========================================================================== */
const simOndasANC = (p) => {
  let ancActive = true;
  let noiseFreq = 3;
  let noiseAmp = 40;

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
          statusElem.textContent = ancActive ? "ANC Ativo: Silêncio por Interferência Destrutiva (180°)" : "ANC Desligado: Ruído Total Audível";
          statusElem.style.color = ancActive ? "#2e8b57" : "#c8435d";
        }
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width;
    const t = p.frameCount * 0.08;

    // Trilha 1: Ruído Externo (Vermelho)
    const y1 = 70;
    p.stroke(80, 70, 95);
    p.strokeWeight(1);
    p.line(40, y1, w - 40, y1);
    p.stroke(240, 80, 100);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < w - 40; x += 3) {
      let y = y1 + Math.sin((x * 0.04 * noiseFreq) - t) * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(240, 80, 100);
    p.textSize(10);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("1. Ruído Externo Captado pelo Microfone (Onda Original)", 40, y1 - 25);

    // Trilha 2: Onda Antifásica Invertida de 180° gerada pelo Fone (Azul)
    const y2 = 175;
    p.stroke(80, 70, 95);
    p.strokeWeight(1);
    p.line(40, y2, w - 40, y2);
    p.stroke(60, 160, 255);
    p.strokeWeight(2.5);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < w - 40; x += 3) {
      let antiPhase = ancActive ? -Math.sin((x * 0.04 * noiseFreq) - t) : 0;
      let y = y2 + antiPhase * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(60, 160, 255);
    p.text("2. Onda Antifásica Invertida em 180° gerada pelo Alto-Falante", 40, y2 - 25);

    // Trilha 3: Resultado que Chega ao Tímpano do Usuário (Verde)
    const y3 = 285;
    p.stroke(80, 70, 95);
    p.strokeWeight(1);
    p.line(40, y3, w - 40, y3);
    p.stroke(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    for (let x = 40; x < w - 40; x += 3) {
      let orig = Math.sin((x * 0.04 * noiseFreq) - t);
      let anti = ancActive ? -orig : 0;
      let sum = orig + anti;
      let y = y3 + sum * noiseAmp;
      p.vertex(x, y);
    }
    p.endShape();
    p.noStroke();
    p.fill(ancActive ? 46 : 240, ancActive ? 204 : 80, ancActive ? 113 : 100);
    p.text(ancActive ? "3. Som no Tímpano: Interferência Destrutiva Total = SILÊNCIO (0 dB)" : "3. Som no Tímpano: Ruído Inalterado!", 40, y3 - 25);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-anc");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. RADAR DE TRÂNSITO POR EFEITO DOPPLER
   ========================================================================== */
const simOndasRadar = (p) => {
  let carSpeedKmH = 90; // 40 a 140 km/h
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
    const f0Ghz = 24.150; // GHz (Banda K típica de radar de trânsito)
    const cKmS = 300000;
    const vKmS = carSpeedKmH / 3600;
    // Doppler de ida e volta: Δf = 2 * (v/c) * f0
    const deltaFHz = Math.round(2 * (vKmS / cKmS) * (f0Ghz * 1e9));
    const isInfraction = carSpeedKmH > speedLimitKmH;

    const deltaElem = document.getElementById("w-rad-deltaf-num");
    const speedCalcElem = document.getElementById("w-rad-speedcalc-num");
    const statusElem = document.getElementById("w-rad-status-text");

    if (deltaElem) deltaElem.textContent = `Δf = +${deltaFHz} Hz`;
    if (speedCalcElem) speedCalcElem.textContent = `${carSpeedKmH.toFixed(0)} km/h`;
    if (statusElem) {
      if (isInfraction) {
        statusElem.textContent = `🚨 INFRAÇÃO: Acima do limite (${speedLimitKmH} km/h)`;
        statusElem.style.color = "#c8435d";
      } else {
        statusElem.textContent = "✓ Velocidade Permitida";
        statusElem.style.color = "#2e8b57";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 220;

    // Pista
    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(0, roadY, p.width, 70);

    // Pistola / Poste de Radar no canto esquerdo
    const radarX = 60, radarY = roadY - 40;
    p.fill(80, 75, 95);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(radarX - 10, radarY, 20, 40, 3);
    p.fill(201, 174, 222);
    p.rect(radarX + 10, radarY + 5, 14, 10, 2);

    // Carro em Movimento no canto direito
    const carX = p.width - 120, carY = roadY + 20;
    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(carX - 35, carY - 20, 70, 24, 4);
    p.fill(100, 160, 240);
    p.rect(carX - 20, carY - 32, 40, 14, 2);
    p.fill(20);
    p.ellipse(carX - 20, carY + 4, 14, 14);
    p.ellipse(carX + 20, carY + 4, 14, 14);

    // Ondas Eletromagnéticas Emitidas (Azuis)
    p.noFill();
    for (let r = 20; r < carX - radarX; r += 30) {
      let curR = r + ((p.frameCount * 3) % 30);
      let alpha = p.map(curR, 20, carX - radarX, 220, 30);
      p.stroke(100, 180, 255, alpha);
      p.strokeWeight(2);
      p.arc(radarX + 20, radarY + 10, curR * 2, curR * 2, -p.QUARTER_PI * 0.6, p.QUARTER_PI * 0.6);
    }

    // Ondas Refletidas de volta com Maior Frequência (Amarelas)
    for (let r = 20; r < carX - radarX; r += 24) {
      let curR = r + ((p.frameCount * 4) % 24);
      let alpha = p.map(curR, 20, carX - radarX, 220, 30);
      p.stroke(255, 220, 80, alpha);
      p.strokeWeight(1.5);
      p.arc(carX - 35, carY - 10, curR * 2, curR * 2, p.PI - p.QUARTER_PI * 0.6, p.PI + p.QUARTER_PI * 0.6);
    }

    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("O desvio Doppler Δf do sinal de micro-ondas refletido calcula a velocidade instantânea exata.", p.width * 0.5, 20);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-radar");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. EFEITO DOPPLER SONORO
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
    if (faheadElem) faheadElem.textContent = `${Math.round(fAhead)} Hz`;
    if (fbehindElem) fbehindElem.textContent = `${Math.round(fBehind)} Hz`;
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

    p.noFill();
    p.stroke(140, 103, 168, 160);
    p.strokeWeight(1.5);
    for (let i = waveFronts.length - 1; i >= 0; i--) {
      let wf = waveFronts[i];
      wf.r += 2.5;
      p.ellipse(wf.x, wf.y, wf.r * 2, wf.r * 2);
      if (wf.r > p.width) waveFronts.splice(i, 1);
    }

    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(2);
    p.ellipse(sourceX, cy, 18, 18);
  };

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
