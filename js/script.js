/* =========================================================
   Narges Sadat Alavi — Portfolio
   Interactions: mobile nav, career timeline, project modal
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Language state ---------- */
  window.currentLang = (function () {
    try { return localStorage.getItem('site-lang') || 'en'; } catch (e) { return 'en'; }
  })();

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
      fa: {
        tags: ['تجربه کاربری سلامت', 'طراحی داشبورد', 'طراحی محصول', 'برندینگ'],
        subtitle: 'پلتفرم اندازه‌گیری ارتوپدی به کمک هوش مصنوعی',
        overview: 'ساختن اعتماد پزشک به عددی که هوش مصنوعی به او می‌دهد — پلتفرمی بیمارستانی که راستای اندام را از روی تصویر رادیولوژی اندازه می‌گیرد و امروز در بیمارستان‌های واقعی استفاده می‌شود.',
        role: 'تنها طراح محصول و برند',
        industry: 'سلامت دیجیتال / بیمارستانی',
        tools: 'فیگما',
        constraints: 'خروجی باید در حد استناد بالینی قابل اتکا باشد، در اتاق‌های کم‌نور رادیولوژی خوانا بماند و اصطلاحات فارسی و انگلیسی را کنار هم درست جا بدهد.',
      },
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
      fa: {
        tags: ['مارکت‌پلیس', 'خدمات محلی', 'استارتاپ'],
        subtitle: 'مارکت‌پلیس مقایسه تعمیرگاه خودرو',
        overview: 'طراحی مارکت‌پلیسی که پیش از ثبت سفارش اعتماد راننده را جلب کند — برای کسانی که اولین بار می‌خواهند تعمیرگاه‌ها را با هم بسنجند.',
        role: 'تنها طراح محصول',
        industry: 'استارتاپ / مارکت‌پلیس',
        tools: 'فیگما',
        constraints: 'پیدا کردن تعمیرگاه نزدیک، تأیید صلاحیت تعمیرکار، نمایش نوبت خالی همان لحظه، و قیمتی که از اول معلوم باشد.',
      },
      tags: ['Marketplace', 'Local Services', 'Startup'],
      title: 'Khodropack',
      subtitle: 'Auto-Repair Comparison Marketplace',
      overview: 'Designing a repair marketplace that earns trust before a booking is ever made — for drivers comparing workshops for the first time.',
      role: 'Sole Product Designer',
      industry: 'Startup / B2B / B2C · Marketplace',
      tools: 'Figma',
      constraints: 'Location-based discovery + workshop verification + real-time availability + transparent pricing.',
      accent: '#ff9d54',
      gradMid: 'rgb(30,17,7)'
    },
    rahafto: {
      fa: {
        tags: ['تجربه کاربری دوره', 'طراحی پرداخت', 'طراحی محصول'],
        subtitle: 'بازطراحی صفحه دوره و مسیر پرداخت',
        overview: 'طراحی صفحه دوره و مسیر پرداختی که قبل از خواستن پول، خیال کاربر را راحت کند — برای پلتفرمی که مخاطبش تازه خرید اینترنتی را شروع کرده است.',
        role: 'تنها طراح محصول',
        industry: 'استارتاپ / آموزش آنلاین',
        tools: 'فیگما',
        constraints: 'رقابت با پلتفرم‌هایی که سال‌هاست اسم و اعتبار دارند.',
      },
      tags: ['Course UX', 'Checkout Design', 'Product Design'],
      title: 'Rahafto',
      subtitle: 'Course Platform & Checkout Redesign',
      overview: 'Designing a course page and checkout flow that earns user trust before asking for payment — for a B2C EdTech platform selling online courses to first-time digital buyers.',
      role: 'Sole Product Designer',
      industry: 'Startup / EdTech / B2C',
      tools: 'Figma',
      constraints: 'Competing against established course platforms with years of built-in trust',
      accent: '#9b8cff',
      gradMid: 'rgb(25,7,30)'
    },
    saveh: {
      fa: {
        tags: ['فرهنگ', 'رویداد', 'موبایل‌محور'],
        subtitle: 'اپلیکیشن کنسرت و رویداد فرهنگی',
        overview: 'طراحی تجربه‌ای ساده و صمیمی برای خرید بلیت — برای کسانی که اولین بلیت اینترنتی زندگی‌شان را می‌خرند.',
        role: 'تنها طراح محصول',
        industry: 'فرهنگ / رویداد / سرگرمی',
        tools: 'فیگما',
        constraints: 'بلیت‌هایی که زود تمام می‌شوند، انتخاب صندلی، پرداختی که نباید نیمه‌کاره بماند، و رابطی که از پایه برای مخاطب فارسی‌زبان نوشته شده.',
      },
      tags: ['Culture', 'Events', 'Mobile-First'],
      title: 'Saveh Concert',
      subtitle: 'Concert & Cultural Event App',
      overview: 'Designing a warm, accessible ticketing experience — for concertgoers buying their very first digital ticket.',
      role: 'Sole Product Designer',
      industry: 'Culture / Events / Entertainment',
      tools: 'Figma',
      constraints: 'Time-sensitive ticket purchases + seat selection + payment reliability + Persian-first UX.',
      accent: '#f472b6',
      gradMid: 'rgb(38,9,38)'
    },
    bahfalab: {
      fa: {
        tags: ['محصول سازمانی', 'مدیریت فرایند', 'طراحی برند'],
        subtitle: 'پلتفرم فرایندکاوی و برند',
        overview: 'دو مسیر جدا در یک شرکت. سمت محصول: داشبوردها و ماژول‌های تحلیل برای یک پلتفرم فرایندکاوی B2B، روی یک سیستم مشترک کارت و نمودار. سمت برند: گزارش فرآیند ایران، نشریه و رویداد سالانه‌ای در سطح ملی. هویت بصری‌اش را جدا از نرم‌افزار طراحی کردم و هیچ چیزی از ظاهر رابط محصول در آن نیست.',
        role: 'تنها طراح محصول و برند',
        industry: 'سازمانی / فرایندکاوی',
        tools: 'فیگما',
        constraints: 'گزارش به دست کسانی می‌رسد که هیچ‌وقت نرم‌افزار را باز نمی‌کنند، پس هویتش باید روی پای خودش می‌ایستاد، نه اینکه از رابط محصول ارث ببرد.',
      },
      tags: ['B2B', 'Process Management', 'Brand Design'],
      title: 'Behfalab',
      subtitle: 'Process Mining Platform + Brand',
      overview: 'Two separate tracks at one company. On the product side: dashboards and analysis modules for a B2B process-mining platform, built on a shared card and chart system. On the brand side: Iran Process Report, an annual national publication and event. I designed its visual identity separately from the software, and nothing of the product UI carries into it.',
      role: 'Sole Product & Brand Designer',
      industry: 'B2B / Process Management / Process Mining',
      tools: 'Figma',
      constraints: 'The report reaches people who never open the software, so its identity had to stand on its own rather than inherit the product interface.',
      accent: '#60a5fa',
      gradMid: 'rgb(9,32,38)'
    },
    dota: {
      fa: {
        tags: ['گردش‌کار هوشمند', 'فناوری حقوقی', 'SaaS'],
        subtitle: 'قراردادساز هوشمند برای فریلنسرها',
        overview: 'قراردادسازی که فریلنسر را در چند دقیقه به یک قرارداد درست و ساختاریافته می‌رساند. تمرکز روی ساده کردن کار بود: فرم گام‌به‌گام، پیش‌نمایش زنده سند، بندهای قابل انتخاب و خروجی PDF.',
        role: 'تنها طراح محصول',
        industry: 'ابزار فریلنسری',
        tools: 'فیگما / هوش مصنوعی / دیزاین سیستم',
        constraints: 'متن حقوقی فارسی، بندهایی که با انتخاب کاربر عوض می‌شوند، و زبانی که کاربر بتواند به آن اتکا کند.',
      },
      tags: ['AI Workflow', 'LegalTech', 'SaaS'],
      title: 'Dota',
      subtitle: 'AI Contract-Builder for Freelancers',
      overview: 'Designed an AI-assisted contract builder that enables freelancers to create legally structured contracts in minutes. Focused on reducing complexity through step-by-step forms, live document preview, modular clauses, and seamless PDF generation.',
      role: 'Sole Product Designer',
      industry: 'Productivity / Freelance Tools',
      tools: 'Figma / AI / Design System',
      constraints: 'RTL Persian legal documents + dynamic clause logic + generating trustworthy legal language.',
      accent: '#e0fa60',
      gradMid: 'rgb(35,38,9)'
    },
    nova: {
      fa: {
        tags: ['آرایشی و بهداشتی', 'صفحه محصول', 'پروژه تمرینی'],
        subtitle: 'صفحه محصول لوازم آرایشی',
        overview: 'یک تمرین شخصی: یک صفحه محصول آرایشی، حول سؤال‌هایی که خریدار رژ لب می‌پرسد و خریدار لباس هیچ‌وقت نمی‌پرسد — رنگ واقعی محصول چقدر با عکس فرق دارد، چه چیزی داخلش است، و به پوست من می‌خورد یا نه. نمونه رنگ‌ها با نام رنگ، باکس خرید با تخفیف و موجودی، جدول مشخصات تب‌دار، نظرات با امکان مفید دانستن، و پرسش و پاسخ.',
        role: 'پروژه تمرینی شخصی',
        industry: 'آرایشی و بهداشتی / فروشگاه آنلاین',
        tools: 'فیگما',
        constraints: null,
      },
      tags: ['Beauty', 'Product Page', 'Practice Project'],
      title: 'Nova Store',
      subtitle: 'Cosmetics Product Page',
      overview: 'A self-directed practice project: a single cosmetics product page built around the questions a beauty buyer asks that a clothing buyer never has to — shade accuracy, ingredients, and skin suitability. Shade swatches with a named shade, a buy box carrying discount and stock, a tabbed spec table, reviews with helpfulness voting, and a customer Q&A.',
      role: 'Personal Practice Project',
      industry: 'Beauty & Personal Care / E-Commerce',
      tools: 'Figma',
      constraints: null,
      accent: '#f0a191',
      gradMid: 'rgb(38,18,14)'
    },
    samin: {
      fa: {
        tags: ['مد و پوشاک', 'مسیر پرداخت', 'پروژه تمرینی'],
        subtitle: 'فروشگاه مد و مسیر پرداخت',
        overview: 'یک تمرین شامل یک فروشگاه مد کامل در ۱۱ صفحه دسکتاپ — از صفحه اصلی و لیست محصولات تا پرداخت سه‌مرحله‌ای. جالب‌ترین بخش کار خود صفحه‌ها نبود، جاهایی بود که کاربر از یک صفحه به صفحه بعد می‌رود: مرحله‌ای که تا کامل نشود اجازه رفتن نمی‌دهد، هشدار سقف موجودی همان‌جا کنار کالا، و فاکتوری که در هر سه مرحله جلوی چشم می‌ماند.',
        role: 'پروژه تمرینی شخصی',
        industry: 'مد و پوشاک / فروشگاه آنلاین',
        tools: 'فیگما',
        constraints: null,
      },
      tags: ['Fashion', 'Checkout Flow', 'Practice Project'],
      title: 'Samin Style',
      subtitle: 'Fashion Storefront & Checkout',
      overview: 'A practice project covering a whole fashion storefront across 11 desktop screens — homepage, category, faceted listing, product page, and a three-step checkout. The focus ended up on the seams between screens: progressive validation that blocks a step instead of failing at the end, inline stock limits in the cart, and an order summary that persists through checkout.',
      role: 'Personal Practice Project',
      industry: 'Fashion & Apparel / E-Commerce',
      tools: 'Figma',
      constraints: null,
      accent: '#4ade80',
      gradMid: 'rgb(9,38,22)'
    },
    payment: {
      fa: {
        tags: ['رابط پرداخت'],
        subtitle: 'درگاه پرداخت تک‌صفحه‌ای',
        overview: 'یک تمرین شخصی روی درگاه پرداختی که همه‌چیز را در یک صفحه جمع می‌کند: اطلاعات کارت، جزئیات پرداخت، مشخصات فروشنده و خلاصه تراکنش، بدون اینکه شلوغ شود.',
        role: 'پروژه تمرینی شخصی',
        industry: 'فین‌تک',
        tools: 'فیگما',
        constraints: null,
      },
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
    payment: 'case-studies/payment.html',
    nova: 'case-studies/nova.html',
    samin: 'case-studies/samin.html'
    /* DISABLED (coming soon): , bahfalab: 'case-studies/behfalab.html' */
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

    // در حالت فارسی، فیلدهای ترجمه‌شده جایگزین می‌شوند (title و رنگ‌ها مشترک‌اند)
    var fa = window.currentLang === 'fa' && data.fa ? data.fa : null;
    var pick = function (field) { return fa && fa[field] != null ? fa[field] : data[field]; };

    modalTags.innerHTML = '';
    (pick('tags') || []).forEach(function (t) {
      var span = document.createElement('span');
      span.textContent = t;
      modalTags.appendChild(span);
    });

    modalTitle.textContent = data.title;
    modalSubtitle.textContent = pick('subtitle');
    modalOverview.textContent = pick('overview');
    modalRole.textContent = pick('role');
    modalIndustry.textContent = pick('industry');
    modalTools.textContent = pick('tools');

    var isFa = window.currentLang === 'fa';
    if (pick('constraints')) {
      modalConstraints.textContent = (isFa ? 'محدودیت‌ها: ' : 'Constraints: ') + pick('constraints');
      modalConstraintsWrap.style.display = '';
    } else {
      modalConstraintsWrap.style.display = 'none';
    }

    if (caseStudyUrls[key]) {
      modalCta.style.display = '';
      modalCta.textContent = isFa ? 'مشاهده نمونه‌کار کامل ←' : 'View Full Case Study →';
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
    if (card.classList.contains('no-case-study')) { card.style.cursor = 'default'; return; } // coming soon: not clickable
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

  /* ---------- Language toggle ---------- */
  var langToggle = document.getElementById('langToggle');
  var langLabel = document.getElementById('langLabel');

  function syncLangLabel() {
    // دکمه همیشه زبانِ مقصد را نشان می‌دهد، نه زبان فعلی
    if (langLabel) langLabel.textContent = window.currentLang === 'fa' ? 'EN' : 'FA';
  }
  syncLangLabel();

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = window.currentLang === 'fa' ? 'en' : 'fa';
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce) {
        applyLang(next);
        syncLangLabel();
        return;
      }

      // محو کردن، تعویض زبان در نقطه کور، بعد برگشت
      document.body.classList.add('lang-switching');
      setTimeout(function () {
        applyLang(next);
        syncLangLabel();
        if (currentProjectKey && modal.classList.contains('open')) {
          openModal(currentProjectKey);
        }
        // یک فریم صبر تا چیدمان جدید بنشیند، بعد ظاهر شود
        requestAnimationFrame(function () {
          document.body.classList.remove('lang-switching');
        });
      }, 220);
    });
  }

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
