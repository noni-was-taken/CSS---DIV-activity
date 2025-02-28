const silhouette = document.getElementById('silhouette');
const mapViewerH1 = document.querySelector('.mapViewer h1');
const backgroundImage = document.querySelector('.background-image');
const pins = document.querySelectorAll('.pin');
const hoverDetector = document.querySelector('.hover-detector');
const mapNavLinks = document.querySelectorAll('.mapNavigation nav a');

let isHovered = false;
let animationFrameId = null;
let activePin = null;

function updateTransformations(e) {
    const rect = silhouette.getBoundingClientRect();
    const mouseY = e.clientX - rect.left - rect.width / 2;
    const mouseX = e.clientY - rect.top - rect.height / 2;

    const rotateX = (mouseX / rect.width) * 10;
    const rotateY = -(mouseY / rect.height) * 10;
    const scale = 1.1;

    silhouette.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${scale})
    `;

    const shadowX = (mouseX / rect.width) * 20;
    const shadowY = (mouseY / rect.height) * 20;
    silhouette.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 20px rgba(255, 255, 255, 0.3))`;

    mapViewerH1.classList.add('glow');
    backgroundImage.classList.add('blur');

    pins.forEach(pin => {
        pin.classList.add('hovered');
    });
}


function resetTransformations() {
    silhouette.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    silhouette.style.filter = 'drop-shadow(0 10px 20px rgba(255, 255, 255, 0.1))';

    mapViewerH1.classList.remove('glow');
    backgroundImage.classList.remove('blur');

    // Remove hovered class from pins
    pins.forEach(pin => {
        pin.classList.remove('hovered');
    });
}


function handleMousemove(e) {
    if (!isHovered) return;

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
        updateTransformations(e);
    });
}


hoverDetector.addEventListener('mousemove', handleMousemove);


hoverDetector.addEventListener('mouseenter', () => {
    isHovered = true;
});

hoverDetector.addEventListener('mouseleave', () => {
    isHovered = false;
    resetTransformations();
});


function togglePin(pinIndex) {
    const pin = pins[pinIndex];
    const pinImage = pin.querySelector('img');

    if (activePin && activePin !== pinImage) {
        const offSrc = activePin.getAttribute('data-off');
        activePin.src = offSrc;
        activePin.classList.remove('active');
    }

    const currentSrc = pinImage.getAttribute('src');
    const onSrc = pinImage.getAttribute('data-on');
    const offSrc = pinImage.getAttribute('data-off');
    pinImage.src = currentSrc === offSrc ? onSrc : offSrc;
    pinImage.classList.toggle('active');

    activePin = currentSrc === offSrc ? pinImage : null;
}

document.addEventListener('DOMContentLoaded', function() {
    mapNavLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            togglePin(index);
        });
    });
});