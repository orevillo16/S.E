const createNewClass = () => {
    const boxClass = document.querySelector('.box'); 
    const container = document.createElement('div');
    const classInput = document.createElement('input');
    const classSubject = document.createElement('input');

    console.log(classInput);
    boxClass.appendChild(container);
    container.appendChild(classInput);
    container.appendChild(classSubject);   
};


