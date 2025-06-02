document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherButton = document.getElementById('theme-switcher-button');
    const themeModal = document.getElementById('theme-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const themeOptionButtons = document.querySelectorAll('.theme-option-button');
    const rootHtml = document.documentElement;

    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');

    // Function to apply the theme
    function applyTheme(theme) {
        rootHtml.setAttribute('data-theme', theme);
        localStorage.setItem('theme-preference', theme);

        // Update sidebar button icon
        if (theme === 'dark') {
            if (lightIcon) lightIcon.style.display = 'none';
            if (darkIcon) darkIcon.style.display = 'inline-block';
        } else {
            if (lightIcon) lightIcon.style.display = 'inline-block';
            if (darkIcon) darkIcon.style.display = 'none';
        }

        // Update active state on modal buttons
        themeOptionButtons.forEach(btn => {
            if (btn.getAttribute('data-theme-set') === theme) {
                btn.classList.add('active-theme-choice');
            } else {
                btn.classList.remove('active-theme-choice');
            }
        });
    }

    // Function to get system theme
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Load saved theme or system theme
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'system' || !savedTheme) {
            const systemTheme = getSystemTheme();
            applyTheme(systemTheme); // Apply system theme
            // Highlight "System" button in modal if it's the active choice
            const systemButtonInModal = document.querySelector('.theme-option-button[data-theme-set="system"]');
            if (systemButtonInModal) systemButtonInModal.classList.add('active-theme-choice');
        } else {
            applyTheme(savedTheme);
        }
    }

    // Event Listeners
    if (themeSwitcherButton) {
        themeSwitcherButton.addEventListener('click', () => {
            if (themeModal) themeModal.classList.add('active');
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (themeModal) themeModal.classList.remove('active');
        });
    }

    // Close modal if clicked outside of modal-content
    if (themeModal) {
        themeModal.addEventListener('click', (event) => {
            if (event.target === themeModal) { // Check if the click is on the modal backdrop
                themeModal.classList.remove('active');
            }
        });
    }


    themeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const chosenTheme = button.getAttribute('data-theme-set');
            if (chosenTheme === 'system') {
                applyTheme(getSystemTheme());
                localStorage.setItem('theme-preference', 'system'); // Explicitly save 'system'
            } else {
                applyTheme(chosenTheme);
            }
            if (themeModal) themeModal.classList.remove('active'); // Close modal after selection
        });
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const currentPreference = localStorage.getItem('theme-preference');
        if (currentPreference === 'system' || !currentPreference) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });

    // Initial load
    loadTheme();
});
