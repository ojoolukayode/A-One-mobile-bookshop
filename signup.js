document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match. Please try again.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        errorMessage.textContent = 'An account with this email already exists. Please sign in instead.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        password: password,
        joinDate: new Date().toLocaleDateString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Show success message
    successMessage.textContent = 'Account created successfully! Redirecting to sign in...';
    successMessage.style.display = 'block';
    
    // Redirect to sign in after 2 seconds
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 2000);
});
