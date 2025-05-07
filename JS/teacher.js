let isClassCreated = false;

// function to clear the class-info container
const clearClassInfo = () => {
    const classInfo = document.getElementById('class-info');
    classInfo.innerHTML = '';
};

// function to create a table header
const createTableHeader = (headers) => {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    return thead;
};

// Helper function to create a message
const createMessage = (messageText, className) => {
    const message = document.createElement('p');
    message.textContent = messageText;
    message.classList.add(className);
    return message;
};

// Create New Class
const createNewClass = () => {
    if (isClassCreated) return;
    isClassCreated = true;

    clearClassInfo();

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('No logged-in user found! Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    const classInfo = document.getElementById('class-info');
    const container = document.createElement('div');
    const classInput = document.createElement('input');
    const subjectInput = document.createElement('input');
    const buttonContainer = document.createElement('div');
    const createClassBtn = document.createElement('button');

    classInput.classList.add('CNC_Input');
    classInput.placeholder = 'Enter Class / Section';

    subjectInput.classList.add('CNC_Input');
    subjectInput.placeholder = 'Enter Subject';

    buttonContainer.classList.add('CreateClass-button-box');
    createClassBtn.classList.add('createClass');
    createClassBtn.textContent = 'Create Class';

    container.appendChild(classInput);
    container.appendChild(subjectInput);
    container.appendChild(buttonContainer);
    buttonContainer.appendChild(createClassBtn);
    classInfo.appendChild(container);

    createClassBtn.addEventListener('click', () => {
        const className = classInput.value.trim();
        const subjectName = subjectInput.value.trim();

        if (!className || !subjectName) {
            alert('Please fill in both fields.');
            return;
        }

        createClassBtn.disabled = true;
        createClassBtn.textContent = 'Saving...';

        const classData = JSON.parse(localStorage.getItem('classData')) || [];
        const newClass = {
            class: className,
            subject: subjectName,
            students: [],
            user: loggedInUser
        };

        classData.push(newClass);
        localStorage.setItem('classData', JSON.stringify(classData));

        alert('Class created successfully!');
        clearClassInfo();
        isClassCreated = false;
    });
};

// Open Existing Class
const openExistingClass = () => {
    isClassCreated = false;
    clearClassInfo();

    const loggedInUser = localStorage.getItem('loggedInUser');
    const classData = JSON.parse(localStorage.getItem('classData')) || [];
    const userClassData = classData.filter(item => item.user === loggedInUser);

    const classInfo = document.getElementById('class-info');
    if (userClassData.length === 0) {
        const message = createMessage('No classes found', 'message');
        classInfo.appendChild(message);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('class-table');
    table.appendChild(createTableHeader(['Class / Section', 'Subject', 'Actions']));

    const tbody = document.createElement('tbody');
    userClassData.forEach(item => {
        const row = document.createElement('tr');
        const classCell = document.createElement('td');
        const subjectCell = document.createElement('td');
        const actionCell = document.createElement('td');
        const actionDiv = document.createElement('div');
        const openClassBtn = document.createElement('button');
        const deleteClassBtn = document.createElement('button');

        classCell.textContent = item.class;
        subjectCell.textContent = item.subject;

        openClassBtn.textContent = 'Open Class';
        deleteClassBtn.textContent = 'Delete Class';
        actionDiv.classList.add('button-class');
        actionDiv.appendChild(openClassBtn);
        actionDiv.appendChild(deleteClassBtn);
        actionCell.appendChild(actionDiv);

        openClassBtn.addEventListener('click', () => Gradetable(item));

        row.appendChild(classCell);
        row.appendChild(subjectCell);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    classInfo.appendChild(table);
};

// Grade Table
const Gradetable = (classItem) => {
    clearClassInfo();

    const classInfo = document.getElementById('class-info');
    const classHeaderDiv = document.createElement('div');
    classHeaderDiv.classList.add('class-header');

    const classDiv = document.createElement('div');
    classDiv.textContent = `Class: ${classItem.class}`;
    classDiv.classList.add('class-name');

    const subjectDiv = document.createElement('div');
    subjectDiv.textContent = `Subject: ${classItem.subject}`;
    subjectDiv.classList.add('subject-name');

    classHeaderDiv.appendChild(classDiv);
    classHeaderDiv.appendChild(subjectDiv);
    classInfo.appendChild(classHeaderDiv);

    const table = document.createElement('table');
    table.appendChild(createTableHeader(['Name', 'Student Number', 'Prelim', 'Midterm', 'Finals', 'Actions']));

    const tbody = document.createElement('tbody');
    classItem.students.forEach(student => {
        const row = createStudentRow(student, tbody, classItem);
        tbody.appendChild(row);
    });

    if (classItem.students.length === 0) {
        const newStudent = { name: '', studentNumber: '', prelim: '', midterm: '', finals: '' };
        const newRow = createStudentRow(newStudent, tbody, classItem);
        tbody.appendChild(newRow);
    }

    table.appendChild(tbody);
    classInfo.appendChild(table);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save and Exit';
    saveBtn.classList.add('save-btn');
    saveBtn.addEventListener('click', () => saveTableData(classItem, tbody));
    classInfo.appendChild(saveBtn);
};

// Create Student Row
const createStudentRow = (student, tbody, classItem) => {
    const row = document.createElement('tr');

    const createCellWithInput = (value) => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value || '';
        input.classList.add('input-box');
        cell.appendChild(input);
        return cell;
    };

    row.appendChild(createCellWithInput(student.name));
    row.appendChild(createCellWithInput(student.studentNumber));
    row.appendChild(createCellWithInput(student.prelim));
    row.appendChild(createCellWithInput(student.midterm));
    row.appendChild(createCellWithInput(student.finals));

    const actionCell = document.createElement('td');
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('button-class');

    // Add Button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.classList.add('add-btn');
    addBtn.addEventListener('click', () => {
        const newStudent = { name: '', studentNumber: '', prelim: '', midterm: '', finals: '' };
        const newRow = createStudentRow(newStudent, tbody, classItem);
        tbody.appendChild(newRow);
    });

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        // Check if the row has data
        const inputs = row.querySelectorAll('input');
        const hasData = Array.from(inputs).some(input => input.value.trim() !== '');

        if (hasData) {
            // Show a confirmation dialog if the row has data
            const confirmDelete = confirm('This row contains data. Are you sure you want to delete it?');
            if (!confirmDelete) {
                return; // Abort deletion if the user cancels
            }
        }

        // Proceed with deletion
        if (tbody.rows.length > 1) {
            row.remove();
        } else {
            alert('Cannot delete the last remaining row.');
        }
    });

    actionDiv.appendChild(addBtn);
    actionDiv.appendChild(deleteBtn);
    actionCell.appendChild(actionDiv);
    row.appendChild(actionCell);

    return row;
};

// Save Table Data
const saveTableData = (classItem, tbody) => {
    const rows = [];
    const loggedInUser = localStorage.getItem('loggedInUser'); // Retrieve the logged-in user

    // Iterate through each row in the table body
    const tableRows = tbody.querySelectorAll('tr');
    tableRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length === 5) { // Ensure the row has all required inputs
            rows.push({
                name: inputs[0].value.trim(),
                studentID: inputs[1].value.trim(),
                prelim: inputs[2].value.trim(),
                midterm: inputs[3].value.trim(),
                finals: inputs[4].value.trim(),
            });
        }
    });

    // Update the classItem with the new student data
    classItem.students = rows;

    // Retrieve and update the class data in localStorage
    const classData = JSON.parse(localStorage.getItem('classData')) || [];
    const updatedClassData = classData.map(item =>
        item.class === classItem.class && item.subject === classItem.subject && item.user === loggedInUser
            ? classItem
            : item
    );

    // Save the updated class data back to localStorage
    localStorage.setItem('classData', JSON.stringify(updatedClassData));

    alert('Class data saved successfully!');
    clearClassInfo(); // Clear the class info container
};