// JavaScript файл для слайдеров на сайте sgrrpn.ru

class Slider {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            console.error('Slider container not found');
            return;
        }
        
        this.slides = this.container.querySelectorAll('.slide');
        this.prevButton = this.container.querySelector('.slider-prev');
        this.nextButton = this.container.querySelector('.slider-next');
        this.indicators = this.container.querySelectorAll('.indicator');
        
        // Настройки по умолчанию
        this.options = {
            autoplay: options.autoplay || false,
            autoplayDelay: options.autoplayDelay || 5000,
            showIndicators: options.showIndicators !== false, // по умолчанию true
            showArrows: options.showArrows !== false, // по умолчанию true
            loop: options.loop || false,
            startIndex: options.startIndex || 0,
            onChange: options.onChange || null
        };
        
        this.currentIndex = this.options.startIndex;
        this.timer = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) {
            console.warn('No slides found in slider');
            return;
        }
        
        // Инициализация внешнего вида
        this.updateSlidePosition();
        this.setupEventListeners();
        
        // Показать/скрыть элементы управления
        this.toggleControls();
        
        // Начать автопрокрутку если включена
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Инициализация индикаторов
        this.createIndicators();
    }
    
    setupEventListeners() {
        // Обработчики для кнопок навигации
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prev());
        }
        
        // Обработчики для индикаторов
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });
        
        // Обработка свайпов (упрощенная версия)
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // минимальное расстояние для срабатывания свайпа
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next(); // свайп влево - следующий слайд
            } else {
                this.prev(); // свайп вправо - предыдущий слайд
            }
        }
    }
    
    next() {
        if (this.isLastSlide() && !this.options.loop) {
            return;
        }
        
        this.currentIndex = this.currentIndex < this.slides.length - 1 ? this.currentIndex + 1 : 0;
        this.updateSlider();
    }
    
    prev() {
        if (this.isFirstSlide() && !this.options.loop) {
            return;
        }
        
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slides.length - 1;
        this.updateSlider();
    }
    
    goTo(index) {
        if (index >= 0 && index < this.slides.length && index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        this.updateSlidePosition();
        this.updateIndicators();
        
        // Вызов колбэка при изменении слайда
        if (this.options.onChange && typeof this.options.onChange === 'function') {
            this.options.onChange(this.currentIndex, this.slides[this.currentIndex]);
        }
        
        // Перезапуск автопрокрутки
        if (this.options.autoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    updateSlidePosition() {
        const offset = -this.currentIndex * 100;
        const track = this.container.querySelector('.slider-track') || this.container;
        track.style.transform = `translateX(${offset}%)`;
    }
    
    updateIndicators() {
        // Обновление индикаторов
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    createIndicators() {
        if (!this.options.showIndicators || this.slides.length <= 1) {
            return;
        }
        
        // Если индикаторы уже созданы, обновляем их
        if (this.indicators.length === 0) {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slider-indicators';
            
            this.slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'indicator';
                indicator.setAttribute('data-slide', index);
                
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                }
                
                indicator.addEventListener('click', () => this.goTo(index));
                indicatorsContainer.appendChild(indicator);
            });
            
            this.container.appendChild(indicatorsContainer);
        }
    }
    
    toggleControls() {
        // Скрытие стрелок если не должны отображаться
        if (!this.options.showArrows) {
            if (this.prevButton) this.prevButton.style.display = 'none';
            if (this.nextButton) this.nextButton.style.display = 'none';
        }
        
        // Скрытие индикаторов если не должны отображаться
        if (!this.options.showIndicators) {
            if (this.indicators) {
                this.indicators.forEach(indicator => {
                    indicator.style.display = 'none';
                });
            }
        }
    }
    
    startAutoplay() {
        this.timer = setInterval(() => {
            this.next();
        }, this.options.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    isLastSlide() {
        return this.currentIndex === this.slides.length - 1;
    }
    
    isFirstSlide() {
        return this.currentIndex === 0;
    }
    
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    getSlidesCount() {
        return this.slides.length;
    }
    
    destroy() {
        this.stopAutoplay();
        // Удалить все event listeners и очистить DOM
    }
}

// Инициализация слайдеров при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех слайдеров на странице
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        new Slider(slider, {
            autoplay: true,
            autoplayDelay: 5000,
            showIndicators: true,
            showArrows: true,
            loop: true
        });
    });
    
    // Инициализация специфичных слайдеров
    initializeCustomSliders();
});

// Функция для инициализации специфичных слайдеров
function initializeCustomSliders() {
    // Пример: инициализация слайдера отзывов
    const reviewsSlider = document.querySelector('#reviews-slider');
    if (reviewsSlider) {
        new Slider(reviewsSlider, {
            autoplay: false,
            showIndicators: true,
            showArrows: true,
            loop: true
        });
    }
    
    // Пример: инициализация слайдера услуг
    const servicesSlider = document.querySelector('#services-slider');
    if (servicesSlider) {
        new Slider(servicesSlider, {
            autoplay: false,
            showIndicators: true,
            showArrows: true,
            loop: false
        });
    }
}

// Функция для создания слайдера с определёнными настройками
function createSlider(selector, options) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
        return new Slider(element, options);
    }
    return null;
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Slider;
} else {
    window.Slider = Slider;
    window.createSlider = createSlider;
}