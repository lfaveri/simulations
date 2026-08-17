/**
 * LABORATÓRIO DE FÍSICA — Laura de Faveri
 * Controlador Geral de Bancadas, Questionários, Filtros e Sincronização
 */

document.addEventListener("DOMContentLoaded", () => {
  initStationTabs();
  initNotebookQuizzes();
  initResolutionToggles();
  initBankFilters();
  initSimParamSync();
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

        // Recalibra o canvas do p5 no container visível
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 50);
      });
    });
  });
}

/* ==========================================================================
   2. QUESTIONÁRIOS DE VESTIBULAR (CADERNO & BANCO DE QUESTÕES)
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
      const card = btn.closest(".notebook-card, .bank-question-card");
      if (!card) return;
      const resBox = card.querySelector(".resolution-box");

      if (resBox) {
        const isVisible = resBox.classList.toggle("is-visible");
        btn.textContent = isVisible ? "📖 Ocultar Resolução" : "📖 Ver Resolução Comentada";

        if (isVisible && window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([resBox]).catch(err => console.error(err));
        }
      }
    });
  });
}

/* ==========================================================================
   4. FILTRO DO BANCO DE QUESTÕES POR BANCA / TEMA
   ========================================================================== */
function initBankFilters() {
  const filterButtons = document.querySelectorAll(".bank-filter-btn");
  const questionCards = document.querySelectorAll(".bank-question-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      questionCards.forEach(card => {
        const board = card.getAttribute("data-board") || "";
        const topic = card.getAttribute("data-topic") || "";

        if (filter === "all" || board.includes(filter) || topic.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   5. SINCRONIZAÇÃO: CARREGAR PARÂMETROS DA QUESTÃO NO SIMULADOR
   ========================================================================== */
function initSimParamSync() {
  const syncButtons = document.querySelectorAll(".sync-sim-btn");

  syncButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetStation = btn.getAttribute("data-station-target");
      const paramData = btn.getAttribute("data-params");

      if (targetStation) {
        // Ativa a aba da estação alvo
        const targetTab = document.querySelector(`.station-tab[data-station="${targetStation}"]`);
        if (targetTab) targetTab.click();
      }

      if (paramData) {
        try {
          const params = JSON.parse(paramData);
          Object.keys(params).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
              input.value = params[id];
              input.dispatchEvent(new Event("input"));
            }
          });
        } catch (e) {
          console.error("Erro ao aplicar parâmetros na simulação:", e);
        }
      }

      // Rola suavemente até o topo da bancada
      const apparatus = document.getElementById(targetStation) || document.querySelector(".lab-section");
      if (apparatus) {
        apparatus.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
