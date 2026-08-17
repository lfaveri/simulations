/**
 * MÓDULO 6: FÍSICA MODERNA — LABORATÓRIO VIRTUAL EXPANDIDO
 * 1. Efeito Fotoelétrico de Einstein (ENEM / UNICAMP)
 * 2. Relatividade Restrita & Fator de Lorentz (FUVEST / ITA)
 * 3. Modelo Atômico de Bohr & Transições Quânticas (UNESP / IME)
 */

/* --- 1. Efeito Fotoelétrico --- */
const simModernaFotoeletrico = (p) => {
  let wavelengthNm = 350;
  let workFunctionEV = 2.3;
  let emittedElectrons = [];
  const hc = 1240;

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
    const photonEnergyEV = hc / Math.max(wavelengthNm, 100);
    const eKineticEV = Math.max(0, photonEnergyEV - workFunctionEV);
    const isEmitting = photonEnergyEV >= workFunctionEV;

    const ePhotElem = document.getElementById("mod1-ephot-num");
    const eKinElem = document.getElementById("mod1-ekin-num");
    const statusElem = document.getElementById("mod1-status-text");

    if (ePhotElem) ePhotElem.textContent = `${photonEnergyEV.toFixed(2).replace(".", ",")} eV`;
    if (eKinElem) eKinElem.textContent = `${eKineticEV.toFixed(2).replace(".", ",")} eV`;
    if (statusElem) {
      statusElem.textContent = isEmitting ? "Emissão Quântica Ativa (hf > W)" : "Sem emissão (hf < W)";
      statusElem.style.color = isEmitting ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const plateX = 140, plateY = 80, plateH = 200;
    const photonEnergyEV = hc / wavelengthNm;
    const isEmitting = photonEnergyEV >= workFunctionEV;

    p.fill(80, 70, 95);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(plateX, plateY, 20, plateH, 3);

    const anodeX = p.width - 120;
    p.rect(anodeX, plateY, 20, plateH, 3);

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

    if (isEmitting && p.frameCount % 8 === 0) {
      const eKinetic = photonEnergyEV - workFunctionEV;
      const speed = Math.sqrt(eKinetic) * 3.5;
      emittedElectrons.push({
        x: plateX + 22,
        y: plateY + p.random(20, plateH - 20),
        vx: speed
      });
    }

    p.noStroke();
    p.fill(59, 108, 181);
    for (let i = emittedElectrons.length - 1; i >= 0; i--) {
      let el = emittedElectrons[i];
      el.x += el.vx;
      p.ellipse(el.x, el.y, 8, 8);
      p.fill(255);
      p.ellipse(el.x, el.y, 2.5, 2.5);
      p.fill(59, 108, 181);
      if (el.x > anodeX) emittedElectrons.splice(i, 1);
    }
  };

  function getSpectrumColor(nm) {
    if (nm < 380) return [180, 100, 255];
    if (nm < 450) return [100, 100, 255];
    if (nm < 520) return [80, 220, 120];
    if (nm < 590) return [255, 220, 60];
    if (nm < 700) return [255, 80, 80];
    return [160, 40, 40];
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-foto");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* --- 2. Relatividade Restrita & Lorentz --- */
const simModernaRelatividade = (p) => {
  let beta = 0.6;
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
    const gamma = 1 / Math.sqrt(Math.max(0.001, 1 - beta * beta));
    const dtDilated = gamma * 1.0;
    const lengthContracted = 100.0 / gamma;

    const gammaElem = document.getElementById("mod2-gamma-num");
    const dtElem = document.getElementById("mod2-dt-num");
    const lenElem = document.getElementById("mod2-len-num");

    if (gammaElem) gammaElem.textContent = `${gamma.toFixed(2).replace(".", ",")}`;
    if (dtElem) dtElem.textContent = `${dtDilated.toFixed(2).replace(".", ",")} s`;
    if (lenElem) lenElem.textContent = `${lengthContracted.toFixed(1).replace(".", ",")} m`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const gamma = 1 / Math.sqrt(Math.max(0.001, 1 - beta * beta));
    const wagonW = 200 / gamma; // Contração espacial visível
    const wagonH = 160;
    const wagonX = p.width * 0.5 - wagonW / 2;
    const wagonY = 100;

    p.fill(32, 28, 44);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(wagonX, wagonY, wagonW, wagonH, 8);

    p.fill(201, 174, 222);
    p.rect(wagonX + 10, wagonY + 6, wagonW - 20, 8);
    p.rect(wagonX + 10, wagonY + wagonH - 14, wagonW - 20, 8);

    photonY += photonDir * 4;
    if (photonY > wagonY + wagonH - 20) photonDir = -1;
    if (photonY < wagonY + 20) photonDir = 1;

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

/* --- 3. Modelo Atômico de Bohr --- */
const simModernaBohr = (p) => {
  let currentLevel = 2; // n = 1, 2, 3, 4
  let photonPulse = null;

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-bohr");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-bohr");

    initControls();
  };

  function initControls() {
    const btnJumpUp = document.getElementById("btn-bohr-absorb");
    const btnJumpDown = document.getElementById("btn-bohr-emit");

    if (btnJumpUp) {
      btnJumpUp.addEventListener("click", () => {
        if (currentLevel < 4) {
          currentLevel++;
          updateBohrEnergy();
        }
      });
    }

    if (btnJumpDown) {
      btnJumpDown.addEventListener("click", () => {
        if (currentLevel > 1) {
          currentLevel--;
          updateBohrEnergy();
          // Dispara fóton emitido
          photonPulse = { x: p.width * 0.5, y: p.height * 0.5, r: 0 };
        }
      });
    }
  }

  function updateBohrEnergy() {
    const eLevel = -13.6 / (currentLevel * currentLevel);
    const eElem = document.getElementById("mod3-energy-num");
    const nElem = document.getElementById("mod3-n-num");
    if (eElem) eElem.textContent = `${eLevel.toFixed(2).replace(".", ",")} eV`;
    if (nElem) nElem.textContent = `n = ${currentLevel}`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;

    // Núcleo
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(cx, cy, 18, 18);
    p.noStroke();
    p.fill(255);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("+Ze", cx, cy);

    // Órbitas quantizadas n=1,2,3,4
    p.noFill();
    p.stroke(140, 103, 168, 80);
    p.strokeWeight(1.5);
    for (let n = 1; n <= 4; n++) {
      let r = n * 35;
      p.ellipse(cx, cy, r * 2, r * 2);
    }

    // Elétron girando no nível atual
    const orbitR = currentLevel * 35;
    const ang = p.frameCount * 0.04;
    const ex = cx + Math.cos(ang) * orbitR;
    const ey = cy + Math.sin(ang) * orbitR;

    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(ex, ey, 10, 10);

    // Fóton emitido
    if (photonPulse) {
      photonPulse.r += 3;
      p.stroke(255, 220, 80, p.map(photonPulse.r, 0, 150, 255, 0));
      p.strokeWeight(2);
      p.noFill();
      p.ellipse(cx, cy, photonPulse.r * 2);
      if (photonPulse.r > 150) photonPulse = null;
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-bohr");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-moderna-foto")) new p5(simModernaFotoeletrico);
  if (document.getElementById("canvas-moderna-relatividade")) new p5(simModernaRelatividade);
  if (document.getElementById("canvas-moderna-bohr")) new p5(simModernaBohr);
});
