// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'signin.html';
}

// Supabase configuration (REPLACE WITH YOUR ACTUAL CREDENTIALS)
const SUPABASE_URL = 'https://ecgtetaqpyvpjekkoihk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZ3RldGFxcHl2cGpla2tvaWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMDIzMDQsImV4cCI6MjExMDY3ODMwNH0.XkVrPYYpk4cWgqYCyNGdCMjP3CTSARyg-x7dTyxkkug';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// Load and display featured books from Supabase
async function loadFeaturedBooks() {
    const featuredBooks = document.getElementById('featuredBooks');
    
    const { data: books, error } = await supabaseClient
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
    
    if (error) {
        featuredBooks.innerHTML = '<p class="empty-message">Error loading books.</p>';
        return;
    }
    
    if (books.length === 0) {
        featuredBooks.innerHTML = '<p class="empty-message">No books available yet.</p>';
        return;
    }
    
    featuredBooks.innerHTML = books.map(item => `
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
