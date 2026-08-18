/**
 * MÓDULO: ÓPTICA GEOMÉTRICA — LABORATÓRIO VIRTUAL ROBUSTO & SEM BUGS
 * 1. Fibra Óptica, Reflexão Total & Internet de Alta Velocidade
 * 2. Miragem no Asfalto Quente da Rodovia (com Coqueiro e Reflexo)
 */

/* ==========================================================================
   1. FIBRA ÓPTICA & INTERNET DE ALTA VELOCIDADE (COTIDIANO)
   ========================================================================== */
const simOpticaFibra = (p) => {
  let fiberBendAngle = 15;
  let nCore = 1.50;
  let nClad = 1.46;
  let laserPackets = [];

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-fibra");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
    const canvas = p.createCanvas(w, 360);
    canvas.parent("canvas-optica-fibra");

    for (let i = 0; i < 6; i++) {
      laserPackets.push({ x: i * 80, speed: 3.5 });
    }

    initControls();
    calculatePhysics();
  };

  function initControls() {
    const bendSlider = document.getElementById("o-fib-bend-slider");
    if (bendSlider) {
      bendSlider.addEventListener("input", (e) => {
        fiberBendAngle = parseFloat(e.target.value);
        const valElem = document.getElementById("o-fib-bend-val");
        if (valElem) valElem.textContent = `${fiberBendAngle}°`;
        calculatePhysics();
      });
    }
  }

  function calculatePhysics() {
    const critAngleRad = Math.asin(nClad / nCore);
    const critAngleDeg = (critAngleRad * 180) / Math.PI;
    const incidentAngleDeg = 90 - fiberBendAngle;
    const hasTotalReflection = incidentAngleDeg >= critAngleDeg;

    const critElem = document.getElementById("o-fib-crit-num");
    const speedElem = document.getElementById("o-fib-speed-num");
    const statusElem = document.getElementById("o-fib-status-text");

    if (critElem) critElem.textContent = `θ_c = ${critAngleDeg.toFixed(1)}°`;
    if (speedElem) speedElem.textContent = `200.000 km/s (c / 1,5)`;
    if (statusElem) {
      statusElem.textContent = hasTotalReflection ? "Reflexão Total: Sinal 100% transmitido sem perdas" : "Perigo: Curvatura excessiva! Luz vazando pelo revestimento";
      statusElem.style.color = hasTotalReflection ? "#2e8b57" : "#c8435d";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const w = p.width, cy = 180;
    const coreH = 50, cladH = 18;

    // 1. Casca Externa da Fibra (Cladding - n = 1.46)
    p.fill(35, 45, 65);
    p.stroke(60, 85, 130);
    p.strokeWeight(1.5);
    p.rect(30, cy - coreH / 2 - cladH, w - 60, cladH, 4, 4, 0, 0);
    p.rect(30, cy + coreH / 2, w - 60, cladH, 0, 0, 4, 4);

    // 2. Núcleo de Vidro Ultrapuro (Core - n = 1.50)
    p.fill(20, 30, 50, 220);
    p.stroke(100, 180, 255);
    p.strokeWeight(2);
    p.rect(30, cy - coreH / 2, w - 60, coreH);

    // 3. Traçado do Feixe de Laser Zig-Zag por Reflexão Total Interna
    const incidentAngleDeg = 90 - fiberBendAngle;
    const hasTotalReflection = incidentAngleDeg >= 76.7;

    p.stroke(255, 40, 70);
    p.strokeWeight(3.5);
    p.noFill();
    p.beginShape();
    let stepX = 55;
    let dirY = -1;
    for (let x = 30; x <= w - 30; x += stepX) {
      let y = cy + dirY * (coreH / 2 - 4);
      p.vertex(x, y);
      dirY *= -1;
    }
    p.endShape();

    // Pulsos de Dados Laser
    p.fill(255, 220, 80);
    p.noStroke();
    laserPackets.forEach(lp => {
      let curSegment = Math.floor(lp.x / stepX);
      let localX = lp.x % stepX;
      let startY = (curSegment % 2 === 0) ? (cy + coreH / 2 - 4) : (cy - coreH / 2 + 4);
      let targetY = (curSegment % 2 === 0) ? (cy - coreH / 2 + 4) : (cy + coreH / 2 - 4);
      let curY = p.lerp(startY, targetY, localX / stepX);

      p.ellipse(30 + lp.x, curY, 8, 8);
      lp.x += lp.speed;
      if (lp.x > w - 70) lp.x = 0;
    });

    // Se houver vazamento por curvatura excessiva
    if (!hasTotalReflection) {
      p.stroke(255, 40, 70, 140);
      p.strokeWeight(2);
      for (let x = 120; x < w - 60; x += 110) {
        p.line(x, cy - coreH / 2, x + 20, cy - coreH / 2 - 35);
        p.line(x + stepX, cy + coreH / 2, x + stepX + 20, cy + coreH / 2 + 35);
      }
    }
  };

  p.windowResized = () => {
    const wrap = document.getElementById("canvas-optica-fibra");
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

/* ==========================================================================
   2. MIRAGEM NO ASFALTO QUENTE DA RODOVIA (COTIDIANO)
   ========================================================================== */
const simOpticaMiragem = (p) => {
  let asphaltTempC = 60;

  p.setup = () => {
    const wrap = document.getElementById("canvas-optica-miragem");
    if (!wrap) return;
    const w = wrap.clientWidth > 100 ? Math.min(wrap.clientWidth, 650) : 560;
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
        const valElem = document.getElementById("o-mir-temp-val");
        if (valElem) valElem.textContent = `${asphaltTempC} °C`;
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
      statusElem.textContent = isMirageVisible ? "Miragem Nítida: Reflexão do céu no asfalto quente" : "Sem miragem (Gradiente insuficiente)";
      statusElem.style.color = isMirageVisible ? "#2e8b57" : "#8c7e99";
    }
  }

  p.draw = () => {
    p.background(18, 16, 28);
    const roadY = 240;

    for (let y = 0; y < roadY; y += 4) {
      let t = y / roadY;
      p.stroke(p.lerp(30, 90, t), p.lerp(60, 150, t), p.lerp(140, 220, t));
      p.strokeWeight(4);
      p.line(0, y, p.width, y);
    }

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

    p.fill(28, 25, 35);
    p.rect(0, roadY, p.width, p.height - roadY);

    p.stroke(255, 215, 0, 200);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([16, 14]);
    p.line(0, roadY + 50, p.width, roadY + 50);
    p.drawingContext.setLineDash([]);

    const treeX = p.width - 90, treeY = roadY;
    drawPalmTree(treeX, treeY);

    if (asphaltTempC >= 45) {
      p.noStroke();
      for (let y = roadY - 35; y < roadY; y += 4) {
        let alpha = p.map(y, roadY - 35, roadY, 0, (asphaltTempC / 70) * 110);
        p.fill(255, 180, 100, alpha);
        p.rect(0, y, p.width, 4);
      }
    }

    const obsX = 50, obsEyeY = roadY - 50;
    p.fill(240, 190, 160);
    p.stroke(255);
    p.strokeWeight(1.5);
    p.ellipse(obsX, obsEyeY, 14, 14);
    p.line(obsX, obsEyeY + 7, obsX, roadY);

    if (asphaltTempC >= 45) {
      const bendX = p.width * 0.52, bendY = roadY - 3;
      p.stroke(100, 220, 255);
      p.strokeWeight(2.5);
      p.noFill();
      p.beginShape();
      p.vertex(treeX - 20, treeY - 85);
      p.bezierVertex(treeX - 60, bendY, bendX + 40, bendY, bendX, bendY);
      p.bezierVertex(bendX - 40, bendY, obsX + 30, obsEyeY, obsX, obsEyeY);
      p.endShape();

      p.noStroke();
      p.fill(100, 200, 255, 170);
      p.ellipse(bendX, roadY + 2, 110, 14);
    }
  };

  function drawPalmTree(x, y) {
    p.stroke(110, 75, 45);
    p.strokeWeight(6);
    p.noFill();
    p.bezier(x, y, x - 10, y - 40, x - 5, y - 70, x - 20, y - 90);

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
    if (wrap && wrap.clientWidth > 100) {
      p.resizeCanvas(Math.min(wrap.clientWidth, 650), 360);
    }
  };
};

function initOpticaSims() {
  if (document.getElementById("canvas-optica-fibra")) new p5(simOpticaFibra);
  if (document.getElementById("canvas-optica-miragem")) new p5(simOpticaMiragem);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOpticaSims);
} else {
  initOpticaSims();
}
