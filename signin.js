document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    
    // Get registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        errorMessage.textContent = 'Invalid email or password. Please try again.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to account page
    window.location.href = 'account.html';
});

// Check if already signed in
window.addEventListener('load', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'account.html';
    }
});
