// DOM Elements
const clickBtn = document.getElementById('click-btn');
const canvas = document.getElementById('confetti-canvas');
const colorBtn = document.getElementById('color-changer');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const autoBtn = document.getElementById('auto-btn');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const form = document.getElementById('demo-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('password-strength');
const logo = document.getElementById('logo');

// Color changing button
const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1'];
let colorIndex = 0;

colorBtn.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    colorBtn.style.backgroundColor = colors[colorIndex];
});

// Slideshow functionality
let currentSlide = 0;
let autoPlayInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

autoBtn.addEventListener('click', toggleAutoPlay);

function toggleAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoBtn.textContent = 'Auto-play';
    } else {
        autoPlayInterval = setInterval(nextSlide, 3000);
        autoBtn.textContent = 'Stop';
    }
}

// Accordion functionality
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = content.style.maxHeight;
        
        // Close all others
        document.querySelectorAll('.accordion-content').forEach(item => {
            if (item !== content) {
                item.style.maxHeight = null;
            }
        });
        
        // Toggle current
        content.style.maxHeight = isOpen ? null : content.scrollHeight + 'px';
    });
});

// Form validation
function validateName() {
    const error = nameInput.nextElementSibling;
    if (nameInput.value.trim() === '') {
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        error.textContent = 'Name is required';
        return false;
    } else {
        nameInput.classList.add('valid');
        nameInput.classList.remove('invalid');
        error.textContent = '';
        return true;
    }
}

function validateEmail() {
    const error = emailInput.nextElementSibling;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.value.trim() === '') {
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        error.textContent = 'Email is required';
        return false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        error.textContent = 'Please enter a valid email';
        return false;
    } else {
        emailInput.classList.add('valid');
        emailInput.classList.remove('invalid');
        error.textContent = '';
        return true;
    }
}

function validatePassword() {
    const error = passwordInput.nextElementSibling;
    const password = passwordInput.value;
    
    if (password.length === 0) {
        passwordInput.classList.add('invalid');
        passwordInput.classList.remove('valid');
        passwordStrength.style.width = '0%';
        error.textContent = 'Password is required';
        return false;
    } else if (password.length < 8) {
        passwordInput.classList.add('invalid');
        passwordInput.classList.remove('valid');
        passwordStrength.style.width = `${(password.length / 8) * 100}%`;
        passwordStrength.style.background = '#e74c3c';
        error.textContent = 'Password must be at least 8 characters';
        return false;
    } else {
        passwordInput.classList.add('valid');
        passwordInput.classList.remove('invalid');
        
        // Calculate strength
        let strength = 0;
        if (password.length >= 8) strength += 30;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 30;
        
        passwordStrength.style.width = `${strength}%`;
        passwordStrength.style.background = strength < 50 ? '#e74c3c' : 
                                          strength < 80 ? '#f39c12' : '#2ecc71';
        
        error.textContent = '';
        return true;
    }
}

// Real-time validation
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (isNameValid && isEmailValid && isPasswordValid) {
        // Form is valid - show success
        alert('Form submitted successfully! 🎉');
        form.reset();
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid');
        });
        passwordStrength.style.width = '0%';
    }
});

// Konami code detection
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                   'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                   'b', 'a'];
let konamiIndex = 0;
const feedback = document.getElementById('keypress-feedback');

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            feedback.innerHTML = '<span style="color: #feca57;">🎮 Konami code activated! 30 lives added! 🎮</span>';
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Long press detection
let pressTimer;

logo.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
        document.getElementById('easter-egg').style.display = 'block';
    }, 2000);
});

logo.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
});

logo.addEventListener('mouseleave', () => {
    clearTimeout(pressTimer);
});

// Confetti effect
if (typeof confetti === 'function') {
    clickBtn.addEventListener('click', () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    });
} else {
    console.error('Confetti library is not loaded.');
}