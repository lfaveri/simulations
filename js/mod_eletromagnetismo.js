/**
 * MÓDULO 5: ELETROMAGNETISMO — LABORATÓRIO VIRTUAL
 * 1. Circuitos Elétricos & Lei de Ohm (ENEM)
 * 2. Indução Magnética de Faraday-Lenz & Bobina (FUVEST)
 */

/* --- 1. Circuitos Elétricos & Lei de Ohm --- */
const simEletroCircuito = (p) => {
  let voltageVolts = 12;
  let resistanceOhms = 6;
  let electronDots = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-circuito");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-circuito");

    initElectrons();
    initControls();
    calculatePhysics();
  };

  function initElectrons() {
    electronDots = [];
    for (let i = 0; i < 28; i++) {
      electronDots.push({ s: i / 28 });
    }
  }

  function initControls() {
    const uSlider = document.getElementById("e1-u-slider");
    const rSlider = document.getElementById("e1-r-slider");

    if (uSlider) {
      uSlider.addEventListener("input", (e) => {
        voltageVolts = parseFloat(e.target.value);
        document.getElementById("e1-u-val").textContent = `${voltageVolts} V`;
        calculatePhysics();
      });
    }

    if (rSlider) {
      rSlider.addEventListener("input", (e) => {
        resistanceOhms = parseFloat(e.target.value);
        document.getElementById("e1-r-val").textContent = `${resistanceOhms} Ω`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // I = U / R
    const currentAmperes = voltageVolts / Math.max(resistanceOhms, 0.5);
    // P = U * I
    const powerWatts = voltageVolts * currentAmperes;

    const iElem = document.getElementById("e1-i-num");
    const pElem = document.getElementById("e1-p-num");
    const jElem = document.getElementById("e1-j-text");

    if (iElem) iElem.textContent = `${currentAmperes.toFixed(2).replace(".", ",")} A`;
    if (pElem) pElem.textContent = `${powerWatts.toFixed(1).replace(".", ",")} W`;
    if (jElem) {
      jElem.textContent = `Efeito Joule: ${powerWatts.toFixed(0)} J de calor dissipados por segundo`;
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const x1 = 80, x2 = p.width - 80;
    const y1 = 70, y2 = p.height - 70;
    const currentI = voltageVolts / resistanceOhms;

    // Fios condutores
    p.stroke(140, 103, 168);
    p.strokeWeight(4);
    p.noFill();
    p.rect(x1, y1, x2 - x1, y2 - y1, 8);

    // Bateria / Gerador (Lado esquerdo)
    p.stroke(18, 16, 28);
    p.strokeWeight(8);
    p.line(x1, (y1 + y2) / 2 - 25, x1, (y1 + y2) / 2 + 25);

    // Placas da bateria
    p.stroke(200, 67, 93);
    p.strokeWeight(4);
    p.line(x1 - 16, (y1 + y2) / 2 - 12, x1 + 16, (y1 + y2) / 2 - 12); // Polo +
    p.stroke(59, 108, 181);
    p.strokeWeight(2);
    p.line(x1 - 10, (y1 + y2) / 2 + 12, x1 + 10, (y1 + y2) / 2 + 12); // Polo -

    // Lâmpada / Resistor (Lado direito)
    const bulbX = x2;
    const bulbY = (y1 + y2) / 2;

    const glowAlpha = Math.min(255, currentI * 45);
    p.noStroke();
    p.fill(255, 220, 100, glowAlpha * 0.4);
    p.ellipse(bulbX, bulbY, 60, 60);
    p.fill(255, 240, 150, glowAlpha);
    p.ellipse(bulbX, bulbY, 26, 26);

    // Movimento dos elétrons na malha
    const perimeter = 2 * (x2 - x1 + y2 - y1);
    const speed = currentI * 0.003;

    p.noStroke();
    p.fill(59, 108, 181);

    electronDots.forEach(dot => {
      dot.s = (dot.s + speed) % 1.0;
      let pos = getPosOnRect(dot.s, x1, y1, x2 - x1, y2 - y1);
      p.ellipse(pos.x, pos.y, 7, 7);
    });
  };

  function getPosOnRect(s, rx, ry, rw, rh) {
    const pTotal = 2 * (rw + rh);
    const d = s * pTotal;

    if (d < rw) return { x: rx + d, y: ry };
    if (d < rw + rh) return { x: rx + rw, y: ry + (d - rw) };
    if (d < 2 * rw + rh) return { x: rx + rw - (d - rw - rh), y: ry + rh };
    return { x: rx, y: ry + rh - (d - 2 * rw - rh) };
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-circuito");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 2. Indução de Faraday-Lenz --- */
const simEletroInducao = (p) => {
  let magnetX = 120;
  let magnetVx = 0;
  let isDraggingMagnet = false;
  let inducedEMF = 0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-eletro-inducao");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-eletro-inducao");

    initControls();
  };

  function initControls() {
    const btnMoveIn = document.getElementById("btn-magnet-in");
    const btnMoveOut = document.getElementById("btn-magnet-out");

    if (btnMoveIn) {
      btnMoveIn.addEventListener("click", () => {
        magnetVx = 8;
      });
    }

    if (btnMoveOut) {
      btnMoveOut.addEventListener("click", () => {
        magnetVx = -8;
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const coilX = p.width * 0.65;
    const coilY = p.height * 0.5;

    // Movimentação do ímã
    if (!isDraggingMagnet) {
      magnetX += magnetVx;
      magnetVx *= 0.9;
    }

    // Cálculo da FEM induzida proporcional à velocidade e proximidade da bobina
    const distToCoil = Math.abs(magnetX - coilX);
    if (distToCoil < 150) {
      inducedEMF = -magnetVx * (1 - distToCoil / 150) * 1.5;
    } else {
      inducedEMF = 0;
    }

    // Mostrador do Galvanômetro
    drawGalvanometer(p.width * 0.65, 70, inducedEMF);

    // Bobina Solenoide (Espiras de cobre)
    p.stroke(203, 163, 107);
    p.strokeWeight(4);
    p.noFill();
    for (let x = coilX - 45; x < coilX + 45; x += 18) {
      p.ellipse(x, coilY, 20, 70);
    }

    // Ímã de Barra com Polos Norte (Vermelho) e Sul (Azul)
    drawMagnet(magnetX, coilY);

    // Atualiza leitor numérico
    const emfElem = document.getElementById("e2-emf-num");
    const lenzElem = document.getElementById("e2-lenz-text");
    if (emfElem) emfElem.textContent = `${inducedEMF.toFixed(2).replace(".", ",")} V`;
    if (lenzElem) {
      if (Math.abs(inducedEMF) < 0.05) {
        lenzElem.textContent = "Sem variação de fluxo (Ímã parado)";
      } else if (inducedEMF < 0) {
        lenzElem.textContent = "Aproximação: Bobina cria polo de repulsão";
      } else {
        lenzElem.textContent = "Afastamento: Bobina cria polo de atração";
      }
    }
  };

  function drawMagnet(mx, my) {
    const mw = 90, mh = 32;
    p.stroke(255);
    p.strokeWeight(1.5);

    // Polo Norte
    p.fill(200, 67, 93);
    p.rect(mx - mw / 2, my - mh / 2, mw / 2, mh, 4, 0, 0, 4);
    p.noStroke();
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("N", mx - mw / 4, my);

    // Polo Sul
    p.stroke(255);
    p.strokeWeight(1.5);
    p.fill(59, 108, 181);
    p.rect(mx, my - mh / 2, mw / 2, mh, 0, 4, 4, 0);
    p.noStroke();
    p.fill(255);
    p.text("S", mx + mw / 4, my);
  }

  function drawGalvanometer(gx, gy, emf) {
    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(gx - 45, gy - 35, 90, 60, 6);

    // Ponteiro
    p.stroke(201, 174, 222);
    p.strokeWeight(1);
    p.arc(gx, gy + 15, 60, 60, p.PI + 0.5, p.TWO_PI - 0.5);

    const angle = p.map(p.constrain(emf, -8, 8), -8, 8, -0.6, 0.6);
    p.stroke(255, 100, 120);
    p.strokeWeight(2);
    p.line(gx, gy + 15, gx + Math.sin(angle) * 28, gy + 15 - Math.cos(angle) * 28);
  }

  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, magnetX, p.height * 0.5) < 50) {
      isDraggingMagnet = true;
    }
  };

  p.mouseDragged = () => {
    if (isDraggingMagnet) {
      magnetVx = p.mouseX - p.pmouseX;
      magnetX = p.constrain(p.mouseX, 60, p.width - 60);
    }
  };

  p.mouseReleased = () => { isDraggingMagnet = false; };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-eletro-inducao");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-eletro-circuito")) new p5(simEletroCircuito);
  if (document.getElementById("canvas-eletro-inducao")) new p5(simEletroInducao);
});
