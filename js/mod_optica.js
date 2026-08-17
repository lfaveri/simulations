/**
 * MÓDULO: ÓPTICA GEOMÉTRICA — LABORATÓRIO VIRTUAL COMPLETO
 * 1. Banco de Lentes Delgadas & Espelhos Esféricos (Convergente, Divergente, Côncavo e Convexo)
 * 2. Refração Laser & Reflexão Total (Lei de Snell-Descartes)
 */

/* ==========================================================================
   1. BANCO ÓPTICO: LENTES DELGADAS & ESPELHOS ESFÉRICOS
   ========================================================================== */
const simOpticaLente = (p) => {
  // Tipos: "lente_conv", "lente_div", "espelho_conc", "espelho_conv"
  let optType = "lente_conv"; 
  let pDist = 120; // cm (distância do objeto)
  let fDist = 50;  // cm (distância focal em módulo)
  let objHeight = 40; // cm (altura do objeto)

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-lente");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-lente");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const typeSelect = document.getElementById("o2-type-select");
    const pSlider = document.getElementById("o2-p-slider");
    const fSlider = document.getElementById("o2-f-slider");

    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        optType = e.target.value;
        calculatePhysics();
      });
    }

    if (pSlider) {
      pSlider.addEventListener("input", (e) => {
        pDist = parseFloat(e.target.value);
        document.getElementById("o2-p-val").textContent = `${pDist} cm`;
        calculatePhysics();
      });
    }

    if (fSlider) {
      fSlider.addEventListener("input", (e) => {
        fDist = parseFloat(e.target.value);
        document.getElementById("o2-f-val").textContent = `${fDist} cm`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    let fSigned = fDist;
    if (optType === "lente_div" || optType === "espelho_conv") {
      fSigned = -fDist;
    }

    // Equação de Gauss: 1/f = 1/p + 1/p' => p' = (p*f)/(p - f)
    let pPrime = 0;
    let isInfinite = false;

    if (Math.abs(pDist - fSigned) < 0.5) {
      isInfinite = true;
    } else {
      pPrime = (pDist * fSigned) / (pDist - fSigned);
    }

    const A = isInfinite ? 0 : -pPrime / pDist;
    const diopters = (100 / fSigned);

    const pprimeElem = document.getElementById("o2-pprime-num");
    const aElem = document.getElementById("o2-a-num");
    const typeElem = document.getElementById("o2-type-text");

    if (pprimeElem) {
      pprimeElem.textContent = isInfinite ? "No Infinito (Imprópria)" : `${pPrime.toFixed(1).replace(".", ",")} cm`;
    }
    if (aElem) {
      aElem.textContent = isInfinite ? "—" : `${A.toFixed(2).replace(".", ",")}× (${diopters > 0 ? "+" : ""}${diopters.toFixed(1)} di)`;
    }
    if (typeElem) {
      if (isInfinite) {
        typeElem.textContent = "Imagem Imprópria (Raios Paralelos)";
        typeElem.style.color = "#c8435d";
      } else {
        const isReal = (optType.startsWith("lente") && pPrime > 0) || (optType.startsWith("espelho") && pPrime > 0);
        const isErect = A > 0;
        const sizeText = Math.abs(A) > 1.05 ? "Maior" : Math.abs(A) < 0.95 ? "Menor" : "Igual";
        typeElem.textContent = `${isReal ? "Real" : "Virtual"}, ${isErect ? "Direita" : "Invertida"} e ${sizeText}`;
        typeElem.style.color = isReal ? "#2e8b57" : "#3b6cb5";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const ox = p.width * 0.5; // Centro óptico / Vértice
    const oy = p.height * 0.5;
    const pxScale = 1.6;

    let fSigned = fDist;
    if (optType === "lente_div" || optType === "espelho_conv") fSigned = -fDist;

    // Eixo Principal
    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(20, oy, p.width - 20, oy);

    // Focos e Pontos Antiprincipais
    drawFoci(ox, oy, pxScale, fSigned);

    // Elemento Óptico (Lente ou Espelho)
    drawOpticalElement(ox, oy);

    // Objeto (Seta à esquerda)
    const objX = ox - pDist * pxScale;
    const objY = oy - objHeight;
    drawArrow(objX, oy, objX, objY, p.color(200, 67, 93), "Objeto (o)");

    // Cálculo da Imagem
    if (Math.abs(pDist - fSigned) >= 0.5) {
      let pPrime = (pDist * fSigned) / (pDist - fSigned);
      let A = -pPrime / pDist;
      let imgH = objHeight * A;
      
      let imgX;
      if (optType.startsWith("lente")) {
        imgX = ox + pPrime * pxScale;
      } else { // Espelho
        imgX = ox - pPrime * pxScale;
      }
      let imgY = oy - imgH;

      // Desenha Imagem
      const imgColor = pPrime > 0 ? p.color(46, 139, 87) : p.color(59, 108, 181);
      drawArrow(imgX, oy, imgX, imgY, imgColor, pPrime > 0 ? "Img Real (i)" : "Img Virtual (i)");

      // Traçado dos Raios Notáveis
      drawRayTracing(ox, oy, pxScale, objX, objY, imgX, imgY, fSigned);
    }
  };

  function drawFoci(ox, oy, pxScale, fSigned) {
    p.noStroke();
    p.fill(201, 174, 222);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);

    // Focos (F e F')
    const fPx = Math.abs(fSigned) * pxScale;
    p.ellipse(ox - fPx, oy, 6, 6);
    p.text("F", ox - fPx, oy - 6);

    p.ellipse(ox + fPx, oy, 6, 6);
    p.text("F'", ox + fPx, oy - 6);

    // Pontos Antiprincipais (2F e 2F')
    p.fill(160, 140, 180);
    p.ellipse(ox - 2 * fPx, oy, 5, 5);
    p.text("2F", ox - 2 * fPx, oy - 6);

    p.ellipse(ox + 2 * fPx, oy, 5, 5);
    p.text("2F'", ox + 2 * fPx, oy - 6);
  }

  function drawOpticalElement(ox, oy) {
    p.stroke(201, 174, 222);
    p.strokeWeight(3);
    p.line(ox, oy - 120, ox, oy + 120);

    p.fill(201, 174, 222);
    if (optType === "lente_conv") {
      // Setas para fora (convergente / biconvexa)
      p.triangle(ox, oy - 125, ox - 6, oy - 110, ox + 6, oy - 110);
      p.triangle(ox, oy + 125, ox - 6, oy + 110, ox + 6, oy + 110);
    } else if (optType === "lente_div") {
      // Setas invertidas para dentro (divergente / bicôncava)
      p.triangle(ox, oy - 110, ox - 6, oy - 125, ox + 6, oy - 125);
      p.triangle(ox, oy + 110, ox - 6, oy + 125, ox + 6, oy + 125);
    } else if (optType.startsWith("espelho")) {
      // Tracinhos de espelho na parte de trás
      p.stroke(140, 103, 168);
      p.strokeWeight(1.5);
      for (let y = oy - 110; y <= oy + 110; y += 12) {
        p.line(ox, y, ox + 8, y - 6);
      }
    }
  }

  function drawArrow(x1, y1, x2, y2, col, label) {
    p.stroke(col);
    p.strokeWeight(3);
    p.line(x1, y1, x2, y2);

    // Ponta da seta
    p.fill(col);
    p.noStroke();
    let dir = y2 < y1 ? -1 : 1;
    p.triangle(x2, y2, x2 - 5, y2 - dir * 10, x2 + 5, y2 - dir * 10);

    p.textSize(10);
    p.textAlign(p.CENTER, y2 < y1 ? p.BOTTOM : p.TOP);
    p.text(label, x2, y2 + dir * 5);
  }

  function drawRayTracing(ox, oy, pxScale, ox1, oy1, ix, iy, fSigned) {
    const fPx = Math.abs(fSigned) * pxScale;

    // Raio 1: Paralelo ao eixo principal
    p.stroke(255, 220, 80, 180);
    p.strokeWeight(1.5);
    p.line(ox1, oy1, ox, oy1);

    if (optType === "lente_conv") {
      // Refrata passando por F' (à direita)
      p.line(ox, oy1, p.width, oy1 + (oy - oy1) * (p.width - ox) / fPx);
    } else if (optType === "lente_div") {
      // Diverge alinhado com F' (à esquerda)
      p.line(ox, oy1, p.width, oy1 - (oy1 - oy) * (p.width - ox) / fPx);
      // Prolongamento pontilhado
      p.drawingContext.setLineDash([3, 3]);
      p.stroke(255, 220, 80, 120);
      p.line(ox, oy1, ox - fPx, oy);
      p.drawingContext.setLineDash([]);
    }

    // Raio 2: Passa pelo centro óptico sem desvio
    p.stroke(100, 200, 255, 180);
    p.strokeWeight(1.5);
    if (optType.startsWith("lente")) {
      p.line(ox1, oy1, p.width, oy + (oy - oy1) * (p.width - ox) / (ox - ox1));
      // Prolongamento para imagem virtual
      if (ix < ox) {
        p.drawingContext.setLineDash([3, 3]);
        p.stroke(100, 200, 255, 120);
        p.line(ox, oy, ix, iy);
        p.drawingContext.setLineDash([]);
      }
    }
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-lente");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

/* ==========================================================================
   2. BANCO DE REFRAÇÃO LASER & SNELL-DESCARTES
   ========================================================================== */
const simOpticaSnell = (p) => {
  let theta1Deg = 45;
  let n1 = 1.0; // Ar
  let n2 = 1.5; // Vidro

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-snell");
    if (!wrap) return;
    const w = Math.min(wrap.clientWidth || 550, 650);
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-snell");

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const tSlider = document.getElementById("o1-theta-slider");
    const n1Slider = document.getElementById("o1-n1-slider");
    const n2Slider = document.getElementById("o1-n2-slider");

    if (tSlider) {
      tSlider.addEventListener("input", (e) => {
        theta1Deg = parseFloat(e.target.value);
        document.getElementById("o1-theta-val").textContent = `${theta1Deg}°`;
        calculatePhysics();
      });
    }

    if (n1Slider) {
      n1Slider.addEventListener("input", (e) => {
        n1 = parseFloat(e.target.value);
        document.getElementById("o1-n1-val").textContent = n1.toFixed(2);
        calculatePhysics();
      });
    }

    if (n2Slider) {
      n2Slider.addEventListener("input", (e) => {
        n2 = parseFloat(e.target.value);
        document.getElementById("o1-n2-val").textContent = n2.toFixed(2);
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const rad1 = p.radians(theta1Deg);
    const sinTheta2 = (n1 * Math.sin(rad1)) / n2;

    const t2Elem = document.getElementById("o1-theta2-num");
    const critElem = document.getElementById("o1-crit-num");
    const modeElem = document.getElementById("o1-mode-text");

    if (n1 > n2) {
      const critRad = Math.asin(n2 / n1);
      const critDeg = p.degrees(critRad);
      if (critElem) critElem.textContent = `${critDeg.toFixed(1).replace(".", ",")}°`;

      if (sinTheta2 > 1.0) {
        if (t2Elem) t2Elem.textContent = "Sem Refração";
        if (modeElem) {
          modeElem.textContent = "Reflexão Total Interna (100%)";
          modeElem.style.color = "#c8435d";
        }
        return;
      }
    } else {
      if (critElem) critElem.textContent = "N/A (n₁ < n₂)";
    }

    const rad2 = Math.asin(sinTheta2);
    const deg2 = p.degrees(rad2);
    if (t2Elem) t2Elem.textContent = `${deg2.toFixed(1).replace(".", ",")}°`;
    if (modeElem) {
      modeElem.textContent = "Refração + Reflexão Parcial";
      modeElem.style.color = "#2e8b57";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;

    // Meio 2 (Inferior)
    p.noStroke();
    p.fill(59, 108, 181, 40);
    p.rect(0, cy, p.width, p.height / 2);

    // Linha de Interface
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.line(0, cy, p.width, cy);

    // Linha Normal
    p.stroke(80, 70, 95);
    p.drawingContext.setLineDash([4, 4]);
    p.line(cx, 20, cx, p.height - 20);
    p.drawingContext.setLineDash([]);

    // Rótulos dos Meios
    p.noStroke();
    p.fill(201, 174, 222);
    p.textSize(11);
    p.text(`Meio 1 (n₁ = ${n1.toFixed(2)})`, 30, cy - 20);
    p.text(`Meio 2 (n₂ = ${n2.toFixed(2)})`, 30, cy + 30);

    // Raio Incidente
    const rad1 = p.radians(theta1Deg);
    const beamLen = 160;
    const incX = cx - beamLen * Math.sin(rad1);
    const incY = cy - beamLen * Math.cos(rad1);

    p.stroke(255, 60, 80);
    p.strokeWeight(3);
    p.line(incX, incY, cx, cy);

    // Raio Refletido
    const refX = cx + beamLen * Math.sin(rad1);
    const refY = cy - beamLen * Math.cos(rad1);
    p.stroke(255, 60, 80, 160);
    p.strokeWeight(2);
    p.line(cx, cy, refX, refY);

    // Raio Refratado
    const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
    if (sinTheta2 <= 1.0) {
      const rad2 = Math.asin(sinTheta2);
      const refrX = cx + beamLen * Math.sin(rad2);
      const refrY = cy + beamLen * Math.cos(rad2);

      p.stroke(100, 220, 255);
      p.strokeWeight(3);
      p.line(cx, cy, refrX, refrY);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-snell");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-optica-lente")) new p5(simOpticaLente);
  if (document.getElementById("canvas-optica-snell")) new p5(simOpticaSnell);
});
