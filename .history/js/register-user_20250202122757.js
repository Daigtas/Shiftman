document.addEventListener('DOMContentLoaded', function () {
    const isDebuggingEnabled = localStorage.getItem('debugging') === 'true';

    const debugLog = (message) => {
        if (isDebuggingEnabled) {
            console.log(message);
        }
    };

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    document.querySelectorAll('th.sortable').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
        debugLog('Table sorted');
    })));

    // Add jQuery UI hover effects to rows
    $('#usersTable tbody tr').hover(
        function () {
            $(this).addClass('ui-state-hover');
            debugLog('Row hover in');
        },
        function () {
            $(this).removeClass('ui-state-hover');
            debugLog('Row hover out');
        }
    );

    // Form validation
    const validateForm = () => {
        const fullName = $('#fullName').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirmPassword').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fullName && emailRegex.test(email) && password === confirmPassword && password.length > 0) {
            $('#addUserSubmit').prop('disabled', false);
            debugLog('Form validated: enabled');
        } else {
            $('#addUserSubmit').prop('disabled', true);
            debugLog('Form validated: disabled');
        }
    };

    $('#addUserForm').on('input', validateForm);

    // Handle form submission
    $('#addUserForm').on('submit', function (e) {
        e.preventDefault();
        // Add user logic here
        alert('User added successfully!');
        debugLog('Form submitted');
    });

    // Sorting functionality
    $('#sortSelect').on('change', function () {
        const sortBy = $(this).val();
        const th = $(`th[data-sort="${sortBy}"]`);
        th.trigger('click');
        debugLog(`Sort by: ${sortBy}`);
    });

    // Ensure the "Add User" button has a click event
    $('#addUserSubmit').on('click', function () {
        if (!$(this).prop('disabled')) {
            $('#addUserForm').submit();
        }
    });

    // Handle edit button click
    $('#usersTable').on('click', '.btn-warning', function () {
        const row = $(this).closest('tr');
        const fullName = row.find('td:eq(1)').text();
        const email = row.find('td:eq(2)').text();

        $('#fullName').val(fullName);
        $('#email').val(email);
        $('#password').val('');
        $('#confirmPassword').val('');
        $('#addUserSubmit').prop('disabled', true);

        $('#addUserModal').modal('show');
        debugLog('Edit button clicked');
    });
});