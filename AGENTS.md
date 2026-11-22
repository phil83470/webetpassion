
# INSTRUCTIONS PROJET — WEB & PASSION

## 1. Rôle et objectif du projet

Tu es l'assistant technique chargé de m'accompagner dans le développement, la correction, l'amélioration et la maintenance du site Web & Passion.

Site : https://www.web-et-passion.fr/

Le projet concerne notamment :

- La création et l'amélioration de pages Internet.
- Le HTML, le CSS et le JavaScript.
- Le référencement naturel (SEO).
- Les fonctionnalités et applications intégrées au site.
- Les formulaires et traitements PHP.
- L'expérience utilisateur sur ordinateur et mobile.
- La cohérence graphique et éditoriale.
- La préparation et la vérification des mises en ligne.

Le site est un projet professionnel. Toute intervention doit préserver son fonctionnement, son identité et sa cohérence.

Applique également les instructions globales présentes dans le fichier `AGENTS.md` de la racine Codex.

## 2. Anticipation et protection du site

Avant toute modification importante :

- Examine les fichiers concernés.
- Comprends leur rôle et leurs dépendances.
- Vérifie les conséquences possibles sur les autres pages.
- Identifie les risques de régression.
- Vérifie les éventuels prérequis.
- Préserve les fonctionnalités existantes.
- Prévois une sauvegarde adaptée avant une opération risquée.

Ne reconstruis pas une page ou un composant complet lorsqu'une correction ciblée suffit.

Ne modifie pas l'apparence générale du site lorsque la demande porte uniquement sur une correction technique.

Ne supprime pas de contenu, de fonctionnalité ou de fichier utile sans autorisation.

## 3. Règles de développement HTML, CSS et JavaScript

Pour toute intervention sur le code :

- Vérifie la cohérence entre le HTML, les feuilles de style et les scripts.
- Recherche les doublons et les règles CSS contradictoires.
- Vérifie les sélecteurs, les classes et les identifiants utilisés.
- Vérifie les chemins des fichiers et les dépendances.
- Vérifie les liens internes et externes.
- Vérifie les erreurs JavaScript lorsque les outils le permettent.
- Préserve les fonctionnalités existantes.
- Respecte les conventions déjà utilisées dans le projet.

### CSS et affichage responsive

Vérifie notamment :

- Les conflits entre les règles CSS.
- Les propriétés redondantes.
- Les dimensions et espacements.
- Les alignements.
- Les débordements horizontaux.
- Les comportements sur ordinateur, tablette et mobile.
- La lisibilité et les contrastes.

Si je demande une correction sans changement visuel, conserve l'apparence existante.

### JavaScript et fonctionnalités

Avant de modifier une fonction JavaScript :

- Identifie son rôle.
- Recherche ses appels et ses utilisations.
- Vérifie les éléments HTML auxquels elle se rattache.
- Vérifie les éventuelles dépendances avec d'autres scripts.
- Contrôle les risques de régression.

Ne prétends jamais avoir testé une fonctionnalité si tu ne l'as pas réellement exécutée.

## 4. Protection des éléments partagés entre plusieurs pages

Avant de modifier une classe CSS, une fonction JavaScript, un composant ou un fichier utilisé par plusieurs pages :

- Recherche toutes ses utilisations dans le projet.
- Identifie les pages et fonctionnalités susceptibles d'être affectées.
- Vérifie qu'une correction locale ne provoque pas de régression ailleurs.
- Privilégie une correction ciblée lorsque cela est possible.
- Effectue des tests de non-régression sur les éléments concernés.

Ne modifie jamais un élément partagé sans avoir évalué ses conséquences sur l'ensemble de ses utilisations.

Après une modification d'un élément partagé, vérifie les pages concernées et signale les éventuels contrôles restant à effectuer.

## 5. Identité visuelle et charte graphique

La charte graphique existante de Web & Passion doit être respectée.

### Identité visuelle

- Conserver l'identité graphique bleue, lavande et rouge.
- Respecter le fond en dégradé utilisé sur le site.
- Conserver l'esprit des cartes translucides et des effets de verre dépoli.
- Préserver les contrastes et la lisibilité.
- Maintenir une présentation moderne, claire et professionnelle.
- Conserver une cohérence visuelle entre les pages.

### Couleurs et éléments graphiques

Respecter la palette déjà définie dans les fichiers du projet, notamment les couleurs de référence :

- `#0f172a`
- `#334155`
- `#1d4ed8` : reprendre la valeur exacte déjà présente dans la charte ou les feuilles de style du projet, sans en inventer une.

Ne pas introduire arbitrairement de nouvelles couleurs dominantes.

### Logo et favicon

Respecter les ressources graphiques existantes.

Le favicon de référence est :

`assets/logo-web-passion.webp`

Ne pas le remplacer sans demande explicite.

### Règles de modification graphique

Avant de modifier un élément visuel :

- Vérifier sa cohérence avec la charte.
- Examiner les autres pages pour conserver une présentation homogène.
- Ne pas modifier globalement le design pour corriger un problème local.
- Préserver les composants existants qui fonctionnent correctement.

Toute évolution importante de l'identité graphique doit être proposée avant sa réalisation.

## 6. Ligne éditoriale et public visé

Le ton du site doit rester :

- Direct.
- Accessible.
- Professionnel.
- Naturel.
- Compréhensible pour des personnes non spécialistes du web.

Privilégier une communication à la première personne (« Je ») et l'emploi du tutoiement lorsque le contexte s'y prête.

Le contenu s'adresse notamment :

- Aux entrepreneurs.
- Aux artisans.
- Aux commerçants.
- Aux particuliers.
- Aux petites structures ayant besoin d'un accompagnement numérique.

Éviter les promesses commerciales exagérées et les formulations qui pourraient laisser croire à des prestations ou compétences non confirmées.

Les textes doivent expliquer clairement les services proposés et leur utilité.

## 7. Organisation des pages et applications

Respecter la structure existante du site.

Les applications et outils interactifs doivent rester dans la rubrique prévue à cet effet, notamment la page :

`applications.html`

Ne pas disperser les applications sur d'autres pages sans demande explicite.

Avant de créer une nouvelle page ou une nouvelle fonctionnalité :

- Vérifier si un emplacement existe déjà.
- Vérifier la navigation et les liens internes.
- Vérifier la cohérence avec l'organisation du site.
- Éviter les doublons fonctionnels.

Pour toute nouvelle application, vérifier son fonctionnement sur ordinateur et mobile ainsi que ses éventuelles dépendances.

## 8. SEO et référencement

Pour toute intervention SEO :

- Vérifier la cohérence entre le titre de la page, sa description et son contenu.
- Vérifier la hiérarchie des titres H1, H2 et H3.
- Vérifier les URL et les liens internes.
- Vérifier les textes alternatifs des images lorsqu'ils sont nécessaires.
- Éviter les répétitions artificielles de mots-clés.
- Préserver la lisibilité et la qualité rédactionnelle.
- Vérifier les données structurées lorsqu'elles sont présentes.
- Vérifier les fichiers `sitemap.xml` et `robots.txt` lorsque la modification le justifie.

Ne modifie pas inutilement les éléments SEO qui fonctionnent déjà.

Pour les changements importants, identifie les éventuelles conséquences sur l'indexation et le référencement.

## 9. Protection du déploiement o2switch

Le site est hébergé chez o2switch et son déploiement utilise le dépôt GitHub.

Dépôt :

`phil83470/webetpassion`

Branche principale :

`main`

### Fichiers et éléments sensibles

- Le fichier `.cpanel.yml` situé à la racine du dépôt est indispensable au déploiement.
- Ne jamais supprimer, recréer ou modifier `.cpanel.yml` sans nécessité clairement identifiée et accord approprié.
- Ne pas recréer le dossier `.github/workflows`.
- Ne pas mettre en place un déploiement FTP ou SFTP automatique : cette méthode n'est pas adaptée à la configuration actuelle de l'hébergement.

Ne modifie pas la configuration du déploiement pour résoudre un problème qui peut être corrigé dans les fichiers du site.

## 10. Protocole Git sécurisé

Avant toute opération Git :

1. Exécute `git status` pour identifier les modifications présentes.
2. Vérifie la branche active.
3. Examine les différences avec `git diff`.
4. Distingue les modifications réalisées par l'agent de celles déjà présentes ou effectuées par l'utilisateur.
5. Vérifie qu'aucun fichier confidentiel, temporaire ou destiné à rester local n'est inclus.
6. Ajoute uniquement les fichiers concernés avec `git add chemin/du/fichier`.
7. Vérifie les fichiers préparés avec `git status`.

N'utilise pas automatiquement `git add .` si le dépôt contient des modifications étrangères à l'intervention.

Ne valide jamais des modifications personnelles ou sans rapport avec la tâche demandée.

### Envoi vers GitHub

Après vérification des fichiers concernés :

- Effectue un commit avec un message court et clair en français décrivant les modifications.
- Utilise `git push origin main` pour envoyer les modifications sur le dépôt `phil83470/webetpassion`, uniquement lorsque l'envoi a été demandé ou autorisé.
- Ne pousse jamais de modifications si une anomalie, un conflit ou un doute subsiste.
- Ne force jamais un push pour contourner un problème sans analyse et autorisation.

Si une opération risque d'écraser ou de perdre des modifications existantes, arrête-toi et demande mon accord.

## 11. Déploiement sur o2switch

Après l'envoi des modifications sur GitHub, le déploiement sur l'hébergement s'effectue depuis cPanel.

Procédure :

1. Accéder à la gestion du dépôt Git dans cPanel.
2. Cliquer sur « Mettre à jour depuis le dépôt distant ».
3. Vérifier que le commit attendu est bien récupéré.
4. Cliquer sur « Déployer le commit HEAD ».
5. Vérifier le résultat du déploiement.
6. Contrôler le site en ligne et les fonctionnalités concernées.

Ne déclare pas le site mis à jour tant que le déploiement n'a pas été effectué et vérifié.

Ne confonds pas l'envoi d'un commit sur GitHub avec sa mise en ligne effective sur o2switch.

## 12. Vérification finale et compte rendu

Après chaque intervention :

- Vérifie que la demande initiale est satisfaite.
- Contrôle les fichiers modifiés.
- Vérifie les éventuelles conséquences sur les autres pages.
- Effectue les tests disponibles.
- Contrôle le rendu responsive lorsque c'est pertinent.
- Vérifie les liens et fonctionnalités concernés.
- Signale les éventuelles anomalies restantes.

Présente un compte rendu concis indiquant :

1. Les modifications réalisées.
2. Les fichiers concernés.
3. Les vérifications et tests réellement effectués.
4. Les éventuels problèmes détectés.
5. Les actions restant à effectuer.

Ne prétends jamais avoir testé, déployé ou vérifié un élément si cela n'a pas été réellement fait.

**Principe fondamental : préserver le site, son identité, son fonctionnement et ses données. Toute intervention doit être réfléchie, ciblée et vérifiée.**
