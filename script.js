/**
 * ============================================================================
 * WEBORA - MAIN JAVASCRIPT ENGINE
 * Premium Conversion-Focused Single-Page Application Logic
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
   RULE 1 & SINGLE SOURCE OF TRUTH: CLIENT CONFIGURATION OBJECT
   All business details, contact points, and base parameters flow from here.
   ---------------------------------------------------------------------------- */
const BUSINESS_CONFIG = {
  businessName: "Webora",
  tagline: "Crafting High-Converting Websites for Local Businesses",
  ownerName: "Balu Kandekar",
  phone: "9067257872",
  phoneDisplay: "+91 9067257872",
  whatsapp: "919067257872", // Country code 91 + phone number without + or spaces
  email: "kandekarbalu8314@gmail.com",
  address: "Kolhapur, Maharashtra, India",
  serviceArea: "Kolhapur, Pune, Sangli, Satara & across Maharashtra",
  yearsInBusiness: 5,
  projectsCompleted: 50,
  industriesServed: [
    "Local Businesses",
    "Coaching Institutes",
    "Clinics & Doctors",
    "Restaurants & Cafes",
    "Real Estate",
    "E-commerce",
    "Service Providers",
    "Educational Institutes"
  ]
};

/* ----------------------------------------------------------------------------
   COST CALCULATOR DATA ENGINE
   Base matrices for dynamic interactive quote calculations (Maharashtra market)
   ---------------------------------------------------------------------------- */
const BASE_PRICES = {
  business: 12999,  /* Starter/Local Business Website */
  coaching: 17999,  /* Coaching & Educational Institute Portal */
  ecommerce: 24999, /* E-Commerce Store with UPI/Razorpay */
  landing: 8999,    /* High-Converting Ad Landing Page */
  portfolio: 10999  /* Personal Portfolio / Solo Professional */
};

const PAGE_MULTIPLIERS = {
  "1-5": 1.0,
  "6-10": 1.45,
  "11-20": 1.95,
  "20+": 2.7
};

const FEATURE_PRICES = {
  whatsapp: 1500,
  booking: 2500,
  payment: 3500,
  blog: 2000,
  admin: 4500,
  seo: 2500,
  maps: 1000,
  multilingual: 2500
};

const STYLE_MULTIPLIERS = {
  basic: 0.9,
  modern: 1.0,
  premium: 1.35
};

const TIMELINE_MULTIPLIERS = {
  standard: 1.0,
  fast: 1.25
};

/* ----------------------------------------------------------------------------
   DOM CONTENT LOADED - INITIALIZATION DISPATCHER
   ---------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initDynamicContactLinks();
  initStickyHeader();
  initMobileNavigation();
  initBlogNavDropdown();
  initBlogFilters();
  initStatsCounter();
  initCostCalculator();
  initPortfolioFilters();
  initEnquiryModal();
  initSmoothScroll();
  initBlogArticleModal();
});

/* ----------------------------------------------------------------------------
   1. DYNAMIC CONTACT INJECTION (RULE 1 COMPLIANCE)
   Ensures all phone, email, and WhatsApp links are dynamically linked to BUSINESS_CONFIG.
   ---------------------------------------------------------------------------- */
function initDynamicContactLinks() {
  // Update WhatsApp trigger links
  const whatsappElements = document.querySelectorAll("[data-dynamic-whatsapp]");
  whatsappElements.forEach(el => {
    const customMessage = el.getAttribute("data-wa-msg") || 
      encodeURIComponent(`Hello ${BUSINESS_CONFIG.businessName}! I am interested in building a high-converting website for my business.`);
    el.href = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${customMessage}`;
  });

  // Update Phone call links
  const phoneElements = document.querySelectorAll("[data-dynamic-phone]");
  phoneElements.forEach(el => {
    el.href = `tel:${BUSINESS_CONFIG.phone}`;
  });
}

/* ----------------------------------------------------------------------------
   2. STICKY HEADER & NAVBAR SCROLL DETECTION
   ---------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* ----------------------------------------------------------------------------
   3. MOBILE NAVIGATION & HAMBURGER MENU
   ---------------------------------------------------------------------------- */
function closeMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const dropdownContainer = document.querySelector(".nav-item-dropdown");
  const dropdownTrigger = document.getElementById("blogDropdownTrigger");

  if (menuToggle) menuToggle.classList.remove("open");
  if (navMenu) navMenu.classList.remove("open");
  document.body.style.overflow = "";

  if (dropdownContainer) dropdownContainer.classList.remove("open");
  if (dropdownTrigger) dropdownTrigger.setAttribute("aria-expanded", "false");
}

function initMobileNavigation() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const topNavLinks = document.querySelectorAll(".nav-menu > a.nav-link");

  if (!menuToggle || !navMenu) return;

  // Toggle mobile navigation drawer
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close hamburger menu when a direct top-level link is clicked
  topNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu if user clicks outside header when mobile menu is open
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open")) {
      const header = document.querySelector(".site-header");
      if (header && !header.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMobileMenu();
    }
  });
}

/* ----------------------------------------------------------------------------
   3.5 BLOG NAVIGATION SUB-MENU DROPDOWN
   ---------------------------------------------------------------------------- */
function initBlogNavDropdown() {
  const dropdownContainer = document.querySelector(".nav-item-dropdown");
  const dropdownTrigger = document.getElementById("blogDropdownTrigger");
  const dropdownLinks = document.querySelectorAll(".dropdown-link");

  if (!dropdownContainer || !dropdownTrigger) return;

  // Dedicated toggle handler for trigger button (works across mobile & touch devices)
  dropdownTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyOpen = dropdownContainer.classList.contains("open");
    if (isCurrentlyOpen) {
      dropdownContainer.classList.remove("open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
    } else {
      dropdownContainer.classList.add("open");
      dropdownTrigger.setAttribute("aria-expanded", "true");
    }
  });

  // Dropdown sub-link clicks: apply filter + close mobile menu + smooth scroll to target
  dropdownLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const filterTarget = link.getAttribute("data-blog-filter-trigger");
      if (filterTarget) {
        setBlogCategoryFilter(filterTarget);
      }

      // Close mobile navigation drawer cleanly
      closeMobileMenu();

      // Smooth scroll to the target anchor with a slight delay to allow drawer closing
      const targetHref = link.getAttribute("href");
      if (targetHref && targetHref.startsWith("#")) {
        const targetElement = document.querySelector(targetHref);
        if (targetElement) {
          e.preventDefault();
          setTimeout(() => {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }, 120);
        }
      }
    });
  });

  // Close dropdown on desktop when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove("open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
    }
  });
}

/* ----------------------------------------------------------------------------
   4. STATS COUNTER WITH INTERSECTION OBSERVER
   ---------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic function
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector(".stats-counter-bar") || statNumbers[0].closest("section");
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ----------------------------------------------------------------------------
   5. INTERACTIVE WEBSITE COST CALCULATOR ENGINE
   ---------------------------------------------------------------------------- */
function initCostCalculator() {
  const calcForm = document.getElementById("websiteCostCalculator");
  if (!calcForm) return;

  const websiteTypeSelect = document.getElementById("calcWebsiteType");
  const pageRadios = document.querySelectorAll("input[name='calc_pages']");
  const featureCheckboxes = document.querySelectorAll("input[name='calc_feature']");
  const styleRadios = document.querySelectorAll("input[name='calc_style']");
  const timelineRadios = document.querySelectorAll("input[name='calc_timeline']");

  // Output elements
  const displayPriceRange = document.getElementById("calcPriceRangeDisplay");
  const summaryType = document.getElementById("summaryWebsiteType");
  const summaryPages = document.getElementById("summaryPages");
  const summaryFeatures = document.getElementById("summaryFeatures");
  const summaryTimeline = document.getElementById("summaryTimeline");
  const enquireCalcBtn = document.getElementById("enquireCalcBtn");

  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateEstimate = () => {
    // 1. Base Price
    const selectedType = websiteTypeSelect.value || "business";
    const basePrice = BASE_PRICES[selectedType] || BASE_PRICES.business;

    // 2. Page multiplier
    let selectedPages = "1-5";
    pageRadios.forEach(radio => {
      if (radio.checked) selectedPages = radio.value;
    });
    const pageMultiplier = PAGE_MULTIPLIERS[selectedPages] || 1.0;

    // 3. Add-on Features total
    let featuresTotal = 0;
    let selectedFeatureCount = 0;
    const selectedFeatureNames = [];

    featureCheckboxes.forEach(cb => {
      if (cb.checked) {
        featuresTotal += FEATURE_PRICES[cb.value] || 0;
        selectedFeatureCount++;
        selectedFeatureNames.push(cb.getAttribute("data-feature-name") || cb.value);
      }
    });

    // 4. Style multiplier
    let selectedStyle = "modern";
    styleRadios.forEach(radio => {
      if (radio.checked) selectedStyle = radio.value;
    });
    const styleMultiplier = STYLE_MULTIPLIERS[selectedStyle] || 1.0;

    // 5. Timeline multiplier
    let selectedTimeline = "standard";
    timelineRadios.forEach(radio => {
      if (radio.checked) selectedTimeline = radio.value;
    });
    const timelineMultiplier = TIMELINE_MULTIPLIERS[selectedTimeline] || 1.0;

    // Subtotal calculation
    const rawTotal = (basePrice * pageMultiplier + featuresTotal) * styleMultiplier * timelineMultiplier;

    // Range calculation: Min -8%, Max +12% rounded to nearest 500
    const minEstimate = Math.round((rawTotal * 0.92) / 500) * 500;
    const maxEstimate = Math.round((rawTotal * 1.15) / 500) * 500;

    // Update Output
    if (displayPriceRange) {
      displayPriceRange.textContent = `${formatINR(minEstimate)} – ${formatINR(maxEstimate)}`;
    }

    if (summaryType) {
      summaryType.textContent = websiteTypeSelect.options[websiteTypeSelect.selectedIndex].text.split("(")[0].trim();
    }
    if (summaryPages) {
      summaryPages.textContent = `${selectedPages} Pages`;
    }
    if (summaryFeatures) {
      summaryFeatures.textContent = `${selectedFeatureCount} Selected (+${formatINR(featuresTotal)})`;
    }
    if (summaryTimeline) {
      summaryTimeline.textContent = selectedTimeline === "fast" ? "Fast Track (7-10 Days)" : "Standard (15-20 Days)";
    }

    // Attach calculated data for quick modal pre-fill
    calcForm.dataset.estimatedRange = `${formatINR(minEstimate)} – ${formatINR(maxEstimate)}`;
    calcForm.dataset.selectedType = summaryType ? summaryType.textContent : selectedType;
    calcForm.dataset.features = selectedFeatureNames.join(", ") || "Standard Package";
    calcForm.dataset.timeline = selectedTimeline === "fast" ? "Fast Track (7-10 Days)" : "Standard (15-20 Days)";
  };

  // Add event listeners to all calculator inputs
  websiteTypeSelect.addEventListener("change", calculateEstimate);
  pageRadios.forEach(r => r.addEventListener("change", calculateEstimate));
  featureCheckboxes.forEach(cb => cb.addEventListener("change", calculateEstimate));
  styleRadios.forEach(r => r.addEventListener("change", calculateEstimate));
  timelineRadios.forEach(r => r.addEventListener("change", calculateEstimate));

  // Initial calculation
  calculateEstimate();

  // "Enquire About This Quote" CTA Button handler
  if (enquireCalcBtn) {
    enquireCalcBtn.addEventListener("click", () => {
      const type = calcForm.dataset.selectedType || "Custom Website";
      const range = calcForm.dataset.estimatedRange || "Quote";
      const timeline = calcForm.dataset.timeline || "Standard";
      const features = calcForm.dataset.features || "All selected features";

      openEnquiryModal({
        packageName: `Calculator Quote: ${type} (${range})`,
        timeline: timeline,
        notes: `Selected Features: ${features}`
      });
    });
  }
}

/* ----------------------------------------------------------------------------
   6. PORTFOLIO CATEGORY FILTERING
   ---------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll(".portfolio-filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  if (!filterButtons.length || !portfolioCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("active");
        b.classList.remove("btn-gold");
        b.classList.add("btn-secondary");
      });
      btn.classList.add("active");
      btn.classList.add("btn-gold");
      btn.classList.remove("btn-secondary");

      const category = btn.getAttribute("data-filter");

      portfolioCards.forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "flex";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });
}

/* ----------------------------------------------------------------------------
   6.5 BLOG CATEGORY FILTERING
   ---------------------------------------------------------------------------- */
function setBlogCategoryFilter(category) {
  const filterButtons = document.querySelectorAll(".blog-filter-btn");
  const blogCards = document.querySelectorAll(".blog-card");

  filterButtons.forEach(btn => {
    if (btn.getAttribute("data-blog-filter") === category) {
      btn.classList.add("active", "btn-gold");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.remove("active", "btn-gold");
      btn.classList.add("btn-secondary");
    }
  });

  blogCards.forEach(card => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "flex";
      setTimeout(() => {
        card.style.opacity = "1";
      }, 30);
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
    }
  });
}

function initBlogFilters() {
  const filterButtons = document.querySelectorAll(".blog-filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-blog-filter") || "all";
      setBlogCategoryFilter(category);
    });
  });
}

/* ----------------------------------------------------------------------------
   7. ENQUIRY MODAL HANDLER WITH DIRECT WHATSAPP FORWARDING
   ---------------------------------------------------------------------------- */
let modalInstance = null;

function initEnquiryModal() {
  const modalBackdrop = document.getElementById("enquiryModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalForm = document.getElementById("enquiryModalForm");
  const openButtons = document.querySelectorAll("[data-open-modal]");

  if (!modalBackdrop) return;
  modalInstance = modalBackdrop;

  openButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const packageName = btn.getAttribute("data-package-name") || 
                         btn.getAttribute("data-service-name") || 
                         "Website Consultation";
      openEnquiryModal({ packageName });
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeEnquiryModal);
  }

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeEnquiryModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
      closeEnquiryModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener("submit", handleFormSubmission);
  }
}

function openEnquiryModal(options = {}) {
  if (!modalInstance) return;

  const packageInput = document.getElementById("client_package");
  const timelineSelect = document.getElementById("client_timeline");
  const notesTextarea = document.getElementById("client_notes");

  if (packageInput && options.packageName) {
    packageInput.value = options.packageName;
  }
  if (timelineSelect && options.timeline) {
    timelineSelect.value = options.timeline;
  }
  if (notesTextarea && options.notes) {
    notesTextarea.value = options.notes;
  }

  modalInstance.classList.add("active");
  document.body.style.overflow = "hidden";

  const firstInput = modalInstance.querySelector("input[name='client_name']");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 150);
  }
}

function closeEnquiryModal() {
  if (!modalInstance) return;
  modalInstance.classList.remove("active");
  document.body.style.overflow = "";
}

function handleFormSubmission(e) {
  e.preventDefault();

  const name = document.getElementById("client_name")?.value.trim() || "";
  const phone = document.getElementById("client_phone")?.value.trim() || "";
  const businessType = document.getElementById("client_business_type")?.value.trim() || "Local Business";
  const packageName = document.getElementById("client_package")?.value.trim() || "Custom Inquiry";
  const timeline = document.getElementById("client_timeline")?.value || "Standard (15-20 Days)";
  const notes = document.getElementById("client_notes")?.value.trim() || "N/A";

  if (!name || !phone) {
    alert("Please enter your name and phone number so we can reach you.");
    return;
  }

  // Construct structured WhatsApp booking message
  const waMessage = 
    `*NEW WEBSITE INQUIRY - WEBORA*\n` +
    `--------------------------------\n` +
    `👤 *Client Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🏢 *Business Type:* ${businessType}\n` +
    `📦 *Interested In:* ${packageName}\n` +
    `⏱️ *Timeline:* ${timeline}\n` +
    `📝 *Notes/Requirements:* ${notes}\n` +
    `--------------------------------\n` +
    `_Sent via Webora Website Lead Engine_`;

  const waUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  // Provide immediate UI feedback
  const feedbackBox = document.getElementById("modalStatusFeedback");
  if (feedbackBox) {
    feedbackBox.style.display = "block";
    feedbackBox.textContent = "Redirecting you to WhatsApp to connect directly with Balu Kandekar...";
  }

  setTimeout(() => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
    closeEnquiryModal();
    if (feedbackBox) feedbackBox.style.display = "none";
    e.target.reset();
  }, 700);
}

/* ----------------------------------------------------------------------------
   8. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
   ---------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not(.nav-dropdown-trigger):not(.dropdown-link)').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        if (targetElement.classList.contains("blog-card")) {
          const cardCat = targetElement.getAttribute("data-category");
          if (cardCat) {
            setBlogCategoryFilter(cardCat);
          }
        }

        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}


/* ----------------------------------------------------------------------------
   9. BLOG FULL ARTICLE MODAL + TOC
   ---------------------------------------------------------------------------- */
const BLOG_POSTS = {
  1: {
    title: "How Local Businesses Get More WhatsApp Enquiries with a Simple Website",
    category: "More Customers Online",
    date: "18 August 2026",
    dateISO: "2026-08-18",
    readTime: "5 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p1-why">Why WhatsApp Enquiries Matter</a></li>
          <li><a href="#p1-how">How a Website Increases WhatsApp Messages</a></li>
          <li><a href="#p1-tips">Simple Tips That Work</a></li>
          <li><a href="#p1-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p1-why">Why WhatsApp Enquiries Matter</h3>
      <p>Most customers in Maharashtra now prefer sending a WhatsApp message instead of calling. They feel it is easier and less pressure. If your website does not have a clear WhatsApp button, you are losing many potential customers every day.</p>
      <h3 id="p1-how">How a Website Increases WhatsApp Messages</h3>
      <p>When a person searches for your service on Google and opens your website, the first thing they look for is an easy way to contact you. A big, visible WhatsApp button on every page makes it very simple for them to start a chat.</p>
      <h3 id="p1-tips">Simple Tips That Work</h3>
      <ul>
        <li>Put WhatsApp button on Home page, Service pages and Contact page</li>
        <li>Use a short pre-filled message (example: "Hi, I want to know about your services")</li>
        <li>Make the button sticky on mobile so it is always visible</li>
        <li>Reply quickly — speed of reply increases trust</li>
      </ul>
      <div class="blog-key-takeaways" id="p1-takeaway">
        <h3>Key Takeaway</h3>
        <p>A clean website + clear WhatsApp button is one of the fastest ways for local businesses to get more daily enquiries without spending extra on ads.</p>
      </div>
    `
  },
  2: {
    title: "Why Your Website Is Not Getting Calls (And How to Fix It Fast)",
    category: "More Customers Online",
    date: "10 August 2026",
    dateISO: "2026-08-10",
    readTime: "6 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p2-reasons">Main Reasons Visitors Don't Call</a></li>
          <li><a href="#p2-fix">What You Can Fix Quickly</a></li>
          <li><a href="#p2-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p2-reasons">Main Reasons Visitors Don't Call</h3>
      <ul>
        <li>Phone number is not clearly visible</li>
        <li>Website is very slow on mobile</li>
        <li>No clear "Call Now" or WhatsApp button</li>
        <li>Visitor does not trust the business yet</li>
        <li>Important information (price, services, location) is missing</li>
      </ul>
      <h3 id="p2-fix">What You Can Fix Quickly</h3>
      <p>Make your phone number and WhatsApp button large and visible on every page. Add real photos of your work, Google reviews, and exact location. Make sure the website opens fast on mobile.</p>
      <div class="blog-key-takeaways" id="p2-takeaway">
        <h3>Key Takeaway</h3>
        <p>Most websites lose customers because of small, avoidable mistakes. Fixing these simple things often increases calls within a few days.</p>
      </div>
    `
  },
  3: {
    title: "Coaching Institute Website That Brings More Student Admissions",
    category: "Industry Spotlights",
    date: "05 August 2026",
    dateISO: "2026-08-05",
    readTime: "6 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p3-need">What Parents and Students Look For</a></li>
          <li><a href="#p3-pages">Important Pages for Coaching Websites</a></li>
          <li><a href="#p3-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p3-need">What Parents and Students Look For</h3>
      <p>Before taking admission, parents check course details, faculty experience, past results and fee information. If this information is not available clearly on a website, they move to another coaching class.</p>
      <h3 id="p3-pages">Important Pages for Coaching Websites</h3>
      <ul>
        <li>Courses / Batches page</li>
        <li>Faculty profiles</li>
        <li>Results & Toppers</li>
        <li>Fee enquiry form</li>
        <li>WhatsApp admission button</li>
        <li>Google Maps location</li>
      </ul>
      <div class="blog-key-takeaways" id="p3-takeaway">
        <h3>Key Takeaway</h3>
        <p>A coaching website that answers all common questions of parents brings more serious admission enquiries and reduces time spent on repeated phone calls.</p>
      </div>
    `
  },
  4: {
    title: "Beauty Parlour & Salon Website Ideas That Get More Appointments",
    category: "Industry Spotlights",
    date: "28 July 2026",
    dateISO: "2026-07-28",
    readTime: "5 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p4-why">Why Salons Need Their Own Website</a></li>
          <li><a href="#p4-features">Features That Bring Appointments</a></li>
          <li><a href="#p4-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p4-why">Why Salons Need Their Own Website</h3>
      <p>Depending only on Instagram is risky. Algorithm changes and you don't own your customer data. A simple website gives you direct bookings and repeat customers.</p>
      <h3 id="p4-features">Features That Bring Appointments</h3>
      <ul>
        <li>Service list with prices</li>
        <li>WhatsApp booking button</li>
        <li>Before-after photos</li>
        <li>Google Maps and reviews</li>
        <li>Easy mobile design</li>
      </ul>
      <div class="blog-key-takeaways" id="p4-takeaway">
        <h3>Key Takeaway</h3>
        <p>Even a basic 5-page website can start bringing direct appointment messages if WhatsApp and services are clearly shown.</p>
      </div>
    `
  },
  5: {
    title: "Why Every Local Business Website Needs a WhatsApp Button",
    category: "Website Basics",
    date: "20 July 2026",
    dateISO: "2026-07-20",
    readTime: "4 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p5-why">Why Customers Prefer WhatsApp</a></li>
          <li><a href="#p5-how">How to Add It Properly</a></li>
          <li><a href="#p5-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p5-why">Why Customers Prefer WhatsApp</h3>
      <p>Calling feels formal to many people. WhatsApp feels easy and safe. Most local customers now first send a message to ask price or availability.</p>
      <h3 id="p5-how">How to Add It Properly</h3>
      <ul>
        <li>Make the button big and easy to see on mobile</li>
        <li>Keep it on all important pages</li>
        <li>Use a pre-filled message so customer does not have to type</li>
        <li>Reply as fast as possible</li>
      </ul>
      <div class="blog-key-takeaways" id="p5-takeaway">
        <h3>Key Takeaway</h3>
        <p>A WhatsApp button is one of the cheapest and highest converting features you can add to any local business website.</p>
      </div>
    `
  },
  6: {
    title: "Google Maps on Your Website — Simple Way to Get More Walk-ins",
    category: "Website Basics",
    date: "12 July 2026",
    dateISO: "2026-07-12",
    readTime: "4 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p6-why">Why Location Matters</a></li>
          <li><a href="#p6-how">How to Show It Correctly</a></li>
          <li><a href="#p6-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p6-why">Why Location Matters</h3>
      <p>Many customers decide to visit only after they see the exact location and how easy it is to reach. If the map is missing or wrong, they choose another business.</p>
      <h3 id="p6-how">How to Show It Correctly</h3>
      <ul>
        <li>Embed Google Map on Contact page</li>
        <li>Write full address clearly</li>
        <li>Make sure Name, Address, Phone is same as Google Business Profile</li>
        <li>Add a "Get Directions" button</li>
      </ul>
      <div class="blog-key-takeaways" id="p6-takeaway">
        <h3>Key Takeaway</h3>
        <p>Correct Google Maps on website + Google Business Profile together help more people walk into your shop or office.</p>
      </div>
    `
  },
  7: {
    title: "How a Coaching Class in Kolhapur Got 40+ Admission Enquiries in 30 Days",
    category: "Client Success Stories",
    date: "22 August 2026",
    dateISO: "2026-08-22",
    readTime: "5 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p7-before">The Situation Before</a></li>
          <li><a href="#p7-what">What We Changed</a></li>
          <li><a href="#p7-result">The Result</a></li>
          <li><a href="#p7-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p7-before">The Situation Before</h3>
      <p>A coaching institute in Kolhapur was getting most enquiries only through word of mouth and some Instagram posts. They had no proper website.</p>
      <h3 id="p7-what">What We Changed</h3>
      <p>We made a clean website with course pages, faculty section, results, and a strong WhatsApp admission button on every page. The site was made fast for mobile.</p>
      <h3 id="p7-result">The Result</h3>
      <p>Within the first 30 days they started receiving regular WhatsApp messages and calls from parents who found them on Google. More than 40 serious admission enquiries came directly from the website.</p>
      <div class="blog-key-takeaways" id="p7-takeaway">
        <h3>Key Takeaway</h3>
        <p>When information is clear and contact is easy, parents take action. A simple website can become a steady source of admission enquiries.</p>
      </div>
    `
  },
  8: {
    title: "Clinic Website That Started Getting Online Appointments Within 2 Weeks",
    category: "Client Success Stories",
    date: "08 August 2026",
    dateISO: "2026-08-08",
    readTime: "5 min read",
    content: `
      <div class="blog-toc">
        <div class="blog-toc-title">Table of Contents</div>
        <ol>
          <li><a href="#p8-before">Before the Website</a></li>
          <li><a href="#p8-changes">What Was Improved</a></li>
          <li><a href="#p8-result">What Happened After</a></li>
          <li><a href="#p8-takeaway">Key Takeaway</a></li>
        </ol>
      </div>
      <h3 id="p8-before">Before the Website</h3>
      <p>The clinic had an old website that was slow on mobile and had no clear appointment option. Most patients still called only if someone referred them.</p>
      <h3 id="p8-changes">What Was Improved</h3>
      <ul>
        <li>Fast mobile-friendly design</li>
        <li>Clear Call and WhatsApp buttons</li>
        <li>Simple appointment enquiry form</li>
        <li>Google Maps and reviews section</li>
      </ul>
      <h3 id="p8-result">What Happened After</h3>
      <p>Within two weeks the clinic started receiving appointment messages directly from the website. Patients said it was easy to find timings and contact details.</p>
      <div class="blog-key-takeaways" id="p8-takeaway">
        <h3>Key Takeaway</h3>
        <p>When a clinic website is fast and makes booking easy, patients prefer it over calling multiple times.</p>
      </div>
    `
  }
};

function initBlogArticleModal() {
  const modal = document.getElementById("blogModal");
  const modalContent = document.getElementById("blogModalContent");
  const closeBtn = document.getElementById("blogModalClose");
  if (!modal || !modalContent) return;

  document.querySelectorAll("[data-blog]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-blog");
      const post = BLOG_POSTS[id];
      if (!post) return;

      modalContent.innerHTML = `
        <div class="blog-modal-body">
          <span class="blog-category-badge">${post.category}</span>
          <h2 id="blogModalTitle">${post.title}</h2>
          <div class="blog-modal-meta">
            <time datetime="${post.dateISO}">${post.date}</time> • ${post.readTime}
          </div>
          ${post.content}
          <div class="blog-modal-cta">
            <button type="button" class="btn btn-gold" data-open-modal data-package-name="Blog: ${post.title}">Get Free Quote</button>
          </div>
        </div>
      `;

      // TOC smooth scroll inside modal
      modalContent.querySelectorAll(".blog-toc a").forEach(link => {
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const target = modalContent.querySelector("#" + targetId);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      // Re-bind Get Free Quote inside modal
      modalContent.querySelectorAll("[data-open-modal]").forEach(b => {
        b.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeBlogModal();
          const pkg = b.getAttribute("data-package-name") || "Website Consultation";
          if (typeof openEnquiryModal === "function") {
            openEnquiryModal({ packageName: pkg });
          }
        });
      });

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeBlogModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeBlogModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeBlogModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeBlogModal();
  });
}

