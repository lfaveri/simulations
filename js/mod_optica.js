/**
 * MÓDULO: ÓPTICA GEOMÉTRICA — LABORATÓRIO VIRTUAL EXPANDIDO & FÍSICA DO COTIDIANO
 * 1. Miragem no Asfalto Quente em Dias de Sol (Cotidiano / Refração & Reflexão Total)
 * 2. Arco-Íris & Dispersão na Gota de Chuva (Cotidiano / Dispersão Cromática)
 * 3. Banco Óptico: Lentes Convergentes & Divergentes, Espelhos Côncavos & Convexos
 * 4. Refração Laser & Reflexão Total (Snell-Descartes)
 */

/* ==========================================================================
   1. MIRAGEM NO ASFALTO QUENTE (COTIDIANO)
   ========================================================================== */
const simOpticaMiragem = (p) => {
  let asphaltTempC = 60; // 30°C a 70°C
  let observerDistM = 150;

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
      if (isMirageVisible) {
        statusElem.textContent = "Miragem Nítida: 'Poça d'água' aparente no asfalto";
        statusElem.style.color = "#2e8b57";
      } else {
        statusElem.textContent = "Sem miragem (Gradiente térmico insuficiente)";
        statusElem.style.color = "#8c7e99";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 250;

    // Céu azul no topo
    p.noStroke();
    p.fill(50, 80, 140);
    p.rect(0, 0, p.width, roadY);

    // Asfalto
    p.fill(30, 28, 38);
    p.rect(0, roadY, p.width, p.height - roadY);

    // Linha do Asfalto
    p.stroke(140, 103, 168);
    p.strokeWeight(2);
    p.line(0, roadY, p.width, roadY);

    // Gradiente térmico de ar quente próximo ao solo (Camadas de ar)
    p.noStroke();
    for (let y = roadY - 50; y < roadY; y += 5) {
      let alpha = p.map(y, roadY - 50, roadY, 0, (asphaltTempC / 70) * 120);
      p.fill(255, 140, 60, alpha);
      p.rect(0, y, p.width, 5);
    }

    // Observador no canto esquerdo
    const obsX = 60, obsEyeY = roadY - 60;
    p.fill(201, 174, 222);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(obsX, obsEyeY, 16, 16);
    p.line(obsX, obsEyeY + 8, obsX, roadY);

    // Raio Curvilíneo do Céu sofrendo Reflexão Total no Ar Quente
    if (asphaltTempC >= 45) {
      const rayStartX = p.width - 60, rayStartY = 40;
      const bendY = roadY - 8;
      const bendX = p.width * 0.55;

      p.stroke(100, 220, 255);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      p.vertex(rayStartX, rayStartY);
      p.bezierVertex(rayStartX - 80, bendY, bendX + 40, bendY, bendX, bendY);
      p.bezierVertex(bendX - 40, bendY, obsX + 40, obsEyeY, obsX, obsEyeY);
      p.endShape();

      // Reflexão aparente de 'poça d'água' no asfalto (Miragem inferior)
      p.noStroke();
      p.fill(100, 200, 255, 180);
      p.ellipse(bendX, roadY - 2, 90, 10);

      // Prolongamento retilíneo visual para o observador
      p.stroke(100, 220, 255, 120);
      p.strokeWeight(1.5);
      p.drawingContext.setLineDash([4, 4]);
      p.line(obsX, obsEyeY, bendX, roadY - 2);
      p.drawingContext.setLineDash([]);
    }

    p.fill(255);
    p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    p.text("A luz do céu curva-se ao passar pelo ar quente menos refringente (n_quente < n_frio), criando reflexão total.", 30, 20);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-miragem");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   2. ARCO-ÍRIS & DISPERSÃO CROMÁTICA NA GOTA DE CHUVA (COTIDIANO)
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
    const dropX = p.width * 0.5, dropY = 170, dropR = 90;

    // Gota de Chuva Esférica
    p.fill(30, 45, 75, 140);
    p.stroke(140, 180, 255);
    p.strokeWeight(3);
    p.ellipse(dropX, dropY, dropR * 2, dropR * 2);

    // 1. Feixe de Luz Branca Solar Incidente (vindo da esquerda no topo)
    const incX = dropX - dropR * 0.7;
    const incY = dropY - dropR * 0.7;
    p.stroke(255, 255, 240);
    p.strokeWeight(4);
    p.line(40, incY, incX, incY);

    // 2. Dispersão Cromática Interna (Refração com separação de cores)
    // Cores: Vermelho (menor desvio, n=1.331), Violeta (maior desvio, n=1.344)
    const backRedX = dropX + dropR * 0.85, backRedY = dropY - dropR * 0.15;
    const backVioletX = dropX + dropR * 0.92, backVioletY = dropY - dropR * 0.35;

    // Raio Vermelho interno
    p.stroke(255, 60, 60);
    p.strokeWeight(2.5);
    p.line(incX, incY, backRedX, backRedY);

    // Raio Violeta interno
    p.stroke(180, 80, 255);
    p.strokeWeight(2.5);
    p.line(incX, incY, backVioletX, backVioletY);

    // 3. Reflexão Interna na parede posterior da gota
    const exitRedX = dropX - dropR * 0.65, exitRedY = dropY + dropR * 0.75;
    const exitVioletX = dropX - dropR * 0.55, exitVioletY = dropY + dropR * 0.82;

    p.stroke(255, 60, 60);
    p.line(backRedX, backRedY, exitRedX, exitRedY);

    p.stroke(180, 80, 255);
    p.line(backVioletX, backVioletY, exitVioletX, exitVioletY);

    // 4. Refração de Saída para o Observador a 42° (Vermelho) e 40° (Violeta)
    p.stroke(255, 60, 60);
    p.line(exitRedX, exitRedY, exitRedX - 120, exitRedY + 80);

    p.stroke(180, 80, 255);
    p.line(exitVioletX, exitVioletY, exitVioletX - 120, exitVioletY + 70);

    p.noStroke();
    p.fill(255);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Arco-Íris: Refração com Dispersão Cromática → Reflexão Total Interna → 2ª Refração para o Olho (42° Vermelho, 40° Violeta)", p.width * 0.5, 20);
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-arcoiris");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

/* ==========================================================================
   3. BANCO ÓPTICO: LENTES DELGADAS & ESPELHOS ESFÉRICOS
   ========================================================================== */
const simOpticaLente = (p) => {
  let optType = "lente_conv"; 
  let pDist = 120;
  let fDist = 50;
  let objHeight = 40;

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
    if (optType === "lente_div" || optType === "espelho_conv") fSigned = -fDist;

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

    if (pprimeElem) pprimeElem.textContent = isInfinite ? "No Infinito (Imprópria)" : `${pPrime.toFixed(1).replace(".", ",")} cm`;
    if (aElem) aElem.textContent = isInfinite ? "—" : `${A.toFixed(2).replace(".", ",")}× (${diopters > 0 ? "+" : ""}${diopters.toFixed(1)} di)`;
    if (typeElem) {
      if (isInfinite) {
        typeElem.textContent = "Imagem Imprópria";
        typeElem.style.color = "#c8435d";
      } else {
        const isReal = pPrime > 0;
        const isErect = A > 0;
        const sizeText = Math.abs(A) > 1.05 ? "Maior" : Math.abs(A) < 0.95 ? "Menor" : "Igual";
        typeElem.textContent = `${isReal ? "Real" : "Virtual"}, ${isErect ? "Direita" : "Invertida"} e ${sizeText}`;
        typeElem.style.color = isReal ? "#2e8b57" : "#3b6cb5";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const ox = p.width * 0.5, oy = p.height * 0.5;
    const pxScale = 1.6;

    let fSigned = fDist;
    if (optType === "lente_div" || optType === "espelho_conv") fSigned = -fDist;

    p.stroke(80, 70, 95);
    p.strokeWeight(1.5);
    p.line(20, oy, p.width - 20, oy);

    const fPx = Math.abs(fSigned) * pxScale;
    p.noStroke();
    p.fill(201, 174, 222);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.ellipse(ox - fPx, oy, 6, 6);
    p.text("F", ox - fPx, oy - 6);
    p.ellipse(ox + fPx, oy, 6, 6);
    p.text("F'", ox + fPx, oy - 6);

    // Lente ou Espelho
    p.stroke(201, 174, 222);
    p.strokeWeight(3);
    p.line(ox, oy - 120, ox, oy + 120);

    // Objeto
    const objX = ox - pDist * pxScale;
    const objY = oy - objHeight;
    drawArrow(objX, oy, objX, objY, p.color(200, 67, 93), "Objeto");

    // Imagem e Raios
    if (Math.abs(pDist - fSigned) >= 0.5) {
      let pPrime = (pDist * fSigned) / (pDist - fSigned);
      let A = -pPrime / pDist;
      let imgH = objHeight * A;
      let imgX = optType.startsWith("lente") ? ox + pPrime * pxScale : ox - pPrime * pxScale;
      let imgY = oy - imgH;

      const imgCol = pPrime > 0 ? p.color(46, 139, 87) : p.color(59, 108, 181);
      drawArrow(imgX, oy, imgX, imgY, imgCol, pPrime > 0 ? "Img Real" : "Img Virtual");

      // Raios Notáveis
      p.stroke(255, 220, 80, 180);
      p.strokeWeight(1.5);
      p.line(objX, objY, ox, objY);
      if (optType === "lente_conv") {
        p.line(ox, objY, p.width, objY + (oy - objY) * (p.width - ox) / fPx);
      } else if (optType === "lente_div") {
        p.line(ox, objY, p.width, objY - (objY - oy) * (p.width - ox) / fPx);
        p.drawingContext.setLineDash([3, 3]);
        p.stroke(255, 220, 80, 120);
        p.line(ox, objY, ox - fPx, oy);
        p.drawingContext.setLineDash([]);
      }

      p.stroke(100, 200, 255, 180);
      p.line(objX, objY, p.width, oy + (oy - objY) * (p.width - ox) / (ox - objX));
    }
  };

  function drawArrow(x1, y1, x2, y2, col, label) {
    p.stroke(col);
    p.strokeWeight(3);
    p.line(x1, y1, x2, y2);
    p.fill(col);
    p.noStroke();
    let dir = y2 < y1 ? -1 : 1;
    p.triangle(x2, y2, x2 - 5, y2 - dir * 10, x2 + 5, y2 - dir * 10);
    p.textSize(10);
    p.textAlign(p.CENTER, y2 < y1 ? p.BOTTOM : p.TOP);
    p.text(label, x2, y2 + dir * 5);
  }

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-lente");
    if (wrap) p.resizeCanvas(Math.min(wrap.clientWidth || 550, 650), 360);
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-optica-miragem")) new p5(simOpticaMiragem);
  if (document.getElementById("canvas-optica-arcoiris")) new p5(simOpticaArcoIris);
  if (document.getElementById("canvas-optica-lente")) new p5(simOpticaLente);
});
