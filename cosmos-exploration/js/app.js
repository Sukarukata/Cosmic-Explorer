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

  /* ==========================================================================
     MÔ PHỎNG QUỸ ĐẠO HỆ MẶT TRỜI TƯƠNG TÁC (SOLAR ORBIT SIMULATOR 60FPS)
     ========================================================================== */
  class SolarOrbitSimulator {
    constructor(canvasSelector = '#orbit-canvas') {
      this.canvas = $(canvasSelector);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.container = $('#orbit-canvas-container');

      this.isRunning = true;
      this.speedMultiplier = 1.0;
      this.showTrails = true;
      this.showLabels = true;
      this.selectedPlanetIndex = 3; // Mặc định chọn Trái Đất
      this.hoveredPlanetIndex = null;

      this.zoom = 1.0;
      this.minZoom = 0.45;
      this.maxZoom = 2.6;
      this.panX = 0;
      this.panY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.hasDragged = false;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.initPlanets();
      this.initAsteroidBelt();
      this.init();
      this.bindEvents();
      this.updateHUD(this.planets[this.selectedPlanetIndex]);
      this.animate(0);
    }

    initPlanets() {
      this.planets = [
        {
          id: 'sun',
          dataIndex: 0,
          name: 'Mặt Trời',
          englishName: 'Sun',
          type: 'Ngôi sao mẹ',
          color: '#FFB800',
          radius: 17,
          orbitRadius: 0,
          speed: 0,
          angle: 0,
          distance: '0 km (Trung tâm)',
          period: '25 - 35 ngày (tự quay)',
          velocity: '220 km/s (quanh Ngân Hà)',
          diameter: '1.392.700 km'
        },
        {
          id: 'mercury',
          dataIndex: 1,
          name: 'Sao Thủy',
          englishName: 'Mercury',
          type: 'Hành tinh đất đá',
          color: '#B0B5C0',
          radius: 3.8,
          orbitRadius: 38,
          speed: 0.038,
          angle: 0.8,
          distance: '57,9 triệu km (0,39 AU)',
          period: '87,97 ngày',
          velocity: '47,36 km/s',
          diameter: '4.879 km'
        },
        {
          id: 'venus',
          dataIndex: 2,
          name: 'Sao Kim',
          englishName: 'Venus',
          type: 'Hành tinh đất đá',
          color: '#F59E0B',
          radius: 5.5,
          orbitRadius: 60,
          speed: 0.024,
          angle: 2.2,
          distance: '108,2 triệu km (0,72 AU)',
          period: '224,7 ngày',
          velocity: '35,02 km/s',
          diameter: '12.104 km'
        },
        {
          id: 'earth',
          dataIndex: 3,
          name: 'Trái Đất',
          englishName: 'Earth',
          type: 'Hành tinh đất đá',
          color: '#38BDF8',
          radius: 6.2,
          orbitRadius: 88,
          speed: 0.017,
          angle: 4.1,
          hasMoon: true,
          moonAngle: 0,
          distance: '149,6 triệu km (1,00 AU)',
          period: '365,25 ngày',
          velocity: '29,78 km/s',
          diameter: '12.742 km'
        },
        {
          id: 'mars',
          dataIndex: 4,
          name: 'Sao Hỏa',
          englishName: 'Mars',
          type: 'Hành tinh đất đá',
          color: '#EF4444',
          radius: 4.8,
          orbitRadius: 118,
          speed: 0.012,
          angle: 1.2,
          distance: '227,9 triệu km (1,52 AU)',
          period: '687 ngày (1,88 năm)',
          velocity: '24,07 km/s',
          diameter: '6.779 km'
        },
        {
          id: 'jupiter',
          dataIndex: 5,
          name: 'Sao Mộc',
          englishName: 'Jupiter',
          type: 'Hành tinh khí khổng lồ',
          color: '#FBBF24',
          radius: 13.5,
          orbitRadius: 168,
          speed: 0.0075,
          angle: 3.5,
          hasStripes: true,
          distance: '778,5 triệu km (5,20 AU)',
          period: '4.333 ngày (11,86 năm)',
          velocity: '13,07 km/s',
          diameter: '139.820 km'
        },
        {
          id: 'saturn',
          dataIndex: 6,
          name: 'Sao Thổ',
          englishName: 'Saturn',
          type: 'Hành tinh khí khổng lồ',
          color: '#FDE047',
          radius: 11,
          orbitRadius: 218,
          speed: 0.0052,
          angle: 5.4,
          hasRings: true,
          distance: '1.433 triệu km (9,58 AU)',
          period: '10.759 ngày (29,45 năm)',
          velocity: '9,69 km/s',
          diameter: '116.460 km'
        },
        {
          id: 'uranus',
          dataIndex: 7,
          name: 'Sao Thiên Vương',
          englishName: 'Uranus',
          type: 'Hành tinh băng khổng lồ',
          color: '#2DD4BF',
          radius: 8,
          orbitRadius: 265,
          speed: 0.0035,
          angle: 2.7,
          hasRingSubtle: true,
          distance: '2.872 triệu km (19,2 AU)',
          period: '30.687 ngày (84 năm)',
          velocity: '6,81 km/s',
          diameter: '50.724 km'
        },
        {
          id: 'neptune',
          dataIndex: 8,
          name: 'Sao Hải Vương',
          englishName: 'Neptune',
          type: 'Hành tinh băng khổng lồ',
          color: '#3B82F6',
          radius: 8,
          orbitRadius: 308,
          speed: 0.0026,
          angle: 0.4,
          distance: '4.495 triệu km (30,1 AU)',
          period: '60.190 ngày (164,8 năm)',
          velocity: '5,43 km/s',
          diameter: '49.244 km'
        }
      ];
    }

    initAsteroidBelt() {
      this.asteroids = [];
      const count = 130;
      for (let i = 0; i < count; i++) {
        this.asteroids.push({
          radius: 138 + Math.random() * 16,
          angle: Math.random() * Math.PI * 2,
          speed: 0.009 + (Math.random() * 0.003 - 0.0015),
          size: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.45 + 0.15
        });
      }
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.width = rect.width || 800;
      this.height = rect.height || 600;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      const minDimension = Math.min(this.width, this.height);
      if (minDimension < 500) {
        this.zoom = 0.72;
      } else if (minDimension < 700) {
        this.zoom = 0.88;
      } else {
        this.zoom = 1.0;
      }
    }

    bindEvents() {
      // 1. Tạm dừng / Tiếp tục
      const toggleBtn = $('#btn-orbit-toggle');
      const toggleText = $('#orbit-toggle-text');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          this.isRunning = !this.isRunning;
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.className = this.isRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play';
          }
          if (toggleText) {
            toggleText.textContent = this.isRunning ? 'Tạm dừng' : 'Tiếp tục';
          }
        });
      }

      // 2. Căn thẳng hàng các hành tinh (Syzygy)
      const resetBtn = $('#btn-orbit-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.planets.forEach(p => p.angle = 0);
          this.panX = 0;
          this.panY = 0;
          this.zoom = this.width < 600 ? 0.75 : 1.0;
          if (window.cosmosApp && window.cosmosApp.audio) {
            window.cosmosApp.audio.playChime(660, 'sine', 0.1, 0.3);
          }
        });
      }

      // 3. Tốc độ mô phỏng
      const speedGroup = $('#orbit-speed-group');
      if (speedGroup) {
        speedGroup.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn-speed');
          if (!btn) return;
          $$('.btn-speed', speedGroup).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.speedMultiplier = parseFloat(btn.dataset.speed) || 1.0;
        });
      }

      // 4. Bật/Tắt đường quỹ đạo
      const trailsCheck = $('#orbit-toggle-trails');
      if (trailsCheck) {
        trailsCheck.addEventListener('change', () => {
          this.showTrails = trailsCheck.checked;
        });
      }

      // 5. Bật/Tắt nhãn tên
      const labelsCheck = $('#orbit-toggle-labels');
      if (labelsCheck) {
        labelsCheck.addEventListener('change', () => {
          this.showLabels = labelsCheck.checked;
        });
      }

      // 6. Nút xem chi tiết chuyên sâu trên HUD
      const btnDetail = $('#btn-hud-detail');
      if (btnDetail) {
        btnDetail.addEventListener('click', () => {
          const selected = this.planets[this.selectedPlanetIndex];
          if (!selected) return;
          if (window.cosmosApp && typeof window.cosmosApp.openDetailModal === 'function') {
            window.cosmosApp.openDetailModal('solar', selected.dataIndex);
          } else {
            const cardBtn = document.querySelector(`.btn-card-more[data-type="solar"][data-index="${selected.dataIndex}"]`);
            if (cardBtn) cardBtn.click();
          }
        });
      }

      // 7. Pan & Drag & Hover trên Canvas
      if (this.container) {
        const getCanvasCoords = (clientX, clientY) => {
          const rect = this.canvas.getBoundingClientRect();
          const screenX = clientX - rect.left;
          const screenY = clientY - rect.top;
          const cx = this.width / 2;
          const cy = this.height / 2;
          const worldX = (screenX - cx - this.panX) / this.zoom;
          const worldY = (screenY - cy - this.panY) / this.zoom;
          return { worldX, worldY, screenX, screenY };
        };

        const checkHover = (worldX, worldY) => {
          let found = null;
          for (let i = 0; i < this.planets.length; i++) {
            const p = this.planets[i];
            const dist = Math.hypot(worldX - (p.currentX || 0), worldY - (p.currentY || 0));
            const hitRadius = Math.max(p.radius + 12, 16);
            if (dist <= hitRadius) {
              found = i;
              break;
            }
          }
          return found;
        };

        // Chuột
        this.container.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          this.isDragging = true;
          this.hasDragged = false;
          this.dragStartX = e.clientX - this.panX;
          this.dragStartY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e) => {
          if (this.isDragging) {
            const currentPanX = e.clientX - this.dragStartX;
            const currentPanY = e.clientY - this.dragStartY;
            if (Math.hypot(currentPanX - this.panX, currentPanY - this.panY) > 4) {
              this.hasDragged = true;
            }
            this.panX = currentPanX;
            this.panY = currentPanY;
          }

          if (this.container) {
            const { worldX, worldY } = getCanvasCoords(e.clientX, e.clientY);
            this.hoveredPlanetIndex = checkHover(worldX, worldY);
            if (this.hoveredPlanetIndex !== null) {
              this.container.style.cursor = 'pointer';
            } else {
              this.container.style.cursor = this.isDragging ? 'grabbing' : 'grab';
            }
          }
        });

        window.addEventListener('mouseup', (e) => {
          if (!this.isDragging) return;
          this.isDragging = false;

          // Nếu chỉ click chuột (không kéo lia màn hình)
          if (!this.hasDragged && this.container) {
            const { worldX, worldY } = getCanvasCoords(e.clientX, e.clientY);
            const clickedIndex = checkHover(worldX, worldY);
            if (clickedIndex !== null) {
              this.selectPlanet(clickedIndex);
            }
          }
        });

        // Cuộn chuột phóng to / thu nhỏ
        this.container.addEventListener('wheel', (e) => {
          e.preventDefault();
          const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
          const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));
          this.zoom = newZoom;
        }, { passive: false });

        // Hỗ trợ cảm ứng (Touch) trên di động
        let touchStartDist = 0;

        this.container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartX = e.touches[0].clientX - this.panX;
            this.dragStartY = e.touches[0].clientY - this.panY;
          } else if (e.touches.length === 2) {
            this.isDragging = false;
            touchStartDist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
          }
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
          if (e.touches.length === 1 && this.isDragging) {
            const currentPanX = e.touches[0].clientX - this.dragStartX;
            const currentPanY = e.touches[0].clientY - this.dragStartY;
            if (Math.hypot(currentPanX - this.panX, currentPanY - this.panY) > 5) {
              this.hasDragged = true;
            }
            this.panX = currentPanX;
            this.panY = currentPanY;
          } else if (e.touches.length === 2) {
            const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            if (touchStartDist > 0) {
              const factor = dist / touchStartDist;
              this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
              touchStartDist = dist;
            }
          }
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
          if (!this.hasDragged && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const { worldX, worldY } = getCanvasCoords(touch.clientX, touch.clientY);
            const clickedIndex = checkHover(worldX, worldY);
            if (clickedIndex !== null) {
              this.selectPlanet(clickedIndex);
            }
          }
          this.isDragging = false;
        });
      }
    }

    selectPlanet(index) {
      this.selectedPlanetIndex = index;
      const planet = this.planets[index];
      this.updateHUD(planet);

      // Hiệu ứng âm thanh tinh tế
      if (window.cosmosApp && window.cosmosApp.audio) {
        window.cosmosApp.audio.playChime(480 + index * 45, 'triangle', 0.12, 0.28);
      }
    }

    updateHUD(planet) {
      if (!planet) return;
      const dot = $('#hud-dot');
      const name = $('#hud-name');
      const type = $('#hud-type');
      const dist = $('#hud-distance');
      const period = $('#hud-period');
      const vel = $('#hud-velocity');
      const diam = $('#hud-diameter');

      if (dot) {
        dot.style.backgroundColor = planet.color;
        dot.style.color = planet.color;
      }
      if (name) name.textContent = planet.name;
      if (type) type.textContent = planet.type;
      if (dist) dist.textContent = planet.distance;
      if (period) period.textContent = planet.period;
      if (vel) vel.textContent = planet.velocity;
      if (diam) diam.textContent = planet.diameter;
    }

    animate(timestamp) {
      this.draw(timestamp);
      requestAnimationFrame((t) => this.animate(t));
    }

    draw(timestamp) {
      const ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.scale(this.dpr, this.dpr);

      const cx = this.width / 2;
      const cy = this.height / 2;

      // Di chuyển gốc toạ độ đến tâm và áp dụng Pan & Zoom
      ctx.translate(cx + this.panX, cy + this.panY);
      ctx.scale(this.zoom, this.zoom);

      // Cập nhật vị trí các hành tinh
      if (this.isRunning && !this.isReducedMotion) {
        for (let i = 0; i < this.planets.length; i++) {
          const p = this.planets[i];
          p.angle += p.speed * this.speedMultiplier * 0.05;
          if (p.hasMoon) {
            p.moonAngle = (p.moonAngle || 0) + 0.08 * this.speedMultiplier;
          }
        }
        for (let j = 0; j < this.asteroids.length; j++) {
          const ast = this.asteroids[j];
          ast.angle += ast.speed * this.speedMultiplier * 0.05;
        }
      }

      // 1. Vẽ các đường quỹ đạo (Orbit Trails)
      if (this.showTrails) {
        ctx.lineWidth = 1;
        for (let i = 1; i < this.planets.length; i++) {
          const p = this.planets[i];
          ctx.beginPath();
          ctx.arc(0, 0, p.orbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = (i === this.selectedPlanetIndex)
            ? 'rgba(61, 214, 245, 0.45)'
            : 'rgba(255, 255, 255, 0.09)';
          ctx.setLineDash(i === this.selectedPlanetIndex ? [4, 4] : []);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 2. Vẽ Vành đai tiểu hành tinh (Asteroid Belt)
      for (let j = 0; j < this.asteroids.length; j++) {
        const ast = this.asteroids[j];
        const ax = Math.cos(ast.angle) * ast.radius;
        const ay = Math.sin(ast.angle) * ast.radius;
        ctx.fillStyle = `rgba(180, 195, 215, ${ast.alpha})`;
        ctx.beginPath();
        ctx.arc(ax, ay, ast.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Tính toán vị trí hiện tại của từng hành tinh
      for (let i = 0; i < this.planets.length; i++) {
        const p = this.planets[i];
        if (p.orbitRadius === 0) {
          p.currentX = 0;
          p.currentY = 0;
        } else {
          p.currentX = Math.cos(p.angle) * p.orbitRadius;
          p.currentY = Math.sin(p.angle) * p.orbitRadius;
        }
      }

      // 4. Vẽ Mặt Trời (Sun) ở tâm
      const sun = this.planets[0];
      const sunPulse = Math.sin(timestamp * 0.003) * 1.5;

      // Hào quang ngoài
      const sunGlow = ctx.createRadialGradient(0, 0, sun.radius * 0.5, 0, 0, sun.radius + 18 + sunPulse);
      sunGlow.addColorStop(0, 'rgba(255, 220, 80, 0.9)');
      sunGlow.addColorStop(0.35, 'rgba(255, 122, 0, 0.5)');
      sunGlow.addColorStop(0.7, 'rgba(255, 60, 0, 0.2)');
      sunGlow.addColorStop(1, 'rgba(255, 30, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(0, 0, sun.radius + 18 + sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // Thân Mặt Trời
      const sunBodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, sun.radius);
      sunBodyGrad.addColorStop(0, '#FFFFFF');
      sunBodyGrad.addColorStop(0.25, '#FFF275');
      sunBodyGrad.addColorStop(0.65, '#FF9900');
      sunBodyGrad.addColorStop(1, '#D93800');
      ctx.fillStyle = sunBodyGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sun.radius, 0, Math.PI * 2);
      ctx.fill();

      // 5. Vẽ 8 hành tinh
      for (let i = 1; i < this.planets.length; i++) {
        const p = this.planets[i];
        const px = p.currentX;
        const py = p.currentY;

        // Vành đai Sao Thổ (Saturn) - Nửa sau
        if (p.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.4);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.3, p.radius * 0.65, 0, Math.PI, 0);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.restore();
        }

        // Thân hành tinh với đổ bóng ngược sáng từ Mặt Trời
        const lightAngle = Math.atan2(py, px) + Math.PI;
        const lx = px + Math.cos(lightAngle) * (p.radius * 0.45);
        const ly = py + Math.sin(lightAngle) * (p.radius * 0.45);

        const planetGrad = ctx.createRadialGradient(lx, ly, p.radius * 0.15, px, py, p.radius);
        planetGrad.addColorStop(0, '#FFFFFF');
        planetGrad.addColorStop(0.3, p.color);
        planetGrad.addColorStop(1, '#050710');

        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Vân khí Sao Mộc (Jupiter)
        if (p.hasStripes) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px - p.radius, py - 3);
          ctx.lineTo(px + p.radius, py - 3);
          ctx.moveTo(px - p.radius, py + 3);
          ctx.lineTo(px + p.radius, py + 3);
          ctx.stroke();
          // Vết Đỏ Lớn
          ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
          ctx.beginPath();
          ctx.ellipse(px + 4, py + 4, 3, 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Vành đai Sao Thổ - Nửa trước
        if (p.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.4);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.3, p.radius * 0.65, 0, 0, Math.PI);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.7)';
          ctx.lineWidth = 4;
          ctx.stroke();
          // Vòng mảnh ngoài
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.7, p.radius * 0.75, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // Vành mờ Sao Thiên Vương (Uranus)
        if (p.hasRingSubtle) {
          ctx.save();
          ctx.translate(px, py);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.35, 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }

        // Vệ tinh Mặt Trăng quanh Trái Đất (Earth)
        if (p.hasMoon) {
          const mx = px + Math.cos(p.moonAngle) * 13;
          const my = py + Math.sin(p.moonAngle) * 13;
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.arc(mx, my, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Hiệu ứng chọn & Hover (Reticle / Target Box)
      for (let i = 0; i < this.planets.length; i++) {
        const p = this.planets[i];
        const px = p.currentX;
        const py = p.currentY;
        const isSelected = (i === this.selectedPlanetIndex);
        const isHovered = (i === this.hoveredPlanetIndex);

        if (isSelected || isHovered) {
          const haloRadius = Math.max(p.radius + 9, 14);
          ctx.save();
          ctx.translate(px, py);

          ctx.strokeStyle = isSelected ? '#3DD6F5' : 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = isSelected ? 1.8 : 1;
          ctx.beginPath();
          ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
          ctx.stroke();

          // 4 góc định vị chuẩn Sci-fi Reticle
          if (isSelected) {
            const rot = (timestamp * 0.001) % (Math.PI * 2);
            ctx.rotate(rot);
            const cornerDist = haloRadius + 4;
            const cornerSize = 4;
            ctx.strokeStyle = '#3DD6F5';
            ctx.lineWidth = 1.5;

            for (let c = 0; c < 4; c++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(cornerDist - cornerSize, cornerDist);
              ctx.lineTo(cornerDist, cornerDist);
              ctx.lineTo(cornerDist, cornerDist - cornerSize);
              ctx.stroke();
            }
          }

          ctx.restore();
        }
      }

      // 7. Vẽ nhãn tên các hành tinh
      if (this.showLabels) {
        ctx.font = '500 11.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let i = 0; i < this.planets.length; i++) {
          const p = this.planets[i];
          const px = p.currentX;
          const py = p.currentY;
          const isSelected = (i === this.selectedPlanetIndex);

          const labelY = py + p.radius + 8;
          ctx.fillStyle = isSelected ? '#3DD6F5' : 'rgba(226, 232, 240, 0.85)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 4;
          ctx.fillText(p.name, px, labelY);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();
    }
  }

  // Khởi động ứng dụng khi DOM đã sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    new CosmicCanvas('#stars-canvas');
    window.cosmosApp = new CosmosApp();
    new SolarOrbitSimulator('#orbit-canvas');
  });
})();
