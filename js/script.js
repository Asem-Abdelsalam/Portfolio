// Initialize navigation and interactivity features after the DOM is ready
import { initNavigation } from './navigation.js';
import { initInteractivity } from './interactivity.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initInteractivity();
});