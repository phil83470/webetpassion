<?php
session_start();

$message_statut = "";
$type_alerte = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1. Protection anti-spam Honeypot invisible
    $honeypot = isset($_POST['website_url_hp']) ? trim($_POST['website_url_hp']) : '';
    
    if (!empty($honeypot)) {
        // C'est un robot spammeur : on simule un succès sans rien envoyer
        $message_statut = "Votre estimation a bien été envoyée.";
        $type_alerte = "success";
    } else {
        // 2. Nettoyage et sécurisation stricte des entrées
        $nom = isset($_POST['client_nom']) ? htmlspecialchars(strip_tags(trim($_POST['client_nom'])), ENT_QUOTES, 'UTF-8') : '';
        $telephone = isset($_POST['client_tel']) ? htmlspecialchars(strip_tags(trim($_POST['client_tel'])), ENT_QUOTES, 'UTF-8') : '';
        $email_brut = isset($_POST['client_email']) ? trim($_POST['client_email']) : '';
        $email = filter_var($email_brut, FILTER_SANITIZE_EMAIL);
        $ville = isset($_POST['client_ville']) ? htmlspecialchars(strip_tags(trim($_POST['client_ville'])), ENT_QUOTES, 'UTF-8') : '';
        
        $prestation = isset($_POST['type_travaux']) ? htmlspecialchars(strip_tags(trim($_POST['type_travaux'])), ENT_QUOTES, 'UTF-8') : '';
        $surface = isset($_POST['surface_m2']) ? intval($_POST['surface_m2']) : 0;
        $etat = isset($_POST['etat_support']) ? htmlspecialchars(strip_tags(trim($_POST['etat_support'])), ENT_QUOTES, 'UTF-8') : '';
        $estimation_total = isset($_POST['estimation_calculee']) ? htmlspecialchars(strip_tags(trim($_POST['estimation_calculee'])), ENT_QUOTES, 'UTF-8') : '';

        if (empty($nom) || empty($telephone) || !filter_var($email, FILTER_VALIDATE_EMAIL) || $surface <= 0) {
            $message_statut = "Veuillez remplir correctement tous les champs obligatoires.";
            $type_alerte = "error";
        } else {
            $destinataire = "pjireau83@outlook.com";
            $sujet = "Nouvelle estimation de devis via l'Application - " . $nom;
            
            $corps_mail = "Nouvelle demande reçue depuis la démo Calculateur de Devis (Web et Passion) :\n\n";
            $corps_mail .= "--- COORDONNÉES DU CLIENT ---\n";
            $corps_mail .= "Nom : " . $nom . "\n";
            $corps_mail .= "Téléphone : " . $telephone . "\n";
            $corps_mail .= "E-mail : " . $email . "\n";
            $corps_mail .= "Ville du chantier : " . $ville . "\n\n";
            $corps_mail .= "--- DÉTAILS DU CHANTIER ---\n";
            $corps_mail .= "Prestation : " . $prestation . "\n";
            $corps_mail .= "Surface : " . $surface . " m²\n";
            $corps_mail .= "État du support : " . $etat . "\n";
            $corps_mail .= "Estimation calculée : " . $estimation_total . " €\n";

            $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
            $headers .= "Reply-To: " . $email . "\r\n";
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

            if (@mail($destinataire, $sujet, $corps_mail, $headers)) {
                $message_statut = "Votre estimation détaillée a bien été envoyée ! Un conseiller vous recontactera sous 24h.";
                $type_alerte = "success";
            } else {
                // En local (VS Code) ou si mail() est bloqué, on confirme le test de la démo
                $message_statut = "Démo validée : Estimation enregistrée (" . $estimation_total . " €). Prêt pour l'envoi sur serveur.";
                $type_alerte = "success";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculateur de Devis Travaux & Rénovation | Application Web et Passion</title>
    <meta name="description" content="Testez notre application de calcul de devis instantané pour artisans du bâtiment et entreprises de rénovation à Saint-Maximin-la-Sainte-Baume et dans le Var.">
    <meta name="robots" content="index, follow">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#1e3a8a">
    <link rel="stylesheet" href="style.css">

    <!-- Données structurées Schema.org Local & Application -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Calculateur de Devis Express Artisans",
      "operatingSystem": "Web, Android, iOS",
      "applicationCategory": "BusinessApplication",
      "description": "Application web et mobile (PWA) permettant aux artisans du bâtiment de chiffrer leurs chantiers en direct et de recevoir des demandes qualifiées.",
      "offers": {
        "@type": "Offer",
        "price": "190.00",
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

    <header class="app-header">
        <div class="header-container">
            <a href="../../index.html" class="brand-logo">Web et Passion <span>App Démo</span></a>
            
            <button class="burger-btn" id="burgerBtn" aria-label="Ouvrir le menu" aria-expanded="false">
                <span class="burger-line"></span>
                <span class="burger-line"></span>
                <span class="burger-line"></span>
            </button>

            <nav class="app-nav" id="appNav">
                <ul>
                    <li><a href="../../index.html">Retour au site</a></li>
                    <li><a href="../../tarifs.html">Nos Tarifs</a></li>
                    <li><button type="button" id="installPwaBtn" class="btn-pwa-install" style="display: none;">Installer sur mobile</button></li>
                    <li><a href="../../index.html#contact" class="nav-cta">Acheter cette App (190 €)</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="app-main">
        <section class="intro-banner">
            <h1>Simulateur de Devis Travaux &amp; Rénovation</h1>
            <p>Démonstration interactive : voici l'outil que nous installons sur le site et le smartphone de votre entreprise artisanale pour chiffrer vos chantiers en 30 secondes.</p>
        </section>

        <?php if (!empty($message_statut)): ?>
            <div class="alert-box <?php echo $type_alerte; ?>" role="alert">
                <?php echo $message_statut; ?>
            </div>
        <?php endif; ?>

        <div class="calculator-layout">
            <!-- Colonne de configuration du chantier -->
            <section class="calc-card" aria-labelledby="titre-config">
                <h2 id="titre-config">1. Configurez le chantier</h2>

                <form id="devisForm" method="POST" action="index.php" novalidate>
                    <!-- Champ Honeypot anti-spam strictement invisible -->
                    <div class="hp-field" aria-hidden="true">
                        <label for="website_url_hp">Ne pas remplir ce champ</label>
                        <input type="text" id="website_url_hp" name="website_url_hp" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="form-group">
                        <label for="type_travaux">Type de prestation</label>
                        <select id="type_travaux" name="type_travaux" required>
                            <option value="Peinture intérieure" data-prix="32">Peinture intérieure (Murs &amp; Plafonds) - 32 €/m²</option>
                            <option value="Ravalement de façade" data-prix="65">Ravalement de façade &amp; Enduit - 65 €/m²</option>
                            <option value="Pose de carrelage" data-prix="55">Pose de carrelage sol (hors fourniture) - 55 €/m²</option>
                            <option value="Isolation placo" data-prix="48">Isolation thermique &amp; Placo - 48 €/m²</option>
                            <option value="Rénovation complète" data-prix="450">Rénovation complète intérieure - 450 €/m²</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="surface_m2">Surface à traiter : <strong id="surfaceValeur">40</strong> m²</label>
                        <input type="range" id="surface_m2" name="surface_m2" min="5" max="300" value="40" step="1">
                        <div class="range-labels">
                            <span>5 m²</span>
                            <span>150 m²</span>
                            <span>300 m²</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>État actuel du support</label>
                        <div class="radio-group">
                            <label class="radio-card">
                                <input type="radio" name="etat_support" value="Bon état (préparation standard)" data-coeff="1" checked>
                                <span>Bon état (Standard)</span>
                            </label>
                            <label class="radio-card">
                                <input type="radio" name="etat_support" value="État moyen (rebouchage / ponçage)" data-coeff="1.2">
                                <span>À préparer (+20 %)</span>
                            </label>
                            <label class="radio-card">
                                <input type="radio" name="etat_support" value="Dégradé (remise à neuf complète)" data-coeff="1.45">
                                <span>Très abîmé (+45 %)</span>
                            </label>
                        </div>
                    </div>

                    <input type="hidden" id="estimation_calculee" name="estimation_calculee" value="1280">

                    <hr class="divider">

                    <h3>2. Recevoir ou envoyer ce chiffrage</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="client_nom">Nom complet *</label>
                            <input type="text" id="client_nom" name="client_nom" placeholder="Ex. : Jean Dupont" required>
                        </div>
                        <div class="form-group">
                            <label for="client_tel">Téléphone *</label>
                            <input type="tel" id="client_tel" name="client_tel" placeholder="Ex. : 06 12 34 56 78" required>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="client_email">Adresse e-mail *</label>
                            <input type="email" id="client_email" name="client_email" placeholder="client@email.fr" required>
                        </div>
                        <div class="form-group">
                            <label for="client_ville">Commune du chantier *</label>
                            <input type="text" id="client_ville" name="client_ville" placeholder="Ex. : Saint-Maximin-la-Sainte-Baume" required>
                        </div>
                    </div>

                    <button type="submit" class="btn-submit">Valider et envoyer l'estimation</button>
                </form>
            </section>

            <!-- Colonne de résultat en temps réel -->
            <aside class="result-card" aria-labelledby="titre-resultat">
                <h2 id="titre-resultat">Estimation en direct</h2>
                <p class="result-subtitle">Tarif indicatif calculé automatiquement selon vos critères :</p>

                <div class="price-display">
                    <span id="prixTotalAffiche">1 280</span> €
                </div>
                <span class="price-range" id="fourchettePrix">Fourchette estimée : 1 152 € à 1 408 €</span>

                <ul class="summary-list">
                    <li><strong>Prestation :</strong> <span id="recapPrestation">Peinture intérieure</span></li>
                    <li><strong>Surface :</strong> <span id="recapSurface">40 m²</span></li>
                    <li><strong>Support :</strong> <span id="recapEtat">Bon état (préparation standard)</span></li>
                </ul>

                <div class="artisan-promo-box">
                    <h3>Vous êtes artisan ?</h3>
                    <p>Intégrez ce calculateur personnalisé avec vos propres tarifs sur votre site ou votre téléphone.</p>
                    <p class="tva-mention">Prix clé en main : <strong>190 €</strong> (TVA non applicable, art. 293 B du CGI).</p>
                    <a href="../../index.html#contact" class="btn-buy-now">Commander mon application</a>
                </div>
            </aside>
        </div>
    </main>

    <footer class="app-footer">
        <p>&copy; <?php echo date("Y"); ?> Web et Passion — Créateur et développeur web à Saint-Maximin-la-Sainte-Baume. <a href="../../mentions-legales.html">Mentions légales</a> | <a href="../../cgv.html">CGV</a></p>
    </footer>

    <script src="app.js"></script>
</body>
</html>