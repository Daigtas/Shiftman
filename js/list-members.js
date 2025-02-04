document.addEventListener('DOMContentLoaded', function () {
    const isDebuggingEnabled = localStorage.getItem('debugging') === 'true';

    const debugLog = (message) => {
        if (isDebuggingEnabled) {
            console.log(message);
        }
    };

    // Initialize DataTables
    const table = $('#usersTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });

    // Sorting functionality
    $('#sortSelect').on('change', function () {
        const sortBy = $(this).val();
        const column = table.column(`[data-sort="${sortBy}"]`);
        column.order('asc').draw();
        debugLog(`Sort by: ${sortBy}`);
    });

    // Add jQuery UI hover effects to rows
    $('#usersTable tbody').on('mouseenter', 'tr', function () {
        $(this).addClass('ui-state-hover');
        debugLog('Row hover in');
    }).on('mouseleave', 'tr', function () {
        $(this).removeClass('ui-state-hover');
        debugLog('Row hover out');
    });

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
        $('#addUserModal').modal('hide');
        debugLog('Form submitted');
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
