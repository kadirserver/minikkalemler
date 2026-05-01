/* ============================================
   Minik Kalemler - Matching Game Logic
   ============================================ */

const matchingData = [
  { id: 'cow', animal: 'inek', tool: 'fırça', animalImg: '🐄', toolImg: '🖌️' },
  { id: 'octopus', animal: 'ahtapot', tool: 'deniz kabuğu', animalImg: '🐙', toolImg: '🐚' },
  { id: 'otter', animal: 'su samuru', tool: 'taş', animalImg: '🦦', toolImg: '🪨' },
  { id: 'bird', animal: 'kuş', tool: 'dal', animalImg: '🐦', toolImg: '🌿' }
];

const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const progressStars = document.getElementById('progress-stars');
const dragLine = document.getElementById('drag-line');

let draggedElement = null;
let lineStartX, lineStartY;
let matchedPairs = 0;

function initMatching() {
  matchedPairs = 0;
  renderStars();
  updateProgress();

  // Hide line on start
  if (dragLine) dragLine.style.display = 'none';

  // Desktop drag listeners for line
  document.addEventListener('dragover', handleGlobalDragOver);
  document.addEventListener('dragend', hideDragLine);

  // Shuffle arrays for variety
  const animals = [...matchingData].sort(() => Math.random() - 0.5);
  const tools = [...matchingData].sort(() => Math.random() - 0.5);

  renderItems(animals, 'animal', leftColumn);
  renderItems(tools, 'tool', rightColumn);
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

function renderStars() {
  progressStars.innerHTML = '';
  for (let i = 0; i < matchingData.length; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.innerText = '⭐';
    progressStars.appendChild(star);
  }
}

function updateProgress() {
  const progress = (matchedPairs / matchingData.length) * 100;
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressLabel) progressLabel.innerText = `${matchedPairs} / ${matchingData.length} eşleşme`;

  const stars = progressStars.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < matchedPairs) star.classList.add('earned');
  });
}

function renderItems(items, type, container) {
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'match-item';
    div.draggable = true;
    div.dataset.id = item.id;
    div.dataset.type = type;

    const content = type === 'animal' ? (item.animalImgPath ? `<img src="${item.animalImgPath}" style="width:100%; height:100%; object-fit:contain;">` : item.animalImg) : item.toolImg;

    div.innerHTML = `
      <div>${content}</div>
      <span>${type === 'animal' ? item.animal : item.tool}</span>
    `;

    // Mouse Events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);

    // Touch Events for Mobile
    div.addEventListener('touchstart', handleTouchStart, { passive: false });
    div.addEventListener('touchmove', handleTouchMove, { passive: false });
    div.addEventListener('touchend', handleTouchEnd);

    container.appendChild(div);
  });
}

// --- Drag & Drop (Desktop) ---
function handleDragStart(e) {
  draggedElement = e.target.closest('.match-item');
  if (!draggedElement || draggedElement.classList.contains('matched')) {
    e.preventDefault();
    return;
  }

  draggedElement.classList.add('dragging');
  e.dataTransfer.setData('text/plain', draggedElement.dataset.id);
  e.dataTransfer.setData('type', draggedElement.dataset.type);

  // Initialize line position
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

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const dropTarget = e.target.closest('.match-item');
  if (!dropTarget || dropTarget === draggedElement) return;

  const droppedId = e.dataTransfer.getData('text/plain');
  const droppedType = e.dataTransfer.getData('type');
  const targetId = dropTarget.dataset.id;
  const targetType = dropTarget.dataset.type;

  processMatch(droppedId, droppedType, targetId, targetType, dropTarget);
}

function handleDragEnd(e) {
  if (draggedElement) draggedElement.classList.remove('dragging');
  draggedElement = null;
  hideDragLine();
}

// --- Touch Events (Mobile) ---
function handleTouchStart(e) {
  draggedElement = e.target.closest('.match-item');
  if (!draggedElement || draggedElement.classList.contains('matched')) return;

  draggedElement.classList.add('dragging');

  // Initialize line position
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
  e.preventDefault(); // Prevent scrolling while dragging

  const touch = e.touches[0];
  updateDragLine(touch.clientX, touch.clientY);
}

function handleTouchEnd(e) {
  if (!draggedElement) return;

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.match-item');

  if (dropTarget && dropTarget !== draggedElement) {
    processMatch(
      draggedElement.dataset.id,
      draggedElement.dataset.type,
      dropTarget.dataset.id,
      dropTarget.dataset.type,
      dropTarget
    );
  }

  draggedElement.classList.remove('dragging');
  draggedElement = null;
  hideDragLine();
}

// --- Shared Logic ---
function processMatch(droppedId, droppedType, targetId, targetType, dropTarget) {
  if (droppedType !== targetType && droppedId === targetId) {
    // Correct match!
    const items = document.querySelectorAll(`[data-id="${droppedId}"]`);
    items.forEach(item => {
      item.classList.add('matched');
      item.draggable = false;
    });

    matchedPairs++;
    updateProgress();
    triggerConfetti();
    checkWin();
  } else if (droppedType !== targetType) {
    // Wrong match
    dropTarget.classList.add('wrong');
    setTimeout(() => dropTarget.classList.remove('wrong'), 500);
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF6B9D', '#4FC3F7', '#69F0AE']
    });
  }
}

function checkWin() {
  if (matchedPairs === matchingData.length) {
    setTimeout(() => {
      const completionScreen = document.getElementById('completion-screen');
      if (completionScreen) {
        completionScreen.classList.add('active');
      }
    }, 500);
  }
}

// Load confetti library if not present
if (typeof confetti !== 'function') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.head.appendChild(script);
}

window.onload = initMatching;
