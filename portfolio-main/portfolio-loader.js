// Load portfolio items from admin panel

document.addEventListener('DOMContentLoaded', () => {
  loadPortfolioFromAdmin();
  setupPortfolioFilters();
});

function loadPortfolioFromAdmin() {
  const savedPortfolio = localStorage.getItem('portfolioItems');
  const portfolioTitle = localStorage.getItem('portfolioContent') 
    ? JSON.parse(localStorage.getItem('portfolioContent')).portfolio?.title 
    : 'Portfolio';

  // Update section title
  document.getElementById('portfolioSectionTitle').textContent = portfolioTitle || 'Portfolio';

  if (!savedPortfolio) {
    console.log('No portfolio items found in admin');
    return;
  }

  const items = JSON.parse(savedPortfolio);
  renderPortfolioOnMainSite(items);
}

function renderPortfolioOnMainSite(items) {
  const grid = document.getElementById('mainPortfolioGrid');
  
  if (items.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No portfolio items yet.</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="portfolio-item ${item.category}" data-type="${item.category}">
      ${item.type === 'video' 
        ? `<video src="${item.assetPath}" muted></video>`
        : `<img src="${item.assetPath}" alt="${item.title}">`
      }
      <div class="portfolio-label">${item.category === 'photo' ? 'Photography' : item.category === 'video' ? 'Videography' : 'Editing'}</div>
    </div>
  `).join('');

  // Setup lightbox for portfolio items
  setupLightbox();
}

function setupPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const items = document.querySelectorAll('.portfolio-item');
      items.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function setupLightbox() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const media = item.querySelector('img, video');
      const lightbox = document.getElementById('lightbox');
      
      if (media.tagName === 'IMG') {
        document.getElementById('lightbox-img').src = media.src;
        document.getElementById('lightbox-img').style.display = 'block';
        document.getElementById('lightbox-video').style.display = 'none';
      } else {
        document.getElementById('lightbox-video').src = media.src;
        document.getElementById('lightbox-video').style.display = 'block';
        document.getElementById('lightbox-img').style.display = 'none';
      }
      
      lightbox.classList.add('active');
    });
  });
}
