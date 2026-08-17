/**
 * Exercícios de Vestibular sobre Eletrostática
 * Bancas: ENEM, FUVEST, UNICAMP
 */

const questionsData = [
  {
    id: 1,
    source: "ENEM",
    year: "2018",
    badgeClass: "badge-enem",
    topic: "Processos de Eletrização / Gaiola de Faraday",
    context: "Duas irmãs passeiam de carro durante uma tempestade com raios e trovoadas. Uma delas fica apavorada e sugere que desçam do carro e procurem abrigo sob uma árvore alta à margem da rodovia. A outra irmã, que aprendeu eletrostática na escola, afirma que é muito mais seguro permanecer dentro do automóvel.",
    question: "A recomendação da segunda irmã fundamenta-se no fato de que o automóvel atua como uma:",
    options: [
      "Fonte de alta resistência que desvia a corrente elétrica diretamente para o solo através dos pneus de borracha isolantes.",
      "Gaiola de Faraday, fazendo com que o campo elétrico no interior de sua estrutura metálica permaneça nulo.",
      "Bateria acumuladora, absorvendo toda a carga elétrica atmosférica em sua carcaça externa sem sofrer danos.",
      "Ponta condutora, atuando como um para-raios miniaturizado que neutraliza as cargas da nuvem.",
      "Resistência de aterramento contínuo, dissipando a energia na forma de calor pelos vidros das janelas."
    ],
    correct: 1,
    explanation: "A estrutura metálica da lataria do automóvel funciona como uma <strong>Gaiola de Faraday</strong> (blindagem eletrostática). As cargas elétricas provenientes de uma descarga atmosférica distribuem-se exclusivamente pela superfície externa do condutor em equilíbrio eletrostático, garantindo que o campo elétrico interno seja <strong>nulo ($E_{\\text{interno}} = 0$)</strong>. Os pneus de borracha, ao contrário do mito popular, não são os responsáveis principais pela proteção contra raios de altíssima tensão."
  },
  {
    id: 2,
    source: "FUVEST",
    year: "2021",
    badgeClass: "badge-fuvest",
    topic: "Lei de Coulomb e Distância",
    context: "Duas pequenas esferas condutoras idênticas, fixas no vácuo e separadas por uma distância $d$, possuem cargas elétricas de mesmo valor e sinais opostos ($+Q$ e $-Q$). Nessa configuração, o módulo da força eletrostática mútua entre elas é $F_0$.",
    question: "Se a distância entre os centros das esferas for reduzida para $\\dfrac{d}{3}$, qual será o novo módulo da força eletrostática entre elas?",
    options: [
      "$F = \\dfrac{F_0}{9}$",
      "$F = \\dfrac{F_0}{3}$",
      "$F = 3 F_0$",
      "$F = 9 F_0$",
      "$F = 27 F_0$"
    ],
    correct: 3,
    explanation: "Pela <strong>Lei de Coulomb</strong>, a força eletrostática é inversamente proporcional ao quadrado da distância:<br><br>$$F = k \\cdot \\frac{|Q_1 \\cdot Q_2|}{d^2}$$<br>Ao substituir a nova distância $d' = \\frac{d}{3}$:<br><br>$$F' = k \\cdot \\frac{Q^2}{(d/3)^2} = k \\cdot \\frac{Q^2}{d^2 / 9} = 9 \\cdot \\left(k \\frac{Q^2}{d^2}\\right) = 9 F_0$$<br>Portanto, ao reduzir a distância em 3 vezes, a intensidade da força aumenta <strong>9 vezes</strong> ($3^2 = 9$)."
  },
  {
    id: 3,
    source: "UNICAMP",
    year: "2020",
    badgeClass: "badge-unicamp",
    topic: "Eletrização por Indução e Contato",
    context: "Três esferas condutoras idênticas A, B e C estão inicialmente apoiadas sobre suportes isolantes. A esfera A possui carga elétrica inicial $+6\\mu\\text{C}$, enquanto B e C estão inicialmente neutras ($Q_B = 0$ e $Q_C = 0$).",
    question: "Coloca-se a esfera A em contato sucessivo primeiro com B e, após separá-las, A é colocada em contato com C. Ao final desses dois processos, quais são as cargas finais de A, B e C, respectivamente?",
    options: [
      "$Q_A = +1{,}5\\mu\\text{C},\\; Q_B = +3\\mu\\text{C},\\; Q_C = +1{,}5\\mu\\text{C}$",
      "$Q_A = +2\\mu\\text{C},\\; Q_B = +2\\mu\\text{C},\\; Q_C = +2\\mu\\text{C}$",
      "$Q_A = +3\\mu\\text{C},\\; Q_B = +3\\mu\\text{C},\\; Q_C = 0\\mu\\text{C}$",
      "$Q_A = +1{,}5\\mu\\text{C},\\; Q_B = +1{,}5\\mu\\text{C},\\; Q_C = +3\\mu\\text{C}$",
      "$Q_A = +6\\mu\\text{C},\\; Q_B = +3\\mu\\text{C},\\; Q_C = +1{,}5\\mu\\text{C}$"
    ],
    correct: 0,
    explanation: "Por serem condutores idênticos, a carga divide-se igualmente a cada contato:<br><br><strong>1º Contato (A com B):</strong><br>$$Q_A' = Q_B' = \\frac{Q_A + Q_B}{2} = \\frac{+6 + 0}{2} = +3\\,\\mu\\text{C}$$<br><strong>2º Contato (A com C):</strong><br>$$Q_A'' = Q_C'' = \\frac{Q_A' + Q_C}{2} = \\frac{+3 + 0}{2} = +1{,}5\\,\\mu\\text{C}$$<br>Resultado final: <strong>$Q_A = +1{,}5\\,\\mu\\text{C}$, $Q_B = +3\\,\\mu\\text{C}$, $Q_C = +1{,}5\\,\\mu\\text{C}$</strong>."
  },
  {
    id: 4,
    source: "ENEM",
    year: "2016",
    badgeClass: "badge-enem",
    topic: "Eletrização por Atrito / Série Triboelétrica",
    context: "Ao pentear o cabelo seco em um dia de baixa umidade do ar com um pente de plástico, nota-se que pequenos pedaços de papel picado colocados sobre uma mesa são imediatamente atraídos pelo pente, mesmo os papéis sendo corpos eletricamente neutros.",
    question: "A atração observada ocorre porque o pente, ao ser atritado, fica eletrizado e:",
    options: [
      "Cria um campo gravitacional concentrado que puxa a massa dos pedaços de papel.",
      "Transfere prótons do ar circundante diretamente para as moléculas de celulose do papel.",
      "Provoca uma polarização/indução eletrostática nas cargas do papel neutro, gerando uma força resultante atrativa.",
      "Torna o papel carregado com carga de mesmo sinal que a do pente por condução à distância.",
      "Aquece o ar adjacente, criando correntes de convecção que elevam o papel em direção ao pente."
    ],
    correct: 2,
    explanation: "Ao atritar o plástico com o cabelo, ocorre transferência de elétrons (eletrização por atrito). Quando o pente carregado aproxima-se do papel (isolante neutro), ele produz uma <strong>polarização dielétrica</strong>: as cargas de sinal oposto no papel ficam mais próximas do pente do que as cargas de mesmo sinal. Como a força elétrica varia com o inverso do quadrado da distância ($F \\propto 1/d^2$), a atração sobre as cargas próximas supera a repulsão sobre as mais distantes, resultando em uma <strong>força atrativa líquida</strong>."
  },
  {
    id: 5,
    source: "FUVEST",
    year: "2020",
    badgeClass: "badge-fuvest",
    topic: "Campo Elétrico e Segunda Lei de Newton",
    context: "Um elétron de massa $m = 9 \\times 10^{-31}\\,\\text{kg}$ e carga em módulo $e = 1{,}6 \\times 10^{-19}\\,\\text{C}$ é abandonado a partir do repouso em uma região de vácuo sob a ação exclusiva de um campo elétrico uniforme $\\vec{E}$ de intensidade $4{,}5 \\times 10^{3}\\,\\text{N/C}$.",
    question: "Desprezando os efeitos gravitacionais, qual é a aceleração adquirida pelo elétron?",
    options: [
      "$a = 8{,}0 \\times 10^{14}\\,\\text{m/s}^2$",
      "$a = 4{,}0 \\times 10^{12}\\,\\text{m/s}^2$",
      "$a = 1{,}6 \\times 10^{15}\\,\\text{m/s}^2$",
      "$a = 2{,}5 \\times 10^{11}\\,\\text{m/s}^2$",
      "$a = 9{,}0 \\times 10^{13}\\,\\text{m/s}^2$"
    ],
    correct: 0,
    explanation: "A força elétrica atuando sobre a partícula é $F = q \\cdot E$. Pela Segunda Lei de Newton ($F = m \\cdot a$):<br><br>$$m \\cdot a = e \\cdot E \\implies a = \\frac{e \\cdot E}{m}$$<br>Substituindo os valores numéricos:<br><br>$$a = \\frac{(1{,}6 \\times 10^{-19}\\,\\text{C}) \\cdot (4{,}5 \\times 10^3\\,\\text{N/C})}{9 \\times 10^{-31}\\,\\text{kg}} = \\frac{7{,}2 \\times 10^{-16}}{9 \\times 10^{-31}} = 0{,}8 \\times 10^{15} = 8{,}0 \\times 10^{14}\\,\\text{m/s}^2$$"
  },
  {
    id: 6,
    source: "UNICAMP",
    year: "2022",
    badgeClass: "badge-unicamp",
    topic: "Linhas de Força e Campo Resultante",
    context: "As linhas de força de um campo eletrostático são linhas imaginárias traçadas de modo que o vetor campo elétrico seja tangente a elas em cada ponto, orientadas no sentido do vetor campo.",
    question: "Sobre a configuração e as propriedades fundamentais das linhas de força no vácuo, é CORRETO afirmar que:",
    options: [
      "Duas linhas de força podem se cruzar em regiões de campo muito intenso, indicando dois vetores campo elétrico simultâneos no mesmo ponto.",
      "As linhas de força sempre 'nascem' (divergem) em cargas elétricas positivas e 'morrem' (convergem) em cargas negativas ou estendem-se ao infinito.",
      "A densidade espacial de linhas de força é menor nas proximidades de cargas elétricas de grande valor em módulo.",
      "Linhas de força formam laços ou trajetórias fechadas contínuas no espaço ao redor de qualquer carga eletrostática estática.",
      "O vetor campo elétrico é sempre perpendicular às linhas de força em qualquer ponto de sua extensão."
    ],
    correct: 1,
    explanation: "Por convenção e definição física, as linhas de campo eletrostático <strong>nascem em cargas positivas (fontes)</strong> e <strong>terminam em cargas negativas (sumidouros)</strong>. Elas nunca se cruzam (pois em cada ponto o vetor campo $\\vec{E}$ é único e unívoco), sua densidade espacial é proporcional à intensidade do campo e, na eletrostática clássica (campos conservativos), elas <em>não formam curvas fechadas</em>."
  },
  {
    id: 7,
    source: "ENEM",
    year: "2021",
    badgeClass: "badge-enem",
    topic: "Poder das Pontas e Para-raios",
    context: "O funcionamento de um para-raios predial baseia-se em dois princípios essenciais da física eletrostática para proteger edifícios contra danos causados por descargas atmosféricas.",
    question: "Esses dois princípios físicos fundamentais são:",
    options: [
      "Ondas eletromagnéticas estacionárias e efeito Joule nos cabos condutores.",
      "Poder das pontas (escoamento e ionização de cargas) e condução segura da corrente elétrica até o solo.",
      "Indução magnética de Faraday e blindagem paramagnética dos alicerces.",
      "Reflexão de cargas nas superfícies metálicas e isolamento térmico das armações.",
      "Fotoemissão estimulada e ressonância piezoelétrica dos materiais cerâmicos."
    ],
    correct: 1,
    explanation: "O para-raios utiliza o <strong>poder das pontas</strong>: em regiões pontiagudas de um condutor, a densidade superficial de cargas ($\\sigma = \\Delta Q / \\Delta A$) é máxima, gerando campos elétricos locais intensos o suficiente para ionizar o ar e favorecer o escoamento gradual ou guiar a descarga elétrica. Aliado a isso, um cabo condutor espesso garante o <strong>caminho de menor resistência até a terra (aterramento)</strong>, dissipando a energia com segurança."
  },
  {
    id: 8,
    source: "FUVEST",
    year: "2019",
    badgeClass: "badge-fuvest",
    topic: "Potencial Elétrico e Trabalho da Força Elétrica",
    context: "Em um campo elétrico uniforme de módulo $E = 500\\,\\text{V/m}$, dois pontos A e B estão alinhados ao longo da mesma linha de força, separados por uma distância de $0{,}2\\,\\text{m}$, com o ponto A situado a montante (potencial maior) de B.",
    question: "Qual é o trabalho ($W$) realizado pela força elétrica para deslocar uma carga pontual positiva $q = +2\\,\\mu\\text{C}$ do ponto A até o ponto B?",
    options: [
      "$W = 1{,}0 \\times 10^{-4}\\,\\text{J}$",
      "$W = 2{,}0 \\times 10^{-4}\\,\\text{J}$",
      "$W = 5{,}0 \\times 10^{-4}\\,\\text{J}$",
      "$W = 2{,}5 \\times 10^{-3}\\,\\text{J}$",
      "$W = 0{,}0\\,\\text{J}$"
    ],
    correct: 1,
    explanation: "Em um campo elétrico uniforme, a diferença de potencial é $U = E \\cdot d$.<br><br>$$U = 500\\,\\text{V/m} \\cdot 0{,}2\\,\\text{m} = 100\\,\\text{V}$$<br>O trabalho realizado pela força elétrica sobre a carga ao se deslocar de A para B é:<br><br>$$W = q \\cdot U = (2 \\times 10^{-6}\\,\\text{C}) \\cdot 100\\,\\text{V} = 2{,}0 \\times 10^{-4}\\,\\text{J}$$<br>Como a carga positiva move-se a favor das linhas de campo (do maior para o menor potencial), o trabalho é motor (positivo)."
  }
];

class QuizApp {
  constructor() {
    this.currentIndex = 0;
    this.userAnswers = new Array(questionsData.length).fill(null);
    this.score = 0;

    this.container = document.getElementById("quiz-container");
    this.dotsContainer = document.getElementById("questionDots");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.progressFill = document.getElementById("progressFill");
    this.progressText = document.getElementById("progressText");
    this.scoreText = document.getElementById("scoreText");
    this.resultsContainer = document.getElementById("quizResults");

    this.init();
  }

  init() {
    this.renderDots();
    this.renderQuestion(this.currentIndex);
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.prevBtn.addEventListener("click", () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderQuestion(this.currentIndex);
      }
    });

    this.nextBtn.addEventListener("click", () => {
      if (this.currentIndex < questionsData.length - 1) {
        this.currentIndex++;
        this.renderQuestion(this.currentIndex);
      } else {
        this.showFinalResults();
      }
    });
  }

  renderDots() {
    this.dotsContainer.innerHTML = "";
    questionsData.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `question-dot ${idx === this.currentIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Questão ${idx + 1}`);
      dot.addEventListener("click", () => {
        this.currentIndex = idx;
        this.renderQuestion(idx);
      });
      this.dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll(".question-dot");
    dots.forEach((dot, idx) => {
      dot.className = "question-dot";
      if (idx === this.currentIndex) dot.classList.add("active");
      if (this.userAnswers[idx] !== null) {
        if (this.userAnswers[idx] === questionsData[idx].correct) {
          dot.classList.add("answered-correct");
        } else {
          dot.classList.add("answered-wrong");
        }
      }
    });
  }

  renderQuestion(index) {
    const q = questionsData[index];
    const userAnswer = this.userAnswers[index];
    const isAnswered = userAnswer !== null;

    // Update progress UI
    const progressPercent = ((index + 1) / questionsData.length) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    this.progressText.textContent = `Questão ${index + 1} de ${questionsData.length}`;
    this.scoreText.textContent = `Acertos: ${this.score}`;

    this.prevBtn.disabled = index === 0;
    this.nextBtn.textContent = index === questionsData.length - 1 ? "Finalizar Quiz 🏁" : "Próxima →";

    const letters = ["A", "B", "C", "D", "E"];

    let optionsHtml = q.options.map((opt, i) => {
      let extraClass = "";
      if (isAnswered) {
        extraClass = "disabled";
        if (i === q.correct) {
          extraClass += " selected-correct";
        } else if (i === userAnswer) {
          extraClass += " selected-wrong";
        }
      }
      return `
        <button class="option-item ${extraClass}" data-index="${i}" ${isAnswered ? "disabled" : ""}>
          <span class="option-letter">${letters[i]}</span>
          <span class="option-text">${opt}</span>
        </button>
      `;
    }).join("");

    let feedbackHtml = "";
    if (isAnswered) {
      const isCorrect = userAnswer === q.correct;
      feedbackHtml = `
        <div class="feedback-box ${isCorrect ? "" : "wrong"}">
          <div class="feedback-title ${isCorrect ? "correct-title" : "wrong-title"}">
            ${isCorrect ? "✓ Resposta Correta!" : "✗ Resposta Incorreta — Veja a resolução comentada:"}
          </div>
          <div class="feedback-explanation">
            ${q.explanation}
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="question-card">
        <div class="question-meta">
          <span class="question-badge ${q.badgeClass}">${q.source} ${q.year}</span>
          <span class="question-number">Tema: ${q.topic}</span>
        </div>
        ${q.context ? `<div class="question-context">"${q.context}"</div>` : ""}
        <div class="question-text"><strong>${q.question}</strong></div>
        <div class="options-list">
          ${optionsHtml}
        </div>
        ${feedbackHtml}
      </div>
    `;

    // Attach click event to options
    if (!isAnswered) {
      const optionButtons = this.container.querySelectorAll(".option-item");
      optionButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
          const selectedIdx = parseInt(btn.getAttribute("data-index"), 10);
          this.handleAnswer(index, selectedIdx);
        });
      });
    }

    this.updateDots();

    // Trigger MathJax re-render
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([this.container]).catch(err => console.error(err));
    }
  }

  handleAnswer(questionIdx, selectedOptionIdx) {
    if (this.userAnswers[questionIdx] !== null) return;

    this.userAnswers[questionIdx] = selectedOptionIdx;
    if (selectedOptionIdx === questionsData[questionIdx].correct) {
      this.score++;
    }

    this.renderQuestion(questionIdx);
  }

  showFinalResults() {
    this.container.style.display = "none";
    this.prevBtn.style.display = "none";
    this.nextBtn.style.display = "none";
    this.dotsContainer.style.display = "none";

    const total = questionsData.length;
    const percentage = Math.round((this.score / total) * 100);

    let message = "";
    let emoji = "";
    if (percentage === 100) {
      emoji = "🏆";
      message = "Excelente! Você gabaritou todos os exercícios e domina os conceitos de eletrostática!";
    } else if (percentage >= 70) {
      emoji = "⚡";
      message = "Muito bom! Seu desempenho foi ótimo, com excelente compreensão das leis e aplicações!";
    } else if (percentage >= 50) {
      emoji = "📚";
      message = "Bom trabalho! Vale a pena revisar as fórmulas de campo elétrico e Gaiola de Faraday.";
    } else {
      emoji = "💡";
      message = "Continue praticando! Experimente usar as simulações interativas acima para fixar a teoria.";
    }

    this.resultsContainer.className = "quiz-results";
    this.resultsContainer.innerHTML = `
      <div style="font-size: 3.5rem; margin-bottom: 12px;">${emoji}</div>
      <div class="results-score">${this.score} / ${total}</div>
      <div class="results-message">${message}</div>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Aproveitamento total: <strong>${percentage}%</strong></p>
      <button class="btn btn-primary" id="restartQuizBtn">↺ Tentar Novamente</button>
    `;

    document.getElementById("restartQuizBtn").addEventListener("click", () => {
      this.currentIndex = 0;
      this.userAnswers = new Array(questionsData.length).fill(null);
      this.score = 0;
      this.container.style.display = "block";
      this.prevBtn.style.display = "inline-flex";
      this.nextBtn.style.display = "inline-flex";
      this.dotsContainer.style.display = "flex";
      this.resultsContainer.className = "quiz-results hidden";
      this.renderQuestion(0);
    });
  }
}

// Initialized when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.quizApp = new QuizApp();
});
