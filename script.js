document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggleButton.textContent = 'Switch to Light Theme';
        } else {
            body.classList.remove('dark-theme');
            themeToggleButton.textContent = 'Switch to Dark Theme';
        }
    };

    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to light theme if no preference is saved
        applyTheme('light');
    }

    themeToggleButton.addEventListener('click', () => {
        let currentTheme;
        if (body.classList.contains('dark-theme')) {
            // Switch to light theme
            body.classList.remove('dark-theme');
            themeToggleButton.textContent = 'Switch to Dark Theme';
            currentTheme = 'light';
        } else {
            // Switch to dark theme
            body.classList.add('dark-theme');
            themeToggleButton.textContent = 'Switch to Light Theme';
            currentTheme = 'dark';
        }
        localStorage.setItem('theme', currentTheme);
    });
});
