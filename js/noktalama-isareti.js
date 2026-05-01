/* ============================================
   Noktalama Isareti Oyunu - Game Logic
   Game #2 for Minik Kalemler platform
   Two sentences shown, pick the one with
   correct apostrophe (kesme isareti) usage
   ============================================ */

const QUESTIONS = [
  {
    id: 1,
    emoji: "✏️",
    optionA: "Türkiye'nin başkenti Ankara'dır.",
    optionB: "Masa'nın ayağı kırılmış.",
    correct: "A"
  },
  {
    id: 2,
    emoji: "📝",
    optionA: "Annem Ayşe'ye kazak aldı.",
    optionB: "Teyzem'in yaptığı yemekler çok lezzetli.",
    correct: "A"
  },
  {
    id: 3,
    emoji: "📏",
    optionA: "Fatma kedisi Mavişe mama aldı.",
    optionB: "Ahmet bugün İstanbul'a gitti.",
    correct: "B"
  },
  {
    id: 4,
    emoji: "🖊️",
    optionA: "Efenin yeni kalemi çok güzel.",
    optionB: "Sema'nın saçları çok uzun.",
    correct: "B"
  }
];

let currentQuestion = 0;
let correctCount = 0;
let isAnswering = false;

const questionArea = document.getElementById("question-area");
const completionScreen = document.getElementById("completion-screen");
const questionNumber = document.getElementById("question-number");
const questionEmoji = document.getElementById("question-emoji");
const optionsContainer = document.getElementById("options-container");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const starsContainer = document.getElementById("progress-stars");

function initGame() {
  currentQuestion = 0;
  correctCount = 0;
  isAnswering = false;
  questionArea.style.display = "flex";
  completionScreen.classList.remove("active");
  completionScreen.style.display = "none";
  renderStars();
  updateProgress();
  showQuestion();
}

function renderStars() {
  starsContainer.innerHTML = "";
  for (let i = 0; i < QUESTIONS.length; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.textContent = "⭐";
    star.id = "star-" + i;
    starsContainer.appendChild(star);
  }
}

function updateProgress() {
  const pct = (currentQuestion / QUESTIONS.length) * 100;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = "Soru " + (currentQuestion + 1) + " / " + QUESTIONS.length;
}

function showQuestion() {
  if (currentQuestion >= QUESTIONS.length) { showCompletion(); return; }
  const q = QUESTIONS[currentQuestion];
  questionNumber.textContent = "Soru " + (currentQuestion + 1);
  optionsContainer.innerHTML = "";

  // Create two sentence option buttons
  [q.optionA, q.optionB].forEach(function (optText, idx) {
    const btn = document.createElement("button");
    btn.className = "option-btn sentence-option";
    
    const textSpan = document.createElement("span");
    textSpan.className = "option-text-span";
    textSpan.textContent = optText;

    btn.appendChild(textSpan);

    btn.addEventListener("click", function () {
      handleAnswer(idx === 0 ? "A" : "B");
    });
    optionsContainer.appendChild(btn);
  });
  isAnswering = false;
}

function launchConfetti() {
  confetti({
    particleCount: 80, spread: 70, origin: { y: 0.6 },
    colors: ['#FF6B9D', '#C471ED', '#4FC3F7', '#69F0AE', '#FFD54F', '#FFB74D']
  });
}

function handleAnswer(selected) {
  if (isAnswering) return;
  isAnswering = true;
  const q = QUESTIONS[currentQuestion];
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  const selectedIdx = selected === "A" ? 0 : 1;
  const correctIdx = q.correct === "A" ? 0 : 1;
  buttons.forEach(function (btn) { btn.classList.add("disabled"); });

  if (selected === q.correct) {
    buttons[selectedIdx].classList.add("correct");
    correctCount++;
    const star = document.getElementById("star-" + currentQuestion);
    if (star) star.classList.add("earned");
    launchConfetti();
    setTimeout(function () { currentQuestion++; updateProgress(); showQuestion(); }, 1600);
  } else {
    buttons[selectedIdx].classList.add("wrong");
    setTimeout(function () { buttons[correctIdx].classList.add("reveal-correct"); }, 600);
    setTimeout(function () { currentQuestion++; updateProgress(); showQuestion(); }, 2200);
  }
}

function showCompletion() {
  questionArea.style.display = "none";
  completionScreen.style.display = "flex";
  completionScreen.classList.add("active");
  progressFill.style.width = "100%";
  progressLabel.textContent = "Tamamlandı!";
  document.getElementById("final-score").textContent = correctCount + " / " + QUESTIONS.length + " doğru cevap!";
  const msgEl = document.getElementById("completion-msg");
  const ratio = correctCount / QUESTIONS.length;
  if (ratio === 1) msgEl.textContent = "Mükemmel! Hepsini doğru bildin! 🌟";
  else if (ratio >= 0.5) msgEl.textContent = "Harika gidiyorsun! Biraz daha pratik yapalım! 💪";
  else msgEl.textContent = "Endişelenme, tekrar deneyerek öğrenebilirsin! 📚";
  launchConfetti(); setTimeout(launchConfetti, 500); setTimeout(launchConfetti, 1000);
}

document.addEventListener("DOMContentLoaded", initGame);
