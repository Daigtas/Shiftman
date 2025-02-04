// langController.js

let lang = localStorage.getItem('LANG') || 'EN';
let translations = {};

// Load translations
async function loadTranslations(lang) {
    const response = await fetch(`lang/${lang}.lang.json`);
    translations = await response.json();
    updateText();
}

// Update text based on translations
function updateText() {
    $('#shiftsCalendarTitle').text(translations.shiftsCalendarTitle);
    $('#easyModeButton').text(translations.easyMode);
    $('#prevMonth').text(translations.prevMonth);
    $('#nextMonth').text(translations.nextMonth);
    $('#fullNameHeader').text(translations.fullName);
    $('#totalHoursHeader').text(translations.totalHours);
    $('#sidebarToggleTop').text(translations.sidebarToggleTop);
    $('#sidebarToggle').text(translations.sidebarToggle);
    $('.nav-link[href="partials/about.html"]').text(translations.about);
    $('.nav-link[href="partials/shifts_calendar.html"]').text(translations.shiftsCalendar);
    $('.nav-link[href="partials/shifts_list.html"]').text(translations.shiftsList);
    $('.nav-link[href="partials/settings.html"]').text(translations.settings);
    $('#saveButton').text(translations.save);
    $('#languageSelectLabel').text(translations.languageSelect);
    $('#languageSelect').trigger('change');
    $('#languageSelect').selectpicker('refresh');
    $('#languageSelect').selectpicker('render');
    $('#languageSelect').selectpicker('setStyle');
    
}

// Handle language selection
$('#languageSelect').val(lang).on('change', function () {
    lang = $(this).val();
    localStorage.setItem('LANG', lang);
    loadTranslations(lang);
});

// Initial load of translations
loadTranslations(lang);
