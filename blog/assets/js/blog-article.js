document.addEventListener("DOMContentLoaded", () => {
    // 1. Gestion du menu burger sur mobile
    const burgerBtn = document.getElementById("burgerBtn");
    const mainNav = document.getElementById("mainNav");

    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener("click", () => {
            const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
            burgerBtn.setAttribute("aria-expanded", String(!isExpanded));
            mainNav.classList.toggle("is-open");
        });

        // Fermer le menu au clic sur un lien mobile
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                burgerBtn.setAttribute("aria-expanded", "false");
                mainNav.classList.remove("is-open");
            });
        });
    }

    // 2. Barre de progression de lecture en haut de page
    const progressBar = document.getElementById("readingProgress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }, { passive: true });
    }
});
