// Add these state variables at the top with other state declarations
let isMoveTogetherMode = false;

// Add new DOM elements
const modeToggles = document.querySelectorAll('.mode-toggle');
const module = document.querySelector('.module');

let fireworkInterval;

function displayEmoji() {
  const scalar = 5;
  const circle1 = confetti.shapeFromText({ text: '🟡', scalar });
  const circle2 = confetti.shapeFromText({ text: '⚪️', scalar });
  const square1 = confetti.shapeFromText({ text: '🟦', scalar });
  const square2 = confetti.shapeFromText({ text: '🟥', scalar });
  const square3 = confetti.shapeFromText({ text: '🟩', scalar });
  const rainbow = confetti.shapeFromText({ text: '🌈', scalar });

  const defaults = {
    spread: 360,
    flat: true,
    // ticks: 60,
    decay: 0.98,
    startVelocity: 20,
    shapes: [circle1,circle2,square1, square2, square3, rainbow],
    scalar
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  clearInterval(fireworkInterval);
  fireworkInterval = setInterval(function() {
    const particleCount = 20;
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

// Function to toggle between individual and together modes
function toggleMoveMode(element) {
  isMoveTogetherMode = element.target.dataset.mode === 'crazy' ? true : false;
  
  // Update text and arrow direction
  if (isMoveTogetherMode) {
    modeToggles[0].classList.remove('active');
    modeToggles[1].classList.add('active');
    displayEmoji();
  } else {
    console.log('should clear');
    if (fireworkInterval) {
      clearInterval(fireworkInterval);
    }
    modeToggles[1].classList.remove('active');
    modeToggles[0].classList.add('active');
  }
  
  // Handle button states
  if (isMoveTogetherMode) {
    shapeButtons.forEach(btn => {
      btn.classList.add('active');
      btn.style.pointerEvents = 'none';
      btn.style.cursor = 'default';
    });
    
    // Enable all characters
    document.querySelectorAll('.character-set span').forEach(span => {
      span.classList.remove('disabled');
      span.style.cursor = 'pointer';
    });
  } else {
    shapeButtons.forEach(btn => {
      if (btn.textContent.trim().toLowerCase() !== currentShape) {
        btn.classList.remove('active');
      }
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'none';
    });
    
    // Reset to normal character availability
    updateSelectableLetters();
  }
  
  // Update the animation
  updateVariation();
}


modeToggles.forEach(button => button.addEventListener('click', toggleMoveMode))

// Modify the updateSelectableLetters function to handle together mode
function updateSelectableLetters() {
  if (isMoveTogetherMode) {
    // Enable all characters in together mode
    document.querySelectorAll('.character-set span').forEach(span => {
      span.classList.remove('disabled');
      span.style.cursor = 'none';
    });
    return;
  }
  
  // Original functionality for individual mode
  const availableLetters = SHAPE_LETTERS[currentShape];
  
  document.querySelectorAll('.character-set span').forEach(span => {
    const letter = span.dataset.letter;
    if (availableLetters.includes(letter)) {
      span.classList.remove('disabled');
      span.style.cursor = 'none';
    } else {
      span.classList.add('disabled');
      span.style.cursor = 'help';
      if (currentLetter === letter) {
        // If current letter becomes unavailable, switch to first available letter
        currentLetter = availableLetters[0];
        presentation.textContent = currentLetter;
        updateVariation();
      }
    }
  });
}

// Modify the updateVariation function to handle the together mode
function updateVariation(value = null) {
  const valuesDisplay = document.querySelector('.values-display');

  if (isMoveTogetherMode) {
    if (currentMode === 'random') {
      // For random mode in together mode
      presentation.style.animation = 'none';
      const crclValue = getRandomValue();
      const rectValue = getRandomValue();

      valuesDisplay.style.opacity = '1'; // Make visible in random mode
      valuesDisplay.innerHTML = `axis crcl: ${crclValue}, rect: ${rectValue}`;
      presentation.style.fontVariationSettings = `"CRCL" ${crclValue}, "RECT" ${rectValue}`;
    } else {
      // For animate mode in together mode
      valuesDisplay.style.opacity = '0'; // Make transparent in animate mode
      presentation.style.animation = 'none';
      presentation.offsetHeight; // Trigger reflow
      presentation.style.animation = 'bothAxisAnimation 2s linear infinite';
    }
    return;
  }
  
  const axis = getCurrentAxis();
  
  if (currentMode === 'random') {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    presentation.style.animation = 'none';
    
    const variationValue = value !== null ? value : getRandomValue();
    presentation.style.fontVariationSettings = `"${axis}" ${variationValue}`;

    //values display visible
    valuesDisplay.style.opacity = '1';
    valuesDisplay.innerHTML = `axis ${axis.toLowerCase()}: ${variationValue}`;
  } else {
    //transparent in animate mode
    valuesDisplay.style.opacity = '0';
    
    createAxisAnimation();
    presentation.style.animation = 'none';
    presentation.offsetHeight;
    presentation.style.animation = 'singleAxisAnimation 2s linear infinite';
  }
}

// Split for single and both axis animations
function createAxisAnimation() {
  const singleAxisKeyframes = `
    @keyframes singleAxisAnimation {
      0% { font-variation-settings: "${getCurrentAxis()}" 0; }
      50% { font-variation-settings: "${getCurrentAxis()}" 1000; }
      100% { font-variation-settings: "${getCurrentAxis()}" 0; }
    }
  `;
  
  const bothAxisKeyframes = `
    @keyframes bothAxisAnimation {
      0% { font-variation-settings: "CRCL" 0, "RECT" 0; }
      25% { font-variation-settings: "CRCL" 1000, "RECT" 0; }
      50% { font-variation-settings: "CRCL" 1000, "RECT" 1000; }
      75% { font-variation-settings: "CRCL" 0, "RECT" 1000; }
      100% { font-variation-settings: "CRCL" 0, "RECT" 0; }
    }
  `;
  
  // Remove existing animation styles
  const existingStyle = document.getElementById('font-animation-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new
  const style = document.createElement('style');
  style.id = 'font-animation-style';
  style.textContent = singleAxisKeyframes + bothAxisKeyframes;
  document.head.appendChild(style);
}
 
presentation.addEventListener('click', () => {
  if (currentMode === 'random') {
    updateVariation();
  }
});

// Initialize animations
createAxisAnimation();