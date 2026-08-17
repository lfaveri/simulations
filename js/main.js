/**
 * LABORATÓRIO MULTIDISCIPLINAR DE FÍSICA — Laura de Faveri
 * Controlador Central: Hub das 6 Áreas, Bancadas, Questionários e MathJax
 */

document.addEventListener("DOMContentLoaded", () => {
  initAreaHub();
  initStationTabs();
  initNotebookQuizzes();
  initResolutionToggles();
});

/* ==========================================================================
   1. HUB DAS 6 GRANDES ÁREAS DA FÍSICA
   ========================================================================== */
function initAreaHub() {
  const areaButtons = document.querySelectorAll(".area-card-btn");
  const areaPanels = document.querySelectorAll(".area-module-panel");

  areaButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetAreaId = btn.getAttribute("data-area");

      // Atualiza botões do Hub
      areaButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Alterna painel da Área Temática
      areaPanels.forEach(panel => {
        panel.classList.remove("is-active");
        if (panel.id === targetAreaId) {
          panel.classList.add("is-active");
        }
      });

      // Dispara resize para os canvases p5 recalcula dimensões
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    });
  });
}

/* ==========================================================================
   2. ALTERNÂNCIA DE BANCADAS (TABS) DENTRO DE CADA ÁREA
   ========================================================================== */
function initStationTabs() {
  const allStationNavs = document.querySelectorAll(".station-nav");

  allStationNavs.forEach(nav => {
    const tabs = nav.querySelectorAll(".station-tab");
    const parentArea = nav.closest(".area-module-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetStationId = tab.getAttribute("data-station");

        // Atualiza tabs do mesmo grupo
        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        // Atualiza painéis dentro da mesma área
        if (parentArea) {
          const panels = parentArea.querySelectorAll(".station-panel");
          panels.forEach(p => {
            p.classList.remove("is-active");
            if (p.id === targetStationId) {
              p.classList.add("is-active");
            }
          });
        }

        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 50);
      });
    });
  });
}

/* ==========================================================================
   3. RESPOSTAS E FEEDBACK DAS QUESTÕES DE VESTIBULAR
   ========================================================================== */
function initNotebookQuizzes() {
  const optionGroups = document.querySelectorAll(".options-group");

  optionGroups.forEach(group => {
    const choices = group.querySelectorAll(".option-choice");

    choices.forEach(choice => {
      choice.addEventListener("click", () => {
        choices.forEach(c => {
          c.classList.remove("is-correct", "is-wrong");
          c.classList.add("is-disabled");
        });

        const isCorrect = choice.getAttribute("data-correct") === "true";

        if (isCorrect) {
          choice.classList.add("is-correct");
        } else {
          choice.classList.add("is-wrong");
          const correctOne = group.querySelector('[data-correct="true"]');
          if (correctOne) correctOne.classList.add("is-correct");
        }
      });
    });
  });
}

/* ==========================================================================
   4. BOTÕES PARA EXIBIR A DEDUÇÃO / RESOLUÇÃO COMENTADA
   ========================================================================== */
function initResolutionToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-res-btn");

  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".notebook-card");
      if (!card) return;
      const resBox = card.querySelector(".resolution-box");

      if (resBox) {
        const isVisible = resBox.classList.toggle("is-visible");
        btn.textContent = isVisible ? "📖 Ocultar Dedução" : "📖 Ver Dedução";

        if (isVisible && window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([resBox]).catch(err => console.error(err));
        }
      }
    });
  });
}
