/**
 * script.js — Raízes & Horizontes
 * Funcionalidades: navegação, quiz interativo, animações de scroll,
 * contadores animados, rodapé dinâmico e botão voltar ao topo.
 */

/* ============================================================
   1. UTILITÁRIOS
   ============================================================ */

/**
 * Seleciona um elemento pelo seletor CSS.
 * @param {string} sel
 * @param {Element} [ctx=document]
 * @returns {Element|null}
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Seleciona todos os elementos que correspondem ao seletor CSS.
 * @param {string} sel
 * @param {Element} [ctx=document]
 * @returns {NodeList}
 */
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ============================================================
   2. NAVEGAÇÃO — MENU MOBILE & ACTIVE LINK
   ============================================================ */
(function initNavigation() {
  const toggle   = $('#navToggle');
  const nav      = $('#mainNav');
  const navLinks = $$('.nav-link');

  if (!toggle || !nav) return;

  /* Abre/fecha o menu mobile */
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Fecha o menu ao clicar em um link */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Marca o link ativo conforme a seção visível */
  const sections = $$('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = $(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   3. BOTÃO VOLTAR AO TOPO
   ============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   4. ANIMAÇÃO DE ENTRADA POR SCROLL (IntersectionObserver)
   ============================================================ */
(function initScrollAnimations() {
  /* Adiciona classe .fade-in-up a todos os elementos animáveis */
  const targets = $$(
    '.info-card, .sustain-card, .tech-card, .fact-card, ' +
    '.timeline-item, .gallery-item, .stat-item'
  );

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .5s ease ${(i % 6) * 0.07}s, transform .5s ease ${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. CONTADORES ANIMADOS (seção sustentabilidade)
   ============================================================ */
(function initCounters() {
  const statNumbers = $$('.stat-number[data-target]');
  if (!statNumbers.length) return;

  /**
   * Anima um número de 0 até target.
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cúbico
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. QUIZ INTERATIVO
   ============================================================ */
(function initQuiz() {

  /* ── BANCO DE PERGUNTAS ── */
  const questions = [
    {
      text: "Qual porcentagem aproximada da água doce mundial é usada na agricultura?",
      options: ["30%", "50%", "70%", "90%"],
      correct: 2,
      explanation: "A agricultura consome cerca de 70% de toda a água doce utilizada no mundo."
    },
    {
      text: "O que é a 'agricultura de precisão'?",
      options: [
        "Plantar com espaçamento exato entre sementes",
        "Usar GPS, sensores e dados para otimizar insumos e reduzir desperdício",
        "Cultivar apenas em áreas planas e regulares",
        "Irrigar sempre na mesma quantidade"
      ],
      correct: 1,
      explanation: "A agricultura de precisão utiliza tecnologias como GPS e sensores para aplicar recursos (água, fertilizante) somente onde e quando necessário."
    },
    {
      text: "Qual prática sustentável combina árvores com pastagens ou lavouras no mesmo espaço?",
      options: ["Monocultura intensiva", "Sistema agroflorestal (SAF)", "Agricultura hidropônica", "Irrigação convencional"],
      correct: 1,
      explanation: "Os Sistemas Agroflorestais (SAFs) integram árvores com cultivos e/ou criação de animais, recuperando solos e aumentando a biodiversidade."
    },
    {
      text: "Como as áreas rurais contribuem diretamente para o abastecimento de água nas cidades?",
      options: [
        "Construindo represas artificiais",
        "Exportando água engarrafada",
        "Preservando florestas, nascentes e aquíferos que recarregam os sistemas hídricos",
        "Controlando o consumo urbano"
      ],
      correct: 2,
      explanation: "Florestas e vegetação rural funcionam como 'esponjas', absorvendo chuvas e recarregando aquíferos que abastecem cidades."
    },
    {
      text: "O que é biodigestor, utilizado no meio rural?",
      options: [
        "Máquina para digestão de grãos",
        "Equipamento que transforma resíduos orgânicos em biogás e biofertilizante",
        "Sistema de filtragem de água",
        "Tipo de pomar com frutas exóticas"
      ],
      correct: 1,
      explanation: "Biodigestores convertem resíduos animais e vegetais em biogás (combustível limpo) e biofertilizante, reduzindo poluição e gerando energia."
    },
    {
      text: "Qual benefício ambiental as árvores urbanas proporcionam diretamente às cidades?",
      options: [
        "Aumentam a velocidade do vento",
        "Reduzem a temperatura local e melhoram a qualidade do ar",
        "Diminuem a umidade relativa do ar",
        "Aumentam a reflexão solar"
      ],
      correct: 1,
      explanation: "Árvores urbanas reduzem a temperatura local em vários graus, absorvem CO₂ e poluentes, melhorando significativamente o microclima das cidades."
    },
    {
      text: "O que caracteriza a 'logística reversa' no contexto de embalagens agrícolas?",
      options: [
        "Transporte de alimentos do campo para a cidade",
        "Retorno das embalagens usadas ao fabricante para descarte adequado",
        "Devolução de produtos estragados ao produtor",
        "Transporte reverso de insumos"
      ],
      correct: 1,
      explanation: "A logística reversa exige que embalagens de agroquímicos, após o uso, retornem aos postos de coleta para destinação ambientalmente correta."
    },
    {
      text: "Qual tecnologia permite monitorar plantações extensas do ar, detectando pragas e áreas com estresse hídrico?",
      options: [
        "Termômetros digitais no solo",
        "Drones equipados com câmeras multiespectrais",
        "Rádios de comunicação rural",
        "Sistemas de irrigação automatizada"
      ],
      correct: 1,
      explanation: "Drones com câmeras multiespectrais capturam imagens além do visível, identificando pragas, doenças e falta d'água antes que sejam visíveis a olho nu."
    },
    {
      text: "Qual é o principal papel da biodiversidade rural para as cidades?",
      options: [
        "Aumentar o turismo",
        "Garantir a polinização das culturas e serviços ecossistêmicos essenciais para a produção de alimentos",
        "Reduzir o custo de fertilizantes",
        "Controlar o crescimento das cidades"
      ],
      correct: 1,
      explanation: "A biodiversidade rural garante serviços como polinização (feita por abelhas e outros insetos), controle natural de pragas e manutenção da fertilidade do solo."
    },
    {
      text: "O que significa 'cadeia curta de abastecimento' na relação campo-cidade?",
      options: [
        "Transporte de alimentos por distâncias curtas apenas",
        "Venda direta do produtor rural ao consumidor urbano, reduzindo intermediários",
        "Produção em pequenas propriedades urbanas",
        "Abastecimento de cidades pequenas somente"
      ],
      correct: 1,
      explanation: "Cadeias curtas de abastecimento (feiras, CSAs, entregas diretas) conectam produtor e consumidor, garantindo alimentos frescos, preços justos e menor impacto ambiental."
    }
  ];

  /* ── ESTADO DO QUIZ ── */
  let currentIndex = 0;
  let score        = 0;
  let answered     = false;
  let userAnswers  = [];

  /* ── ELEMENTOS DO DOM ── */
  const startArea    = $('#quizStart');
  const progressArea = $('#quizProgress');
  const questionArea = $('#quizQuestionArea');
  const resultArea   = $('#quizResult');

  const startBtn   = $('#startQuizBtn');
  const nextBtn    = $('#nextBtn');
  const restartBtn = $('#restartBtn');

  const questionText  = $('#questionText');
  const optionsGrid   = $('#optionsGrid');
  const progressFill  = $('#progressFill');
  const currentQSpan  = $('#currentQ');
  const totalQSpan    = $('#totalQ');
  const liveScore     = $('#liveScore');
  const finalScore    = $('#finalScore');
  const resultEmoji   = $('#resultEmoji');
  const resultTitle   = $('#resultTitle');
  const resultMessage = $('#resultMessage');

  if (!startBtn) return; // Garante que o quiz existe na página

  /* Define total de perguntas */
  if (totalQSpan) totalQSpan.textContent = questions.length;

  /* ── INICIAR QUIZ ── */
  startBtn.addEventListener('click', startQuiz);

  function startQuiz() {
    currentIndex = 0;
    score        = 0;
    answered     = false;
    userAnswers  = [];

    // Esconde tela inicial, mostra progresso e pergunta
    startArea.hidden    = true;
    progressArea.hidden = false;
    questionArea.hidden = false;
    resultArea.hidden   = true;

    showQuestion(0);
  }

  /* ── EXIBIR PERGUNTA ── */
  function showQuestion(index) {
    answered = false;
    const q  = questions[index];

    // Atualiza progresso
    if (currentQSpan)  currentQSpan.textContent  = index + 1;
    if (liveScore)     liveScore.textContent      = score;
    if (progressFill) {
      const pct = ((index) / questions.length) * 100;
      progressFill.style.width = pct + '%';
      progressFill.closest('[role="progressbar"]')
        ?.setAttribute('aria-valuenow', index);
    }

    // Animação de entrada
    questionArea.style.opacity   = '0';
    questionArea.style.transform = 'translateX(20px)';

    setTimeout(() => {
      // Texto da pergunta
      questionText.textContent = q.text;

      // Cria os botões de opção
      optionsGrid.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className       = 'option-btn';
        btn.setAttribute('data-letter', letters[i]);
        btn.setAttribute('data-index', i);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.textContent     = opt;
        btn.addEventListener('click', () => selectOption(btn, i, q.correct));
        optionsGrid.appendChild(btn);
      });

      // Esconde botão "próxima" até o usuário responder
      nextBtn.hidden = true;

      // Animação de saída → entrada
      questionArea.style.transition = 'none';
      requestAnimationFrame(() => {
        questionArea.style.transition = 'opacity .35s ease, transform .35s ease';
        questionArea.style.opacity   = '1';
        questionArea.style.transform = 'translateX(0)';
      });

    }, 150);
  }

  /* ── SELECIONAR OPÇÃO ── */
  function selectOption(btn, selectedIndex, correctIndex) {
    if (answered) return;
    answered = true;

    const allBtns = $$('.option-btn', optionsGrid);
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) score++;

    userAnswers.push({
      question: questions[currentIndex].text,
      selected: selectedIndex,
      correct:  correctIndex,
      isCorrect
    });

    // Marca a opção selecionada
    btn.classList.add(isCorrect ? 'correct' : 'wrong');
    // Sempre destaca a correta
    allBtns[correctIndex].classList.add('correct');

    // Atualiza placar ao vivo
    if (liveScore) liveScore.textContent = score;

    // Mostra botão próxima
    nextBtn.hidden = false;

    // Foco no botão para acessibilidade
    nextBtn.focus();
  }

  /* ── PRÓXIMA PERGUNTA ── */
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion(currentIndex);
    } else {
      showResult();
    }
  });

  /* ── RESULTADO ── */
  function showResult() {
    questionArea.hidden  = true;
    progressArea.hidden  = true;
    resultArea.hidden    = false;

    if (finalScore) finalScore.textContent = score;

    // Barra 100% completa
    if (progressFill) progressFill.style.width = '100%';

    // Mensagem personalizada
    let emoji, title, message;

    if (score <= 3) {
      emoji   = '🌱';
      title   = 'Iniciante em Formação';
      message = `Você acertou ${score} de ${questions.length} perguntas. Não se preocupe! Explore as seções deste site e aprenda mais sobre a conexão entre campo e cidade. Todo aprendizado começa com o primeiro passo!`;
    } else if (score <= 7) {
      emoji   = '🌿';
      title   = 'Conhecimento Intermediário';
      message = `Ótimo desempenho! Você acertou ${score} de ${questions.length} perguntas. Você já conhece bastante sobre sustentabilidade e a relação rural-urbana. Continue explorando para dominar o assunto!`;
    } else {
      emoji   = '🏆';
      title   = 'Excelente Conhecimento!';
      message = `Parabéns! Você acertou ${score} de ${questions.length} perguntas. Você demonstra um domínio sólido sobre a relação campo-cidade, sustentabilidade e tecnologia. Compartilhe esse conhecimento!`;
    }

    if (resultEmoji)   resultEmoji.textContent   = emoji;
    if (resultTitle)   resultTitle.textContent   = title;
    if (resultMessage) resultMessage.textContent = message;

    // Rola suavemente para o resultado
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── REINICIAR QUIZ ── */
  restartBtn.addEventListener('click', () => {
    resultArea.hidden  = true;
    startArea.hidden   = false;
  });

})();

/* ============================================================
   7. RODAPÉ — ANO ATUAL
   ============================================================ */
(function setFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   8. GALERIA — TECLADO & TOUCH
   ============================================================ */
(function initGallery() {
  const items = $$('.gallery-item');

  /* Permite ativar itens da galeria via teclado (Enter/Espaço) */
  items.forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Efeito visual de clique
        const img = item.querySelector('.gallery-img');
        if (img) {
          img.style.transform = 'scale(1.06)';
          setTimeout(() => { img.style.transform = ''; }, 400);
        }
        // Exibe overlay
        const overlay = item.querySelector('.gallery-overlay');
        if (overlay) {
          overlay.style.opacity = '1';
          setTimeout(() => { overlay.style.opacity = ''; }, 1500);
        }
      }
    });
  });
})();

/* ============================================================
   9. SMOOTH SCROLL PARA NAVEGAÇÃO INTERNA
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id     = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const headerHeight = 72; // altura do header fixo
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   10. HEADER — SCROLL SHRINK (transparência ao rolar)
   ============================================================ */
(function initHeaderScroll() {
  const header = $('.site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 60) {
      header.style.background = 'rgba(16, 50, 33, 0.99)';
    } else {
      header.style.background = '';
    }

    lastScroll = current;
  }, { passive: true });
})();
