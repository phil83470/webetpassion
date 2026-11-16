<?php
// Gestion du téléchargement direct du fichier de contact vCard (.vcf)
if (isset($_GET['action']) && $_GET['action'] === 'vcard') {
    header('Content-Type: text/vcard; charset=utf-8');
    header('Content-Disposition: attachment; filename="contact-philippe-jireau.vcf"');
    
    echo "BEGIN:VCARD\r\n";
    echo "VERSION:3.0\r\n";
    echo "N:JIREAU;Philippe;;;\r\n";
    echo "FN:Philippe JIREAU\r\n";
    echo "ORG:Web & Passion\r\n";
    echo "TITLE:Conseiller & Développeur Web\r\n";
    echo "TEL;TYPE=CELL:0771236136\r\n";
    echo "EMAIL:bonjour@webetpassion.fr\r\n";
    echo "URL:https://webetpassion.fr\r\n";
    echo "ADR;TYPE=WORK:;;201 B Résidence Les Jardins de Marie;Saint-Maximin-la-Sainte-Baume;;83470;France\r\n";
    echo "NOTE:Création et dépannage de sites internet, assistance web, référencement SEO et solutions digitales.\r\n";
    echo "END:VCARD\r\n";
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte de Visite Digitale &amp; QR Code Pro | Démo Web &amp; Passion</title>
    <meta name="description" content="Démonstration d'une carte de visite digitale interactive pour artisans, commerçants et indépendants avec enregistrement direct dans les contacts et QR Code pro.">
    <meta name="robots" content="index, follow">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#1e3a8a">
    <link rel="stylesheet" href="style.css">

    <!-- Données structurées Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Carte de Visite Digitale & QR Code Pro",
      "operatingSystem": "Web, Android, iOS",
      "applicationCategory": "BusinessApplication",
      "description": "Mini-application mobile permettant d'enregistrer instantanément vos coordonnées dans le répertoire de vos clients et d'afficher un QR Code haute définition pour vos supports imprimés.",
      "offers": {
        "@type": "Offer",
        "price": "89.00",
        "priceCurrency": "EUR"
      },
      "author": {
        "@type": "LocalBusiness",
        "name": "Web et Passion",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Saint-Maximin-la-Sainte-Baume",
          "postalCode": "83470",
          "addressCountry": "FR"
        }
      }
    }
    </script>
</head>
<body>

    <!-- En-tête de démonstration -->
    <header class="app-header">
        <div class="header-container">
            <a href="../../index.html" class="brand-logo">Web &amp; Passion <span>App Démo</span></a>
            
            <button class="burger-btn" id="burgerBtn" aria-label="Ouvrir le menu" aria-expanded="false">
                <span class="burger-line"></span>
                <span class="burger-line"></span>
                <span class="burger-line"></span>
            </button>

            <nav class="app-nav" id="appNav">
                <ul>
                    <li><a href="../../index.html">Retour au site</a></li>
                    <li><a href="../../tarifs.html">Nos Tarifs</a></li>
                    <li><button type="button" id="installPwaBtn" class="btn-pwa-install" hidden>Installer sur mobile</button></li>
                    <li><a href="../../index.html#contact" class="nav-cta">Acheter cette App (89 €)</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="app-main">

        <!-- Bannière explicative -->
        <section class="intro-banner">
            <h1>Carte de Visite Digitale &amp; QR Code Pro</h1>
            <p>Démonstration interactive : voici l'application personnalisée à votre image que vos clients ouvrent en scannant le QR Code sur votre véhicule, flyer ou vitrine.</p>
        </section>

        <div class="card-demo-layout">

            <!-- Colonne 1 : La carte de visite interactive (Vue Smartphone) -->
            <section class="vcard-container" aria-label="Aperçu de la carte de visite digitale">
                
                <article class="digital-card">
                    <!-- En-tête visuel de la carte -->
                    <div class="card-cover">
                        <span class="pro-badge">Artisan &amp; Expert Vérifié</span>
                    </div>

                    <div class="card-avatar-wrap">
                        <img src="../../assets/logo-web-passion.webp" alt="Logo professionnel Philippe JIREAU" class="card-avatar" width="110" height="110">
                    </div>

                    <div class="card-identity">
                        <h2>Philippe JIREAU</h2>
                        <p class="card-title">Conseiller &amp; Développeur Web</p>
                        <p class="card-company">Web &amp; Passion • Saint-Maximin-la-Sainte-Baume</p>
                    </div>

                    <!-- Bouton principal d'enregistrement dans le téléphone -->
                    <div class="card-primary-action">
                        <a href="index.php?action=vcard" class="btn-add-contact">
                            <span class="btn-icon">👤</span>
                            <span>Ajouter à mes contacts (.vcf)</span>
                        </a>
                        <small class="hint-text">Enregistre nom, numéro, e-mail et adresse en 1 clic</small>
                    </div>

                    <!-- Boutons d'actions rapides -->
                    <div class="card-quick-actions">
                        <a href="tel:0771236136" class="quick-btn btn-call" aria-label="Appeler Philippe JIREAU">
                            <span class="action-emoji">📞</span>
                            <span class="action-label">Appeler</span>
                        </a>
                        <a href="mailto:bonjour@webetpassion.fr" class="quick-btn btn-email" aria-label="Envoyer un e-mail">
                            <span class="action-emoji">✉️</span>
                            <span class="action-label">E-mail</span>
                        </a>
                        <a href="../../index.html" class="quick-btn btn-site" aria-label="Consulter le site internet">
                            <span class="action-emoji">🌐</span>
                            <span class="action-label">Site Web</span>
                        </a>
                        <button type="button" id="shareBtn" class="quick-btn btn-share" aria-label="Partager cette carte">
                            <span class="action-emoji">📤</span>
                            <span class="action-label">Partager</span>
                        </button>
                    </div>

                    <!-- Informations détaillées de contact -->
                    <div class="card-details-list">
                        <div class="detail-item">
                            <span class="detail-icon">📍</span>
                            <div class="detail-content">
                                <strong>Localisation</strong>
                                <span>Saint-Maximin-la-Sainte-Baume (83470)</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <span class="detail-icon">🕒</span>
                            <div class="detail-content">
                                <strong>Disponibilité</strong>
                                <span>Du lundi au vendredi : 8h30 - 18h30</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <span class="detail-icon">⭐</span>
                            <div class="detail-content">
                                <strong>Avis Google &amp; Réputation</strong>
                                <a href="../../index.html#methode" class="link-review">Consulter mes avis et réalisations →</a>
                            </div>
                        </div>
                    </div>
                </article>

            </section>

            <!-- Colonne 2 : Le QR Code haute définition & Pack d'impression -->
            <aside class="qr-aside-card" aria-labelledby="titre-qr">
                <h2 id="titre-qr">Votre QR Code Pro Haute Définition</h2>
                <p class="qr-description">À coller sur votre camionnette, vos devis papier, vos factures et vos cartes de visite pour que chaque prospect vous enregistre immédiatement.</p>

                <!-- Zone d'affichage du QR Code vectoriel -->
                <div class="qr-frame">
                    <div id="qrcodeCanvasWrap" class="qr-box">
                        <!-- Le QR Code vectoriel SVG est généré ici par app.js -->
                    </div>
                    <span class="qr-scan-hint">Scannez avec l'appareil photo du smartphone</span>
                </div>

                <!-- Boutons d'exportation pour l'artisan -->
                <div class="qr-download-actions">
                    <button type="button" id="downloadQrSvgBtn" class="btn-download-qr">
                        📥 Télécharger le QR Code (Format SVG vectoriel)
                    </button>
                    <button type="button" id="downloadQrPngBtn" class="btn-download-qr secondary">
                        📥 Télécharger en image HD (PNG 1000px)
                    </button>
                </div>

                <!-- Encart commercial de commande -->
                <div class="promo-order-box">
                    <h3>Commandez votre Carte Digitale</h3>
                    <ul class="promo-benefits">
                        <li>Personnalisée à 100 % avec votre logo et vos couleurs</li>
                        <li>Fichier vCard automatique inclus</li>
                        <li>QR Code fourni prêt pour vos imprimeurs et flocages</li>
                        <li><strong>Zéro abonnement mensuel</strong> (vous êtes propriétaire)</li>
                    </ul>
                    <div class="price-tag">
                        <span class="amount">89 €</span>
                        <span class="tva-mention">Paiement unique — TVA non applicable, art. 293 B du CGI</span>
                    </div>
                    <a href="../../index.html#contact" class="btn-order-cta">Commander cette application</a>
                </div>

            </aside>

        </div>

    </main>

    <!-- Pied de page -->
    <footer class="app-footer">
        <p>&copy; <?php echo date("Y"); ?> Web &amp; Passion — Créateur et développeur web à Saint-Maximin-la-Sainte-Baume. <a href="../../mentions-legales.html">Mentions légales</a> | <a href="../../cgv.html">CGV</a></p>
    </footer>

    <script src="app.js"></script>
</body>
</html>

