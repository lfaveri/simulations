/**
 * MÓDULO: TERMOLOGIA & TERMOFÍSICA — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Panela de Pressão Realista com Sopa em Ebulição & Jato de Vapor
 * 2. Efeito Estufa no Carro com Ondas Infravermelhas & Termômetro de Mercúrio
 * 3. Café Quente: Xícara Aberta vs Garrafa Térmica (Dewar com Vácuo)
 * 4. Transmissão Térmica: Condução, Convecção & Radiação
 */

/* ==========================================================================
   1. PANELA DE PRESSÃO COM SOPA EM EBULIÇÃO & VAPOR (COTIDIANO)
   ========================================================================== */
const simTermoPanelaPressao = (p) => {
  let internalPressureAtm = 1.0;
  let flameOn = true;
  let soupBubbles = [];
  let steamParticles = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-panela");

    for (let i = 0; i < 25; i++) {
      soupBubbles.push({
        x: p.random(-60, 60),
        y: p.random(10, 60),
        r: p.random(4, 9),
        speed: p.random(1, 2.5)
      });
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
        document.getElementById("t-pan-p-val").textContent = `${internalPressureAtm.toFixed(2)} atm`;
        calculatePhysics();
      });
    }

    if (flameToggle) {
      flameToggle.addEventListener("change", (e) => {
        flameOn = e.target.checked;
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

    // Chama do Fogão com Núcleo Azul e Chamas Alaranjadas Dançantes
    if (flameOn) {
      drawRealisticBurnerFlame(potX, potY + potH / 2 + 18);
    }

    // Suporte da Grade do Fogão
    p.stroke(60, 55, 75);
    p.strokeWeight(3);
    p.line(potX - 110, potY + potH / 2 + 6, potX + 110, potY + potH / 2 + 6);

    // Panela de Alumínio Polido com Brilho Metálico
    p.fill(85, 90, 105);
    p.stroke(160, 170, 190);
    p.strokeWeight(2);
    p.rect(potX - potW / 2, potY - potH / 2, potW, potH, 8, 8, 18, 18);

    // Cabo de Baquelite Escuro da Panela
    p.fill(20, 20, 25);
    p.stroke(50);
    p.rect(potX + potW / 2, potY - 15, 60, 18, 4);
    p.rect(potX - potW / 2 - 25, potY - 15, 25, 18, 4);

    // Corte Transversal: Caldo / Sopa Fervendo com Legumes
    p.noStroke();
    p.fill(180, 110, 40, 200); // Caldo de legumes
    p.rect(potX - potW / 2 + 6, potY, potW - 12, potH / 2 - 6, 0, 0, 12, 12);

    // Legumes Flutuando (Cenoura e Batata)
    p.fill(240, 100, 30); // Cenoura
    p.ellipse(potX - 35, potY + 25, 14, 10);
    p.ellipse(potX + 40, potY + 35, 12, 9);
    p.fill(220, 200, 120); // Batata
    p.ellipse(potX + 10, potY + 28, 16, 12);
    p.ellipse(potX - 20, potY + 45, 15, 11);

    // Bolhas Hidrodinâmicas de Ebulição
    if (flameOn) {
      p.fill(255, 255, 255, 180);
      soupBubbles.forEach(b => {
        p.ellipse(potX + b.x, potY + b.y, b.r, b.r);
        b.y -= b.speed * (internalPressureAtm > 1.4 ? 1.5 : 1.0);
        if (b.y < 4) {
          b.y = potH / 2 - 10;
          b.x = p.random(-potW / 2 + 15, potW / 2 - 15);
        }
      });
    }

    // Tampa Hermética com Anel de Vedação de Silicone
    p.fill(110, 115, 130);
    p.stroke(200, 210, 230);
    p.strokeWeight(2);
    p.rect(potX - potW / 2 - 6, potY - potH / 2 - 12, potW + 12, 16, 4);

    // Válvula de Controle de Pressão (Pino de Peso)
    p.fill(200, 67, 93);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.rect(potX - 8, potY - potH / 2 - 32, 16, 20, 3);
    p.fill(50);
    p.ellipse(potX, potY - potH / 2 - 32, 10, 6);

    // Jatos Realistas de Vapor Quente Escapando com Pressão
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

    // Desenho das partículas de vapor
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
    // Chamas Alaranjadas
    for (let i = -4; i <= 4; i++) {
      let fx = bx + i * 16;
      let fh = p.random(20, 32);
      p.fill(255, 140, 20, 200);
      p.ellipse(fx, by - 4, 18, fh);
      // Núcleo Azul Intenso de Alta Temperatura
      p.fill(70, 160, 255, 230);
      p.ellipse(fx, by - 2, 10, fh * 0.55);
    }
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-panela");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. EFEITO ESTUFA NO CARRO COM VIDROS FECHADOS (COTIDIANO)
   ========================================================================== */
const simTermoEstufaCarro = (p) => {
  let solarHours = 2.0;
  let windowOpen = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-estufa");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-estufa");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const hSlider = document.getElementById("t-est-hours-slider");
    const winToggle = document.getElementById("t-est-window-toggle");

    if (hSlider) {
      hSlider.addEventListener("input", (e) => {
        solarHours = parseFloat(e.target.value);
        document.getElementById("t-est-hours-val").textContent = `${solarHours.toFixed(1)} h`;
        calculatePhysics();
      });
    }

    if (winToggle) {
      winToggle.addEventListener("change", (e) => {
        windowOpen = e.target.checked;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    let internalTempC = 30;
    if (windowOpen) {
      internalTempC += solarHours * 4.5;
    } else {
      internalTempC += solarHours * 16.0;
    }
    internalTempC = Math.min(68, internalTempC);

    const tempElem = document.getElementById("t-est-temp-num");
    const deltaElem = document.getElementById("t-est-delta-num");
    const warnElem = document.getElementById("t-est-warn-text");

    if (tempElem) tempElem.textContent = `${internalTempC.toFixed(1).replace(".", ",")} °C`;
    if (deltaElem) deltaElem.textContent = `+${(internalTempC - 30).toFixed(1).replace(".", ",")} °C`;
    if (warnElem) {
      warnElem.textContent = internalTempC >= 50 ? "🚨 Perigo Extremo de Hipertermia!" : "Ambiente com ventilação";
      warnElem.style.color = internalTempC >= 50 ? "#c8435d" : "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const carX = p.width * 0.5, carY = 225;

    // Sol Radiante com Raios Luminosos
    p.noStroke();
    p.fill(255, 220, 80);
    p.ellipse(75, 65, 48, 48);
    p.fill(255, 220, 80, 50);
    p.ellipse(75, 65, 75, 75);

    // Feixes de Luz Solar Visível (Amarelos penetrando os vidros)
    p.stroke(255, 240, 120, 160);
    p.strokeWeight(3);
    p.line(100, 80, carX - 35, carY - 45);
    p.line(115, 90, carX + 25, carY - 45);

    // Carrocería do Carro com Detalhes
    p.fill(40, 45, 65);
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.rect(carX - 85, carY - 25, 170, 45, 6);

    // Vidros Transparentes / Fumê (Efeito Estufa)
    p.fill(windowOpen ? 20 : 60, windowOpen ? 20 : 90, windowOpen ? 35 : 130, 170);
    p.stroke(100, 180, 255);
    p.rect(carX - 55, carY - 65, 110, 40, 4);

    // Bancos de Couro no Interior
    p.fill(160, 50, 70);
    p.rect(carX - 42, carY - 44, 32, 18, 2);
    p.rect(carX + 10, carY - 44, 32, 18, 2);

    // Ondas de Calor Infravermelhas Aprisionadas (Vermelhas ondulantes)
    if (!windowOpen) {
      p.stroke(255, 70, 80, 200);
      p.strokeWeight(2);
      p.noFill();
      for (let i = 0; i < 3; i++) {
        let tOff = (p.frameCount * 0.08 + i * 1.5) % p.TWO_PI;
        p.arc(carX - 25, carY - 48, 26, 20 + Math.sin(tOff) * 4, p.PI, p.TWO_PI);
        p.arc(carX + 25, carY - 48, 26, 20 + Math.sin(tOff) * 4, p.PI, p.TWO_PI);
      }
    }

    // Rodas
    p.fill(25);
    p.stroke(120);
    p.strokeWeight(2);
    p.ellipse(carX - 55, carY + 20, 24, 24);
    p.ellipse(carX + 55, carY + 20, 24, 24);

    // Termômetro Digital de Painel ao Lado
    drawDashboardThermometer(p.width - 90, 80);
  };

  function drawDashboardThermometer(tx, ty) {
    let curTemp = windowOpen ? 30 + solarHours * 4.5 : 30 + solarHours * 16.0;
    curTemp = Math.min(68, curTemp);
    const mercuryH = p.map(curTemp, 20, 70, 10, 100);

    // Corpo de Vidro do Termômetro
    p.fill(30, 25, 40);
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.rect(tx, ty, 16, 120, 8);
    p.ellipse(tx + 8, ty + 124, 24, 24);

    // Coluna de Mercúrio Vermelho
    p.fill(240, 50, 70);
    p.noStroke();
    p.ellipse(tx + 8, ty + 124, 18, 18);
    p.rect(tx + 5, ty + 120 - mercuryH, 6, mercuryH, 2);

    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${curTemp.toFixed(0)}°C`, tx + 8, ty + 142);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-estufa");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. CAFÉ QUENTE: XÍCARA VS GARRAFA TÉRMICA (COTIDIANO)
   ========================================================================== */
const simTermoGarrafaTermica = (p) => {
  let elapsedMinutes = 30; // 0 a 120 min

  p.setup = () => {
    const wrap = document.getElementById("canvas-termo-garrafa");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-termo-garrafa");

    initControls();
  };

  function initControls() {
    const mSlider = document.getElementById("t-gar-time-slider");
    if (mSlider) {
      mSlider.addEventListener("input", (e) => {
        elapsedMinutes = parseFloat(e.target.value);
        document.getElementById("t-gar-time-val").textContent = `${elapsedMinutes} min`;
        updatePhysics();
      });
    }
  }

  function updatePhysics() {
    // Xícara aberta: resfriamento exponencial rápido (k = 0.035) -> T = 25 + (85 - 25)*e^(-0.035*t)
    // Garrafa térmica dewar: isolamento a vácuo (k = 0.002) -> T = 25 + (85 - 25)*e^(-0.002*t)
    const tCup = 25 + 60 * Math.exp(-0.035 * elapsedMinutes);
    const tFlask = 25 + 60 * Math.exp(-0.002 * elapsedMinutes);

    const cupElem = document.getElementById("t-gar-cup-num");
    const flaskElem = document.getElementById("t-gar-flask-num");

    if (cupElem) cupElem.textContent = `${tCup.toFixed(1).replace(".", ",")} °C (${tCup < 40 ? "Café Frio" : "Morno"})`;
    if (flaskElem) flaskElem.textContent = `${tFlask.toFixed(1).replace(".", ",")} °C (Pelando de Quente!)`;
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width;

    // 1. Xícara de Cerâmica Aberta (Esquerda)
    const cupX = w * 0.28, cupY = 220;
    p.fill(240, 240, 245);
    p.stroke(180);
    p.strokeWeight(2);
    p.rect(cupX - 35, cupY - 50, 70, 50, 0, 0, 16, 16);
    // Asa da xícara
    p.noFill();
    p.stroke(200);
    p.strokeWeight(5);
    p.arc(cupX + 42, cupY - 25, 24, 28, -p.HALF_PI, p.HALF_PI);

    // Café Líquido
    p.fill(60, 30, 15);
    p.noStroke();
    p.ellipse(cupX, cupY - 48, 64, 14);

    // Fumaça de Vapor Subindo e Dissipando Calor (Convecção & Evaporação)
    p.stroke(220, 220, 230, 140);
    p.strokeWeight(2);
    p.noFill();
    for (let i = -1; i <= 1; i++) {
      let sx = cupX + i * 16;
      let tOff = (p.frameCount * 0.08 + i) % p.TWO_PI;
      p.beginShape();
      p.vertex(sx, cupY - 55);
      p.bezierVertex(sx + Math.sin(tOff) * 12, cupY - 80, sx - Math.sin(tOff) * 12, cupY - 110, sx, cupY - 135);
      p.endShape();
    }

    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Xícara Aberta\nPerde calor por Convecção, Condução e Evaporação", cupX, cupY + 15);

    // 2. Garrafa Térmica de Dewar (Direita)
    const flaskX = w * 0.72, flaskY = 220;

    // Parede Externa de Inox
    p.fill(160, 165, 180);
    p.stroke(220);
    p.strokeWeight(2);
    p.rect(flaskX - 45, flaskY - 120, 90, 120, 8, 8, 12, 12);

    // Parede Interna Espelhada com Vácuo
    p.fill(24, 20, 35);
    p.stroke(201, 174, 222);
    p.rect(flaskX - 35, flaskY - 105, 70, 100, 4);

    // Café Quente Aprisionado
    p.fill(75, 35, 18);
    p.noStroke();
    p.rect(flaskX - 30, flaskY - 95, 60, 88, 2);

    // Rolha / Tampa Isolante
    p.fill(40, 40, 45);
    p.stroke(140);
    p.rect(flaskX - 25, flaskY - 140, 50, 22, 4);

    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Garrafa Térmica (Dewar)\nVácuo anula Condução/Convecção e Espelho reflete Radiação", flaskX, flaskY + 15);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-termo-garrafa");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-termo-panela")) new p5(simTermoPanelaPressao);
  if (document.getElementById("canvas-termo-estufa")) new p5(simTermoEstufaCarro);
  if (document.getElementById("canvas-termo-garrafa")) new p5(simTermoGarrafaTermica);
});
