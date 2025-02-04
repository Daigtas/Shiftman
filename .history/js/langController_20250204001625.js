// langController.js
let lang = localStorage.getItem('LANG') || 'LT
';
let translations = {};

// Configuration for DOM elements to translate
const translationSelectors = {
    text: '[data-translate-key]:not(input, textarea, select)',
    placeholder: '[data-translate-placeholder]',
    title: '[data-translate-title]',
    html: '[data-translate-html]'
};

// Safe text node replacement function
function replaceTextNodes(element, translation) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue.trim() === element.dataset.translateKey) {
            node.nodeValue = translation;
            break;
        }
    }
}

// Main translation function
function applyTranslations() {
    try {
        // Handle regular text elements
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

        // Handle placeholders
        document.querySelectorAll(translationSelectors.placeholder).forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });

        // Handle title attributes
        document.querySelectorAll(translationSelectors.title).forEach(element => {
            const key = element.dataset.translateTitle;
            if (translations[key]) {
                element.title = translations[key];
            }
        });

    } catch (error) {
        console.error('Translation application error:', error);
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
            loadTranslations(lang);
        }
    });

    // Initial load
    loadTranslations(lang).catch(error => {
        console.error('Initial translation load failed:', error);
    });
});