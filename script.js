window.addEventListener('load', () => {
    const overlay = document.getElementById('blur-overlay');
    const content = document.getElementById('content');

    content.style.display = 'block';

    setTimeout(() => {
        setupTypingEffect(); // Chuẩn bị HTML cho hiệu ứng gõ

        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.webkitBackdropFilter = 'blur(0px)';

        setTimeout(() => {
            initScrollReveal();

            // Đảm bảo chữ ở các thẻ không nằm trong scroll reveal hiện gõ chữ (eg. header)
            const headerBaseChars = document.querySelectorAll('.glass-header h1 .type-char, .glass-header .subtitle .type-char');
            headerBaseChars.forEach((char, index) => {
                setTimeout(() => char.classList.add('visible'), index * 10);
            });

            const headerMetaChars = document.querySelectorAll('.glass-header .meta-info .type-char');
            headerMetaChars.forEach((char, index) => {
                setTimeout(() => char.classList.add('visible'), index * 10);
            });

            const headerLinkChars = document.querySelectorAll('.glass-header .profile-links .type-char');
            headerLinkChars.forEach((char, index) => {
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
            } else {
                // Khi ra khỏi màn hình, gỡ active để có thể load lại, và reset hiệu ứng gõ chữ
                entry.target.classList.remove('active');
                const visibleChars = entry.target.querySelectorAll('.type-char.visible');
                visibleChars.forEach(char => {
                    char.classList.remove('visible');
                });
            }
        });
    }, {
        threshold: 0,
        rootMargin: "150px 0px 150px 0px"
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
let ticking = false;
document.addEventListener('mousemove', (e) => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const glow = document.querySelector('.mouse-glow');
            if (glow) {
                glow.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// --- Three.js Background ---
window.addEventListener('load', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // Generate soft circle texture for particles
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 16;
    texCanvas.height = 16;
    const ctx = texCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(texCanvas);

    // 1. Deep Space Stars (More of them to fill the galaxy void)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = window.innerWidth < 800 ? 1500 : 3500;
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPos[i] = (Math.random() - 0.5) * 200;
        starsPos[i + 1] = (Math.random() - 0.5) * 200;
        starsPos[i + 2] = (Math.random() - 0.5) * 200 - 20;

        const c = new THREE.Color().setHSL(Math.random(), 0.5, 0.4 + Math.random() * 0.4); // slightly brighter
        starsColors[i] = c.r;
        starsColors[i + 1] = c.g;
        starsColors[i + 2] = c.b;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    universeGroup.add(starsMesh);

    // 2. Nomad Stars (Wandering pixels)
    const nomadGeometry = new THREE.BufferGeometry();
    const nomadCount = window.innerWidth < 800 ? 50 : 100;
    const nomadPos = new Float32Array(nomadCount * 3);
    const nomadVels = [];

    for (let i = 0; i < nomadCount; i++) {
        nomadPos[i * 3] = (Math.random() - 0.5) * 100;
        nomadPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
        nomadPos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

        nomadVels.push({
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            vz: (Math.random() - 0.5) * 0.1
        });
    }
    nomadGeometry.setAttribute('position', new THREE.BufferAttribute(nomadPos, 3));
    const nomadMaterial = new THREE.PointsMaterial({
        size: 0.8,
        color: 0xffffff,
        map: particleTexture,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const nomadMesh = new THREE.Points(nomadGeometry, nomadMaterial);
    universeGroup.add(nomadMesh);

    camera.position.z = 10;
    camera.position.y = 2;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        universeGroup.rotation.y += 0.02 * (targetX - universeGroup.rotation.y);
        universeGroup.rotation.x += 0.02 * (targetY - universeGroup.rotation.x);

        // Auto pan/spin
        universeGroup.rotation.y += 0.0005;
        starsMesh.rotation.y = elapsedTime * 0.005;

        // Animate nomad stars
        const posAttr = nomadGeometry.attributes.position;
        for (let i = 0; i < nomadCount; i++) {
            let x = posAttr.getX(i) + nomadVels[i].vx;
            let y = posAttr.getY(i) + nomadVels[i].vy;
            let z = posAttr.getZ(i) + nomadVels[i].vz;

            // wrap around to loop seamlessly
            if (x > 50) x = -50; else if (x < -50) x = 50;
            if (y > 50) y = -50; else if (y < -50) y = 50;
            if (z > 30) z = -50; else if (z < -50) z = 30;

            posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;

        universeGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
