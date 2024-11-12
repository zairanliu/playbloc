// DOM Elements
const shapeButtons = document.querySelectorAll('.page-3-left .button');
const modeInputs = document.querySelectorAll('.radio-input');
const presentation = document.querySelector('.page-3-right .presentation');
const characterSet = document.querySelector('.page-3-right .character-set');

// Constants for letter mappings
const SHAPE_LETTERS = {
  circle: 'abdgopqsz0689'.split(''),
  arc: 'cefkmnrtuvwxy12345'.split(''),
  rect: 'abdefghijklmnpqrtuvwy02457'.split('')
};

// State
let currentShape = 'circle';
let currentMode = 'random';
let currentLetter = 'a';
let animationId = null;

// Initialize character set with selectabilitys handling
function initializeCharacterSet() {
  characterSet.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.dataset.letter = letter;
    
    span.addEventListener('click', () => {
      if (!span.classList.contains('disabled')) {
        currentLetter = letter;
        presentation.textContent = letter;
        updateVariation();
        
        // Update active state
        document.querySelectorAll('.character-set span').forEach(s => {
          s.classList.remove('active');
        });
        span.classList.add('active');
      }
    });
    
    characterSet.appendChild(span);
  });
  updateSelectableLetters();
}

// Update which letters are selectable based on current shape
function updateSelectableLetters() {
  const availableLetters = SHAPE_LETTERS[currentShape];
  
  document.querySelectorAll('.character-set span').forEach(span => {
    const letter = span.dataset.letter;
    if (availableLetters.includes(letter)) {
      span.classList.remove('disabled');
    } else {
      span.classList.add('disabled');
      if (currentLetter === letter) {
        // If current letter becomes unavailable, switch to first available letter
        currentLetter = availableLetters[0];
        presentation.textContent = currentLetter;
        updateVariation();
      }
    }
  });
}

// Generate random value between 0 and 1000
function getRandomValue() {
  return Math.floor(Math.random() * 1001);
}

// Get the appropriate axis based on current shape
function getCurrentAxis() {
  return currentShape === 'rect' ? 'RECT' : 'CRCL';
}

// Create keyframe animation for current axis
function createAxisAnimation() {
  const axis = getCurrentAxis();
  const keyframes = `
    @keyframes fontAnimation {
      0% { font-variation-settings: "${axis}" 0; }
      50% { font-variation-settings: "${axis}" 1000; }
      100% { font-variation-settings: "${axis}" 0; }
    }
  `;
  
  // Remove existing
  const existingStyle = document.getElementById('font-animation-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new animation style
  const style = document.createElement('style');
  style.id = 'font-animation-style';
  style.textContent = keyframes;
  document.head.appendChild(style);
}

// Update font variation settings
function updateVariation(value = null) {
  const axis = getCurrentAxis();
  
  if (currentMode === 'random') {
    // Stop any existing animation
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    presentation.style.animation = 'none';
    
    // Set random
    const variationValue = value !== null ? value : getRandomValue();
    presentation.style.fontVariationSettings = `"${axis}" ${variationValue}`;
  } else {
    // Update animation for current axis
    createAxisAnimation();
    presentation.style.animation = 'none'; // Reset animation
    presentation.offsetHeight; // Trigger reflow
    presentation.style.animation = 'fontAnimation 2s linear infinite';
  }
}

// Event Listeners for shape buttons
shapeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active state
    shapeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update current shape
    currentShape = button.textContent.trim().toLowerCase();
    
    // Update selectable letters
    updateSelectableLetters();
    
    // Update variation
    updateVariation();
  });
});

// Event Listeners for mode radio buttons
modeInputs.forEach(input => {
  input.addEventListener('change', () => {
    currentMode = input.value;
    updateVariation();
  });
});

// Click handler for presentation element (random mode only)
presentation.addEventListener('click', () => {
  if (currentMode === 'random') {
    updateVariation();
  }
});


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeCharacterSet();
  presentation.textContent = currentLetter;
  updateVariation();
});

