// langController.js

let lang = localStorage.getItem('LANG') || 'EN';
let translations = {};

// Load translations
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.lang.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${response.statusText}`);
        }
        translations = await response.json();
        updateText();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Update text based on translations
function updateText() {
    $('#shiftsCalendarTitle').text(translations.shiftsCalendarTitle || 'Shifts Calendar');
    $('#easyModeButton').text(translations.easyMode || 'Easy Mode');
    $('#prevMonth').text(translations.prevMonth || 'Previous Month');
    $('#nextMonth').text(translations.nextMonth || 'Next Month');
    $('#fullNameHeader').text(translations.fullName || 'Full Name');
    $('#totalHoursHeader').text(translations.totalHours || 'Total Hours');
    $('#sidebarToggleTop').text(translations.sidebarToggleTop || 'Toggle Sidebar');
    $('#sidebarToggle').text(translations.sidebarToggle || 'Toggle Sidebar');
    $('.nav-link[href="partials/about.html"]').text(translations.about || 'About');
    $('.nav-link[href="partials/shifts_calendar.html"]').text(translations.shiftsCalendar || 'Shifts Calendar');
    $('.nav-link[href="partials/shifts_list.html"]').text(translations.shiftsList || 'Shifts List');
    $('.nav-link[href="partials/settings.html"]').text(translations.settings || 'Settings');
    $('#saveButton').text(translations.saveChanges || 'Save Changes');
    $('#languageSelectLabel').text(translations.languageSelect || 'Select Language');
    $('#aboutTitle').text(translations.aboutTitle || 'About');
}

// Ensure jQuery is loaded before executing the script
$(document).ready(function () {
    $('#languageSelect').val(lang).on('change', function () {
        lang = $(this).val();
        localStorage.setItem('LANG', lang);
        loadTranslations(lang);
    });

    // Initial load of translations
    loadTranslations(lang);
});
