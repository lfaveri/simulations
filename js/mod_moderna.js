/**
 * MÓDULO: FÍSICA MODERNA — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Navegação por GPS & Correção Relativística de Einstein (Cotidiano / Relatividade)
 * 2. Célula Solar & Efeito Fotoelétrico de Einstein
 * 3. Modelo Atômico de Bohr & Transições Espectrais
 */

/* ==========================================================================
   1. NAVEGAÇÃO POR GPS & CORREÇÕES RELATIVÍSTICAS (COTIDIANO)
   ========================================================================== */
const simModernaGPS = (p) => {
  let applyEinsteinCorrection = true;
  let elapsedDays = 1.0; // 0.1 a 5.0 dias

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-gps");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-gps");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const corrToggle = document.getElementById("mod-gps-corr-toggle");
    const dSlider = document.getElementById("mod-gps-days-slider");

    if (corrToggle) {
      corrToggle.addEventListener("change", (e) => {
        applyEinsteinCorrection = e.target.checked;
        calculatePhysics();
      });
    }

    if (dSlider) {
      dSlider.addEventListener("input", (e) => {
        elapsedDays = parseFloat(e.target.value);
        document.getElementById("mod-gps-days-val").textContent = `${elapsedDays.toFixed(1)} dias`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // Efeito Relatividade Restrita (Velocidade orbital v = 3.9 km/s): -7.2 us/dia
    // Efeito Relatividade Geral (Menor gravidade a 20.000 km): +45.9 us/dia
    // Diferença líquida diária: +38.7 us/dia
    const netDriftMicroSec = 38.7 * elapsedDays;
    const posErrorKm = applyEinsteinCorrection ? 0.005 : (netDriftMicroSec * 1e-6 * 300000); // c * dt

    const driftElem = document.getElementById("mod-gps-drift-num");
    const errElem = document.getElementById("mod-gps-err-num");
    const statusElem = document.getElementById("mod-gps-status-text");

    if (driftElem) driftElem.textContent = `+${netDriftMicroSec.toFixed(1).replace(".", ",")} µs`;
    if (errElem) errElem.textContent = applyEinsteinCorrection ? "± 2 a 5 metros" : `Erro de ${posErrorKm.toFixed(1).replace(".", ",")} km!`;
    if (statusElem) {
      if (applyEinsteinCorrection) {
        statusElem.textContent = "✓ Relatividade Aplicada: Localização Exata";
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = "🚨 Sem Einstein: GPS inutilizável na cidade!";
        statusElem.style.color = "#c8435d";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = 180;

    // Terra no centro
    p.fill(40, 90, 180);
    p.stroke(100, 180, 255);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 70, 70);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Terra", cx, cy);

    // Órbita dos Satélites GPS a 20.000 km
    const orbitR = 120;
    p.noFill();
    p.stroke(140, 103, 168, 120);
    p.strokeWeight(1.5);
    p.ellipse(cx, cy, orbitR * 2, orbitR * 2);

    // 4 Satélites da Constelação GPS
    for (let i = 0; i < 4; i++) {
      let ang = (p.frameCount * 0.015 + i * (p.TWO_PI / 4)) % p.TWO_PI;
      let sx = cx + orbitR * Math.cos(ang);
      let sy = cy + orbitR * Math.sin(ang);

      // Satélite
      p.fill(201, 174, 222);
      p.stroke(255);
      p.strokeWeight(1.5);
      p.rect(sx - 7, sy - 5, 14, 10, 2);
      // Painéis solares
      p.fill(60, 140, 240);
      p.rect(sx - 18, sy - 3, 9, 6);
      p.rect(sx + 9, sy - 3, 9, 6);

      // Sinais de rádio sincronizados para a Terra
      p.stroke(255, 220, 80, 120);
      p.strokeWeight(1);
      p.line(sx, sy, cx, cy);
    }

    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Sem a compensação relativística de Einstein (+38,7 µs/dia), o GPS erraria a localização em ~11 km por dia!", cx, 20);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-gps");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. EFEITO FOTOELÉTRICO DE EINSTEIN
   ========================================================================== */
const simModernaFotoeletrico = (p) => {
  let wavelengthNm = 350;
  let workFunctionEV = 2.14; // Césio
  let metalName = "Césio";
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
    const metalSelect = document.getElementById("mod1-metal-select");

    if (lambdaSlider) {
      lambdaSlider.addEventListener("input", (e) => {
        wavelengthNm = parseFloat(e.target.value);
        document.getElementById("mod1-lambda-val").textContent = `${wavelengthNm} nm`;
        calculatePhysics();
      });
    }

    if (metalSelect) {
      metalSelect.addEventListener("change", (e) => {
        workFunctionEV = parseFloat(e.target.value);
        metalName = e.target.options[e.target.selectedIndex].text;
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
      statusElem.textContent = isEmitting ? `Emissão Ativa (E_cin = ${eKineticEV.toFixed(2)} eV)` : `Sem emissão (hf < W = ${workFunctionEV} eV)`;
      statusElem.style.color = isEmitting ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const plateX = 140, plateY = 80, plateH = 200;
    const photonEnergyEV = hc / wavelengthNm;
    const isEmitting = photonEnergyEV >= workFunctionEV;

    // Placa Fotossensível
    p.fill(80, 70, 95);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.rect(plateX, plateY, 20, plateH, 3);
    p.noStroke();
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`${metalName}\nW=${workFunctionEV}eV`, plateX + 10, plateY - 18);

    const anodeX = p.width - 120;
    p.fill(60, 52, 75);
    p.stroke(140, 103, 168);
    p.rect(anodeX, plateY, 20, plateH, 3);

    // Feixe de Fótons
    p.stroke(255, 220, 80, 180);
    p.strokeWeight(2.5);
    for (let i = 0; i < 4; i++) {
      let sy = plateY + 30 + i * 40;
      let waveT = p.frameCount * 0.12;
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
      emittedElectrons.push({ x: plateX + 22, y: plateY + p.random(20, plateH - 20), vx: Math.sqrt(eKinetic) * 3.5 });
    }

    p.noStroke();
    p.fill(59, 108, 181);
    for (let i = emittedElectrons.length - 1; i >= 0; i--) {
      let el = emittedElectrons[i];
      el.x += el.vx;
      p.ellipse(el.x, el.y, 8, 8);
      if (el.x > anodeX) emittedElectrons.splice(i, 1);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-foto");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. MODELO DE BOHR
   ========================================================================== */
const simModernaBohr = (p) => {
  let currentLevel = 2;
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
    const btnUp = document.getElementById("btn-bohr-absorb");
    const btnDown = document.getElementById("btn-bohr-emit");
    if (btnUp) btnUp.addEventListener("click", () => { if (currentLevel < 4) { currentLevel++; updateBohr(); } });
    if (btnDown) btnDown.addEventListener("click", () => { if (currentLevel > 1) { currentLevel--; updateBohr(); photonPulse = { r: 0 }; } });
  }

  function updateBohr() {
    const eLevel = -13.6 / (currentLevel * currentLevel);
    const eElem = document.getElementById("mod3-energy-num");
    const nElem = document.getElementById("mod3-n-num");
    if (eElem) eElem.textContent = `${eLevel.toFixed(2).replace(".", ",")} eV`;
    if (nElem) nElem.textContent = `n = ${currentLevel}`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5, cy = p.height * 0.5;

    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(cx, cy, 18, 18);

    p.noFill();
    p.stroke(140, 103, 168, 80);
    p.strokeWeight(1.5);
    for (let n = 1; n <= 4; n++) {
      let r = n * 35;
      p.ellipse(cx, cy, r * 2, r * 2);
    }

    const orbitR = currentLevel * 35;
    const ang = p.frameCount * 0.04;
    const ex = cx + Math.cos(ang) * orbitR;
    const ey = cy + Math.sin(ang) * orbitR;

    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(ex, ey, 10, 10);

    if (photonPulse) {
      photonPulse.r += 3;
      p.stroke(255, 220, 80, p.map(photonPulse.r, 0, 150, 255, 0));
      p.noFill();
      p.ellipse(cx, cy, photonPulse.r * 2);
      if (photonPulse.r > 150) photonPulse = null;
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-bohr");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-moderna-gps")) new p5(simModernaGPS);
  if (document.getElementById("canvas-moderna-foto")) new p5(simModernaFotoeletrico);
  if (document.getElementById("canvas-moderna-bohr")) new p5(simModernaBohr);
});
