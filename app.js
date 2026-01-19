
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

        // Special logic for Step 11 (Sales Page) - Inject VSL player
        if (stepIndex === 11) {
            injectVSLPlayer();
        }

        // Scroll to top on step change
        window.scrollTo(0, 0);
    }

    // Function to inject VSL player dynamically
    let playerInjected = false;
    function injectVSLPlayer() {
        if (playerInjected) return; // Only inject once

        const placeholder = document.getElementById('vsl-video-placeholder');
        const hint = document.getElementById('vsl-controls-hint');

        if (placeholder) {
            // Create the iframe dynamically to prevent early playback
            const iframe = document.createElement('iframe');
            iframe.id = 'vsl-video';
            iframe.src = "https://drive.google.com/file/d/1O0CCJJVj8TUPeDJp1B08Kolx07sHAQPX/preview?autoplay=1";
            iframe.style.position = 'absolute';
            iframe.style.top = '-12%';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '124%';
            iframe.style.border = 'none';
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
            iframe.allowFullscreen = true;

            // Append to placeholder
            placeholder.appendChild(iframe);

            // Exibe o aviso de "Clique para Pausar" por alguns segundos
            setTimeout(() => { if (hint) hint.style.opacity = "1"; }, 2000);
            setTimeout(() => { if (hint) hint.style.opacity = "0"; }, 6000);

            // Interface interaction
            const container = placeholder.parentElement;
            container.addEventListener('mouseenter', () => { if (hint) hint.style.opacity = "1"; });
            container.addEventListener('mouseleave', () => { if (hint) hint.style.opacity = "0"; });

            playerInjected = true;
        }
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
