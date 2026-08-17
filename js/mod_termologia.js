/**
 * MÓDULO 2: TERMOLOGIA & TERMODINÂMICA — LABORATÓRIO VIRTUAL EXPANDIDO
 * 1. Gases Ideais & Diagrama PxV (ENEM / FUVEST)
 * 2. Ciclo de Carnot & Rendimento (UNICAMP / ITA)
 * 3. Dilatação Térmica & Calorimetria (UNESP / UFMG)
 */

/* --- 1. Gases Ideais & Cilindro --- */
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

/* --- 2. Ciclo de Carnot --- */
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
    const Qf = Qq - W;

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

/* --- 3. Dilatação Térmica --- */
const simTermoDilatacao = (p) => {
  let deltaT = 50; // °C
  let alphaExp = 2.4e-5; // Alumínio (2.4x10^-5 1/°C)
  const l0 = 200; // pixels

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-dilatacao");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-dilatacao");

    initControls();
  };

  function initControls() {
    const dtSlider = document.getElementById("t3-dt-slider");
    if (dtSlider) {
      dtSlider.addEventListener("input", (e) => {
        deltaT = parseFloat(e.target.value);
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const deltaL_mm = (1.0 * alphaExp * deltaT) * 1000; // para L0 = 1.0 m
    const dlElem = document.getElementById("t3-dl-num");
    if (dlElem) dlElem.textContent = `+${deltaL_mm.toFixed(2).replace(".", ",")} mm`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const barX = 100, barY = 170;
    const expansionPx = deltaT * 0.8;

    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.line(barX, 100, barX, 240); // Apoio fixo à esquerda

    // Barra Metálica
    const barColor = p.lerpColor(p.color(140, 160, 210), p.color(240, 100, 100), deltaT / 100);
    p.fill(barColor);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(barX, barY - 14, l0 + expansionPx, 28, 4);

    // Medidor comparador à direita
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.line(barX + l0 + expansionPx, barY - 30, barX + l0 + expansionPx, barY + 30);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-dilatacao");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-termo-gases")) new p5(simTermoGases);
  if (document.getElementById("canvas-termo-carnot")) new p5(simTermoCarnot);
  if (document.getElementById("canvas-termo-dilatacao")) new p5(simTermoDilatacao);
});
