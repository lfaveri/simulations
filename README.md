# ⚡ Eletricidade Estática — Roteiro de Aula & Simulações Interativas

Um site educacional interativo e moderno para o ensino de **Eletricidade Estática** (Física para Ensino Médio e Vestibulares), construído com HTML5, CSS3, JavaScript puro, **p5.js** e **MathJax**.

🔗 **Acesso Online (GitHub Pages):** [https://lfaveri.github.io/simulations/](https://lfaveri.github.io/simulations/)

---

## 🌟 Recursos

### 1. 📖 Conceitos Teóricos Fundamentais
- **Carga Elétrica & Interação** (Atração e Repulsão)
- **Processos de Eletrização**: Atrito, Contato e Indução
- **Lei de Coulomb**: $F = k \cdot \frac{|Q_1 \cdot Q_2|}{d^2}$
- **Campo Elétrico**: $\vec{E} = \frac{\vec{F}}{q} = k \cdot \frac{Q}{d^2}$
- **Potencial Elétrico & Tensão**: $V = k \cdot \frac{Q}{d}$
- **Blindagem Eletrostática & Gaiola de Faraday**: $E_{\text{interno}} = 0$

### 2. 🎮 3 Simulações Interativas em p5.js
1. **Eletrização por Atrito & Indução:**
   - Arraste o balão sobre o cabelo para acumular elétrons (−) e deixar o cabelo com carga residual (+).
   - Aproxime o balão dos pedaços de papel picado e observe a indução e atração eletrostática na prática.
2. **Lei de Coulomb em Tempo Real:**
   - Sliders para ajustar cargas $Q_1$, $Q_2$ (de $-5\,\mu\text{C}$ a $+5\,\mu\text{C}$) e a distância $d$.
   - Vetores de força ($\vec{F}_{12}$ e $\vec{F}_{21}$) desenhados dinamicamente no canvas respeitando a 3ª Lei de Newton.
3. **Linhas de Campo Elétrico:**
   - Adicione cargas pontuais positivas e negativas com um clique no canvas.
   - Cálculo vetorial por superposição em tempo real gerando streamlines e grade de vetores de campo.
   - Arraste as cargas para ver o campo deformando-se ao vivo ou clique com botão direito para remover.

### 3. 📝 8 Questões Comentadas de Vestibular
- Questões reais de bancas renomadas: **ENEM**, **FUVEST** e **UNICAMP**.
- Feedback imediato de acerto/erro com **resolução passo a passo** e fórmulas renderizadas via LaTeX.
- Marcadores visuais de progresso e tela de pontuação final.

### 4. 📊 Tabela de Constantes e Referência Rápida
- Constante eletrostática ($k = 9 \times 10^9\,\text{N}\cdot\text{m}^2/\text{C}^2$)
- Carga elementar ($e = 1{,}6 \times 10^{-19}\,\text{C}$)
- Permissividade do vácuo ($\varepsilon_0$), massa do elétron e do próton.

---

## 🚀 Como Visualizar Localmente

Basta abrir o arquivo `index.html` em qualquer navegador web moderno:

1. Clone o repositório:
   ```bash
   git clone https://github.com/lfaveri/simulations.git
   ```
2. Abra o arquivo `index.html` no seu navegador de preferência (Google Chrome, Firefox, Safari, Edge).
   - Ou utilize a extensão **Live Server** no VS Code / IDE.

---

## 🌐 Como Publicar no GitHub Pages (Gratuito)

1. Faça push dos arquivos para a branch `main`:
   ```bash
   git add .
   git commit -m "feat: site interativo de eletrostática"
   git push origin main
   ```
2. No repositório no GitHub:
   - Acesse **Settings** > **Pages**
   - Em **Build and deployment** > **Source**, selecione **Deploy from a branch**
   - Escolha a branch `main` e a pasta `/ (root)`
   - Clique em **Save**
3. Em poucos instantes, seu site estará disponível publicamente em `https://lfaveri.github.io/simulations/`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Design dark mode com glassmorphism e tipografia Google Fonts (*Space Grotesk* + *Inter*).
- **JavaScript (ES6+):** Sem dependências de build ou frameworks pesados.
- **p5.js (v1.9.4):** Renderização gráfica dinâmica das simulações físicas no `<canvas>`.
- **MathJax (v3):** Renderização vetorial perfeita de notações matemáticas e equações em $\LaTeX$.
