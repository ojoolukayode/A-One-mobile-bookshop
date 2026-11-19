// Check if logged in
if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    window.location.href = 'admin.html';
}

// Supabase configuration (REPLACE THE VALUES BELOW WITH YOUR ACTUAL CREDENTIALS)
const SUPABASE_URL = 'https://ecgtetaqpyvpjekkoihk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZ3RldGFxcHl2cGpla2tvaWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMDIzMDQsImV4cCI6MjExMDY3ODMwNH0.XkVrPYYpk4cWgqYCyNGdCMjP3CTSARyg-x7dTyxkkug';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let imagePreview = '';

// Load inventory on page load
window.addEventListener('load', loadInventory);

// Handle image upload
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            imagePreview = reader.result;
            const previewDiv = document.getElementById('imagePreview');
            previewDiv.innerHTML = `<img src="${imagePreview}" alt="Preview">`;
            previewDiv.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    
    if (!name || !price || !imagePreview) {
        alert('Please fill all fields and upload a book cover image.');
        return;
    }
    
    // Insert book into Supabase
    const { data, error } = await supabase
        .from('books')
        .insert([
            { name: name, price: price, image: imagePreview }
        ]);
    
    if (error) {
        alert('Error adding book: ' + error.message);
        return;
    }
    
    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    imagePreview = '';
    
    alert('Book added successfully!');
    loadInventory();
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin.html';
});

// Delete product function
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to remove this book from inventory? This action cannot be undone.')) {
        return;
    }
    
    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', productId);
    
    if (error) {
        alert('Error removing book: ' + error.message);
        return;
    }
    
    alert('Book removed successfully!');
    loadInventory();
}

// Load and display inventory
async function loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    const inventoryCount = document.getElementById('inventoryCount');
    
    const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        inventoryList.innerHTML = '<p class="empty-message">Error loading books.</p>';
        return;
    }
    
    inventoryCount.textContent = books.length;
    
    if (books.length === 0) {
        inventoryList.innerHTML = '<p class="empty-message">No books added yet.</p>';
        return;
    }
    
    inventoryList.innerHTML = books.map(item => `
        <div class="inventory-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="inventory-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${item.id})" title="Remove this book">
                🗑️ Remove
            </button>
        </div>
    `).join('');
}
