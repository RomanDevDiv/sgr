// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initModals();
    initForm();
});

// Mobile Menu
function initMobileMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-menu');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Modals
function initModals() {
    const modal = document.getElementById('pdfModal');
    if (!modal) return;

    const iframe = document.getElementById('pdfFrame');
    const closeBtn = document.querySelector('.close-modal');
    const buttons = document.querySelectorAll('.open-doc');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const fileName = btn.getAttribute('data-doc');
            // Path relative to index.html
            const filePath = `assets/documents/${fileName}`;

            iframe.src = filePath;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    function closeModal() {
        modal.classList.remove('show');
        iframe.src = '';
        document.body.style.overflow = ''; // Enable scroll
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Form Validation
function initForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    // Phone Mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x[2] && x[1] !== '') {
                // If starting to type, add +7 prefix automatically
                // This is a simple visual mask, logic can be more complex if needed
                e.target.value = !x[1] ? '+7' : '+7 (' + x[2];
            } else {
                e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
            }
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if (name.length < 2) {
            alert('Пожалуйста, введите корректное имя');
            return;
        }

        if (phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }

        // Simulate form submission
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.innerText = 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });
}
