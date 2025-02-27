document.querySelector('.startButton').addEventListener('mouseover', function() {
    document.querySelector('.imageDiv img').classList.add('blur');
});

document.querySelector('.startButton').addEventListener('mouseout', function() {
    document.querySelector('.imageDiv img').classList.remove('blur');
});