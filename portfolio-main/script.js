/* ================= PAGE INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupPortfolioCarousel();
  setupPortfolioFilters();
  setupLightbox();
  setupContactForm();
  setupInstagramReels();
  setupTestimonials();
});

/* ================= NAVIGATION ================= */
function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ================= PORTFOLIO CAROUSEL ================= */
function setupPortfolioCarousel() {
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (portfolioItems.length < 4) return; // Only enable carousel for 4+ items

  // Create carousel container
  const container = document.createElement('div');
  container.className = 'portfolio-container';
  portfolioGrid.parentNode.insertBefore(container, portfolioGrid);
  container.appendChild(portfolioGrid);

  // Create carousel controls
  const navButtons = document.createElement('div');
  navButtons.className = 'carousel-nav visible';
  navButtons.innerHTML = `
    <button class="carousel-prev" aria-label="Previous">❮</button>
    <button class="carousel-next" aria-label="Next">❯</button>
  `;
  container.appendChild(navButtons);

  // Create indicators
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators visible';
  for (let i = 0; i < Math.ceil(portfolioItems.length / 3); i++) {
    const dot = document.createElement('div');
    dot.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => scrollToPage(i));
    indicators.appendChild(dot);
  }
  container.appendChild(indicators);

  // Enable carousel mode
  portfolioGrid.classList.add('carousel-mode');

  let currentPage = 0;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);

  function updateButtons() {
    document.querySelector('.carousel-prev').disabled = currentPage === 0;
    document.querySelector('.carousel-next').disabled = currentPage === totalPages - 1;
    
    document.querySelectorAll('.carousel-indicator').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentPage);
    });
  }

  function scrollToPage(page) {
    currentPage = Math.max(0, Math.min(page, totalPages - 1));
    const scrollPosition = currentPage * (320 + 20) * itemsPerPage;
    portfolioGrid.scrollLeft = scrollPosition;
    updateButtons();
  }

  document.querySelector('.carousel-prev').addEventListener('click', () => {
    scrollToPage(currentPage - 1);
  });

  document.querySelector('.carousel-next').addEventListener('click', () => {
    scrollToPage(currentPage + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  portfolioGrid.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  portfolioGrid.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        scrollToPage(currentPage + 1);
      } else {
        // Swiped right - go to previous
        scrollToPage(currentPage - 1);
      }
    }
  }

  // Scroll event for indicators
  portfolioGrid.addEventListener('scroll', () => {
    const scrollLeft = portfolioGrid.scrollLeft;
    const itemWidth = 320 + 20;
    const newPage = Math.round(scrollLeft / (itemWidth * itemsPerPage));
    
    if (newPage !== currentPage && newPage < totalPages) {
      currentPage = newPage;
      updateButtons();
    }
  });

  updateButtons();
}

/* ================= PORTFOLIO FILTERS ================= */
function setupPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-buttons button');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const portfolioItems = document.querySelectorAll('.portfolio-item');
      let visibleCount = 0;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
          item.style.display = 'block';
          visibleCount++;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });

      // Reinitialize carousel if needed
      if (visibleCount >= 4) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid.classList.contains('carousel-mode')) {
          setupPortfolioCarousel();
        }
      }
    });
  });
}

/* ================= LIGHTBOX ================= */
function setupLightbox() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const media = item.querySelector('img, video');
      
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

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

/* ================= CONTACT FORM ================= */
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;
      const method = document.querySelector('input[name="contactMethod"]:checked').value;
      
      const formData = {
        name: name,
        email: email,
        message: message,
        method: method,
        timestamp: new Date().toLocaleString()
      };

      // Save to localStorage
      let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
      submissions.push(formData);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      // Send via selected method
      if (method === 'whatsapp') {
        sendViaWhatsApp(name, email, message);
      } else if (method === 'email') {
        sendViaEmail(name, email, message);
      }
    });
  }
}

function sendViaWhatsApp(name, email, message) {
  const whatsappNumber = '9834622307';
  const text = encodeURIComponent(
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}`
  );
  
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;
  
  // Show confirmation
  const confirmSend = confirm(
    '✅ Ready to send via WhatsApp?\n\n' +
    `Name: ${name}\n` +
    `Message: ${message.substring(0, 50)}...`
  );
  
  if (confirmSend) {
    window.open(whatsappURL, '_blank');
    showSuccessMessage('Message sent to WhatsApp! 🎉');
    document.getElementById('contactForm').reset();
  }
}

function sendViaEmail(name, email, message) {
  const recipientEmail = 'anshphotos4me@gmail.com';
  const subject = encodeURIComponent(`Shoot Inquiry`);
  const body = encodeURIComponent(
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}\n\n` +
    `---\n` +
    `Sent from Portfolio Contact Form`
  );
  
  const mailtoURL = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  
  // Show confirmation
  const confirmSend = confirm(
    '✅ Ready to send via Email?\n\n' +
    `Recipient: ${recipientEmail}\n` +
    `Subject: New Message from ${name}\n\n` +
    `Your email: ${email}`
  );
  
  if (confirmSend) {
    window.location.href = mailtoURL;
    showSuccessMessage('Opening your email client... 📧');
    
    // Reset form after a delay
    setTimeout(() => {
      document.getElementById('contactForm').reset();
    }, 1000);
  }
}

function showSuccessMessage(message) {
  // Create success message element
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = message;
  document.body.appendChild(successMsg);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successMsg.classList.add('fade-out');
    setTimeout(() => successMsg.remove(), 300);
  }, 3000);
}

/* ================= INSTAGRAM REELS ================= */
function setupInstagramReels() {
  const reelGrid = document.getElementById('reelGrid');
  
  try {
    // Using Instagram Post URLs for embeds
    const instagramReels = [
      'https://www.instagram.com/p/DP_pn7Kj5Mh/',
      'https://www.instagram.com/p/DP6yhayj3fB/',
      'https://www.instagram.com/p/DPY0dB4D5Du/',
    ];

    reelGrid.innerHTML = '';

    instagramReels.forEach((url) => {
      const frameContainer = document.createElement('div');
      frameContainer.className = 'instagram-frame';
      
      const iframe = document.createElement('iframe');
      iframe.src = url + 'embed/captioned/';
      iframe.width = '320';
      iframe.height = '570';
      iframe.frameborder = '0';
      iframe.scrolling = 'no';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
      
      frameContainer.appendChild(iframe);
      reelGrid.appendChild(frameContainer);
    });

    // Load Instagram embed script
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
    } else {
      window.instgrm.Embeds.process();
    }

  } catch (error) {
    console.error('Error loading Instagram reels:', error);
    reelGrid.innerHTML = `
      <div class="reel-loading">
        <p>Unable to load reels. <a href="https://www.instagram.com/aansh.ig/" target="_blank" style="color: #CBDCEB; font-weight: 600;">View on Instagram</a></p>
      </div>
    `;
  }
}

/* ================= TESTIMONIALS SLIDER ================= */
function setupTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;

  if (testimonials.length === 0) return;

  setInterval(() => {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
  }, 4000);
}
document.querySelectorAll(".preview-video").forEach(video => {

  // Desktop hover
  video.parentElement.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });

  video.parentElement.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  // Mobile tap support
  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

});
