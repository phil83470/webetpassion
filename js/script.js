// =========================================================
// WEB & PASSION
// JAVASCRIPT — VERSION INTERACTIVE
// =========================================================

// =========================================================
// MENU MOBILE
// =========================================================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

function closeMobileMenu() {
  nav?.classList.remove("open");

  menuToggle?.setAttribute("aria-expanded", "false");

  menuToggle?.setAttribute("aria-label", "Ouvrir le menu");

  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  if (!nav) {
    return;
  }

  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu",
  );

  document.body.classList.toggle("menu-open", isOpen);
});

// Fermer le menu lorsqu'on clique
// sur un lien de navigation.

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// =========================================================
// NAVIGATION DIRECTE VERS LES ANCRAGES
// =========================================================
//
// Pas de scroll animé.
// Le navigateur va directement à la section demandée.
//

function getHeaderHeight() {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 84;
}

function smoothScrollToElement(target) {
  if (!target) return;
  const headerHeight = getHeaderHeight();
  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'instant',
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    try {
      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      if (targetId === '#accueil') {
        window.scrollTo({ top: 0, behavior: 'instant' });
        cleanAddressBar();
        return;
      }

      smoothScrollToElement(target);
      cleanAddressBar();
    } catch (err) {
      // Ignorer
    }
  });
});

function cleanAddressBar() {
  if (window.location.protocol === 'file:' || !window.history || !window.history.replaceState) {
    return;
  }
  const cleanPath = window.location.pathname.replace(/\/index\.html$/i, '/') || '/';
  window.history.replaceState(null, '', cleanPath + window.location.search);
}

// Réalignement précis lors de l'arrivée depuis une autre page
window.addEventListener('load', () => {
  if (window.location.hash) {
    try {
      const target = document.querySelector(window.location.hash);
      if (target) {
        smoothScrollToElement(target);
      }
    } catch (err) {}
  }
  cleanAddressBar();
});

// ANIMATIONS AU DÉFILEMENT
// =========================================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.01,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Solution de secours pour les navigateurs
  // ne supportant pas IntersectionObserver.

  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// =========================================================
// SERVICES INTERACTIFS
// =========================================================

const serviceCards = document.querySelectorAll(".service-card");

const serviceInfo = document.querySelector("#service-info");

const serviceInfoTitle = document.querySelector("#service-info-title");

const serviceInfoText = document.querySelector("#service-info-text");

const serviceClose = document.querySelector(".service-close");

const serviceDetails = {
  depannage: {
    title: "Assistance & dépannage",

    text: "Vous avez un problème avec votre site, un affichage incorrect, un formulaire qui ne fonctionne plus ou une petite modification à effectuer ? Nous pouvons regarder ensemble ce qui bloque et rechercher une solution adaptée.",
  },

  site: {
    title: "Site web",

    text: "Vous souhaitez améliorer un site existant ou créer une présence web plus claire ? Je peux vous accompagner sur la structure, les contenus, les petites modifications et l'organisation générale du site.",
  },

  seo: {
    title: "Référencement SEO",

    text: "Je peux vous aider à améliorer les bases du référencement : titres, contenus, structure des pages, organisation des informations et bonnes pratiques permettant aux moteurs de recherche de mieux comprendre votre site.",
  },

  ia: {
    title: "IA & outils numériques",

    text: "L'intelligence artificielle peut être utile pour rédiger, rechercher des idées, organiser certaines tâches ou gagner du temps. Je peux vous aider à découvrir ces outils et à les utiliser simplement.",
  },
};

function openService(serviceName) {
  const service = serviceDetails[serviceName];

  if (!service || !serviceInfo || !serviceInfoTitle || !serviceInfoText) {
    return;
  }

  serviceInfoTitle.textContent = service.title;

  serviceInfoText.textContent = service.text;

  serviceInfo.hidden = false;

  serviceInfo.scrollIntoView({
    behavior: "auto",
    block: "nearest",
  });
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const serviceName = card.dataset.service;

    openService(serviceName);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      const serviceName = card.dataset.service;

      openService(serviceName);
    }
  });
});

serviceClose?.addEventListener("click", () => {
  if (serviceInfo) {
    serviceInfo.hidden = true;
  }
});

// =========================================================
// DIAGNOSTIC INTERACTIF
// =========================================================

const diagnosticButtons = document.querySelectorAll(".diagnostic-option");

const diagnosticResult = document.querySelector("#diagnostic-result");

const diagnosticResultTitle = document.querySelector(
  "#diagnostic-result-title",
);

const diagnosticResultText = document.querySelector("#diagnostic-result-text");

const diagnosticDetails = {
  depannage: {
    title: "L'assistance & le dépannage",

    text: "Votre besoin semble correspondre à une recherche de problème ou à une réparation sur votre site.",
  },

  site: {
    title: "Le site web",

    text: "Votre besoin semble correspondre à l'amélioration, la création ou l'évolution d'un site web.",
  },

  seo: {
    title: "Le référencement SEO",

    text: "Votre besoin semble correspondre à un travail sur la visibilité et la compréhension de votre site par les moteurs de recherche.",
  },

  ia: {
    title: "L'IA & les outils numériques",

    text: "Votre besoin semble correspondre à la découverte ou à l'utilisation d'outils d'intelligence artificielle.",
  },
};

diagnosticButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const result = button.dataset.result;

    const details = diagnosticDetails[result];

    if (
      !details ||
      !diagnosticResult ||
      !diagnosticResultTitle ||
      !diagnosticResultText
    ) {
      return;
    }

    diagnosticResultTitle.textContent = details.title;

    diagnosticResultText.textContent = details.text;

    diagnosticResult.hidden = false;

    diagnosticButtons.forEach((item) => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");
  });
});

// =========================================================
// FORMULAIRE DE CONTACT
// =========================================================

const contactForm = document.querySelector("#contact-form");

const formSuccess = document.querySelector("#form-success");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name")?.value.trim();

  const email = document.querySelector("#email")?.value.trim();

  const subject = document.querySelector("#subject")?.value.trim();

  const message = document.querySelector("#message")?.value.trim();

  // Adresse de destination.

  const destination = "bonjour@webetpassion.fr";

  // Vérification simple.

  if (!name || !email || !message) {
    if (formSuccess) {
      formSuccess.textContent = "Merci de remplir les champs obligatoires.";
    }

    return;
  }

  // Vérification simple de l'email.

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailIsValid) {
    if (formSuccess) {
      formSuccess.textContent = "Merci de vérifier votre adresse email.";
    }

    return;
  }

  // Sujet du mail.

  const mailSubject = `Demande de contact - ${subject || "Web & Passion"}`;

  // Contenu du mail.

  const mailBody = `Bonjour Philippe,

Nom : ${name}
Email : ${email}

Sujet :
${subject || "Non précisé"}

Message :
${message}

Cordialement,
${name}`;

  // Création du lien mailto.

  const mailto =
    `mailto:${destination}` +
    `?subject=${encodeURIComponent(mailSubject)}` +
    `&body=${encodeURIComponent(mailBody)}`;

  // Message avant ouverture
  // du logiciel de messagerie.

  if (formSuccess) {
    formSuccess.textContent =
      "Votre logiciel de messagerie va s’ouvrir pour préparer l’email.";
  }

  // Ouverture du logiciel de messagerie.

  window.location.href = mailto;
});

// =========================================================
// ANNÉE AUTOMATIQUE
// =========================================================

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// =========================================================
// FERMETURE DU MENU AVEC LA TOUCHE ÉCHAP
// =========================================================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// =========================================================
// CARROUSEL DE PROFIL (SECTION À PROPOS)
// =========================================================

(function initProfileCarousel() {
  const carousel = document.querySelector("#profile-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));
  const photoItems = Array.from(document.querySelectorAll(".about-photo-item"));
  const counter = document.querySelector("#carousel-counter");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  const intervalMs = 4800;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    photoItems.forEach((item, idx) => {
      const isActive = idx === currentIndex;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    autoTimer = setInterval(nextSlide, intervalMs);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIndex = Number(dot.dataset.slide);
      if (!Number.isNaN(targetIndex)) {
        showSlide(targetIndex);
        startAutoPlay();
      }
    });
  });

  photoItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetIndex = Number(item.dataset.slide);
      if (!Number.isNaN(targetIndex)) {
        showSlide(targetIndex);
        startAutoPlay();
      }
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const targetIndex = Number(item.dataset.slide);
        if (!Number.isNaN(targetIndex)) {
          showSlide(targetIndex);
          startAutoPlay();
        }
      }
    });
  });

  // Pause au survol (souris uniquement) ou au focus clavier
  const screenContainer = carousel.closest(".about-screen") || carousel;
  if (window.matchMedia("(hover: hover)").matches) {
    screenContainer.addEventListener("mouseenter", stopAutoPlay);
    screenContainer.addEventListener("mouseleave", startAutoPlay);
  }
  screenContainer.addEventListener("focusin", stopAutoPlay);
  screenContainer.addEventListener("focusout", startAutoPlay);

  // Navigation clavier (flèches gauche / droite)
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevSlide();
      startAutoPlay();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
      startAutoPlay();
    }
  });

  // Balayage tactile (swipe) sur mobile et tablette
  let touchStartX = 0;
  let touchStartY = 0;

  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
      touchStartY = event.changedTouches[0].screenY;
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const touchEndY = event.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoPlay();
      }
    },
    { passive: true },
  );

  startAutoPlay();
})();

