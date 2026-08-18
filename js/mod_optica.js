/**
 * MÓDULO: ÓPTICA GEOMÉTRICA — LABORATÓRIO VIRTUAL COM VISUAL REALISTA & FÍSICA DO COTIDIANO
 * 1. Miragem no Asfalto Quente da Rodovia (com Coqueiro, Estrada e Reflexo Trêmulo)
 * 2. Gota de Chuva Cristalina & Formação Completa do Arco-Íris
 * 3. Olho Humano, Miopia & Correção com Óculos de Grau
 * 4. Banco Óptico de Lentes & Espelhos
 */

/* ==========================================================================
   1. MIRAGEM NO ASFALTO QUENTE DA RODOVIA (COTIDIANO)
   ========================================================================== */
const simOpticaMiragem = (p) => {
  let asphaltTempC = 60; // 30°C a 70°C

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-miragem");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-miragem");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const tSlider = document.getElementById("o-mir-temp-slider");
    if (tSlider) {
      tSlider.addEventListener("input", (e) => {
        asphaltTempC = parseFloat(e.target.value);
        document.getElementById("o-mir-temp-val").textContent = `${asphaltTempC} °C`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const isMirageVisible = asphaltTempC >= 45;
    const mirageStrength = Math.max(0, (asphaltTempC - 40) / 30);

    const gradElem = document.getElementById("o-mir-grad-num");
    const statusElem = document.getElementById("o-mir-status-text");

    if (gradElem) gradElem.textContent = `Δn ≈ -${(mirageStrength * 0.0003).toFixed(5)}`;
    if (statusElem) {
      statusElem.textContent = isMirageVisible ? "Miragem Nítida: Reflexão do céu e árvores no asfalto quente" : "Sem miragem (Gradiente térmico insuficiente)";
      statusElem.style.color = isMirageVisible ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 240;

    // 1. Céu Azul Gradiente
    for (let y = 0; y < roadY; y += 4) {
      let t = y / roadY;
      p.stroke(p.lerp(30, 90, t), p.lerp(60, 150, t), p.lerp(140, 220, t));
      p.strokeWeight(4);
      p.line(0, y, p.width, y);
    }

    // 2. Montanhas ao Fundo
    p.fill(60, 90, 130);
    p.noStroke();
    p.beginShape();
    p.vertex(0, roadY);
    p.vertex(80, roadY - 60);
    p.vertex(160, roadY - 30);
    p.vertex(260, roadY - 70);
    p.vertex(380, roadY - 20);
    p.vertex(p.width, roadY - 50);
    p.vertex(p.width, roadY);
    p.endShape(p.CLOSE);

    // 3. Asfalto da Rodovia
    p.fill(28, 25, 35);
    p.rect(0, roadY, p.width, p.height - roadY);

    // Faixa Amarela Central da Rodovia
    p.stroke(255, 215, 0, 200);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([16, 14]);
    p.line(0, roadY + 50, p.width, roadY + 50);
    p.drawingContext.setLineDash([]);

    // 4. Coqueiro à Beira da Estrada no Lado Direito
    const treeX = p.width - 90, treeY = roadY;
    drawPalmTree(treeX, treeY);

    // 5. Ondas de Calor Tremeluzentes no Ar Próximo ao Asfalto Quente
    if (asphaltTempC >= 45) {
      p.noStroke();
      for (let y = roadY - 35; y < roadY; y += 4) {
        let alpha = p.map(y, roadY - 35, roadY, 0, (asphaltTempC / 70) * 110);
        p.fill(255, 180, 100, alpha);
        p.rect(0, y, p.width, 4);
      }
    }

    // 6. Observador / Condutor na Esquerda
    const obsX = 50, obsEyeY = roadY - 50;
    p.fill(240, 190, 160);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(obsX, obsEyeY, 14, 14);
    p.line(obsX, obsEyeY + 7, obsX, roadY);

    // 7. Traçado Realista de Raio Curvilíneo com Reflexão Total
    if (asphaltTempC >= 45) {
      const bendX = p.width * 0.52, bendY = roadY - 3;

      // Raio vindo do topo do coqueiro / céu curvando no ar quente
      p.stroke(100, 220, 255);
      p.strokeWeight(2.5);
      p.noFill();
      p.beginShape();
      p.vertex(treeX - 20, treeY - 85);
      p.bezierVertex(treeX - 60, bendY, bendX + 40, bendY, bendX, bendY);
      p.bezierVertex(bendX - 40, bendY, obsX + 30, obsEyeY, obsX, obsEyeY);
      p.endShape();

      // Reflexão Trêmula no Asfalto ("Poça d'Água" com Reflexo do Coqueiro Invertido)
      p.noStroke();
      p.fill(100, 200, 255, 170);
      p.ellipse(bendX, roadY + 2, 110, 14);

      // Coqueiro Invertido Refletido no Asfalto
      p.push();
      p.translate(bendX, roadY + 2);
      p.scale(0.5, -0.3);
      p.tint(255, 120);
      drawPalmTree(0, 0);
      p.pop();
    }
  };

  function drawPalmTree(x, y) {
    // Tronco Curvo
    p.stroke(110, 75, 45);
    p.strokeWeight(6);
    p.noFill();
    p.bezier(x, y, x - 10, y - 40, x - 5, y - 70, x - 20, y - 90);

    // Folhas Verdes
    p.stroke(34, 139, 34);
    p.strokeWeight(3);
    for (let i = 0; i < 6; i++) {
      let ang = -p.PI * 0.8 + i * 0.35;
      let lx = (x - 20) + Math.cos(ang) * 35;
      let ly = (y - 90) + Math.sin(ang) * 20;
      p.line(x - 20, y - 90, lx, ly);
    }
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-miragem");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. GOTA DE CHUVA CRISTALINA & ARCO-ÍRIS COMPLETO (COTIDIANO)
   ========================================================================== */
const simOpticaArcoIris = (p) => {
  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-arcoiris");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-arcoiris");
  };

  p.draw = () => {
    p.background(18, 16, 28);
    const dropX = p.width * 0.52, dropY = 175, dropR = 85;

    // Fundo com Arco-Íris no Céu ao Fundo
    drawBackgroundRainbow(p.width * 0.18, 140);

    // 1. Gota de Chuva Esférica de Alta Transparência & Brilho
    p.fill(30, 45, 75, 140);
    p.stroke(140, 190, 255);
    p.strokeWeight(3);
    p.ellipse(dropX, dropY, dropR * 2, dropR * 2);

    // Brilho Especular de Vidro/Água na Gota
    p.noStroke();
    p.fill(255, 255, 255, 120);
    p.ellipse(dropX - dropR * 0.5, dropY - dropR * 0.5, 22, 14);

    // 2. Feixe Solar de Luz Branca Incidente
    const incX = dropX - dropR * 0.7;
    const incY = dropY - dropR * 0.7;
    p.stroke(255, 255, 240);
    p.strokeWeight(4);
    p.line(40, incY, incX, incY);
    p.noStroke();
    p.fill(255, 255, 200);
    p.textSize(10);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Luz Solar Branca", 45, incY - 6);

    // 3. Dispersão Cromática com Cores do Espectro no Interior da Gota
    const colors = [
      { name: "Vermelho (42°)", col: p.color(255, 50, 50), n: 1.331, yOff: 0.15 },
      { name: "Laranja", col: p.color(255, 140, 0), n: 1.333, yOff: 0.19 },
      { name: "Amarelo", col: p.color(255, 220, 0), n: 1.335, yOff: 0.23 },
      { name: "Verde", col: p.color(50, 205, 50), n: 1.338, yOff: 0.27 },
      { name: "Azul", col: p.color(30, 144, 255), n: 1.341, yOff: 0.31 },
      { name: "Violeta (40°)", col: p.color(180, 80, 255), n: 1.344, yOff: 0.35 }
    ];

    colors.forEach(c => {
      let backX = dropX + dropR * (0.86 + (c.n - 1.33) * 0.8);
      let backY = dropY - dropR * c.yOff;
      let exitX = dropX - dropR * (0.65 - (c.n - 1.33) * 0.8);
      let exitY = dropY + dropR * (0.75 + (c.n - 1.33) * 0.5);

      // Traçado Interno de Refração
      p.stroke(c.col);
      p.strokeWeight(2);
      p.line(incX, incY, backX, backY);

      // Reflexão Total Interna
      p.line(backX, backY, exitX, exitY);

      // 2ª Refração Emergindo da Gota para o Olho
      p.line(exitX, exitY, exitX - 110, exitY + 70 + (c.n - 1.33) * 80);
    });
  };

  function drawBackgroundRainbow(rx, ry) {
    p.noFill();
    const cols = [
      p.color(255, 0, 0, 100),
      p.color(255, 127, 0, 100),
      p.color(255, 255, 0, 100),
      p.color(0, 255, 0, 100),
      p.color(0, 0, 255, 100),
      p.color(139, 0, 255, 100)
    ];
    cols.forEach((col, idx) => {
      p.stroke(col);
      p.strokeWeight(5);
      p.arc(rx, ry + 120, 260 - idx * 8, 260 - idx * 8, p.PI, p.TWO_PI);
    });
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-arcoiris");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. OLHO HUMANO, MIOPIA & CORREÇÃO COM ÓCULOS (COTIDIANO)
   ========================================================================== */
const simOpticaOlhoHumano = (p) => {
  let hasGlasses = false;

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-olho");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-olho");

    initControls();
  };

  function initControls() {
    const glassesToggle = document.getElementById("o-eye-glasses-toggle");
    if (glassesToggle) {
      glassesToggle.addEventListener("change", (e) => {
        hasGlasses = e.target.checked;
        const statusElem = document.getElementById("o-eye-status-text");
        if (statusElem) {
          statusElem.textContent = hasGlasses ? "Visão Nítida Corrigida (Foco Exato na Retina)" : "Miopia Sem Correção (Foco antes da Retina = Visão Embaçada)";
          statusElem.style.color = hasGlasses ? "#2e8b57" : "#c8435d";
        }
      });
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const eyeX = p.width * 0.65, eyeY = 180, eyeR = 85;

    // 1. Globo Ocular Humano Anatômico
    p.fill(245, 245, 250);
    p.stroke(140, 103, 168);
    p.strokeWeight(3);
    p.ellipse(eyeX, eyeY, eyeR * 2, eyeR * 1.8);

    // Retina (Camada Sensível no Fundo do Olho)
    p.stroke(220, 70, 70);
    p.strokeWeight(5);
    p.noFill();
    p.arc(eyeX, eyeY, eyeR * 2 - 4, eyeR * 1.8 - 4, -p.QUARTER_PI * 1.2, p.QUARTER_PI * 1.2);

    // Córnea Transparente Curva Dianteira
    p.stroke(100, 180, 255);
    p.strokeWeight(3);
    p.arc(eyeX - eyeR + 8, eyeY, 40, 70, p.HALF_PI, p.PI + p.HALF_PI);

    // Cristalino (Lente Natural do Olho)
    p.fill(160, 210, 255, 180);
    p.stroke(100, 160, 240);
    p.strokeWeight(1.5);
    p.ellipse(eyeX - eyeR + 25, eyeY, 18, 50);

    // 2. Óculos de Grau Divergentes (se ativados)
    const glassesX = eyeX - eyeR - 55;
    if (hasGlasses) {
      p.stroke(201, 174, 222);
      p.strokeWeight(4);
      p.noFill();
      p.line(glassesX, eyeY - 45, glassesX, eyeY + 45); // Armação
      p.fill(180, 230, 255, 120);
      p.stroke(120, 200, 255);
      p.strokeWeight(1.5);
      // Lente Bicôncava Divergente
      p.rect(glassesX - 6, eyeY - 40, 12, 80, 2);
      p.noStroke();
      p.fill(201, 174, 222);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("Lente Divergente (Óculos)", glassesX, eyeY - 48);
    }

    // 3. Raios de Luz Paralelos Entrando
    const rayStartX = 30;
    const focusX = hasGlasses ? (eyeX + eyeR - 4) : (eyeX + eyeR - 45); // Na retina com óculos, antes sem óculos

    p.stroke(255, 220, 80, 200);
    p.strokeWeight(2);
    for (let dy of [-25, 0, 25]) {
      let yIn = eyeY + dy;
      if (hasGlasses) {
        // Desvio divergente ao passar pelos óculos
        p.line(rayStartX, yIn, glassesX, yIn);
        p.line(glassesX, yIn, eyeX - eyeR + 25, yIn + dy * 0.2);
        p.line(eyeX - eyeR + 25, yIn + dy * 0.2, focusX, eyeY);
      } else {
        // Foco incorreto antes da retina (Miopia)
        p.line(rayStartX, yIn, eyeX - eyeR + 25, yIn);
        p.line(eyeX - eyeR + 25, yIn, focusX, eyeY);
      }
    }

    // Ponto Focal
    p.noStroke();
    p.fill(hasGlasses ? 46 : 220, hasGlasses ? 204 : 70, hasGlasses ? 113 : 70);
    p.ellipse(focusX, eyeY, 8, 8);
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(hasGlasses ? "Foco Nítido na Retina" : "Foco Antes da Retina (Miopia)", focusX, eyeY + 8);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-olho");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-optica-miragem")) new p5(simOpticaMiragem);
  if (document.getElementById("canvas-optica-arcoiris")) new p5(simOpticaArcoIris);
  if (document.getElementById("canvas-optica-olho")) new p5(simOpticaOlhoHumano);
});
