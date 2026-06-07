document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. PRELOADER ANIMATION & REMOVAL
  // ==========================================
  const loader = document.getElementById('loading');
  const loaderNumber = document.getElementById('tp-loading-number');
  
  if (loader && loaderNumber) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5; // Random increments
      if (progress >= 100) {
        progress = 100;
        loaderNumber.textContent = `${progress}%`;
        clearInterval(interval);
        
        loader.style.transition = 'opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          loader.remove();
        }, 650);
      } else {
        loaderNumber.textContent = `${progress}%`;
      }
    }, 70);
  }

  // ==========================================
  // 1. LENIS SMOOTH SCROLL & GSAP INTEGRATION
  // ==========================================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4), // Power4 Out easing for exceptionally premium feeling
    smoothWheel: true,
    smoothTouch: false
  });

  lenis.on('scroll', ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ==========================================
  // 2. CUSTOM CURSOR
  // ==========================================
  const cursorInner = document.querySelector('.cursor-inner');
  const cursorOuter = document.querySelector('.cursor-outer');
  
  if (cursorInner && cursorOuter) {
    let mouseX = 0, mouseY = 0;
    let innerX = 0, innerY = 0;
    let outerX = 0, outerY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animateCursor() {
      innerX += (mouseX - innerX) * 0.4;
      innerY += (mouseY - innerY) * 0.4;
      
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      
      cursorInner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;
      cursorOuter.style.transform = `translate3d(${outerX}px, ${outerY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    const hoverables = document.querySelectorAll('a, button, .tp-hover-reveal-item, .accordion-button, .nav-links');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorInner.classList.add('cursor-hover');
        cursorOuter.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorInner.classList.remove('cursor-hover');
        cursorOuter.classList.remove('cursor-hover');
      });
    });
  }

  // ==========================================
  // 3. THEME SWITCHER TOGGLE
  // ==========================================
  const htmlElement = document.documentElement;
  const themeToggleWrappers = document.querySelectorAll('.tp-theme-toggle');
  
  let currentTheme = localStorage.getItem('theme') || 'tp-theme-dark';
  htmlElement.setAttribute('tp-theme', currentTheme);
  
  const updateToggleButtonsUI = (theme) => {
    themeToggleWrappers.forEach(wrapper => {
      const toggleInput = wrapper.querySelector('.themepure-theme-toggle-input');
      if (theme === 'tp-theme-dark') {
        if (toggleInput) toggleInput.checked = true;
      } else {
        if (toggleInput) toggleInput.checked = false;
      }
    });
  };
  updateToggleButtonsUI(currentTheme);
  
  themeToggleWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      currentTheme = htmlElement.getAttribute('tp-theme');
      const newTheme = currentTheme === 'tp-theme-dark' ? 'tp-theme-light' : 'tp-theme-dark';
      htmlElement.setAttribute('tp-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleButtonsUI(newTheme);
    });
  });

  // ==========================================
  // 4. STICKY HEADER
  // ==========================================
  const stickyHeader = document.querySelector('.tp-header-sticky-cloned');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      if (stickyHeader) stickyHeader.classList.add('header-sticky');
    } else {
      if (stickyHeader) stickyHeader.classList.remove('header-sticky');
    }
  });

  // ==========================================
  // 5. OFFCANVAS MOBILE DRAWER MENU
  // ==========================================
  const offcanvasOpenBtns = document.querySelectorAll('.tp-offcanvas-open-btn-2');
  const offcanvasCloseBtns = document.querySelectorAll('.tp-offcanvas-close-btn-2');
  const offcanvasArea = document.querySelector('.tp-offcanvas-area-2');
  
  if (offcanvasArea) {
    offcanvasOpenBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        offcanvasArea.classList.add('opened');
      });
    });
    
    offcanvasCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        offcanvasArea.classList.remove('opened');
      });
    });
    
    const offcanvasLinks = offcanvasArea.querySelectorAll('a');
    offcanvasLinks.forEach(link => {
      link.addEventListener('click', () => {
        offcanvasArea.classList.remove('opened');
      });
    });
  }

  // ==========================================
  // 6. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('back_to_top');
  const backToTopWrapper = document.querySelector('.back-to-top-wrapper');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        if (backToTopWrapper) backToTopWrapper.classList.add('value-back');
      } else {
        if (backToTopWrapper) backToTopWrapper.classList.remove('value-back');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 7. ROTATING HEADLINE (CLIP TYPE)
  // ==========================================
  document.fonts.ready.then(() => {
    const headline = jQuery('.cd-headline');
    if (headline.length) {
      const wordsWrapper = headline.find('.cd-words-wrapper');
      
      const activeWord = wordsWrapper.find('.is-visible');
      const getWordWidth = (wordEl) => {
        if (!wordEl || !wordEl.length) return 0;
        return wordEl[0].scrollWidth;
      };
      
      wordsWrapper.css('width', getWordWidth(activeWord) + 10);
      
      setTimeout(() => {
        hideWord(activeWord);
      }, 2500);
      
      function hideWord(word) {
        const next = getNextWord(word);
        gsap.to(wordsWrapper, {
          width: 2,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            switchWord(word, next);
            showWord(next);
          }
        });
      }
      
      function showWord(word) {
        const width = getWordWidth(word) + 10;
        gsap.to(wordsWrapper, {
          width: width,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            setTimeout(function() {
              hideWord(word);
            }, 2500);
          }
        });
      }
      
      function getNextWord(word) {
        return word.is(':last-child') ? word.parent().children().eq(0) : word.next();
      }
      
      function switchWord(oldWord, newWord) {
        oldWord.removeClass('is-visible').addClass('is-hidden');
        newWord.removeClass('is-hidden').addClass('is-visible');
      }
    }
  });


  gsap.to(".tp-services-inner-border.tp-vertical-line", {
    height: "100%",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".tp-services-inner",
      start: "top 90%"
    }
  });
  gsap.to(".tp-services-inner-border.right", {
    height: "100%",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".tp-services-inner",
      start: "top 90%"
    }
  });
  gsap.to(".tp-services-accordion-border", {
    height: "100%",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".tp-services-accordion",
      start: "top 90%"
    }
  });
  gsap.utils.toArray(".accordion-item-border").forEach(el => {
    gsap.to(el, {
      width: "100%",
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 95%"
      }
    });
  });

  gsap.utils.toArray(".tp-footer-anim-border").forEach(el => {
    gsap.to(el, {
      width: "100%",
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%"
      }
    });
  });

  // - Button Bounces
  gsap.utils.toArray(".tp-btn-bounce").forEach(el => {
    const trigger = el.closest(".tp-btn-trigger") || el;
    gsap.fromTo(el, { y: -150, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      delay: 0.5,
      ease: "bounce.out",
      scrollTrigger: {
        trigger: trigger,
        start: "top center"
      }
    });
  });
  gsap.utils.toArray(".tp-btn-bounce-2").forEach(el => {
    const trigger = el.closest(".tp-btn-trigger-2") || el;
    gsap.fromTo(el, { y: -100, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "bounce.out",
      scrollTrigger: {
        trigger: trigger,
        start: "bottom bottom"
      }
    });
  });









  // ==========================================
  // 11.1 PORTFOLIO/AWARD HOVER REVEAL EFFECT
  // ==========================================
  const hoverRevealItems = document.querySelectorAll('.tp-hover-reveal-item');
  hoverRevealItems.forEach(item => {
    const bg = item.querySelector('.tp-hover-reveal-bg');
    if (!bg) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isHovered = false;
    let rafId = null;

    function updatePosition() {
      // Smooth lerp for premium cursor trailing feel
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      bg.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;

      if (isHovered || Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    }

    item.addEventListener('mouseenter', (e) => {
      isHovered = true;
      const rect = item.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      currentX = mouseX;
      currentY = mouseY;
      bg.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      
      // Grow custom cursor big and show text
      if (cursorInner && cursorOuter) {
        cursorInner.classList.add('cursor-big');
        cursorOuter.classList.add('cursor-big');
      }
      
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    });

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    });

    item.addEventListener('mouseleave', () => {
      isHovered = false;
      // Restore custom cursor size
      if (cursorInner && cursorOuter) {
        cursorInner.classList.remove('cursor-big');
        cursorOuter.classList.remove('cursor-big');
      }
    });
  });

  // ==========================================
  // 11.2 SERVICES ACCORDION ACTIVE CLASS TOGGLE
  // ==========================================
  const accordionButtons = document.querySelectorAll('.tp-services-accordion .accordion-button');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Allow state changes to settle
      setTimeout(() => {
        const items = document.querySelectorAll('.tp-services-accordion .accordion-item');
        items.forEach(item => {
          const btn = item.querySelector('.accordion-button');
          if (btn && !btn.classList.contains('collapsed')) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }, 50);
    });
  });

  // ==========================================
  // 11.3 PORTFOLIO GRID CURTAIN SCROLL ANIMATION
  // ==========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Helper function to extract prominent color using canvas
    function getProminentColor(imgEl, callback) {
      const fallbackColor = '#e93951'; // Pink/red from original Themepure template
      
      const extract = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 10;
          canvas.height = 10;
          ctx.drawImage(imgEl, 0, 0, 10, 10);
          const data = ctx.getImageData(0, 0, 10, 10).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
            count++;
          }
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          callback(`rgb(${r}, ${g}, ${b})`);
        } catch (e) {
          callback(fallbackColor);
        }
      };

      if (imgEl.complete && imgEl.naturalWidth !== 0) {
        extract();
      } else {
        imgEl.addEventListener('load', extract);
        imgEl.addEventListener('error', () => callback(fallbackColor));
      }
    }

    // Helper to check if element is inside the viewport on load
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    gsap.utils.toArray("#grid li").forEach((el, idx) => {
      const img = el.querySelector("img");
      const curtain = el.querySelector(".curtain");
      const figcaption = el.querySelector("figcaption");

      // Calculate initial visibility
      if (isElementInViewport(el)) {
        // Items already in viewport on load show immediately without reveal animation
        el.classList.add("shown");
      } else {
        // Staggered animation configuration for offscreen items
        const minDelay = 0;
        const maxDelay = 300;
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

        if (curtain) {
          // Set dynamic background color matching the image
          if (img) {
            getProminentColor(img, (color) => {
              curtain.style.backgroundColor = color;
            });
          }
          
          // Apply random transition/animation delays
          curtain.style.animationDelay = `${randomDelay}ms`;
          
          // Add animationend listener to clean up animations and switch to shown state
          const onAnimationEnd = (e) => {
            if (e.animationName === "swipeDown") {
              curtain.removeEventListener("animationend", onAnimationEnd);
              el.classList.remove("animate");
              el.classList.add("shown");
            }
          };
          curtain.addEventListener("animationend", onAnimationEnd);
        }

        if (img) {
          img.style.animationDelay = `${randomDelay}ms`;
        }
        if (figcaption) {
          figcaption.style.animationDelay = `${randomDelay}ms`;
        }

        // Register ScrollTrigger bound matching the reference viewportFactor (0.4)
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%", // triggers when 20% of the element is visible, approaching the 40% viewportFactor
          onEnter: () => {
            el.classList.add("animate");
          },
          once: true
        });
      }
    });
  }

  // ==========================================
  // 11.4 FANCYBOX LIGHTBOX INITIALIZATION
  // ==========================================
  if (typeof jQuery !== 'undefined' && jQuery.fn.fancybox) {
    jQuery('.fancybox').fancybox({
      loop: true,
      buttons: [
        "zoom",
        "slideShow",
        "fullScreen",
        "close"
      ],
      hash: false
    });
  }

  // ==========================================
  // 11.5 SKILLS TAB MARKER SLIDING ANIMATION
  // ==========================================
  const tabLinks = document.querySelectorAll('#nav-tab .nav-link');
  const lineMarker = document.getElementById('lineMarker');
  
  function updateMarker(activeTab) {
    if (!lineMarker || !activeTab) return;
    const parentRect = activeTab.parentElement.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();
    const left = activeRect.left - parentRect.left;
    const width = activeRect.width;
    
    gsap.to(lineMarker, {
      left: left,
      width: width,
      duration: 0.35,
      ease: "power2.out"
    });
  }

  tabLinks.forEach(tab => {
    tab.addEventListener('click', (e) => {
      updateMarker(e.currentTarget);
    });
    
    if (tab.classList.contains('active')) {
      setTimeout(() => {
        updateMarker(tab);
      }, 300);
    }
  });

});

// Injection of dynamic CSS helper classes for script functions
const customStyles = document.createElement("style");
customStyles.textContent = `
  /* Theme toggle custom behavior matching original CSS */
  [tp-theme="tp-theme-dark"] .themepure-theme-toggle-input:checked + .tp-theme-toggle-slide {
    background-color: var(--tp-common-black);
  }
  
  /* Opened mobile offcanvas drawer - keep only visual overrides */
  .tp-offcanvas-area-2 {
    background-color: var(--tp-common-black-7) !important;
    z-index: 99999 !important;
    box-shadow: -10px 0 40px rgba(0,0,0,0.5) !important;
  }
  
  /* Custom Cursor active hover scaling state */
  .cursor-inner.cursor-hover {
    width: 14px;
    height: 14px;
    background-color: var(--tp-pink-1);
    margin-top: -7px;
    margin-left: -7px;
  }
  
  .cursor-outer.cursor-hover {
    width: 60px;
    height: 60px;
    border-color: var(--tp-pink-1);
    margin-top: -30px;
    margin-left: -30px;
    background-color: rgba(253, 75, 107, 0.04);
  }
  
  /* Back to Top show/hide button */
  .back-to-top-wrapper {
    position: fixed;
    right: 30px;
    bottom: 30px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 999;
  }
  
  .back-to-top-wrapper.value-back {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
  }

  /* Fixed sticky cloned header styles matching custom CSS classes */
  .tp-header-sticky-cloned {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
  }
  
  .tp-header-sticky-cloned.header-sticky {
    transform: translateY(0) !important;
    opacity: 1 !important;
    background-color: var(--tp-common-black-7);
    box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  }
  
  /* Override global scroll-behavior: smooth to prevent conflicts with Lenis */
  html {
    scroll-behavior: auto !important;
  }
  
  /* Lenis scroll styles for smooth scrolling overlay behavior */
  html.lenis, html.lenis body {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis-scrolling iframe {
    pointer-events: none;
  }
  



  /* Custom overrides for physics capsules performance */
  .tp-services-capsule-item-wrapper>p,
  .tp-services-capsule-item-wrapper>p span,
  .tp-services-capsule-item-wrapper>p img {
    transition: none !important;
  }
  
  /* Optimize cursor-outer to avoid transition on transform */
  .cursor-outer {
    transition: width 80ms linear, height 80ms linear, border-color 80ms linear, background-color 80ms linear !important;
  }
  
  /* Optimize cursor-big to avoid transition on transform */
  .mouseCursor.cursor-big {
    transition: width .2s linear, height .2s linear, background-color .2s linear, border-color .2s linear !important;
  }
  
  /* Optimize hover reveal background to avoid transition on transform while tracking */
  .tp-hover-reveal-bg {
    transition: opacity 0.35s ease-out !important;
  }
`;
document.head.appendChild(customStyles);

// ==========================================
// 12. MATTER.JS PHYSICS THROWABLE SIMULATION (SERVICES SECTION CAPSULES)
// ==========================================
(function($) {
  "use strict";
  
  function tpDebounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  const pluginName = "tpThrowable";
  const defaults = {
    roundness: "sharp",
    scrollGravity: false
  };
  
  class ThrowablePlugin {
    constructor(element, options) {
      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.DOM = {
        element: element,
        $element: this.$element,
        throwables: element.querySelectorAll("[data-tp-throwable-el]")
      };
      
      this.onWindowResize = tpDebounce(this.onWindowResize.bind(this), 250);
      this.bodies = [];
      this.isSettled = false;
      this.init();
    }
    
    init() {
      this.createWorld();
      this.createBoundries();
      this.createBodies();
      this.enableRunner();
      this.makeItRain();
      this.bindResize();
    }
    
    enableRunner() {
      this.runnerObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.startLoop();
        } else {
          this.stopLoop();
        }
      });
      this.runnerObserver.observe(this.DOM.element);
    }
    
    makeItRain() {
      const rainObserver = new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
          this.DOM.throwables.forEach(el => {
            gsap.to(el, { opacity: 1, duration: 0.35 });
          });
          this.startRain();
          observer.disconnect();
        }
      });
      rainObserver.observe(this.DOM.element);
    }
    
    bindResize() {
      window.addEventListener("resize", this.onWindowResize);
    }
    
    createWorld() {
      this.height = this.DOM.element.offsetHeight;
      this.width = this.DOM.element.offsetWidth;
      
      this.engine = Matter.Engine.create();
      this.mouse = Matter.Mouse.create(this.DOM.element);
      
      if (this.mouse.mousewheel) {
        this.DOM.element.removeEventListener("mousewheel", this.mouse.mousewheel);
      }
      if (this.mouse.DOMMouseScroll) {
        this.DOM.element.removeEventListener("DOMMouseScroll", this.mouse.mousewheel);
      }
      
      this.DOM.element.addEventListener("mouseleave", this.mouse.mouseup);
      
      this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        mouse: this.mouse,
        constraint: {
          render: { visible: false }
        }
      });
      
      this.engine.gravity.y = 0.8;
      
      Matter.Composite.add(this.engine.world, [this.mouseConstraint]);
      
      Matter.Events.on(this.mouseConstraint, "mousedown", () => {
        this.DOM.element.style.pointerEvents = "auto";
      });
      Matter.Events.on(this.mouseConstraint, "mouseup", () => {
        this.DOM.element.style.pointerEvents = "";
      });
      
      this.running = false;
      this.lastTickTime = performance.now();
      this.rafId = null;
      this.backupIntervalId = null;
    }
    
    startLoop() {
      if (this.running) return;
      this.running = true;
      this.lastTickTime = performance.now();
      
      const tick = (time) => {
        if (!this.running) return;
        const dt = Math.min(100, time - this.lastTickTime);
        this.lastTickTime = time;
        Matter.Engine.update(this.engine, dt);
        this.updateElements();
        this.rafId = requestAnimationFrame(tick);
      };
      
      this.rafId = requestAnimationFrame(tick);
      
      // Fallback for headless environments or background tabs
      this.backupIntervalId = setInterval(() => {
        const elapsed = performance.now() - this.lastTickTime;
        if (this.running && elapsed > 100) {
          Matter.Engine.update(this.engine, 16.666);
          this.updateElements();
          this.lastTickTime = performance.now();
        }
      }, 100);
    }
    
    stopLoop() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.backupIntervalId) {
        clearInterval(this.backupIntervalId);
        this.backupIntervalId = null;
      }
    }
    
    createBoundries() {
      this.boundStart = Matter.Bodies.rectangle(-250, this.height / 2, 500, this.height * 4, { isStatic: true });
      this.boundEnd = Matter.Bodies.rectangle(this.width + 250, this.height / 2, 500, this.height * 4, { isStatic: true });
      this.boundBottom = Matter.Bodies.rectangle(0, this.height + 250, this.width * 2, 500, { isStatic: true });
      
      Matter.Composite.add(this.engine.world, [this.boundBottom, this.boundStart, this.boundEnd]);
    }
    
    createBodies() {
      this.DOM.throwables.forEach((el, index) => {
        const innerSpan = el.querySelector("span");
        const rect = el.getBoundingClientRect();
        
        const angle = gsap.utils.random(-0.2 * Math.PI, 0.2 * Math.PI);
        const randX = gsap.utils.random(rect.width / 2, this.width - rect.width / 2);
        const startY = -rect.width - (index * rect.height + 10);
        
        const roundness = this.options.roundness === "sharp" ? 0 : rect.height / 2;
        
        const body = Matter.Bodies.rectangle(randX, startY, rect.width, rect.height, {
          chamfer: { radius: roundness },
          angle: angle,
          isStatic: true,
          restitution: 0.3
        });
        
        this.bodies.push({
          body: body,
          el: el,
          span: innerSpan
        });
        Matter.Composite.add(this.engine.world, [body]);
      });
    }
    
    updateElements() {
      this.bodies.forEach(item => {
        const body = item.body;
        const el = item.el;
        const span = item.span;
        
        el.style.transform = `translate3d(${body.position.x.toFixed(1)}px, ${body.position.y.toFixed(1)}px, 0)`;
        if (span) {
          span.style.transform = `translate3d(-50%, -50%, 0) rotate(${body.angle.toFixed(2)}rad)`;
        }
      });
      
      if (!this.isSettled && this.bodies.length > 0) {
        const lastBody = this.bodies[this.bodies.length - 1].body;
        if (lastBody.position.y > this.height / 2) {
          this.createTopBound();
          if (this.options.scrollGravity) {
            this.makeScrollGravity();
          }
          this.isSettled = true;
        }
      }
      
      if (this.isSettled && this.scrollGravityHandler) {
        this.scrollGravityHandler();
      }
    }
    
    createTopBound() {
      this.boundTop = Matter.Bodies.rectangle(0, 0, this.width * 2, 500, { isStatic: true });
      Matter.Composite.add(this.engine.world, [this.boundTop]);
    }
    
    makeScrollGravity() {
      let lastScroll = document.documentElement.scrollTop - document.documentElement.clientTop;
      this.scrollGravityHandler = () => {
        const currentScroll = document.documentElement.scrollTop - document.documentElement.clientTop;
        const diff = currentScroll - lastScroll;
        this.engine.gravity.y = 0.7 - gsap.utils.clamp(-2, 4, 0.1 * diff);
        lastScroll = currentScroll;
      };
    }
    
    updateBoundries() {
      if (this.boundTop) {
        Matter.Body.setVertices(this.boundTop, Matter.Bodies.rectangle(0, -250, this.width * 2, 500, { isStatic: true }).vertices);
      }
      if (this.boundStart) {
        Matter.Body.setPosition(this.boundStart, { x: -250, y: this.height / 2 });
        Matter.Body.setVertices(this.boundStart, Matter.Bodies.rectangle(-250, this.height / 2, 500, this.height * 4, { isStatic: true }).vertices);
      }
      if (this.boundEnd) {
        Matter.Body.setPosition(this.boundEnd, { x: this.width + 250, y: this.height / 2 });
        Matter.Body.setVertices(this.boundEnd, Matter.Bodies.rectangle(this.width + 250, this.height / 2, 500, this.height * 4, { isStatic: true }).vertices);
      }
      if (this.boundBottom) {
        Matter.Body.setPosition(this.boundBottom, { x: 0, y: this.height + 250 });
        Matter.Body.setVertices(this.boundBottom, Matter.Bodies.rectangle(0, this.height + 250, this.width * 2, 500, { isStatic: true }).vertices);
      }
    }
    
    updateBodies() {
      this.bodies.forEach((item, index) => {
        const body = item.body;
        const el = item.el;
        const rect = el.getBoundingClientRect();
        const roundness = this.options.roundness === "sharp" ? 0 : rect.height / 2;
        const newBody = Matter.Bodies.rectangle(body.position.x, body.position.y, rect.width, rect.height, {
          chamfer: { radius: roundness },
          angle: body.angle
        });
        
        Matter.Body.setVertices(body, newBody.vertices);
        
        if (body.position.y > this.height) {
          Matter.Body.setPosition(body, { y: this.height / 2, x: body.position.x });
        }
        if (body.position.x > this.width) {
          const randX = gsap.utils.random(rect.width / 2, this.width - rect.width / 2);
          Matter.Body.setPosition(body, { y: body.position.y, x: randX });
        }
      });
    }
    
    startRain() {
      this.bodies.forEach((item, index) => {
        const timer = setTimeout(() => {
          Matter.Body.setStatic(item.body, false);
          clearTimeout(timer);
        }, 80 * index);
      });
    }
    
    refresh() {
      if (this.height === this.DOM.element.offsetHeight && this.width === this.DOM.element.offsetWidth) {
        return false;
      }
      this.height = this.DOM.element.offsetHeight;
      this.width = this.DOM.element.offsetWidth;
      
      const timer = setTimeout(() => {
        this.updateBoundries();
        this.updateBodies();
        clearTimeout(timer);
      }, 50);
    }
    
    onWindowResize() {
      this.refresh();
    }
    
    destroy() {
      this.stopLoop();
      window.removeEventListener("resize", this.onWindowResize);
      if (this.runnerObserver) {
        this.runnerObserver.disconnect();
      }
    }
  }
  
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      const opts = $.extend({}, $(this).data("throwable-options"), options);
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new ThrowablePlugin(this, opts));
      }
    });
  };
  
  $(document).ready(function() {
    $("[data-tp-throwable-scene]").tpThrowable();
  });
  
})(jQuery);

