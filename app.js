/* ==========================================================================
   JBAE 2026 - Interactive Application Logic & Canvas Badge Generator
   ========================================================================== */

// Global State
let badgeState = {
    fullname: "",
    title: "",
    role: "PARTICIPANT",
    theme: "emerald",
    photoImage: null
};

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initBadgeGenerator();
    initMobileNav();
    initHeaderScroll();
    initScrollSnapDots();
});

/* --------------------------------------------------------------------------
   1. Countdown Timer (Target: Nov 15, 2026)
   -------------------------------------------------------------------------- */
function initCountdown() {
    const eventDate = new Date("November 15, 2026 08:30:00").getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const diff = eventDate - now;

        if (diff <= 0) {
            document.getElementById("countdown-timer").innerHTML = "<div class='time-box'><span class='time-value'>L'Événement est en cours !</span></div>";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   2. Badge Generator – Template-Based Renderer
   Uses badge-template.png as background and places user photo into the
   frame on the left side of the template.
   -------------------------------------------------------------------------- */

// Robust preloader for badge template image
let badgeTemplateImg = new Image();
let badgeTemplateReady = false;

function setupBadgeTemplateImage() {
    badgeTemplateImg.onload = () => {
        badgeTemplateReady = true;
        updateBadgeCanvas();
    };
    badgeTemplateImg.onerror = () => {
        console.warn("Retrying with assets/badge-template.jpg...");
        if (!badgeTemplateImg.src.includes(".jpg")) {
            badgeTemplateImg.src = "assets/badge-template.jpg";
        }
    };

    // Use embedded Base64 data if available (100% canvas exportable on file:// without tainting)
    if (typeof BADGE_TEMPLATE_DATA !== "undefined" && BADGE_TEMPLATE_DATA) {
        badgeTemplateImg.src = BADGE_TEMPLATE_DATA;
    } else {
        badgeTemplateImg.src = "assets/badge-template.png";
    }
}
setupBadgeTemplateImage();

// Also preload logo (kept for possible future use)
let jbaeLogoImg = new Image();
jbaeLogoImg.src = "assets/logo-jbae.png";

function initBadgeGenerator() {
    // Attempt drawing immediately
    updateBadgeCanvas();

    // In case image loads slightly after DOMContentLoaded, poll until ready
    let attempts = 0;
    const pollInterval = setInterval(() => {
        attempts++;
        if (badgeTemplateImg.complete && badgeTemplateImg.naturalWidth > 0) {
            badgeTemplateReady = true;
            updateBadgeCanvas();
            clearInterval(pollInterval);
        } else if (attempts > 30) {
            clearInterval(pollInterval);
        }
    }, 100);
}

function updateBadgeCanvas() {
    const canvas = document.getElementById("badgeCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;   // 1254
    const H = canvas.height;  // 1254

    ctx.clearRect(0, 0, W, H);

    // The template (badge-template.png) is now a CUTOUT:
    // the inner black card area is transparent (alpha=0).
    // Strategy:
    //   Layer 1 (bottom): white/light bg (to avoid transparent canvas corners)
    //   Layer 2 (middle): user photo, drawn to fill the quad + 8px bleed
    //   Layer 3 (top):    badge-template-cutout — border/border masks the photo edges perfectly
    //
    // Inner card corners (from BFS on 1254×1254):
    //   TL ≈ (74, 254)   TR ≈ (577, 215)
    //   BL ≈ (109, 896)  BR ≈ (624, 856)
    // Bounding box of fill zone (with 8px bleed): X=[62, 636], Y=[198, 914]

    const scale = W / 1254;

    // --- Layer 1: solid light background (prevents transparent canvas corners) ---
    ctx.fillStyle = "#f9f7f2";
    ctx.fillRect(0, 0, W, H);

    // --- Layer 2: photo / placeholder drawn in the card's bounding box ---
    // Bounding box of the card zone + 8px bleed on each side:
    const cardX = 62 * scale;
    const cardY = 198 * scale;
    const cardW = (636 - 62) * scale;  // 574 * scale
    const cardH = (914 - 198) * scale; // 716 * scale

    if (badgeState.photoImage) {
        const img = badgeState.photoImage;
        const imgAspect = img.width / img.height;
        const cardAspect = cardW / cardH;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > cardAspect) {
            drawH = cardH;
            drawW = drawH * imgAspect;
            drawX = cardX + (cardW - drawW) / 2;
            drawY = cardY;
        } else {
            drawW = cardW;
            drawH = drawW / imgAspect;
            drawX = cardX;
            drawY = cardY + (cardH - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
        // Dark placeholder card background
        ctx.fillStyle = "#0e1510";
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Camera icon circle
        ctx.fillStyle = "rgba(82, 183, 136, 0.22)";
        ctx.beginPath();
        ctx.arc(cardX + cardW / 2, cardY + cardH / 2 - 40 * scale, 62 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#52B788";
        ctx.font = `bold ${50 * scale}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("📷", cardX + cardW / 2, cardY + cardH / 2 - 18 * scale);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${24 * scale}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillText("Votre Photo ici", cardX + cardW / 2, cardY + cardH / 2 + 55 * scale);

        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.font = `${18 * scale}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillText("Cliquez à gauche pour importer", cardX + cardW / 2, cardY + cardH / 2 + 90 * scale);
    }

    // --- Layer 3: cutout template overlay (border masks the photo perfectly) ---
    if (badgeTemplateImg && badgeTemplateImg.complete && badgeTemplateImg.naturalWidth > 0) {
        ctx.drawImage(badgeTemplateImg, 0, 0, W, H);
    } else {
        // Template not yet loaded — show loading message over placeholder
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#52B788";
        ctx.font = `bold ${26 * scale}px 'Outfit', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Chargement du badge officiel...", W / 2, H / 2);
    }
}


// Helper: Custom Canvas Rounded Rectangle
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') radius = 0;
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

// Handle Photo Upload File Input
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            badgeState.photoImage = img;
            updateBadgeCanvas();
            const zone = document.getElementById("photo-upload-zone");
            if (zone) {
                zone.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
                        <img src="${e.target.result}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid #52B788;" />
                        <div style="text-align:left;">
                            <strong style="color:#2D6A4F; display:block; font-size:0.9rem;"><i class="fa-solid fa-circle-check"></i> Photo importée !</strong>
                            <small style="color:#5C6E66;">Cliquer pour changer de photo</small>
                        </div>
                    </div>
                `;
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Change Badge Theme
function changeBadgeTheme(themeName) {
    badgeState.theme = themeName;
    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === themeName);
    });
    updateBadgeCanvas();
}

// Download Badge as PNG HD
function downloadBadge() {
    const canvas = document.getElementById("badgeCanvas");
    if (!canvas) return;

    const btn = document.getElementById("btn-download-badge");

    const onDownloadDone = () => {
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Badge téléchargé !`;
            btn.classList.add("btn-success-state");

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove("btn-success-state");
            }, 2500);
        }
    };

    const triggerDownload = (url) => {
        const link = document.createElement("a");
        link.download = "Badge_JySerai_JBAE2026.png";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onDownloadDone();
    };

    try {
        if (canvas.toBlob) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url);
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                } else {
                    const dataUrl = canvas.toDataURL("image/png", 1.0);
                    triggerDownload(dataUrl);
                }
            }, "image/png", 1.0);
        } else {
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            triggerDownload(dataUrl);
        }
    } catch (err) {
        console.error("Canvas export error:", err);
        try {
            const dataUrl = canvas.toDataURL("image/png");
            triggerDownload(dataUrl);
        } catch (e2) {
            alert("Erreur lors de l'export du canvas. Si vous visualisez via file://, nous recommandons d'ouvrir avec un serveur local.");
        }
    }
}

// Copy Share Text for WhatsApp / LinkedIn
function copyShareText() {
    const shareText = `🌿 J'Y SERAI ! Je participerai à la 2ᵉ Édition de la Journée Béninoise de l'Agroécologie (JBAE 2026) du 15 au 17 Novembre 2026 à Cotonou !\n\nUn rendez-vous incontournable pour célébrer l'agroécologie, les savoirs locaux et les opportunités pour la jeunesse béninoise.\n\n👉 Générez votre badge et inscrivez-vous sur : https://www.jbae-benin.org #JBAE2026 #AgroécologieBénin`;

    const setSuccessState = () => {
        const btn = document.getElementById("btn-copy-share");
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Texte copié !`;
            btn.classList.add("btn-success-state");

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove("btn-success-state");
            }, 2500);
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(setSuccessState).catch(() => {
            prompt("Copiez ce message pour vos réseaux sociaux :", shareText);
            setSuccessState();
        });
    } else {
        prompt("Copiez ce message pour vos réseaux sociaux :", shareText);
        setSuccessState();
    }
}

/* --------------------------------------------------------------------------
   3. Promoter Video Script Editor Drawer
   -------------------------------------------------------------------------- */
function toggleTextEdit() {
    const drawer = document.getElementById("edit-drawer");
    if (drawer) drawer.classList.toggle("hidden");
}

function updatePromoterText() {
    const userText = document.getElementById("user-promo-text").value.trim();
    if (!userText) {
        alert("Veuillez saisir ou coller un texte.");
        return;
    }

    const displayContainer = document.getElementById("promoter-text-display");
    if (displayContainer) {
        // Format paragraphs
        const paragraphs = userText.split('\n\n').map((p, index) => {
            if (index === 0) return `<p class="lead-text">"${p}"</p>`;
            return `<p>${p}</p>`;
        }).join('');

        displayContainer.innerHTML = paragraphs;
        alert("Le texte de présentation du site a été mis à jour avec le message du promoteur !");
        toggleTextEdit();
    }
}

/* --------------------------------------------------------------------------
   4. Program Tabs & Gallery Filter
   -------------------------------------------------------------------------- */
function switchTab(dayId) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

    event.currentTarget.classList.add("active");
    const targetContent = document.getElementById(dayId);
    if (targetContent) targetContent.classList.add("active");
}

// Gallery Filtering
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const filter = e.currentTarget.dataset.filter;
        document.querySelectorAll(".gallery-item").forEach(item => {
            if (filter === "all" || item.dataset.category === filter) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

/* --------------------------------------------------------------------------
   5. Registration Modal & Mobile Navigation
   -------------------------------------------------------------------------- */
function openRegisterModal(packValue = '') {
    const modal = document.getElementById("register-modal");
    if (modal) {
        modal.classList.remove("hidden");
        document.getElementById("registration-form").classList.remove("hidden");
        document.getElementById("modal-success").classList.add("hidden");
        if (packValue) {
            const packSelect = document.getElementById("reg-pack");
            if (packSelect) {
                packSelect.value = packValue;
                updatePriceSummary();
            }
        }
    }
}

function updatePriceSummary() {
    const packSelect = document.getElementById("reg-pack");
    const summaryAmount = document.getElementById("price-summary-amount");
    if (!packSelect || !summaryAmount) return;

    const val = packSelect.value;
    if (val === "PASS_SIMPLE") {
        summaryAmount.textContent = "2 000 FCFA";
    } else if (val === "PACK_COMPLET") {
        summaryAmount.textContent = "3 000 FCFA";
    } else if (val === "STAND_EXPOSANT") {
        summaryAmount.textContent = "5 000 FCFA";
    }
}

function closeRegisterModal() {
    const modal = document.getElementById("register-modal");
    if (modal) modal.classList.add("hidden");
}

/* ==========================================================================
   EmailJS Configuration & Confirmation Mail Dispatcher
   ========================================================================== */
const EMAILJS_CONFIG = {
    // Remplacer ces 3 clés une fois votre compte EmailJS créé (gratuit sur https://www.emailjs.com)
    PUBLIC_KEY: "VOTRE_PUBLIC_KEY",      // ex: "uXy7z8AbCdEf"
    SERVICE_ID: "VOTRE_SERVICE_ID",      // ex: "service_jbae2026"
    TEMPLATE_ID: "VOTRE_TEMPLATE_ID"     // ex: "template_confirmation"
};

// Initialisation SDK EmailJS si configuré
if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY !== "VOTRE_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
}

async function sendConfirmationEmail(data) {
    if (typeof emailjs === "undefined") {
        console.warn("EmailJS SDK non chargé.");
        return;
    }

    if (EMAILJS_CONFIG.PUBLIC_KEY === "VOTRE_PUBLIC_KEY") {
        console.info(
            "ℹ️ EmailJS en attente de configuration. Les données prêtes à être envoyées :",
            data
        );
        return;
    }

    const templateParams = {
        to_name: `${data.firstname} ${data.lastname}`,
        to_email: data.email,
        phone: data.phone,
        pack_name: data.packLabel,
        amount: data.amountText,
        category: data.categoryLabel,
        beneficiary_name: "Grâce FATON",
        momo_number: "+229 43 18 23 13",
        whatsapp_link: data.whatsappUrl
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        console.log("✅ E-mail de confirmation envoyé avec succès !", response.status, response.text);
    } catch (err) {
        console.error("❌ Échec de l'envoi de l'e-mail EmailJS :", err);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const firstname = document.getElementById("reg-firstname").value.trim();
    const lastname = document.getElementById("reg-lastname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const packSelect = document.getElementById("reg-pack");
    const packValue = packSelect ? packSelect.value : "";
    const packLabel = packSelect && packSelect.selectedIndex >= 0 ? packSelect.options[packSelect.selectedIndex].text : packValue;
    const categorySelect = document.getElementById("reg-category");
    const category = categorySelect ? categorySelect.value : "PARTICIPANT";
    const categoryLabel = categorySelect && categorySelect.selectedIndex >= 0 ? categorySelect.options[categorySelect.selectedIndex].text : category;

    // Determine amount
    let amountText = "2 000 FCFA";
    if (packValue === "PACK_COMPLET") amountText = "3 000 FCFA";
    else if (packValue === "STAND_EXPOSANT") amountText = "5 000 FCFA";

    // Update Badge State automatically with registered name
    badgeState.fullname = `${firstname} ${lastname}`.toUpperCase();
    badgeState.role = category || "PARTICIPANT";

    const fullnameInput = document.getElementById("badge-fullname");
    if (fullnameInput) fullnameInput.value = `${firstname} ${lastname}`;

    updateBadgeCanvas();

    // Prepare WhatsApp Message to 43182313 (+22943182313)
    const whatsappNumber = "22943182313";
    const messageLines = [
        "🌿 *NOUVELLE INSCRIPTION - JBAE 2026*",
        "------------------------------------",
        `👤 *Nom & Prénom :* ${lastname.toUpperCase()} ${firstname}`,
        `📱 *Téléphone / WhatsApp :* ${phone}`,
        `📧 *Email :* ${email}`,
        `🏷️ *Formule :* ${packLabel}`,
        `💰 *Montant :* ${amountText}`,
        `🎯 *Profil / Rôle :* ${categoryLabel}`,
        "------------------------------------",
        "💳 *Paiement :* MoMo / Flooz vers Grâce FATON (+229 43 18 23 13) ou à l'accueil",
        "------------------------------------",
        "📍 _Message envoyé depuis le site officiel de la JBAE 2026_"
    ];
    const encodedMessage = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Update the fallback / reopen link in modal success
    const reopenBtn = document.getElementById("btn-reopen-whatsapp");
    if (reopenBtn) {
        reopenBtn.href = whatsappUrl;
    }

    // Trigger EmailJS Confirmation
    sendConfirmationEmail({
        firstname,
        lastname,
        email,
        phone,
        packLabel,
        amountText,
        categoryLabel,
        whatsappUrl
    });

    // Show Success State inside modal
    document.getElementById("registration-form").classList.add("hidden");
    document.getElementById("modal-success").classList.remove("hidden");

    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, "_blank");
}

function scrollToBadge() {
    const badgeSection = document.getElementById("badge-section");
    if (badgeSection) badgeSection.scrollIntoView({ behavior: 'smooth' });
}

function initMobileNav() {
    const menuBtn = document.getElementById("hamburger-menu");
    const navLinks = document.getElementById("nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                if (isActive) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile menu when clicking any navigation link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });

        // Close when clicking outside navbar
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuBtn.setAttribute("aria-expanded", "false");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   Auto-Hiding & Revealing Header on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    const scrollThreshold = 80;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const navLinks = document.getElementById("nav-links");

        // Do not hide navbar if mobile menu is open
        if (navLinks && navLinks.classList.contains("active")) {
            return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            // Glissement vers le bas -> Masquer le header
            navbar.classList.add("nav-hidden");
        } else if (currentScrollY < lastScrollY) {
            // Glissement vers le haut -> Faire réapparaître le header
            navbar.classList.remove("nav-hidden");
        }

        if (currentScrollY <= scrollThreshold) {
            navbar.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   Side Scroll-Snap Navigation & Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollSnapDots() {
    const sections = document.querySelectorAll("section");
    const dotItems = document.querySelectorAll(".side-dots .dot-item");
    if (!sections.length || !dotItems.length) return;

    const observerOptions = {
        root: null,
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                dotItems.forEach((dot) => {
                    if (dot.getAttribute("data-section") === id) {
                        dot.classList.add("active");
                    } else {
                        dot.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
}

