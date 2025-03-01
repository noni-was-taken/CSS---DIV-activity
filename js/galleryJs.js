const silhouette = document.getElementById('silhouette');
const mapViewerH1 = document.querySelector('.mapViewer h1');
const backgroundImage = document.querySelector('.background-image');
const pins = document.querySelectorAll('.pin');
const hoverDetector = document.querySelector('.hover-detector');
const mapNavLinks = document.querySelectorAll('.mapNavigation nav a');
const locationH = document.querySelector('.locationH h1');
const content = document.querySelector('.content p');
const exploreButton = document.querySelector('.explore a');
const overlay = document.getElementById('overlay');
const carouselImages = document.getElementById('carouselImages');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let isHovered = false;
let animationFrameId = null;
let activePin = null;
let currentImageIndex = 0;
let images = [];

function updateLocationText(newText) {
    locationH.style.opacity = 0;
    setTimeout(() => {
        locationH.textContent = newText;
        locationH.style.opacity = 1;
    }, 300);
}


function resetLocationText() {
    updateLocationText("LOCATION");
}


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

    
    if (activePin) {
        const selectedLocation = mapNavLinks[pinIndex].getAttribute('data-location');
        updateLocationText(selectedLocation.toUpperCase());
    } else {
        resetLocationText(); 
    }
}

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
    locationH.classList.add('glow');
    exploreButton.classList.add('glow');
    content.classList.add('glow');

    pins.forEach(pin => {
        pin.classList.add('hovered');
    });
    mapNavLinks.forEach(link => {
        link.classList.add('glow');
    });
}

function resetTransformations() {
    silhouette.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    silhouette.style.filter = 'drop-shadow(0 10px 20px rgba(255, 255, 255, 0.1))';

    mapViewerH1.classList.remove('glow');
    backgroundImage.classList.remove('blur');

    pins.forEach(pin => {
        pin.classList.remove('hovered');
    });
    mapNavLinks.forEach(link => {
        link.classList.remove('glow');
    });

    locationH.classList.remove('glow');
    exploreButton.classList.remove('glow');
    content.classList.remove('glow');
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

mapNavLinks.forEach((link, index) => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        togglePin(index);
    });
});

pins.forEach((pin, index) => {
    pin.addEventListener('click', function () {
        togglePin(index);
    });
});

document.addEventListener('click', function (e) {
    const isPinClicked = Array.from(pins).some(pin => pin.contains(e.target));
    const isNavLinkClicked = Array.from(mapNavLinks).some(link => link.contains(e.target));
    const isExploreButtonClicked = e.target === exploreButton || exploreButton.contains(e.target);

    if (!isPinClicked && !isNavLinkClicked && !isExploreButtonClicked && activePin) {
        const offSrc = activePin.getAttribute('data-off');
        activePin.src = offSrc;
        activePin.classList.remove('active');
        activePin = null;
        resetLocationText();
    }
});

function showCarousel() {
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = 1;
    }, 10);
}

function hideCarousel() {
    overlay.style.opacity = 0;
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function loadImages(locationIndex) {
    const folderPath = `/images/Gallery/Destination ${locationIndex + 1}/`;
    const imageFiles = ['1.jpg', '2.jpg', '3.jpg'];

    carouselImages.innerHTML = '';

    images = imageFiles.map((file, index) => {
        const img = document.createElement('img');
        img.src = folderPath + file;
        img.alt = `Location Image ${index + 1}`;
        if (index === 0) img.classList.add('active');
        carouselImages.appendChild(img);
        return img;
    });
}

function showNextImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

function showPreviousImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images[currentImageIndex].classList.add('active');
}

exploreButton.addEventListener('click', function () {
    if (!activePin) return;

    const pinIndex = Array.from(pins).findIndex(pin => pin.querySelector('img').classList.contains('active'));

    loadImages(pinIndex);

    showCarousel();
});

prevButton.addEventListener('click', showPreviousImage);
nextButton.addEventListener('click', showNextImage);

overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
        hideCarousel();
    }
});