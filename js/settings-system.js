document.addEventListener('DOMContentLoaded', function () {
    const debuggingCheckbox = document.getElementById('debuggingEnabled');
    const isDebuggingEnabled = localStorage.getItem('debugging') === 'true';

    debuggingCheckbox.checked = isDebuggingEnabled;

    debuggingCheckbox.addEventListener('change', function () {
        localStorage.setItem('debugging', debuggingCheckbox.checked ? 'true' : 'false');
        location.reload(); // Reload the page to apply the setting
    });
});
