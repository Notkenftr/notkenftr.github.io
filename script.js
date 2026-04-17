window.addEventListener('load', () => {
    const overlay = document.getElementById('blur-overlay');
    const content = document.getElementById('content');

    content.style.display = 'block';

    setTimeout(() => {
        setupTypingEffect(); // Chuẩn bị HTML cho hiệu ứng gõ

        overlay.style.opacity = '0';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.webkitBackdropFilter = 'blur(0px)';

        setTimeout(() => {
            initScrollReveal();

            // Đảm bảo chữ ở các thẻ không nằm trong scroll reveal hiện gõ chữ (eg. header)
            const headerChars = document.querySelectorAll('.glass-header .type-char');
            headerChars.forEach((char, index) => {
                setTimeout(() => char.classList.add('visible'), index * 10);
            });

        }, 300);

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);

    }, 200);
});

function setupTypingEffect() {
    const ignoredTags = ['SCRIPT', 'STYLE', 'SVG', 'PATH', 'POLYGON', 'LINE', 'CIRCLE', 'RECT', 'POLYLINE', 'IFRAME', 'IMG'];
    const walker = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
        if (node.nodeValue.trim() === '') continue;
        let parent = node.parentNode;
        let ignore = false;
        while (parent && parent.tagName) {
            if (ignoredTags.includes(parent.tagName.toUpperCase())) {
                ignore = true;
                break;
            }
            parent = parent.parentNode;
        }
        if (!ignore) textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const text = textNode.nodeValue;
        const wrapper = document.createElement('span');

        for (let i = 0; i < text.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = text[i];
            charSpan.classList.add('type-char');
            wrapper.appendChild(charSpan);
        }
        textNode.parentNode.replaceChild(wrapper, textNode);
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // --- Kích hoạt hiệu ứng gõ chữ cho các element con bên trong element cuộn tới ---
                const chars = entry.target.querySelectorAll('.type-char:not(.visible)');
                chars.forEach((char, index) => {
                    setTimeout(() => {
                        char.classList.add('visible');
                    }, index * 10); // Tốc độ gõ 10ms mỗi chữ cái
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

// --- YouTube Audio Player ---
let player;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: 'yTQcgZ9Q-tM',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'loop': 1,
            'playlist': 'yTQcgZ9Q-tM'
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(20); // Âm lượng nhỏ gọn tinh tế (20%)
}

document.addEventListener('DOMContentLoaded', () => {
    // Tải API YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Xử lý nút bật tắt nhạc
    const audioBtn = document.getElementById('audio-control');
    const iconOff = document.getElementById('icon-sound-off');
    const iconOn = document.getElementById('icon-sound-on');

    audioBtn.addEventListener('click', () => {
        if (!player || !player.playVideo) return;

        if (isPlaying) {
            player.pauseVideo();
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
            audioBtn.classList.remove('playing');
        } else {
            player.playVideo();
            iconOff.style.display = 'none';
            iconOn.style.display = 'block';
            audioBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
});

// --- Mouse Glow Effect ---
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    }
});
