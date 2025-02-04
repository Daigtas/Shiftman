let lang = localStorage.getItem('LANG') || 'LT';
let translations = {};

// Configuration for DOM elements to translate
const translationSelectors = {
    // Corrected selector to properly exclude form elements
    text: '[data-translate-key]:not(input):not(textarea):not(select)',
    placeholder: '[data-translate-placeholder]',
    title: '[data-translate-title]',
    html: '[data-translate-html]'
};

// Safe text node replacement function
function replaceTextNodes(element, translation) {
    // Clear existing content while preserving child structure
    const children = Array.from(element.childNodes);
    
    children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() === element.dataset.translateKey) {
            child.nodeValue = translation;
        }
    });
}

// Main translation function
function applyTranslations() {
    try {
        // Process data-translate-key elements
document.querySelectorAll(translationSelectors.text).forEach(element => {
        const key = element.dataset.translateKey;
        if (translations[key]) {
            if (element.dataset.translateHtml) {
                element.innerHTML = translations[key];
            } else {
                // First clear then replace to handle multiple text nodes
                const temp = document.createElement('div');
                temp.textContent = translations[key];
                element.replaceChildren(...temp.childNodes);
            }
        }
    });

        // Handle placeholders, titles, etc. (existing code remains)
        document.querySelectorAll(translationSelectors.placeholder).forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[key]) element.placeholder = translations[key];
        });

        document.querySelectorAll(translationSelectors.title).forEach(element => {
            const key = element.dataset.translateTitle;
            if (translations[key]) element.title = translations[key];
        });

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
    if (lang !== 'EN') {
      console.log('Falling back to English...');
      await loadTranslations('EN');
    } else {
      // Ultimate fallback to prevent infinite loops
      translations = { /* basic English translations */ };
      applyTranslations();
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