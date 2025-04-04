// Navigation Logic
export function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        }
    });
}