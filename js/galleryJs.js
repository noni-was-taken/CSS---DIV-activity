const silhouette = document.getElementById('silhouette');
const mapViewerH1 = document.querySelector('.mapViewer h1');
const backgroundImage = document.querySelector('.background-image');

silhouette.addEventListener('mousemove', (e) => {
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
});

silhouette.addEventListener('mouseleave', () => {
    silhouette.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    silhouette.style.filter = 'drop-shadow(0 10px 20px rgba(255, 255, 255, 0.1))';

    mapViewerH1.classList.remove('glow');
    backgroundImage.classList.remove('blur');
});