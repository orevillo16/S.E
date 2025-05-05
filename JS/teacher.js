let isClassCreated = false;

const createNewClass = () => {
    if (isClassCreated) return; // Prevent duplicate creation
    isClassCreated = true;

    const classInfo = document.getElementById('class-info'); // Target the class-info container
    classInfo.innerHTML = ''; // Clear the container to remove any existing content

    const loggedInUser = localStorage.getItem('loggedInUser');
    console.log('Logged-in user:', loggedInUser); // Debugging

    if (!loggedInUser) {
        alert('No logged-in user found! Please log in first.');
        // Optionally redirect to login page
        window.location.href = 'login.html';
        return;
    }

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

    classInfo.appendChild(container); // Append the form to the class-info container

    createClassBtn.addEventListener('click', () => {
        const className = classInput.value.trim();
        const subjectName = subjectInput.value.trim();

        if (!className || !subjectName) {
            alert('Please fill in both fields.');
            return;
        }

        createClassBtn.disabled = true;
        createClassBtn.textContent = 'Saving...';

        // Save to localStorage
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
        classInfo.innerHTML = ''; // Clear the form after saving
        isClassCreated = false; // Reset the flag
    });
};

const openExistingClass = () => {
    isClassCreated = false; // Reset the flag to allow switching back to "Create New Class"

    const classInfo = document.getElementById('class-info'); // Target the class-info container
    classInfo.innerHTML = ''; // Clear the container to remove any existing content

    const loggedInUser = localStorage.getItem('loggedInUser');
    const classData = JSON.parse(localStorage.getItem('classData')) || [];

    const userClassData = classData.filter(item => item.user === loggedInUser);

    if (userClassData.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No classes found';
        message.classList.add('message'); // Add a class for styling
        classInfo.appendChild(message); // Append the message to the class-info container
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    

    ['Class / Section', 'Subject', 'Actions'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    
    userClassData.forEach((item) => {
        const row = document.createElement('tr');
        const classCell = document.createElement('td');
        const subjectCell = document.createElement('td');
        const action = document.createElement('td');
        const actionDiv = document.createElement('div');
        const addClassBtn = document.createElement('button');
        const deleteClassBtn = document.createElement('button');

    actionDiv.classList.add('button-class'); // Add a class for styling
    deleteClassBtn.classList.add('button-class'); // Add a class for styling
    addClassBtn.textContent = 'Open Class';
    deleteClassBtn.textContent = 'Delete Class';

        classCell.textContent = item.class;
        subjectCell.textContent = item.subject;

    table.classList.add('class-table'); // Add a class for styling
        row.appendChild(classCell);
        row.appendChild(subjectCell);
        row.appendChild(action); // Append the action cell to the row
        action.appendChild(actionDiv); // Append the action div to the action cell
        actionDiv.appendChild(addClassBtn); // Append the button to the action cell
        actionDiv.appendChild(deleteClassBtn); // Append the button to the action cell

       
        tbody.appendChild(row);
    });

    classInfo.appendChild(table); // Append the table to the class-info container
};
