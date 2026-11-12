/**
 * KHÁM PHÁ VŨ TRỤ – COSMOS EXPLORATION
 * Kiến trúc JavaScript: Hướng Module, Tối ưu hiệu năng 60fps & Trải nghiệm tương tác cao cấp
 */

(function () {
  'use strict';

  // --- Bộ chọn tiện ích ---
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /* ==========================================================================
     1. CANVAS VŨ TRỤ: BẦU TRỜI SAO LẤP LÁNH & SAO BĂNG (SHOOTING STARS)
     ========================================================================== */
  class CosmicCanvas {
    constructor(canvasId) {
      this.canvas = $(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.stars = [];
      this.shootingStars = [];
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lastShootingStarTime = 0;
      this.shootingStarInterval = 4000; // Khoảng 4 giây xuất hiện một ngôi sao băng

      this.init();
      this.bindEvents();
      this.animate(0);
    }

    init() {
      this.resize();
      this.createStars();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    createStars() {
      const starCount = Math.floor(Math.min(220, (this.width * this.height) / 7000));
      this.stars = [];

      const colors = ['#FFFFFF', '#EAF0FF', '#3DD6F5', '#C084FC', '#FED7AA'];

      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 1.5 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.002 + 0.001,
          phase: Math.random() * Math.PI * 2,
          isGlitter: Math.random() > 0.85
        });
      }
    }

    spawnShootingStar() {
      if (this.isReducedMotion) return;
      const startX = Math.random() * (this.width * 0.8);
      const startY = Math.random() * (this.height * 0.4);
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 độ
      const speed = Math.random() * 8 + 12;
      const length = Math.random() * 80 + 70;

      this.shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: length,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    draw(timestamp) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Vẽ các ngôi sao nền lấp lánh
      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        let currentAlpha = star.alpha;

        if (!this.isReducedMotion) {
          currentAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(timestamp * star.speed + star.phase));
        }

        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Hiệu ứng hào quang cho các sao đặc biệt
        if (star.isGlitter && currentAlpha > 0.7) {
          this.ctx.strokeStyle = star.color;
          this.ctx.globalAlpha = (currentAlpha - 0.7) * 1.5;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(star.x - star.radius * 3.5, star.y);
          this.ctx.lineTo(star.x + star.radius * 3.5, star.y);
          this.ctx.moveTo(star.x, star.y - star.radius * 3.5);
          this.ctx.lineTo(star.x, star.y + star.radius * 3.5);
          this.ctx.stroke();
        }
      }

      // 2. Vẽ sao băng (Shooting Stars)
      if (!this.isReducedMotion) {
        if (timestamp - this.lastShootingStarTime > this.shootingStarInterval) {
          this.spawnShootingStar();
          this.lastShootingStarTime = timestamp;
          this.shootingStarInterval = Math.random() * 3500 + 3000;
        }

        for (let j = this.shootingStars.length - 1; j >= 0; j--) {
          const s = this.shootingStars[j];
          s.x += s.dx;
          s.y += s.dy;
          s.life -= s.decay;

          if (s.life <= 0 || s.x > this.width || s.y > this.height) {
            this.shootingStars.splice(j, 1);
            continue;
          }

          const tailX = s.x - (s.dx / Math.hypot(s.dx, s.dy)) * s.length;
          const tailY = s.y - (s.dy / Math.hypot(s.dx, s.dy)) * s.length;

          const grad = this.ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(61, 214, 245, 0)');
          grad.addColorStop(0.7, `rgba(124, 92, 255, ${s.life * 0.7})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${s.life})`);

          this.ctx.beginPath();
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 2;
          this.ctx.lineCap = 'round';
          this.ctx.moveTo(tailX, tailY);
          this.ctx.lineTo(s.x, s.y);
          this.ctx.stroke();
        }
      }

      this.ctx.globalAlpha = 1.0;
    }

    animate(timestamp) {
      this.draw(timestamp);
      requestAnimationFrame((t) => this.animate(t));
    }

    bindEvents() {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createStars();
        }, 150);
      }, { passive: true });
    }
  }

  /* ==========================================================================
     2. BỘ TẠO ÂM THANH VŨ TRỤ TINH TẾ (WEB AUDIO API SYNTHESIZER)
     ========================================================================== */
  class CosmicAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('cosmos_audio_muted') !== 'false'; // Mặc định yên tĩnh
      this.btn = $('#btn-sound');
      this.updateBtnUI();

      if (this.btn) {
        this.btn.addEventListener('click', () => this.toggleSound());
      }
    }

    initContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleSound() {
      this.initContext();
      this.isMuted = !this.isMuted;
      localStorage.setItem('cosmos_audio_muted', this.isMuted);
      this.updateBtnUI();

      if (!this.isMuted) {
        this.playChime(587.33, 'triangle', 0.15, 0.4); // D5
        setTimeout(() => this.playChime(880.00, 'sine', 0.1, 0.6), 120); // A5
      }
    }

    updateBtnUI() {
      if (!this.btn) return;
      this.btn.innerHTML = this.isMuted ? '🔇' : '🔊';
      this.btn.setAttribute('aria-label', this.isMuted ? 'Bật hiệu ứng âm thanh' : 'Tắt hiệu ứng âm thanh');
      this.btn.title = this.isMuted ? 'Bật âm thanh không gian' : 'Tắt âm thanh';
    }

    playChime(freq = 440, type = 'sine', volume = 0.1, duration = 0.5) {
      if (this.isMuted) return;
      try {
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Trình duyệt không hỗ trợ hoặc chính sách tự động phát
      }
    }
  }

  /* ==========================================================================
     3. RENDER NỘI DUNG & DANH SÁCH THIÊN THỂ
     ========================================================================== */
  class CosmosApp {
    constructor() {
      this.audio = new CosmicAudio();
      this.activeModal = null;
      this.lastFocusedElement = null;

      // Trạng thái gallery
      this.currentCategory = 'Tất cả';
      this.filteredGallery = [];
      this.lightboxIndex = 0;

      // Trạng thái fact
      this.currentFactIndex = Math.floor(Math.random() * COSMIC_FACTS.length);

      this.init();
    }

    init() {
      this.renderSolarSystem();
      this.renderCelestialObjects();
      this.renderGalleryTabs();
      this.renderGalleryGrid();
      this.renderFAQ();
      this.initFunFacts();
      this.bindNavigation();
      this.bindScrollEffects();
      this.bindModalEvents();
      this.initScrollReveal();
    }

    // Helper tạo HTML ảnh với fallback SVG an toàn
    createImageHTML(imgData, altName, svgFallback, isEager = false) {
      const src = getWikiImgUrl(imgData.file, 800);
      return `
        <div class="card-photo-fallback" aria-hidden="true">${svgFallback || ''}</div>
        <img 
          src="${src}" 
          alt="${altName} – Nguồn ảnh: ${imgData.author}" 
          ${isEager ? 'loading="eager"' : 'loading="lazy"'}
          class="cosmic-image"
          onload="this.classList.add('loaded')"
          onerror="this.style.opacity='0'; this.style.pointerEvents='none';"
        />
      `;
    }

    /* --- Section 1: Hệ Mặt Trời --- */
    renderSolarSystem() {
      const container = $('#solar-grid');
      const quickBar = $('#solar-quick-bar');
      if (!container) return;

      // Render danh sách quick bar
      if (quickBar) {
        quickBar.innerHTML = SOLAR_SYSTEM.map((planet) => `
          <button class="quick-planet-pill" data-planet-id="${planet.id}">
            <span class="pill-dot" style="background: ${planet.color}"></span>
            <span>${planet.name}</span>
          </button>
        `).join('');

        quickBar.addEventListener('click', (e) => {
          const pill = e.target.closest('.quick-planet-pill');
          if (!pill) return;
          const planetId = pill.dataset.planetId;
          const targetCard = $(`#card-solar-${planetId}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.outline = `3px solid var(--cy)`;
            setTimeout(() => { targetCard.style.outline = 'none'; }, 1800);
          }
        });
      }

      // Render các cards trong Grid
      container.innerHTML = SOLAR_SYSTEM.map((obj, index) => {
        const chipsHTML = obj.chips.map(c => `<span class="chip">${c}</span>`).join('');
        return `
          <article 
            class="cosmic-card reveal" 
            id="card-solar-${obj.id}"
            style="--accent-color: ${obj.color}; --accent-glow: ${obj.color}55;"
          >
            <div class="card-photo">
              <span class="card-type-badge">${obj.type}</span>
              ${this.createImageHTML(obj.image, obj.name, obj.svgFallback)}
            </div>
            <div class="card-body">
              <div class="card-title-group">
                <h3 class="card-title">${obj.name}</h3>
                <span class="card-subtitle">${obj.englishName}</span>
              </div>
              <p class="card-tagline">${obj.tagline}</p>
              <div class="card-chips">${chipsHTML}</div>
              <button 
                class="btn-card-more" 
                data-type="solar" 
                data-index="${index}"
                aria-label="Tìm hiểu chi tiết về ${obj.name}"
              >
                <span>Tìm hiểu thêm</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        `;
      }).join('');
    }

    /* --- Section 2: Thiên thể ngoài Hệ Mặt Trời --- */
    renderCelestialObjects() {
      const container = $('#objects-grid');
      if (!container) return;

      container.innerHTML = CELESTIAL_OBJECTS.map((obj, index) => {
        const chipsHTML = obj.chips.map(c => `<span class="chip">${c}</span>`).join('');
        return `
          <article 
            class="cosmic-card reveal" 
            id="card-obj-${obj.id}"
            style="--accent-color: ${obj.accentColor}; --accent-glow: ${obj.accentColor}55;"
          >
            <div class="card-photo">
              <span class="card-type-badge">${obj.category}</span>
              ${this.createImageHTML(obj.image, obj.name, obj.svgFallback)}
            </div>
            <div class="card-body">
              <div class="card-title-group">
                <h3 class="card-title">${obj.name}</h3>
                <span class="card-subtitle">${obj.englishName}</span>
              </div>
              <p class="card-tagline">${obj.tagline}</p>
              <div class="card-chips">${chipsHTML}</div>
              <button 
                class="btn-card-more" 
                data-type="object" 
                data-index="${index}"
                aria-label="Tìm hiểu chi tiết về ${obj.name}"
              >
                <span>Tìm hiểu thêm</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        `;
      }).join('');
    }

    /* --- Section 3: Thư viện ảnh thiên văn --- */
    renderGalleryTabs() {
      const tabsContainer = $('#gallery-tabs');
      if (!tabsContainer) return;

      const categories = ['Tất cả', 'Tinh vân', 'Hành tinh', 'Thiên hà', 'Hố đen & Sao'];

      tabsContainer.innerHTML = categories.map((cat, idx) => `
        <button 
          class="tab-btn ${idx === 0 ? 'active' : ''}" 
          data-category="${cat}"
          role="tab"
          aria-selected="${idx === 0 ? 'true' : 'false'}"
        >
          <span>${cat}</span>
        </button>
      `).join('');

      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        
        $$('.tab-btn', tabsContainer).forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.currentCategory = btn.dataset.category;
        this.renderGalleryGrid();
        this.audio.playChime(659.25, 'sine', 0.08, 0.2); // E5
      });
    }

    renderGalleryGrid() {
      const grid = $('#gallery-grid');
      if (!grid) return;

      this.filteredGallery = this.currentCategory === 'Tất cả' 
        ? GALLERY_ITEMS 
        : GALLERY_ITEMS.filter(item => item.category === this.currentCategory);

      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';

      setTimeout(() => {
        grid.innerHTML = this.filteredGallery.map((item, index) => `
          <div 
            class="gallery-card reveal revealed" 
            data-gallery-index="${index}"
            tabindex="0"
            role="button"
            aria-label="Xem ảnh phóng to: ${item.title}"
          >
            <img 
              src="${getWikiImgUrl(item.file, 600)}" 
              alt="${item.title}" 
              loading="lazy" 
              onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80';"
            />
            <div class="gallery-card-overlay">
              <span class="gallery-card-badge">${item.badge || item.category}</span>
              <h3 class="gallery-card-title">${item.title}</h3>
            </div>
          </div>
        `).join('');

        grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'none';

        // Gắn sự kiện click mở lightbox
        $$('.gallery-card', grid).forEach(card => {
          const open = () => {
            this.lightboxIndex = parseInt(card.dataset.galleryIndex, 10);
            this.openLightbox();
          };
          card.addEventListener('click', open);
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              open();
            }
          });
        });
      }, 150);
    }

    /* --- Section 4: Hỏi – Đáp (FAQ) --- */
    renderFAQ() {
      const container = $('#faq-grid');
      if (!container) return;

      container.innerHTML = FAQ_ITEMS.map((item, index) => `
        <article class="faq-card reveal">
          <span class="faq-tag">${item.tag}</span>
          <h3 class="faq-question">${item.question}</h3>
          <p class="faq-short-answer">${item.shortAnswer}</p>
          <button 
            class="btn-faq-expand" 
            data-faq-index="${index}"
            aria-label="Đọc giải thích chi tiết câu hỏi: ${item.question}"
          >
            <span>Giải thích khoa học chi tiết</span>
            <span aria-hidden="true">→</span>
          </button>
        </article>
      `).join('');

      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-faq-expand');
        if (!btn) return;
        const index = parseInt(btn.dataset.faqIndex, 10);
        this.openFAQModal(index);
      });
    }

    /* --- Section 5: Sự thật thú vị --- */
    initFunFacts() {
      const textEl = $('#fact-text');
      const categoryEl = $('#fact-category');
      const counterEl = $('#fact-counter');
      const nextBtn = $('#btn-next-fact');
      const copyBtn = $('#btn-copy-fact');

      if (!textEl || !nextBtn) return;

      const updateUI = () => {
        const f = COSMIC_FACTS[this.currentFactIndex];
        const displayBox = $('#fact-display-box');
        if (displayBox) {
          displayBox.style.opacity = '0';
          displayBox.style.transform = 'scale(0.96)';
        }

        setTimeout(() => {
          textEl.textContent = `${f.icon} ${f.fact}`;
          if (categoryEl) categoryEl.textContent = f.category;
          if (counterEl) counterEl.textContent = `Sự thật #${this.currentFactIndex + 1} / ${COSMIC_FACTS.length}`;

          if (displayBox) {
            displayBox.style.opacity = '1';
            displayBox.style.transform = 'scale(1)';
          }
        }, 180);
      };

      updateUI();

      nextBtn.addEventListener('click', () => {
        this.currentFactIndex = (this.currentFactIndex + 1) % COSMIC_FACTS.length;
        updateUI();
        this.audio.playChime(523.25, 'sine', 0.1, 0.25); // C5
      });

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const f = COSMIC_FACTS[this.currentFactIndex];
          const textToCopy = `[Sự thật vũ trụ] ${f.fact}`;
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✓ Đã sao chép!</span>';
            copyBtn.style.borderColor = 'var(--cy)';
            setTimeout(() => {
              copyBtn.innerHTML = originalHTML;
              copyBtn.style.borderColor = '';
            }, 2000);
          });
        });
      }
    }

    /* ==========================================================================
       4. MODAL & LIGHTBOX CONTROLLERS
       ========================================================================== */
    openModalElement(modalEl, focusElement) {
      this.lastFocusedElement = document.activeElement;
      this.activeModal = modalEl;
      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';

      const focusTarget = focusElement || modalEl.querySelector('.modal-close-btn');
      if (focusTarget) focusTarget.focus();

      this.audio.playChime(440, 'triangle', 0.12, 0.35); // A4
    }

    closeActiveModal() {
      if (!this.activeModal) return;
      this.activeModal.classList.remove('active');
      document.body.style.overflow = '';
      this.activeModal = null;

      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }

    openDetailModal(type, index) {
      const data = type === 'solar' ? SOLAR_SYSTEM[index] : CELESTIAL_OBJECTS[index];
      if (!data) return;

      const modal = $('#detail-modal');
      const mediaFrame = $('#modal-media');
      const titleEl = $('#modal-title');
      const typeBadge = $('#modal-type-badge');
      const textEl = $('#modal-text');
      const funfactBox = $('#modal-funfact');
      const funfactContent = $('#modal-funfact-content');
      const tableBody = $('#modal-stats-rows');
      const creditEl = $('#modal-credit');

      // Gắn dữ liệu
      mediaFrame.innerHTML = this.createImageHTML(data.image, data.name, data.svgFallback, true);
      titleEl.textContent = `${data.name} (${data.englishName})`;
      if (typeBadge) typeBadge.textContent = data.type || data.category;
      textEl.textContent = data.overview;

      if (data.funFact && funfactBox && funfactContent) {
        funfactBox.style.display = 'block';
        $('#modal-funfact-title').innerHTML = '✨ Bạn có biết?';
        funfactContent.textContent = data.funFact;
      } else if (funfactBox) {
        funfactBox.style.display = 'none';
      }

      const statsTitle = $('#modal-stats-title');
      const statsWrapper = $('.stats-table-wrapper');
      if (statsTitle) statsTitle.style.display = 'flex';
      if (statsWrapper) statsWrapper.style.display = 'block';

      if (tableBody && data.stats) {
        tableBody.innerHTML = data.stats.map(row => `
          <tr>
            <td>${row[0]}</td>
            <td>${row[1]}</td>
          </tr>
        `).join('');
      }

      if (creditEl && data.image) {
        creditEl.textContent = `Nguồn ảnh: ${data.image.author} · Giấy phép: ${data.image.license} · Bản quyền: NASA / ESA / Wikimedia Commons`;
      }

      this.openModalElement(modal);
    }

    openFAQModal(index) {
      const item = FAQ_ITEMS[index];
      if (!item) return;

      const modal = $('#detail-modal');
      const mediaFrame = $('#modal-media');
      const titleEl = $('#modal-title');
      const typeBadge = $('#modal-type-badge');
      const textEl = $('#modal-text');
      const funfactBox = $('#modal-funfact');
      const funfactContent = $('#modal-funfact-content');
      const tableBody = $('#modal-stats-rows');
      const creditEl = $('#modal-credit');

      mediaFrame.innerHTML = this.createImageHTML(item.image, item.question, SVG_FALLBACKS.nebula, true);
      titleEl.textContent = item.question;
      if (typeBadge) typeBadge.textContent = `Hỏi – Đáp Thiên văn · ${item.tag}`;
      textEl.textContent = item.fullAnswer;

      if (funfactBox && funfactContent) {
        funfactBox.style.display = 'block';
        $('#modal-funfact-title').innerHTML = '💡 Tóm tắt cốt lõi';
        funfactContent.textContent = item.shortAnswer;
      }

      const statsTitle = $('#modal-stats-title');
      const statsWrapper = $('.stats-table-wrapper');
      if (statsTitle) statsTitle.style.display = 'none';
      if (statsWrapper) statsWrapper.style.display = 'none';
      if (tableBody) tableBody.innerHTML = '';

      if (creditEl && item.image) {
        creditEl.textContent = `Nguồn ảnh minh họa: ${item.image.author} · ${item.image.license}`;
      }

      this.openModalElement(modal);
    }

    openLightbox() {
      const modal = $('#lightbox-modal');
      this.updateLightboxContent();
      this.openModalElement(modal, $('#lightbox-next'));
    }

    updateLightboxContent() {
      const item = this.filteredGallery[this.lightboxIndex];
      if (!item) return;

      const imgFrame = $('#lightbox-media');
      const titleEl = $('#lightbox-title');
      const descEl = $('#lightbox-desc');
      const badgeEl = $('#lightbox-badge');
      const counterEl = $('#lightbox-counter');
      const creditEl = $('#lightbox-credit');

      imgFrame.innerHTML = `
        <img 
          src="${getWikiImgUrl(item.file, 1400)}" 
          alt="${item.title}" 
          style="max-height: 58vh; width: 100%; object-fit: contain; margin: 0 auto; display: block;" 
          onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80';"
        />
      `;
      titleEl.textContent = item.title;
      descEl.textContent = item.description;
      if (badgeEl) badgeEl.textContent = item.badge || item.category;
      if (counterEl) counterEl.textContent = `Ảnh ${this.lightboxIndex + 1} / ${this.filteredGallery.length}`;
      if (creditEl) creditEl.textContent = `Tác giả / Tổ chức: ${item.author} · Giấy phép: ${item.license}`;
    }

    stepLightbox(delta) {
      const total = this.filteredGallery.length;
      if (total <= 1) return;
      this.lightboxIndex = (this.lightboxIndex + delta + total) % total;
      this.updateLightboxContent();
      this.audio.playChime(587.33, 'sine', 0.08, 0.2); // D5
    }

    bindModalEvents() {
      // Bắt sự kiện click nút Tìm hiểu thêm trên toàn trang
      document.addEventListener('click', (e) => {
        const moreBtn = e.target.closest('.btn-card-more');
        if (moreBtn) {
          const type = moreBtn.dataset.type;
          const index = parseInt(moreBtn.dataset.index, 10);
          this.openDetailModal(type, index);
          return;
        }

        // Đóng khi click ra ngoài overlay hoặc vào nút X
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close-btn')) {
          this.closeActiveModal();
        }
      });

      // Điều khiển Lightbox Trước / Sau
      const prevBtn = $('#lightbox-prev');
      const nextBtn = $('#lightbox-next');
      if (prevBtn) prevBtn.addEventListener('click', () => this.stepLightbox(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => this.stepLightbox(1));

      // Bắt phím ESC, Phím Mũi tên và Phím Tab trap
      document.addEventListener('keydown', (e) => {
        if (!this.activeModal) return;

        if (e.key === 'Escape') {
          this.closeActiveModal();
        }

        if (this.activeModal.id === 'lightbox-modal') {
          if (e.key === 'ArrowLeft') this.stepLightbox(-1);
          if (e.key === 'ArrowRight') this.stepLightbox(1);
        }

        // Bẫy tiêu điểm (Focus Trap)
        if (e.key === 'Tab') {
          const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', this.activeModal);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    /* ==========================================================================
       5. ĐIỀU HƯỚNG, TIẾN TRÌNH CUỘN, PARALLAX & SCROLL SPY
       ========================================================================== */
    bindNavigation() {
      const burger = $('#btn-burger');
      const menu = $('#nav-menu');

      if (burger && menu) {
        burger.addEventListener('click', () => {
          const isOpen = menu.classList.toggle('open');
          burger.classList.toggle('active', isOpen);
          burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Đóng menu mobile khi nhấn liên kết
        $$('.nav-link', menu).forEach(link => {
          link.addEventListener('click', () => {
            menu.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
          });
        });
      }

      // Xử lý cuộn mượt cho tất cả liên kết nội bộ #
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    bindScrollEffects() {
      const progressBar = $('#scroll-progress');
      const navbar = $('#navbar');
      const heroBg = $('#hero-backdrop');
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Cập nhật thanh tiến trình & hiệu ứng Navbar
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
          progressBar.style.width = `${scrollPercent}%`;
        }

        if (navbar) {
          navbar.classList.toggle('scrolled', scrollTop > 50);
        }

        // Parallax cho ảnh nền Hero
        if (heroBg && !isReducedMotion && scrollTop < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrollTop * 0.28}px)`;
        }
      }, { passive: true });

      // Scroll Spy làm sáng menu tương ứng
      const sections = ['home', 'solar', 'objects', 'gallery', 'faq'];
      const navLinks = $$('.nav-link');

      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            navLinks.forEach(link => {
              const href = link.getAttribute('href').replace('#', '');
              link.classList.toggle('active', href === currentId);
            });
          }
        });
      }, {
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0
      });

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) spyObserver.observe(el);
      });
    }

    /* --- Hiệu ứng cuộn Reveal --- */
    initScrollReveal() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        $$('.reveal').forEach(el => el.classList.add('revealed'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      });

      $$('.reveal').forEach(el => revealObserver.observe(el));
    }
  }

  // Khởi động ứng dụng khi DOM đã sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    new CosmicCanvas('#stars-canvas');
    new CosmosApp();
  });
})();
