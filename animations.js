/**
 * Combo Flow - Advanced Animations
 * Martial Arts themed animations and interactions
 */

// Particle System for Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.03;
                particle.y -= dy * force * 0.03;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Strike Animation Effect
function createStrikeEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(220, 38, 38, 0.5), transparent)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'strikeRipple 0.6s ease-out';
        
        const rect = element.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left - 25}px`;
        ripple.style.top = `${e.clientY - rect.top - 25}px`;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Add strike ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes strikeRipple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .training-state-gradient {
        background: linear-gradient(
            135deg,
            var(--r600) 0%,
            var(--a600) 25%,
            var(--g600) 50%,
            var(--b600) 75%,
            var(--p600) 100%
        );
        background-size: 400% 400%;
        animation: gradientShift 10s ease infinite;
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .combo-text-animation {
        display: inline-block;
        animation: comboType 0.1s steps(1) forwards;
    }
    
    @keyframes comboType {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Typing Animation for Combo Sequences
function typeCombo(element, combo, speed = 100) {
    element.innerHTML = '';
    const chars = combo.split('');
    
    chars.forEach((char, index) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'combo-text-animation';
            span.style.animationDelay = `${index * 0.05}s`;
            element.appendChild(span);
        }, index * speed);
    });
}

// Progress Counter Animation
function animateCounter(element, start, end, duration = 2000, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Parallax Scrolling Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Magnetic Button Effect
function createMagneticButton(button) {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
}

// Training Intensity Visualizer
function createIntensityMeter(container, intensity) {
    const segments = 10;
    const meter = document.createElement('div');
    meter.style.display = 'flex';
    meter.style.gap = '2px';
    
    for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.style.width = '20px';
        segment.style.height = '8px';
        segment.style.borderRadius = '2px';
        segment.style.transition = 'all 0.3s ease';
        
        if (i < intensity) {
            if (i < 3) segment.style.background = 'var(--g600)';
            else if (i < 7) segment.style.background = 'var(--a600)';
            else segment.style.background = 'var(--r600)';
            
            segment.style.animation = `intensityPulse 1s ease-in-out ${i * 0.1}s infinite`;
        } else {
            segment.style.background = 'var(--n600)';
        }
        
        meter.appendChild(segment);
    }
    
    container.appendChild(meter);
}

// Add intensity pulse animation
const intensityStyle = document.createElement('style');
intensityStyle.textContent = `
    @keyframes intensityPulse {
        0%, 100% { opacity: 1; transform: scaleY(1); }
        50% { opacity: 0.7; transform: scaleY(1.2); }
    }
`;
document.head.appendChild(intensityStyle);

// Mobile detection helper
function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = isMobileDevice();

    // Initialize particle system on hero sections (desktop only for performance)
    if (!isMobile) {
        const heroSections = document.querySelectorAll('.hero-enhanced, .analytics-hero');
        heroSections.forEach(section => {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.opacity = '0.3';

            section.style.position = 'relative';
            section.insertBefore(canvas, section.firstChild);

            const particles = new ParticleSystem(canvas);
            particles.animate();
        });
    }
    
    // Apply strike effect to buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        createStrikeEffect(button);
        // Magnetic effect only on desktop for better mobile performance
        if (!isMobile) {
            createMagneticButton(button);
        }
    });
    
    // Initialize parallax
    initParallax();
    
    // Animate counters when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                entry.target.animated = true;
                const value = parseInt(entry.target.textContent);
                if (!isNaN(value)) {
                    animateCounter(entry.target, 0, value, 1500);
                }
            }
        });
    });
    
    document.querySelectorAll('.stat-value').forEach(stat => {
        if (!stat.textContent.includes('★') && !stat.textContent.includes('K')) {
            counterObserver.observe(stat);
        }
    });
    
    // Add smooth reveal for cards
    const cards = document.querySelectorAll('.analytics-card, .feature');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Create floating animation for pro badges
    document.querySelectorAll('.pro-badge').forEach(badge => {
        badge.classList.add('animate-float');
    });
    
    // Add hover effects to heatmap cells
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.zIndex = '10';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Create training state gradient animation
    const gradientElements = document.querySelectorAll('[data-gradient="training"]');
    gradientElements.forEach(element => {
        element.classList.add('training-state-gradient');
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Performance optimization - reduce animations on low-end devices and mobile
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMobile) {
        document.querySelectorAll('[class*="animate-"]').forEach(element => {
            // Keep essential animations but reduce complexity
            if (element.classList.contains('animate-fade-in')) {
                // Keep fade-in for better UX
                element.style.animationDuration = '0.3s';
            } else if (!element.classList.contains('scroll-animate')) {
                // Remove non-essential animations on mobile
                element.style.animation = 'none';
            }
        });

        // Reduce float animation on mobile
        if (isMobile) {
            document.querySelectorAll('.animate-float').forEach(element => {
                element.style.animation = 'none';
            });
        }
    }
});

// Export functions for use in other scripts
window.ComboFlowAnimations = {
    createStrikeEffect,
    typeCombo,
    animateCounter,
    createIntensityMeter,
    createMagneticButton
};