const silhouette = document.getElementById('silhouette');
const mapViewerH1 = document.querySelector('.mapViewer h1');
const backgroundImage = document.querySelector('.background-image');
const pins = document.querySelectorAll('.pin');

let isHovered = false; // Track if the map is hovered
let animationFrameId = null; // Track the animation frame ID

// Function to update map transformation
function updateTransformations(e) {
    const rect = silhouette.getBoundingClientRect();
    const mouseY = e.clientX - rect.left - rect.width / 2;
    const mouseX = e.clientY - rect.top - rect.height / 2;

    const rotateX = (mouseX / rect.width) * 10;
    const rotateY = -(mouseY / rect.height) * 10;
    const scale = 1.1;

    // Apply transformation to the map
    silhouette.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${scale})
    `;

    // Add glow and blur effects
    const shadowX = (mouseX / rect.width) * 20;
    const shadowY = (mouseY / rect.height) * 20;
    silhouette.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 20px rgba(255, 255, 255, 0.3))`;

    mapViewerH1.classList.add('glow');
    backgroundImage.classList.add('blur');

    // Add hovered class to pins
    pins.forEach(pin => {
        pin.classList.add('hovered');
    });
}

// Function to reset transformations
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

// Throttle the mousemove event using requestAnimationFrame
function handleMousemove(e) {
    if (!isHovered) return; // Only update if the map is hovered

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel the previous frame
    }

    animationFrameId = requestAnimationFrame(() => {
        updateTransformations(e);
    });
}

// Add mousemove event to the map
silhouette.addEventListener('mousemove', handleMousemove);

// Track hover state
silhouette.addEventListener('mouseenter', () => {
    isHovered = true;
});

silhouette.addEventListener('mouseleave', () => {
    isHovered = false;
    resetTransformations();
});

// Pin click functionality
document.addEventListener('DOMContentLoaded', function() {
    let activePin = null; // Track the currently active pin

    pins.forEach(pin => {
        const pinImage = pin.querySelector('img');
        pinImage.addEventListener('click', function() {
            // If there's an active pin, turn it off
            if (activePin && activePin !== pinImage) {
                const offSrc = activePin.getAttribute('data-off');
                activePin.src = offSrc;
            }

            // Toggle the clicked pin
            const currentSrc = pinImage.getAttribute('src');
            const onSrc = pinImage.getAttribute('data-on');
            const offSrc = pinImage.getAttribute('data-off');
            pinImage.src = currentSrc === offSrc ? onSrc : offSrc;

            // Update the active pin
            activePin = currentSrc === offSrc ? pinImage : null;
        });
    });
});