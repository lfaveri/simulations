/**
 * MÓDULO 4: ONDULATÓRIA & ACÚSTICA — LABORATÓRIO VIRTUAL
 * 1. Efeito Doppler com Fonte em Movimento (ENEM)
 * 2. Fenda Dupla de Young & Interferência (UNICAMP)
 */

/* --- 1. Efeito Doppler --- */
const simOndasDoppler = (p) => {
  let sourceX = 100;
  let sourceSpeed = 0.5; // fração de Mach (v_fonte / v_som)
  let waveFronts = [];
  let sourceFrequency = 440; // Hz
  const vSound = 340; // m/s

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

    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        sourceSpeed = parseFloat(e.target.value);
        document.getElementById("w1-speed-val").textContent = `${(sourceSpeed * 340).toFixed(0)} m/s (${sourceSpeed.toFixed(2)} Mach)`;
        calculatePhysics();
      });
    }

    if (freqSlider) {
      freqSlider.addEventListener("input", (e) => {
        sourceFrequency = parseFloat(e.target.value);
        document.getElementById("w1-freq-val").textContent = `${sourceFrequency} Hz`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // f_frente = f0 * (v / (v - vf))
    // f_tras   = f0 * (v / (v + vf))
    const vf = sourceSpeed * vSound;
    const fAhead = sourceSpeed < 1.0 ? sourceFrequency * (vSound / (vSound - vf)) : Infinity;
    const fBehind = sourceFrequency * (vSound / (vSound + vf));

    const aheadElem = document.getElementById("w1-fahead-num");
    const behindElem = document.getElementById("w1-fbehind-num");
    const shiftElem = document.getElementById("w1-shift-text");

    if (aheadElem) aheadElem.textContent = isFinite(fAhead) ? `${fAhead.toFixed(0)} Hz (Agudo)` : "Cone de Choque (Mach 1)";
    if (behindElem) behindElem.textContent = `${fBehind.toFixed(0)} Hz (Grave)`;
    if (shiftElem) {
      shiftElem.textContent = sourceSpeed > 0 ? "Compressão à frente · Rarefação atrás" : "Fonte em repouso (Simetria)";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    // Emite nova frente de onda a cada N quadros
    if (p.frameCount % 18 === 0) {
      waveFronts.push({
        x: sourceX,
        y: p.height * 0.5,
        r: 0,
        alpha: 220
      });
    }

    // Movimenta a fonte
    sourceX += sourceSpeed * 2.2;
    if (sourceX > p.width - 60) {
      sourceX = 60;
      waveFronts = [];
    }

    // Expande e desenha as frentes de onda circulares
    for (let i = waveFronts.length - 1; i >= 0; i--) {
      let wf = waveFronts[i];
      wf.r += 2.2;
      wf.alpha -= 0.7;

      p.noFill();
      p.stroke(201, 174, 222, wf.alpha);
      p.strokeWeight(1.5);
      p.ellipse(wf.x, wf.y, wf.r * 2);

      if (wf.alpha <= 0) waveFronts.splice(i, 1);
    }

    // Observador fixo à direita
    p.fill(46, 139, 87);
    p.noStroke();
    p.ellipse(p.width - 40, p.height * 0.5, 14, 14);
    p.fill(255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Obs", p.width - 40, p.height * 0.5 + 10);

    // Fonte sonora móvel (Viatura / Emissor)
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(2);
    p.ellipse(sourceX, p.height * 0.5, 16, 16);
    p.noStroke();
    p.fill(255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("S", sourceX, p.height * 0.5);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-doppler");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 2. Fenda Dupla de Young & Interferência --- */
const simOndasYoung = (p) => {
  let wavelength = 550; // nm (verde)
  let slitDistanceUm = 20; // um

  p.setup = () => {
    const wrap = document.getElementById("canvas-ondas-young");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-ondas-young");

    initControls();
  };

  function initControls() {
    const waveSlider = document.getElementById("w2-wave-slider");
    const slitSlider = document.getElementById("w2-slit-slider");

    if (waveSlider) {
      waveSlider.addEventListener("input", (e) => {
        wavelength = parseFloat(e.target.value);
        document.getElementById("w2-wave-val").textContent = `${wavelength} nm`;
      });
    }

    if (slitSlider) {
      slitSlider.addEventListener("input", (e) => {
        slitDistanceUm = parseFloat(e.target.value);
        document.getElementById("w2-slit-val").textContent = `${slitDistanceUm} μm`;
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const barrierX = 140;
    const screenX = p.width - 60;
    const midY = p.height * 0.5;
    const slitSpacing = 30;

    // Barreira com 2 fendas
    p.stroke(140, 103, 168);
    p.strokeWeight(4);
    p.line(barrierX, 20, barrierX, midY - slitSpacing / 2);
    p.line(barrierX, midY - slitSpacing / 2 + 6, barrierX, midY + slitSpacing / 2 - 6);
    p.line(barrierX, midY + slitSpacing / 2, barrierX, p.height - 20);

    // Anteparo à direita
    p.stroke(180, 170, 200);
    p.strokeWeight(3);
    p.line(screenX, 20, screenX, p.height - 20);

    // Ondas circulares emergindo das 2 fendas
    const f1Y = midY - slitSpacing / 2 + 3;
    const f2Y = midY + slitSpacing / 2 - 3;
    const t = p.frameCount * 0.08;

    p.noFill();
    for (let r = (t % 1) * 15; r < 200; r += 15) {
      p.stroke(46, 139, 87, p.map(r, 0, 200, 140, 0));
      p.strokeWeight(1);
      p.arc(barrierX, f1Y, r * 2, r * 2, -p.HALF_PI, p.HALF_PI);
      p.arc(barrierX, f2Y, r * 2, r * 2, -p.HALF_PI, p.HALF_PI);
    }

    // Franjas de interferência no anteparo
    for (let y = 25; y < p.height - 25; y += 4) {
      let dy = y - midY;
      let d1 = p.dist(barrierX, f1Y, screenX, y);
      let d2 = p.dist(barrierX, f2Y, screenX, y);
      let deltaD = Math.abs(d1 - d2);

      let lambdaPx = (wavelength / 550) * 10;
      let phase = (p.TWO_PI * deltaD) / lambdaPx;
      let intensity = Math.cos(phase / 2) ** 2;

      p.stroke(46, 139, 87, intensity * 255);
      p.strokeWeight(3);
      p.line(screenX + 4, y, screenX + 4 + intensity * 35, y);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-ondas-young");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-ondas-doppler")) new p5(simOndasDoppler);
  if (document.getElementById("canvas-ondas-young")) new p5(simOndasYoung);
});
