<?php

// =========================================================
// SÉCURITÉ : Autoriser uniquement les requêtes POST
// provenant du propre domaine du site.
// =========================================================

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// =========================================================
// RÉCUPÉRATION ET NETTOYAGE DES DONNÉES
// =========================================================

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$phone   = clean($_POST['phone']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');
$pack    = clean($_POST['pack']    ?? '');
$price   = clean($_POST['price']   ?? '');

// =========================================================
// VALIDATION
// =========================================================

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

// =========================================================
// CONSTRUCTION DE L'EMAIL
// =========================================================

$destination = 'bonjour@webetpassion.fr';

$isOrder = !empty($pack);
$mailTitle = $isOrder ? "Commande de pack : {$pack}" : ($subject ?: 'Web & Passion');
$mailSubject = '=?UTF-8?B?' . base64_encode('Demande de contact – ' . $mailTitle) . '?=';

$mailBody  = "Bonjour Philippe,\r\n\r\n";
if ($isOrder) {
    $mailBody .= "Nouvelle commande de formule reçue depuis le site webetpassion.fr :\r\n\r\n";
    $mailBody .= "Formule : {$pack} ({$price} €)\r\n";
} else {
    $mailBody .= "Vous avez reçu un nouveau message depuis le formulaire de contact de webetpassion.fr :\r\n\r\n";
}
$mailBody .= "---\r\n\r\n";
$mailBody .= "Nom       : {$name}\r\n";
$mailBody .= "Email     : {$email}\r\n";
if (!empty($phone)) {
    $mailBody .= "Téléphone : {$phone}\r\n";
}
if (!$isOrder && !empty($subject)) {
    $mailBody .= "Sujet     : {$subject}\r\n";
}
$mailBody .= "\r\nMessage :\r\n" . ($message ?: '(Aucun message supplémentaire)') . "\r\n\r\n";
$mailBody .= "---\r\n";
$mailBody .= "Message envoyé depuis webetpassion.fr\r\n";

// En-têtes : l'expéditeur affiché est Web & Passion,
// le Reply-To pointe vers l'email du visiteur pour
// pouvoir répondre directement.
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: Web & Passion <bonjour@webetpassion.fr>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// =========================================================
// ENVOI
// =========================================================

$sent = mail($destination, $mailSubject, $mailBody, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Votre message a bien été envoyé !']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Une erreur est survenue. Veuillez réessayer.']);
}
