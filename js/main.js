/**
 * LABORATÓRIO DE ELETROSTÁTICA — Laura de Faveri
 * Lógica principal da interface, alternância de bancadas e interatividade dos cadernos
 */

document.addEventListener("DOMContentLoaded", () => {
  initStationTabs();
  initNotebookQuizzes();
  initResolutionToggles();
});

/* ==========================================================================
   1. ALTERNÂNCIA ENTRE BANCADAS DE LABORATÓRIO (TABS)
   ========================================================================== */
function initStationTabs() {
  const tabs = document.querySelectorAll(".station-tab");
  const panels = document.querySelectorAll(".station-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetStationId = tab.getAttribute("data-station");

      // Atualiza tabs
      tabs.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      // Atualiza painéis
      panels.forEach(panel => {
        panel.classList.remove("is-active");
        if (panel.id === targetStationId) {
          panel.classList.add("is-active");
        }
      });

      // Dispara resize para o p5 recalcular dimensões no container visível
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    });
  });
}

/* ==========================================================================
   2. INTERAÇÃO DAS QUESTÕES NO CADERNO DE LABORATÓRIO
   ========================================================================== */
function initNotebookQuizzes() {
  const optionGroups = document.querySelectorAll(".options-group");

  optionGroups.forEach(group => {
    const choices = group.querySelectorAll(".option-choice");

    choices.forEach(choice => {
      choice.addEventListener("click", () => {
        // Desativa outras opções do mesmo grupo
        choices.forEach(c => {
          c.classList.remove("is-correct", "is-wrong");
          c.classList.add("is-disabled");
        });

        const isCorrect = choice.getAttribute("data-correct") === "true";

        if (isCorrect) {
          choice.classList.add("is-correct");
        } else {
          choice.classList.add("is-wrong");
          // Destaca a correta suavemente
          const correctOne = group.querySelector('[data-correct="true"]');
          if (correctOne) correctOne.classList.add("is-correct");
        }
      });
    });
  });
}

/* ==========================================================================
   3. BOTÕES PARA EXIBIR A DEDUÇÃO / RESOLUÇÃO COMENTADA
   ========================================================================== */
function initResolutionToggles() {
  const toggleConfigs = [
    { btnId: "btn-explain-s1", resId: "res-station1" },
    { btnId: "btn-explain-s2", resId: "res-station2" },
    { btnId: "btn-explain-s3", resId: "res-station3" },
    { btnId: "btn-explain-s4", resId: "res-station4" }
  ];

  toggleConfigs.forEach(cfg => {
    const btn = document.getElementById(cfg.btnId);
    const resBox = document.getElementById(cfg.resId);

    if (btn && resBox) {
      btn.addEventListener("click", () => {
        const isVisible = resBox.classList.toggle("is-visible");
        btn.textContent = isVisible ? "📖 Ocultar Dedução" : "📖 Ver Dedução Teórica";

        // Renderiza MathJax se necessário
        if (isVisible && window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([resBox]).catch(err => console.error(err));
        }
      });
    }
  });
}
