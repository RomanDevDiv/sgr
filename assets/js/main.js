// Main JS - v1.2

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSmoothScroll();
    initAccordions();
    initModals();
    initForm();
    initScrollToTop();
    initMap(); // Yandex Map
    initScrollProgress(); // Scroll Progress Bar
});

/* --- Header & Mobile Menu --- */
function initHeader() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Sticky header shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active menu highlight
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Offset for header (80px) + some buffer
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Handle Logo or Top Links
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/* --- Accordions --- */
function initAccordions() {
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.accordion-content');

            // Toggle open class
            item.classList.toggle('open');

            // Toggle Height
            if (item.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }
        });
    });
}

/* --- Modals for Docs --- */
function initModals() {
    const modal = document.getElementById('pdfModal');
    if (!modal) return;

    const iframe = document.getElementById('pdfFrame');
    const closeBtn = document.querySelector('.close-modal');

    // Open
    document.querySelectorAll('.open-doc').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const docName = btn.getAttribute('data-doc');
            // Assuming docs are in assets/documents/
            // If checking local file system, ensure path is correct
            iframe.src = `assets/documents/${docName}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => modal.classList.add('show'), 10);
        });
    });

    // Close
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            iframe.src = '';
            document.body.style.overflow = '';
        }, 300);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

/* 
   EMAIL JS CONFIGURATION GUIDE:
   1. Register at https://www.emailjs.com/
   2. Create a "Service" (e.g. Gmail) -> get SERVICE_ID
   3. Create a "Template" (Design your email) -> get TEMPLATE_ID
   4. Go to "Account" -> "API Keys" -> get PUBLIC_KEY
   5. Fill in the variables below:
*/

/* --- Form (EmailJS + IMask) --- */
function initForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    // 1. IMask
    const phoneInput = document.getElementById('phone');
    if (phoneInput && window.IMask) {
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    // 2. EmailJS Initialization
    // REPLACE THESE PLACEHOLDERS WITH YOUR REAL KEYS
    // ===============================================
    const emailConfig = {
        publicKey: 'YOUR_PUBLIC_KEY', // e.g. 'user_123456789'
        serviceID: 'YOUR_SERVICE_ID', // e.g. 'service_gmail'
        templateID: 'YOUR_TEMPLATE_ID', // e.g. 'template_contact'
    };
    // ===============================================

    // Initialize EmailJS if key is present
    if (emailConfig.publicKey !== 'YOUR_PUBLIC_KEY' && window.emailjs) {
        emailjs.init(emailConfig.publicKey);
    }

    // 3. Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.submit-btn');
        btn.classList.add('loading');
        btn.disabled = true;

        const formData = {
            name: form.name.value,
            phone: form.phone.value,
            productType: form.productType.value,
            message: form.message.value
        };

        try {
            if (emailConfig.publicKey !== 'YOUR_PUBLIC_KEY' && window.emailjs) {
                // REAL SENDING
                await emailjs.send(emailConfig.serviceID, emailConfig.templateID, formData);
                showNotification('Спасибо! Ваша заявка успешно отправлена.', 'success');
            } else {
                // DEMO MODE (Simulation)
                console.log('Demo Send:', formData);
                await new Promise(r => setTimeout(r, 1500));
                showNotification('Демо-режим: Заявка "отправлена"! (Настройте EmailJS)', 'success');
            }

            form.reset();

        } catch (err) {
            console.error('EmailJS Error:', err);
            showNotification('Ошибка отправки. Пожалуйста, позвоните нам.', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
}

function showNotification(msg, type) {
    // If notification container doesn't exist, create one? 
    // Usually we just append to body as fixed element
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.innerText = msg;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

/* --- Scroll To Top --- */
function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    // Always make visible as per request
    btn.classList.add('visible');

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- Yandex Map --- */
function initMap() {
    // Check if ymaps loaded (it will fail without API key usually in console, but we handle logic)
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(() => {
        const center = [59.888811, 30.279960]; // BC Propaganda

        const map = new ymaps.Map("yandex-map", {
            center: center,
            zoom: 16,
            controls: ['zoomControl']
        });

        const placemark = new ymaps.Placemark(center, {
            balloonContent: 'ООО "СЗЦЭК"<br>БЦ Пропаганда, офис 815'
        });

        map.geoObjects.add(placemark);
        // Disable scroll zoom
        map.behaviors.disable('scrollZoom');
    });
}

/* --- Scroll Progress Bar --- */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}
