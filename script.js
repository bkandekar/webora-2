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
  whatsapp: "918329931123", // Country code 91 + phone number without + or spaces
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
  initBlogSearch();
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
  const searchInput = document.getElementById("blogSearchInput");
  const noResultsMsg = document.getElementById("blogNoResultsMsg");
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  filterButtons.forEach(btn => {
    if (btn.getAttribute("data-blog-filter") === category) {
      btn.classList.add("active", "btn-gold");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.remove("active", "btn-gold");
      btn.classList.add("btn-secondary");
    }
  });

  // Combines the active category with the current search term so both
  // filters (dropdown/tabs + search box) always work together correctly.
  let visibleCount = 0;
  blogCards.forEach(card => {
    const cardCategory = card.getAttribute("data-category");
    const matchesCategory = category === "all" || cardCategory === category;
    const matchesSearch = !searchTerm || card.textContent.toLowerCase().includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;

    if (isVisible) {
      card.style.display = "flex";
      setTimeout(() => {
        card.style.opacity = "1";
      }, 30);
      visibleCount++;
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
    }
  });

  if (noResultsMsg) {
    noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
  }
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
   6.6 BLOG SEARCH BOX
   Filters blog cards by title/excerpt/category text, combined with
   whichever category filter is currently active.
   ---------------------------------------------------------------------------- */
function initBlogSearch() {
  const searchInput = document.getElementById("blogSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const activeBtn = document.querySelector(".blog-filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-blog-filter") : "all";
    setBlogCategoryFilter(activeCategory);
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
   9. FULL BLOG ARTICLE MODAL + POSTS CONTENT
   ---------------------------------------------------------------------------- */
const BLOG_POSTS = {
  1: {
    title: "How Local Businesses Get More WhatsApp Enquiries with a Simple Website",
    category: "More Customers Online",
    date: "18 August 2026",
    dateISO: "2026-08-18",
    readTime: "5 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p1-why">Why WhatsApp Enquiries Matter</a></li>
        <li><a href="#p1-how">How a Website Increases WhatsApp Messages</a></li>
        <li><a href="#p1-tips">Simple Tips That Work</a></li>
        <li><a href="#p1-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p1-why">Why WhatsApp Enquiries Matter</h3>
      <p>Most customers in Maharashtra now prefer sending a WhatsApp message instead of calling. If your website does not have a clear WhatsApp button, you are losing many potential customers every day.</p>
      <h3 id="p1-how">How a Website Increases WhatsApp Messages</h3>
      <p>When someone opens your website, the first thing they look for is an easy way to contact you. A big, visible WhatsApp button on every page makes it simple to start a chat.</p>
      <h3 id="p1-tips">Simple Tips That Work</h3>
      <ul>
        <li>Put WhatsApp button on Home, Service and Contact pages</li>
        <li>Use a pre-filled message</li>
        <li>Make the button sticky on mobile</li>
        <li>Reply quickly</li>
      </ul>
      <div class="blog-key-takeaways" id="p1-takeaway"><h3>Key Takeaway</h3>
      <p>A clean website + clear WhatsApp button is one of the fastest ways to get more daily enquiries.</p></div>`
  },
  2: {
    title: "Why Your Website Is Not Getting Calls (And How to Fix It Fast)",
    category: "More Customers Online",
    date: "10 August 2026",
    dateISO: "2026-08-10",
    readTime: "6 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p2-reasons">Main Reasons Visitors Don't Call</a></li>
        <li><a href="#p2-fix">What You Can Fix Quickly</a></li>
        <li><a href="#p2-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p2-reasons">Main Reasons Visitors Don't Call</h3>
      <ul>
        <li>Phone number is not clearly visible</li>
        <li>Website is slow on mobile</li>
        <li>No clear Call Now or WhatsApp button</li>
        <li>Missing price, services or location</li>
      </ul>
      <h3 id="p2-fix">What You Can Fix Quickly</h3>
      <p>Make phone and WhatsApp large and visible. Add real photos, Google reviews and exact location. Ensure fast mobile loading.</p>
      <div class="blog-key-takeaways" id="p2-takeaway"><h3>Key Takeaway</h3>
      <p>Small fixes often increase calls within a few days.</p></div>`
  },
  3: {
    title: "Coaching Institute Website That Brings More Student Admissions",
    category: "Industry Spotlights",
    date: "05 August 2026",
    dateISO: "2026-08-05",
    readTime: "6 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p3-need">What Parents Look For</a></li>
        <li><a href="#p3-pages">Important Pages</a></li>
        <li><a href="#p3-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p3-need">What Parents Look For</h3>
      <p>Parents check course details, faculty, results and fees before calling. If this is missing on a website, they contact another coaching class.</p>
      <h3 id="p3-pages">Important Pages</h3>
      <ul>
        <li>Courses / Batches</li>
        <li>Faculty profiles</li>
        <li>Results & Toppers</li>
        <li>Fee enquiry form</li>
        <li>WhatsApp admission button</li>
        <li>Google Maps</li>
      </ul>
      <div class="blog-key-takeaways" id="p3-takeaway"><h3>Key Takeaway</h3>
      <p>A clear coaching website brings more serious admission enquiries.</p></div>`
  },
  4: {
    title: "Beauty Parlour & Salon Website Ideas That Get More Appointments",
    category: "Industry Spotlights",
    date: "28 July 2026",
    dateISO: "2026-07-28",
    readTime: "5 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p4-why">Why Salons Need a Website</a></li>
        <li><a href="#p4-features">Features That Bring Appointments</a></li>
        <li><a href="#p4-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p4-why">Why Salons Need a Website</h3>
      <p>Depending only on Instagram is risky. A simple website gives direct bookings and your own customer list.</p>
      <h3 id="p4-features">Features That Bring Appointments</h3>
      <ul>
        <li>Service list with prices</li>
        <li>WhatsApp booking button</li>
        <li>Before-after photos</li>
        <li>Google Maps and reviews</li>
        <li>Mobile-friendly design</li>
      </ul>
      <div class="blog-key-takeaways" id="p4-takeaway"><h3>Key Takeaway</h3>
      <p>Even a basic 5-page website can bring direct appointment messages.</p></div>`
  },
  5: {
    title: "Why Every Local Business Website Needs a WhatsApp Button",
    category: "Website Basics",
    date: "20 July 2026",
    dateISO: "2026-07-20",
    readTime: "4 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p5-why">Why Customers Prefer WhatsApp</a></li>
        <li><a href="#p5-how">How to Add It Properly</a></li>
        <li><a href="#p5-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p5-why">Why Customers Prefer WhatsApp</h3>
      <p>Calling feels formal. WhatsApp feels easy. Most local customers first send a message to ask price or availability.</p>
      <h3 id="p5-how">How to Add It Properly</h3>
      <ul>
        <li>Big button on mobile</li>
        <li>On all important pages</li>
        <li>Pre-filled message</li>
        <li>Fast replies</li>
      </ul>
      <div class="blog-key-takeaways" id="p5-takeaway"><h3>Key Takeaway</h3>
      <p>WhatsApp button is one of the highest converting features for local business websites.</p></div>`
  },
  6: {
    title: "Google Maps on Your Website — Simple Way to Get More Walk-ins",
    category: "Website Basics",
    date: "12 July 2026",
    dateISO: "2026-07-12",
    readTime: "4 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p6-why">Why Location Matters</a></li>
        <li><a href="#p6-how">How to Show It Correctly</a></li>
        <li><a href="#p6-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p6-why">Why Location Matters</h3>
      <p>Many customers visit only after they see exact location. If the map is missing, they choose another business.</p>
      <h3 id="p6-how">How to Show It Correctly</h3>
      <ul>
        <li>Embed Google Map on Contact page</li>
        <li>Write full address</li>
        <li>Same Name, Address, Phone as Google Business Profile</li>
        <li>Add Get Directions button</li>
      </ul>
      <div class="blog-key-takeaways" id="p6-takeaway"><h3>Key Takeaway</h3>
      <p>Correct Maps on website + Google Business Profile helps more walk-ins.</p></div>`
  },
  7: {
    title: "How a Coaching Class in Kolhapur Got 40+ Admission Enquiries in 30 Days",
    category: "Client Success Stories",
    date: "22 August 2026",
    dateISO: "2026-08-22",
    readTime: "5 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p7-before">Before</a></li>
        <li><a href="#p7-what">What Changed</a></li>
        <li><a href="#p7-result">Result</a></li>
        <li><a href="#p7-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p7-before">Before</h3>
      <p>A coaching institute in Kolhapur got enquiries only through word of mouth and Instagram. No proper website.</p>
      <h3 id="p7-what">What Changed</h3>
      <p>Clean website with course pages, faculty, results and WhatsApp admission button. Fast on mobile.</p>
      <h3 id="p7-result">Result</h3>
      <p>In 30 days, more than 40 serious admission enquiries came directly from the website.</p>
      <div class="blog-key-takeaways" id="p7-takeaway"><h3>Key Takeaway</h3>
      <p>Clear information + easy contact = more admissions.</p></div>`
  },
  8: {
    title: "Clinic Website That Started Getting Online Appointments Within 2 Weeks",
    category: "Client Success Stories",
    date: "08 August 2026",
    dateISO: "2026-08-08",
    readTime: "5 min read",
    content: `
      <div class="blog-toc"><div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p8-before">Before</a></li>
        <li><a href="#p8-changes">What Improved</a></li>
        <li><a href="#p8-result">After</a></li>
        <li><a href="#p8-takeaway">Key Takeaway</a></li>
      </ol></div>
      <h3 id="p8-before">Before</h3>
      <p>Old slow website, no clear appointment option. Patients called only through referrals.</p>
      <h3 id="p8-changes">What Improved</h3>
      <ul>
        <li>Fast mobile design</li>
        <li>Call and WhatsApp buttons</li>
        <li>Appointment form</li>
        <li>Google Maps and reviews</li>
      </ul>
      <h3 id="p8-result">After</h3>
      <p>Within 2 weeks, appointment messages started coming directly from the website.</p>
      <div class="blog-key-takeaways" id="p8-takeaway"><h3>Key Takeaway</h3>
      <p>Fast website + easy booking = more online appointments.</p></div>`
  },
   
9: {
  title: "How Local Businesses in Maharashtra Can Double WhatsApp Enquiries in 30 Days",
  category: "More Customers Online",
  date: "03 September 2026",
  dateISO: "2026-09-03",
  readTime: "8 min read",
  content: `
    <div class="blog-toc">
      <div class="blog-toc-title">Table of Contents</div>
      <ol>
        <li><a href="#p9-why">Why WhatsApp Enquiries Matter for Local Businesses</a></li>
        <li><a href="#p9-problem">Why Most Websites Fail to Get Messages</a></li>
        <li><a href="#p9-fix">7 Practical Fixes That Increase Enquiries</a></li>
        <li><a href="#p9-timeline">30-Day Action Plan</a></li>
        <li><a href="#p9-mistakes">Common Mistakes to Avoid</a></li>
        <li><a href="#p9-takeaway">Key Takeaway</a></li>
      </ol>
    </div>

    <h3 id="p9-why">Why WhatsApp Enquiries Matter for Local Businesses</h3>
   <p><img src="images/blog-9-inside.webp" alt="WhatsApp button on website" style="width:100%;border-radius:12px;margin:1rem 0;" loading="lazy"></p>
    <p>In cities like Kolhapur, Pune, Sangli and Satara, most customers no longer prefer to call first. They open a website, look for a clear way to contact the business, and send a WhatsApp message. This feels easier, faster and less formal than a phone call.</p>
    <p>For coaching institutes, clinics, beauty parlours, restaurants and local shops, WhatsApp has become the main enquiry channel. If your website does not make it simple to start a chat, many serious buyers leave without contacting you. A clean website with a strong WhatsApp system can easily increase daily enquiries within a few weeks.</p>
    <p>Businesses that treat WhatsApp as their primary lead channel usually reply faster, convert more visitors and build better customer relationships. The goal is not just traffic. The goal is messages from real people who need your service.</p>

    <h3 id="p9-problem">Why Most Websites Fail to Get Messages</h3>
    <p>Many local business websites look fine on desktop but fail on mobile. The phone number is small, the WhatsApp button is missing, or it is buried at the bottom of the page. Visitors get confused and leave.</p>
    <p>Other common problems include:</p>
    <ul>
      <li>No pre-filled message, so the customer does not know what to write</li>
      <li>Slow loading on mobile (3–6 seconds), which makes people leave before they can contact you</li>
      <li>Generic “Contact Us” forms that ask for too much information</li>
      <li>No clear service or price information, so the visitor is not ready to message</li>
      <li>WhatsApp number not linked correctly, or opening the wrong chat</li>
    </ul>
    <p>When these issues are fixed together, enquiry volume usually rises quickly because the path from “interest” to “message” becomes short and clear.</p>

    <h3 id="p9-fix">7 Practical Fixes That Increase Enquiries</h3>
    <p><strong>1. Put a visible WhatsApp button on every important page</strong><br>
    Home, Services, Pricing and Contact pages should all have a clear WhatsApp button. On mobile, a sticky button at the bottom works especially well.</p>
    <p><strong>2. Use a pre-filled message</strong><br>
    When the customer taps the button, a ready message should appear, for example: “Hello, I saw your website and I want to know more about your services.” This removes hesitation and increases the chance they will send the message.</p>
    <p><strong>3. Make the button large and easy to tap</strong><br>
    Small icons are easy to miss. Use clear text like “Chat on WhatsApp” or “Get Free Quote on WhatsApp” so the action is obvious.</p>
    <p><strong>4. Speed up the mobile website</strong><br>
    If the page takes more than 2–3 seconds to load, many visitors leave. Compress images, remove heavy scripts and keep the design simple. Faster sites get more enquiries.</p>
    <p><strong>5. Show trust signals near the button</strong><br>
    Short lines such as “Reply within 30 minutes”, “50+ local clients” or “Free consultation” increase confidence before the person messages you.</p>
    <p><strong>6. Keep service and location information clear</strong><br>
    People message more when they already understand what you offer and where you are based. Clear service lists and Google Maps help.</p>
    <p><strong>7. Reply quickly and with a clear next step</strong><br>
    Getting the message is only half the work. Fast, polite replies with a simple next step (call time, visit, or quote) convert more enquiries into customers.</p>

    <h3 id="p9-timeline">30-Day Action Plan</h3>
    <p><strong>Week 1 – Fix the basics</strong><br>
    Add WhatsApp buttons on all main pages, set a pre-filled message, and check that the correct number opens. Test everything on a mobile phone.</p>
    <p><strong>Week 2 – Improve clarity and speed</strong><br>
    Update service descriptions, add location and maps, compress images and improve mobile loading speed. Make sure the homepage clearly explains what you do.</p>
    <p><strong>Week 3 – Add trust and proof</strong><br>
    Add a few real client results, Google reviews or simple before-after examples. Place them near the WhatsApp button so visitors feel safer messaging you.</p>
    <p><strong>Week 4 – Track and improve</strong><br>
    Note how many messages you receive each week. Check which pages bring more chats. Improve those pages further and remove confusion from weaker pages.</p>
    <p>Most local businesses that follow this plan see a clear rise in WhatsApp enquiries within 30 days, often without spending extra money on ads.</p>

    <h3 id="p9-mistakes">Common Mistakes to Avoid</h3>
    <ul>
      <li>Putting WhatsApp only on the Contact page</li>
      <li>Using a personal number that is not monitored during business hours</li>
      <li>Sending long, confusing first replies</li>
      <li>Ignoring mobile users (most local traffic is mobile)</li>
      <li>Expecting results without clear service information on the site</li>
    </ul>
    <p>Avoiding these mistakes keeps the system simple and effective.</p>

    <div class="blog-key-takeaways" id="p9-takeaway">
      <h3>Key Takeaway</h3>
      <p>A fast, clear website with a visible WhatsApp button and pre-filled message is one of the highest-return improvements a local business in Maharashtra can make. Focus on mobile, make contact easy, reply quickly, and track results for 30 days. Many businesses can double their WhatsApp enquiries with these practical changes alone.</p>
    </div>
  `
}
};

function initBlogArticleModal() {
  const modal = document.getElementById("blogModal");
  const modalContent = document.getElementById("blogModalContent");
  const closeBtn = document.getElementById("blogModalClose");
  if (!modal || !modalContent) {
    console.warn("Blog modal #blogModal not found in HTML");
    return;
  }

  document.querySelectorAll("[data-blog]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-blog");
      const post = BLOG_POSTS[id];
      if (!post) {
        console.warn("No blog post for id:", id);
        return;
      }

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
        </div>`;

      modalContent.querySelectorAll(".blog-toc a").forEach(link => {
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
          const target = modalContent.querySelector(link.getAttribute("href"));
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      modalContent.querySelectorAll("[data-open-modal]").forEach(b => {
        b.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeBlogModal();
          if (typeof openEnquiryModal === "function") {
            openEnquiryModal({ packageName: b.getAttribute("data-package-name") || "Website Consultation" });
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
