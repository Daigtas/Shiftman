$(document).ready(function () {
    // Constants
    let currentYear, currentMonth, easyModeActive = false;

    // Define color groups
    const colorGroups = {
        'Andrius Lukminas': 'cell-red',
        'Dovydas Žvirblis': 'cell-red',
        'Robertas Mickevičius': 'cell-blue',
        'Kristina Januškevičiūtė': 'cell-blue',
        'Ignas Kerpė': 'cell-green',
        'Ramūnas Ruibys': 'cell-green',
        'Modesta Chodžamkulova': 'cell-orange',
        'Mantas Ramilis': 'cell-orange'
    };

    function updateMonthYearText() {
        const monthNames = translations.monthNames || [];
        if (monthNames.length > 0) {
            $('#monthName').text(`${monthNames[currentMonth]} ${currentYear}`);
        } else {
            $('#monthName').text(`${currentMonth + 1} ${currentYear}`);
        }
    }

    function initializeShiftsCalendar() {
        const table = $('#calendar');
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        updateMonthYearText();

        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }

        table.html(`
            <thead>
                <tr>
                    <th id="fullNameHeader">${translations.fullName || 'Full Name'}</th>
                    ${Array.from({ length: daysInMonth }, (_, i) => {
                        const day = new Date(currentYear, currentMonth, i + 1).getDay();
                        return `<th class="${day === 0 || day === 6 ? 'weekend' : ''}">${i + 1}</th>`;
                    }).join('')}
                    <th id="totalHoursHeader">${translations.totalHours || 'Total Hours'}</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(colorGroups).map(name => `
                    <tr>
                        <td>${name}</td>
                        ${Array.from({ length: daysInMonth }, (_) => `<td data-color="null" data-fill="null"></td>`).join('')}
                        <td class="total-hours">0</td>
                    </tr>
                `).join('')}
            </tbody>
        `);

        table.DataTable({
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    text: 'Export to PDF',
                    className: 'btn btn-primary'
                },
                {
                    extend: 'excelHtml5',
                    text: 'Export to XLSX',
                    className: 'btn btn-primary'
                }
            ]
        });

        // Reattach event listeners
        initializeCalendar();
    }

    function initializeCalendar() {
        // Use event delegation for dynamic cells (REVISED)
        $('#calendar tbody').off('dblclick').on('dblclick', 'td:not(:first-child, :last-child)', function () {
            if (easyModeActive) { // Check Easy Mode state
                const $cell = $(this);
                const fullName = $cell.closest('tr').find('td:first').text();
                const colorClass = colorGroups[fullName];
                applyFill($cell, colorClass);
            }
        });

        // Full Name cell editing
        $('#calendar tbody').on('dblclick', 'td:first-child', function () {
            const $cell = $(this);
            const currentText = $cell.text();
            const $input = $('<input>', {
                type: 'text',
                value: currentText,
                class: 'form-control'
            });

            $cell.html($input);
            $input.focus();

            $input.on('blur keypress', function (e) {
                if (e.type === 'blur' || e.which === 13) {
                    const newText = $input.val();
                    $cell.text(newText);
                    saveData();
                }
            });
        });
    }

    // Apply fill types (REVISED FOR 4-STEP CYCLE)
    function applyFill($cell, colorClass) {
        const fills = ['null', 'solid', 'mesh-45', 'mesh-horizontal-vertical'];
        const currentFill = $cell.data('fill') || 'null';
        let nextIndex = (fills.indexOf(currentFill) + 1) % fills.length; // Move to the next step in the cycle
        const nextFill = fills[nextIndex];

        // Reset all styling
        $cell.removeClass('cell-red cell-blue cell-green cell-orange cell-mesh-45 cell-mesh-horizontal-vertical')
             .attr('data-color', '');

        // Apply new styling based on the next fill type
        switch (nextFill) {
            case 'solid':
                $cell.addClass(colorClass)
                     .attr('data-color', colorClass.replace('cell-', ''));
                break;
            case 'mesh-45':
                $cell.addClass(colorClass + ' cell-mesh-45')
                     .attr('data-color', colorClass.replace('cell-', ''));
                break;
            case 'mesh-horizontal-vertical':
                $cell.addClass('cell-mesh-horizontal-vertical');
                break;
            case 'null':
                // No styling applied
                break;
        }

        // Update the fill state
        $cell.data('fill', nextFill);

        // Update hours count for the row
        updateHoursCount($cell.closest('tr'));
    }

    // Update hours count at the end of each row
    function updateHoursCount($row) {
        const $cells = $row.find('td').not(':first, :last'); // Exclude the first and last cell
        let totalHours = 0;
        $cells.each(function () {
            const fill = $(this).data('fill') || 'null';
            let hoursToAdd = 0;
            if (fill === 'solid') {
                hoursToAdd = 12;
            } else if (fill === 'mesh-45') {
                hoursToAdd = 11;
            }
            totalHours += hoursToAdd;
        });

        $row.find('td:last').text(totalHours);
    }

    // Save data to LocalStorage
    function saveData() {
        const data = JSON.parse(localStorage.getItem('calendarData')) || {};
        const year = currentYear;
        const month = String(currentMonth + 1).padStart(2, '0');

        $('#calendar tbody tr').each(function () {
            const fullName = $(this).find('td:first').text();
            const monthData = $(this).find('td:not(:first, :last)').map(function () {
                return {
                    fill: $(this).data('fill') || 'null',
                    color: $(this).attr('data-color') || ''
                };
            }).get();

            if (!data[fullName]) {
                data[fullName] = {};
            }

            if (!data[fullName][year]) {
                data[fullName][year] = {};
            }

            data[fullName][year][month] = monthData;
        });

        localStorage.setItem('calendarData', JSON.stringify(data));
        console.log('Data saved to LocalStorage:', data);

        // Show success message
        showSuccessMessage(translations.dataSaved || 'Data saved successfully.');

        // Hide save button
        $('#saveButton').remove();
        $('#easyModeButton').text(translations.easyMode || 'Easy Mode');
    }

    // Load data from LocalStorage
    function loadData() {
        const data = JSON.parse(localStorage.getItem('calendarData')) || {};
        const year = currentYear;
        const month = String(currentMonth + 1).padStart(2, '0');

        $('#calendar tbody tr').each(function () {
            const fullName = $(this).find('td:first').text();
            const monthData = data[fullName]?.[year]?.[month] || [];

            $(this).find('td:not(:first, :last)').each(function (index) {
                const cellData = monthData[index] || { fill: 'null', color: '' };
                const colorClass = colorGroups[fullName];

                $(this).data('fill', cellData.fill)
                    .attr('data-color', cellData.color);

                // Re-apply visual styles
                switch (cellData.fill) {
                    case 'solid':
                        $(this).addClass(colorClass);
                        break;
                    case 'mesh-45':
                        $(this).addClass(colorClass + ' cell-mesh-45');
                        break;
                    case 'mesh-horizontal-vertical':
                        $(this).addClass('cell-mesh-horizontal-vertical');
                        break;
                }
            });

            updateHoursCount($(this)); // Update hours count for the row
        });
    }

    // Show success message
    function showSuccessMessage(message) {
        const successMessage = $(`<div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
        $('#content').prepend(successMessage);
        setTimeout(() => {
            successMessage.alert('close');
        }, 3000);
    }

    // Handle month navigation
    $('#prevMonth').on('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        initializeShiftsCalendar();
        loadData();
    });

    $('#nextMonth').on('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        initializeShiftsCalendar();
        loadData();
    });

    // Initial setup
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    loadTranslations(lang).then(() => {
        initializeShiftsCalendar();
        loadData();
    });

    // Easy Mode toggle
    $('#easyModeButton').off('click').on('click', function () {
        easyModeActive = !easyModeActive;
        $(this)
            .toggleClass('btn-primary btn-success', easyModeActive)
            .html(easyModeActive 
                ? '<i class="fas fa-check-circle"></i> ' + (translations.easyModeActive || 'Easy Mode Active')
                : '<i class="fas fa-edit"></i> ' + (translations.enableEasyMode || 'Enable Easy Mode'));
        
        // Show/hide save button
        if (easyModeActive && !$('#saveButton').length) {
            $('<button/>', {
                id: 'saveButton',
                class: 'btn btn-danger ml-2',
                html: '<i class="fas fa-save"></i> ' + (translations.saveChanges || 'Save Changes')
            }).insertAfter(this).click(saveData);
        } else {
            $('#saveButton').remove();
        }
    });
});
