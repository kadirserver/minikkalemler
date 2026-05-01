/* ============================================
   Minik Kalemler - Video Gallery Logic
   ============================================ */

const videoData = [
  {
    id: 1,
    title: "Video 1",
    src: "assets/video-1.mp4",
    poster: "assets/thumbnail-1.png",
    emoji: "🎬"
  },
  {
    id: 2,
    title: "Video 2",
    src: "assets/video2.mp4",
    poster: "assets/video2-poster.jpg",
    emoji: "🦁"
  }
];

const tabsContainer = document.getElementById('tabs-container');
const videoArea = document.getElementById('video-area');

function initVideos() {
  renderTabs();
  loadVideo(videoData[0].id);
}

function renderTabs() {
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';
  videoData.forEach(video => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.id = video.id;
    btn.innerHTML = `<span>${video.emoji}</span> ${video.title}`;
    btn.onclick = () => loadVideo(video.id);
    tabsContainer.appendChild(btn);
  });
}

function loadVideo(id) {
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.id) === id);
  });

  const video = videoData.find(v => v.id === id);
  if (!videoArea || !video) return;
  
  videoArea.innerHTML = `
    <div class="video-wrapper">
      <video controls poster="${video.poster}" key="${video.src}">
        <source src="${video.src}" type="video/mp4">
        Tarayıcınız video etiketini desteklemiyor.
      </video>
      <div class="video-info">
        <h3>${video.emoji} ${video.title}</h3>
      </div>
    </div>
  `;
}

window.onload = initVideos;
