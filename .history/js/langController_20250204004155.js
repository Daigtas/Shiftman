let lang = localStorage.getItem('LANG') || 'LT';
let translations = {};

// Configuration for DOM elements to translate
const translationSelectors = {
    text: '[data-translate-key]:not(input, textarea, select)',
    placeholder: '[data-translate-placeholder]',
    title: '[data-translate-title]',
    html: '[data-translate-html]'
};

// Updated text replacement logic
function replaceTextNodes(element, translation) {
    // Clear existing text nodes
    while (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
        element.removeChild(element.firstChild);
    }
    // Add translated text
    element.appendChild(document.createTextNode(translation));
}

// Updated translation application logic
function applyTranslations() {
    try {
        // Handle text elements
        document.querySelectorAll(translationSelectors.text).forEach(element => {
            const key = element.dataset.translateKey;
            if (translations[key]) {
                if (element.dataset.translateHtml) {
                    element.innerHTML = translations[key];
                } else {
                    replaceTextNodes(element, translations[key]);
                }
            }
        });
        // ... rest of your existing applyTranslations() code ...
    } catch (error) {
        console.error('Translation error:', error);
    }
}

// Load translations with fallback
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.lang.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        translations = await response.json();
        applyTranslations();
        
        // Update language selector safely
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = lang;
        }
    } catch (error) {
        console.error(`Failed to load ${lang} translations:`, error);
        // Fallback to English if selected language fails
        if (lang !== 'EN') {
            console.log('Attempting English fallback...');
            await loadTranslations('EN');
        }
    }
}

// Initialize language controller
document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for language selector
    document.body.addEventListener('change', (event) => {
        if (event.target.matches('#languageSelect')) {
            lang = event.target.value;
            localStorage.setItem('LANG', lang);
            location.reload(); // Reload the page on language change
        }
    });

    // Initial load
    loadTranslations(lang).catch(error => {
        console.error('Initial translation load failed:', error);
    });
});