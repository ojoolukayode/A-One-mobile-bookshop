document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Check credentials
    if (username === 'admin' && password === 'admin123') {
        // Save login state
        localStorage.setItem('isAdminLoggedIn', 'true');
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error
        errorMessage.textContent = 'Invalid credentials. Use admin / admin123';
        errorMessage.style.display = 'block';
    }
});

// Check if already logged in
window.addEventListener('load', function() {
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
});
