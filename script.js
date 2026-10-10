/**
 * FAHAD FAISAL STUDIO - INTERACTIVE ENGINE
 * 3D WebGL Background, Dynamic Pricing Estimator, Custom Cursor, Portfolio Modal & WhatsApp Automation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsBackground();
  initCustomCursor();
  initNavbar();
  initPricingCalculator();
  initPortfolio();
  initPhotoUploader();
  initStatsCounter();
  initFaqAccordion();
  initContactForm();
  initTiltCards();
});

/* ==========================================================================
   1. THREE.JS 3D INTERACTIVE WEBGL BACKGROUND
   ========================================================================== */
function initThreeJsBackground() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Central Geometric Crystal (Icosahedron)
  const geomCrystal = new THREE.IcosahedronGeometry(11, 1);
  const matCrystal = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const crystal = new THREE.Mesh(geomCrystal, matCrystal);
  scene.add(crystal);

  // Orbiting Luxury Gyro Ring (Torus)
  const geomTorus = new THREE.TorusGeometry(16, 0.15, 16, 100);
  const matTorus = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.22
  });
  const torus = new THREE.Mesh(geomTorus, matTorus);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  // Second Orbiting Ring (Torus 2)
  const geomTorus2 = new THREE.TorusGeometry(19, 0.12, 16, 100);
  const matTorus2 = new THREE.MeshBasicMaterial({
    color: 0xe879f9,
    transparent: true,
    opacity: 0.15
  });
  const torus2 = new THREE.Mesh(geomTorus2, matTorus2);
  torus2.rotation.y = Math.PI / 4;
  scene.add(torus2);

  // Star Field Particles
  const particlesCount = 450;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const colorViolet = new THREE.Color(0xc084fc);
  const colorGold = new THREE.Color(0xfbbf24);
  const colorCyan = new THREE.Color(0x38bdf8);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    const chosenColor = Math.random() > 0.6 ? colorViolet : (Math.random() > 0.3 ? colorGold : colorCyan);
    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  const particlesGeom = new THREE.BufferGeometry();
  particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.65
  });

  const particleMesh = new THREE.Points(particlesGeom, particlesMat);
  scene.add(particleMesh);

  // Mouse Interactivity with Inertia
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotations
    crystal.rotation.x = elapsedTime * 0.08 + targetY * 0.5;
    crystal.rotation.y = elapsedTime * 0.12 + targetX * 0.5;

    torus.rotation.z = elapsedTime * 0.15;
    torus.rotation.x = Math.PI / 3 + targetY * 0.4;
    torus.rotation.y = targetX * 0.4;

    torus2.rotation.y = Math.PI / 4 + elapsedTime * 0.1;
    torus2.rotation.x = targetY * 0.3;

    particleMesh.rotation.y = -elapsedTime * 0.03 + targetX * 0.2;
    particleMesh.rotation.x = elapsedTime * 0.02 - targetY * 0.2;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

/* ==========================================================================
   2. CUSTOM GLOW CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const glow = document.getElementById('cursorGlow');
  if (!cursor || !glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .calc-pill, .speed-card, .project-card, .service-3d-card, .photo-change-btn');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE 3D PRICE CALCULATOR
   ========================================================================== */
function initPricingCalculator() {
  const servicePills = document.querySelectorAll('#calcServiceSelector .calc-pill');
  const quantitySlider = document.getElementById('calcQuantitySlider');
  const quantityLabel = document.getElementById('calcQuantityLabel');
  const quantityDisplay = document.getElementById('calcQuantityDisplay');
  const speedCards = document.querySelectorAll('#calcSpeedSelector .speed-card');
  const addonTurnitin = document.getElementById('addonTurnitin');
  const addonNotes = document.getElementById('addonNotes');

  // Receipt elements
  const rService = document.getElementById('rService');
  const rQuantity = document.getElementById('rQuantity');
  const rSpeed = document.getElementById('rSpeed');
  const calcTotalAmount = document.getElementById('calcTotalAmount');
  const whatsappOrderBtn = document.getElementById('calcWhatsappOrderBtn');

  if (!servicePills.length || !quantitySlider) return;

  // Configuration for services in Euros (€)
  // Base for 10 slides is exactly €13 (€7 base for 5 slides + €1.20 per additional slide)
  const serviceConfig = {
    presentation: { name: 'University Presentation', unit: 'Slides', min: 5, max: 40, step: 1, base: 7, perUnit: 1.2 },
    assignment: { name: 'Assignment / Report', unit: 'Pages', min: 3, max: 30, step: 1, base: 15, perUnit: 4 },
    fashion: { name: 'Fashion Lookbook / Sketches', unit: 'Designs', min: 2, max: 15, step: 1, base: 25, perUnit: 8 },
    art: { name: 'Art Movement Study', unit: 'Sections', min: 2, max: 10, step: 1, base: 20, perUnit: 6 },
    brand: { name: 'Brand Identity & Logo', unit: 'Brand Assets', min: 3, max: 12, step: 1, base: 35, perUnit: 9 },
    social: { name: 'Social Media Kit', unit: 'Posts', min: 5, max: 30, step: 1, base: 20, perUnit: 2.5 }
  };

  let currentServiceKey = 'presentation';

  // Handle service pill click
  servicePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      servicePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      currentServiceKey = pill.getAttribute('data-service');
      const conf = serviceConfig[currentServiceKey];

      // Update slider bounds & unit
      quantitySlider.min = conf.min;
      quantitySlider.max = conf.max;
      quantitySlider.value = Math.max(conf.min, Math.min(conf.max, parseInt(quantitySlider.value) || conf.min));
      quantityLabel.innerHTML = `<i class="fas fa-sliders"></i> 2. Number of ${conf.unit}:`;

      updateCalculator();
    });
  });

  // Handle slider input
  quantitySlider.addEventListener('input', updateCalculator);

  // Handle speed cards
  speedCards.forEach((card) => {
    card.addEventListener('click', () => {
      speedCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      updateCalculator();
    });
  });

  // Handle add-ons
  if (addonTurnitin) addonTurnitin.addEventListener('change', updateCalculator);
  if (addonNotes) addonNotes.addEventListener('change', updateCalculator);

  function updateCalculator() {
    const conf = serviceConfig[currentServiceKey];
    const qty = parseInt(quantitySlider.value, 10);
    quantityDisplay.textContent = `${qty} ${conf.unit}`;

    // Speed multiplier
    const activeSpeedCard = document.querySelector('#calcSpeedSelector .speed-card.active input');
    const speedMultiplier = activeSpeedCard ? parseFloat(activeSpeedCard.getAttribute('data-multiplier')) : 1.0;
    const speedName = activeSpeedCard ? activeSpeedCard.value : 'standard';

    const speedLabels = {
      standard: 'Standard (3-4 Days)',
      express: 'Express (48 Hours)',
      rush: 'Emergency (24 Hours)'
    };

    // Calculate core price in Euros
    let subtotal = conf.base + (qty - conf.min) * conf.perUnit;
    subtotal = subtotal * speedMultiplier;

    // Addons in Euros
    if (addonTurnitin && addonTurnitin.checked) subtotal += 5;
    if (addonNotes && addonNotes.checked) subtotal += 5;

    const roundedTotal = Math.round(subtotal);
    const formattedTotal = roundedTotal.toLocaleString('en-US');

    // Update receipt text
    if (rService) rService.textContent = conf.name;
    if (rQuantity) rQuantity.textContent = `${qty} ${conf.unit}`;
    if (rSpeed) rSpeed.textContent = speedLabels[speedName] || 'Standard';
    if (calcTotalAmount) calcTotalAmount.textContent = formattedTotal;

    // Generate WhatsApp link
    const waText = encodeURIComponent(
      `Hi Fahad! I calculated a project estimate on your website:\n\n` +
      `📌 *Service:* ${conf.name}\n` +
      `📊 *Deliverable:* ${qty} ${conf.unit}\n` +
      `⏱ *Timeline:* ${speedLabels[speedName]}\n` +
      `💰 *Estimated Price:* €${formattedTotal}\n\n` +
      `I want to place my order. Can we discuss the requirements?`
    );

    if (whatsappOrderBtn) {
      whatsappOrderBtn.href = `https://wa.me/923246714059?text=${waText}`;
    }
  }

  // Initial trigger
  updateCalculator();
}

/* ==========================================================================
   5. PORTFOLIO FILTERING & MODAL PREVIEW
   ========================================================================== */
const projectDatabase = {
  'presentation-1': {
    title: 'Smart Sustainability: Bio-Integrated Carbon Capture',
    client: 'Global Climate Research · Master’s Seminar Deck',
    category: 'University Presentation',
    image: 'images/project_presentation.jpg',
    description: 'A 32-slide defense deck structured for a postgraduate environmental science seminar. Includes bespoke infographics detailing microalgae hybrid systems, carbon capture efficiency benchmarks, and commercial investment roadmaps.',
    deliverables: ['32 Custom Slides (16:9 4K)', 'Speaker Notes Script', 'Fully Editable .PPTX & Canva Link', 'Turnitin 0% Similarity Citation Document'],
    tools: ['PowerPoint', 'Canva Pro', 'Figma', 'Adobe Illustrator'],
    outcome: 'Defended with straight A+ and recognized as highest scoring presentation in the department.'
  },
  'fashion-1': {
    title: 'The Archetype Colloquy - FW25 Collection',
    client: 'Haute Couture Graduation Degree Portfolio',
    category: 'Fashion Design & Lookbook',
    image: 'images/project_fashion.jpg',
    description: 'An architectural haute couture collection concept exploring sculptural silhouettes, fluid organza drapery, and metallic beadwork. Complete degree submission package with moodboards, color psychology, and textile swatches.',
    deliverables: ['Moodboard & Philosophy Statement', '8 Runway Silhouette Sketches', 'Technical Flat Specs & Fabric Notes', 'Print-ready Lookbook PDF'],
    tools: ['Digital Fashion Sketching', 'Adobe Illustrator', 'Procreate', 'Photoshop'],
    outcome: 'Selected for university runway exhibition showcase.'
  },
  'art-1': {
    title: 'Bauhaus Meets Surrealism: Converging Visions',
    client: 'Visual Arts Study · Art History Exhibition',
    category: 'Art Movements & Visual Theory',
    image: 'images/project_art.jpg',
    description: 'A comprehensive academic and visual study contrasting Walter Gropius’s functional modernist geometry with Salvador Dalí’s surrealist dreamscapes. Synthesized into an avant-garde exhibition poster and research monograph.',
    deliverables: ['Curated Exhibition Poster Design', '20-Page Visual Case Study Paper', 'APA 7th Referencing Index', 'High-Res Museum Print Assets'],
    tools: ['Adobe Photoshop', 'Illustrator', 'Art Historical Research', 'Turnitin Verified'],
    outcome: 'Published in student arts symposium proceedings.'
  },
  'brand-1': {
    title: 'Aura & Co. Minimalist Brand Architecture',
    client: 'Aura & Co. · Luxury Goods & Fragrance',
    category: 'Brand Identity & Packaging',
    image: 'images/project_branding.jpg',
    description: 'Comprehensive brand identity crafted for a boutique luxury essentials label. Features custom typographic monogram, copper foil stamping mockups, matte dark packaging boxes, and complete brand guidelines.',
    deliverables: ['Primary & Secondary Vector Logos', 'Brand Style Guide (Color, Type, Grid)', 'Packaging & Stationery Mockups', 'Social Media Asset Templates'],
    tools: ['Adobe Illustrator', 'Photoshop', 'Dimension 3D'],
    outcome: 'Successfully launched brand across international e-commerce channels.'
  },
  'social-1': {
    title: 'Golden Hour: Editorial Carousel & Story Kit',
    client: 'Golden Hour Boutique · Instagram Editorial',
    category: 'Social Media Strategy & Content',
    image: 'images/project_social.jpg',
    description: 'An ultra-aesthetic 30-day social media marketing framework designed to build organic engagement. Contains seamless swipe-through editorial carousels, styled mood story highlights, and reusable Canva templates.',
    deliverables: ['12 Seamless Multi-Slide Carousels', '20 Daily Story Templates', '6 Animated Reels Cover Designs', 'Canva Pro Master Template Link'],
    tools: ['Canva Pro', 'Photoshop', 'Social Strategy Framework'],
    outcome: '340% increase in reach and 4.8x bookmark/save rate in the first month.'
  },
  'presentation-2': {
    title: 'Market Disruption & Consumer Sentiment Analysis',
    client: 'MBA Marketing Case Study · Distinction Grade',
    category: 'Academic Project & FYP',
    image: 'images/project_presentation.jpg',
    description: 'Executive pitch deck analyzing fintech market adoption across South Asia. Transformed 50 pages of dense analytical data into digestible charts, SWOT diagrams, and competitor quadrants.',
    deliverables: ['28-Slide Executive Deck', 'Harvard Case Study Referencing', 'Excel Data Chart Linking', 'Executive Summary Handout PDF'],
    tools: ['PowerPoint', 'Excel Data Viz', 'Canva Pro'],
    outcome: 'Awarded distinction mark (94/100) by university panel.'
  }
};

function initPortfolio() {
  const filterTabs = document.querySelectorAll('.portfolio-filter-tabs .p-tab');
  const projectCards = document.querySelectorAll('.portfolio-grid .project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Global modal handlers
window.openModal = function(projectId) {
  const modal = document.getElementById('portfolioModal');
  const modalContainer = document.getElementById('modalDynamicContent');
  const data = projectDatabase[projectId];

  if (!modal || !modalContainer || !data) return;

  const toolsHtml = data.tools.map(t => `<span class="project-tag-pill" style="position:static; margin-right:6px; display:inline-block;">${t}</span>`).join('');
  const deliverablesHtml = data.deliverables.map(d => `<li style="display:flex; align-items:center; gap:8px; margin-bottom:6px;"><i class="fas fa-check" style="color:#34d399;"></i> ${d}</li>`).join('');

  modalContainer.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr; gap: 1.5rem;">
      <div style="width:100%; max-height:360px; overflow:hidden; border-radius:16px;">
        <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover; display:block;"/>
      </div>
      <div>
        <span style="color:#fbbf24; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">${data.category}</span>
        <h3 style="font-family:'Syne', sans-serif; font-size:1.8rem; font-weight:800; color:#fff; margin:0.4rem 0 0.8rem;">${data.title}</h3>
        <p style="color:#94a3b8; font-size:0.95rem; line-height:1.7; margin-bottom:1.4rem;">${data.description}</p>
        
        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:1.2rem; border-radius:14px; margin-bottom:1.4rem;">
          <h4 style="color:#fff; font-size:0.95rem; margin-bottom:0.8rem;"><i class="fas fa-cube" style="color:#c084fc;"></i> Key Deliverables:</h4>
          <ul style="list-style:none; padding:0; font-size:0.88rem; color:#f8fafc;">
            ${deliverablesHtml}
          </ul>
        </div>

        <div style="margin-bottom:1.5rem;">
          <h4 style="color:#94a3b8; font-size:0.82rem; margin-bottom:0.5rem; text-transform:uppercase;">Software & Expertise:</h4>
          ${toolsHtml}
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="https://wa.me/923246714059?text=Hi%20Fahad,%20I%20saw%20your%20project%20'${encodeURIComponent(data.title)}'%20and%20want%20something%20similar!" target="_blank" class="btn btn-primary">
            <i class="fab fa-whatsapp"></i> Request Similar Project
          </a>
          <button onclick="closeModal()" class="btn btn-outline">Close Preview</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = document.getElementById('portfolioModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeModal();
});

/* ==========================================================================
   6. INSTANT PHOTO UPLOADER / PREVIEWER
   ========================================================================== */
function initPhotoUploader() {
  const photoInput = document.getElementById('photoUploadInput');
  const mainPic = document.getElementById('mainProfilePic');
  const aboutPic = document.getElementById('aboutProfilePic');

  if (!photoInput) return;

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSrc = event.target.result;
        if (mainPic) mainPic.src = newSrc;
        if (aboutPic) aboutPic.src = newSrc;

        // Feedback toast
        alert('Photo preview updated! To make it permanent on your website, save your picture as "profile.jpg" in this folder.');
      };
      reader.readAsDataURL(file);
    }
  });
}

/* ==========================================================================
   7. STATS COUNTER ON SCROLL
   ========================================================================== */
function initStatsCounter() {
  const statCounters = document.querySelectorAll('.stat-counter');
  if (!statCounters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statCounters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   9. STUDENT CONTACT FORM (DIRECT WHATSAPP TRIGGER)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('studentContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const deadline = document.getElementById('formDeadline').value;
    const message = document.getElementById('formMessage').value.trim();

    const waMsg = encodeURIComponent(
      `Hello Fahad! New Project Inquiry from your Portfolio Website:\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone/WA:* ${phone}\n` +
      `📚 *Service Needed:* ${service}\n` +
      `⏰ *Deadline:* ${deadline}\n` +
      `📝 *Project Details:*\n${message}\n\n` +
      `Please let me know your availability!`
    );

    window.open(`https://wa.me/923246714059?text=${waMsg}`, '_blank');
  });
}

/* ==========================================================================
   10. VANILLA TILT CARDS
   ========================================================================== */
function initTiltCards() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      perspective: 1000
    });
  }
}
