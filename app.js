
document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const steps = document.querySelectorAll('.step-container');
    const totalSteps = steps.length;
    const progressContainer = document.querySelector('.progress-bar');

    // Meta Pixel Lead event tracking
    let leadEventFired = false;

    // Function to show a specific step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index + 1 === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Special logic for Step 10 (Loading) - Fire Lead event
        if (stepIndex === 10) {
            startLoading();
            // Fire Meta Pixel Lead event only once
            if (!leadEventFired && typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
                leadEventFired = true;
            }
        }

        // Special logic for Step 11 (Sales Page) - Inject VTurb player
        if (stepIndex === 11) {
            injectVTurbPlayer();
        }

        // Scroll to top on step change
        window.scrollTo(0, 0);
    }

    // Function to inject VTurb player dynamically
    let playerInjected = false;
    function injectVTurbPlayer() {
        if (playerInjected) return; // Only inject once

        const container = document.getElementById('vsl-player-container');
        if (!container) return;

        // Create the vturb-smartplayer element
        const player = document.createElement('vturb-smartplayer');
        player.id = 'vid-6950272290b70171e380baa3';
        player.style.display = 'block';
        player.style.margin = '0 auto';
        player.style.width = '100%';
        player.style.maxWidth = '400px';

        // Set autoplay and muted attributes for proper VTurb behavior
        player.setAttribute('autoplay', 'true');
        player.setAttribute('muted', 'true');

        // Append player to container
        container.appendChild(player);

        // Inject the player script
        const script = document.createElement('script');
        script.src = 'https://scripts.converteai.net/8f699aa9-8fb0-4368-898e-7106526ff7d0/players/6950272290b70171e380baa3/v4/player.js';
        script.async = true;
        document.head.appendChild(script);

        playerInjected = true;
    }

    // Function to go to next step
    window.nextStep = function () {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    };

    function startLoading() {
        // Animate progress bar
        setTimeout(() => {
            if (progressContainer) progressContainer.style.width = '100%';
        }, 100);

        // Wait 3.5s then go to Sales Page (Step 10)
        setTimeout(() => {
            nextStep();
        }, 3500);
    }

    // Initialize
    showStep(currentStep);

    // --- CAROUSEL DRAG LOGIC (For PC Testing) ---
    const slider = document.querySelector('.carousel-container');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        // Set initial cursor
        slider.style.cursor = 'grab';
    }
});
