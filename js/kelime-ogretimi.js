/* ============================================
   Kelime Ogretimi Oyunu - Game Logic
   Game #1 for Minik Kalemler platform
   ============================================ */

const QUESTIONS = [
  {
    id: 1,
    text: "İnsanların ya da hayvanların dış etkilerden korunmak için sığındıkları yer, korunma yeri",
    options: ["barınak", "alet", "termit"],
    correct: 0
  },
  {
    id: 2,
    text: "Bir işi yapmak, kolaylaştıracak için kullanılan araç gereç",
    options: ["alet", "biçim", "pratik"],
    correct: 0
  },
  {
    id: 3,
    text: "Kolay ve hızlı yapılabilen şey",
    options: ["besin", "araç", "pratik"],
    correct: 2
  },
  {
    id: 4,
    text: "Bir şeyin nasıl göründüğü, şekli demektir",
    options: ["format", "barınak", "biçim"],
    correct: 2
  },
  {
    id: 5,
    text: "Ağaç ve odun yiyen küçük böcek türü",
    options: ["besin", "alet", "termit"],
    correct: 2
  }
];

let currentQuestion = 0;
let correctCount = 0;
let isAnswering = false;

const questionArea = document.getElementById("question-area");
const completionScreen = document.getElementById("completion-screen");
const questionNumber = document.getElementById("question-number");
const questionEmoji = document.getElementById("question-emoji");
const questionText = document.getElementById("question-text");
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
  if (currentQuestion >= QUESTIONS.length) {
    showCompletion();
    return;
  }
  const q = QUESTIONS[currentQuestion];
  questionNumber.textContent = "Soru " + (currentQuestion + 1);
  questionText.textContent = q.text;
  optionsContainer.innerHTML = "";
  q.options.forEach(function (opt, idx) {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", function () { handleAnswer(idx); });
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

function handleAnswer(selectedIdx) {
  if (isAnswering) return;
  isAnswering = true;
  const q = QUESTIONS[currentQuestion];
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  buttons.forEach(function (btn) { btn.classList.add("disabled"); });

  if (selectedIdx === q.correct) {
    buttons[selectedIdx].classList.add("correct");
    correctCount++;
    const star = document.getElementById("star-" + currentQuestion);
    if (star) star.classList.add("earned");
    launchConfetti();
    setTimeout(function () { currentQuestion++; updateProgress(); showQuestion(); }, 1600);
  } else {
    buttons[selectedIdx].classList.add("wrong");
    setTimeout(function () { buttons[q.correct].classList.add("reveal-correct"); }, 600);
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
  else if (ratio >= 0.6) msgEl.textContent = "Harika gidiyorsun! Biraz daha pratik yapalım! 💪";
  else msgEl.textContent = "Endişelenme, tekrar deneyerek öğrenebilirsin! 📚";
  launchConfetti();
  setTimeout(launchConfetti, 500);
  setTimeout(launchConfetti, 1000);
}

document.addEventListener("DOMContentLoaded", initGame);
