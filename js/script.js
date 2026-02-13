// Основной JavaScript файл для сайта sgrrpn.ru

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация основных функций сайта
    
    // Мобильное меню
    initMobileMenu();
    
    // Плавная прокрутка к якорям
    initSmoothScrolling();
    
    // Модальные окна
    initModals();
    
    // Аккордеон
    initAccordion();
    
    // Табы
    initTabs();
    
    // Обработчики форм
    initFormHandlers();
    
    // Галерея документов
    initDocumentGallery();
    
    // Scroll-triggered slider
    initScrollSlider();
});

// Мобильное меню
function initMobileMenu() {
    // На данный момент не реализовано, но может быть добавлено позже
}

// Плавная прокрутка к якорям
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Модальные окна
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Аккордеон
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const accordionBody = accordionItem.querySelector('.accordion-body');
            const toggleIcon = this.querySelector('.accordion-toggle');
            
            // Переключение открытого состояния
            accordionBody.classList.toggle('open');
            toggleIcon.classList.toggle('rotate');
            
            // Закрытие других аккордеонов в той же группе (если нужно)
            const parentAccordion = this.closest('.accordion');
            if (parentAccordion) {
                const allItems = parentAccordion.querySelectorAll('.accordion-item');
                
                allItems.forEach(item => {
                    if (item !== accordionItem) {
                        const body = item.querySelector('.accordion-body');
                        const icon = item.querySelector('.accordion-toggle');
                        
                        if (body && body !== accordionBody) {
                            body.classList.remove('open');
                        }
                        
                        if (icon && icon !== toggleIcon) {
                            icon.classList.remove('rotate');
                        }
                    }
                });
            }
        });
    });
}

// Табы
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabContainer = this.closest('.tabs') || this.parentElement;
            const tabId = this.getAttribute('data-tab');
            
            // Удаление активного класса со всех табов
            tabContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Добавление активного класса к текущему табу
            this.classList.add('active');
            
            // Скрытие всех контентных блоков
            const tabContents = tabContainer.parentElement.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показ нужного контентного блока
            const activeContent = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// Обработчики форм
function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показываем индикатор загрузки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';
            submitBtn.disabled = true;
            
            // Здесь будет логика отправки формы
            setTimeout(() => {
                // Симуляция успешной отправки
                alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                
                // Сброс формы
                this.reset();
                
                // Восстановление кнопки
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    });
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления (можно перенести в CSS)
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Цвет фона в зависимости от типа
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#2ecc71';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f39c12';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Функция проверки валидности email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция для форматирования телефонов (если нужно)
function formatPhone(input) {
    // Удаление всех символов кроме цифр
    let phone = input.value.replace(/\D/g, '');
    
    // Ограничение до 11 символов
    if (phone.length > 11) {
        phone = phone.substring(0, 11);
    }
    
    // Форматирование
    if (phone.length >= 1) {
        phone = '+7 (' + phone.substring(0, 3);
    }
    if (phone.length >= 5) {
        phone = phone + ') ' + phone.substring(4, 7);
    }
    if (phone.length >= 9) {
        phone = phone + '-' + phone.substring(7, 9);
    }
    if (phone.length >= 11) {
        phone = phone + '-' + phone.substring(9, 11);
    }
    
    input.value = phone;
}

// Document gallery functionality
function initDocumentGallery() {
    const documentsGrid = document.getElementById('documentsGrid');
    const documentModal = document.getElementById('documentModal');
    const modalTitle = document.getElementById('modalDocumentTitle');
    const modalFileSize = document.getElementById('modalFileSize');
    const modalFileType = document.getElementById('modalFileType');
    const documentPreview = document.getElementById('documentPreview');
    const documentLoading = document.getElementById('documentLoading');
    const downloadBtn = document.getElementById('downloadDocument');
    const closeBtn = document.getElementById('closeDocumentModal');
    const closeBtn2 = document.getElementById('closeDocumentModalBtn');
    
    // Sample document data (in real implementation, this would be fetched from server)
    const documents = [
        {
            id: 1,
            name: 'RA.RU.710588 от 11.08.2025.pdf',
            url: 'dosc/RA.RU.710588 от 11.08.2025.pdf',
            size: '2.4 MB',
            type: 'PDF',
            icon: '📄'
        },
        {
            id: 2,
            name: 'Приложение к приказу Nº8_compressed.pdf',
            url: 'dosc/Приложение к приказу Nº8_compressed.pdf',
            size: '1.8 MB',
            type: 'PDF',
            icon: '📋'
        },
        {
            id: 3,
            name: 'Ф_04_25_01_2025_Журнал_учета_контрольного_фонда_НД_compressed.pdf',
            url: 'dosc/Ф_04_25_01_2025_Журнал_учета_контрольного_фонда_НД_compressed.pdf',
            size: '3.2 MB',
            type: 'PDF',
            icon: '📊'
        }
    ];
    
    // Create document cards
    function createDocumentCards() {
        documentsGrid.innerHTML = '';
        
        documents.forEach((doc, index) => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="document-card-header">
                    <div class="document-icon">${doc.icon}</div>
                    <div class="document-info">
                        <h3 class="document-title">${formatDocumentName(doc.name)}</h3>
                        <div class="document-meta">
                            <span class="file-size">
                                <span>📁</span> ${doc.size}
                            </span>
                            <span class="file-type">
                                <span>📄</span> ${doc.type}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn btn-preview preview-btn" data-doc-id="${doc.id}">
                        👁️ Предпросмотр
                    </button>
                    <button class="btn btn-download download-btn" data-doc-id="${doc.id}">
                        ⬇️ Скачать
                    </button>
                </div>
            `;
            
            documentsGrid.appendChild(card);
        });
        
        // Add event listeners
        addDocumentEventListeners();
    }
    
    // Format document name for display
    function formatDocumentName(name) {
        if (name.length > 50) {
            return name.substring(0, 47) + '...';
        }
        return name;
    }
    
    // Add event listeners to document cards
    function addDocumentEventListeners() {
        // Preview buttons
        const previewBtns = document.querySelectorAll('.preview-btn');
        previewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const docId = parseInt(this.getAttribute('data-doc-id'));
                openDocumentModal(docId);
            });
        });
        
        // Download buttons
        const downloadBtns = document.querySelectorAll('.download-btn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const docId = parseInt(this.getAttribute('data-doc-id'));
                downloadDocument(docId);
            });
        });
        
        // Close modal buttons
        closeBtn.addEventListener('click', closeDocumentModal);
        closeBtn2.addEventListener('click', closeDocumentModal);
        
        // Close modal on backdrop click
        documentModal.addEventListener('click', function(e) {
            if (e.target === documentModal) {
                closeDocumentModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && documentModal.classList.contains('active')) {
                closeDocumentModal();
            }
        });
        
        // Download button in modal
        downloadBtn.addEventListener('click', function() {
            const currentDoc = documents.find(doc => doc.id === currentDocumentId);
            if (currentDoc) {
                downloadDocument(currentDoc.id);
            }
        });
    }
    
    let currentDocumentId = null;
    
    // Open document modal
    function openDocumentModal(docId) {
        const doc = documents.find(d => d.id === docId);
        if (!doc) return;
        
        currentDocumentId = docId;
        
        // Update modal content
        modalTitle.textContent = doc.name;
        modalFileSize.textContent = `Размер: ${doc.size}`;
        modalFileType.textContent = `Тип: ${doc.type}`;
        
        // Show loading state
        documentLoading.style.display = 'block';
        documentPreview.style.display = 'none';
        
        // Open modal
        documentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load PDF preview
        loadPDFPreview(doc.url);
    }
    
    // Close document modal
    function closeDocumentModal() {
        documentModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear iframe content
        documentPreview.src = '';
        documentLoading.style.display = 'none';
        documentPreview.style.display = 'block';
        
        currentDocumentId = null;
    }
    
    // Load PDF preview
    function loadPDFPreview(url) {
        // For security reasons, we can't directly load local PDF files in iframe
        // In a real implementation, you would need a server-side solution
        // For now, we'll show a placeholder
        
        setTimeout(() => {
            documentLoading.style.display = 'none';
            documentPreview.style.display = 'block';
            
            // Create a simple PDF viewer placeholder
            documentPreview.src = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.href + url)}&embedded=true`;
            
            // Fallback for local files (would require server setup)
            if (documentPreview.src.includes('undefined')) {
                documentPreview.style.display = 'none';
                documentLoading.innerHTML = `
                    <div class="pdf-fallback">
                        <div class="pdf-icon">📄</div>
                        <p>Документ готов к просмотру</p>
                        <p class="pdf-note">Для просмотра документа используйте кнопку "Скачать"</p>
                    </div>
                `;
            }
        }, 1000);
    }
    
    // Download document
    function downloadDocument(docId) {
        const doc = documents.find(d => d.id === docId);
        if (!doc) return;
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        link.target = '_blank';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show notification
        showNotification(`Начинается скачивание "${doc.name}"`, 'success');
    }
    
    // Initialize document gallery
    createDocumentCards();
}

// Scroll-triggered slider functionality
function initScrollSlider() {
    const scrollSlider = document.getElementById('scrollSlider');
    const closeBtn = document.getElementById('scrollSliderClose');
    let lastScrollTop = 0;
    let scrollTimeout;
    let hasScrolled = false;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Показать слайдер при прокрутке вниз
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 100; // Показать слайдер после прокрутки на 100px
        
        // Проверяем, что пользователь прокрутил вниз
        if (scrollTop > scrollThreshold && !hasScrolled) {
            hasScrolled = true;
            showSliderWithAnimation();
        }
        
        // Обновляем последнюю позицию прокрутки
        lastScrollTop = scrollTop;
        
        // Сбрасываем таймер для скрытия при прокрутке вверх
        clearTimeout(scrollTimeout);
        
        // Если пользователь прокручивает вверх, скрываем слайдер
        if (scrollTop < lastScrollTop && scrollTop < scrollThreshold) {
            hideSlider();
            hasScrolled = false;
        }
        
        // Таймер для скрытия слайдера при остановке прокрутки
        scrollTimeout = setTimeout(() => {
            if (scrollTop > scrollThreshold) {
                hideSlider();
            }
        }, 3000); // Скрыть через 3 секунды после остановки прокрутки
    }
    
    // Показать слайдер с анимацией
    function showSliderWithAnimation() {
        scrollSlider.classList.add('visible');
        
        // Добавляем анимацию появления элементов
        const items = scrollSlider.querySelectorAll('.scroll-slider-item');
        items.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `slideInItem 0.6s ease-out ${0.1 + index * 0.1}s forwards`;
        });
    }
    
    // Скрыть слайдер
    function hideSlider() {
        scrollSlider.classList.remove('visible');
    }
    
    // Обработчик закрытия слайдера
    function closeSlider() {
        hideSlider();
        hasScrolled = false;
        localStorage.setItem('sliderClosed', 'true');
        
        // Добавляем эффект при закрытии
        closeBtn.style.transform = 'translateY(-50%) scale(0.8)';
        setTimeout(() => {
            closeBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    }
    
    // Проверяем, не закрыл ли пользователь слайдер ранее
    function checkSliderStatus() {
        const sliderClosed = localStorage.getItem('sliderClosed');
        if (sliderClosed === 'true') {
            hasScrolled = true; // Предотвращаем показ слайдера
        }
    }
    
    // Обработка свайпов на мобильных устройствах
    function handleTouchStart(e) {
        touchStartY = e.changedTouches[0].screenY;
    }
    
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп вверх - показать слайдер
                if (!scrollSlider.classList.contains('visible')) {
                    showSliderWithAnimation();
                }
            } else {
                // Свайп вниз - скрыть слайдер
                if (scrollSlider.classList.contains('visible')) {
                    hideSlider();
                }
            }
        }
    }
    
    // Инициализация
    checkSliderStatus();
    
    // Добавляем обработчики событий
    window.addEventListener('scroll', handleScroll, { passive: true });
    closeBtn.addEventListener('click', closeSlider);
    
    // Обработка свайпов
    scrollSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Обработка клика на элементы слайдера
    const sliderItems = scrollSlider.querySelectorAll('.scroll-slider-item');
    sliderItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            // Показываем уведомление с информацией о выбранном элементе
            showNotification(`${title}: ${description}`, 'info');
            
            // Добавляем эффект клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Предотвращаем скрытие слайдера при взаимодействии с ним
    scrollSlider.addEventListener('mouseenter', () => {
        clearTimeout(scrollTimeout);
    });
    
    scrollSlider.addEventListener('mouseleave', () => {
        if (scrollSlider.classList.contains('visible')) {
            scrollTimeout = setTimeout(() => {
                hideSlider();
            }, 3000);
        }
    });
    
    // Предотвращаем скрытие при клике на элементы слайдера
    sliderItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearTimeout(scrollTimeout);
        });
    });
}

// Функция для получения параметров URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        validateEmail,
        formatPhone,
        getUrlParameter,
        initScrollSlider
    };
}