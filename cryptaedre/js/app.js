"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. VÉRIFICATION DU CONTEXTE SÉCURISÉ (HTTPS / WEB CRYPTO) ---
  const envStatus = document.getElementById("env-status");
  if (window.isSecureContext && window.crypto && window.crypto.subtle) {
    envStatus.textContent =
      "Environnement sécurisé vérifié : Web Crypto API active (HTTPS/Local).";
    envStatus.classList.add("secure");
  } else {
    envStatus.textContent =
      "ALERTE : Contexte non sécurisé (HTTP). Déployez en HTTPS pour activer le chiffrement.";
    envStatus.classList.add("insecure");
  }

  // --- 2. MENU BURGER MOBILE ---
  const burgerBtn = document.getElementById("burger-btn");
  const mainNav = document.getElementById("main-nav");

  burgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });

  // --- 3. UTILITAIRES DE CONVERSION BINAIRE / BASE64 ---
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // --- 4. CRYPTOGRAPHIE (PBKDF2 + AES-256-GCM) ---
  const PBKDF2_ITERATIONS = 600000;
  const SALT_LENGTH = 16; // 128 bits
  const IV_LENGTH = 12; // 96 bits (recommandation NIST pour GCM)

  async function deriveKey(password, salt) {
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  async function encryptData(plainText, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await deriveKey(password, salt);

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encoder.encode(plainText),
    );

    // Assemblage : [SALT (16 octets)] + [IV (12 octets)] + [CIPHERTEXT + TAG]
    const combined = new Uint8Array(
      SALT_LENGTH + IV_LENGTH + encryptedContent.byteLength,
    );
    combined.set(salt, 0);
    combined.set(iv, SALT_LENGTH);
    combined.set(new Uint8Array(encryptedContent), SALT_LENGTH + IV_LENGTH);

    return bufferToBase64(combined.buffer);
  }

  async function decryptData(base64Payload, password) {
    const combined = base64ToBuffer(base64Payload.trim());
    if (combined.byteLength <= SALT_LENGTH + IV_LENGTH) {
      throw new Error("Charge utile corrompue ou invalide.");
    }

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(password, salt);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext,
    );

    return decoder.decode(decryptedContent);
  }

  // --- 5. GESTION DE L'INTERFACE DU COFFRE-FORT ---
  const masterPwdInput = document.getElementById("master-password");
  const toggleMasterBtn = document.getElementById("toggle-master-btn");
  const vaultInput = document.getElementById("vault-input");
  const vaultOutput = document.getElementById("vault-output");
  const encryptBtn = document.getElementById("encrypt-btn");
  const decryptBtn = document.getElementById("decrypt-btn");
  const wipeBtn = document.getElementById("wipe-btn");
  const copyOutputBtn = document.getElementById("copy-output-btn");
  const exportFileBtn = document.getElementById("export-file-btn");
  const vaultFeedback = document.getElementById("vault-feedback");

  function showFeedback(message, isError = false) {
    vaultFeedback.textContent = message;
    vaultFeedback.className = "feedback-msg " + (isError ? "error" : "success");
  }

  toggleMasterBtn.addEventListener("click", () => {
    const isPwd = masterPwdInput.type === "password";
    masterPwdInput.type = isPwd ? "text" : "password";
    toggleMasterBtn.textContent = isPwd ? "Masquer" : "Voir";
  });

  encryptBtn.addEventListener("click", async () => {
    const password = masterPwdInput.value;
    const text = vaultInput.value;

    if (!password || password.length < 8) {
      showFeedback(
        "Erreur : Le mot de passe maître doit contenir au moins 8 caractères.",
        true,
      );
      return;
    }
    if (!text.trim()) {
      showFeedback("Erreur : Aucune donnée à chiffrer.", true);
      return;
    }

    try {
      encryptBtn.disabled = true;
      showFeedback(
        "Dérivation PBKDF2 (600 000 tours) et chiffrement en cours...",
      );
      const encrypted = await encryptData(text, password);
      vaultOutput.value = encrypted;
      showFeedback("Données chiffrées avec succès (AES-256-GCM authentifié).");
    } catch (err) {
      showFeedback("Échec du chiffrement : " + err.message, true);
    } finally {
      encryptBtn.disabled = false;
    }
  });

  decryptBtn.addEventListener("click", async () => {
    const password = masterPwdInput.value;
    const payload = vaultInput.value;

    if (!password) {
      showFeedback("Erreur : Saisissez le mot de passe maître.", true);
      return;
    }
    if (!payload.trim()) {
      showFeedback(
        "Erreur : Collez un bloc Base64 chiffré dans la zone d'entrée.",
        true,
      );
      return;
    }

    try {
      decryptBtn.disabled = true;
      showFeedback("Vérification de l'intégrité et déchiffrement...");
      const decrypted = await decryptData(payload, password);
      vaultOutput.value = decrypted;
      showFeedback("Déchiffrement réussi. Intégrité du message vérifiée.");
    } catch (err) {
      vaultOutput.value = "";
      showFeedback(
        "Accès refusé : Mot de passe incorrect ou données altérées.",
        true,
      );
    } finally {
      decryptBtn.disabled = false;
    }
  });

  wipeBtn.addEventListener("click", () => {
    masterPwdInput.value = "";
    vaultInput.value = "";
    vaultOutput.value = "";
    showFeedback("Mémoire vive purgée.");
  });

  copyOutputBtn.addEventListener("click", async () => {
    if (!vaultOutput.value) return;
    await navigator.clipboard.writeText(vaultOutput.value);
    showFeedback(
      "Copié dans le presse-papiers. Effacement automatique dans 30 secondes.",
    );

    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText("");
        showFeedback("Presse-papiers purgé par sécurité.");
      } catch (e) {
        // Ignore si l'onglet a perdu le focus
      }
    }, 30000);
  });

  exportFileBtn.addEventListener("click", () => {
    if (!vaultOutput.value) {
      showFeedback("Rien à exporter.", true);
      return;
    }
    const blob = new Blob([vaultOutput.value], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");
    link.href = url;
    link.download = `cryptaedre-${timestamp}.crypt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // --- 6. GÉNÉRATEUR CRYPTOGRAPHIQUE (CSPRNG SANS BIAIS) ---
  const lengthSlider = document.getElementById("pwd-length");
  const lengthVal = document.getElementById("length-val");
  const optUpper = document.getElementById("opt-upper");
  const optLower = document.getElementById("opt-lower");
  const optNumbers = document.getElementById("opt-numbers");
  const optSymbols = document.getElementById("opt-symbols");
  const generatedPwd = document.getElementById("generated-pwd");
  const generateBtn = document.getElementById("generate-btn");
  const copyGenBtn = document.getElementById("copy-gen-btn");

  const CHARSETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?/~",
  };

  function getUnbiasedRandomInt(max) {
    const array = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    let randomValue;
    do {
      window.crypto.getRandomValues(array);
      randomValue = array[0];
    } while (randomValue >= limit);
    return randomValue % max;
  }

  function generateSecurePassword() {
    let pool = "";
    if (optUpper.checked) pool += CHARSETS.upper;
    if (optLower.checked) pool += CHARSETS.lower;
    if (optNumbers.checked) pool += CHARSETS.numbers;
    if (optSymbols.checked) pool += CHARSETS.symbols;

    if (!pool) {
      generatedPwd.value = "Sélectionnez au moins un jeu de caractères";
      return;
    }

    const length = parseInt(lengthSlider.value, 10);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool[getUnbiasedRandomInt(pool.length)];
    }
    generatedPwd.value = result;
  }

  lengthSlider.addEventListener("input", () => {
    lengthVal.textContent = lengthSlider.value;
    generateSecurePassword();
  });

  [optUpper, optLower, optNumbers, optSymbols].forEach((checkbox) => {
    checkbox.addEventListener("change", generateSecurePassword);
  });

  generateBtn.addEventListener("click", generateSecurePassword);

  copyGenBtn.addEventListener("click", async () => {
    if (!generatedPwd.value) return;
    await navigator.clipboard.writeText(generatedPwd.value);
    copyGenBtn.textContent = "Copié !";
    setTimeout(() => {
      copyGenBtn.textContent = "Copier";
    }, 2000);
  });

  // --- 7. CALCULATEUR D'ENTROPIE ---
  const auditInput = document.getElementById("audit-input");
  const entropyBar = document.getElementById("entropy-bar");
  const entropyBits = document.getElementById("entropy-bits");
  const crackTime = document.getElementById("crack-time");
  const entropyVerdict = document.getElementById("entropy-verdict");

  function analyzeEntropy(pwd) {
    if (!pwd) {
      entropyBar.style.width = "0%";
      entropyBits.textContent = "0 bits";
      crackTime.textContent = "Instantané";
      entropyVerdict.textContent = "Critique";
      return;
    }

    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;

    const bits = Math.round(pwd.length * Math.log2(poolSize || 1));
    entropyBits.textContent = `${bits} bits`;

    const guesses = Math.pow(2, bits);
    const seconds = guesses / 1e11;

    if (seconds < 1) crackTime.textContent = "Instantané";
    else if (seconds < 60)
      crackTime.textContent = `${Math.round(seconds)} secondes`;
    else if (seconds < 3600)
      crackTime.textContent = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400)
      crackTime.textContent = `${Math.round(seconds / 3600)} heures`;
    else if (seconds < 31536000)
      crackTime.textContent = `${Math.round(seconds / 86400)} jours`;
    else if (seconds < 31536000 * 1000)
      crackTime.textContent = `${Math.round(seconds / 31536000)} ans`;
    else crackTime.textContent = "Plusieurs millénaires";

    const percentage = Math.min(100, (bits / 128) * 100);
    entropyBar.style.width = `${percentage}%`;

    if (bits < 50) {
      entropyBar.style.backgroundColor = "#ef4444";
      entropyVerdict.textContent = "Faible";
    } else if (bits < 80) {
      entropyBar.style.backgroundColor = "#f59e0b";
      entropyVerdict.textContent = "Moyen";
    } else if (bits < 110) {
      entropyBar.style.backgroundColor = "#10b981";
      entropyVerdict.textContent = "Robuste";
    } else {
      entropyBar.style.backgroundColor = "#059669";
      entropyVerdict.textContent = "Grade Cryptographique";
    }
  }

  auditInput.addEventListener("input", () => {
    analyzeEntropy(auditInput.value);
  });

  generateSecurePassword();
});
