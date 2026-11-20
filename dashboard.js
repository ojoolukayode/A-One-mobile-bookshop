// Check if logged in
if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    window.location.href = 'admin.html';
}

// Supabase configuration (REPLACE WITH YOUR ACTUAL CREDENTIALS)
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_KEY_HERE';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let imagePreview = '';

// Load inventory on page load
window.addEventListener('load', loadInventory);

// Handle image upload
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 5MB for base64)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image is too large. Please use an image smaller than 5MB.');
            return;
        }
        
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
    
    console.log('Attempting to insert book:', { name, price });
    
    // Insert book into Supabase
    const { data, error } = await supabaseClient
        .from('books')
        .insert([
            { name: name, price: price, image: imagePreview }
        ])
        .select();
    
    if (error) {
        console.error('Error inserting book:', error);
        alert('Error adding book: ' + error.message);
        return;
    }
    
    console.log('Book inserted successfully:', data);
    
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
    
    console.log('Attempting to delete book with ID:', productId);
    
    const { error } = await supabaseClient
        .from('books')
        .delete()
        .eq('id', productId);
    
    if (error) {
        console.error('Error deleting book:', error);
        alert('Error removing book: ' + error.message);
        return;
    }
    
    console.log('Book deleted successfully');
    alert('Book removed successfully!');
    loadInventory();
}

// Load and display inventory
async function loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    const inventoryCount = document.getElementById('inventoryCount');
    
    console.log('Loading inventory from Supabase...');
    
    const { data: books, error } = await supabaseClient
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error loading books:', error);
        inventoryList.innerHTML = '<p class="empty-message">Error loading books: ' + error.message + '</p>';
        return;
    }
    
    console.log('Books loaded:', books);
    
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
