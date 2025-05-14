document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector('form'); // Adjusted selector
    const passwordInput = document.getElementById('login-password');
    const togglePasswordButton = document.getElementById('toggle-password-visibility');
    const eyeIcon = document.getElementById('eye-icon');

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function () {
        const isPasswordVisible = passwordInput.type === 'text';
        passwordInput.type = isPasswordVisible ? 'password' : 'text';
        eyeIcon.src = isPasswordVisible ? 'image/eye.svg' : 'image/eye-off.svg';
        eyeIcon.alt = isPasswordVisible ? 'Show Password' : 'Hide Password';
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById('login-email').value.trim().toLowerCase();
        const loginPassword = passwordInput.value.trim();

        if (!loginEmail || !loginPassword) {
            alert('Please enter both email and password!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === loginEmail);

        if (!user) {
            alert('User not found!');
            return;
        }

        hashPassword(loginPassword).then(hashedLoginPassword => {
            if (user.password === hashedLoginPassword) {
                // Store the logged-in user in localStorage with email, role, and studentNumber
                const loggedInUser = {
                    email: user.email,
                    role: user.role,
                    studentNumber: user.studentNumber || null
                };
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // Redirect based on role
                if (user.role === 'instructor') {
                    window.location.href = 'teacher-portal.html';
                } else if (user.role === 'student') {
                    window.location.href = 'student-portal.html';
                } else {
                    alert('Unknown user role!');
                }
            } else {
                alert('Incorrect password!');
            }
        }).catch(err => {
            console.error('Error hashing password:', err);
            alert('An error occurred during login.');
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
