/**
 * Application Carte de Visite Digitale & QR Code Pro - Web & Passion
 * Interactivité complète, génération QR Code hors-ligne, vCard et PWA
 */
document.addEventListener("DOMContentLoaded", function () {
    // 1. Menu Mobile Burger
    const burgerBtn = document.getElementById("burgerBtn");
    const appNav = document.getElementById("appNav");

    if (burgerBtn && appNav) {
        burgerBtn.addEventListener("click", function () {
            const isOpen = appNav.classList.toggle("active");
            burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    // 2. Génération et téléchargement direct du fichier Contact (.vcf)
    const saveContactBtn = document.getElementById("saveContactBtn");
    if (saveContactBtn) {
        saveContactBtn.addEventListener("click", function () {
            const vCardData = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                "N:JIREAU;Philippe;;;",
                "FN:Philippe JIREAU",
                "ORG:Web & Passion",
                "TITLE:Conseiller & Développeur Web",
                "TEL;TYPE=CELL:0771236136",
                "EMAIL:bonjour@webetpassion.fr",
                "URL:https://webetpassion.fr",
                "ADR;TYPE=WORK:;;201 B Résidence Les Jardins de Marie;Saint-Maximin-la-Sainte-Baume;;83470;France",
                "NOTE:Création et dépannage de sites internet, assistance web, référencement SEO et solutions digitales.",
                "END:VCARD"
            ].join("\r\n");

            const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "contact-philippe-jireau.vcf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // 3. Partage natif sur smartphone (Web Share API)
    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
        shareBtn.addEventListener("click", async function () {
            const shareData = {
                title: "Philippe JIREAU — Web & Passion",
                text: "Voici les coordonnées professionnelles de Philippe JIREAU (Web & Passion) :",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    // Annulation de l'utilisateur
                }
            } else {
                // Si sur ordinateur sans API Share : copie le lien dans le presse-papier
                navigator.clipboard.writeText(window.location.href).then(function () {
                    alert("Lien de la carte de visite copié dans votre presse-papier !");
                }).catch(function () {
                    alert("Lien : " + window.location.href);
                });
            }
        });
    }

    // 4. Génération du QR Code SVG Haute Définition
    const qrContainer = document.getElementById("qrcodeCanvasWrap");
    const targetUrl = "https://webetpassion.fr/apps/carte-visite-qr/";

    // Générateur QR Code SVG autonome (ISO/IEC 18004, Versions 1 à 6, correction M)
    function generateQrSvg(url) {
        const bytes = new TextEncoder().encode(url);
        const SPECS = [
            null,
            { size: 21, cap: 14, blocks: 1, dc: 16, ec: 10, align: [] },
            { size: 25, cap: 26, blocks: 1, dc: 28, ec: 16, align: [6, 18] },
            { size: 29, cap: 42, blocks: 1, dc: 44, ec: 26, align: [6, 22] },
            { size: 33, cap: 62, blocks: 2, dc: 32, ec: 18, align: [6, 26] },
            { size: 37, cap: 84, blocks: 2, dc: 43, ec: 24, align: [6, 30] },
            { size: 41, cap: 106, blocks: 4, dc: 27, ec: 16, align: [6, 34] }
        ];
        const spec = SPECS.find((s) => s && bytes.length <= s.cap) || SPECS[6];
        const size = spec.size;
        const totalData = spec.blocks * spec.dc;

        // Encodage des bits (Mode Byte 0100 + longueur 8 bits + octets + bourrage)
        const bits = [];
        const pushBits = (val, len) => {
            for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
        };
        pushBits(0b0100, 4);
        pushBits(bytes.length, 8);
        for (const b of bytes) pushBits(b, 8);
        pushBits(0, Math.min(4, totalData * 8 - bits.length));
        while (bits.length % 8 !== 0) bits.push(0);
        const dataBytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            let v = 0;
            for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
            dataBytes.push(v);
        }
        let padToggle = 0;
        while (dataBytes.length < totalData) {
            dataBytes.push(padToggle === 0 ? 0xec : 0x11);
            padToggle ^= 1;
        }

        // Arithmétique GF(256) & Reed-Solomon
        const gfMul = (a, b) => {
            let r = 0;
            for (let i = 0; i < 8; i++) {
                if (b & 1) r ^= a;
                const hi = a & 0x80;
                a = (a << 1) & 0xff;
                if (hi) a ^= 0x1d;
                b >>>= 1;
            }
            return r;
        };
        let gen = [1];
        let root = 1;
        for (let i = 0; i < spec.ec; i++) {
            const next = new Array(gen.length + 1).fill(0);
            for (let j = 0; j < gen.length; j++) {
                next[j] ^= gen[j];
                next[j + 1] ^= gfMul(gen[j], root);
            }
            gen = next;
            root = gfMul(root, 2);
        }
        const rsCompute = (block) => {
            const rem = new Array(spec.ec).fill(0);
            for (const b of block) {
                const factor = b ^ rem.shift();
                rem.push(0);
                for (let j = 0; j < spec.ec; j++) rem[j] ^= gfMul(gen[j + 1], factor);
            }
            return rem;
        };

        const dBlocks = [];
        const eBlocks = [];
        for (let b = 0; b < spec.blocks; b++) {
            const slice = dataBytes.slice(b * spec.dc, (b + 1) * spec.dc);
            dBlocks.push(slice);
            eBlocks.push(rsCompute(slice));
        }
        const codewords = [];
        for (let i = 0; i < spec.dc; i++) for (let b = 0; b < spec.blocks; b++) codewords.push(dBlocks[b][i]);
        for (let i = 0; i < spec.ec; i++) for (let b = 0; b < spec.blocks; b++) codewords.push(eBlocks[b][i]);

        // Matrice & motifs fixes
        const grid = Array.from({ length: size }, () => new Array(size).fill(null));
        const isFunc = Array.from({ length: size }, () => new Array(size).fill(false));
        const setFunc = (r, c, val) => {
            if (r >= 0 && r < size && c >= 0 && c < size) {
                grid[r][c] = val ? 1 : 0;
                isFunc[r][c] = true;
            }
        };
        const drawFinder = (r0, c0) => {
            for (let dr = -1; dr <= 7; dr++) {
                for (let dc = -1; dc <= 7; dc++) {
                    const inside = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
                    const dark = inside && (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
                    setFunc(r0 + dr, c0 + dc, dark);
                }
            }
        };
        drawFinder(0, 0);
        drawFinder(0, size - 7);
        drawFinder(size - 7, 0);

        for (let i = 8; i < size - 8; i++) {
            setFunc(6, i, i % 2 === 0);
            setFunc(i, 6, i % 2 === 0);
        }
        for (const r of spec.align) {
            for (const c of spec.align) {
                if (isFunc[r][c]) continue;
                for (let dr = -2; dr <= 2; dr++) {
                    for (let dc = -2; dc <= 2; dc++) {
                        const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
                        setFunc(r + dr, c + dc, dark);
                    }
                }
            }
        }
        setFunc(size - 8, 8, 1);

        // Réserver les zones d'info de format
        for (let i = 0; i < 9; i++) {
            if (i !== 6) { setFunc(8, i, 0); setFunc(i, 8, 0); }
        }
        for (let i = 0; i < 8; i++) {
            setFunc(8, size - 1 - i, 0);
            if (i < 7) setFunc(size - 1 - i, 8, 0);
        }

        // Placement des bits de données en zig-zag
        let bitIdx = 0;
        const totalBits = codewords.length * 8;
        for (let right = size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (let vert = 0; vert < size; vert++) {
                for (let j = 0; j < 2; j++) {
                    const col = right - j;
                    const upward = ((right + 1) & 2) === 0;
                    const row = upward ? size - 1 - vert : vert;
                    if (!isFunc[row][col]) {
                        let bit = 0;
                        if (bitIdx < totalBits) {
                            bit = (codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1;
                            bitIdx++;
                        }
                        grid[row][col] = bit;
                    }
                }
            }
        }

        const maskFns = [
            (r, c) => (r + c) % 2 === 0,
            (r) => r % 2 === 0,
            (_, c) => c % 3 === 0,
            (r, c) => (r + c) % 3 === 0,
            (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
            (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
            (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
            (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
        ];

        const applyMaskAndFormat = (maskId) => {
            const m = grid.map((row) => row.slice());
            const fn = maskFns[maskId];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (!isFunc[r][c] && fn(r, c)) m[r][c] ^= 1;
                }
            }
            // Format info : ECC M (00) + maskId (3 bits)
            const data5 = (0b00 << 3) | maskId;
            let rem = data5 << 10;
            for (let i = 14; i >= 10; i--) {
                if ((rem >>> i) & 1) rem ^= 0x537 << (i - 10);
            }
            const fmt = ((data5 << 10) | rem) ^ 0x5412;
            for (let i = 0; i < 6; i++) m[8][i] = (fmt >>> (14 - i)) & 1;
            m[8][7] = (fmt >>> 8) & 1;
            m[8][8] = (fmt >>> 7) & 1;
            m[7][8] = (fmt >>> 6) & 1;
            for (let i = 0; i < 6; i++) m[i][8] = (fmt >>> i) & 1;
            for (let i = 0; i < 7; i++) m[size - 1 - i][8] = (fmt >>> (14 - i)) & 1;
            for (let i = 0; i < 8; i++) m[8][size - 8 + i] = (fmt >>> (7 - i)) & 1;
            return m;
        };

        const scorePenalty = (m) => {
            let pen = 0;
            for (let r = 0; r < size; r++) {
                let runR = 1, runC = 1;
                for (let c = 1; c < size; c++) {
                    runR = m[r][c] === m[r][c - 1] ? runR + 1 : 1;
                    if (runR === 5) pen += 3; else if (runR > 5) pen += 1;
                    runC = m[c][r] === m[c - 1][r] ? runC + 1 : 1;
                    if (runC === 5) pen += 3; else if (runC > 5) pen += 1;
                }
            }
            for (let r = 0; r < size - 1; r++) {
                for (let c = 0; c < size - 1; c++) {
                    const v = m[r][c];
                    if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) pen += 3;
                }
            }
            return pen;
        };

        let bestMat = applyMaskAndFormat(0);
        let bestScore = scorePenalty(bestMat);
        for (let k = 1; k < 8; k++) {
            const cand = applyMaskAndFormat(k);
            const sc = scorePenalty(cand);
            if (sc < bestScore) { bestScore = sc; bestMat = cand; }
        }

        const quiet = 4;
        const vb = size + quiet * 2;
        let pathD = "";
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (bestMat[r][c]) pathD += `M${c + quiet},${r + quiet}h1v1h-1z`;
            }
        }
        return `<svg viewBox="0 0 ${vb} ${vb}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR Code vers ${url}">
            <rect width="${vb}" height="${vb}" fill="#ffffff"/>
            <path d="${pathD}" fill="#0f172a"/>
        </svg>`;
    }

    if (qrContainer) {
        qrContainer.innerHTML = generateQrSvg(targetUrl);
    }

    // Téléchargement du QR Code en SVG
    const downloadQrSvgBtn = document.getElementById("downloadQrSvgBtn");
    if (downloadQrSvgBtn) {
        downloadQrSvgBtn.addEventListener("click", function () {
            const svgContent = generateQrSvg(targetUrl);
            const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "qrcode-pro-web-passion.svg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Téléchargement du QR Code en PNG HD via Canvas
    const downloadQrPngBtn = document.getElementById("downloadQrPngBtn");
    if (downloadQrPngBtn) {
        downloadQrPngBtn.addEventListener("click", function () {
            const svgContent = generateQrSvg(targetUrl);
            const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = 1000;
                canvas.height = 1000;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 1000, 1000);

                canvas.toBlob(function (pngBlob) {
                    const pngUrl = URL.createObjectURL(pngBlob);
                    const a = document.createElement("a");
                    a.href = pngUrl;
                    a.download = "qrcode-pro-web-passion.png";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(pngUrl);
                    URL.revokeObjectURL(url);
                });
            };
            img.src = url;
        });
    }

    // 5. Enregistrement PWA (Service Worker)
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(function (err) {
            console.warn("Service Worker carte non actif en local :", err);
        });
    }

    let deferredPrompt;
    const installPwaBtn = document.getElementById("installPwaBtn");

    window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        if (installPwaBtn) {
            installPwaBtn.hidden = false;
        }
    });

    if (installPwaBtn) {
        installPwaBtn.addEventListener("click", function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () {
                    deferredPrompt = null;
                    installPwaBtn.hidden = true;
                });
            }
        });
    }
});

