/* =========================================================
   Narges Sadat Alavi — Portfolio
   Interactions: mobile nav, career timeline, project modal
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Language state ---------- */
  window.currentLang = 'en';

  function mField(el, base) {
    // returns the Farsi variant of a milestone data-attribute when in fa mode, else the default
    if (window.currentLang === 'fa') {
      var faVal = el.getAttribute('data-' + base + '-fa');
      if (faVal) return faVal;
    }
    return el.getAttribute('data-' + base);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');
  var navOverlay = document.getElementById('navOverlay');

  function closeNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function toggleNav() {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navOverlay.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', closeNav);
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Career timeline ---------- */
  var milestones = document.querySelectorAll('.milestone');
  var tcTitle = document.getElementById('tcTitle');
  var tcRole = document.getElementById('tcRole');
  var tcDesc = document.getElementById('tcDesc');
  var timelineCurrent = document.getElementById('timelineCurrent');

  milestones.forEach(function (m) {
    var mobileRole = m.querySelector('[data-mobile-role]');
    var mobileDesc = m.querySelector('[data-mobile-desc]');
    if (mobileRole) mobileRole.textContent = mField(m, 'role');
    if (mobileDesc) mobileDesc.textContent = mField(m, 'desc');
  });

  /* ---------- پیش‌فرض موبایل: جدیدترین مورد (PathoFinder) باز باشد ---------- */
  /* در دسکتاپ دست‌نخورده می‌ماند و همان BEng فعال است. */
  var mobileTimeline = window.matchMedia('(max-width: 760px)');
  var newest = document.querySelector('.milestone[data-newest]');
  var activeMilestone = document.querySelector('.milestone.active') || milestones[0];

  if (mobileTimeline.matches && newest) {
    // no-anim تا باکس هنگام لود بدون انیمیشن و از قبل باز باشد
    newest.classList.add('no-anim');
    milestones.forEach(function (o) { o.classList.remove('active'); });
    newest.classList.add('active');
    activeMilestone = newest;

    var nColor = getComputedStyle(newest).getPropertyValue('--milestone-color').trim();
    if (nColor) timelineCurrent.style.setProperty('--tc-color', nColor);
    tcTitle.textContent = mField(newest, 'title');
    tcRole.textContent = mField(newest, 'role');
    tcDesc.textContent = mField(newest, 'desc');

    void newest.offsetHeight;
    requestAnimationFrame(function () { newest.classList.remove('no-anim'); });
  }

  var tcTimers = [];
  function clearTcTimers() {
    tcTimers.forEach(clearTimeout);
    tcTimers = [];
  }

  milestones.forEach(function (m) {
    m.addEventListener('click', function () {
      clearTcTimers();
      milestones.forEach(function (o) { o.classList.remove('active'); });
      m.classList.add('active');
      activeMilestone = m;

      var color = getComputedStyle(m).getPropertyValue('--milestone-color').trim();
      if (color) timelineCurrent.style.setProperty('--tc-color', color);

      timelineCurrent.style.opacity = '';

      var fill = function () {
        tcTitle.textContent = mField(m, 'title');
        tcRole.textContent = mField(m, 'role');
        tcDesc.textContent = mField(m, 'desc');
      };

      // موبایل (کارت مخفی است) یا کاربری که انیمیشن کمتر می‌خواهد: بدون انیمیشن
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || getComputedStyle(timelineCurrent).display === 'none') {
        fill();
        return;
      }

      var startH = timelineCurrent.offsetHeight;
      timelineCurrent.classList.add('is-swapping');

      tcTimers.push(setTimeout(function () {
        fill();

        // ارتفاع طبیعی محتوای جدید را اندازه می‌گیریم، بعد از startH به آن انیمیت می‌کنیم
        timelineCurrent.style.height = 'auto';
        var endH = timelineCurrent.offsetHeight;
        timelineCurrent.style.height = startH + 'px';
        void timelineCurrent.offsetHeight; // اجبار به reflow
        timelineCurrent.style.height = endH + 'px';

        timelineCurrent.classList.remove('is-swapping');
        tcTimers.push(setTimeout(function () {
          timelineCurrent.style.height = '';
        }, 400));
      }, 200));
    });
  });

  /* ---------- Project modal ---------- */
  var projectData = {
    pathofinder: {
      tags: ['Healthtech UX', 'Dashboard Design', 'Product Design', 'Branding'],
      title: 'PathoFinder',
      subtitle: 'AI-Assisted Orthopedic Measurement Platform',
      overview: 'Designing the trust layer for AI-assisted orthopedic surgical planning — a B2B hospital platform using AI to measure limb alignment from X-rays, deployed in live hospital systems.',
      role: 'Sole Product & Brand Designer',
      industry: 'Healthtech / B2B Hospital',
      tools: 'Figma',
      constraints: 'Clinical-grade trust + dark radiology environments + bilingual FA/EN terminology',
      accent: '#2fd6b0',
      gradMid: 'rgb(13,31,54)'
    },
    khodropack: {
      tags: ['Marketplace', 'Local Services', 'Startup'],
      title: 'Khodropack',
      subtitle: 'Auto-Repair Comparison Marketplace',
      overview: 'Designing a repair marketplace that earns trust before a booking is ever made — for drivers comparing workshops for the first time.',
      role: 'UI/UX Designer',
      industry: 'Startup / B2B / B2C · Marketplace',
      tools: 'Figma',
      constraints: 'Location-based discovery + workshop verification + real-time availability + transparent pricing.',
      accent: '#ff9d54',
      gradMid: 'rgb(30,17,7)'
    },
    rahafto: {
      tags: ['Course UX', 'Checkout Design', 'Product Design'],
      title: 'Rahafto Academy',
      subtitle: 'Course Platform & Checkout Redesign',
      overview: 'Designing a course page and checkout flow that earns user trust before asking for payment — for a B2C EdTech platform selling online courses to first-time digital buyers.',
      role: 'Product Designer',
      industry: 'Education Platform / B2C',
      tools: 'Figma',
      constraints: 'Competing against established course platforms with years of built-in trust',
      accent: '#9b8cff',
      gradMid: 'rgb(25,7,30)'
    },
    saveh: {
      tags: ['Culture', 'Events', 'Mobile-First'],
      title: 'Saveh Concert',
      subtitle: 'Concert & Cultural Event App',
      overview: 'Designing a warm, accessible ticketing experience — for concertgoers buying their very first digital ticket.',
      role: 'UI/UX Designer',
      industry: 'Culture / Events / Entertainment',
      tools: 'Figma',
      constraints: 'Time-sensitive ticket purchases + seat selection + payment reliability + Persian-first UX.',
      accent: '#f472b6',
      gradMid: 'rgb(38,9,38)'
    },
    bahfalab: {
      tags: ['B2B', 'Process Management', 'Brand Design'],
      title: 'Bahfalab',
      subtitle: 'Process Mining Platform + Brand',
      overview: 'Designing a B2B process mining product and a national event brand side by side — without either one compromising the other.',
      role: 'Product & Brand Designer',
      industry: 'B2B / Process Management / Process Mining',
      tools: 'Figma',
      constraints: 'Dual-brand consistency across a SaaS product and a physical annual event, under one shared visual identity.',
      accent: '#60a5fa',
      gradMid: 'rgb(9,32,38)'
    },
    dota: {
      tags: ['AI Workflow', 'LegalTech', 'SaaS'],
      title: 'Dota',
      subtitle: 'AI Contract-Builder for Freelancers',
      overview: 'Designed an AI-assisted contract builder that enables freelancers to create legally structured contracts in minutes. Focused on reducing complexity through step-by-step forms, live document preview, modular clauses, and seamless PDF generation.',
      role: 'Product Designer',
      industry: 'Productivity / Freelance Tools',
      tools: 'Figma / AI / Design System',
      constraints: 'RTL Persian legal documents + dynamic clause logic + generating trustworthy legal language.',
      accent: '#e0fa60',
      gradMid: 'rgb(35,38,9)'
    },
    nova: {
      tags: ['Beauty', 'E-commerce', 'Learning Project'],
      title: 'Nova Store',
      subtitle: 'Beauty E-Commerce Redesign',
      overview: 'A learning project redesigning a beauty e-commerce experience, focused on product catalog browsing, filtering, product pages, and a smoother shopping journey.',
      role: 'Personal Learning Project',
      industry: 'Beauty E-Commerce',
      tools: 'Figma',
      constraints: null,
      accent: '#9b8cff',
      gradMid: 'rgb(15,9,38)'
    },
    samin: {
      tags: ['Fashion', 'Editorial', 'Learning Project'],
      title: 'Samin Style',
      subtitle: 'Editorial Fashion App',
      overview: 'Learning project exploring an expressive, editorial-style fashion app — lookbook, product grid, and styling flows.',
      role: 'Personal Learning Project',
      industry: 'Fashion / Editorial E-Commerce',
      tools: 'Figma',
      constraints: null,
      accent: '#f472b6',
      gradMid: 'rgb(38,9,38)'
    },
    payment: {
      tags: ['Payment UI'],
      title: 'Payment Gateway',
      subtitle: 'One-Page Payment Experience',
      overview: 'A self-directed UI concept exploring a one-page payment gateway experience. Designed a streamlined layout that combines card information, dynamic payment details, merchant information, and transaction summary into a single secure interface.',
      role: 'Personal Practice Project',
      industry: 'FinTech',
      tools: 'Figma',
      constraints: null,
      accent: '#58a3ff',
      gradMid: 'rgb(9,26,38)'
    }
  };

  var caseStudyUrls = {
    pathofinder: 'case-studies/pathofinder.html',
    dota: 'case-studies/dota.html',
    rahafto: 'case-studies/rahafto.html',
    khodropack: 'case-studies/khodropack.html',
    saveh: 'case-studies/saveh.html',
    payment: 'case-studies/payment.html'
  };

  var modal = document.getElementById('projectModal');
  var modalTags = document.getElementById('modalTags');
  var modalTitle = document.getElementById('modalTitle');
  var modalSubtitle = document.getElementById('modalSubtitle');
  var modalOverview = document.getElementById('modalOverview');
  var modalRole = document.getElementById('modalRole');
  var modalIndustry = document.getElementById('modalIndustry');
  var modalTools = document.getElementById('modalTools');
  var modalConstraintsWrap = document.getElementById('modalConstraintsWrap');
  var modalConstraints = document.getElementById('modalConstraints');
  var modalClose = document.getElementById('modalClose');
  var lastFocused = null;

  var modalCta = document.getElementById('modalCta');
  var currentProjectKey = null;

  function openModal(key) {
    var data = projectData[key];
    if (!data) return;
    currentProjectKey = key;

    modal.querySelector('.modal-card').style.setProperty('--modal-accent', data.accent);
    modal.querySelector('.modal-card').style.setProperty('--modal-grad-mid', data.gradMid);

    modalTags.innerHTML = '';
    data.tags.forEach(function (t) {
      var span = document.createElement('span');
      span.textContent = t;
      modalTags.appendChild(span);
    });

    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalOverview.textContent = data.overview;
    modalRole.textContent = data.role;
    modalIndustry.textContent = data.industry;
    modalTools.textContent = data.tools;

    if (data.constraints) {
      modalConstraints.textContent = 'Constraints: ' + data.constraints;
      modalConstraintsWrap.style.display = '';
    } else {
      modalConstraintsWrap.style.display = 'none';
    }

    if (caseStudyUrls[key]) {
      modalCta.style.display = '';
      modalCta.textContent = 'View Full Case Study →';
    } else {
      modalCta.style.display = 'none';
    }

    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.work-card[data-project]').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(card.getAttribute('data-project'));
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  modalCta.addEventListener('click', function () {
    if (currentProjectKey && caseStudyUrls[currentProjectKey]) {
      window.location.href = caseStudyUrls[currentProjectKey];
    } else {
      closeModal();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ---------- Bilingual text data (kept for future use; no UI toggle currently) ---------- */
  var bilingualEls = document.querySelectorAll('[data-en][data-fa]');

  function applyLang(lang) {
    window.currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

    bilingualEls.forEach(function (el) {
      var val = lang === 'fa' ? el.getAttribute('data-fa') : el.getAttribute('data-en');
      if (val === null) return;
      if (el.getAttribute('data-html') === 'true') {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    // re-render whichever timeline milestone is currently open
    if (activeMilestone) {
      tcTitle.textContent = mField(activeMilestone, 'title');
      tcRole.textContent = mField(activeMilestone, 'role');
      tcDesc.textContent = mField(activeMilestone, 'desc');
    }
    milestones.forEach(function (m) {
      var mobileRole = m.querySelector('[data-mobile-role]');
      var mobileDesc = m.querySelector('[data-mobile-desc]');
      if (mobileRole) mobileRole.textContent = mField(m, 'role');
      if (mobileDesc) mobileDesc.textContent = mField(m, 'desc');
    });

    localStorage.setItem('site-lang', lang);
  }

  applyLang(window.currentLang);

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 480) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
