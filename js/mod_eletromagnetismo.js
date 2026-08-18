/**
 * MÓDULO: ELETROMAGNETISMO — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Fogão por Indução Eletromagnética & Correntes de Foucault (Cotidiano / Indução de Faraday)
 * 2. Consumo Residencial em kWh & Conta de Luz (Cotidiano / Eletrodinâmica)
 * 3. Bancada de Circuitos & Lei de Ohm
 * 4. Trilho de Coulomb & Lei do Inverso do Quadrado
 */

/* ==========================================================================
   1. FOGÃO POR INDUÇÃO ELETROMAGNÉTICA & CORRENTES DE FOUCAULT
   ========================================================================== */
const simEletroInducaoFogao = (p) => {
  let isCooktopOn = true;
  let powerWatts = 1800; // 500W a 2200W

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-fogao");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const pSlider = document.getElementById("e-fog-power-slider");
    const onToggle = document.getElementById("e-fog-on-toggle");

    if (pSlider) {
      pSlider.addEventListener("input", (e) => {
        powerWatts = parseFloat(e.target.value);
        document.getElementById("e-fog-power-val").textContent = `${powerWatts} W`;
        calculatePhysics();
      });
    }

    if (onToggle) {
      onToggle.addEventListener("change", (e) => {
        isCooktopOn = e.target.checked;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const heatGenRate = isCooktopOn ? (powerWatts / 1000) * 0.24 : 0; // cal/s aproximado
    const panBottomTemp = isCooktopOn ? 25 + (powerWatts / 2200) * 160 : 25;

    const heatElem = document.getElementById("e-fog-heat-num");
    const tempElem = document.getElementById("e-fog-temp-num");
    const statusElem = document.getElementById("e-fog-status-text");

    if (heatElem) heatElem.textContent = `${heatGenRate.toFixed(1).replace(".", ",")} kcal/s`;
    if (tempElem) tempElem.textContent = `${panBottomTemp.toFixed(0)} °C (Mesa de vidro fria)`;
    if (statusElem) {
      statusElem.textContent = isCooktopOn ? "Correntes Parasitas de Foucault ativas no ferro" : "Desligado";
      statusElem.style.color = isCooktopOn ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5;
    const glassY = 200;

    // 1. Placa de Vitrocerâmica (Vidro frio que não esquenta diretamente)
    p.fill(40, 45, 60, 200);
    p.stroke(100, 180, 255);
    p.strokeWeight(2.5);
    p.rect(cx - 150, glassY, 300, 12, 3);
    p.noStroke();
    p.fill(200, 220, 255);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Mesa de Vitrocerâmica (Isolante Elétrico e Térmico)", cx - 140, glassY + 6);

    // 2. Bobina Indutora de Cobre abaixo do vidro (Gera campo magnético alternado)
    const coilY = glassY + 30;
    p.stroke(200, 120, 50);
    p.strokeWeight(4);
    p.noFill();
    for (let i = -4; i <= 4; i++) {
      p.ellipse(cx + i * 25, coilY, 18, 28);
    }

    // Linhas de Campo Magnético Oscilante (Linhas Roxas/Lilases verticais)
    if (isCooktopOn) {
      p.stroke(201, 174, 222, 160);
      p.strokeWeight(1.5);
      p.drawingContext.setLineDash([4, 4]);
      for (let i = -5; i <= 5; i++) {
        let x = cx + i * 22;
        let tOffset = (p.frameCount * 4 + i * 15) % 80;
        p.line(x, coilY + 20, x, glassY - 50);
      }
      p.drawingContext.setLineDash([]);
    }

    // 3. Panela Ferromagnética sobre o vidro
    const panW = 180, panH = 90;
    const panX = cx - panW / 2, panY = glassY - panH;

    // Fundo da Panela (Onde ocorrem as correntes de Foucault e aquecimento Joule)
    p.fill(isCooktopOn ? 220 : 70, isCooktopOn ? 70 : 65, isCooktopOn ? 60 : 80);
    p.stroke(isCooktopOn ? 255 : 140, isCooktopOn ? 120 : 103, isCooktopOn ? 100 : 168);
    p.strokeWeight(2);
    p.rect(panX, glassY - 14, panW, 14, 2);

    // Corpo da Panela
    p.fill(60, 55, 75);
    p.rect(panX, panY, panW, panH - 14, 4, 4, 0, 0);

    // Redemoinhos de Correntes de Foucault no fundo da panela
    if (isCooktopOn) {
      p.noFill();
      p.stroke(255, 220, 80, 220);
      p.strokeWeight(2);
      for (let i = -3; i <= 3; i++) {
        let ex = cx + i * 24;
        let ey = glassY - 7;
        let ang = (p.frameCount * 0.15) % p.TWO_PI;
        p.arc(ex, ey, 14, 8, ang, ang + p.PI * 1.4);
      }
    }

    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("O campo magnético alternado induz Correntes de Foucault no metal ferromagnético, aquecendo apenas a panela!", cx, 20);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. CONSUMO RESIDENCIAL & CONTA DE LUZ (kWh)
   ========================================================================== */
const simEletroContaLuz = (p) => {
  let appPowerWatts = 6500; // Chuveiro = 6500, Ar = 1400, Geladeira = 250, Ferro = 1500, TV = 120
  let hoursPerDay = 0.5; // horas por dia
  const tariffKWh = 0.85; // R$/kWh

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-contaluz");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-contaluz");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const appSelect = document.getElementById("e-con-app-select");
    const hSlider = document.getElementById("e-con-hours-slider");

    if (appSelect) {
      appSelect.addEventListener("change", (e) => {
        appPowerWatts = parseFloat(e.target.value);
        calculatePhysics();
      });
    }

    if (hSlider) {
      hSlider.addEventListener("input", (e) => {
        hoursPerDay = parseFloat(e.target.value);
        document.getElementById("e-con-hours-val").textContent = `${hoursPerDay.toFixed(1)} h/dia`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const monthlyKWh = (appPowerWatts * hoursPerDay * 30) / 1000;
    const monthlyCostReais = monthlyKWh * tariffKWh;

    const kwhElem = document.getElementById("e-con-kwh-num");
    const costElem = document.getElementById("e-con-cost-num");

    if (kwhElem) kwhElem.textContent = `${monthlyKWh.toFixed(1).replace(".", ",")} kWh/mês`;
    if (costElem) costElem.textContent = `R$ ${monthlyCostReais.toFixed(2).replace(".", ",")}/mês`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const monthlyKWh = (appPowerWatts * hoursPerDay * 30) / 1000;
    const maxKWh = 300;
    const barW = p.map(monthlyKWh, 0, maxKWh, 0, p.width - 160);

    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(80, 140, p.width - 160, 45, 6);

    p.fill(200, 67, 93);
    p.noStroke();
    p.rect(80, 140, Math.min(barW, p.width - 160), 45, 6);

    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`Consumo Mensal: ${monthlyKWh.toFixed(1)} kWh = R$ ${(monthlyKWh * tariffKWh).toFixed(2)}`, p.width * 0.5, 162);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-contaluz");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. CIRCUITO & LEI DE OHM
   ========================================================================== */
const simEletroCircuito = (p) => {
  let voltageU = 12;
  let resistanceR = 6;

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-circuito");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-circuito");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const uSlider = document.getElementById("e1-u-slider");
    const rSlider = document.getElementById("e1-r-slider");
    if (uSlider) uSlider.addEventListener("input", (e) => { voltageU = parseFloat(e.target.value); calculatePhysics(); });
    if (rSlider) rSlider.addEventListener("input", (e) => { resistanceR = parseFloat(e.target.value); calculatePhysics(); });
  }

  function calculatePhysics() {
    const currentI = voltageU / resistanceR;
    const powerP = voltageU * currentI;
    const iElem = document.getElementById("e1-i-num");
    const pElem = document.getElementById("e1-p-num");
    if (iElem) iElem.textContent = `${currentI.toFixed(2).replace(".", ",")} A`;
    if (pElem) pElem.textContent = `${powerP.toFixed(1).replace(".", ",")} W`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = p.height * 0.5;

    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.noFill();
    p.rect(cx - 130, cy - 80, 260, 160, 8);

    // Bateria
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(cx - 140, cy - 25, 20, 50, 3);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${voltageU}V`, cx - 130, cy);

    // Resistor
    p.fill(80, 70, 95);
    p.stroke(201, 174, 222);
    p.strokeWeight(1.5);
    p.rect(cx + 120, cy - 30, 20, 60, 3);
    p.noStroke();
    p.fill(255);
    p.text(`${resistanceR}Ω`, cx + 130, cy);

    // Elétrons em circulação
    const currentI = voltageU / resistanceR;
    const speed = currentI * 1.5;
    p.fill(100, 200, 255);
    for (let i = 0; i < 12; i++) {
      let t = ((p.frameCount * speed * 2 + i * 60) % 720) / 720;
      let ex = cx - 130, ey = cy - 80;
      if (t < 0.25) { ex = p.lerp(cx - 130, cx + 130, t / 0.25); ey = cy - 80; }
      else if (t < 0.50) { ex = cx + 130; ey = p.lerp(cy - 80, cy + 80, (t - 0.25) / 0.25); }
      else if (t < 0.75) { ex = p.lerp(cx + 130, cx - 130, (t - 0.50) / 0.25); ey = cy + 80; }
      else { ex = cx - 130; ey = p.lerp(cy + 80, cy - 80, (t - 0.75) / 0.25); }
      p.ellipse(ex, ey, 6, 6);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-circuito");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-eletro-fogao")) new p5(simEletroInducaoFogao);
  if (document.getElementById("canvas-eletro-contaluz")) new p5(simEletroContaLuz);
  if (document.getElementById("canvas-eletro-circuito")) new p5(simEletroCircuito);
});
