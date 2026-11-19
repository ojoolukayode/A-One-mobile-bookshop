// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'signin.html';
}

// Display user information
document.getElementById('userName').textContent = currentUser.fullName.split(' ')[0];
document.getElementById('accountName').textContent = currentUser.fullName;
document.getElementById('accountEmail').textContent = currentUser.email;
document.getElementById('accountJoinDate').textContent = currentUser.joinDate;

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Load and display featured books
function loadFeaturedBooks() {
    const inventory = JSON.parse(localStorage.getItem('siteInventory') || '[]');
    const featuredBooks = document.getElementById('featuredBooks');
    
    if (inventory.length === 0) {
        featuredBooks.innerHTML = '<p class="empty-message">No books available yet.</p>';
        return;
    }

    // Show first 6 books
    const booksToShow = inventory.slice(0, 6);
    
    featuredBooks.innerHTML = booksToShow.map(item => `
        <div class="featured-book-card">
            <img src="${item.image}" alt="${item.name}" class="featured-book-image">
            <div class="featured-book-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
        </div>
    `).join('');
}

// Load books when page loads
loadFeaturedBooks();
