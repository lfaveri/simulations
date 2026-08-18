/**
 * MÓDULO: FÍSICA MODERNA — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Constelação de Satélites GPS & Relatividade sobre o Globo Terrestre
 * 2. Painel Solar Fotovoltaico no Telhado Residencial (Efeito Fotoelétrico Quântico)
 * 3. Modelo Quântico de Bohr & Espectro de Emissão de Cores
 */

/* ==========================================================================
   1. SATÉLITES GPS SOBRE O GLOBO TERRESTRE (COTIDIANO)
   ========================================================================== */
const simModernaGPS = (p) => {
  let applyEinsteinCorrection = true;
  let elapsedDays = 1.0;

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
    const netDriftMicroSec = 38.7 * elapsedDays;
    const posErrorKm = applyEinsteinCorrection ? 0.005 : (netDriftMicroSec * 1e-6 * 300000);

    const driftElem = document.getElementById("mod-gps-drift-num");
    const errElem = document.getElementById("mod-gps-err-num");
    const statusElem = document.getElementById("mod-gps-status-text");

    if (driftElem) driftElem.textContent = `+${netDriftMicroSec.toFixed(1).replace(".", ",")} µs`;
    if (errElem) errElem.textContent = applyEinsteinCorrection ? "± 2 a 5 metros" : `Erro de ${posErrorKm.toFixed(1).replace(".", ",")} km!`;
    if (statusElem) {
      statusElem.textContent = applyEinsteinCorrection ? "✓ Relatividade Aplicada: Localização Exata na Cidade" : "🚨 Sem Einstein: GPS inutilizável na cidade!";
      statusElem.style.color = applyEinsteinCorrection ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(14, 12, 22);
    const cx = p.width * 0.5, cy = 180;

    // 1. Globo Terrestre 3D com Continentes e Atmosfera Iluminada
    // Brilho da Atmosfera
    p.noStroke();
    p.fill(80, 160, 255, 35);
    p.ellipse(cx, cy, 100, 100);
    p.fill(80, 160, 255, 60);
    p.ellipse(cx, cy, 86, 86);

    // Oceano Azul
    p.fill(30, 80, 170);
    p.stroke(100, 180, 255);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 76, 76);

    // Continentes Verdes em Rotação
    p.fill(40, 140, 70);
    p.noStroke();
    let rotX = (p.frameCount * 0.4) % 76;
    p.ellipse(cx - 15 + rotX, cy - 10, 22, 14);
    p.ellipse(cx - 50 + rotX, cy + 12, 18, 18);
    p.ellipse(cx - 30 + rotX, cy - 18, 16, 10);

    // Veículo com Receptor GPS na Superfície da Terra
    p.fill(255, 40, 40);
    p.ellipse(cx + 8, cy - 36, 6, 6);

    // 2. Órbita dos Satélites a 20.000 km
    const orbitR = 125;
    p.noFill();
    p.stroke(140, 103, 168, 90);
    p.strokeWeight(1.5);
    p.ellipse(cx, cy, orbitR * 2, orbitR * 2);

    // 4 Satélites com Painéis Solares e Feixes Sincronizados
    for (let i = 0; i < 4; i++) {
      let ang = (p.frameCount * 0.012 + i * (p.TWO_PI / 4)) % p.TWO_PI;
      let sx = cx + orbitR * Math.cos(ang);
      let sy = cy + orbitR * Math.sin(ang);

      // Feixe de Rádio/Laser para a Terra
      p.stroke(255, 220, 80, 90);
      p.strokeWeight(1.2);
      p.line(sx, sy, cx + 8, cy - 36);

      // Satélite
      p.push();
      p.translate(sx, sy);
      p.rotate(ang + p.HALF_PI);

      // Corpo Central Dourado
      p.fill(220, 180, 50);
      p.stroke(255);
      p.strokeWeight(1);
      p.rect(-6, -6, 12, 12, 2);

      // Painéis Solares Azuis Fotovoltaicos
      p.fill(40, 120, 240);
      p.rect(-22, -4, 14, 8, 1);
      p.rect(8, -4, 14, 8, 1);

      p.pop();
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-gps");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. PAINEL SOLAR FOTOVOLTAICO NO TELHADO (COTIDIANO)
   ========================================================================== */
const simModernaSolarRoof = (p) => {
  let sunIntensity = 80;

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-solar");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-solar");
  };

  p.draw = () => {
    p.background(18, 16, 28);
    const houseX = p.width * 0.45, houseY = 220;

    // 1. Sol Radiante
    const sunX = 80, sunY = 70;
    p.noStroke();
    p.fill(255, 220, 80);
    p.ellipse(sunX, sunY, 50, 50);
    p.fill(255, 220, 80, 40);
    p.ellipse(sunX, sunY, 80, 80);

    // Fótons de Luz Solar (Amarelos) Incidindo no Painel Solar
    p.stroke(255, 240, 100, 180);
    p.strokeWeight(2);
    for (let i = 0; i < 5; i++) {
      let off = (p.frameCount * 3 + i * 25) % 120;
      let startX = sunX + 25 + off * 0.9;
      let startY = sunY + 20 + off * 0.7;
      p.line(startX, startY, startX + 15, startY + 12);
    }

    // 2. Casa com Telhado Inclinado
    // Paredes
    p.fill(50, 45, 65);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(houseX - 90, houseY, 180, 95, 4);

    // Janela Acesa com Luz Solar Convertida
    p.fill(255, 230, 120);
    p.rect(houseX - 60, houseY + 25, 40, 40, 4);
    p.stroke(50);
    p.line(houseX - 40, houseY + 25, houseX - 40, houseY + 65);
    p.line(houseX - 60, houseY + 45, houseX - 20, houseY + 45);

    // Telhado
    p.fill(70, 40, 50);
    p.stroke(140, 103, 168);
    p.triangle(houseX - 110, houseY, houseX, houseY - 70, houseX + 110, houseY);

    // 3. Painel Solar Fotovoltaico de Silício no Telhado
    p.fill(25, 60, 130);
    p.stroke(200, 230, 255);
    p.strokeWeight(2);
    p.quad(houseX - 85, houseY - 10, houseX - 20, houseY - 55, houseX + 20, houseY - 55, houseX - 45, houseY - 10);

    // Grade de Células Fotovoltaicas
    p.stroke(100, 180, 255, 120);
    p.strokeWeight(1);
    p.line(houseX - 52, houseY - 32, houseX - 12, houseY - 32);

    // Fiação Conduzindo Corrente Elétrica de Fotoelétrons
    p.stroke(46, 139, 87);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    p.vertex(houseX - 45, houseY - 10);
    p.vertex(houseX - 45, houseY + 20);
    p.vertex(houseX - 40, houseY + 25);
    p.endShape();

    // Fotoelétrons em Movimento nos Fios
    p.fill(100, 220, 255);
    p.noStroke();
    for (let i = 0; i < 4; i++) {
      let t = ((p.frameCount * 2 + i * 20) % 60) / 60;
      let ey = p.lerp(houseY - 10, houseY + 25, t);
      p.ellipse(houseX - 45, ey, 5, 5);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-solar");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. MODELO ATÔMICO DE BOHR & CORES ESPECTRAIS
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

    // Núcleo Positivo
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 20, 20);

    // Órbitas Quantizadas de Bohr
    p.noFill();
    p.stroke(140, 103, 168, 90);
    p.strokeWeight(1.5);
    for (let n = 1; n <= 4; n++) {
      let r = n * 35;
      p.ellipse(cx, cy, r * 2, r * 2);
    }

    // Elétron
    const orbitR = currentLevel * 35;
    const ang = p.frameCount * 0.04;
    const ex = cx + Math.cos(ang) * orbitR;
    const ey = cy + Math.sin(ang) * orbitR;

    p.fill(59, 108, 181);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(ex, ey, 11, 11);

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
  if (document.getElementById("canvas-moderna-solar")) new p5(simModernaSolarRoof);
  if (document.getElementById("canvas-moderna-bohr")) new p5(simModernaBohr);
});
