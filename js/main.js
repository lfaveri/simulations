/**
 * LABORATÓRIO DE FÍSICA — Laura de Faveri
 * Controlador Geral de Bancadas, Questionários e Resoluções
 */

document.addEventListener("DOMContentLoaded", () => {
  initStationTabs();
  initNotebookQuizzes();
  initResolutionToggles();
});

/* ==========================================================================
   1. SELETOR DE BANCADAS (TABS) NAS SUBPÁGINAS
   ========================================================================== */
function initStationTabs() {
  const stationNavs = document.querySelectorAll(".station-nav");

  stationNavs.forEach(nav => {
    const tabs = nav.querySelectorAll(".station-tab");
    const container = nav.closest(".lab-section") || document;
    const panels = container.querySelectorAll(".station-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("data-station");

        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        panels.forEach(p => {
          p.classList.remove("is-active");
          if (p.id === targetId) {
            p.classList.add("is-active");
          }
        });

        // Dispara resize para recalibrar o canvas p5
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 50);
      });
    });
  });
}

/* ==========================================================================
   2. QUESTIONÁRIOS DE VESTIBULAR
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
          const correctChoice = group.querySelector('[data-correct="true"]');
          if (correctChoice) correctChoice.classList.add("is-correct");
        }
      });
    });
  });
}

/* ==========================================================================
   3. BOTÕES DE DEDUÇÃO E RESOLUÇÃO COMENTADA
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
