document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const togglePasswordButtons = document.querySelectorAll('.password-toggle');
    const form = document.querySelector('form');
    const selectOptionDiv = document.querySelector('.select-option');
    const dynamicInputDiv = document.createElement('div');
    dynamicInputDiv.id = 'dynamic-input-container';
    dynamicInputDiv.className = 'inner-box-form';

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Find the closest container and the input field within it
            const container = this.closest('.container');
            const input = container.querySelector('input[type="password"], input[type="text"]');
            const eyeIcon = this.querySelector('img');

            // Toggle the input type between 'password' and 'text'
            const isPasswordVisible = input.type === 'text';
            input.type = isPasswordVisible ? 'password' : 'text';

            // Update the eye icon
            eyeIcon.src = isPasswordVisible ? 'image/eye.svg' : 'image/eye-off.svg';
            eyeIcon.alt = isPasswordVisible ? 'Show Password' : 'Hide Password';
        });
    });

    // Handle dynamic input based on role selection
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

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = form.querySelector('input[type="text"]').value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const role = document.getElementById('instructor').checked ? 'instructor' :
                     document.getElementById('student').checked ? 'student' : '';
        const code = document.getElementById('dynamic-input')?.value.trim() || '';
        const studentNumber = role === 'student' ? code : '';

        if (!email || !password || !confirmPassword || !role) {
            alert('Please fill in all required fields!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!code) {
            alert(role === 'student' ? 'Student number is required!' : 'Instructor code is required!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check for duplicate email
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            alert('Email is already registered!');
            return;
        }

        // Check for duplicate student number (only for students)
        if (role === 'student') {
            const studentNumberExists = users.some(user => user.studentNumber === studentNumber);
            if (studentNumberExists) {
                alert('Student number already in use!');
                return;
            }
        }

        // Validate instructor code
        const INSTRUCTOR_CODE = 'TeacherUse';
        if (role === 'instructor' && code !== INSTRUCTOR_CODE) {
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

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Save the logged-in user with email, role, and studentNumber
            const loggedInUser = {
                email,
                role,
                studentNumber: studentNumber || null
            };
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            alert('Registration successful!');
            form.reset();
            document.querySelectorAll('.select-option input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            dynamicInputDiv.innerHTML = '';

            // Redirect to login.html
            window.location.href = 'login.html';
        }).catch(err => {
            console.error('Error during registration:', err);
            alert('An error occurred during registration. Please try again.');
        });
    });

    async function hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Error hashing password:', error);
            throw new Error('Password hashing failed!');
        }
    }
});
