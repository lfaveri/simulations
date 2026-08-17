/**
 * MÓDULO 3: ÓPTICA GEOMÉTRICA — LABORATÓRIO VIRTUAL
 * 1. Refração, Lei de Snell & Reflexão Total (ENEM)
 * 2. Banco Óptico & Lentes Delgadas / Gauss (FUVEST)
 */

/* --- 1. Refração & Lei de Snell --- */
const simOpticaRefracao = (p) => {
  let theta1Deg = 45;
  let n1 = 1.0;  // Ar
  let n2 = 1.5;  // Vidro

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
    const thetaSlider = document.getElementById("o1-theta-slider");
    const n1Slider = document.getElementById("o1-n1-slider");
    const n2Slider = document.getElementById("o1-n2-slider");

    if (thetaSlider) {
      thetaSlider.addEventListener("input", (e) => {
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

    let isTotalReflection = false;
    let theta2Deg = 0;

    if (sinTheta2 > 1.0) {
      isTotalReflection = true;
    } else {
      theta2Deg = p.degrees(Math.asin(sinTheta2));
    }

    // Ângulo Limite (quando n1 > n2)
    let criticalAngleText = "N/A (n₁ < n₂)";
    if (n1 > n2) {
      const critDeg = p.degrees(Math.asin(n2 / n1));
      criticalAngleText = `${critDeg.toFixed(1)}°`;
    }

    const t2Elem = document.getElementById("o1-theta2-num");
    const critElem = document.getElementById("o1-crit-num");
    const modeElem = document.getElementById("o1-mode-text");

    if (t2Elem) t2Elem.textContent = isTotalReflection ? "Sem refração" : `${theta2Deg.toFixed(1).replace(".", ",")}°`;
    if (critElem) critElem.textContent = criticalAngleText;
    if (modeElem) {
      if (isTotalReflection) {
        modeElem.textContent = "Reflexão Total Interna";
        modeElem.style.color = "#c8435d";
      } else {
        modeElem.textContent = "Refração + Reflexão Parcial";
        modeElem.style.color = "#2e8b57";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const midY = p.height * 0.5;
    const midX = p.width * 0.5;

    // Meio 1 (Topo)
    p.noStroke();
    p.fill(24, 20, 36);
    p.rect(0, 0, p.width, midY);
    p.fill(160, 150, 180);
    p.textSize(11);
    p.text(`Meio 1 (n₁ = ${n1.toFixed(2)})`, 20, 30);

    // Meio 2 (Base)
    p.fill(38, 48, 75);
    p.rect(0, midY, p.width, midY);
    p.fill(190, 210, 245);
    p.text(`Meio 2 (n₂ = ${n2.toFixed(2)})`, 20, midY + 30);

    // Interface
    p.stroke(201, 174, 222);
    p.strokeWeight(2);
    p.line(0, midY, p.width, midY);

    // Normal Tracejada
    p.stroke(120, 110, 140);
    p.strokeWeight(1.5);
    p.drawingContext.setLineDash([5, 5]);
    p.line(midX, 20, midX, p.height - 20);
    p.drawingContext.setLineDash([]);

    const rad1 = p.radians(theta1Deg);
    const beamLen = 140;

    // Raio Incidente (Vermelho Laser)
    const incX = midX - beamLen * Math.sin(rad1);
    const incY = midY - beamLen * Math.cos(rad1);
    p.stroke(255, 60, 90);
    p.strokeWeight(3);
    p.line(incX, incY, midX, midY);

    // Raio Refletido
    const refX = midX + beamLen * Math.sin(rad1);
    const refY = midY - beamLen * Math.cos(rad1);
    p.stroke(255, 60, 90, 140);
    p.line(midX, midY, refX, refY);

    // Raio Refratado
    const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
    if (sinTheta2 <= 1.0) {
      const rad2 = Math.asin(sinTheta2);
      const refrX = midX + beamLen * Math.sin(rad2);
      const refrY = midY + beamLen * Math.cos(rad2);
      p.stroke(255, 200, 80);
      p.strokeWeight(3.5);
      p.line(midX, midY, refrX, refrY);
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

/* --- 2. Banco Óptico & Lentes Delgadas --- */
const simOpticaLente = (p) => {
  let focalLen = 60; // pixels (f > 0 convergente)
  let objDist = 120; // p (distância do objeto à lente)
  let objHeight = 40; // altura do objeto

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
    const pSlider = document.getElementById("o2-p-slider");
    const fSlider = document.getElementById("o2-f-slider");

    if (pSlider) {
      pSlider.addEventListener("input", (e) => {
        objDist = parseFloat(e.target.value);
        document.getElementById("o2-p-val").textContent = `${objDist} cm`;
        calculatePhysics();
      });
    }

    if (fSlider) {
      fSlider.addEventListener("input", (e) => {
        focalLen = parseFloat(e.target.value);
        document.getElementById("o2-f-val").textContent = `${focalLen} cm`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    // 1/f = 1/p + 1/p' => p' = (f * p) / (p - f)
    let pPrime = (focalLen * objDist) / (objDist - focalLen);
    let A = -pPrime / objDist;

    const pPrimeElem = document.getElementById("o2-pprime-num");
    const aElem = document.getElementById("o2-a-num");
    const typeElem = document.getElementById("o2-type-text");

    if (pPrimeElem) pPrimeElem.textContent = isFinite(pPrime) ? `${pPrime.toFixed(1).replace(".", ",")} cm` : "No infinito";
    if (aElem) aElem.textContent = isFinite(A) ? `${A.toFixed(2).replace(".", ",")}×` : "Imprópria";
    if (typeElem) {
      if (objDist === focalLen) {
        typeElem.textContent = "Imagem Imprópria (Raios Paralelos)";
      } else if (pPrime > 0) {
        typeElem.textContent = "Real e Invertida";
        typeElem.style.color = "#2e8b57";
      } else {
        typeElem.textContent = "Virtual e Direita (Lupa)";
        typeElem.style.color = "#c8435d";
      }
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);

    const lensX = p.width * 0.5;
    const optAxisY = p.height * 0.5;

    // Eixo Principal
    p.stroke(100, 90, 120);
    p.strokeWeight(1.5);
    p.line(20, optAxisY, p.width - 20, optAxisY);

    // Lente Delgada (Convergente)
    p.stroke(201, 174, 222);
    p.strokeWeight(3);
    p.line(lensX, 40, lensX, p.height - 40);
    // Setas nos topos (convergente)
    p.line(lensX, 40, lensX - 6, 48);
    p.line(lensX, 40, lensX + 6, 48);
    p.line(lensX, p.height - 40, lensX - 6, p.height - 48);
    p.line(lensX, p.height - 40, lensX + 6, p.height - 48);

    // Focos F e F'
    p.fill(200, 67, 93);
    p.noStroke();
    p.ellipse(lensX - focalLen, optAxisY, 6, 6);
    p.ellipse(lensX + focalLen, optAxisY, 6, 6);
    p.textSize(10);
    p.text("F", lensX - focalLen - 4, optAxisY + 15);
    p.text("F'", lensX + focalLen - 4, optAxisY + 15);

    // Objeto (Vela / Seta Vermelha)
    const objX = lensX - objDist;
    p.stroke(255, 100, 120);
    p.strokeWeight(3.5);
    p.line(objX, optAxisY, objX, optAxisY - objHeight);
    p.fill(255, 100, 120);
    p.triangle(objX, optAxisY - objHeight, objX - 4, optAxisY - objHeight + 8, objX + 4, optAxisY - objHeight + 8);

    // Raios Notáveis
    // Raio 1: Paralelo -> passa pelo Foco imagem
    p.stroke(255, 200, 80, 160);
    p.strokeWeight(1.5);
    p.line(objX, optAxisY - objHeight, lensX, optAxisY - objHeight);
    p.line(lensX, optAxisY - objHeight, p.width - 20, optAxisY + ((p.width - 20 - lensX) / focalLen) * objHeight);

    // Raio 2: Passa pelo centro óptico sem desvio
    p.line(objX, optAxisY - objHeight, p.width - 20, optAxisY - objHeight + ((p.width - 20 - objX) / objDist) * objHeight);

    // Imagem Formada
    const pPrime = (focalLen * objDist) / (objDist - focalLen);
    if (isFinite(pPrime)) {
      const imgX = lensX + pPrime;
      const imgHeight = - (pPrime / objDist) * objHeight;

      p.stroke(46, 139, 87);
      p.strokeWeight(3.5);
      p.line(imgX, optAxisY, imgX, optAxisY - imgHeight);
      p.fill(46, 139, 87);
      p.triangle(imgX, optAxisY - imgHeight, imgX - 4, optAxisY - imgHeight - Math.sign(imgHeight) * 8, imgX + 4, optAxisY - imgHeight - Math.sign(imgHeight) * 8);
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-lente");
    if (wrap) {
      const w = Math.min(wrap.clientWidth || 550, 650);
      p.resizeCanvas(w, 360);
    }
  };
};

window.addEventListener("load", () => {
  if (document.getElementById("canvas-optica-snell")) new p5(simOpticaRefracao);
  if (document.getElementById("canvas-optica-lente")) new p5(simOpticaLente);
});
