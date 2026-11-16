// =========================================================
// FOND MUSICAL D'AMBIANCE (ARPÈGE DOUX PIANO / HARPE)
// =========================================================

(function initAmbientMusic() {
  const STORAGE_KEY = "webp_audio_state";
  const toggleBtn = document.querySelector("#audio-toggle");
  const labelSpan = toggleBtn?.querySelector(".audio-label");
  if (!toggleBtn) return;

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let stepTimer = null;
  let stepIndex = 0;

  // Progression arpégée douce : Cmaj9 -> Am9 -> Fmaj9 -> G6 (8 notes par mesure)
  const arpeggios = [
    [261.63, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63],
    [220.0, 329.63, 392.0, 493.88, 523.25, 493.88, 392.0, 329.63],
    [174.61, 261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63],
    [196.0, 293.66, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66],
  ];
  const allNotes = arpeggios.flat();

  function playPluckedNote(freq) {
    if (!audioCtx || !masterGain || !isPlaying) return;

    const now = audioCtx.currentTime;
    const oscFund = audioCtx.createOscillator();
    const oscHarm = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const noteGain = audioCtx.createGain();
    const harmGain = audioCtx.createGain();

    oscFund.type = "sine";
    oscFund.frequency.setValueAtTime(freq, now);

    oscHarm.type = "triangle";
    oscHarm.frequency.setValueAtTime(freq * 2, now);
    harmGain.gain.setValueAtTime(0.18, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(550, now + 1.8);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.045, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

    oscFund.connect(filter);
    oscHarm.connect(harmGain);
    harmGain.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    oscFund.start(now);
    oscHarm.start(now);
    oscFund.stop(now + 2.35);
    oscHarm.stop(now + 2.35);
  }

  function scheduleNextNote() {
    if (!isPlaying) return;
    playPluckedNote(allNotes[stepIndex]);
    stepIndex = (stepIndex + 1) % allNotes.length;
    stepTimer = setTimeout(scheduleNextNote, 430);
  }

  function updateUI() {
    toggleBtn.classList.toggle("playing", isPlaying);
    toggleBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    toggleBtn.setAttribute(
      "aria-label",
      isPlaying
        ? "Couper le fond musical d'ambiance"
        : "Activer le fond musical d'ambiance",
    );
    if (labelSpan) {
      labelSpan.textContent = isPlaying ? "Ambiance ON" : "Ambiance";
    }
  }

  function saveState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, state);
    } catch {
      // Ignorer si sessionStorage est bloqué
    }
  }

  function getSavedState() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function startMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (stepTimer) {
      clearTimeout(stepTimer);
      stepTimer = null;
    }

    isPlaying = true;
    saveState("on");
    updateUI();
    scheduleNextNote();
  }

  function stopMusic() {
    isPlaying = false;
    saveState("off");
    updateUI();
    if (stepTimer) {
      clearTimeout(stepTimer);
      stepTimer = null;
    }
    if (audioCtx && audioCtx.state === "running") {
      audioCtx.suspend();
    }
  }

  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    cleanupListeners();
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  const navLinks = Array.from(document.querySelectorAll(".nav a"));

  function handleNavClick() {
    if (isPlaying || getSavedState() === "off") return;
    startMusic();
    cleanupListeners();
  }

  function cleanupListeners() {
    navLinks.forEach((link) => {
      link.removeEventListener("click", handleNavClick);
    });
  }

  if (getSavedState() !== "off") {
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavClick, { passive: true });
    });
  }
})();

