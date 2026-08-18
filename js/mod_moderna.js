/**
 * MÓDULO: FÍSICA MODERNA — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Detector de Fumaça Nuclear com Amerício-241 & Partículas Alfa (α)
 * 2. Constelação GPS & Dilatação Relativística do Tempo (Einstein)
 */

/* ==========================================================================
   1. DETECTOR DE FUMAÇA NUCLEAR COM AMERÍCIO-241 (COTIDIANO)
   ========================================================================== */
const simModernaDetectorFumaca = (p) => {
  let smokeLevel = 0;
  let alphaParticles = [];
  let smokeParticles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-detector");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-detector");

    for (let i = 0; i < 20; i++) {
      alphaParticles.push({ x: 90, y: p.random(120, 240), vx: p.random(3.5, 5.5) });
    }

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const smokeSlider = document.getElementById("mod-det-smoke-slider");
    if (smokeSlider) {
      smokeSlider.addEventListener("input", (e) => {
        smokeLevel = parseFloat(e.target.value);
        const valElem = document.getElementById("mod-det-smoke-val");
        if (valElem) valElem.textContent = `${smokeLevel}%`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const isAlarmActive = smokeLevel >= 40;
    const currentMicroAmps = Math.max(0.1, 10.0 * (1 - smokeLevel / 100));

    const curElem = document.getElementById("mod-det-cur-num");
    const radElem = document.getElementById("mod-det-rad-num");
    const statusElem = document.getElementById("mod-det-status-text");

    if (curElem) curElem.textContent = `${currentMicroAmps.toFixed(1).replace(".", ",")} µA`;
    if (radElem) radElem.textContent = "Am-241 (Emissão Alfa α)";
    if (statusElem) {
      statusElem.textContent = isAlarmActive ? "🚨 FUMAÇA DETECTADA: Corrente bloqueada → ALARME DISPARADO!" : "✓ Ar Limpo: Corrente de ionização estável (Ambiente Seguro)";
      statusElem.style.color = isAlarmActive ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(14, 12, 22);
    const w = p.width, cy = 180;
    const isAlarmActive = smokeLevel >= 40;

    // 1. Câmara de Ionização do Detector de Fumaça
    const chX = w * 0.42, chY = cy, chW = 240, chH = 150;
    p.fill(28, 32, 45);
    p.stroke(140, 103, 168);
    p.strokeWeight(2.5);
    p.rect(chX - chW / 2, chY - chH / 2, chW, chH, 8);

    // Eletrodos (+ e -)
    p.fill(220, 180, 50);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(chX - chW / 2 + 30, chY - chH / 2 + 8, chW - 60, 10, 2);
    p.rect(chX - chW / 2 + 30, chY + chH / 2 - 18, chW - 60, 10, 2);

    p.noStroke();
    p.fill(20);
    p.textSize(8);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Eletrodo Positivo (+)", chX, chY - chH / 2 + 13);
    p.text("Eletrodo Negativo (-)", chX, chY + chH / 2 - 13);

    // 2. Microfonte Radioativa de Amerício-241
    const srcX = chX - chW / 2 + 15, srcY = cy;
    p.fill(255, 215, 0);
    p.stroke(200, 50, 50);
    p.strokeWeight(2);
    p.ellipse(srcX, srcY, 18, 18);
    p.fill(200, 50, 50);
    p.noStroke();
    p.ellipse(srcX, srcY, 6, 6);

    // 3. Emissão de Partículas Alfa
    p.fill(100, 220, 255);
    alphaParticles.forEach(ap => {
      let maxReach = chX + chW / 2 - 30 - (smokeLevel / 100) * 140;
      if (ap.x < maxReach) {
        p.ellipse(ap.x, ap.y, 6, 6);
        ap.x += ap.vx;
      } else {
        ap.x = srcX + 10;
        ap.y = p.random(chY - 50, chY + 50);
      }
    });

    // 4. Fumaça Infiltrando na Câmara
    if (smokeLevel > 0) {
      if (p.frameCount % 3 === 0) {
        smokeParticles.push({
          x: chX + chW / 2 + 20,
          y: p.random(chY - 40, chY + 40),
          r: p.random(8, 16),
          alpha: p.map(smokeLevel, 0, 100, 40, 180)
        });
      }
    }

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      let sp = smokeParticles[i];
      p.fill(180, 180, 190, sp.alpha);
      p.noStroke();
      p.ellipse(sp.x, sp.y, sp.r, sp.r);
      sp.x -= 1.8;
      sp.r += 0.2;
      if (sp.x < chX - chW / 2 + 20) smokeParticles.splice(i, 1);
    }

    // 5. Sirene e Luz Estroboscópica
    const sirenX = w - 75, sirenY = cy;
    p.fill(35, 40, 55);
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.rect(sirenX - 35, sirenY - 55, 70, 110, 6);

    let isRedFlash = isAlarmActive && (p.frameCount % 20 < 10);
    p.fill(isRedFlash ? p.color(255, 30, 30) : p.color(100, 30, 30));
    p.noStroke();
    p.ellipse(sirenX, sirenY - 15, 32, 32);

    if (isRedFlash) {
      p.fill(255, 0, 0, 80);
      p.ellipse(sirenX, sirenY - 15, 65, 65);
    }

    p.fill(255);
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text(isAlarmActive ? "FOGO!\nALARME" : "STANDBY\nSEGURO", sirenX, sirenY + 12);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-detector");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. SATÉLITES GPS SOBRE O GLOBO TERRESTRE (COTIDIANO)
   ========================================================================== */
const simModernaGPS = (p) => {
  let applyEinsteinCorrection = true;
  let elapsedDays = 1.0;

  p.setup = () => {
    const wrap = document.getElementById("canvas-moderna-gps");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-moderna-gps");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const corrToggle = document.getElementById("mod-gps-corr-toggle");
    const daysSlider = document.getElementById("mod-gps-days-slider");

    if (corrToggle) {
      corrToggle.addEventListener("change", (e) => {
        applyEinsteinCorrection = e.target.checked;
        calculatePhysics();
      });
    }

    if (daysSlider) {
      daysSlider.addEventListener("input", (e) => {
        elapsedDays = parseFloat(e.target.value);
        const valElem = document.getElementById("mod-gps-days-val");
        if (valElem) valElem.textContent = `${elapsedDays.toFixed(1)} dias`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const dailyDriftMicroSec = 38.7;
    const totalDriftMicroSec = applyEinsteinCorrection ? 0.0 : dailyDriftMicroSec * elapsedDays;
    const positioningErrorKm = applyEinsteinCorrection ? 0.003 : (totalDriftMicroSec * 1e-6 * 3e8) / 1000;

    const driftElem = document.getElementById("mod-gps-drift-num");
    const errElem = document.getElementById("mod-gps-err-num");
    const statusElem = document.getElementById("mod-gps-status-text");

    if (driftElem) driftElem.textContent = applyEinsteinCorrection ? "0,0 µs (Corrigido)" : `+${totalDriftMicroSec.toFixed(1).replace(".", ",")} µs`;
    if (errElem) errElem.textContent = applyEinsteinCorrection ? "± 3 metros" : `± ${positioningErrorKm.toFixed(1).replace(".", ",")} km`;
    if (statusElem) {
      statusElem.textContent = applyEinsteinCorrection ? "✓ Relatividade Aplicada: Localização Precisa" : "⚠️ Erro Acumulado: GPS Inutilizável sem Einstein";
      statusElem.style.color = applyEinsteinCorrection ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(14, 12, 22);
    const cx = p.width * 0.5, cy = 180;

    p.noStroke();
    p.fill(80, 160, 255, 35);
    p.ellipse(cx, cy, 100, 100);

    p.fill(30, 80, 170);
    p.stroke(100, 180, 255);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 76, 76);

    p.fill(40, 140, 70);
    p.noStroke();
    let rotX = (p.frameCount * 0.4) % 76;
    p.ellipse(cx - 15 + rotX, cy - 10, 22, 14);

    const orbitR = 125;
    p.noFill();
    p.stroke(140, 103, 168, 90);
    p.strokeWeight(1.5);
    p.ellipse(cx, cy, orbitR * 2, orbitR * 2);

    for (let i = 0; i < 4; i++) {
      let ang = (p.frameCount * 0.012 + i * (p.TWO_PI / 4)) % p.TWO_PI;
      let sx = cx + orbitR * Math.cos(ang);
      let sy = cy + orbitR * Math.sin(ang);

      p.stroke(255, 220, 80, 90);
      p.strokeWeight(1.2);
      p.line(sx, sy, cx + 8, cy - 36);

      p.push();
      p.translate(sx, sy);
      p.rotate(ang + p.HALF_PI);

      p.fill(220, 180, 50);
      p.stroke(255);
      p.strokeWeight(1);
      p.rect(-6, -6, 12, 12, 2);

      p.fill(40, 120, 240);
      p.rect(-22, -4, 14, 8, 1);
      p.rect(8, -4, 14, 8, 1);
      p.pop();
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-moderna-gps");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initModernaSims() {
  if (document.getElementById("canvas-moderna-detector")) new p5(simModernaDetectorFumaca);
  if (document.getElementById("canvas-moderna-gps")) new p5(simModernaGPS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModernaSims);
} else {
  initModernaSims();
}
