const createNewClass = () => {
    const boxClass = document.querySelector('.box'); 
    const container = document.createElement('div');
    const classInput = document.createElement('input');
    const classSubject = document.createElement('input');
    const buttonContainer = document.createElement('div');
    const createClass = document.createElement('button')

    classInput.classList.add('CNC_Input');  
    classInput.placeholder = 'Enter Class/Section';
    classSubject.classList.add('CNC_Input');
    classSubject.placeholder = 'Enter Subject';
    buttonContainer.classList.add('CreateClass-button-box');
    createClass.classList = ('createClass');
    createClass.textContent = 'Create Class';
    
    boxClass.appendChild(container);
    container.appendChild(classInput);
    container.appendChild(classSubject);  
    boxClass.appendChild(buttonContainer);
    buttonContainer.appendChild(createClass); 



    const addtable = document.createElement('table')
    
    const headerRow = document.createElement('tr');
    const headers = ['NAME', 'STUDENT ID NUMBER', 'GRADE', ''];
    
    container.appendChild(addtable)
    addtable.appendChild(headerRow)
    headerRow.appendChild(headers)
  

    
};


