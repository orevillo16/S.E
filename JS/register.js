document.addEventListener("DOMContentLoaded", function () {
    const selectOptionDiv = document.querySelector('.select-option');
    const dynamicInputDiv = document.createElement('div');
    dynamicInputDiv.id = 'dynamic-input-container';
    dynamicInputDiv.className = 'inner-box-form';

    document.querySelectorAll('.select-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            let inputBox = document.getElementById('dynamic-input');
            if (inputBox) inputBox.remove();

            inputBox = document.createElement('input');
            inputBox.type = 'text';
            inputBox.id = 'dynamic-input';
            inputBox.autocomplete = "off";
            inputBox.required = true;

            if (this.id === "student") {
                inputBox.placeholder = "Enter student number";
            } else if (this.id === "instructor") {
                inputBox.placeholder = "Enter the code";
            }

            dynamicInputDiv.innerHTML = "";
            dynamicInputDiv.appendChild(inputBox);

            if (!document.getElementById('dynamic-input-container')) {
                selectOptionDiv.insertAdjacentElement('afterend', dynamicInputDiv);
            }
        });
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputs = document.querySelectorAll('.inner-box-form input');
        const email = inputs[0].value.trim().toLowerCase();
        const password = inputs[1].value.trim();
        const confirmPassword = inputs[2].value.trim();
        const role = document.getElementById('instructor').checked ? 'instructor' :
                     document.getElementById('student').checked ? 'student' : '';
        const code = document.getElementById('dynamic-input')?.value.trim() || '';
        const studentNumber = role === 'student' ? code : '';

        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (role === 'student') {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const exists = users.some(user => user.studentNumber === studentNumber);
            if (exists) {
                alert('Student number already in use!');
                return;
            }
        }

        if (role === 'instructor' && code !== 'TeacherUse') {
            alert('Incorrect code!');
            return;
        }

        hashPassword(password).then(hashedPassword => {
            const newUser = {
                email,
                password: hashedPassword,
                role,
                studentNumber: studentNumber || null
            };

            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful!');
            form.reset();
            dynamicInputDiv.innerHTML = '';
        });
    });

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
});
