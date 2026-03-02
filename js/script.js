document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initSmoothScroll();
    initFaq();
    initConsultationForm();
    initDocumentPreviewModal();
    initToTopButton();
});

const SCROLL_DELAY_MS = 120;
const SCROLL_DURATION_MS = 900;
let activeScrollRaf = null;

function initMobileMenu() {
    const header = document.querySelector(".site-header");
    const toggle = document.getElementById("menuToggle");
    if (!header || !toggle) return;

    toggle.addEventListener("click", () => {
        header.classList.toggle("open");
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector(".site-header");
    const ticker = document.querySelector(".status-ticker");

    const getTopOffset = () => {
        const headerHeight = header ? header.offsetHeight : 0;
        const tickerHeight = ticker ? ticker.offsetHeight : 0;
        return headerHeight + tickerHeight + 8;
    };

    const smoothScrollTo = (targetY, delay = SCROLL_DELAY_MS) => {
        window.setTimeout(() => {
            animateScrollTo(Math.max(0, targetY), SCROLL_DURATION_MS);
        }, delay);
    };

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            event.preventDefault();

            if (link.classList.contains("logo")) {
                smoothScrollTo(0, SCROLL_DELAY_MS);
            } else {
                const target = document.querySelector(targetId);
                if (!target) return;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - getTopOffset();
                smoothScrollTo(targetTop, SCROLL_DELAY_MS);
            }

            if (header) header.classList.remove("open");
        });
    });
}

function initFaq() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const btn = item.querySelector(".faq-toggle");
        const icon = item.querySelector(".faq-icon");
        if (!btn || !icon) return;

        btn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            faqItems.forEach((other) => {
                other.classList.remove("active");
                const otherIcon = other.querySelector(".faq-icon");
                if (otherIcon) otherIcon.textContent = "+";
            });

            if (!isActive) {
                item.classList.add("active");
                icon.textContent = "-";
            }
        });

        item.addEventListener("mouseenter", () => {
            faqItems.forEach((other) => {
                other.classList.remove("active");
                const otherIcon = other.querySelector(".faq-icon");
                if (otherIcon) otherIcon.textContent = "+";
            });
            item.classList.add("active");
            icon.textContent = "-";
        });
    });
}

function initConsultationForm() {
    const form = document.querySelector(".consultation-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Заявка отправлена. Мы свяжемся с вами в ближайшее время.");
        form.reset();
    });
}

function initDocumentPreviewModal() {
    const modal = document.getElementById("certificateModal");
    const frame = document.getElementById("docPreviewFrame");
    const openButtons = document.querySelectorAll("[data-doc-open]");
    if (!modal || !frame || !openButtons.length) return;

    const closeTriggers = modal.querySelectorAll("[data-doc-close]");
    const defaultSrc = frame.getAttribute("src") || "dosc/certificate.pdf#view=FitH";

    const closeModal = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    const openModal = () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const src = button.getAttribute("data-doc-src") || defaultSrc;
            frame.setAttribute("src", encodeURI(src));
            openModal();
        });
    });

    closeTriggers.forEach((trigger) => trigger.addEventListener("click", closeModal));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}

function initToTopButton() {
    const button = document.getElementById("toTopBtn");
    if (!button) return;

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    button.addEventListener("click", () => {
        animateScrollTo(0, SCROLL_DURATION_MS);
    });
}

function animateScrollTo(targetY, durationMs) {
    if (activeScrollRaf) {
        cancelAnimationFrame(activeScrollRaf);
        activeScrollRaf = null;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
        window.scrollTo(0, Math.max(0, targetY));
        return;
    }

    const startTime = performance.now();
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
            activeScrollRaf = requestAnimationFrame(step);
        } else {
            // Snap to the exact target to avoid sub-pixel drift.
            window.scrollTo(0, Math.max(0, targetY));
            activeScrollRaf = null;
        }
    };

    activeScrollRaf = requestAnimationFrame(step);
}
