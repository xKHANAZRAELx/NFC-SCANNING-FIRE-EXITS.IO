// Your Google Apps Script Web App URL
const adminScriptURL = 'https://script.google.com/macros/s/AKfycbygv9lpr5SV8mNUG0Vbd4GHx3Mbzjlgp8lm-npPZTkJ/exec';

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    // Send login data to Google Apps Script for validation
    fetch(adminScriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('loginStatus').innerText = 'Login successful! Redirecting...';
            // Redirect to admin dashboard (if implemented)
            window.location.href = 'admin-dashboard.html';
        } else {
            document.getElementById('loginStatus').innerText = 'Login failed. Please try again.';
        }
    })
    .catch(error => {
        document.getElementById('loginStatus').innerText = 'Error: ' + error.message;
    });
});
