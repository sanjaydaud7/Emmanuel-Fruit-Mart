// Simple scroll animation
document.addEventListener("DOMContentLoaded", () => {
    const storyBlocks = document.querySelectorAll('[data-aos]');
  
    function checkVisibility() {
      storyBlocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          block.classList.add('visible');
        }
      });
    }
  
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Run on load
  });
  // Sparkle Animation
const sparkleContainer = document.querySelector('.sparkle-bg');

function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
  sparkle.style.width = sparkle.style.height = `${Math.random() * 18 + 6}px`;


  sparkleContainer.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 10000); // Remove after animation
}

// Sprinkle sparkles every 300ms
setInterval(createSparkle, 50);
