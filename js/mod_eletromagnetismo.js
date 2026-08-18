/**
 * MÓDULO: ELETROMAGNETISMO — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Fogão por Indução com Teste do Cubo de Gelo & Correntes de Foucault
 * 2. Carregador sem Fio Qi & Indução Magnética no Smartphone
 * 3. Consumo Elétrico Residencial (Chuveiro, Ar-Condicionado, Geladeira)
 * 4. Circuito Elétrico & Lei de Ohm
 */

/* ==========================================================================
   1. FOGÃO POR INDUÇÃO COM TESTE DO GELO (COTIDIANO)
   ========================================================================== */
const simEletroInducaoFogao = (p) => {
  let isCooktopOn = true;
  let powerWatts = 1800;
  let waterBubbles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-fogao");

    for (let i = 0; i < 20; i++) {
      waterBubbles.push({ x: p.random(-45, 45), y: p.random(10, 45), r: p.random(3, 7), speed: p.random(1, 2) });
    }

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
    const heatGenRate = isCooktopOn ? (powerWatts / 1000) * 0.24 : 0;
    const panBottomTemp = isCooktopOn ? 25 + (powerWatts / 2200) * 160 : 25;

    const heatElem = document.getElementById("e-fog-heat-num");
    const tempElem = document.getElementById("e-fog-temp-num");
    const statusElem = document.getElementById("e-fog-status-text");

    if (heatElem) heatElem.textContent = `${heatGenRate.toFixed(1).replace(".", ",")} kcal/s`;
    if (tempElem) tempElem.textContent = `${panBottomTemp.toFixed(0)} °C (Vidro ao lado: 25 °C)`;
    if (statusElem) {
      statusElem.textContent = isCooktopOn ? "Correntes de Foucault ativas no ferro da panela" : "Desligado";
      statusElem.style.color = isCooktopOn ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cooktopX = p.width * 0.45, cooktopY = 220;

    // 1. Mesa de Vitrocerâmica Preta Espelhada
    p.fill(25, 28, 38);
    p.stroke(100, 180, 255);
    p.strokeWeight(2.5);
    p.rect(cooktopX - 180, cooktopY, 360, 16, 4);

    // 2. Bobina de Cobre Sob a Mesa (Visível com Brilho Avermelhado)
    const coilX = cooktopX - 50, coilY = cooktopY + 30;
    p.stroke(isCooktopOn ? p.color(255, 100, 30, 200) : p.color(140, 70, 30, 100));
    p.strokeWeight(3.5);
    p.noFill();
    for (let i = -3; i <= 3; i++) {
      p.ellipse(coilX + i * 20, coilY, 16, 26);
    }

    // Linhas de Campo Magnético Alternado Oscilante
    if (isCooktopOn) {
      p.stroke(201, 174, 222, 140);
      p.strokeWeight(1.5);
      p.drawingContext.setLineDash([4, 4]);
      for (let i = -4; i <= 4; i++) {
        let x = coilX + i * 18;
        p.line(x, coilY + 15, x, cooktopY - 45);
      }
      p.drawingContext.setLineDash([]);
    }

    // 3. Panela Ferromagnética de Inox/Ferro (Sobre a bobina indutora)
    const panW = 140, panH = 80;
    const panX = coilX - panW / 2, panY = cooktopY - panH;

    // Fundo Magnético (Onde ocorrem as correntes de Foucault)
    p.fill(isCooktopOn ? 230 : 80, isCooktopOn ? 60 : 75, isCooktopOn ? 50 : 90);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(panX, cooktopY - 12, panW, 12, 2);

    // Corpo da Panela com Alças
    p.fill(70, 75, 90);
    p.rect(panX, panY, panW, panH - 12, 4, 4, 0, 0);

    // Água Fervendo no Interior da Panela
    p.noStroke();
    p.fill(59, 108, 181, 150);
    p.rect(panX + 4, panY + 20, panW - 8, panH - 32);

    // Bolhas e Vapor
    if (isCooktopOn) {
      p.fill(255, 255, 255, 180);
      waterBubbles.forEach(b => {
        p.ellipse(coilX + b.x, cooktopY - 20 - b.y, b.r, b.r);
        b.y += b.speed;
        if (b.y > panH - 35) { b.y = 5; b.x = p.random(-panW / 2 + 10, panW / 2 - 10); }
      });

      // Redemoinhos de Correntes de Foucault no fundo da panela
      p.noFill();
      p.stroke(255, 220, 80, 220);
      p.strokeWeight(2);
      for (let i = -2; i <= 2; i++) {
        let ex = coilX + i * 26;
        let ey = cooktopY - 6;
        let ang = (p.frameCount * 0.18) % p.TWO_PI;
        p.arc(ex, ey, 16, 8, ang, ang + p.PI * 1.3);
      }
    }

    // 4. TESTE DO CUBO DE GELO DIRETO NO VIDRO AO LADO (Não esquenta!)
    const iceX = cooktopX + 100, iceY = cooktopY - 14;
    p.fill(180, 230, 255, 200);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(iceX - 16, iceY - 20, 32, 32, 4);
    p.noStroke();
    p.fill(255, 255, 255, 160);
    p.ellipse(iceX - 6, iceY - 12, 10, 8); // Brilho do gelo

    p.fill(201, 174, 222);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cubo de Gelo\n(Vidro frio = Gelo intacto)", iceX, iceY - 26);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. CARREGADOR SEM FIO QI & INDUÇÃO NO SMARTPHONE (COTIDIANO)
   ========================================================================== */
const simEletroCarregadorSemFio = (p) => {
  let batteryLevel = 65;

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-qi");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-qi");
  };

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = 180;

    // 1. Base Carregadora Circular Qi
    p.fill(35, 40, 55);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.ellipse(cx, cy + 30, 180, 45);

    // Bobina Primária Transmissora na Base
    p.noFill();
    p.stroke(220, 120, 40, 180);
    p.strokeWeight(3);
    p.ellipse(cx, cy + 30, 120, 30);
    p.ellipse(cx, cy + 30, 80, 20);

    // 2. Smartphone Apoiado sobre a Base
    const phoneW = 95, phoneH = 155;
    const phoneY = cy - 20;

    p.fill(20, 20, 28);
    p.stroke(100, 180, 255);
    p.strokeWeight(2.5);
    p.rect(cx - phoneW / 2, phoneY - phoneH / 2, phoneW, phoneH, 14);

    // Tela do Smartphone com Ícone de Bateria Carregando
    p.fill(10, 15, 25);
    p.rect(cx - phoneW / 2 + 5, phoneY - phoneH / 2 + 8, phoneW - 10, phoneH - 16, 8);

    // Ícone de Bateria
    p.stroke(46, 139, 87);
    p.strokeWeight(2);
    p.noFill();
    p.rect(cx - 20, phoneY - 25, 40, 22, 3);
    p.fill(46, 139, 87);
    p.noStroke();
    p.rect(cx + 20, phoneY - 19, 4, 10, 1);
    p.rect(cx - 18, phoneY - 23, 36 * (batteryLevel / 100), 18, 2);

    // Raio de Carregamento Rápido no Centro da Tela
    p.fill(255, 220, 80);
    p.beginShape();
    p.vertex(cx + 2, phoneY + 5);
    p.vertex(cx - 6, phoneY + 18);
    p.vertex(cx - 1, phoneY + 18);
    p.vertex(cx - 4, phoneY + 30);
    p.vertex(cx + 6, phoneY + 15);
    p.vertex(cx + 1, phoneY + 15);
    p.endShape(p.CLOSE);

    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${batteryLevel}% Carregando por Indução`, cx, phoneY + 36);

    // Linhas de Fluxo Magnético Indutor Oscilando entre a Base e o Celular
    p.stroke(100, 220, 255, 160);
    p.strokeWeight(1.5);
    p.noFill();
    for (let i = 0; i < 3; i++) {
      let r = 50 + i * 25 + ((p.frameCount * 2) % 25);
      p.ellipse(cx, cy + 15, r * 1.6, r * 0.45);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-qi");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. CONSUMO RESIDENCIAL & CONTA DE LUZ (kWh)
   ========================================================================== */
const simEletroContaLuz = (p) => {
  let appPowerWatts = 6500;
  let hoursPerDay = 0.5;
  const tariffKWh = 0.85;

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

    // Barra de Consumo
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

window.addEventListener("load", () => {
  if (document.getElementById("canvas-eletro-fogao")) new p5(simEletroInducaoFogao);
  if (document.getElementById("canvas-eletro-qi")) new p5(simEletroCarregadorSemFio);
  if (document.getElementById("canvas-eletro-contaluz")) new p5(simEletroContaLuz);
});
