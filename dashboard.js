// Check if logged in
if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    window.location.href = 'admin.html';
}

let inventory = JSON.parse(localStorage.getItem('siteInventory') || '[]');
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
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    
    if (!name || !price || !imagePreview) {
        alert('Please fill all fields and upload an image.');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        name: name,
        price: price,
        image: imagePreview
    };
    
    inventory.push(newItem);
    localStorage.setItem('siteInventory', JSON.stringify(inventory));
    
    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    imagePreview = '';
    
    // Reload inventory display
    loadInventory();
    
    alert('Product added successfully!');
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin.html';
});

// Delete product function
function deleteProduct(productId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    // Remove from inventory array
    inventory = inventory.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('siteInventory', JSON.stringify(inventory));
    
    // Reload inventory display
    loadInventory();
    
    alert('Product deleted successfully!');
}

// Load and display inventory
function loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    const inventoryCount = document.getElementById('inventoryCount');
    
    inventoryCount.textContent = inventory.length;
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = '<p class="empty-message">No items added yet.</p>';
        return;
    }
    
    inventoryList.innerHTML = inventory.map(item => `
        <div class="inventory-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="inventory-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${item.id})" title="Delete this product">
                🗑️ Delete
            </button>
        </div>
    `).join('');
}
