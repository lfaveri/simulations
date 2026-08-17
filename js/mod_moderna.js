/**
 * MÓDULO 6: FÍSICA MODERNA — LABORATÓRIO VIRTUAL
 * 1. Efeito Fotoelétrico de Einstein & Fótons (ENEM)
 * 2. Relatividade Restrita & Fator de Lorentz (FUVEST)
 */

/* --- 1. Efeito Fotoelétrico --- */
const simModernaFotoeletrico = (p) => {
  let wavelengthNm = 350; // UV
  let workFunctionEV = 2.3; // Sódio (2.3 eV)
  let emittedElectrons = [];
  const hc = 1240; // eV * nm

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-foto");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-foto");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const lambdaSlider = document.getElementById("mod1-lambda-slider");
    const workSlider = document.getElementById("mod1-work-slider");

    if (lambdaSlider) {
      lambdaSlider.addEventListener("input", (e) => {
        wavelengthNm = parseFloat(e.target.value);
        document.getElementById("mod1-lambda-val").textContent = `${wavelengthNm} nm`;
        calculatePhysics();
      });
    }

    if (workSlider) {
      workSlider.addEventListener("input", (e) => {
        workFunctionEV = parseFloat(e.target.value);
        document.getElementById("mod1-work-val").textContent = `${workFunctionEV.toFixed(1)} eV`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // E_foton = hc / lambda
    const photonEnergyEV = hc / Math.max(wavelengthNm, 100);
    const eKineticEV = Math.max(0, photonEnergyEV - workFunctionEV);
    const isEmitting = photonEnergyEV >= workFunctionEV;

    const ePhotElem = document.getElementById("mod1-ephot-num");
    const eKinElem = document.getElementById("mod1-ekin-num");
    const statusElem = document.getElementById("mod1-status-text");

    if (ePhotElem) ePhotElem.textContent = `${photonEnergyEV.toFixed(2).replace(".", ",")} eV`;
    if (eKinElem) eKinElem.textContent = `${eKineticEV.toFixed(2).replace(".", ",")} eV`;
    if (statusElem) {
      if (isEmitting) {
        statusElem.textContent = "Emissão Quântica Ativa (hf > W)";
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = "Sem emissão de fotoelétrons (hf < W)";
        statusElem.style.color = "#c8435d";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const plateX = 140;
    const plateY = 80;
    const plateH = 200;

    const photonEnergyEV = hc / wavelengthNm;
    const isEmitting = photonEnergyEV >= workFunctionEV;

    // Placa Metálica Emissora (Cátodo)
    p.fill(80, 70, 95);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(plateX, plateY, 20, plateH, 3);

    // Placa Coletora (Ânodo)
    const anodeX = p.width - 120;
    p.rect(anodeX, plateY, 20, plateH, 3);

    // Luz Incidente (Feixe de Fótons Ondulatórios)
    const beamColor = getSpectrumColor(wavelengthNm);
    p.stroke(beamColor[0], beamColor[1], beamColor[2], 180);
    p.strokeWeight(3);
    for (let i = 0; i < 4; i++) {
      let sy = plateY + 30 + i * 40;
      let waveT = p.frameCount * 0.1;
      p.noFill();
      p.beginShape();
      for (let x = 20; x < plateX; x += 5) {
        let y = sy + Math.sin((x * 0.08) - waveT) * 6;
        p.vertex(x, y);
      }
      p.endShape();
    }

    // Emissão de elétrons ejetados
    if (isEmitting && p.frameCount % 8 === 0) {
      const eKinetic = photonEnergyEV - workFunctionEV;
      const speed = Math.sqrt(eKinetic) * 3.5;
      emittedElectrons.push({
        x: plateX + 22,
        y: plateY + p.random(20, plateH - 20),
        vx: speed
      });
    }

    // Atualiza e desenha fotoelétrons
    p.noStroke();
    p.fill(59, 108, 181);
    for (let i = emittedElectrons.length - 1; i >= 0; i--) {
      let el = emittedElectrons[i];
      el.x += el.vx;

      p.ellipse(el.x, el.y, 8, 8);
      p.fill(255);
      p.ellipse(el.x, el.y, 2.5, 2.5);
      p.fill(59, 108, 181);

      if (el.x > anodeX) {
        emittedElectrons.splice(i, 1);
      }
    }
  };

  function getSpectrumColor(nm) {
    if (nm < 380) return [180, 100, 255]; // UV
    if (nm < 450) return [100, 100, 255]; // Azul
    if (nm < 520) return [80, 220, 120];  // Verde
    if (nm < 590) return [255, 220, 60];  // Amarelo
    if (nm < 700) return [255, 80, 80];   // Vermelho
    return [160, 40, 40];                 // Infravermelho
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-foto");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 2. Relatividade Restrita & Fator de Lorentz --- */
const simModernaRelatividade = (p) => {
  let beta = 0.6; // v / c
  let photonY = 160;
  let photonDir = 1;

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-relatividade");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-relatividade");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const betaSlider = document.getElementById("mod2-beta-slider");

    if (betaSlider) {
      betaSlider.addEventListener("input", (e) => {
        beta = parseFloat(e.target.value);
        document.getElementById("mod2-beta-val").textContent = `${beta.toFixed(2)} c (${(beta * 300000).toFixed(0)} km/s)`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // gamma = 1 / sqrt(1 - beta^2)
    const gamma = 1 / Math.sqrt(Math.max(0.001, 1 - beta * beta));
    const dtZero = 1.0; // s
    const dtDilated = gamma * dtZero;

    const gammaElem = document.getElementById("mod2-gamma-num");
    const dtElem = document.getElementById("mod2-dt-num");

    if (gammaElem) gammaElem.textContent = `${gamma.toFixed(2).replace(".", ",")}`;
    if (dtElem) dtElem.textContent = `${dtDilated.toFixed(2).replace(".", ",")} s`;
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const wagonW = 200;
    const wagonH = 160;
    const wagonX = p.width * 0.5 - wagonW / 2;
    const wagonY = 100;

    // Vagão Relativístico
    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(wagonX, wagonY, wagonW, wagonH, 8);

    // Espelhos Superior e Inferior do Relógio de Luz
    p.fill(201, 174, 222);
    p.rect(wagonX + 30, wagonY + 6, 140, 8);
    p.rect(wagonX + 30, wagonY + wagonH - 14, 140, 8);

    // Pulso de Luz refletindo
    photonY += photonDir * 4;
    if (photonY > wagonY + wagonH - 20) { photonDir = -1; }
    if (photonY < wagonY + 20) { photonDir = 1; }

    p.noStroke();
    p.fill(255, 220, 100);
    p.ellipse(wagonX + wagonW / 2, photonY, 12, 12);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-relatividade");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-moderna-foto")) new p5(simModernaFotoeletrico);
  if (document.getElementById("canvas-moderna-relatividade")) new p5(simModernaRelatividade);
});
