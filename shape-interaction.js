const shapes = document.querySelectorAll('.shape');
const rotations = new Map();


shapes.forEach(shape => {
    let initialRotation = 0;
    if (shape.classList.contains('-rotate-90')) {
        initialRotation = -90;
    } else if (shape.classList.contains('rotate-90')) {
        initialRotation = 90;
    } else if (shape.classList.contains('rotate-180')) {
        initialRotation = 180;
    }
    rotations.set(shape, initialRotation);
    shape.style.transform = `rotate(${initialRotation}deg)`;
});


shapes.forEach(shape => {
    shape.addEventListener('click', function() {
        let currentRotation = rotations.get(this);
        currentRotation += 90;
        rotations.set(this, currentRotation);
        this.style.transform = `rotate(${currentRotation}deg)`;
        this.style.transition = 'transform 0.3s ease';
    });
});

shapes.forEach(shape => {
    shape.style.display = 'inline-block';
    // shape.style.cursor = 'pointer';

    // Make the shapes not draggable
    shape.setAttribute('draggable', false);
});