// Updated cursor movement and hover behavior
const cursor = document.querySelector('.custom-cursor');

// Movement
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});

// Add hover state to all clickable elements
const clickableElements = document.querySelectorAll(`
  button, 
  .button, 
  .radio-option, 
  .character-set span, 
  .mode-toggle,
  .presentation,
  input[type="radio"] + .radio-indicator,
  .video-tile,
  .shape
`);

clickableElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});