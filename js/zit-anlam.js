/* ============================================
   Zit Anlam Oyunu - Game Logic
   Game #3 for Minik Kalemler platform
   Match words with their antonyms
   ============================================ */

const PAIRS = [
  { left: "Sert", right: "Yumuşak" },
  { left: "Uzun", right: "Kısa" },
  { left: "Büyük", right: "Küçük" },
  { left: "Hızlı", right: "Yavaş" },
  { left: "Kalın", right: "İnce" },
  { left: "Kolay", right: "Zor" }
];

const dragLine = document.getElementById('drag-line');
let draggedElement = null;
let lineStartX, lineStartY;

// Shuffle helper
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function initGame() {
  matchedCount = 0;
  wrongAttempts = 0;
  draggedElement = null;
  
  document.getElementById("completion-screen").classList.remove("active");
  document.getElementById("completion-screen").style.display = "none";
  document.getElementById("game-area").style.display = "flex";
  
  if (dragLine) dragLine.style.display = 'none';

  // Desktop drag listeners for line
  document.addEventListener('dragover', handleGlobalDragOver);
  document.addEventListener('dragend', hideDragLine);

  updateProgress();
  buildBoard();
}

function handleGlobalDragOver(e) {
  if (!draggedElement) return;
  e.preventDefault();
  updateDragLine(e.clientX, e.clientY);
}

function updateDragLine(x, y) {
  if (!dragLine || !draggedElement) return;
  dragLine.setAttribute('x2', x);
  dragLine.setAttribute('y2', y);
}

function hideDragLine() {
  if (dragLine) dragLine.style.display = 'none';
}

function updateProgress() {
  const pct = (matchedCount / PAIRS.length) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent =
    matchedCount + " / " + PAIRS.length + " eşleşme";
}

function buildBoard() {
  const leftCol = document.getElementById("left-column");
  const rightCol = document.getElementById("right-column");
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  const shuffledLeft = shuffleArray(PAIRS);
  const shuffledRight = shuffleArray(PAIRS);

  shuffledLeft.forEach(function (pair) {
    const btn = document.createElement("button");
    btn.className = "match-btn left-btn";
    btn.textContent = pair.left;
    btn.draggable = true;
    btn.dataset.word = pair.left;
    btn.dataset.match = pair.right;
    btn.dataset.type = 'left';

    // Desktop Events
    btn.addEventListener('dragstart', handleDragStart);
    btn.addEventListener('dragover', (e) => e.preventDefault());
    btn.addEventListener('drop', handleDrop);
    
    // Touch Events
    btn.addEventListener('touchstart', handleTouchStart, { passive: false });
    btn.addEventListener('touchmove', handleTouchMove, { passive: false });
    btn.addEventListener('touchend', handleTouchEnd);

    leftCol.appendChild(btn);
  });

  shuffledRight.forEach(function (pair) {
    const btn = document.createElement("button");
    btn.className = "match-btn right-btn";
    btn.textContent = pair.right;
    btn.draggable = true;
    btn.dataset.word = pair.right;
    btn.dataset.type = 'right';

    // Desktop Events
    btn.addEventListener('dragstart', handleDragStart);
    btn.addEventListener('dragover', (e) => e.preventDefault());
    btn.addEventListener('drop', handleDrop);
    
    // Touch Events
    btn.addEventListener('touchstart', handleTouchStart, { passive: false });
    btn.addEventListener('touchmove', handleTouchMove, { passive: false });
    btn.addEventListener('touchend', handleTouchEnd);

    rightCol.appendChild(btn);
  });
}

// --- Drag & Drop (Desktop) ---
function handleDragStart(e) {
  draggedElement = e.target.closest('.match-btn');
  if (!draggedElement || draggedElement.classList.contains('matched')) {
    e.preventDefault();
    return;
  }
  
  draggedElement.classList.add('selected');
  e.dataTransfer.setData('word', draggedElement.dataset.word);
  e.dataTransfer.setData('type', draggedElement.dataset.type);
  if (draggedElement.dataset.match) {
    e.dataTransfer.setData('match', draggedElement.dataset.match);
  }

  // Initialize line
  const rect = draggedElement.getBoundingClientRect();
  lineStartX = rect.left + rect.width / 2;
  lineStartY = rect.top + rect.height / 2;
  
  if (dragLine) {
    dragLine.setAttribute('x1', lineStartX);
    dragLine.setAttribute('y1', lineStartY);
    dragLine.setAttribute('x2', lineStartX);
    dragLine.setAttribute('y2', lineStartY);
    dragLine.style.display = 'block';
  }
}

function handleDrop(e) {
  e.preventDefault();
  const dropTarget = e.target.closest('.match-btn');
  if (!dropTarget || dropTarget === draggedElement) return;

  const dWord = e.dataTransfer.getData('word');
  const dType = e.dataTransfer.getData('type');
  const dMatch = e.dataTransfer.getData('match');
  
  const tWord = dropTarget.dataset.word;
  const tType = dropTarget.dataset.type;

  checkMatch(dWord, dType, dMatch, tWord, tType, dropTarget);
}

// --- Touch Events (Mobile) ---
function handleTouchStart(e) {
  draggedElement = e.target.closest('.match-btn');
  if (!draggedElement || draggedElement.classList.contains('matched')) return;

  draggedElement.classList.add('selected');

  const rect = draggedElement.getBoundingClientRect();
  lineStartX = rect.left + rect.width / 2;
  lineStartY = rect.top + rect.height / 2;
  
  if (dragLine) {
    dragLine.setAttribute('x1', lineStartX);
    dragLine.setAttribute('y1', lineStartY);
    dragLine.setAttribute('x2', lineStartX);
    dragLine.setAttribute('y2', lineStartY);
    dragLine.style.display = 'block';
  }
}

function handleTouchMove(e) {
  if (!draggedElement) return;
  e.preventDefault();
  const touch = e.touches[0];
  updateDragLine(touch.clientX, touch.clientY);
}

function handleTouchEnd(e) {
  if (!draggedElement) return;

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.match-btn');

  if (dropTarget && dropTarget !== draggedElement) {
    const dWord = draggedElement.dataset.word;
    const dType = draggedElement.dataset.type;
    const dMatch = draggedElement.dataset.match;
    const tWord = dropTarget.dataset.word;
    const tType = dropTarget.dataset.type;

    checkMatch(dWord, dType, dMatch, tWord, tType, dropTarget);
  }

  draggedElement.classList.remove('selected');
  draggedElement = null;
  hideDragLine();
}

function checkMatch(dWord, dType, dMatch, tWord, tType, dropTarget) {
  hideDragLine();
  
  let isCorrect = false;
  if (dType !== tType) {
    if (dType === 'left' && dMatch === tWord) isCorrect = true;
    if (dType === 'right' && dropTarget.dataset.match === dWord) isCorrect = true;
  }

  if (isCorrect) {
    const dElem = draggedElement;
    const tElem = dropTarget;
    dElem.classList.add("matched");
    tElem.classList.add("matched");
    dElem.classList.remove("selected");
    tElem.classList.remove("selected");
    matchedCount++;
    updateProgress();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 },
      colors: ['#FF6B9D','#C471ED','#4FC3F7','#69F0AE','#FFD54F'] });
    
    if (matchedCount === PAIRS.length) {
      setTimeout(showCompletion, 800);
    }
  } else if (dType !== tType) {
    wrongAttempts++;
    draggedElement.classList.add("wrong-match");
    dropTarget.classList.add("wrong-match");
    const d = draggedElement, t = dropTarget;
    setTimeout(function () {
      d.classList.remove("wrong-match", "selected");
      t.classList.remove("wrong-match", "selected");
    }, 600);
  }
}

function showCompletion() {
  document.getElementById("game-area").style.display = "none";
  const cs = document.getElementById("completion-screen");
  cs.style.display = "flex";
  cs.classList.add("active");
  document.getElementById("progress-fill").style.width = "100%";
  document.getElementById("progress-label").textContent = "Tamamlandı!";
  document.getElementById("final-score").textContent =
    PAIRS.length + " / " + PAIRS.length + " eşleşme tamamlandı!";
  const msgEl = document.getElementById("completion-msg");
  if (wrongAttempts === 0) msgEl.textContent = "Mükemmel! Hiç hata yapmadın! 🌟";
  else if (wrongAttempts <= 3) msgEl.textContent = "Harika gidiyorsun! Çok az hata yaptın! 💪";
  else msgEl.textContent = "Tebrikler, hepsini eşleştirdin! 📚";
  confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 },
    colors: ['#FF6B9D','#C471ED','#4FC3F7','#69F0AE','#FFD54F'] });
  setTimeout(function () { confetti({ particleCount: 60, spread: 90, origin: { y: 0.6 } }); }, 400);
}

document.addEventListener("DOMContentLoaded", initGame);
