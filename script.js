 window.addEventListener('load', () => {
    const overlay = document.getElementById('blur-overlay');
    const content = document.getElementById('content');

    content.style.display = 'block';

    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.webkitBackdropFilter = 'blur(0px)';

        setTimeout(() => {
            initScrollReveal();
        }, 300);

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);

    }, 200);
});

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}
