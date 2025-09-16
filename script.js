document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculation-form');
    const outputSection = document.getElementById('output-section');
    const totalDaysEl = document.getElementById('total-days');
    const ageBreakdownEl = document.getElementById('age-breakdown');
    const recordTableBody = document.querySelector('#record-table tbody');
    const exportBtn = document.getElementById('export-btn');

    const TARGET_DATE = new Date('2025-09-01T00:00:00');

    // Function to calculate age and days lived
    function calculateAge(dobString) {
        const dobDate = new Date(dobString);
        
        // Calculate total days
        const diffInTime = TARGET_DATE.getTime() - dobDate.getTime();
        const totalDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

        // Calculate years, months, days
        let years = TARGET_DATE.getFullYear() - dobDate.getFullYear();
        let months = TARGET_DATE.getMonth() - dobDate.getMonth();
        let days = TARGET_DATE.getDate() - dobDate.getDate();

        if (days < 0) {
            months--;
            const daysInLastMonth = new Date(TARGET_DATE.getFullYear(), TARGET_DATE.getMonth(), 0).getDate();
            days += daysInLastMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return {
            totalDays,
            ageBreakdown: `${years} years, ${months} months, ${days} days`
        };
    }

    // Load records from local storage and display them
    function loadRecords() {
        const records = JSON.parse(localStorage.getItem('records')) || [];
        recordTableBody.innerHTML = ''; // Clear existing records
        records.forEach(record => addRecordToTable(record, false));
        if (records.length > 0) {
            exportBtn.classList.remove('hidden');
        }
    }

    // Add a new record to the table and local storage
    function addRecordToTable(record, saveToStorage = true) {
        const row = recordTableBody.insertRow();
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.dob}</td>
            <td>${record.totalDays}</td>
            <td>${record.ageBreakdown}</td>
        `;

        if (saveToStorage) {
            const records = JSON.parse(localStorage.getItem('records')) || [];
            records.push(record);
            localStorage.setItem('records', JSON.stringify(records));
        }
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        
        const { totalDays, ageBreakdown } = calculateAge(dob);

        totalDaysEl.textContent = totalDays;
        ageBreakdownEl.textContent = ageBreakdown;
        outputSection.classList.remove('hidden');

        const newRecord = {
            name: name,
            dob: dob,
            totalDays: totalDays,
            ageBreakdown: ageBreakdown
        };

        addRecordToTable(newRecord);
        form.reset(); // Clear form fields
        exportBtn.classList.remove('hidden');
    });

    // Export records to CSV
    exportBtn.addEventListener('click', () => {
        const records = JSON.parse(localStorage.getItem('records')) || [];
        if (records.length === 0) {
            alert("No records to export!");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        const header = ["Name", "DOB", "Days Lived", "Age Lived"].join(",");
        csvContent += header + "\n";

        records.forEach(record => {
            const row = [
                `"${record.name}"`, 
                `"${record.dob}"`, 
                record.totalDays, 
                `"${record.ageBreakdown}"`
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "day_calculation_records.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial load
    loadRecords();
});