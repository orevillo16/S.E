document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector('form'); // Adjusted selector

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const loginEmail = document.getElementById('login-email').value.trim().toLowerCase();
        const loginPassword = document.getElementById('login-password').value.trim();

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
                // Store the logged-in user in localStorage
                localStorage.setItem('loggedInUser', loginEmail);

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
