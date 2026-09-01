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
  initStatsCounter();
  initCostCalculator();
  initPortfolioFilters();
  initEnquiryModal();
  initSmoothScroll();
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
   3. MOBILE NAVIGATION MENU TOGGLE
   ---------------------------------------------------------------------------- */
function initMobileNavigation() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
    document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
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
