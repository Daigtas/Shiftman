let lang = localStorage.getItem('LANG') || 'LT';
let translations = {};

const translationSelectors = {
    text: '[data-translate-key]:not(input, textarea, select)',
    placeholder: '[data-translate-placeholder]',
    title: '[data-translate-title]',
    html: '[data-translate-html]'
};

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

// Added debounce function to prevent rapid multiple calls
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Modified to handle dynamic updates better
function applyTranslations() {
    try {
        // Text elements
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

        // Placeholders
        document.querySelectorAll(translationSelectors.placeholder).forEach(element => {
            const key = element.dataset.translatePlaceholder;
            element.placeholder = translations[key] || element.dataset.translatePlaceholder;
        });

        // Title attributes
        document.querySelectorAll(translationSelectors.title).forEach(element => {
            const key = element.dataset.translateTitle;
            element.title = translations[key] || element.dataset.translateTitle;
        });

    } catch (error) {
        console.error('Translation error:', error);
    }
}

// Modified to return promise chain
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.lang.json?t=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        
        translations = await response.json();
        applyTranslations();
        
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) langSelect.value = lang;
        
        // Update document language attribute
        document.documentElement.lang = lang.toLowerCase();
        
    } catch (error) {
        console.error(`Translation load failed: ${error}`);
        if (lang !== 'EN') {
            await loadTranslations('EN');
        }
    }
}

// Modified initialization with debouncing
document.addEventListener('DOMContentLoaded', () => {
    const handleLanguageChange = debounce(async (newLang) => {
        lang = newLang;
        localStorage.setItem('LANG', lang);
        await loadTranslations(lang);
    });

    document.body.addEventListener('change', (event) => {
        if (event.target.matches('#languageSelect')) {
            handleLanguageChange(event.target.value);
        }
    });

    // Initial load with cache busting
    loadTranslations(lang);
});