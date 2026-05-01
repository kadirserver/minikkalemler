/* ============================================
   Minik Kalemler - Quiz Game Logic
   ============================================ */

const questions = [
  {
    question: "Sinekleri kovmak için ağaç dalını kullanan hayvan hangisiydi?",
    options: [
      { text: "Fil", emoji: "🐘" },
      { text: "İnek", emoji: "🐄" }
    ],
    correct: 0
  },
  {
    question: "Deniz samurları karınlarının üzerine neyi koyarak yiyeceklerini kırıyorlardı?",
    options: [
      { text: "Dal parçası", emoji: "🌿" },
      { text: "Taş", emoji: "🪨" }
    ],
    correct: 1
  },
  {
    question: "Ağzıyla tuttuğu fırçayla vücudunu kaşıyan hayvan hangisiydi?",
    options: [
      { text: "İnek", emoji: "🐄" },
      { text: "Şempanze", emoji: "🐒" }
    ],
    correct: 0
  },
  {
    question: "Şempanze yiyeceğine ulaşmak için neyi kullanıyordu?",
    options: [
      { text: "İnce dal parçası", emoji: "🌿" },
      { text: "Fırça", emoji: "🖌️" }
    ],
    correct: 0
  },
  {
    question: "Yuvalarını oluşturmak için larvalardan üretilmiş ipeksi maddeyi kullanan hayvanlar hangileriydi?",
    options: [
      { text: "Küçük akbabalar", emoji: "🦅", image: "assets/animals/vulture.svg" },
      { text: "Dokumacı karıncalar", emoji: "🐜" }
    ],
    correct: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const progressStars = document.getElementById('progress-stars');

function initQuiz() {
  renderStars();
  loadQuestion();
}

function renderStars() {
  progressStars.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.innerText = '⭐';
    progressStars.appendChild(star);
  }
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;

  // Update progress bar
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressLabel.innerText = `Soru ${currentQuestionIndex + 1} / ${questions.length}`;

  // Update stars
  const stars = progressStars.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < score) star.classList.add('earned');
  });

  optionsGrid.innerHTML = '';
  currentQuestion.options.forEach((opt, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn image-only-option';

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "option-emoji large-emoji";
    
    if (opt.image) {
      const img = document.createElement("img");
      img.src = opt.image;
      img.alt = opt.text;
      img.style.width = "90%";
      img.style.height = "90%";
      img.style.objectFit = "contain";
      emojiSpan.appendChild(img);
    } else {
      emojiSpan.textContent = opt.emoji;
    }
    
    button.appendChild(emojiSpan);
    button.onclick = () => handleAnswer(index, button);
    optionsGrid.appendChild(button);
  });
}

function handleAnswer(selectedIndex, button) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = optionsGrid.querySelectorAll('.option-btn');

  // Disable all buttons to prevent double clicking
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === currentQuestion.correct) {
    button.classList.add('correct');
    score++;
    triggerConfetti();
  } else {
    button.classList.add('wrong');
    // Vibration effect is handled by CSS animation 'shake'
  }

  // Move to next question after a delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B9D', '#C471ED', '#4FC3F7', '#69F0AE', '#FFD54F']
    });
  }
}

function showResults() {
  progressFill.style.width = '100%';
  progressLabel.innerText = "Tamamlandı!";

  // Final star update
  const stars = progressStars.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < score) star.classList.add('earned');
  });

  const completionScreen = document.getElementById('completion-screen');
  const completionMsg = document.getElementById('completion-msg');
  const finalScore = document.getElementById('final-score');

  completionMsg.innerText = `Harika bir iş çıkardın!`;
  finalScore.innerText = `${questions.length} sorudan ${score} tanesini doğru bildin!`;
  completionScreen.classList.add('active');
}

// Load confetti library dynamically if not present
if (typeof confetti !== 'function') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.head.appendChild(script);
}

window.onload = initQuiz;
