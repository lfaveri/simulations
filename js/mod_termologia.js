/**
 * MÓDULO: TERMOLOGIA & TERMOFÍSICA — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Cozimento do Ovo por Condução Térmica Radial (Desnaturação de Proteínas)
 * 2. Formação de Nuvens, Expansão Adiabática & Ciclo da Chuva
 * 3. Panela de Pressão com Sopa em Ebulição & Válvula de Vapor
 */

/* ==========================================================================
   1. COZIMENTO DO OVO POR CONDUÇÃO TÉRMICA (COTIDIANO)
   ========================================================================== */
const simTermoCozimentoOvo = (p) => {
  let cookingTimeMin = 6.0;
  let isCooking = true;
  let potBubbles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-ovo");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-ovo");

    for (let i = 0; i < 25; i++) {
      potBubbles.push({ x: p.random(-70, 70), y: p.random(20, 100), r: p.random(3, 8), speed: p.random(1.2, 2.8) });
    }

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const tSlider = document.getElementById("t-ovo-time-slider");
    const cookToggle = document.getElementById("t-ovo-cook-toggle");

    if (tSlider) {
      tSlider.addEventListener("input", (e) => {
        cookingTimeMin = parseFloat(e.target.value);
        const valElem = document.getElementById("t-ovo-time-val");
        if (valElem) valElem.textContent = `${cookingTimeMin.toFixed(1)} min`;
        calculatePhysics();
      });
    }

    if (cookToggle) {
      cookToggle.addEventListener("change", (e) => {
        isCooking = e.target.checked;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const outerWhiteTempC = Math.min(100, 20 + 80 * (1 - Math.exp(-0.45 * cookingTimeMin)));
    const yolkCoreTempC = Math.min(100, 20 + 80 * (1 - Math.exp(-0.16 * cookingTimeMin)));

    let eggState = "Ovo Cru (Líquido)";
    if (cookingTimeMin >= 4.0 && cookingTimeMin < 6.5) {
      eggState = "Ovo Mollet / Coque (Clara firme, Gema mole cremosa)";
    } else if (cookingTimeMin >= 6.5 && cookingTimeMin < 9.5) {
      eggState = "Ovo Cozido Perfeito (Clara sólida, Gema macia)";
    } else if (cookingTimeMin >= 9.5) {
      eggState = "Ovo Duro (Totalmente cozido e firme)";
    }

    const tWhiteElem = document.getElementById("t-ovo-twhite-num");
    const tYolkElem = document.getElementById("t-ovo-tyolk-num");
    const statusElem = document.getElementById("t-ovo-status-text");

    if (tWhiteElem) tWhiteElem.textContent = `${outerWhiteTempC.toFixed(0)} °C (Clara)`;
    if (tYolkElem) tYolkElem.textContent = `${yolkCoreTempC.toFixed(0)} °C (Gema)`;
    if (statusElem) {
      statusElem.textContent = eggState;
      statusElem.style.color = cookingTimeMin >= 4 ? "#2e8b57" : "#cba36b";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const potX = p.width * 0.5, potY = 175, potW = 200, potH = 150;

    // 1. Água Fervendo na Panela
    p.fill(60, 55, 75);
    p.stroke(140, 103, 168);
    p.strokeWeight(2.5);
    p.rect(potX - potW / 2, potY - potH / 2, potW, potH, 0, 0, 14, 14);

    p.fill(50, 95, 170, 160);
    p.noStroke();
    p.rect(potX - potW / 2 + 4, potY - potH / 2 + 20, potW - 8, potH - 24, 0, 0, 10, 10);

    // Bolhas de Ebulição
    if (isCooking) {
      p.fill(255, 255, 255, 180);
      potBubbles.forEach(b => {
        p.ellipse(potX + b.x, potY + b.y, b.r, b.r);
        b.y -= b.speed;
        if (b.y < -potH / 2 + 25) {
          b.y = potH / 2 - 10;
          b.x = p.random(-potW / 2 + 15, potW / 2 - 15);
        }
      });
    }

    // 2. CORTE TRANSVERSAL DO OVO MOSTRANDO O GRADIENTE TÉRMICO
    const eggX = potX, eggY = potY + 15, eggW = 100, eggH = 130;

    // Casca do Ovo (100°C na água)
    p.fill(235, 215, 185);
    p.stroke(190, 160, 120);
    p.strokeWeight(3);
    p.ellipse(eggX, eggY, eggW, eggH);

    // Clara de Ovo (Albumen)
    let whiteProgress = p.constrain(p.map(cookingTimeMin, 1, 6, 0, 1), 0, 1);
    let whiteColor = p.lerpColor(p.color(240, 230, 190, 120), p.color(255, 255, 255, 245), whiteProgress);
    p.fill(whiteColor);
    p.noStroke();
    p.ellipse(eggX, eggY, eggW - 8, eggH - 8);

    // Gema de Ovo (Centro)
    const yolkR = 48;
    let yolkProgress = p.constrain(p.map(cookingTimeMin, 3, 10, 0, 1), 0, 1);
    let yolkColor = p.lerpColor(p.color(255, 170, 0), p.color(255, 215, 60), yolkProgress);
    p.fill(yolkColor);
    p.stroke(220, 140, 0);
    p.strokeWeight(1.5);
    p.ellipse(eggX, eggY + 5, yolkR, yolkR);

    // 3. Setas de Condução Radial de Calor
    if (isCooking && cookingTimeMin < 10) {
      p.stroke(255, 80, 80, 200);
      p.strokeWeight(2);
      for (let ang = 0; ang < p.TWO_PI; ang += p.PI / 4) {
        let r1 = eggW * 0.45;
        let r2 = eggW * 0.25;
        let x1 = eggX + Math.cos(ang) * r1;
        let y1 = eggY + Math.sin(ang) * (r1 * 1.25);
        let x2 = eggX + Math.cos(ang) * r2;
        let y2 = eggY + Math.sin(ang) * (r2 * 1.25);
        p.line(x1, y1, x2, y2);
      }
    }

    // Chama do Fogão
    if (isCooking) {
      p.noStroke();
      p.fill(255, 140, 30, 220);
      p.ellipse(potX, potY + potH / 2 + 15, 70, 22);
      p.fill(80, 170, 255, 230);
      p.ellipse(potX, potY + potH / 2 + 15, 40, 14);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-ovo");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. FORMAÇÃO DE NUVENS, EXPANSÃO ADIABÁTICA & CHUVA (COTIDIANO)
   ========================================================================== */
const simTermoFormacaoNuvens = (p) => {
  let sunPower = 80;
  let isRaining = true;
  let vaporParticles = [];
  let rainDrops = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-nuvens");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-nuvens");

    for (let i = 0; i < 30; i++) {
      vaporParticles.push({
        x: p.random(80, 220),
        y: p.random(260, 310),
        vy: p.random(0.8, 1.8),
        size: p.random(6, 14)
      });
    }

    for (let i = 0; i < 40; i++) {
      rainDrops.push({ x: p.random(w * 0.55, w * 0.85), y: p.random(140, 300), speed: p.random(6, 11) });
    }

    initControls();
  };

  function initControls() {
    const sunSlider = document.getElementById("t-nuv-sun-slider");
    const rainToggle = document.getElementById("t-nuv-rain-toggle");

    if (sunSlider) {
      sunSlider.addEventListener("input", (e) => {
        sunPower = parseFloat(e.target.value);
        const valElem = document.getElementById("t-nuv-sun-val");
        if (valElem) valElem.textContent = `${sunPower}%`;
      });
    }

    if (rainToggle) {
      rainToggle.addEventListener("change", (e) => {
        isRaining = e.target.checked;
        const statusElem = document.getElementById("t-nuv-status-text");
        if (statusElem) {
          statusElem.textContent = isRaining ? "Precipitação Ativa: Gotículas atingem massa crítica" : "Apenas Condensação (Sem chuva)";
        }
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width;

    // 1. Céu com Gradiente de Altitude e Temperatura
    for (let y = 0; y < 270; y += 4) {
      let t = y / 270;
      p.stroke(p.lerp(20, 70, t), p.lerp(30, 130, t), p.lerp(80, 200, t));
      p.strokeWeight(4);
      p.line(0, y, w, y);
    }

    // Régua de Temperatura
    p.fill(255);
    p.textSize(9);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("Altitude 3.000m (0 °C - Ponto de Orvalho / Condensação)", 20, 80);
    p.text("Altitude 1.500m (15 °C - Expansão Adiabática ΔU < 0)", 20, 170);
    p.text("Superfície (30 °C - Evaporação e Convecção)", 20, 255);

    // 2. Solo e Lago
    p.fill(34, 100, 50);
    p.noStroke();
    p.rect(0, 270, 100, 90);
    p.fill(30, 80, 160);
    p.rect(100, 270, w - 100, 90);

    // 3. Sol Radiante
    let sunR = p.map(sunPower, 30, 100, 30, 50);
    p.fill(255, 220, 80);
    p.ellipse(70, 45, sunR, sunR);

    // 4. Vapor de Água Subindo
    p.fill(220, 240, 255, 140);
    vaporParticles.forEach(vp => {
      p.ellipse(vp.x, vp.y, vp.size, vp.size);
      vp.y -= vp.vy * (sunPower / 80);
      vp.size += 0.08;
      if (vp.y < 95) {
        vp.y = p.random(270, 310);
        vp.x = p.random(100, 260);
        vp.size = p.random(6, 12);
      }
    });

    // 5. Nuvem Cumulonimbus
    const cloudX = w * 0.70, cloudY = 95;
    drawRealisticCloud(cloudX, cloudY);

    // 6. Chuva Precipitando
    if (isRaining) {
      p.stroke(140, 190, 255, 180);
      p.strokeWeight(1.8);
      rainDrops.forEach(rd => {
        p.line(rd.x, rd.y, rd.x - 1, rd.y + 12);
        rd.y += rd.speed;
        if (rd.y > 270) {
          rd.y = cloudY + 30;
          rd.x = p.random(cloudX - 60, cloudX + 60);
        }
      });
    }
  };

  function drawRealisticCloud(cx, cy) {
    p.noStroke();
    p.fill(235, 240, 250, 230);
    p.ellipse(cx, cy, 100, 50);
    p.ellipse(cx - 35, cy + 5, 65, 45);
    p.ellipse(cx + 35, cy + 5, 70, 45);
    p.ellipse(cx - 15, cy - 20, 75, 55);
    p.ellipse(cx + 20, cy - 15, 65, 50);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-nuvens");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   3. PANELA DE PRESSÃO COM SOPA EM EBULIÇÃO & VAPOR (COTIDIANO)
   ========================================================================== */
const simTermoPanelaPressao = (p) => {
  let internalPressureAtm = 1.0;
  let flameOn = true;
  let soupBubbles = [];
  let steamParticles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-panela");

    for (let i = 0; i < 25; i++) {
      soupBubbles.push({ x: p.random(-60, 60), y: p.random(10, 60), r: p.random(4, 9), speed: p.random(1, 2.5) });
    }

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const pSlider = document.getElementById("t-pan-p-slider");
    const flameToggle = document.getElementById("t-pan-flame-toggle");

    if (pSlider) {
      pSlider.addEventListener("input", (e) => {
        internalPressureAtm = parseFloat(e.target.value);
        const valElem = document.getElementById("t-pan-p-val");
        if (valElem) valElem.textContent = `${internalPressureAtm.toFixed(2)} atm`;
        calculatePhysics();
      });
    }

    if (flameToggle) {
      flameToggle.addEventListener("change", (e) => {
        flameOn = e.target.checked;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const boilingTempC = 100 + 20.4 * (internalPressureAtm - 1.0);
    const cookingSpeed = Math.pow(2, (boilingTempC - 100) / 10);

    const tempElem = document.getElementById("t-pan-temp-num");
    const speedElem = document.getElementById("t-pan-speed-num");
    const statusElem = document.getElementById("t-pan-status-text");

    if (tempElem) tempElem.textContent = `${boilingTempC.toFixed(1).replace(".", ",")} °C`;
    if (speedElem) speedElem.textContent = `${cookingSpeed.toFixed(1).replace(".", ",")}× mais rápido`;
    if (statusElem) {
      statusElem.textContent = internalPressureAtm > 1.8 ? "Válvula de Segurança chiando em alta pressão" : "Pressurização normal de cozimento";
      statusElem.style.color = internalPressureAtm > 1.8 ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const potX = p.width * 0.5, potY = 175, potW = 170, potH = 135;

    // Chama do Fogão
    if (flameOn) {
      drawRealisticBurnerFlame(potX, potY + potH / 2 + 18);
    }

    // Panela de Alumínio Polido
    p.fill(85, 90, 105);
    p.stroke(160, 170, 190);
    p.strokeWeight(2);
    p.rect(potX - potW / 2, potY - potH / 2, potW, potH, 8, 8, 18, 18);

    // Cabos
    p.fill(20, 20, 25);
    p.stroke(50);
    p.rect(potX + potW / 2, potY - 15, 60, 18, 4);
    p.rect(potX - potW / 2 - 25, potY - 15, 25, 18, 4);

    // Sopa Fervendo com Legumes
    p.noStroke();
    p.fill(180, 110, 40, 200);
    p.rect(potX - potW / 2 + 6, potY, potW - 12, potH / 2 - 6, 0, 0, 12, 12);

    p.fill(240, 100, 30); // Cenoura
    p.ellipse(potX - 35, potY + 25, 14, 10);
    p.ellipse(potX + 40, potY + 35, 12, 9);
    p.fill(220, 200, 120); // Batata
    p.ellipse(potX + 10, potY + 28, 16, 12);

    // Bolhas
    if (flameOn) {
      p.fill(255, 255, 255, 180);
      soupBubbles.forEach(b => {
        p.ellipse(potX + b.x, potY + b.y, b.r, b.r);
        b.y -= b.speed;
        if (b.y < 4) {
          b.y = potH / 2 - 10;
          b.x = p.random(-potW / 2 + 15, potW / 2 - 15);
        }
      });
    }

    // Tampa Hermética & Válvula
    p.fill(110, 115, 130);
    p.stroke(200, 210, 230);
    p.strokeWeight(2);
    p.rect(potX - potW / 2 - 6, potY - potH / 2 - 12, potW + 12, 16, 4);

    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(potX - 8, potY - potH / 2 - 32, 16, 20, 3);

    // Jatos de Vapor
    if (flameOn && internalPressureAtm > 1.1) {
      if (p.frameCount % 2 === 0) {
        steamParticles.push({
          x: potX - 7 + p.random(-2, 2),
          y: potY - potH / 2 - 34,
          vx: p.random(-1.5, -0.5),
          vy: p.random(-2.5, -4),
          r: p.random(6, 12),
          alpha: 180
        });
        steamParticles.push({
          x: potX + 7 + p.random(-2, 2),
          y: potY - potH / 2 - 34,
          vx: p.random(0.5, 1.5),
          vy: p.random(-2.5, -4),
          r: p.random(6, 12),
          alpha: 180
        });
      }
    }

    for (let i = steamParticles.length - 1; i >= 0; i--) {
      let st = steamParticles[i];
      p.noStroke();
      p.fill(235, 240, 255, st.alpha);
      p.ellipse(st.x, st.y, st.r, st.r);
      st.x += st.vx;
      st.y += st.vy;
      st.r += 0.4;
      st.alpha -= 5;
      if (st.alpha <= 0) steamParticles.splice(i, 1);
    }
  };

  function drawRealisticBurnerFlame(bx, by) {
    p.noStroke();
    for (let i = -4; i <= 4; i++) {
      let fx = bx + i * 16;
      let fh = p.random(20, 32);
      p.fill(255, 140, 20, 200);
      p.ellipse(fx, by - 4, 18, fh);
      p.fill(70, 160, 255, 230);
      p.ellipse(fx, by - 2, 10, fh * 0.55);
    }
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initTermologiaSims() {
  if (document.getElementById("canvas-termo-ovo")) new p5(simTermoCozimentoOvo);
  if (document.getElementById("canvas-termo-nuvens")) new p5(simTermoFormacaoNuvens);
  if (document.getElementById("canvas-termo-panela")) new p5(simTermoPanelaPressao);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTermologiaSims);
} else {
  initTermologiaSims();
}
