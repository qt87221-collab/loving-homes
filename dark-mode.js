// Check local storage for dark mode preference and apply it before styling loads to prevent FOUT
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark-mode');
}
if (localStorage.getItem('fontSize')) {
    document.documentElement.style.fontSize = localStorage.getItem('fontSize') + 'px';
}
