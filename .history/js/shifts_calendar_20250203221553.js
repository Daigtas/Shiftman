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
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $('#monthName').text(`${monthNames[currentMonth]} ${currentYear}`);
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
                    <th>Employee</th>
                    ${Array.from({ length: daysInMonth }, (_, i) => {
            const day = new Date(currentYear, currentMonth, i + 1).getDay();
            return `<th class="${day === 0 || day === 6 ? 'weekend' : ''}">${i + 1}</th>`;
        }).join('')}
                    <th id="totalHoursHeader">Total Hours</th>
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

        table.DataTable({ paging: false, searching: true, ordering: true, info: false });
    }


    function loadData() {
        let data = JSON.parse(localStorage.getItem('calendarData')) || {};
        if (!data[currentYear]?.[currentMonth]) return;

        $('#calendar tbody tr').each(function () {
            const fullName = $(this).find('td:first').text();
            const monthData = data[currentYear][currentMonth][fullName] || [];

            $(this).find('td:not(:first, :last)').each(function (index) {
                const cellData = monthData[index] || { fill: 'null', color: '' };
                const colorClass = colorGroups[fullName];
                $(this).data('fill', cellData.fill).attr('data-color', cellData.color);

                switch (cellData.fill) {
                    case 'solid': $(this).addClass(colorClass); break;
                    case 'mesh-45': $(this).addClass(colorClass + ' cell-mesh-45'); break;
                    case 'mesh-horizontal-vertical': $(this).addClass('cell-mesh-horizontal-vertical'); break;
                }
            });
        });
    }

    $('#nextMonth').off('click').on('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        initializeShiftsCalendar();
        loadData();
    });

    $('#prevMonth').off('click').on('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        initializeShiftsCalendar();
        loadData();
    });

    $('#easyModeButton').off('click').on('click', function (e) {
        if (e.isTrigger) return; // Prevent double execution
        easyModeActive = !easyModeActive;
        $(this).toggleClass('active', easyModeActive);
    });

    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    initializeShiftsCalendar();
    loadData();
});
