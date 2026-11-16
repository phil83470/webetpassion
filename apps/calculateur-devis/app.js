document.addEventListener("DOMContentLoaded", function () {
    // 1. Gestion du menu Burger sur mobile
    const burgerBtn = document.getElementById("burgerBtn");
    const appNav = document.getElementById("appNav");

    if (burgerBtn && appNav) {
        burgerBtn.addEventListener("click", function () {
            const isOpen = appNav.classList.toggle("active");
            burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    // 2. Calculateur de devis en temps réel
    const selectTravaux = document.getElementById("type_travaux");
    const inputSurface = document.getElementById("surface_m2");
    const radiosEtat = document.querySelectorAll('input[name="etat_support"]');

    const surfaceValeur = document.getElementById("surfaceValeur");
    const prixTotalAffiche = document.getElementById("prixTotalAffiche");
    const fourchettePrix = document.getElementById("fourchettePrix");
    const recapPrestation = document.getElementById("recapPrestation");
    const recapSurface = document.getElementById("recapSurface");
    const recapEtat = document.getElementById("recapEtat");
    const inputEstimationCache = document.getElementById("estimation_calculee");

    function calculerDevis() {
        const optionChoisie = selectTravaux.options[selectTravaux.selectedIndex];
        const prixMetreCarre = parseFloat(optionChoisie.getAttribute("data-prix")) || 0;
        const nomPrestation = optionChoisie.value;

        const surface = parseInt(inputSurface.value, 10) || 0;

        let coeffEtat = 1;
        let texteEtat = "";
        radiosEtat.forEach(function (radio) {
            if (radio.checked) {
                coeffEtat = parseFloat(radio.getAttribute("data-coeff")) || 1;
                texteEtat = radio.value;
            }
        });

        const total = Math.round(surface * prixMetreCarre * coeffEtat);
        const min = Math.round(total * 0.9);
        const max = Math.round(total * 1.1);

        // Mise à jour de l'affichage
        surfaceValeur.textContent = surface;
        prixTotalAffiche.textContent = total.toLocaleString("fr-FR");
        fourchettePrix.textContent = "Fourchette estimée : " + min.toLocaleString("fr-FR") + " € à " + max.toLocaleString("fr-FR") + " €";

        recapPrestation.textContent = nomPrestation;
        recapSurface.textContent = surface + " m²";
        recapEtat.textContent = texteEtat;

        inputEstimationCache.value = total;
    }

    selectTravaux.addEventListener("change", calculerDevis);
    inputSurface.addEventListener("input", calculerDevis);
    radiosEtat.forEach(function (radio) {
        radio.addEventListener("change", calculerDevis);
    });

    // Calcul initial au chargement
    calculerDevis();

    // 3. Enregistrement du Service Worker (PWA) et bouton d'installation mobile
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(function (err) {
            console.warn("Service Worker non actif en local :", err);
        });
    }

    let deferredPrompt;
    const installPwaBtn = document.getElementById("installPwaBtn");

    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        if (installPwaBtn) {
            installPwaBtn.style.display = "inline-block";
        }
    });

    if (installPwaBtn) {
        installPwaBtn.addEventListener("click", function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () {
                    deferredPrompt = null;
                    installPwaBtn.style.display = "none";
                });
            }
        });
    }
});