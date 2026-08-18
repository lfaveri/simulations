/**
 * MÓDULO: ELETROMAGNETISMO — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Disjuntor Termomagnético Residencial & Curto-Circuito
 * 2. Fogão por Indução com Teste do Cubo de Gelo & Correntes de Foucault
 */

/* ==========================================================================
   1. DISJUNTOR TERMOMAGNÉTICO RESIDENCIAL (COTIDIANO)
   ========================================================================== */
const simEletroDisjuntor = (p) => {
  let loadCurrentAmps = 12;
  let isTripped = false;
  let bimetalHeat = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-disjuntor");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-disjuntor");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const currentSelect = document.getElementById("e-dis-current-select");
    const btnArm = document.getElementById("btn-arm-breaker");

    if (currentSelect) {
      currentSelect.addEventListener("change", (e) => {
        loadCurrentAmps = parseFloat(e.target.value);
        if (loadCurrentAmps > 80) {
          isTripped = true; // Curto-circuito desarma magnético instantâneo (< 10ms)
        }
        calculatePhysics();
      });
    }

    if (btnArm) {
      btnArm.addEventListener("click", () => {
        isTripped = false;
        bimetalHeat = 0;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const isOverload = loadCurrentAmps > 16 && loadCurrentAmps < 80;
    const isShortCircuit = loadCurrentAmps >= 80;

    const currentElem = document.getElementById("e-dis-current-num");
    const tripElem = document.getElementById("e-dis-trip-num");
    const statusElem = document.getElementById("e-dis-status-text");

    if (currentElem) currentElem.textContent = `${loadCurrentAmps} A (Nominal: 16 A)`;
    if (tripElem) tripElem.textContent = isShortCircuit ? "Magnético Instantâneo (< 10 ms)" : isOverload ? "Térmico Bimetálico (Sobrecarga)" : "Circuito Seguro";
    if (statusElem) {
      statusElem.textContent = isTripped ? "🚨 DISJUNTOR DESARMADO (Circuito Protegido)" : "✓ Circuito Fechado (Condução Normal)";
      statusElem.style.color = isTripped ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = 180;
    const bW = 200, bH = 220;

    // Sobrecarga térmica aquece lâmina bimetálica gradualmente
    if (!isTripped && loadCurrentAmps > 16 && loadCurrentAmps < 80) {
      bimetalHeat += 0.015;
      if (bimetalHeat > 1.0) {
        isTripped = true;
        calculatePhysics();
      }
    }

    // 1. Carcaça Plástica do Disjuntor DIN
    p.fill(220, 220, 225);
    p.stroke(60);
    p.strokeWeight(2);
    p.rect(cx - bW / 2, cy - bH / 2, bW, bH, 8);

    // Bornes de Cobre
    p.fill(210, 130, 40);
    p.stroke(80);
    p.rect(cx - 20, cy - bH / 2 - 12, 40, 12, 2);
    p.rect(cx - 20, cy + bH / 2, 40, 12, 2);

    // 2. Alavanca Basculante de Acionamento (ON / OFF)
    p.fill(isTripped ? p.color(220, 60, 60) : p.color(50, 180, 80));
    p.stroke(30);
    p.strokeWeight(2);
    p.push();
    p.translate(cx + 45, cy - 25);
    p.rotate(isTripped ? p.PI / 4 : -p.PI / 4);
    p.rect(-10, -22, 20, 44, 4);
    p.pop();

    // 3. Bobina do Eletroímã de Disparo Magnético Instantâneo
    const coilX = cx - 45, coilY = cy - 35;
    p.stroke(180, 90, 30);
    p.strokeWeight(3.5);
    p.noFill();
    for (let i = -2; i <= 2; i++) {
      p.ellipse(coilX, coilY + i * 12, 26, 10);
    }
    p.noStroke();
    p.fill(20);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Bobina Magnética", coilX, coilY - 30);

    // 4. Lâmina Bimetálica Térmica de Sobrecarga
    const biX = cx - 45, biY = cy + 45;
    let bend = isTripped ? 18 : (bimetalHeat * 14);

    p.stroke(220, 80, 50);
    p.strokeWeight(3);
    p.line(biX, biY, biX + bend, biY + 45);
    p.stroke(80, 140, 220);
    p.line(biX + 3, biY, biX + bend + 3, biY + 45);

    p.noStroke();
    p.fill(20);
    p.text("Bimetal Térmico", biX + 15, biY + 58);

    // Contatos Elétricos
    p.fill(255, 215, 0);
    p.stroke(30);
    p.strokeWeight(1.5);
    if (isTripped) {
      p.ellipse(cx + 10, cy, 10, 10);
      p.ellipse(cx + 25, cy - 20, 10, 10);
    } else {
      p.ellipse(cx + 10, cy, 12, 12);
      p.stroke(100, 220, 255);
      p.strokeWeight(2);
      p.line(cx + 10, cy, cx + 10, cy + 30);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-disjuntor");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. FOGÃO POR INDUÇÃO COM TESTE DO GELO (COTIDIANO)
   ========================================================================== */
const simEletroInducaoFogao = (p) => {
  let isCooktopOn = true;
  let powerWatts = 1800;
  let waterBubbles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
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
        const valElem = document.getElementById("e-fog-power-val");
        if (valElem) valElem.textContent = `${powerWatts} W`;
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
    if (tempElem) tempElem.textContent = `${panBottomTemp.toFixed(0)} °C`;
    if (statusElem) {
      statusElem.textContent = isCooktopOn ? "Correntes de Foucault no fundo ferromagnético" : "Fogão Desligado";
      statusElem.style.color = isCooktopOn ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cooktopX = p.width * 0.45, cooktopY = 220;

    // 1. Mesa de Vitrocerâmica
    p.fill(25, 28, 38);
    p.stroke(100, 180, 255);
    p.strokeWeight(2.5);
    p.rect(cooktopX - 180, cooktopY, 360, 16, 4);

    // 2. Bobina de Cobre
    const coilX = cooktopX - 50, coilY = cooktopY + 30;
    p.stroke(isCooktopOn ? p.color(255, 100, 30, 200) : p.color(140, 70, 30, 100));
    p.strokeWeight(3.5);
    p.noFill();
    for (let i = -3; i <= 3; i++) {
      p.ellipse(coilX + i * 20, coilY, 16, 26);
    }

    // 3. Panela com Água
    const panW = 140, panH = 80;
    const panX = coilX - panW / 2, panY = cooktopY - panH;

    p.fill(isCooktopOn ? 230 : 80, isCooktopOn ? 60 : 75, isCooktopOn ? 50 : 90);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(panX, cooktopY - 12, panW, 12, 2);

    p.fill(70, 75, 90);
    p.rect(panX, panY, panW, panH - 12, 4, 4, 0, 0);

    p.noStroke();
    p.fill(59, 108, 181, 150);
    p.rect(panX + 4, panY + 20, panW - 8, panH - 32);

    if (isCooktopOn) {
      p.fill(255, 255, 255, 180);
      waterBubbles.forEach(b => {
        p.ellipse(coilX + b.x, cooktopY - 20 - b.y, b.r, b.r);
        b.y += b.speed;
        if (b.y > panH - 35) { b.y = 5; b.x = p.random(-panW / 2 + 10, panW / 2 - 10); }
      });
    }

    // 4. Cubo de Gelo no Vidro
    const iceX = cooktopX + 100, iceY = cooktopY - 14;
    p.fill(180, 230, 255, 200);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(iceX - 16, iceY - 20, 32, 32, 4);
    p.noStroke();
    p.fill(255, 255, 255, 160);
    p.ellipse(iceX - 6, iceY - 12, 10, 8);

    p.fill(201, 174, 222);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Cubo de Gelo\n(Vidro Frio = Gelo Intacto)", iceX, iceY - 26);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-fogao");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initEletromagnetismoSims() {
  if (document.getElementById("canvas-eletro-disjuntor")) new p5(simEletroDisjuntor);
  if (document.getElementById("canvas-eletro-fogao")) new p5(simEletroInducaoFogao);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEletromagnetismoSims);
} else {
  initEletromagnetismoSims();
}
