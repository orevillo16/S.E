// Function to get and log the data of a specific student by studentNumber
const getStudentData = () => {
    const studentNumber = JSON.parse(localStorage.getItem('studentNumber')); // Retrieve student number from localStorage
    const classData = JSON.parse(localStorage.getItem('classData')) || []; // Retrieve class data from localStorage

    let studentData = null;

    // Iterate through all classes and students to find the matching studentID
    classData.forEach(classItem => {
        classItem.students.forEach(student => {
            if (String(student.studentID).trim() === String(studentNumber).trim()) {
                studentData = student; // Store the matched student data
                console.log('Matched Student Data:', student); // Log the matched student data
            }
        });
    });
};

// Function to get and display the grades of a specific student by studentNumber
const getStudentGrades = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {}; // Retrieve logged-in user from localStorage
    const classData = JSON.parse(localStorage.getItem('classData')) || []; // Retrieve class data from localStorage

    const studentNumber = loggedInUser.studentNumber; // Get the studentNumber from loggedInUser

    if (!studentNumber) {
        console.log('No student number found for the logged-in user.');
        return;
    }

    const container = document.getElementById('container'); // Get the container div
    container.innerHTML = ''; // Clear any existing content

    const table = document.createElement('table');
    table.classList.add('grades-table'); // Add a class for styling

    // Create table header (add Average and Remarks)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Subject', 'Prelim', 'Midterm', 'Finals', 'Average', 'Remarks'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Find the student in all classes and populate the table
    let studentFound = false;
    classData.forEach(classItem => {
        const student = classItem.students.find(student => student.studentID === studentNumber);

        if (student) {
            studentFound = true;

            const row = document.createElement('tr');
            // Calculate average and remarks if not present
            let average = student.average;
            let remarks = student.remarks;
            if (average === undefined || remarks === undefined) {
                const prelim = parseFloat(student.prelim) || 0;
                const midterm = parseFloat(student.midterm) || 0;
                const finals = parseFloat(student.finals) || 0;
                average = ((prelim + midterm + finals) / 3).toFixed(2);
                remarks = (student.prelim === '' && student.midterm === '' && student.finals === '') ? '' : (average >= 75 ? 'Passed' : 'Failed');
            }
            [classItem.subject, student.prelim, student.midterm, student.finals, average, remarks].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }
    });

    table.appendChild(tbody);

    if (studentFound) {
        container.appendChild(table); // Append the table to the container
    } else {
        const noDataMessage = document.createElement('div');
        noDataMessage.classList.add('no-data-message');
        noDataMessage.textContent = 'No class data found';
        container.appendChild(noDataMessage);
    }
};

// Example usage: Call the function on page load
document.addEventListener('DOMContentLoaded', () => {
    getStudentData(); // Call the function to retrieve and log the student data

    getStudentGrades(); // Call the function to display the student grades
});