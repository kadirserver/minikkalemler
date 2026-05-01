/* ============================================
   Cark Oyunu - Spinning Wheel Game Logic
   Game #4 for Minik Kalemler platform
   Spin the wheel, define the word it lands on
   ============================================ */

const WORDS = [
  {
    word: "Barınak",
    definition: "Dış etkilerden korunmak için sığınılan yer",
    wrongs: ["Bir işi kolaylaştıran araç", "Ağaç yiyen böcek türü"]
  },
  {
    word: "Biçim",
    definition: "Bir şeyin nasıl göründüğü, şekli",
    wrongs: ["Bir amaca ulaşmak için izlenen yol", "Canlıların yediği şey"]
  },
  {
    word: "Pratik",
    definition: "Kolay ve hızlı yapılabilen şey",
    wrongs: ["Sığınılan korunma yeri", "Ağaç yiyen böcek türü"]
  },
  {
    word: "Besin",
    definition: "Canlıların yaşamak için yedikleri şey",
    wrongs: ["Korunma yeri, sığınak", "Bir amaca ulaşmak için izlenen yol"]
  },
  {
    word: "Termit",
    definition: "Ağaç ve odun yiyen küçük böcek türü",
    wrongs: ["Kolay ve hızlı yapılan şey", "Canlıların yediği şey"]
  },
  {
    word: "Alet",
    definition: "Bir işi yapmak için kullanılan araç gereci",
    wrongs: ["Bir şeyin şekli, görünüşü", "Canlıların yediği şey"]
  },
  {
    word: "Elverişli",
    definition: "Bir iş için uygun olan, işe yarayan",
    wrongs: ["Ağaç yiyen böcek türü", "Korunmak için sığınılan yer"]
  },
  {
    word: "Yöntem",
    definition: "Bir amaca ulaşmak için izlenen düzenli yol",
    wrongs: ["Canlıların yaşamak için yedikleri şey", "Ağaç ve odun yiyen böcek türü"]
  }
];

const COLORS = [
  "#FF6B9D", "#C471ED", "#4FC3F7", "#69F0AE",
  "#FFD54F", "#FFB74D", "#E040FB", "#4DB6AC"
];

let isSpinning = false;
let currentAngle = 0;
let selectedWordIdx = null;
let correctCount = 0;
let totalAttempts = 0;
let usedWords = [];

const canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");

let WHEEL_SIZE, CENTER, RADIUS;

function resizeWheel() {
  // Use 90% of width or 60% of height, whichever is smaller, but max 600px
  const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.6, 600);
  WHEEL_SIZE = size;
  CENTER = WHEEL_SIZE / 2;
  RADIUS = CENTER - 20;

  // Çözünürlük sorununu çözmek için supersampling (2x) uyguluyoruz
  const dpr = (window.devicePixelRatio || 1) * 2;
  canvas.width = WHEEL_SIZE * dpr;
  canvas.height = WHEEL_SIZE * dpr;
  canvas.style.width = `${WHEEL_SIZE}px`;
  canvas.style.height = `${WHEEL_SIZE}px`;

  ctx.scale(dpr, dpr);
  drawWheel(currentAngle * Math.PI / 180);
}

window.addEventListener('resize', resizeWheel);

function drawWheel(angle) {
  if (!WHEEL_SIZE) return;
  ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
  const sliceAngle = (2 * Math.PI) / WORDS.length;

  WORDS.forEach(function (w, i) {
    const startA = angle + i * sliceAngle;
    const endA = startA + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.arc(CENTER, CENTER, RADIUS, startA, endA);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(2, WHEEL_SIZE / 150);
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(startA + sliceAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    // Scale font size with wheel size - INCREASED
    const fontSize = Math.max(16, WHEEL_SIZE / 18);
    ctx.font = `bold ${fontSize}px 'Baloo 2', sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 5;
    ctx.fillText(w.word, RADIUS * 0.62, fontSize / 3);
    ctx.restore();
  });

  // Center circle
  const centerRadius = WHEEL_SIZE / 15;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, centerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center emoji
  ctx.font = `${centerRadius * 0.8}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🎡", CENTER, CENTER);
}

function spinWheel() {
  if (isSpinning) return;
  const unusedIndices = [];
  for (let i = 0; i < WORDS.length; i++) {
    if (!usedWords.includes(i)) unusedIndices.push(i);
  }

  if (unusedIndices.length === 0) { showCompletion(); return; }

  isSpinning = true;
  document.getElementById("spin-btn").disabled = true;
  document.getElementById("landed-word").textContent = "Dönüyor... 🎡";

  // Pick target sequentially based on array order
  const targetIdx = unusedIndices[0];
  const sliceDeg = 360 / WORDS.length;
  const targetSliceCenter = targetIdx * sliceDeg + sliceDeg / 2;
  const finalRotation = (360 - targetSliceCenter + 270) % 360;
  const extraSpins = 5 + Math.floor(Math.random() * 2);
  const targetAngle = currentAngle + (extraSpins * 360) + (finalRotation - (currentAngle % 360) + 360) % 360;

  const duration = 4500;
  const startAngle = currentAngle;
  let startTime = null;

  function animate(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // Smoother ease out
    currentAngle = startAngle + (targetAngle - startAngle) * ease;
    drawWheel((currentAngle * Math.PI) / 180);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentAngle = targetAngle;
      onSpinComplete();
    }
  }
  requestAnimationFrame(animate);
}

function onSpinComplete() {
  isSpinning = false;
  const sliceDeg = 360 / WORDS.length;
  const normalizedAngle = (360 - (currentAngle % 360) + 270) % 360;
  let idx = Math.floor(normalizedAngle / sliceDeg);
  if (idx >= WORDS.length) idx = 0;

  selectedWordIdx = idx;
  showResult(idx);
}

function showResult(idx) {
  const w = WORDS[idx];
  const area = document.getElementById("definition-area");
  const wordDisplay = document.getElementById("landed-word");

  wordDisplay.textContent = w.word;
  area.style.display = "block";

  if (!usedWords.includes(idx)) {
    usedWords.push(idx);
    updateProgress();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }

  setTimeout(() => {
    document.getElementById("spin-btn").disabled = false;
  }, 2000);
}

function updateProgress() {
  const pct = (usedWords.length / WORDS.length) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent =
    usedWords.length + " / " + WORDS.length + " kelime tamamlandı";

  if (usedWords.length === WORDS.length) {
    setTimeout(showCompletion, 3000);
  }
}

function showCompletion() {
  document.getElementById("wheel-area").style.display = "none";
  const cs = document.getElementById("completion-screen");
  cs.style.display = "flex";
  cs.classList.add("active");
  document.getElementById("progress-fill").style.width = "100%";
  document.getElementById("progress-label").textContent = "Tebrikler!";
  document.getElementById("final-score").textContent = "Tüm kelimeleri başarıyla keşfettin! 🎉";
  document.getElementById("completion-msg").textContent = "Harikasın! Hepsini öğrendin! 🌟";
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  setTimeout(function () { confetti({ particleCount: 100, spread: 120 }); }, 600);
}

function initGame() {
  resizeWheel();
  isSpinning = false;
  currentAngle = 0;
  selectedWordIdx = null;
  correctCount = 0;
  totalAttempts = 0;
  usedWords = [];
  document.getElementById("wheel-area").style.display = "flex";
  document.getElementById("completion-screen").classList.remove("active");
  document.getElementById("completion-screen").style.display = "none";
  document.getElementById("definition-area").style.display = "block";
  document.getElementById("landed-word").textContent = "Haydi çevir bakalım!";
  document.getElementById("spin-btn").disabled = false;
  updateProgress();
  drawWheel(0);
}

document.addEventListener("DOMContentLoaded", initGame);
