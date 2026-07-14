/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.getElementById('bottom-nav');
    let currentGaugeValue = 72;

    window.navigateTo = function(targetId) {
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if(activeNav) activeNav.classList.add('active');

        // Manage Bottom Nav visibility
        if(['dashboard', 'history', 'sleep', 'profile'].includes(targetId)) {
            bottomNav.classList.remove('hidden');
        } else {
            bottomNav.classList.add('hidden');
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.getAttribute('data-target'));
        });
    });

    // Startup Sequence
    setTimeout(() => {
        navigateTo('dashboard');
        
        // Trigger Stress Alert after 5 seconds on dashboard
        setTimeout(() => {
            if(document.getElementById('dashboard').classList.contains('active')) {
                showAlert();
            }
        }, 5000);
    }, 2500);

    // Alert Logic
    const alertModal = document.getElementById('stress-alert');
    window.showAlert = () => {
        alertModal.classList.remove('hidden');
    };
    window.hideAlert = () => {
        alertModal.classList.add('hidden');
    };

    // Breathing Exercise Logic
    let breathingInterval;
    window.startBreathing = () => {
        navigateTo('breathing');
        const wrapper = document.querySelector('.breathing-wrapper');
        const instruction = document.getElementById('breathe-instruction');
        
        let isInhaling = true;
        
        const cycle = () => {
            if(isInhaling) {
                wrapper.classList.add('breathing-active');
                instruction.textContent = "Breathe In";
                instruction.style.opacity = 1;
            } else {
                wrapper.classList.remove('breathing-active');
                instruction.textContent = "Breathe Out";
                instruction.style.opacity = 1;
            }
            isInhaling = !isInhaling;
        };
        
        // Fade text out slightly before changing
        const fadeText = () => { instruction.style.opacity = 0; };

        cycle(); // Initial
        
        let cycleCount = 0;
        breathingInterval = setInterval(() => {
            fadeText();
            setTimeout(cycle, 500);
            cycleCount++;
            
            // End exercise after ~16 seconds (4 cycles)
            if(cycleCount >= 4) {
                clearInterval(breathingInterval);
                setTimeout(showSuccess, 2000);
            }
        }, 4000);
    };

    window.showSuccess = () => {
        generateConfetti();
        navigateTo('success');
    };

    window.finishExercise = () => {
        // Update Gauge visually for the demo
        currentGaugeValue = 55;
        const progressPath = document.querySelector('.gauge-progress');
        const valText = document.getElementById('dash-stress-val');
        const labelText = document.getElementById('dash-stress-label');
        
        // Circumference of gauge is ~125.6
        // Map 0-100 to 125.6-0 offset (since it's a half circle, max dasharray is 125.6)
        const offset = 125.6 - (125.6 * (currentGaugeValue / 100));
        progressPath.style.strokeDashoffset = offset;
        progressPath.style.stroke = "var(--success)";
        
        valText.innerHTML = `${currentGaugeValue}<small>%</small>`;
        valText.style.color = "var(--success)";
        labelText.innerText = "Low";
        labelText.style.color = "var(--success)";

        navigateTo('dashboard');
    };

    // Confetti Generator
    function generateConfetti() {
        const container = document.getElementById('confetti');
        container.innerHTML = '';
        const colors = ['#00d2ff', '#3a7bd5', '#00f260', '#ffffff'];
        
        for(let i=0; i<50; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + '%';
            conf.style.animationDelay = Math.random() * 2 + 's';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(conf);
        }
    }
});
